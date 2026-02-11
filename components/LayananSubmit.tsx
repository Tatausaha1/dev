
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from '../services/apiService.ts';
import { LayananCutiPortal } from './LayananCutiPortal.tsx';
import { LayananGTKDataTahunan } from './LayananGTKDataTahunan.tsx';

interface Category {
  id: string;
  name: string;
  sub: string;
  icon: string;
  color: string;
  order: number;
}

interface Service {
  id: string;
  categoryId: string;
  name: string;
  desc: string;
  icon: string;
  eta: string;
  status: 'active' | 'maintenance' | 'dev';
}

export const LayananSubmit: React.FC<{ onCategoryClick: (cat: any) => void; onOpenForm: () => void; isModalMode?: boolean }> = ({ onCategoryClick, onOpenForm, isModalMode = false }) => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 'peserta-didik', name: 'Peserta Didik', sub: 'Siswa Aktif', icon: 'fa-user-graduate', color: 'from-blue-600 to-blue-800', order: 1 },
    { id: 'alumni', name: 'Layanan Alumni', sub: 'Lulusan / Alumni', icon: 'fa-graduation-cap', color: 'from-indigo-600 to-indigo-800', order: 2 },
    { id: 'mutasi', name: 'Layanan Mutasi', sub: 'Pindah Sekolah', icon: 'fa-right-from-bracket', color: 'from-emerald-600 to-emerald-800', order: 3 },
    { id: 'gtk', name: 'Layanan GTK', sub: 'Guru & Tenaga Kep.', icon: 'fa-user-tie', color: 'from-amber-600 to-amber-800', order: 4 },
    { id: 'umum', name: 'Admin Umum', sub: 'Internal & Publik', icon: 'fa-building-columns', color: 'from-slate-700 to-slate-900', order: 5 },
    { id: 'pengaduan', name: 'Pengaduan', sub: 'Zona Integritas', icon: 'fa-bullhorn', color: 'from-rose-600 to-rose-800', order: 6 }
  ]);

  const [servicesMap, setServicesMap] = useState<Record<string, Service[]>>({
    'peserta-didik': [
      { id: 'sk-aktif', categoryId: 'peserta-didik', name: 'Surat Aktif Sekolah', desc: 'Keperluan beasiswa, lomba, atau administrasi.', icon: 'fa-file-signature', eta: '1 Hari', status: 'active' },
      { id: 'sk-siswa', categoryId: 'peserta-didik', name: 'Surat Keterangan Siswa', desc: 'Pernyataan resmi status kesiswaan.', icon: 'fa-id-card', eta: '1 Hari', status: 'active' },
      { id: 'sk-nilai', categoryId: 'peserta-didik', name: 'SK Nilai / Rapor', desc: 'Keterangan capaian akademik per semester.', icon: 'fa-chart-bar', eta: '2 Hari', status: 'active' },
      { id: 'suket-izin', categoryId: 'peserta-didik', name: 'Izin Tidak Masuk', desc: 'Permohonan izin resmi ke madrasah.', icon: 'fa-clock', eta: 'Real-time', status: 'active' }
    ],
    'alumni': [
      { id: 'skl', categoryId: 'alumni', name: 'Surat Keterangan Lulus', desc: 'Dokumen sementara sebelum ijazah terbit.', icon: 'fa-user-check', eta: '1 Hari', status: 'active' },
      { id: 'legalisir-ijazah', categoryId: 'alumni', name: 'Legalisir Ijazah', desc: 'Pengesahan fotokopi ijazah resmi.', icon: 'fa-stamp', eta: '1-2 Hari', status: 'active' },
      { id: 'legalisir-skhun', categoryId: 'alumni', name: 'Legalisir SKHUN', desc: 'Pengesahan dokumen nilai kelulusan.', icon: 'fa-file-contract', eta: '1-2 Hari', status: 'active' },
      { id: 'rekom-alumni', categoryId: 'alumni', name: 'Rekomendasi Alumni', desc: 'Dukungan untuk lanjut studi/kerja.', icon: 'fa-award', eta: '2 Hari', status: 'active' }
    ],
    'mutasi': [
      { id: 'mutasi-masuk', categoryId: 'mutasi', name: 'Mutasi Masuk', desc: 'Penerimaan siswa dari sekolah lain.', icon: 'fa-arrow-right-to-bracket', eta: '3 Hari', status: 'active' },
      { id: 'mutasi-keluar', categoryId: 'mutasi', name: 'Mutasi Keluar', desc: 'Pindah siswa ke sekolah/madrasah lain.', icon: 'fa-arrow-right-from-bracket', eta: '3 Hari', status: 'active' },
      { id: 'rekom-mutasi', categoryId: 'mutasi', name: 'Rekomendasi Mutasi', desc: 'Surat izin perpindahan kesiswaan.', icon: 'fa-file-circle-check', eta: '2 Hari', status: 'active' }
    ],
    'gtk': [
      { id: 'sk-mengajar', categoryId: 'gtk', name: 'Suket Mengajar', desc: 'Keterangan beban kerja mengajar GTK.', icon: 'fa-chalkboard-user', eta: '1 Hari', status: 'active' },
      { id: 'sk-aktif-gtk', categoryId: 'gtk', name: 'Suket Aktif GTK', desc: 'Pernyataan aktif menjalankan tugas.', icon: 'fa-user-check', eta: '1 Hari', status: 'active' },
      { id: 'surat-tugas', categoryId: 'gtk', name: 'Surat Tugas', desc: 'Penerbitan surat perintah dinas.', icon: 'fa-file-signature', eta: 'Real-time', status: 'active' },
      { id: 'lap-pusaka', categoryId: 'gtk', name: 'Laporan Pusaka', desc: 'Sinkronisasi presensi pegawai.', icon: 'fa-fingerprint', eta: 'Real-time', status: 'active' }
    ],
    'umum': [
      { id: 'sk-umum', categoryId: 'umum', name: 'Suket Umum', desc: 'Keperluan administrasi masyarakat.', icon: 'fa-file-circle-exclamation', eta: '1 Hari', status: 'active' },
      { id: 'mohon-data', categoryId: 'umum', name: 'Permohonan Data', desc: 'Akses informasi publik madrasah.', icon: 'fa-database', eta: '3 Hari', status: 'active' },
      { id: 'kerjasama', categoryId: 'umum', name: 'Permohonan Kerjasama', desc: 'Kemitraan instansi luar/mitra.', icon: 'fa-handshake', eta: '5 Hari', status: 'active' }
    ],
    'pengaduan': [
      { id: 'aduan-layan', categoryId: 'pengaduan', name: 'Pengaduan Layanan', desc: 'Keluhan ketidakpuasan pelayanan.', icon: 'fa-comment-dots', eta: '24 Jam', status: 'active' },
      { id: 'aspirasi', categoryId: 'pengaduan', name: 'Aspirasi & Saran', desc: 'Masukan untuk kemajuan madrasah.', icon: 'fa-lightbulb', eta: '48 Jam', status: 'active' },
      { id: 'lapor-pungli', categoryId: 'pengaduan', name: 'Laporan Pungli', desc: 'Zona Integritas Bebas Korupsi.', icon: 'fa-hand-holding-dollar', eta: 'Rahasia', status: 'active' }
    ]
  });

  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [activePortal, setActivePortal] = useState<'none' | 'cuti' | 'annual'>('none');

  const handleBack = () => {
    if (activePortal !== 'none') setActivePortal('none');
    else setSelectedCatId(null);
  };

  const handleServiceClick = (s: Service) => {
    if (s.status !== 'active') return alert("Layanan sedang dalam pemeliharaan.");
    // Mapping internal logic for special portals
    if (s.id === 'lap-pusaka') onCategoryClick({ ...s, internal: true });
    else onCategoryClick(s);
  };

  if (activePortal === 'cuti') return <LayananCutiPortal onBack={handleBack} isTabMode={true} />;
  if (activePortal === 'annual') return <LayananGTKDataTahunan onBack={handleBack} />;

  return (
    <div className={`w-full max-w-5xl mx-auto ${!isModalMode ? 'p-2' : ''}`}>
      {!selectedCatId ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in zoom-in-95 duration-500">
          {categories.sort((a,b) => a.order - b.order).map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className="group flex flex-col items-center gap-4 p-6 md:p-10 rounded-[3rem] bg-white border border-slate-100 transition-all hover:border-blue-400 hover:shadow-2xl active:scale-95 shadow-xl text-center relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${cat.color} opacity-[0.03] rounded-full -mr-10 -mt-10 group-hover:opacity-[0.08] transition-opacity`}></div>
              <div className={`w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br ${cat.color} rounded-[2rem] flex items-center justify-center text-white shadow-xl transition-all group-hover:scale-110 group-hover:-rotate-6`}>
                <i className={`fas ${cat.icon} text-2xl md:text-4xl`}></i>
              </div>
              <div className="space-y-1">
                <h4 className="text-[15px] md:text-xl font-[1000] text-slate-950 uppercase italic leading-none">{cat.name}</h4>
                <p className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{cat.sub}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="animate-in slide-in-from-right-4 duration-500 space-y-6">
          {/* Sub-header Dynamic */}
          <div className="flex items-center gap-5 px-3 border-b border-slate-100 pb-6">
             <button onClick={handleBack} className="w-12 h-12 shrink-0 rounded-2xl bg-slate-950 text-white flex items-center justify-center hover:bg-blue-600 transition-all active:scale-90 shadow-lg">
                <i className="fas fa-arrow-left"></i>
             </button>
             <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                   <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Indeks Layanan</p>
                </div>
                <h3 className="text-2xl md:text-4xl font-[1000] text-slate-950 uppercase italic tracking-tighter leading-none truncate">
                  {categories.find(c => c.id === selectedCatId)?.name}
                </h3>
             </div>
          </div>

          {/* Service Grid - List Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servicesMap[selectedCatId]?.map((s) => (
              <div 
                key={s.id}
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-md hover:shadow-xl hover:border-blue-200 transition-all group flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-4">
                   <div className="w-14 h-14 bg-slate-50 text-blue-600 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                      <i className={`fas ${s.icon} text-xl`}></i>
                   </div>
                   <div className="text-right">
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block">Standar Waktu</span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg border border-blue-100 inline-block mt-1">
                         {s.eta}
                      </span>
                   </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xl font-[1000] uppercase italic tracking-tight text-slate-950 leading-tight">
                    {s.name}
                  </h4>
                  <p className="text-xs font-bold text-slate-400 mt-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <button 
                  onClick={() => handleServiceClick(s)}
                  className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-blue-600 transition-all active:scale-95 italic flex items-center justify-center gap-3 shadow-xl"
                >
                   Ajukan Sekarang <i className="fas fa-paper-plane text-[9px]"></i>
                </button>
              </div>
            ))}
          </div>

          {/* Footer Assistance */}
          <div className="bg-slate-900 p-8 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5 shadow-2xl relative overflow-hidden mt-10">
             <div className="absolute inset-0 bg-blue-600/5"></div>
             <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-blue-400 shadow-inner shrink-0">
                    <i className="fas fa-headset text-2xl"></i>
                </div>
                <div>
                   <h4 className="text-xl font-black text-white uppercase italic leading-none">Butuh Panduan?</h4>
                   <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 leading-relaxed">Konsultasi teknis pengajuan berkas digital via WhatsApp Operator.</p>
                </div>
             </div>
             <a 
               href="https://wa.me/6285391706131" 
               target="_blank"
               className="relative z-10 px-10 py-5 bg-white text-slate-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all active:scale-95 shadow-2xl flex items-center gap-3 italic"
             >
                Chat Operator <i className="fab fa-whatsapp text-lg"></i>
             </a>
          </div>
        </div>
      )}
    </div>
  );
};
