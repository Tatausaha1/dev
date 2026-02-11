
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from '../services/apiService.ts';

interface RecentActivityProps {
  isLoggedIn?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ isLoggedIn = false }) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(!isLoggedIn);
  
  const [titles, setTitles] = useState({
    badge: 'Live Activity Hub',
    main: 'Aktivitas Terbaru.',
    sub: 'Sinkronisasi Cloud Aktif',
    report_label: 'Arsip Laporan'
  });

  useEffect(() => {
    // Hanya mencoba query data operasional jika user telah login (Mematuhi Security Rules)
    if (!isLoggedIn) {
      setPermissionError(true);
      setLoading(false);
      return;
    }

    // 1. Fetch UI Titles
    const qTitles = query(collection(db, "system_config"), where("id_config", "==", "recent_activity_ui"), limit(1));
    const unsubTitles = onSnapshot(qTitles, (sn) => {
      if (!sn.empty) {
        const d = sn.docs[0].data();
        setTitles({
          badge: d.badge_text || 'Live Activity Hub',
          main: d.main_title || 'Aktivitas Terbaru.',
          sub: d.sub_title || 'Sinkronisasi Cloud Aktif',
          report_label: d.report_label || 'Arsip Laporan'
        });
      }
    }, (err) => { /* Silently ignore permission errors */ });

    // 2. Fetch Latest GTK Reports
    const qAct = query(collection(db, "laporanGTK"), orderBy("timestamp", "desc"), limit(6));
    const unsubAct = onSnapshot(qAct, (snapshot) => {
      setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
      setPermissionError(false);
    }, (err) => {
      if (err.code === 'permission-denied') setPermissionError(true);
      setLoading(false);
    });

    return () => { unsubTitles(); unsubAct(); };
  }, [isLoggedIn]);

  if (loading && !permissionError) return null;

  return (
    <div className="py-12 md:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{titles.badge}</p>
            </div>
            <h3 className="text-3xl md:text-5xl font-[1000] text-slate-950 uppercase italic tracking-tighter">
              {titles.main.split(' ')[0]} <span className="text-blue-600">{titles.main.split(' ').slice(1).join(' ')}</span>
            </h3>
            {!isLoggedIn && <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest italic flex items-center gap-2"><i className="fas fa-shield-check"></i> Mode Privasi Publik Aktif</p>}
          </div>
          <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 hidden md:block">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{titles.sub}</p>
          </div>
        </div>

        {permissionError ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-12 md:p-20 text-center space-y-6">
             <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-slate-200 border border-slate-100">
                <i className="fas fa-lock text-3xl"></i>
             </div>
             <div className="space-y-2">
                <h4 className="text-xl font-black uppercase italic text-slate-900 tracking-tighter">Log Aktivitas Terproteksi.</h4>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-md mx-auto">
                   Detail aktivitas operasional madrasah disembunyikan demi alasan privasi. Silakan masuk untuk melihat log aktivitas lengkap.
                </p>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((item, idx) => (
              <div 
                key={item.id} 
                className="group bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-500 animate-in slide-in-from-bottom-4"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <i className="fas fa-file-circle-check text-lg"></i>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100">
                       <i className="fas fa-check-double"></i> Verified
                     </span>
                     <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-2">
                       {item.timestamp?.toMillis ? new Date(item.timestamp.toMillis()).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Baru saja'}
                     </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-black text-slate-950 italic tracking-tight truncate group-hover:text-blue-700 transition-colors">
                      {item.nama}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 font-mono">
                      ID: {item.nip}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{titles.report_label}</p>
                      <p className="text-xs font-black text-slate-800 uppercase italic">{item.judulLaporan}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
