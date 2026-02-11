
import React, { useState, useRef, useEffect } from 'react';
import { connectLiveReceptionist } from '../services/geminiService';
import { LiveServerMessage } from '@google/genai';

interface LiveReceptionistProps {
  isActive: boolean;
  onClose: () => void;
}

const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
};

const encodePCM = (data: Float32Array): string => {
  const int16 = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) {
    int16[i] = Math.max(-1, Math.min(1, data[i])) * 32767;
  }
  let binary = '';
  const bytes = new Uint8Array(int16.buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const LiveReceptionist: React.FC<LiveReceptionistProps> = ({ isActive, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'ready' | 'listening' | 'processing' | 'speaking'>('idle');
  const [isHolding, setIsHolding] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const audioContextRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isHoldingRef = useRef(false);

  const capabilities = [
    { label: "Prosedur PTSP", icon: "fa-file-signature" },
    { label: "Jadwal Operasional", icon: "fa-clock" },
    { label: "Lomba Desain 2026", icon: "fa-palette" },
    { label: "Kontak Layanan", icon: "fa-headset" }
  ];

  const stopLive = () => {
    setStatus('idle');
    setIsHolding(false);
    isHoldingRef.current = false;
    if (sessionRef.current) sessionRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    onClose();
  };

  const startLive = async () => {
    try {
      setStatus('connecting');
      if (!audioContextRef.current) {
        audioContextRef.current = {
          input: new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 }),
          output: new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 })
        };
      }

      const { input: inCtx, output: outCtx } = audioContextRef.current;
      await inCtx.resume();
      await outCtx.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = connectLiveReceptionist({
        onopen: () => {
          setStatus('ready');
          const source = inCtx.createMediaStreamSource(stream);
          // Mengurangi buffer size ke 2048 untuk latensi lebih rendah (~128ms)
          const processor = inCtx.createScriptProcessor(2048, 1, 1);
          
          processor.onaudioprocess = (e) => {
            if (isHoldingRef.current) {
                const inputData = e.inputBuffer.getChannelData(0);
                const base64PCM = encodePCM(inputData);
                sessionPromise.then(session => {
                  session.sendRealtimeInput({ 
                    media: { data: base64PCM, mimeType: 'audio/pcm;rate=16000' } 
                  });
                });
            }
          };

          source.connect(processor);
          processor.connect(inCtx.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          
          if (audioData) {
            setStatus('speaking');
            const bytes = decodeBase64(audioData);
            const buffer = await decodeAudioData(bytes, outCtx, 24000);
            
            const source = outCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(outCtx.destination);
            
            const startTime = Math.max(nextStartTimeRef.current, outCtx.currentTime);
            source.start(startTime);
            nextStartTimeRef.current = startTime + buffer.duration;
            
            sourcesRef.current.add(source);
            source.onended = () => {
              sourcesRef.current.delete(source);
              if (sourcesRef.current.size === 0) setStatus('ready');
            };
          }

          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
            setStatus('ready');
          }
        },
        onerror: (e: any) => {
          console.error("Live Error:", e);
          stopLive();
        },
        onclose: () => stopLive()
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Gagal memulai Live:", err);
      stopLive();
    }
  };

  useEffect(() => {
    if (isActive) startLive();
    else stopLive();
  }, [isActive]);

  const handleStartInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (status === 'speaking' || status === 'processing') {
        sourcesRef.current.forEach(s => s.stop());
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;
    }
    setIsHolding(true);
    isHoldingRef.current = true;
    setStatus('listening');
  };

  const handleEndInteraction = () => {
    if (!isHoldingRef.current) return;
    setIsHolding(false);
    isHoldingRef.current = false;
    // Status processing memberikan feedback visual instan selagi menunggu stream audio balasan
    setStatus('processing');
  };

  if (!isActive) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[260] w-80 bg-slate-950/98 backdrop-blur-3xl p-6 rounded-[3rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-5">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white transition-all duration-300 ${
                    status === 'speaking' ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.6)]' : 
                    status === 'listening' ? 'bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.6)]' : 
                    status === 'processing' ? 'bg-amber-600 animate-pulse' : 'bg-slate-800'
                    }`}>
                    <i className={`fas ${status === 'speaking' ? 'fa-waveform-lines' : status === 'listening' ? 'fa-microphone' : status === 'processing' ? 'fa-bolt animate-bounce' : 'fa-microphone-slash'} text-sm`}></i>
                </div>
                <div>
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest leading-none">AI Respon Cepat</p>
                    <p className="text-[10px] font-bold text-white capitalize mt-1 italic opacity-70">
                        {status === 'connecting' ? 'Sinkronisasi...' : 
                         status === 'ready' ? 'Siap Melayani' : 
                         status === 'listening' ? 'Mendengar...' : 
                         status === 'processing' ? 'Memproses...' : 'Menjawab...'}
                    </p>
                </div>
            </div>
            <button onClick={() => setShowInfo(!showInfo)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${showInfo ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500 hover:text-white'}`}>
                <i className="fas fa-info-circle text-xs"></i>
            </button>
        </div>
        
        {showInfo ? (
            <div className="space-y-3 py-2 animate-in zoom-in-95 duration-300">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Keahlian AI:</p>
                <div className="grid grid-cols-1 gap-2">
                    {capabilities.map((cap, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                            <i className={`fas ${cap.icon} text-blue-500 text-[10px]`}></i>
                            <span className="text-[10px] font-bold text-slate-300">{cap.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center py-2">
                {/* Gelombang Audio Responsif */}
                <div className="flex justify-center gap-1.5 h-10 items-center mb-6">
                {[...Array(12)].map((_, i) => (
                    <div 
                    key={i} 
                    className={`w-1.5 rounded-full transition-all duration-150 ${
                        status === 'speaking' || status === 'listening' ? '' : 'h-1.5 opacity-20'
                    }`}
                    style={{ 
                        height: (status === 'speaking' || status === 'listening') ? `${Math.random() * 30 + 5}px` : '4px',
                        backgroundColor: status === 'listening' ? '#10b981' : (status === 'speaking' ? '#3b82f6' : '#475569')
                    }}
                    ></div>
                ))}
                </div>
                
                <div className="w-full">
                    <button 
                        onMouseDown={handleStartInteraction}
                        onMouseUp={handleEndInteraction}
                        onMouseLeave={handleEndInteraction}
                        onTouchStart={handleStartInteraction}
                        onTouchEnd={handleEndInteraction}
                        className={`w-full py-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all duration-300 active:scale-90 select-none ${
                            isHolding 
                            ? 'bg-emerald-600 text-white shadow-[0_20px_40px_-10px_rgba(16,185,129,0.5)]' 
                            : status === 'processing' 
                            ? 'bg-slate-900 text-amber-500 border border-amber-500/30'
                            : 'bg-white text-slate-950 shadow-xl'
                        }`}
                    >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${isHolding ? 'border-white animate-pulse' : 'border-slate-100'}`}>
                            <i className={`fas ${isHolding ? 'fa-bolt' : status === 'processing' ? 'fa-sync fa-spin' : 'fa-microphone'} text-2xl`}></i>
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">
                            {isHolding ? 'Lepas: Kirim' : status === 'processing' ? 'Menunggu AI...' : 'Tahan: Bicara'}
                        </span>
                    </button>
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <span className="w-1 h-1 bg-blue-500 rounded-full animate-ping"></span>
                        <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Tautan Neural Kecepatan Tinggi Aktif</p>
                    </div>
                </div>
            </div>
        )}

        <div className="flex gap-2">
            <button 
                onClick={stopLive}
                className="flex-1 py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-[1.2rem] text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 border border-red-600/20"
            >
                Tutup
            </button>
            {showInfo && (
                <button 
                    onClick={() => setShowInfo(false)}
                    className="px-6 py-4 bg-white text-slate-950 rounded-[1.2rem] text-[9px] font-black uppercase tracking-widest transition-all active:scale-95"
                >
                    Ok
                </button>
            )}
        </div>
    </div>
  );
};
