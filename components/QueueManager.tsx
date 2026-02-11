
import React, { useState } from 'react';
import { generateAudioResponse } from '../services/geminiService';
import { VoiceName } from '../types';

interface QueueManagerProps {
  selectedVoice: VoiceName;
  onAnnounce: (text: string) => void;
}

export const QueueManager: React.FC<QueueManagerProps> = ({ selectedVoice, onAnnounce }) => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [isCalling, setIsCalling] = useState(false);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const callQueue = async (number: number) => {
    if (isCalling) return;
    setIsCalling(true);
    const text = `Nomor antrean, A, ${formatNumber(number)}. Silakan menuju loket satu.`;
    
    try {
      const audioData = await generateAudioResponse(text);
      if (audioData) {
        onAnnounce(text);
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const binary = atob(audioData);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (error) {
      console.error("Panggilan antrean gagal", error);
    } finally {
      setTimeout(() => setIsCalling(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-all">
         <i className="fas fa-tower-broadcast text-9xl text-lime-400"></i>
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
           <div className="w-2 h-2 bg-lime-400 rounded-full animate-ping"></div>
           <h3 className="text-[10px] font-black text-lime-400/70 uppercase tracking-[0.4em]">Pengelola Antrean Langsung</h3>
        </div>
        <button onClick={() => setCurrentNumber(0)} className="text-[9px] font-bold text-slate-600 hover:text-red-400 transition-colors uppercase italic tracking-widest">Atur Ulang</button>
      </div>

      <div className={`relative aspect-video bg-black/60 rounded-[2.5rem] border-2 transition-all duration-700 flex flex-col items-center justify-center overflow-hidden shadow-inner ${isCalling ? 'border-lime-400 shadow-[0_0_40px_rgba(163,230,53,0.2)]' : 'border-white/5'}`}>
        {/* Scanning Line Effect */}
        {isCalling && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-lime-400/20 to-transparent h-1/2 w-full animate-scan"></div>}
        
        <p className="text-[10px] font-black text-lime-400/40 uppercase tracking-[0.5em] mb-4 digital-font italic">Terminal Gerbang-01</p>
        <div className={`digital-font text-8xl md:text-9xl font-black tabular-nums transition-all duration-500 ${isCalling ? 'text-white scale-110 drop-shadow-[0_0_30px_#a3e635]' : 'text-lime-400'}`}>
          A-{formatNumber(currentNumber)}
        </div>
        
        {isCalling && (
          <div className="mt-8 flex gap-2">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="w-2 h-2 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8 relative z-10">
        <button
          onClick={() => { const n = currentNumber + 1; setCurrentNumber(n); callQueue(n); }}
          disabled={isCalling}
          className="group flex flex-col items-center justify-center p-8 bg-lime-400 rounded-3xl text-slate-950 transition-all active:scale-95 shadow-xl hover:bg-white disabled:opacity-50"
        >
          <i className="fas fa-volume-up text-2xl mb-2 transition-transform group-hover:scale-125"></i>
          <span className="text-[9px] font-black uppercase tracking-widest italic">Panggil Berikutnya</span>
        </button>
        <button
          onClick={() => callQueue(currentNumber)}
          disabled={isCalling || currentNumber === 0}
          className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 text-slate-400 rounded-3xl transition-all hover:bg-white hover:text-slate-950 hover:border-white active:scale-95 disabled:opacity-10"
        >
          <i className="fas fa-redo-alt text-xl mb-2"></i>
          <span className="text-[9px] font-black uppercase tracking-widest italic">Panggil Ulang</span>
        </button>
      </div>
    </div>
  );
};
