
import React from 'react';
import { LOGOS } from './constants';

export const Sponsors: React.FC = () => {
  const sponsorList = [
    { name: "ZABAZA", img: LOGOS.SPONSOR_1 },
    { name: "Mircz", img: LOGOS.SPONSOR_2 },
    { name: "Ziyadatul'uluum", img: LOGOS.SPONSOR_3 },
    { name: "IMAM Node", img: LOGOS.IMAM },
  ];

  return (
    <section className="py-8 md:py-12 relative z-10 px-4">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-6 flex flex-col items-center text-center space-y-1">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-blue-50/50 rounded-full border border-blue-100/50">
            <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-[7px] font-black text-blue-500 uppercase tracking-widest">Partners</span>
          </div>
          <h2 className="text-xl md:text-2xl font-[1000] text-slate-900 uppercase italic tracking-tighter leading-none">
            Dukungan <span className="text-blue-600 not-italic">Kemitraan.</span>
          </h2>
        </div>

        {/* Ultra Compact Logo Grid - Fixed 4 columns */}
        <div className="grid grid-cols-4 gap-2 md:gap-3 max-w-2xl mx-auto">
          {sponsorList.map((sponsor, index) => (
            <div 
              key={index} 
              className="group bg-white/50 border border-slate-100 p-2 md:p-3 rounded-xl md:rounded-2xl h-14 md:h-20 flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 overflow-hidden relative"
            >
              <div className="flex-1 w-full flex items-center justify-center relative z-10">
                <img 
                  src={sponsor.img} 
                  alt={sponsor.name} 
                  className="max-h-[60%] max-w-[70%] object-contain grayscale group-hover:grayscale-0 transition-all duration-500 opacity-40 group-hover:opacity-100 scale-90 group-hover:scale-100"
                />
              </div>
              <p className="text-[6px] md:text-[7px] font-black text-slate-300 group-hover:text-blue-500 uppercase tracking-tighter mt-0.5 transition-colors truncate w-full text-center">
                {sponsor.name}
              </p>
            </div>
          ))}
        </div>

        {/* Mini Collaboration CTA */}
        <div className="mt-8 md:mt-10 max-w-xl mx-auto p-4 md:p-6 rounded-[1.5rem] bg-slate-950 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors"></div>
          <div className="relative z-10 text-center sm:text-left">
            <h4 className="text-sm md:text-base font-black uppercase italic tracking-tight">Kolaborasi?</h4>
            <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest leading-none">Gabung ekosistem visual kami.</p>
          </div>
          
          <a 
            href="https://wa.me/6285391706131" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative z-10 shrink-0 flex items-center gap-2 bg-white text-slate-950 px-5 py-2.5 rounded-lg text-[7px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95"
          >
            Hubungi Hub <i className="fab fa-whatsapp text-[10px]"></i>
          </a>
        </div>
      </div>
    </section>
  );
};
