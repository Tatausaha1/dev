
import React, { useState, useRef, useEffect } from 'react';
import { getCreativeChat, generateAudioResponse } from '../services/geminiService';

interface AIChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string; audio?: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages, loading]);

  const playAudio = async (base64: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    await ctx.resume();
    
    setIsSpeaking(true);
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    
    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = () => setIsSpeaking(false);
    source.start();
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await getCreativeChat(userMsg);
      const audio = await generateAudioResponse(response.text);
      
      setMessages(prev => [...prev, { role: 'bot', text: response.text, audio }]);
      if (audio) playAudio(audio);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', text: "Maaf, terjadi gangguan pada koneksi neural AI kami. Silakan coba sesaat lagi." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[260] w-[90vw] max-w-[420px] bg-white rounded-[3rem] shadow-[0_50px_120px_-20px_rgba(0,0,0,0.4)] border border-slate-100 flex flex-col overflow-hidden animate-in h-[600px] max-h-[75vh]">
        <div className="p-6 bg-slate-950 text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 border border-blue-400/30">
                    <i className="fas fa-brain-circuit text-lg animate-pulse"></i>
                </div>
                <div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] leading-none">IMAM Brain AI</h4>
                <p className="text-[9px] text-blue-400 font-bold uppercase mt-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    Neural Core Online
                </p>
                </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-red-600 transition-all border border-white/5 active:scale-90">
                <i className="fas fa-times"></i>
            </button>
        </div>

        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50 no-scrollbar">
            {messages.length === 0 && (
                <div className="text-center py-20 space-y-4 opacity-20 flex flex-col items-center">
                <i className="fas fa-microchip text-6xl"></i>
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">Waiting for Prompt...</p>
                </div>
            )}
            {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in`}>
                <div className={`max-w-[88%] p-4 rounded-3xl text-[13px] font-semibold leading-relaxed shadow-sm transition-all border ${
                    m.role === 'user' ? 
                    'bg-blue-600 text-white border-blue-400 rounded-br-none' : 
                    'bg-slate-950 text-white border-blue-500/20 rounded-bl-none shadow-blue-500/5'
                }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                         {m.role === 'bot' && <i className="fas fa-sparkles text-[10px] text-blue-400"></i>}
                         <span className={`text-[8px] font-black uppercase tracking-widest ${m.role === 'user' ? 'text-blue-100' : 'text-blue-400'}`}>
                           {m.role === 'user' ? 'Pertanyaan Anda' : 'Respon IMAM AI'}
                         </span>
                    </div>
                    <p className="tracking-tight">{m.text}</p>
                    {m.audio && m.role === 'bot' && (
                        <button 
                            onClick={() => playAudio(m.audio!)} 
                            className={`mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isSpeaking ? 'bg-blue-600 text-white animate-pulse' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
                        >
                            <i className={`fas ${isSpeaking ? 'fa-waveform-lines' : 'fa-volume-up'}`}></i>
                            {isSpeaking ? 'Speaking...' : 'Dengarkan'}
                        </button>
                    )}
                </div>
                </div>
            ))}
            {loading && (
                <div className="flex justify-start animate-in">
                    <div className="bg-slate-900 p-5 rounded-3xl border border-blue-500/20 rounded-bl-none flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 bg-blue-500/40 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-blue-500/80 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="p-5 bg-white border-t border-slate-100 flex gap-3 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
            <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Tanyakan Layanan atau Info Madrasah..." 
                className="flex-grow p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner"
            />
            <button 
                onClick={handleSend} 
                disabled={loading}
                className="w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-all hover:bg-blue-600 disabled:opacity-50"
            >
                <i className="fas fa-paper-plane text-sm"></i>
            </button>
        </div>
    </div>
  );
};
