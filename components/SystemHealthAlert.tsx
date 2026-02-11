
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

export const SystemHealthAlert: React.FC = () => {
  const [health, setHealth] = useState<{ healthy: boolean; error?: string }>({ healthy: true });
  const [isFixing, setIsFixing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [lastCheck, setLastCheck] = useState<string>('');
  const [repairStatus, setRepairStatus] = useState<'idle' | 'working' | 'success'>('idle');

  const checkHealth = async () => {
    const status = await apiService.checkDatabaseHealth();
    setHealth(status);
    setLastCheck(new Date().toLocaleTimeString());
    
    // Hanya tampilkan jika error selain "resource-exhausted"
    if (!status.healthy && !status.error?.includes('resource-exhausted')) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); 
    const unsubscribe = apiService.subscribe(checkHealth);
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleFix = async () => {
    setIsFixing(true);
    setRepairStatus('working');
    try {
      const res = await apiService.initializeDatabase();
      if (res.success) {
        setRepairStatus('success');
        setHealth({ healthy: true });
        setTimeout(() => {
          setVisible(false);
          setRepairStatus('idle');
        }, 3000);
      } else {
        alert("Gagal melakukan perbaikan otomatis: " + res.error);
        setRepairStatus('idle');
      }
    } catch (e) {
      alert("Terjadi kesalahan fatal saat perbaikan.");
      setRepairStatus('idle');
    } finally {
      setIsFixing(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] w-[95%] max-w-3xl animate-in slide-in-from-top-4 duration-500">
      <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_30px_70px_-20px_rgba(220,38,38,0.3)] border-2 border-red-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
           <i className="fas fa-server text-9xl text-red-600"></i>
        </div>

        <div className="bg-red-600 p-5 flex items-center justify-between text-white transition-colors duration-500" style={{ backgroundColor: repairStatus === 'success' ? '#10b981' : '#dc2626' }}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
               <i className={`fas ${repairStatus === 'success' ? 'fa-check' : 'fa-wifi-slash'}`}></i>
            </div>
            <div>
               <span className="text-[10px] font-black uppercase tracking-[0.3em] block">
                 {repairStatus === 'success' ? 'Database Re-Synchronized' : 'System Connectivity Sync Error'}
               </span>
               <p className="text-[9px] font-bold opacity-70 italic uppercase">
                 {repairStatus === 'working' ? 'Writing Core Tables...' : repairStatus === 'success' ? 'Ready to Login' : 'Diagnosing Cloud Nodes...'}
               </p>
            </div>
          </div>
          <button onClick={() => setVisible(false)} className="w-10 h-10 bg-black/10 rounded-full hover:bg-black/20 transition-all">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
             <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-600 shrink-0 border border-red-100 shadow-inner transition-colors duration-500" style={{ backgroundColor: repairStatus === 'success' ? '#f0fdf4' : '', color: repairStatus === 'success' ? '#10b981' : '' }}>
               <i className={`fas ${repairStatus === 'success' ? 'fa-user-shield' : 'fa-database'} text-4xl`}></i>
             </div>
             <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-red-50">
                <i className={`fas ${repairStatus === 'success' ? 'fa-check-circle text-emerald-500' : 'fa-search-nodes text-red-600'} text-sm`}></i>
             </div>
          </div>
          <div className="flex-grow text-center md:text-left space-y-3">
            <h4 className="text-2xl font-[1000] text-slate-950 italic tracking-tighter uppercase leading-none">
              {repairStatus === 'success' ? 'Perbaikan Selesai.' : 'Database Terputus.'}
            </h4>
            <p className="text-sm font-bold text-slate-500 leading-relaxed max-w-md">
              {repairStatus === 'success' 
                ? 'Akun Admin default (PIN: 2024) telah dibuat. Anda sekarang bisa masuk ke Panel Kontrol.' 
                : 'Sistem tidak dapat memverifikasi tabel operasional. Klik tombol di samping untuk memperbaiki skema database dan membuat akun admin.'}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 justify-center md:justify-start">
               <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-lg text-slate-400 uppercase tracking-widest">Node: CENTRAL-HST-01</span>
               <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${repairStatus === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                 Status: {repairStatus === 'success' ? 'Online' : 'Offline'}
               </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
             <button 
               onClick={handleFix}
               disabled={isFixing || repairStatus === 'success'}
               className={`px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-4 shrink-0 ${
                 isFixing ? 'bg-slate-100 text-slate-400' : 
                 repairStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-950 text-white hover:bg-blue-600 shadow-blue-500/20 active:scale-95 italic'
               }`}
             >
               {isFixing ? <i className="fas fa-circle-notch fa-spin"></i> : <i className={`fas ${repairStatus === 'success' ? 'fa-check' : 'fa-bolt-lightning'}`}></i>}
               {isFixing ? 'RE-SYNCING...' : repairStatus === 'success' ? 'REPAIRED' : 'INIT REPAIR'}
             </button>
             <button onClick={checkHealth} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Coba Hubungkan Lagi</button>
          </div>
        </div>
        
        <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <i className="fas fa-terminal"></i> {health.error || "Protokol: Force Long Polling Active"}
          </p>
          <div className="flex items-center gap-4">
             <p className="text-[9px] font-black text-slate-300 uppercase italic">Last Diagnostic: {lastCheck}</p>
             <div className="flex gap-1.5">
               <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_#ef4444] ${repairStatus === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
               <div className={`w-2 h-2 rounded-full opacity-30 ${repairStatus === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
