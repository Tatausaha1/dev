import React, { useState } from 'react';
import { GTK_ANNUAL_SERVICES } from '../constants.ts';
import { GTKReportForm } from '../GTKReportForm.tsx';
import { db } from '../services/apiService.ts';

interface LayananGTKDataTahunanProps {
  onBack: () => void;
}

export const LayananGTKDataTahunan: React.FC<LayananGTKDataTahunanProps> = ({ onBack }) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const annualTasks = [
    { id: 'kinerja', name: 'Laporan Kinerja 2026', icon: 'fa-briefcase', color: 'bg-blue-600', emoji: '💼' },
    { id: 'skp', name: 'SKP Tahun 2026', icon: 'fa-graduation-cap', color: 'bg-emerald-600', emoji: '🎓' },
    { id: 'diklat', name: 'Sertifikat Diklat/Seminar 2026', icon: 'fa-star', color: 'bg-amber-500', emoji: '⭐' },
    { id: 'pkg', name: 'PKG Tahun 2026', icon: 'fa-trophy', color: 'bg-indigo-600', emoji: '🏆' },
    { id: 'penghargaan', name: 'Penghargaan Pendidik 2026', icon: 'fa-medal', color: 'bg-rose-500', emoji: '🏅' }
  ];

  const handleTaskClick = (name: string) => {
    setSelectedCategory(name);
    setShowUploadForm(true);
  };

  if (showUploadForm) {
    return <GTKReportForm onClose={() => setShowUploadForm(false)} db={db} />;
  }

  return (
    <div className="animate-in slide-in-from-right-4 duration-500 space-y-12">
      {/* Header Portal Tahunan */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-5">
           <button onClick={onBack} className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-950 hover:text-white transition-all shadow-sm active:scale-90">
              <i className="fas fa-arrow-left text-sm"></i>
           </button>
           <div className="space-y-1">
              <h3 className="text-2xl md:text-4xl font-[1000] text-slate-950 italic uppercase tracking-tighter leading-none">Data Tahunan <span className="text-emerald-600">GTK 2025/2026.</span></h3>
              <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Arsip Digital Kompetensi & Kinerja Pegawai</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Konten Utama: Daftar Tugas */}
        <div className="lg:col-span-8 space-y-8">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {annualTasks.map((task) => (
                <div 
                  key={task.id}
                  className="group relative bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-xl transition-all duration-500 flex flex-col justify-between overflow-hidden text-left"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-50"></div>
                  <div className="relative z-10">
                     <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 ${task.color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                           <i className={`fas ${task.icon} text-xl`}></i>
                        </div>
                        <span className="text-3xl">{task.emoji}</span>
                     </div>
                     <h4 className="text-xl md:text-2xl font-black text-slate-950 uppercase italic tracking-tighter mb-6 leading-tight">{task.name}</h4>
                  </div>
                  
                  <button 
                    onClick={() => handleTaskClick(task.name)}
                    className="relative z-10 w-full py-4 bg-slate-950 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all active:scale-95 italic flex items-center justify-center gap-3"
                  >
                    Unggah Dokumen <i className="fas fa-upload"></i>
                  </button>
                </div>
              ))}
           </div>
        </div>

        {/* Sidebar: Cek Status & Data Pengumpulan */}
        <div className="lg:col-span-4 space-y-8">
           {/* Section Cek Status */}
           <div className="bg-slate-950 p-8 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:bg-emerald-500/20 transition-all"></div>
              
              <div className="space-y-2 relative z-10">
                 <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">Cek Status.</h4>
                 <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Real-time Data Sync</p>
              </div>

              <div className="space-y-4 relative z-10">
                 <p className="text-slate-400 text-xs font-medium leading-relaxed uppercase tracking-tight">Gunakan tombol di bawah untuk mengecek siapa saja yang belum mengunggah secara real-time.</p>
                 
                 <div className="space-y-4">
                    <div className="space-y-3">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Data Pengumpulan Dokumen:</p>
                       
                       <div className="p-5 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                          <div>
                             <p className="text-white text-[11px] font-black uppercase italic tracking-tight mb-2">1. Laporan Kinerja 2026</p>
                             <a 
                               href={GTK_ANNUAL_SERVICES.LAPORAN_KINERJA_DATA} 
                               target="_blank"
                               className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600/20 text-blue-400 border border-blue-400/20 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest"
                             >
                                Lihat Data 📊
                             </a>
                          </div>

                          <div className="h-px bg-white/5"></div>

                          <div>
                             <p className="text-white text-[11px] font-black uppercase italic tracking-tight mb-2">2. SKP Tahun 2026</p>
                             <a 
                               href={GTK_ANNUAL_SERVICES.SKP_DATA} 
                               target="_blank"
                               className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-400/20 rounded-xl hover:bg-emerald-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest"
                             >
                                Lihat Data 📈
                             </a>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <a 
                href={GTK_ANNUAL_SERVICES.STATUS_SHEET} 
                target="_blank"
                className="block w-full py-6 bg-white text-slate-950 rounded-3xl font-black uppercase text-[11px] tracking-widest shadow-xl hover:bg-emerald-600 hover:text-white transition-all text-center italic active:scale-95 relative z-10"
              >
                Cek Semua Rekap 🔍
              </a>
           </div>

           <div className="bg-blue-50 border border-blue-100 p-8 rounded-[3rem] text-center space-y-4 shadow-inner">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 mx-auto shadow-sm">
                 <i className="fas fa-info-circle"></i>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Penyimpanan terenkripsi pada Node Cloud Madrasah untuk menjamin keamanan arsip digital pegawai.</p>
           </div>
        </div>
      </div>
      <div className="md:hidden h-24"></div>
    </div>
  );
};