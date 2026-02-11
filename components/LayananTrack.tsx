
import React, { useState } from 'react';
import { apiService } from '../services/apiService.ts';

export const LayananTrack: React.FC = () => {
  const [trackId, setTrackId] = useState('');
  const [trackResult, setTrackResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!trackId.trim()) return;
    setLoading(true);
    setTrackResult(null);
    const res = await apiService.trackLayanan(trackId.trim());
    if (res.success) setTrackResult(res.data);
    else alert("Nomor Lacak tidak ditemukan.");
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 md:py-24 px-2">
      <div className="relative mb-8 shadow-xl rounded-3xl overflow-hidden border-2 border-slate-100">
        <input 
          type="text" 
          value={trackId} 
          onChange={(e) => setTrackId(e.target.value.toUpperCase())} 
          onKeyDown={(e) => e.key === 'Enter' && handleTrack()} 
          placeholder="Masukkan Nomor Lacak..." 
          className="w-full p-5 md:p-8 bg-white text-base md:text-3xl font-[1000] text-slate-950 outline-none focus:bg-slate-50 transition-all text-center italic uppercase tracking-tighter" 
        />
        <button 
          onClick={handleTrack} 
          className="w-full md:absolute md:right-2 md:top-2 md:bottom-2 md:w-auto px-10 py-4 bg-slate-950 text-white font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all active:scale-95 italic"
        >
          {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Cek Status'}
        </button>
      </div>

      {trackResult && (
        <div className="bg-white rounded-[2rem] p-6 md:p-12 shadow-2xl border border-blue-50 animate-in zoom-in-95 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
          <p className="text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em]">Data Sinkronisasi Berhasil</p>
          <h4 className="text-2xl md:text-5xl font-[1000] text-slate-950 mb-6 italic uppercase tracking-tighter leading-tight">
            {trackResult.namaLengkap || trackResult.nama_lengkap}
          </h4>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
             <div className="px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-[11px] font-black uppercase tracking-widest border border-emerald-100 italic flex items-center gap-2">
                <i className="fas fa-check-double text-[10px]"></i> Status: {trackResult.status}
             </div>
             <p className="text-[9px] font-black text-slate-300 digital-font uppercase">
               Nodes Updated: {trackResult.updated_at?.toMillis ? new Date(trackResult.updated_at.toMillis()).toLocaleString('id-ID') : '-'}
             </p>
          </div>
        </div>
      )}
    </div>
  );
};
