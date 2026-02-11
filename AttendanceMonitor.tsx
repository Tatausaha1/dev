import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from '../services/apiService.ts';
import { GTK_MASTER_DATA } from '../constants.ts';
import { UserRole } from './types';

interface AttendanceMonitorProps {
  onUploadClick: (gtkData?: any) => void;
  userRole?: UserRole;
}

const getEffectivePeriod = () => {
  const now = new Date();
  const day = now.getDate();
  let monthIndex = now.getMonth();
  let year = now.getFullYear();
  if (day <= 15) {
    monthIndex -= 1;
    if (monthIndex < 0) { monthIndex = 11; year -= 1; }
  }
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return { month: months[monthIndex], year: year.toString() };
};

export const AttendanceMonitor: React.FC<AttendanceMonitorProps> = ({ onUploadClick, userRole }) => {
  const { month: effectiveMonth, year: effectiveYear } = useMemo(() => getEffectivePeriod(), []);
  const [reportsMap, setReportsMap] = useState<Record<string, any>>( {});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isAdmin = userRole?.toUpperCase() === 'ADMIN';

  const getFileSize = (dataUrl: string) => {
    try {
      if (!dataUrl || typeof dataUrl !== 'string') return "N/A";
      const base64Data = dataUrl.split(',')[1] || dataUrl;
      const sizeInBytes = Math.ceil(base64Data.length * 0.75);
      if (sizeInBytes < 1024) return sizeInBytes + " B";
      if (sizeInBytes < 1024 * 1024) return (sizeInBytes / 1024).toFixed(1) + " KB";
      return (sizeInBytes / (1024 * 1024)).toFixed(1) + " MB";
    } catch (e) { return "N/A"; }
  };

  const getBlobUrl = (dataUrl: string) => {
    try {
      const arr = dataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) { u8arr[n] = bstr.charCodeAt(n); }
      const blob = new Blob([u8arr], { type: mime });
      return URL.createObjectURL(blob);
    } catch (e) { return dataUrl; }
  };

  useEffect(() => {
    if (previewFile && previewFile.data && isAdmin) {
      const url = getBlobUrl(previewFile.data);
      setPreviewUrl(url);
      return () => { if(url && url.startsWith('blob:')) URL.revokeObjectURL(url); };
    } else {
      setPreviewUrl(null);
    }
  }, [previewFile, isAdmin]);

  useEffect(() => {
    const q = query(
      collection(db, "laporanGTK"),
      where("judulLaporan", "==", effectiveMonth),
      where("tahun", "==", effectiveYear)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const data: Record<string, any> = {};
      snapshot.forEach((doc) => {
        const report = doc.data();
        if (report.nip) data[report.nip] = { id: doc.id, ...report };
      });
      setReportsMap(data);
      setLoading(false);
    });
    return () => unsub();
  }, [effectiveMonth, effectiveYear]);

  const filteredGTK = useMemo(() => {
    return GTK_MASTER_DATA.filter(g => 
      g.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
      g.nip.includes(searchTerm)
    );
  }, [searchTerm]);

  const stats = {
    total: GTK_MASTER_DATA.length,
    uploaded: Object.keys(reportsMap).length,
    percent: Math.round((Object.keys(reportsMap).length / GTK_MASTER_DATA.length) * 100)
  };

  return (
    <div className="w-full space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 relative px-1 md:px-0">
      {/* Pratinjau Berkas */}
      {previewFile && (
        <div className="fixed inset-0 z-[500] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">
              <div className="p-5 bg-slate-950 text-white flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><i className="fas fa-file-shield text-xs"></i></div>
                    <div>
                       <h3 className="text-[11px] font-black uppercase italic truncate max-w-[150px] leading-tight">{previewFile.name}</h3>
                       <p className="text-[7px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">Sistem Verifikasi Cloud</p>
                    </div>
                 </div>
                 <button onClick={() => setPreviewFile(null)} className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center active:scale-90"><i className="fas fa-times text-xs"></i></button>
              </div>
              <div className="flex-1 bg-slate-50 p-6 flex flex-col items-center justify-center text-center space-y-4">
                 {isAdmin ? (
                    <div className="w-full h-full flex flex-col items-center">
                       {previewFile.isLink ? (
                         <div className="py-6 space-y-4">
                           <i className="fab fa-google-drive text-5xl text-blue-600 animate-pulse"></i>
                           <h2 className="text-lg font-black uppercase italic">Link Google Drive</h2>
                           <a href={previewFile.url} target="_blank" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest shadow-xl text-[10px]">Buka Berkas</a>
                         </div>
                       ) : (
                         <iframe src={previewUrl!} className="w-full h-[50vh] rounded-2xl border border-slate-200" title="Admin Preview" />
                       )}
                    </div>
                 ) : (
                    <>
                       <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-200 border border-slate-100 shadow-inner">
                          <i className="fas fa-lock text-2xl"></i>
                       </div>
                       <div className="space-y-3 w-full">
                          <h2 className="text-lg font-[1000] text-slate-950 uppercase italic tracking-tighter leading-none">Detail Dokumen.</h2>
                          <div className="flex flex-col gap-1.5 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-left">
                             <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                <span className="text-slate-400">Nama:</span>
                                <span className="text-slate-900 truncate max-w-[140px]">{previewFile.name}</span>
                             </div>
                             <div className="h-px bg-slate-50"></div>
                             <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                <span className="text-slate-400">Ukuran:</span>
                                <span className="text-blue-600">{previewFile.isLink ? "Tautan" : getFileSize(previewFile.data)}</span>
                             </div>
                          </div>
                          <p className="text-[7px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">Keamanan Prioritas Utama Madrasah.</p>
                       </div>
                    </>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Hero Mini Stats */}
      <div className="bg-slate-950 p-5 md:p-12 rounded-[2rem] md:rounded-[4rem] text-white flex flex-col md:flex-row justify-between items-center gap-5 md:gap-10 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-24 -mt-24"></div>
        <div className="relative z-10 space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
             <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
             <h3 className="text-[8px] md:text-[11px] font-black text-blue-400 uppercase tracking-[0.3em]">Monitor Laporan GTK</h3>
          </div>
          <h4 className="text-2xl md:text-6xl font-[1000] italic uppercase tracking-tighter leading-none">{effectiveMonth} {effectiveYear}</h4>
        </div>
        <div className="relative z-10 flex items-center justify-around gap-6 bg-white/5 p-3 md:p-6 rounded-3xl border border-white/10 backdrop-blur-2xl w-full md:w-auto">
          <div className="text-center md:text-right">
             <p className="text-2xl md:text-7xl font-[1000] italic tracking-tighter leading-none">{stats.uploaded}<span className="text-blue-500 text-sm md:text-3xl font-black">/{stats.total}</span></p>
             <p className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Pegawai Sync</p>
          </div>
          <div className="w-14 h-14 md:w-24 md:h-24 rounded-full border-[4px] md:border-[6px] border-slate-900 flex items-center justify-center relative">
             <svg className="w-full h-full -rotate-90">
                <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-900" />
                <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-blue-500" strokeDasharray="260" strokeDashoffset={260 - (260 * stats.percent / 100)} strokeLinecap="round" />
             </svg>
             <span className="absolute text-[10px] md:text-lg font-black italic">{stats.percent}%</span>
          </div>
        </div>
      </div>

      {/* Search Input Mini */}
      <div className="px-1 md:px-0">
        <div className="relative w-full shadow-md rounded-2xl">
          <input type="text" placeholder="Cari NIP atau Nama..." className="w-full bg-white border border-slate-100 pl-10 pr-4 py-3.5 rounded-2xl text-[12px] md:text-lg font-[900] italic uppercase text-slate-950 outline-none focus:border-blue-600 transition-all placeholder:text-slate-300" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-xs md:text-base"></i>
        </div>
      </div>

      {/* Mobile-First Compact Grid */}
      <div className="flex flex-col gap-1.5 md:gap-0">
        {/* Desktop Header */}
        <div className="hidden md:block bg-white border border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden mb-4">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic border-b border-slate-100">
                <th className="px-8 py-6 text-center w-20">No</th>
                <th className="px-8 py-6">Identitas</th>
                <th className="px-8 py-6 text-center">Berkas</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-right">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center animate-pulse text-[10px] font-black text-slate-300 uppercase italic">Sinkronisasi Cloud...</td></tr>
              ) : filteredGTK.map((g, idx) => {
                const report = reportsMap[g.nip];
                const isUploaded = !!report;
                return (
                  <tr key={g.nip + idx} className={`hover:bg-blue-50/20 transition-all ${!isUploaded ? 'opacity-80' : ''}`}>
                    <td className="px-8 py-5 text-center font-mono text-xs text-slate-300">{(idx + 1).toString().padStart(2, '0')}</td>
                    <td className="px-8 py-5">
                      <p className={`text-sm font-black italic uppercase tracking-tight ${isUploaded ? 'text-slate-950' : 'text-slate-400'}`}>{g.nama}</p>
                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">{g.nip}</p>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex justify-center gap-2">
                         {isUploaded && report.files ? report.files.map((file: any, i: number) => (
                           <button key={i} onClick={() => setPreviewFile(file)} className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] shadow-md transition-all hover:scale-110 ${file.isLink ? 'bg-blue-600' : (file.type?.includes('excel') ? 'bg-emerald-600' : 'bg-rose-600')}`}><i className={`fas ${file.isLink ? 'fa-link' : (file.type?.includes('excel') ? 'fa-file-excel' : 'fa-file-pdf')}`}></i></button>
                         )) : <span className="text-[9px] text-slate-100 font-black">-</span>}
                       </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${isUploaded ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{isUploaded ? 'SYNC' : 'MISSING'}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={() => onUploadClick(g)} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase italic transition-all active:scale-95 ${isUploaded ? 'bg-white text-slate-300 border border-slate-100' : 'bg-slate-950 text-white shadow-lg'}`}>
                        {isUploaded ? 'Update' : 'Submit'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* COMPACT MOBILE CARDS - Rapat & Padat */}
        <div className="md:hidden flex flex-col gap-1.5">
          {loading ? (
            <div className="py-10 text-center animate-pulse text-[9px] font-black text-slate-200 uppercase tracking-[0.4em] italic">Awaiting Synchronizer...</div>
          ) : filteredGTK.map((g, idx) => {
            const report = reportsMap[g.nip];
            const isUploaded = !!report;
            return (
              <div key={g.nip + idx} className={`bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between transition-all active:scale-[0.98] ${!isUploaded ? 'opacity-70' : 'border-blue-50'}`}>
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-slate-50 text-slate-300 rounded-lg flex items-center justify-center font-black text-[9px] shrink-0 italic">{(idx+1).toString().padStart(2, '0')}</div>
                  <div className="min-w-0">
                    <h4 className={`font-black uppercase italic text-[11px] leading-tight truncate tracking-tight ${isUploaded ? 'text-slate-950' : 'text-slate-400'}`}>{g.nama}</h4>
                    <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest mt-0.5">{g.nip}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <div className="flex gap-1">
                    {isUploaded && report.files ? report.files.slice(0, 2).map((f: any, i: number) => (
                      <button key={i} onClick={() => setPreviewFile(f)} className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-[8px] shadow-sm ${f.isLink ? 'bg-blue-600' : (f.type?.includes('excel') ? 'bg-emerald-600' : 'bg-rose-600')}`}><i className={`fas ${f.isLink ? 'fa-link' : (f.type?.includes('excel') ? 'fa-file-excel' : 'fa-file-pdf')}`}></i></button>
                    )) : null}
                  </div>
                  <button onClick={() => onUploadClick(g)} className={`px-3 py-2 rounded-xl text-[8px] font-black uppercase italic transition-all border shadow-sm ${isUploaded ? 'bg-white text-slate-400 border-slate-100' : 'bg-slate-950 text-white'}`}>
                    {isUploaded ? 'Ubah' : 'Kirim'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="md:hidden h-20"></div>
    </div>
  );
};