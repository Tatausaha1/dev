
import React, { useState } from 'react';

interface Service {
  id: string;
  title: string;
  desc: string;
  icon: string;
  category: 'akademik' | 'pegawai' | 'umum';
  color: string;
  status: 'online' | 'maintenance';
}

const SERVICES: Service[] = [
  { id: 'attendance', title: 'Presensi GTK', desc: 'Unggah mandiri bukti kehadiran & administrasi bulanan.', icon: 'fa-fingerprint', category: 'pegawai', color: 'bg-blue-600', status: 'online' },
  { id: 'legalisir', title: 'Legalisir Digital', desc: 'Verifikasi ijazah dan dokumen kelulusan secara online.', icon: 'fa-stamp', category: 'umum', color: 'bg-emerald-600', status: 'online' },
  { id: 'mutasi', title: 'Mutasi Siswa', desc: 'Administrasi pindah masuk/keluar terintegrasi EMIS.', icon: 'fa-right-from-bracket', category: 'akademik', color: 'bg-indigo-600', status: 'online' },
  { id: 'sk-aktif', title: 'Surat Keterangan', desc: 'Penerbitan surat aktif belajar untuk beasiswa/lomba.', icon: 'fa-user-graduate', category: 'akademik', color: 'bg-rose-600', status: 'online' },
  { id: 'kalender', title: 'Agenda Madrasah', desc: 'Jadwal operasional dan kalender pendidikan MAN 1 HST.', icon: 'fa-calendar-days', category: 'umum', color: 'bg-amber-600', status: 'online' },
  { id: 'data-guru', title: 'Direktori GTK', desc: 'Informasi publik profil tenaga kependidikan resmi.', icon: 'fa-users-gear', category: 'pegawai', color: 'bg-slate-900', status: 'online' }
];

export const ServicesDirectory: React.FC<{ onServiceAction: (id: string) => void }> = ({ onServiceAction }) => {
  const [activeCat, setActiveCat] = useState<'all' | 'akademik' | 'pegawai' | 'umum'>('all');

  const filtered = SERVICES.filter(s => activeCat === 'all' || s.category === activeCat);

  return (
    <div id="services-portal" className="max-w-7xl mx-auto px-4 md:px-8 pb-32 animate-in fade-in">
      <div className="mb-12 md:mb-20 space-y-8 text-center md:text-left">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-blue-50 rounded-full border border-blue-100 shadow-sm">
           <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)]"></span>
           <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">MAN 1 HST Services Node</span>
        </div>
        <div className="space-y-4">
           <h1 className="text-4xl md:text-8xl font-[1000] text-slate-950 uppercase italic tracking-tighter leading-none">
             Pusat <span className="text-blue-600">Layanan.</span>
           </h1>
           <p className="text-slate-400 font-bold text-sm md:text-xl max-w-2xl leading-relaxed uppercase tracking-wide">
             Ekosistem administrasi digital madrasah V6.1. Pilih layanan untuk memulai proses sinkronisasi cloud.
           </p>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 md:gap-4 pt-4">
           {['all', 'akademik', 'pegawai', 'umum'].map(cat => (
             <button 
              key={cat} 
              onClick={() => setActiveCat(cat as any)}
              className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 active:scale-95 ${activeCat === cat ? 'bg-slate-950 border-slate-950 text-white shadow-2xl' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-600/30'}`}
             >
               {cat === 'all' ? 'Semua Katalog' : cat}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {filtered.map((s, idx) => (
          <div key={s.id} className="group bg-white p-8 md:p-10 rounded-[3.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between relative overflow-hidden animate-in slide-in-from-bottom-6" style={{ animationDelay: `${idx * 80}ms` }}>
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100/50"></div>
             
             <div className="relative z-10">
                <div className={`w-16 h-16 ${s.color} text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500`}>
                   <i className={`fas ${s.icon} text-2xl`}></i>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em]">{s.category}</p>
                   </div>
                   <h3 className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter leading-tight">{s.title}</h3>
                   <p className="text-slate-400 text-xs md:text-sm font-bold leading-relaxed">{s.desc}</p>
                </div>
             </div>

             <div className="mt-14 pt-8 border-t border-slate-50 flex items-center justify-between relative z-10">
                <button 
                  onClick={() => onServiceAction(s.id)}
                  className="px-8 py-4.5 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95 italic"
                >
                   Buka Layanan <i className="fas fa-chevron-right text-[8px]"></i>
                </button>
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                   <i className="fas fa-shield-halved text-xs"></i>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="mt-24 p-10 md:p-16 bg-slate-950 rounded-[4rem] text-white flex flex-col lg:flex-row items-center justify-between gap-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden group">
         <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors"></div>
         <div className="relative z-10 flex-1 space-y-5 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4">
               <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></span>
               <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.5em]">Real-time Archives</p>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">Arsip Berkas <br className="hidden md:block" /> Terbuka.</h2>
            <p className="text-slate-400 font-bold text-xs md:text-base max-w-xl uppercase tracking-widest leading-relaxed">Pantau transparansi layanan melalui direktori arsip publik. Data disinkronkan langsung dari server utama madrasah.</p>
         </div>
         <button className="relative z-10 px-12 py-6 bg-white text-slate-950 rounded-[2.5rem] text-[12px] font-[1000] uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-95 italic whitespace-nowrap">
            Jelajahi Arsip Publik <i className="fas fa-search-plus ml-4"></i>
         </button>
      </div>
    </div>
  );
};
