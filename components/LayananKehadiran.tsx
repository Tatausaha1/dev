
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { db } from '../services/apiService.ts';
import { uploadKehadiran, subscribeToAttendance } from '../services/attendance.service.ts';
import { GTK_MASTER_DATA, DOWNLOAD_LINKS } from '../constants.ts';
import { UserRole } from '../types';

interface LayananKehadiranProps {
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

export const LayananKehadiran: React.FC<LayananKehadiranProps> = ({ userRole }) => {
  const { month: effectiveMonth, year: effectiveYear } = useMemo(() => getEffectivePeriod(), []);
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
  const [form, setForm] = useState({ nama: '', nip: '', periode: effectiveMonth, driveFolder: '' });
  const [docFiles, setDocFiles] = useState<Record<string, File | null>>({ presensi: null, uangMakan: null, tukin: null, emis: null });
  const [docLinks, setDocLinks] = useState<Record<string, string>>({ presensi: '', uangMakan: '', tukin: '', emis: '' });
  const [useLinkMode, setUseLinkMode] = useState<Record<string, boolean>>({ presensi: false, uangMakan: false, tukin: false, emis: false });

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentReports, setRecentReports] = useState<any[]>([]);
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
    const unsub = subscribeToAttendance((data) => setRecentReports(data));
    return () => unsub();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.nip) return alert("Pilih identitas pegawai.");
    
    const hasFiles = Object.values(docFiles).some(f => f !== null);
    const hasLinks = Object.entries(docLinks).some(([key, val]) => useLinkMode[key] && (val as string).trim() !== '');
    
    if (!hasFiles && !hasLinks) return alert("Minimal satu berkas atau link harus diisi.");

    setLoading(true);
    setUploadProgress(10);

    try {
      const filesToUpload = Object.entries(docFiles)
        .filter(([key, f]) => !useLinkMode[key] && f !== null)
        .map(([_, f]) => f as File);

      const linksPayload = Object.entries(docLinks)
        .filter(([key, val]) => useLinkMode[key] && (val as string).trim() !== '')
        .map(([key, val]) => ({ 
          category: key === 'presensi' ? 'Bukti Presensi Bulanan' : key === 'uangMakan' ? 'Daftar Uang Makan' : key === 'tukin' ? 'Capaian Kinerja (Tukin)' : 'Presensi Emis 4.0',
          name: 'Link Google Drive',
          url: val as string,
          isLink: true 
        }));

      setUploadProgress(40);
      await uploadKehadiran(filesToUpload, { ...form, periode: `${form.periode} ${effectiveYear}` }, linksPayload);
      
      setUploadProgress(100);
      setTimeout(() => {
        setSuccess(true);
        setDocFiles({ presensi: null, uangMakan: null, tukin: null, emis: null });
        setDocLinks({ presensi: '', uangMakan: '', tukin: '', emis: '' });
        setLoading(false);
        setTimeout(() => setSuccess(false), 3000);
      }, 500);
    } catch (err: any) {
      setLoading(false);
      setUploadProgress(0);
      alert(err.message);
    }
  };

  const filteredGTK = GTK_MASTER_DATA.filter(g => 
    g.nama.toLowerCase().includes(searchTerm.toLowerCase()) || g.nip.includes(searchTerm)
  );

  const FileSlot = ({ id, label, desc, icon }: { id: string, label: string, desc: string, icon: string }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const isLink = useLinkMode[id];
    const hasFile = !!docFiles[id];
    const hasLink = (docLinks[id] || '').trim() !== '';
    const isFilled = isLink ? hasLink : hasFile;

    return (
      <div className={`relative group p-4 md:p-6 rounded-[2.5rem] border-2 transition-all flex flex-col gap-3 min-h-[160px] md:min-h-[200px] shadow-sm ${
        isFilled 
          ? (isLink ? 'border-blue-500 bg-blue-50/40' : 'border-emerald-500 bg-emerald-50/40') 
          : 'border-slate-100 bg-white hover:border-slate-200'
      }`}>
        <div className="flex justify-between items-start">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isFilled ? (isLink ? 'bg-blue-600' : 'bg-emerald-600') : 'bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white'}`}>
              <i className={`fas ${isFilled ? 'fa-check' : icon} text-sm`}></i>
           </div>
           <button type="button" onClick={() => setUseLinkMode(prev => ({...prev, [id]: !prev[id]}))} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isLink ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`} title="Ganti Mode Link/File">
              <i className={`fas ${isLink ? 'fa-file-upload' : 'fa-link'} text-[10px]`}></i>
           </button>
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-[11px] md:text-[13px] font-black text-slate-950 uppercase italic leading-none">{label}</p>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">{desc}</p>
          <div className="pt-2">
            {isLink ? (
              <input type="url" placeholder="Paste link..." className="w-full bg-white/80 border border-blue-100 p-2.5 rounded-xl text-[10px] font-black outline-none focus:border-blue-500" value={docLinks[id]} onChange={e => setDocLinks(prev => ({...prev, [id]: e.target.value}))} />
            ) : (
              <div onClick={() => inputRef.current?.click()} className={`w-full p-2.5 rounded-xl text-[9px] font-black uppercase text-center cursor-pointer transition-all truncate border border-dashed ${hasFile ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                {hasFile ? docFiles[id]?.name : "Pilih File"}
                <input type="file" ref={inputRef} className="hidden" accept=".pdf,.xlsx,.xls" onChange={e => e.target.files?.[0] && setDocFiles(prev => ({...prev, [id]: e.target.files![0]}))} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Modal Pratinjau Berkas */}
      {previewFile && (
        <div className="fixed inset-0 z-[500] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-500">
           <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">
              <div className="p-6 md:p-8 bg-slate-950 text-white flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg"><i className="fas fa-file-invoice"></i></div>
                    <div>
                       <h3 className="text-sm font-black uppercase italic tracking-tighter leading-none">{previewFile.name}</h3>
                       <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mt-1">Status Berkas Digital</p>
                    </div>
                 </div>
                 <button onClick={() => setPreviewFile(null)} className="w-12 h-12 bg-white/10 rounded-2xl hover:bg-red-600 transition-all flex items-center justify-center"><i className="fas fa-times"></i></button>
              </div>
              <div className="flex-1 bg-slate-50 p-10 overflow-hidden flex flex-col items-center justify-center text-center space-y-6">
                 {isAdmin ? (
                    <div className="w-full h-full flex flex-col items-center">
                       {previewFile.isLink ? (
                         <div className="py-10 space-y-6">
                           <i className="fab fa-google-drive text-[100px] text-blue-600 animate-pulse"></i>
                           <h2 className="text-2xl font-black uppercase italic">Link Google Drive</h2>
                           <a href={previewFile.url} target="_blank" className="inline-block px-12 py-5 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl">Buka Link Utama</a>
                         </div>
                       ) : (
                         <iframe src={previewUrl!} className="w-full h-[50vh] rounded-2xl border border-slate-200" title="Admin Preview" />
                       )}
                    </div>
                 ) : (
                    <>
                       <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-slate-300 border border-slate-100 shadow-inner">
                          <i className="fas fa-lock text-3xl"></i>
                       </div>
                       <div className="space-y-4 w-full">
                          <h2 className="text-xl font-[1000] text-slate-950 uppercase italic tracking-tighter leading-none">Dokumen Terproteksi.</h2>
                          <div className="flex flex-col gap-2 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm text-left">
                             <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-slate-400">Nama File:</span>
                                <span className="text-slate-900 truncate max-w-[180px]">{previewFile.name}</span>
                             </div>
                             <div className="h-px bg-slate-50"></div>
                             <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-slate-400">Ukuran:</span>
                                <span className="text-blue-600">{previewFile.isLink ? "Tautan Cloud" : getFileSize(previewFile.data)}</span>
                             </div>
                          </div>
                       </div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-sm">Pratinjau konten dokumen hanya diizinkan untuk Admin demi alasan keamanan privasi.</p>
                    </>
                 )}
              </div>
           </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-3xl p-6 md:p-12 rounded-[3rem] border border-slate-200 shadow-2xl relative">
        <form onSubmit={handleUpload} className="space-y-10">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 space-y-6">
              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Cari Identitas</label>
                <div className="mt-3 relative">
                  <input type="text" placeholder="Ketik nama Anda..." className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-3xl text-slate-950 font-black italic uppercase text-sm outline-none focus:bg-white focus:border-blue-600 transition-all" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setForm({...form, nama: '', nip: '', driveFolder: ''}); setShowSuggestions(true); }} />
                  {showSuggestions && searchTerm && !form.nama && (
                    <div className="absolute top-full left-0 right-0 z-[100] mt-3 bg-white border border-slate-200 rounded-[2rem] shadow-2xl max-h-64 overflow-y-auto p-2">
                      {filteredGTK.map((g, i) => (
                        <button key={i} type="button" onClick={() => { setForm({...form, nama: g.nama, nip: g.nip, driveFolder: g.driveFolder || ''}); setSearchTerm(g.nama); setShowSuggestions(false); }} className="w-full text-left p-4 hover:bg-blue-600 hover:text-white rounded-2xl flex justify-between items-center transition-all">
                          <div>
                             <p className="text-[12px] font-black uppercase italic leading-none">{g.nama}</p>
                             <p className="text-[9px] font-bold opacity-50 uppercase tracking-widest mt-1">{g.nip}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {form.nama && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-3xl flex items-center justify-between animate-in slide-in-from-top-2">
                   <div>
                      <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">Shortcut Laporan</p>
                      <p className="text-[11px] font-black text-slate-900 uppercase italic">Folder Drive Pribadi</p>
                   </div>
                   <a href={form.driveFolder ? `https://drive.google.com/open?id=${form.driveFolder}` : DOWNLOAD_LINKS.GENERAL_UPLOAD} target="_blank" className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-90 transition-all">
                      <i className="fab fa-google-drive"></i> Akses Drive
                   </a>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                 <select value={form.periode} onChange={e => setForm({...form, periode: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-3xl text-[11px] font-black uppercase tracking-widest outline-none appearance-none">
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                 </select>
                 <input readOnly value={form.nip} className="bg-slate-100 border-2 border-slate-200 p-5 rounded-3xl text-slate-400 font-mono text-xs font-black" placeholder="NIP..." />
              </div>
            </div>
            <div className="lg:w-[300px] bg-slate-950 rounded-[3rem] p-10 text-white flex flex-col justify-center gap-6 border border-white/10 shadow-2xl">
              <div className="text-center"><h4 className="text-xl font-black uppercase italic tracking-tighter">Kirim Laporan</h4></div>
              <button disabled={loading} type="submit" className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 disabled:opacity-50">
                {loading ? <i className="fas fa-circle-notch fa-spin mr-2"></i> : <i className="fas fa-cloud-upload-alt mr-2"></i>}
                {loading ? 'Memproses...' : 'Kirim Berkas Sekarang'}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <FileSlot id="presensi" label="Presensi" desc="Log Kehadiran" icon="fa-file-invoice" />
            <FileSlot id="uangMakan" label="Uang Makan" desc="Daftar Konsumsi" icon="fa-utensils" />
            <FileSlot id="tukin" label="Tukin" desc="Capaian Kinerja" icon="fa-chart-pie" />
            <FileSlot id="emis" label="Emis" desc="Sync Data Emis" icon="fa-file-excel" />
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <h4 className="text-xl font-black uppercase italic text-slate-950 tracking-tighter px-6">Log Aktivitas Terbaru</h4>
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden overflow-x-auto no-scrollbar">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400">
              <tr>
                <th className="px-10 py-6">Nama Pegawai</th>
                <th className="px-10 py-6 text-center">Periode</th>
                <th className="px-10 py-6 text-center">Berkas (Klik Info)</th>
                <th className="px-10 py-6 text-right">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-900">
              {recentReports.map((r) => (
                <tr key={r.id} className="hover:bg-blue-50/40 transition-all group">
                  <td className="px-10 py-5">
                    <p className="font-black text-slate-950 italic text-[12px] uppercase mb-1">{r.nama}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{r.nip}</p>
                  </td>
                  <td className="px-10 py-5 text-center">
                    <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-lg uppercase italic tracking-tight">{r.periode.split(' ')[0]}</span>
                  </td>
                  <td className="px-10 py-5 text-center">
                     <div className="flex justify-center gap-2">
                       {r.files?.map((f: any, i: number) => (
                         <button key={i} onClick={() => setPreviewFile(f)} className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] transition-all hover:scale-110 shadow-lg ${f.isLink ? 'bg-blue-600' : (f.type?.includes('excel') ? 'bg-emerald-600' : 'bg-rose-600')}`} title={f.category}>
                           <i className={`fas ${f.isLink ? 'fa-link' : (f.type?.includes('excel') ? 'fa-file-excel' : 'fa-file-pdf')}`}></i>
                         </button>
                       ))}
                     </div>
                  </td>
                  <td className="px-10 py-5 text-right font-mono text-[10px] text-slate-300 italic">
                    {new Date(r.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
