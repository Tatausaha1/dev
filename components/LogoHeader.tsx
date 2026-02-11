
import React, { useState, useEffect } from 'react';
import { LOGOS } from '../constants.ts';
import { apiService } from '../services/apiService.ts';

interface LogoHeaderProps {
  dynamicLogos?: any[];
  currentUser: any | null;
  onAuthClick: () => void;
  onLogout: () => void;
  onMenuOpen: () => void;
  activeView?: string;
  onBackToHome?: () => void;
}

export const LogoHeader: React.FC<LogoHeaderProps> = ({ 
  dynamicLogos = [], 
  currentUser, 
  onAuthClick, 
  onLogout, 
  onMenuOpen,
  activeView = 'madrasah',
  onBackToHome
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

  const defaultLogos = [
    { url: LOGOS.IMAM, name: 'IMAM' },
    { url: LOGOS.KEMENAG, name: 'Kemenag' },
    { url: LOGOS.MAN1HST, name: 'MAN 1 HST' }
  ];

  const logosToDisplay = dynamicLogos.length > 0 ? dynamicLogos : defaultLogos;
  const isHome = activeView === 'madrasah';

  return (
    <div className="w-full bg-white/95 backdrop-blur-[40px] border-b border-slate-100 py-3 md:py-4 fixed top-0 left-0 right-0 z-[130] shadow-sm transition-all duration-300 font-['Plus_Jakarta_Sans']">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-3">
        
        <div className="flex items-center gap-3 md:gap-7 min-w-0 flex-1 group">
          {!isHome && onBackToHome && (
            <button 
              onClick={onBackToHome}
              className="md:hidden w-10 h-10 bg-slate-100 text-slate-950 rounded-xl flex items-center justify-center shrink-0 active:scale-90 transition-transform"
            >
              <i className="fas fa-arrow-left text-xs"></i>
            </button>
          )}

          <div className={`flex items-center gap-1.5 md:gap-3.5 flex-shrink-0 ${!isHome ? 'hidden sm:flex' : 'flex'}`}>
            {logosToDisplay.map((logo, idx) => (
              <img 
                key={idx} 
                src={logo.url} 
                className={`h-8 md:h-12 w-auto object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-sm ${idx === 1 ? 'scale-110' : ''} ${idx === 0 ? 'rounded-lg' : ''}`} 
                alt={logo.name} 
              />
            ))}
          </div>
          
          <div className="h-10 md:h-14 w-[1.5px] bg-slate-200 shrink-0 opacity-60"></div>
          
          <div className="flex flex-col justify-center min-w-0 space-y-0.5 overflow-hidden">
            <div className="flex items-center gap-2">
              <p className="text-[7px] md:text-[11px] font-[900] text-slate-400 uppercase tracking-[0.1em] md:tracking-[0.25em] leading-none whitespace-nowrap">
                Kementerian Agama
              </p>
              {netStatus.healthy && (
                <span className="hidden sm:inline-block w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
              )}
            </div>
            <p className="text-[7px] md:text-[11px] font-[900] text-slate-400 uppercase tracking-[0.1em] md:tracking-[0.25em] leading-none whitespace-nowrap">
              Kabupaten Hulu Sungai Tengah
            </p>
            <p className="text-[7px] md:text-[11px] font-[900] text-slate-950 uppercase tracking-[0.1em] md:tracking-[0.25em] leading-none italic whitespace-nowrap">
              MAN 1 Hulu Sungai Tengah
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-5 flex-shrink-0">
          {currentUser && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl border border-blue-100 transition-all animate-in fade-in">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter italic whitespace-nowrap">Terotentikasi</span>
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
            <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest hidden sm:block italic whitespace-nowrap">Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
