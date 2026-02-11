
import React, { useState, useEffect } from 'react';
import { LOGOS } from './constants.ts';
import { apiService } from './services/apiService.ts';

interface LogoHeaderProps {
  dynamicLogos?: any[];
  currentUser: any | null;
  onAuthClick: () => void;
  onLogout: () => void;
  onMenuOpen: () => void;
}

export const LogoHeader: React.FC<LogoHeaderProps> = ({ 
  dynamicLogos = [], 
  currentUser, 
  onAuthClick, 
  onLogout, 
  onMenuOpen 
}) => {
  const [netStatus, setNetStatus] = useState({ healthy: true, latency: 0 });

  useEffect(() => {
    const check = async () => {
      const res = await apiService.checkDatabaseHealth();
      setNetStatus({ healthy: res.healthy, latency: res.latency || 0 });
    };
    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  // Konfigurasi Logo Resmi: MAN 1 HST -> KEMENAG (Tengah) -> IMAM
  const defaultLogos = [
    { url: LOGOS.MAN1HST, name: 'MAN 1 HST' },
    { url: LOGOS.KEMENAG, name: 'Kemenag' },
    { url: LOGOS.IMAM, name: 'IMAM' }
  ];

  const logosToDisplay = dynamicLogos.length > 0 ? dynamicLogos : defaultLogos;

  return (
    <div className="w-full bg-white/95 backdrop-blur-[40px] border-b border-slate-100 py-3 md:py-4 fixed top-0 left-0 right-0 z-[130] shadow-sm transition-all duration-300 font-['Plus_Jakarta_Sans']">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-3">
        
        {/* GRUP IDENTITAS (KIRI) */}
        <div className="flex items-center gap-3 md:gap-7 min-w-0 flex-1 group">
          {/* Container 3 Logo - Kemenag di Tengah */}
          <div className="flex items-center gap-1.5 md:gap-3.5 flex-shrink-0">
            {logosToDisplay.map((logo, idx) => (
              <img 
                key={idx} 
                src={logo.url} 
                className={`h-8 md:h-12 w-auto object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-sm ${idx === 1 ? 'scale-110' : ''} ${idx === 2 ? 'rounded-lg' : ''}`} 
                alt={logo.name} 
              />
            ))}
          </div>
          
          {/* Garis Pemisah Vertikal */}
          <div className="h-10 md:h-14 w-[1.5px] bg-slate-200 shrink-0 opacity-60"></div>
          
          {/* Teks Identitas Institusi */}
          <div className="flex flex-col justify-center min-w-0 space-y-0.5 md:space-y-1 overflow-hidden font-['Plus_Jakarta_Sans']">
            <div className="flex items-center gap-2">
              <p className="text-[7px] md:text-[11px] font-[900] text-slate-950 uppercase tracking-widest leading-none italic whitespace-nowrap">
                Kementerian Agama
              </p>
              {netStatus.healthy && (
                <span className="hidden sm:inline-block w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
              )}
            </div>
            <p className="text-[7px] md:text-[11px] font-[900] text-slate-950 uppercase tracking-widest leading-none italic whitespace-nowrap">
              Kabupaten Hulu Sungai Tengah
            </p>
            <p className="text-[7px] md:text-[11px] font-[900] text-slate-950 uppercase tracking-widest leading-none italic whitespace-nowrap">
              MAN 1 Hulu Sungai Tengah
            </p>
          </div>
        </div>

        {/* GRUP NAVIGASI (KANAN) */}
        <div className="flex items-center gap-2 md:gap-5 flex-shrink-0">
          {/* User Profile Indicator (Hanya muncul jika sudah login) */}
          {currentUser && (
            <div className="hidden lg:flex items-center gap-4 text-right">
               <div className="flex flex-col">
                  <p className="text-[10px] font-black text-slate-950 uppercase italic leading-none">{currentUser.nama.split(' ')[0]}</p>
                  <p className="text-[8px] font-bold text-blue-600 uppercase mt-1 tracking-wider">{currentUser.role}</p>
               </div>
               <div className="w-10 h-10 bg-slate-950 text-blue-400 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                  <i className="fas fa-user-shield text-xs"></i>
               </div>
            </div>
          )}

          <button 
            onClick={onMenuOpen} 
            className="flex items-center gap-2 md:gap-3 px-4 md:px-8 h-10 md:h-14 bg-slate-950 text-white rounded-[1.3rem] md:rounded-[2rem] hover:bg-blue-600 transition-all shadow-xl active:scale-90 border border-white/5 group"
          >
            <div className="flex flex-col gap-1 items-end">
              <span className="w-5 md:w-7 h-[2px] bg-white rounded-full group-hover:w-3 transition-all"></span>
              <span className="w-3 md:w-5 h-[2px] bg-white rounded-full opacity-60 group-hover:w-7 transition-all"></span>
            </div>
            <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest hidden sm:block italic">Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
