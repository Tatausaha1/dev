import React, { useState, useRef, useEffect, useMemo } from 'react';
import { apiService } from '../../../services/apiService.ts';
import { GTK_MASTER_DATA, DOWNLOAD_LINKS } from '../../../constants.ts';

interface GTKReportFormProps {
  onClose: () => void;
  db: any;
  editingReport?: any; 
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

export const GTKReportForm: React.FC<GTKReportFormProps> = ({ onClose, editingReport }) => {
  const { month: effMonth, year: effYear } = useMemo(() => getEffectivePeriod(), []);
  
  const [formData, setFormData] = useState({
    nama: '', nip: '', jabatan: '', judulLaporan: effMonth, tahun: effYear, isiLaporan: 'Input Mandiri', driveFolder: ''
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categorizedFiles, setCategorizedFiles] = useState<any>({ presensi: null, uangMakan: null, tukin: null, emis: null });
  const [useLinkMode, setUseLinkMode] = useState<any>({ presensi: false, uangMakan: false, tukin: false, emis: false });
  const [docLinks, setDocLinks] = useState<any>({ presensi: '', uangMakan: '', tukin: '', emis: '' });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(file.type)) {
      alert("Gunakan file PDF atau Excel saja.");
      e.target.value = '';
      return;
    }

    if (file.size > 700 * 1024) {
      alert("File terlalu besar (>700KB). Gunakan folder Google Drive untuk file besar.");
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCategorizedFiles((prev: any) => ({ 
        ...prev, 
        [category]: { data: reader.result as string, name: file.name, type: file.type, isLink: false } 
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) return alert("Pilih nama Anda terlebih dahulu.");
    
    const finalFiles: any[] = [];
    ['presensi', 'uangMakan', 'tukin', 'emis'].forEach(cat => {
      const label = cat === 'presensi' ? 'Presensi Bulanan' : cat === 'uangMakan' ? 'Daftar Makan' : cat === 'tukin' ? 'Kinerja Tukin' : 'Data Emis';
      if (useLinkMode[cat] && docLinks[cat].trim()) {
        finalFiles.push({ category: label, name: 'Link Google Drive', url: docLinks[cat], isLink: true });
      } else if (categorizedFiles[cat]) {
        finalFiles.push({ ...categorizedFiles[cat], category: label });
      }
    });

    if (finalFiles.length === 0) return alert("Pilih minimal satu file untuk dikirim.");

    setLoading(true);
    try {
      const payload = { ...formData, files: finalFiles, fileCount: finalFiles.length, updated_at: new Date().toISOString() };
      if (editingReport) await apiService.updateGTKReport(editingReport.id, payload);
      else await apiService.submitGTKReport(payload);
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    } catch (err: any) { 
      setLoading(false);
      alert("Gagal mengirim berkas: " + err.message); 
    }
  };

  const filteredGTK = GTK_MASTER_DATA.filter(g => 
    g.nama.toLowerCase().includes(searchTerm.toLowerCase()) || g.nip.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-3 animate-in overflow-hidden">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col max-h-[95vh]">
        
        <div className="p-5 bg-slate-950 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><i className="fas fa-upload text-sm"></i></div>
            <div>
               <h3 className="text-sm font-black uppercase italic tracking-tight">Unggah Berkas</h3>
               <p className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mt-1">Laporan Mandiri GTK</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/10 rounded-xl active:scale-90"><i className="fas fa-times text-sm"></i></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 no-scrollbar space-y-6">
          {success ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-emerald-100">
                <i className="fas fa-check-double text-3xl"></i>
              </div>
              <h4 className="text-xl font-[1000] uppercase italic text-slate-900 tracking-tighter">Berhasil Dikirim.</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Data telah disimpan di server.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Cari Nama Anda</label>
                <div className="mt-2 relative">
                  <input type="text" placeholder="Ketik nama atau NIP..." className="w-full bg-slate-50 border-2 border-slate-100 p-5 pl-14 rounded-3xl font-black italic uppercase text-xs outline-none focus:bg-white focus:border-blue-600 transition-all shadow-inner" value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setFormData({...formData, nama: ''}); setShowSuggestions(true); }} />
                  <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"></i>
                </div>
                
                {showSuggestions && searchTerm && !formData.nama && (
                  <div className="absolute top-full left-0 right-0 z-[60] mt-3 bg-white border border-slate-200 rounded-3xl shadow-2xl max-h-48 overflow-y-auto p-2 space-y-1">
                    {filteredGTK.map((g, i) => (
                      <button key={i} type="button" onClick={() => { setFormData({...formData, nama: g.nama, nip: g.nip, jabatan: g.jabatan, driveFolder: g.driveFolder || ''}); setSearchTerm(g.nama); setShowSuggestions(false); }} className="w-full text-left p-4 hover:bg-blue-600 hover:text-white rounded-2xl transition-all">
                        <p className="text-[11px] font-black uppercase leading-none">{g.nama.split(',')[0]}</p>
                        <p className="text-[9px] font-bold opacity-50 uppercase mt-1">{g.nip}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {formData.nama && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-3xl flex items-center justify-between animate-in zoom-in-95">
                  <div>
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">Alternatif Protokol</p>
                    <p className="text-[11px] font-black text-slate-900 uppercase italic">Gunakan Folder Drive Pribadi</p>
                  </div>
                  <a 
                    href={formData.driveFolder ? `https://drive.google.com/open?id=${formData.driveFolder}` : DOWNLOAD_LINKS.GENERAL_UPLOAD} 
                    target="_blank" 
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-950 transition-all active:scale-90 flex items-center gap-2"
                  >
                    <i className="fab fa-google-drive"></i> Buka Folder
                  </a>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Pilih File Laporan</p>
                {['presensi', 'uangMakan', 'tukin', 'emis'].map(cat => (
                  <div key={cat} className={`p-4 rounded-3xl border-2 transition-all flex items-center gap-4 ${ (useLinkMode[cat] ? docLinks[cat].trim() : categorizedFiles[cat]) ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-100'}`}>
                    <div className="flex-1 min-w-0">
                       <p className="text-[11px] font-black uppercase text-slate-950 italic">
                         {cat === 'presensi' ? 'Presensi Bulanan' : cat === 'uangMakan' ? 'Daftar Makan' : cat === 'tukin' ? 'Kinerja Tukin' : 'Data Emis'}
                       </p>
                       {useLinkMode[cat] ? (
                         <input type="url" placeholder="Tempel link Google Drive..." className="w-full bg-white mt-2 p-2 px-3 rounded-xl border border-blue-200 text-[10px] font-bold outline-none" value={docLinks[cat]} onChange={e => setDocLinks({...docLinks, [cat]: e.target.value})} />
                       ) : (
                         <p className="text-[10px] font-bold text-slate-400 truncate mt-1.5">{categorizedFiles[cat]?.name || 'Format: PDF / Excel'}</p>
                       )}
                    </div>
                    <div className="flex gap-2">
                       <button type="button" onClick={() => setUseLinkMode({...useLinkMode, [cat]: !useLinkMode[cat]})} className={`w-10 h-10 rounded-xl flex items-center justify-center text-[12px] transition-all shadow-sm ${useLinkMode[cat] ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`} title="Pindah ke Link Drive">
                          <i className={`fas ${useLinkMode[cat] ? 'fa-file-upload' : 'fa-link'}`}></i>
                       </button>
                       {!useLinkMode[cat] && (
                         <label className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center cursor-pointer shadow-lg active:scale-90">
                            <i className="fas fa-upload text-[11px]"></i>
                            <input type="file" className="hidden" accept=".pdf,.xls,.xlsx" onChange={e => handleFileChange(e, cat)} />
                         </label>
                       )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button disabled={loading} type="submit" className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-[1000] uppercase text-[11px] tracking-widest shadow-xl hover:bg-slate-950 transition-all active:scale-95 italic flex items-center justify-center gap-3">
                  {loading ? 'Sedang Mengirim...' : 'Kirim Berkas Sekarang'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
