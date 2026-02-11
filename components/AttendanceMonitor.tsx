import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, where, onSnapshot, limit, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from '../services/apiService.ts';
import { GTK_MASTER_DATA } from '../constants.ts';
import { UserRole } from '../types';

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
  const [isExpanded, setIsExpanded] = useState(false);

  const isLoggedIn = userRole && userRole !== 'GUEST';

  useEffect(() => {
    if (!isLoggedIn) {
        setLoading(false);
        return;
    }

    // Gunakan limit agar browser tidak mendownload terlalu banyak data Base64 sekaligus
    const q = query(
      collection(db, "laporanGTK"),
      where("judulLaporan", "==", effectiveMonth),
      where("tahun", "==", effectiveYear),
      orderBy("timestamp", "desc"),
      limit(50) // Batasi 50 laporan terbaru untuk monitoring cepat
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data: Record<string, any> = {};
      snapshot.forEach((doc) => {
        const report = doc.data();
        if (report.nip) data[report.nip] = { id: doc.id, ...report };
      });
      setReportsMap(data);
      setLoading(false);
    }, (error) => {
      console.error("Monitor Error:", error);
      setLoading(false);
    });

    return () => unsub();
  }, [isLoggedIn, effectiveMonth, effectiveYear]);

  const filteredGTK = useMemo(() => {
    return GTK_MASTER_DATA.filter(g => 
      g.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
      g.nip.includes(searchTerm)
    );
  }, [searchTerm]);

  const displayedGTK = useMemo(() => {
    return isExpanded ? filteredGTK : filteredGTK.slice(0, 10);
  }, [filteredGTK, isExpanded]);

  if (!isLoggedIn) {
      return (
        <div className="w-full p-12 bg-slate-900 rounded-[3rem] border border-white/5 text-center space-y-6 shadow-2xl">
           <div className="w-20 h-20 bg-blue-600/10 text-blue-500 rounded-[2.2rem] flex items-center justify-center mx-auto border border-blue-500/10"><i className="fas fa-shield-halved text-3xl"></i></div>
           <div className="space-y-2">
              <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Akses Terbatas.</h4>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">Silakan masuk ke akun Anda untuk memantau status sinkronisasi berkas GTK secara real-time.</p>
           </div>
        </div>
      );
  }

  const stats = {
    total: GTK_MASTER_DATA.length,
    uploaded: Object.keys(reportsMap).length,
    percent: Math.round((Object.keys(reportsMap).length / GTK_MASTER_DATA.length) * 100)
  };

  return (
    <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-slate-950 p-6 md:p-8 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
             <i className="fas fa-satellite-dish text-blue-400 animate-pulse"></i>
          </div>
          <div>
            <h3 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">Status Sinkronisasi</h3>
            <h4 className="text-xl md:text-3xl font-black italic uppercase leading-none">{effectiveMonth} {effectiveYear}</h4>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center gap-6 mt-6 md:mt-0 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
           <div className="text-right">
              <p className="text-2xl font-black italic text-blue-400 leading-none">{stats.uploaded}<span className="text-slate-500 text-xs font-bold ml-1">/ {stats.total}</span></p>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Pegawai Terverifikasi</p>
           </div>
           <div className="h-10 w-px bg-white/10"></div>
           <div className="text-center font-black italic text-xl">
              {stats.percent}%
           </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-100">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari Nama atau NIP..." 
              className="w-full bg-white border border-slate-200 px-12 py-3.5 rounded-2xl text-[12px] font-bold text-slate-900 outline-none focus:border-blue-500 shadow-sm" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-slate-50">
          {displayedGTK.map((g, idx) => {
            const report = reportsMap[g.nip];
            const isUploaded = !!report;
            return (
              <div key={g.nip + idx} className={`px-6 py-4 flex items-center justify-between gap-4 transition-all hover:bg-slate-50 ${!isUploaded ? 'opacity-60 bg-slate-50/30' : 'bg-white'}`}>
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <span className="text-[10px] font-black text-slate-200 italic shrink-0 w-6">{(idx+1).toString().padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <h4 className={`text-sm font-black uppercase italic truncate tracking-tight ${isUploaded ? 'text-slate-900' : 'text-slate-400'}`}>{g.nama}</h4>
                    <p className="text-[9px] font-bold text-slate-400 leading-none mt-1 font-mono uppercase">{g.nip}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                   {isUploaded ? (
                     <span className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black border border-emerald-100 italic">
                       <i className="fas fa-check-circle"></i> SYNCED
                     </span>
                   ) : (
                     <span className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black border border-amber-100 italic">
                       <i className="fas fa-clock"></i> PENDING
                     </span>
                   )}
                   <button 
                     onClick={() => onUploadClick(g)} 
                     className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-md active:scale-90 ${isUploaded ? 'bg-white text-slate-400 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600' : 'bg-slate-950 text-white hover:bg-blue-600'}`}
                   >
                     <i className={`fas ${isUploaded ? 'fa-edit' : 'fa-plus'} text-xs`}></i>
                   </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredGTK.length > 10 && (
           <button onClick={() => setIsExpanded(!isExpanded)} className="w-full py-4 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-all italic border-t border-slate-100">
             {isExpanded ? 'Sembunyikan Daftar' : `Lihat Semua Pegawai (${filteredGTK.length})`}
           </button>
        )}
      </div>
    </div>
  );
};