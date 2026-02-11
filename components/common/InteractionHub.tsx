import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue, push, serverTimestamp, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { rtdb } from '../../services/apiService.ts';
import { AIChatAssistant } from '../AIChatAssistant.tsx';
import { LiveReceptionist } from '../LiveReceptionist.tsx';
import { GoogleGenAI } from "@google/genai";

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const configs = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'fa-clock' },
    reviewed: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'fa-eye' },
    approved: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'fa-check-double' },
  };
  const config = configs[status as keyof typeof configs] || configs.pending;
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold ${config.bg} ${config.text} border border-current/10 shadow-sm`}>
      <i className={`fas ${config.icon}`}></i> {status}
    </div>
  );
};

export const FloatingInteractionHub: React.FC = () => {
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [activeService, setActiveService] = useState<'none' | 'ai_chat' | 'ai_voice' | 'admin_chat'>('none');
  
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const [inputText, setInputText] = useState('');
  const [userName, setUserName] = useState(localStorage.getItem('imam_user_name') || '');
  const [tempName, setTempName] = useState('');
  const [isAiReplying, setIsAiReplying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const presenceRef = ref(rtdb, 'presence/admin');
    return onValue(presenceRef, (snapshot) => {
      const data = snapshot.val();
      setIsAdminOnline(data?.status === 'online');
    });
  }, []);

  useEffect(() => {
    if (activeService === 'admin_chat' && userName) {
      const chatRef = ref(rtdb, 'chat_messages');
      return onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val }));
          setChatMessages(list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)));
        } else {
          setChatMessages([]);
        }
      });
    }
  }, [activeService, userName]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [chatMessages, activeService, isAiReplying]);

  const handleSetIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    setUserName(tempName);
    localStorage.setItem('imam_user_name', tempName);
  };

  const handleSendAdminChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !userName || isAiReplying) return;
    
    const userText = inputText;
    setInputText('');
    
    const chatRef = ref(rtdb, 'chat_messages');
    await push(chatRef, {
      text: userText,
      user: userName,
      isAdmin: false,
      timestamp: serverTimestamp()
    });

    setIsAiReplying(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userText,
        config: {
          systemInstruction: `Anda adalah IMAM (Integrated Madrasah Academic Management), asisten AI resmi MAN 1 Hulu Sungai Tengah. Tugas Anda adalah membantu peserta Kompetisi Desain ID Card & Lanyard 2026.
Instruksi Gaya: Jawablah dengan SANGAT SINGKAT (maksimal 2 kalimat), profesional, ramah. Jika ditanya hal umum, arahkan kembali ke topik madrasah.`,
        },
      });

      if (response.text) {
        await push(chatRef, {
          text: response.text,
          user: 'IMAM CORE AI',
          isAdmin: true,
          timestamp: serverTimestamp()
        });
      }
    } catch (err) {
      console.error("Gemini Error:", err);
    } finally {
      setIsAiReplying(false);
    }
  };

  const services = [
    {
      id: 'ai_chat',
      label: 'IMAM Brain (AI Chat)',
      icon: 'fa-wand-magic-sparkles',
      color: 'bg-slate-950 text-blue-400',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]',
      action: () => setActiveService('ai_chat')
    },
    {
      id: 'ai_voice',
      label: 'IMAM Live (Voice AI)',
      icon: 'fa-microphone-lines',
      color: 'bg-blue-600 text-white',
      ping: true,
      action: () => setActiveService('ai_voice')
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp Support',
      icon: 'fab fa-whatsapp',
      color: 'bg-emerald-500 text-white',
      action: () => window.open('https://wa.me/6285391706131', '_blank')
    },
    {
      id: 'admin_chat',
      label: 'Diskusi Terbuka',
      icon: 'fa-comment-dots',
      color: 'bg-slate-800 text-white',
      action: () => setActiveService('admin_chat')
    }
  ];

  return (
    <div className="fixed bottom-32 md:bottom-44 right-6 z-[250] flex flex-col items-end gap-3 transition-all duration-500">
      
      <AIChatAssistant isOpen={activeService === 'ai_chat'} onClose={() => setActiveService('none')} />
      <LiveReceptionist isActive={activeService === 'ai_voice'} onClose={() => setActiveService('none')} />

      {activeService === 'admin_chat' && (
        <div className="absolute bottom-20 right-0 w-[380px] max-w-[calc(100vw-3rem)] h-[580px] max-h-[80vh] bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] border border-slate-100 flex flex-col overflow-hidden animate-in">
          <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center relative shadow-lg shadow-blue-500/20">
                    <i className="fas fa-users-viewfinder"></i>
                    {isAdminOnline && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse"></span>
                    )}
                </div>
                <div>
                    <p className="text-[12px] font-black italic tracking-tight leading-none">Diskusi Komunitas</p>
                    <p className="text-[9px] font-bold text-blue-400 mt-1 italic">
                      {isAdminOnline ? 'Operator Online' : 'AI Moderation Active'}
                    </p>
                </div>
            </div>
            <button onClick={() => setActiveService('none')} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-red-600 transition-all"><i className="fas fa-times text-xs"></i></button>
          </div>

          {!userName ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-slate-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-inner"><i className="fas fa-user-tag text-3xl"></i></div>
              <div className="space-y-2">
                <h4 className="text-lg font-black italic tracking-tighter">Otentikasi Anonim</h4>
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed tracking-tight">Gunakan nama panggilan untuk bergabung dalam obrolan.</p>
              </div>
              <form onSubmit={handleSetIdentity} className="w-full space-y-3">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Nama Panggilan..." 
                  className="w-full bg-slate-100 border-2 border-slate-200 px-6 py-4 rounded-2xl text-[13px] font-bold outline-none focus:border-blue-600 transition-all shadow-inner"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                />
                <button type="submit" className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black text-sm tracking-tight hover:bg-blue-600 transition-all shadow-xl active:scale-95">Masuk Gateway</button>
              </form>
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 no-scrollbar">
                {chatMessages.length === 0 && (
                  <div className="text-center py-24 opacity-10 flex flex-col items-center gap-4">
                    <i className="fas fa-comments-alt text-6xl"></i>
                    <p className="text-[10px] font-bold italic">Memulai Log Percakapan...</p>
                  </div>
                )}
                {chatMessages.map((m, i) => {
                    const isAi = m.user.includes('AI');
                    const isOfficial = m.isAdmin === true;
                    return (
                    <div key={m.id || i} className={`flex flex-col ${isOfficial ? 'items-start' : 'items-end'} animate-in`}>
                        <div className={`max-w-[90%] p-4 rounded-3xl text-[12.5px] leading-relaxed font-semibold shadow-sm transition-all border ${
                          isAi ? 'bg-slate-950 text-white border-blue-500/30 rounded-tl-none shadow-blue-500/10' : 
                          isOfficial ? 'bg-blue-600 text-white border-blue-400 rounded-tl-none' : 
                          'bg-white text-slate-800 border-slate-100 rounded-tr-none'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                              {isAi && <i className="fas fa-wand-magic-sparkles text-[9px] text-blue-400"></i>}
                              <span className={`text-[9px] font-bold ${isOfficial ? 'text-blue-200' : 'text-blue-600'}`}>
                                {m.user}
                              </span>
                              {isOfficial && (
                                <div className="flex items-center gap-1 bg-white/20 px-1.5 py-0.5 rounded text-[7px] font-bold text-white shadow-sm">
                                  <i className="fas fa-shield-check"></i> OFFICIAL
                                </div>
                              )}
                          </div>
                          <p className="tracking-tight">{m.text}</p>
                        </div>
                        <p className="text-[8px] font-bold text-slate-300 mt-1.5 px-2 italic">
                          {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Menyinkronkan...'}
                        </p>
                    </div>
                    );
                })}
                {isAiReplying && (
                  <div className="flex flex-col items-start animate-pulse">
                    <div className="bg-slate-900 p-4 rounded-3xl border border-blue-500/20 rounded-tl-none flex items-center gap-3">
                      <i className="fas fa-sparkles text-blue-400 text-[10px] animate-spin"></i>
                      <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-blue-500/40 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-blue-500/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-1.5 h-1.5 bg-blue-500/80 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleSendAdminChat} className="p-4 border-t border-slate-100 bg-white">
                  <div className="relative flex items-center gap-3">
                      <input autoFocus type="text" placeholder={isAiReplying ? "Memproses..." : "Ketik pesan publik..."} disabled={isAiReplying} className="flex-1 bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl text-[13px] font-bold outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner disabled:opacity-50" value={inputText} onChange={e => setInputText(e.target.value)} />
                      <button type="submit" disabled={isAiReplying} className="w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50 active:scale-90"><i className="fas fa-paper-plane text-xs"></i></button>
                  </div>
              </form>
            </>
          )}
        </div>
      )}

      {isHubOpen && activeService === 'none' && (
        <div className="flex flex-col items-end gap-3 mb-4 animate-in fade-in slide-in-from-bottom-10">
          {services.map((s, i) => (
            <div key={s.id} className="flex items-center gap-4 group" style={{ transitionDelay: `${i * 50}ms` }}>
              <div className="bg-white px-4 py-2 rounded-xl shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap translate-x-2 group-hover:translate-x-0">
                <p className="text-[10px] font-bold text-slate-900">{s.label}</p>
              </div>
              <button 
                onClick={() => { s.action(); if(s.id !== 'whatsapp') setIsHubOpen(false); }}
                className={`w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${s.color} ${s.glow || ''}`}
              >
                <i className={`fas ${s.icon} text-lg`}></i>
              </button>
            </div>
          ))}
        </div>
      )}

      <button 
        onClick={() => { setIsHubOpen(!isHubOpen); if(activeService !== 'none') setActiveService('none'); }}
        className={`w-16 h-16 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-90 ${
          isHubOpen || activeService !== 'none' ? 'bg-red-600 text-white rotate-135 shadow-red-500/30' : 'bg-slate-950 text-white animate-float'
        }`}
      >
        <i className={`fas ${isHubOpen || activeService !== 'none' ? 'fa-plus' : 'fa-comments'} text-2xl`}></i>
      </button>
    </div>
  );
};
