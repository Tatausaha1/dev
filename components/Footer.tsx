
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                <div className="max-w-md">
                    <div className="flex items-center gap-3 mb-8">
                       <img src="https://lh3.googleusercontent.com/d/1tF-zHjHH0Ofmi3UMPkTW93M6aRkXZ2tR" alt="Logo" className="h-12 w-auto" />
                       <div className="h-8 w-[1px] bg-slate-200"></div>
                       <img src="https://lh3.googleusercontent.com/d/1c5nQshrGIzfTjd3IEJfDiGEeLJsiuGiT" alt="IMAM" className="h-10 w-auto rounded-lg" />
                    </div>
                    <h5 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter mb-4">MAN 1 Hulu Sungai Tengah</h5>
                    <p className="text-slate-400 text-xs font-bold leading-relaxed uppercase tracking-wider mb-6">
                        Jl. Keramat No. 24, Barabai, Kabupaten Hulu Sungai Tengah, Kalimantan Selatan. <br/>
                        Wujudkan tata kelola madrasah modern, transparan, dan akuntabel.
                    </p>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <i className="fas fa-clock text-blue-600"></i> Senin - Jum'at: 07.30 - 16.00 WITA
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <i className="fab fa-whatsapp text-emerald-500"></i> +62 853-9170-6131 (CS PTSP)
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <i className="fas fa-envelope text-blue-400"></i> official@mansatuhst.sch.id
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
                   <div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6">Navigasi Portal</h5>
                      <ul className="space-y-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                         <li><a href="#beranda" className="hover:text-blue-600 transition">Beranda</a></li>
                         <li><a href="#ptsp-section" className="hover:text-blue-600 transition">Ajukan Layanan</a></li>
                         <li><a href="#portal-informasi" className="hover:text-blue-600 transition">Info & Pengumuman</a></li>
                         <li><a href="#sponsors-section" className="hover:text-blue-600 transition">Kemitraan</a></li>
                      </ul>
                   </div>
                   <div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6">Legalitas & SOP</h5>
                      <ul className="space-y-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                         <li><a href="#" className="hover:text-blue-600 transition">Kebijakan Privasi</a></li>
                         <li><a href="#" className="hover:text-blue-600 transition">SOP Pelayanan</a></li>
                         <li><a href="#" className="hover:text-blue-600 transition">Maklumat Pelayanan</a></li>
                         <li><a href="#" className="hover:text-blue-600 transition">Zona Integritas</a></li>
                      </ul>
                   </div>
                </div>
            </div>

            <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col md:items-start gap-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 MAN 1 Hulu Sungai Tengah. All Rights Reserved.</p>
                    <p className="text-[8px] font-black text-blue-600 uppercase tracking-[0.3em] italic">Powered by APP IMAM V6.1 Madrasah Cloud Service</p>
                </div>
                <div className="flex gap-4">
                   {[
                     { icon: 'fa-facebook-f', color: 'hover:bg-[#1877F2]' },
                     { icon: 'fa-instagram', color: 'hover:bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]' },
                     { icon: 'fa-youtube', color: 'hover:bg-[#FF0000]' },
                     { icon: 'fa-globe', color: 'hover:bg-blue-600' }
                   ].map((social, i) => (
                     <a key={i} href="#" className={`w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 transition-all ${social.color} hover:text-white shadow-sm`}>
                        <i className={`fab ${social.icon} text-xs`}></i>
                     </a>
                   ))}
                </div>
            </div>
        </div>
    </footer>
  );
};
