
import React from 'react';
import { LOGOS } from '../constants.ts';

interface HeroProps {
  onScroll: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onScroll }) => (
  <header id="hero" className="relative pt-24 md:pt-64 pb-12 md:pb-48 min-h-[85vh] md:min-h-[100vh] flex items-center scroll-mt-24 md:scroll-mt-40 overflow-hidden">
    {/* Dynamic Ambient Glows */}
    <div className="absolute -top-20 -left-20 md:-top-32 md:-left-32 w-[20rem] md:w-[50rem] h-[20rem] md:h-[50rem] bg-blue-600/10 rounded-full blur-[100px] md:blur-[200px] -z-10 animate-pulse"></div>
    <div className="absolute top-1/2 -right-32 md:-right-48 w-[15rem] md:w-[40rem] h-[15rem] md:h-[40rem] bg-indigo-600/10 rounded-full blur-[90px] md:blur-[180px] -z-10"></div>
    
    <div className="max-w-7xl mx-auto px-5 md:px-8 w-full relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-24 items-center">
        
        {/* Textual Content */}
        <div className="lg:col-span-7 space-y-7 md:space-y-16 animate-in">
          
          {/* Status Capsule */}
          <div className="group inline-flex items-center gap-3 md:gap-5 px-4 md:px-7 py-2.5 md:py-4 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[1.2rem] md:rounded-[2rem] shadow-xl transition-all hover:bg-white/60 mx-auto sm:mx-0">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-full w-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)]"></span>
            </div>
            <span className="text-[9px] md:text-[13px] font-[1000] text-slate-950 uppercase tracking-[0.3em] md:tracking-[0.5em] italic leading-none text-nowrap">
              DESIGN COMPETITION 2026
            </span>
          </div>

          {/* Headline Stack */}
          <div className="space-y-4 md:space-y-8 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-4 md:gap-8">
               <div className="h-[3px] w-8 md:w-20 bg-gradient-to-r from-blue-700 via-indigo-500 to-transparent rounded-full"></div>
               <h2 className="text-blue-700 text-[10px] md:text-[18px] font-[1000] uppercase tracking-[0.3em] md:tracking-[0.7em] italic leading-none">
                 Kurikulum Cinta
               </h2>
            </div>
            
            <div className="relative">
              <h1 className="text-5xl sm:text-7xl md:text-[10rem] lg:text-[11rem] font-[1000] text-slate-950 tracking-[-0.05em] md:tracking-[-0.08em] leading-[0.95] md:leading-[0.75] italic uppercase">
                <span className="block mb-2 md:mb-[-0.08em] scale-y-110">The Future</span>
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-br from-blue-700 via-indigo-600 to-emerald-500">
                  Of IMAM.
                </span>
              </h1>
            </div>
          </div>

          {/* Contextual Description */}
          <div className="max-w-2xl relative group px-3 md:px-0">
            <div className="absolute left-0 md:-left-8 top-0 bottom-0 w-[3px] md:w-[6px] bg-gradient-to-b from-blue-600 to-emerald-500 rounded-full"></div>
            <p className="text-base md:text-3xl text-slate-800 font-bold leading-[1.4] md:leading-[1.25] pl-6 md:pl-10 italic">
              Redefinisi identitas visual madrasah. 
              Lahirkan <span className="text-slate-950 border-b-4 border-blue-600/20">Branding Ikonik</span> yang berakar pada Kurikulum Cinta.
            </p>
          </div>

          {/* Strategic CTA Hub */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-8 pt-4">
            <a 
              href="#register" 
              onClick={(e) => onScroll(e, 'register')}
              className="group relative overflow-hidden bg-slate-950 text-white px-8 md:px-14 py-5 md:py-8 rounded-[1.8rem] md:rounded-[2.5rem] text-[11px] md:text-[14px] font-[1000] uppercase tracking-[0.2em] md:tracking-[0.5em] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] text-center transition-all active:scale-95 hover:bg-blue-600"
            >
              <span className="relative z-10 flex items-center justify-center gap-4 md:gap-6 italic">
                Gabung Kompetisi <i className="fas fa-arrow-right text-[10px] md:text-[12px] group-hover:translate-x-3 transition-transform"></i>
              </span>
            </a>
            
            <a 
              href="#assets" 
              onClick={(e) => onScroll(e, 'assets')}
              className="group flex items-center justify-center gap-4 md:gap-6 bg-white/60 backdrop-blur-3xl border-2 border-slate-100 text-slate-950 px-8 md:px-14 py-5 md:py-8 rounded-[1.8rem] md:rounded-[2.5rem] text-[11px] md:text-[14px] font-[1000] uppercase tracking-[0.2em] md:tracking-[0.5em] hover:border-blue-600 transition-all shadow-xl active:scale-95 italic"
            >
              <i className="fas fa-file-download text-blue-600"></i> 
              Panduan Aset
            </a>
          </div>
        </div>

        {/* HEADMASTER PORTRAIT FRAME - UNIQUE & FLOATING */}
        <div className="lg:col-span-5 relative group mt-12 lg:mt-0">
           {/* Decorative Background Elements */}
           <div className="absolute inset-0 flex items-center justify-center -z-10">
              <div className="w-[120%] aspect-square border-2 border-dashed border-blue-600/10 rounded-full animate-spin-slow"></div>
              <div className="absolute w-[90%] aspect-square border border-emerald-500/20 rounded-full animate-reverse-spin"></div>
           </div>

           <div className="relative w-full aspect-[4/5] bg-white/20 backdrop-blur-[60px] border border-white/80 rounded-[5rem] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-1000 group-hover:scale-[1.02] group-hover:shadow-[0_80px_120px_-30px_rgba(37,99,235,0.25)] animate-float">
              {/* Image Container with Custom Masking */}
              <div className="absolute inset-0 p-4">
                 <div className="w-full h-full bg-slate-100 rounded-[4rem] overflow-hidden relative border border-slate-200 shadow-inner">
                    <img 
                      src={LOGOS.KEPALA_MADRASAH} 
                      className="w-full h-full object-cover object-center scale-110 group-hover:scale-105 transition-transform duration-1000" 
                      alt="H. Someran, S.Pd., MM" 
                    />
                    {/* Overlay Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent"></div>
                    
                    {/* Verified Official Badge */}
                    <div className="absolute top-8 left-8 bg-blue-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-xl border border-blue-400/30 animate-in slide-in-from-left-4">
                       <i className="fas fa-shield-check text-sm"></i>
                       <span className="text-[10px] font-black uppercase tracking-widest">Official Executive</span>
                    </div>
                 </div>
              </div>

              {/* Bottom Info Bar - Unique Glass Effect */}
              <div className="absolute bottom-10 left-10 right-10 bg-slate-950/90 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-4 translate-y-4 group-hover:translate-y-0 transition-all">
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] italic">Kepala Madrasah</p>
                   <h4 className="text-xl md:text-2xl font-[1000] text-white uppercase italic tracking-tighter leading-none">H. Someran, S.Pd., MM</h4>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                   <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-75"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse delay-150"></div>
                   </div>
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">IMAM Core Admin Node</p>
                </div>
              </div>
           </div>

           {/* Floating Accessory - Digital ID Badge */}
           <div className="absolute -bottom-6 -right-6 md:-right-12 w-32 md:w-48 bg-white p-4 md:p-6 rounded-[2rem] shadow-2xl border border-slate-100 z-20 animate-float-slow transition-transform hover:scale-110">
              <div className="flex flex-col items-center text-center gap-3">
                 <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-lg md:text-2xl">
                    <i className="fas fa-fingerprint"></i>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Auth Status</p>
                    <p className="text-[9px] md:text-[11px] font-[1000] text-emerald-600 uppercase italic">Verified</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>

    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      @keyframes float-slow {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(3deg); }
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes reverse-spin {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
      }
      .animate-float { animation: float 6s ease-in-out infinite; }
      .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
      .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      .animate-reverse-spin { animation: reverse-spin 15s linear infinite; }
    `}</style>
  </header>
);
