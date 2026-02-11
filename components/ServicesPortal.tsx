
import React, { useState } from 'react';
import { QueueManager } from './QueueManager.tsx';

interface ServiceCardProps {
  service: any;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden active:scale-95 flex flex-col justify-between h-full min-h-[260px] md:min-h-[320px]"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:scale-150 group-hover:opacity-20 ${service.color}`}></div>
    
    <div className="relative z-10">
      <div className={`w-14 h-14 md:w-16 md:h-16 ${service.color} text-white rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-blue-500/20`}>
         <i className={`fas ${service.icon} text-xl md:text-2xl`}></i>
      </div>
      
      <div className="space-y-2 md:space-y-3">
         <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
            <p className="text-[8px] md:text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] italic">{service.cat} Node</p>
         </div>
         <h3 className="text-xl md:text-2xl font-[1000] text-slate-950 uppercase italic tracking-tighter leading-none group-hover:text-blue-700 transition-colors">{service.title}</h3>
         <p className="text-slate-400 text-[10px] md:text-xs font-bold leading-relaxed uppercase tracking-wider line-clamp-2">{service.desc}</p>
      </div>
    </div>

    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
       <div className="flex flex-col">
          <span className="text-[7px] font-black uppercase text-slate-300 tracking-widest">Estimasi Selesai</span>
          <span className="text-[10px] font-black text-slate-900 uppercase italic">{service.eta || '1-3 Hari Kerja'}</span>
       </div>
       <span className="text-[9px] font-black uppercase text-blue-600 tracking-widest italic flex items-center gap-2 group-hover:translate-x-2 transition-transform">
          Ajukan <i className="fas fa-arrow-right text-[8px]"></i>
       </span>
    </div>
  </div>
);

interface ServicesPortalProps {
  onNavigate: (section: string, tab?: string) => void;
}

export const ServicesPortal: React.FC<ServicesPortalProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<'semua' | 'ptsp' | 'akademik' | 'pegawai'>('semua');

  const services = [
    { id: 'ptsp-section', tab: 'submit', title: 'Suket Aktif Sekolah', desc: 'Surat keterangan resmi status siswa aktif untuk beasiswa atau lomba.', cat: 'akademik', color: 'bg-emerald-600', icon: 'fa-user-graduate', eta: '1 Hari Kerja' },
    { id: 'ptsp-section', tab: 'submit', title: 'Surat Keterangan Lulus', desc: 'Dokumen pengganti sementara ijazah bagi lulusan baru.', cat: 'akademik', color: 'bg-blue-600', icon: 'fa-graduation-cap', eta: '2 Hari Kerja' },
    { id: 'ptsp-section', tab: 'submit', title: 'Legalisir Ijazah', desc: 'Pengesahan fotokopi ijazah secara resmi oleh madrasah.', cat: 'ptsp', color: 'bg-indigo-600', icon: 'fa-stamp', eta: '1-3 Hari Kerja' },
    { id: 'ptsp-section', tab: 'submit', title: 'Mutasi Siswa', desc: 'Layanan administrasi pindah masuk atau pindah keluar sekolah.', cat: 'ptsp', color: 'bg-rose-600', icon: 'fa-right-from-bracket', eta: '3 Hari Kerja' },
    { id: 'ptsp-section', tab: 'submit', title: 'Aspirasi & Pengaduan', desc: 'Sampaikan saran atau keluhan pelayanan secara rahasia.', cat: 'umum', color: 'bg-slate-900', icon: 'fa-comment-dots', eta: 'Respon 24 Jam' },
    { id: 'ptsp-section', tab: 'attendance', title: 'Layanan GTK', desc: 'Portal administrasi khusus Guru dan Tenaga Kependidikan.', cat: 'pegawai', color: 'bg-amber-600', icon: 'fa-user-tie', eta: 'Real-time' }
  ];

  const filtered = services.filter(s => activeCategory === 'semua' || s.cat === activeCategory);

  return (
    <div id="services-portal" className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-20 space-y-12 md:space-y-20 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-8 text-center lg:text-left">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 border border-blue-100 rounded-full shadow-sm mx-auto lg:mx-0">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]"></span>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Pusat Layanan Terintegrasi V6.1</p>
          </div>
          <h1 className="text-4xl md:text-8xl font-[1000] text-slate-950 uppercase italic tracking-tighter leading-[0.85]">
            Pusat <span className="text-blue-600 not-italic">Layanan.</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs md:text-xl max-w-2xl leading-relaxed uppercase tracking-widest italic">Katalog layanan administrasi digital MAN 1 Hulu Sungai Tengah. Modern, Terpercaya, dan Tanpa Pungutan Biaya.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 bg-slate-50 p-1.5 rounded-[2rem] border border-slate-200 shadow-inner">
           {['semua', 'ptsp', 'akademik', 'pegawai'].map(cat => (
             <button 
               key={cat} 
               onClick={() => setActiveCategory(cat as any)}
               className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeCategory === cat ? 'bg-slate-950 text-white shadow-xl italic scale-105' : 'text-slate-400 hover:text-slate-900 hover:bg-white'}`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {filtered.map((s, idx) => (
            <div key={idx} className="animate-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
              <ServiceCard service={s} onClick={() => onNavigate(s.id, s.tab)} />
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-950 p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-all group-hover:bg-blue-600/20"></div>
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/5 shadow-inner">
                       <i className="fas fa-tower-broadcast text-lg"></i>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] leading-none">Infrastruktur</p>
                       <h2 className="text-2xl text-white font-[1000] uppercase italic tracking-tighter mt-1">Antrean Langsung.</h2>
                    </div>
                 </div>
                 <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest leading-relaxed">Sistem antrean cerdas terintegrasi suara AI untuk kenyamanan pelayanan.</p>
                 <QueueManager selectedVoice="Zephyr" onAnnounce={() => {}} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
