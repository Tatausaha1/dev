
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from '../services/apiService.ts';

export const NewsTicker: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query Firestore without orderBy to avoid Composite Index requirement
    const q = query(
      collection(db, "informasi"),
      where("aktif", "==", true)
    );

    const unsub = onSnapshot(q, (sn) => {
      // Manual sorting on client side based on priority
      const sortedDocs = sn.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as any).sort((a, b) => (a.prioritas || 0) - (b.prioritas || 0));

      const texts = sortedDocs.map(item => item.teks).filter(Boolean);
      setMessages(texts);
      setLoading(false);
    }, (err) => {
      console.error("Ticker Error:", err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading || messages.length === 0) return null;

  // Calculate duration: More messages = longer duration
  const duration = Math.max(15, messages.length * 12);

  return (
    <div className="w-full py-1 relative z-[120] overflow-hidden group bg-transparent">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-5 md:h-6">
        {/* Label Indicator - Synchronized with Branding */}
        <div className="flex-shrink-0 bg-gradient-to-br from-blue-600 to-emerald-600 text-white w-4 h-4 md:w-5 md:h-5 rounded shadow-[0_0_15px_rgba(37,99,235,0.4)] z-10 flex items-center justify-center border border-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent animate-scan-diagonal"></div>
          <i className="fas fa-bullhorn text-[7px] md:text-[9px] animate-pulse"></i>
        </div>

        {/* Ticker Container - Matching Portal Layanan Gradient with Full Transparency */}
        <div className="flex-1 overflow-hidden relative ml-3">
          <div 
            className="animate-marquee-neon whitespace-nowrap flex items-center gap-12"
            style={{ animationDuration: `${duration}s` }}
          >
            {/* Duplicate messages for smooth infinite loop */}
            {[...messages, ...messages].map((msg, i) => (
              <span key={i} className="neon-text-portal text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] italic flex items-center gap-4 leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-600 drop-shadow-[0_2px_4px_rgba(37,99,235,0.2)]">
                {msg}
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 shadow-[0_0_10px_rgba(37,99,235,0.6)] animate-pulse"></div>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee-neon {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scan-diagonal {
          0% { transform: translate(-100%, -100%); }
          100% { transform: translate(100%, 100%); }
        }
        @keyframes blink-portal {
          0%, 100% { opacity: 1; filter: brightness(1); }
          50% { opacity: 0.8; filter: brightness(1.2); }
        }
        .animate-marquee-neon {
          display: inline-flex;
          animation: marquee-neon linear infinite;
        }
        .animate-marquee-neon:hover {
          animation-play-state: paused;
        }
        .neon-text-portal {
          animation: blink-portal 3s infinite ease-in-out;
        }
        .animate-scan-diagonal {
          animation: scan-diagonal 2s linear infinite;
        }
      `}</style>
    </div>
  );
};
