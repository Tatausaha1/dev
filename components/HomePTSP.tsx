
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService.ts';

interface HomePTSPProps {
  onStartLayanan: () => void;
  onTrackLayanan: () => void;
}

export const HomePTSP: React.FC<HomePTSPProps> = ({ onStartLayanan, onTrackLayanan }) => {
  const [summary, setSummary] = useState({ reports: 158, participants: 36, activeNodes: 4 });

  useEffect(() => {
    const fetchPublicData = async () => {
      const res = await apiService.getPublicSummary();
      if (res.success && res.data) {
        setSummary({
          reports: res.data.reports || 158,
          participants: res.data.participants || 36,
          activeNodes: res.data.activeNodes || 4
        });
      }
    };
    fetchPublicData();
  }, []);

  return (
    <div id="hero-ptsp" className="relative pt-16 md:pt-32 pb-10 md:pb-24 min-h-[85vh] md:min-h-[90vh] flex flex-col items-center overflow-hidden">
      <div className="absolute top-0 right-0 w-[40rem] md:w-[70rem] h-[40rem] md:h-[70rem] bg-blue-600/5 rounded-full blur-[120px] md:blur-[180px] -z-10 animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto px-5 md:px-8 w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20 items-center">
          
          {/* SISI KIRI: KONTEN UTAMA */}
          <div className="lg:col-span-7 space-y-6 md:space-y-10 animate-in text-center lg:text-left">
            <div className="space-y-4 md:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 mx-auto lg:mx-0">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Sistem Portal IMAM V6.1</span>
              </div>
              
              <h1 className="text-5xl sm:text-7xl md:text-[8rem] font-[1000] text-slate-950 tracking-[-0.05em] leading-[0.9] italic uppercase">
                IMAM V6.1 <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-emerald-600 not-italic">Portal Layanan.</span>
              </h1>
              
              <div className="space-y-4">
                <p className="text-base md:text-2xl text-slate-900 font-[1000] uppercase italic tracking-tight leading-none">
                  Ekosistem Digital Manajemen Madrasah
                </p>
                <p className="text-sm md:text-lg text-slate-500 font-bold max-w-xl mx-auto lg:mx-0 leading-relaxed uppercase tracking-widest">
                  Platform terintegrasi untuk mengelola layanan administrasi secara cepat, aman, dan transparan.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-6 pt-4">
              <button 
                onClick={onStartLayanan}
                className="px-8 py-5 md:px-12 md:py-7 bg-slate-950 text-white rounded-[1.8rem] text-[11px] md:text-[13px] font-black uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-4 group active:scale-95 italic"
              >
                Masuk Aplikasi <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-2 transition-transform"></i>
              </button>
              <button 
                onClick={onTrackLayanan}
                className="px-8 py-5 md:px-12 md:py-7 bg-white/80 backdrop-blur-2xl border-2 border-slate-100 text-slate-950 rounded-[1.8rem] text-[11px] md:text-[13px] font-black uppercase tracking-widest hover:border-blue-600 transition-all text-center shadow-xl active:scale-95 italic"
              >
                Akses Digitalisasi
              </button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 opacity-50">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Modern • Terintegrasi • Akuntabel</p>
            </div>
          </div>

          {/* SISI KANAN: DESKRIPSI & STATS */}
          <div className="hidden lg:block lg:col-span-5 relative">
             <div className="bg-white/40 backdrop-blur-[100px] p-10 md:p-12 rounded-[5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-white/80 relative overflow-hidden group transition-all duration-1000 hover:scale-[1.02]">
                
                <div className="relative z-10 space-y-8">
                   <div className="flex items-center justify-between">
                      <div className="w-14 h-14 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-all">
                         <i className="fas fa-microchip text-xl"></i>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Status Jaringan</p>
                         <p className="text-[11px] font-black text-emerald-600 uppercase italic mt-1">Sinkronisasi Cloud Aktif</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-2xl font-[1000] text-slate-950 uppercase italic tracking-tighter leading-none border-l-4 border-blue-600 pl-4">Visi Digital.</h4>
                      <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-wide">
                        IMAM V6.1 dirancang untuk mendukung transformasi digital sekolah melalui sistem yang efisien, berbasis data, dan terpusat untuk seluruh civitas akademika.
                      </p>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/50 p-5 rounded-[2rem] border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                         <p className="text-3xl font-black text-blue-600 leading-none tracking-tighter">{summary.reports}+</p>
                         <p className="text-[8px] font-black text-slate-400 uppercase mt-2 tracking-widest leading-none">Arsip Digital Terenkripsi</p>
                      </div>
                      <div className="bg-white/50 p-5 rounded-[2rem] border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                         <p className="text-3xl font-black text-emerald-600 leading-none tracking-tighter">{summary.participants}</p>
                         <p className="text-[8px] font-black text-slate-400 uppercase mt-2 tracking-widest leading-none">Akses Node Terdaftar</p>
                      </div>
                   </div>
                   
                   <div className="pt-6 border-t border-slate-100">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] text-center italic">Satu Platform Untuk Semua Layanan Madrasah</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
