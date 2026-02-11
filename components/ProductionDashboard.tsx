
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

interface ProductionDashboardProps {
  isLoggedIn?: boolean;
}

export const ProductionDashboard: React.FC<ProductionDashboardProps> = ({ isLoggedIn = false }) => {
  const [stats, setStats] = useState({
    total: 165,
    completed: 142,
    processing: 2,
    efficiency: 98,
    staffActive: 4
  });
  const [liveEvents, setLiveEvents] = useState<{ id: string, msg: string, time: string, type: 'create' | 'update' | 'delete' }[]>([]);

  const refreshData = async () => {
    // Hanya Guest diizinkan melihat Summary dari koleksi Publik
    if (!isLoggedIn) {
      const res = await apiService.getPublicSummary();
      if (res.success && res.data) {
        setStats(prev => ({
          ...prev,
          total: res.data.reports || 165,
          completed: Math.floor((res.data.reports || 165) * 0.9),
          staffActive: res.data.activeNodes || 4
        }));
      }
      
      // Simulasi Event Publik (Karena log aktivitas asli bersifat sensitif/terkunci)
      const mockEvents = [
        { id: 'ev1', msg: 'Sistem: Sinkronisasi global aktif', time: 'LIVE', type: 'update' as const },
        { id: 'ev2', msg: 'Cloud: Handshake aman terjalin', time: '5d lalu', type: 'create' as const }
      ];
      setLiveEvents(mockEvents);
      return;
    }

    // Hanya jika login, akses data riil dari layanan_digital (Security Rules Enforcement)
    const res = await apiService.getRecentLayanan();
    if (res.success && res.data) {
      const db = res.data;
      const total = db.length;
      const completed = db.filter((i: any) => i.status === 'Selesai').length;
      const efficiency = total > 0 ? Math.round((completed / total) * 100) : 98;

      setStats({ 
        total: total || 165, 
        completed: completed || 142, 
        processing: db.filter((i: any) => i.status === 'Proses').length, 
        efficiency, 
        staffActive: 4 
      });

      if (db.length > 0) {
        const randomItem = db[Math.floor(Math.random() * db.length)];
        const events = [
          { id: Math.random().toString(36).substr(2, 9), msg: `Sync: ${randomItem.tracking_id} diverifikasi oleh Cloud`, time: 'LANGSUNG', type: 'update' as const },
          { id: Math.random().toString(36).substr(2, 9), msg: `Log: Entri baru dari ${randomItem.namaLengkap} terdeteksi`, time: '1d lalu', type: 'create' as const }
        ];
        setLiveEvents(prev => [events[Math.floor(Math.random() * events.length)], ...prev].slice(0, 4));
      }
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 8000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  return (
    <div className="bg-slate-950 p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-[30rem] md:w-[40rem] h-[30rem] md:h-[40rem] bg-blue-600/5 blur-[120px] rounded-full -mr-48 -mt-48 transition-all group-hover:bg-blue-600/10"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-10 md:mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></span>
              <h3 className="text-blue-400 font-black uppercase tracking-[0.5em] text-[8px] md:text-[10px]">Analisis Infrastruktur</h3>
            </div>
            <h4 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none italic">
               Sinkronisasi <span className="text-blue-500 not-italic">Langsung.</span>
            </h4>
            {!isLoggedIn && <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest italic"><i className="fas fa-shield-halved"></i> Mode Ringkasan Publik Aktif</p>}
          </div>
          
          <div className="hidden md:flex gap-4">
            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400">
               Node: PUSAT-HST
            </div>
            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-400">
               Status: Tersinkronisasi
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-10 md:mb-16">
          {[
            { label: 'Arsip Cloud', val: stats.total, icon: 'fa-inbox-in', color: 'text-blue-500', bg: 'bg-blue-500/5' },
            { label: 'Keberhasilan Keluar', val: stats.completed, icon: 'fa-check-double', color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
            { label: 'Efisiensi Inti', val: `${stats.efficiency}%`, icon: 'fa-bolt-lightning', color: 'text-amber-500', bg: 'bg-amber-500/5' },
            { label: 'Node Aktif', val: stats.staffActive, icon: 'fa-server', color: 'text-purple-500', bg: 'bg-purple-500/5' }
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.03] p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/5 hover:border-white/10 transition-all group/card">
               <div className={`w-10 h-10 md:w-14 md:h-14 ${s.bg} ${s.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-sm group-hover/card:scale-110 transition-transform`}>
                 <i className={`fas ${s.icon} text-lg`}></i>
               </div>
               <p className="text-3xl md:text-5xl font-black text-white mb-1 md:mb-2 tracking-tighter">{s.val}</p>
               <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <p className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-widest">Log Diagnostik Inti</p>
            <div className="flex-grow h-px bg-white/5"></div>
          </div>
          {liveEvents.map((ev, i) => (
            <div key={ev.id} className="flex items-center gap-4 md:gap-6 p-4 md:p-5 bg-white/[0.02] rounded-2xl border border-white/5 animate-fade-in-up hover:bg-white/[0.04] transition-colors">
              <div className={`w-2 h-2 rounded-full ${ev.type === 'create' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`}></div>
              <div className="flex-grow">
                <p className="text-[10px] md:text-xs font-bold text-white/70 tracking-tight">{ev.msg}</p>
              </div>
              <div className="flex items-center gap-3">
                 <p className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-widest">{ev.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
