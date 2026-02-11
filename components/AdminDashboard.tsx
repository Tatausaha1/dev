
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  limit, 
  orderBy,
  getDocs,
  writeBatch
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { apiService, db as firestoreDb, deepSanitize } from '../services/apiService.ts';
import { QueueManager } from './QueueManager.tsx';
import { StatusBadge } from '../Common.tsx';

interface AdminDashboardProps {
  onClose: () => void;
  onLogout: () => void;
  db: any;
  user: { nama: string; role: string };
}

type AdminTab = 'gtk_master' | 'files' | 'pengumuman' | 'informasi' | 'schedule' | 'queue' | 'explorer' | 'system' | 'users' | 'lomba';

const COLLECTIONS = [
  { id: 'participants', label: 'Peserta', icon: 'fa-palette' },
  { id: 'layanan_digital', label: 'Antrean', icon: 'fa-concierge-bell' },
  { id: 'laporanGTK', label: 'Arsip', icon: 'fa-file-invoice' },
  { id: 'gtk_master', label: 'Pegawai', icon: 'fa-users-rectangle' },
  { id: 'users', label: 'Akun', icon: 'fa-user-shield' },
  { id: 'pengumuman', label: 'Berita', icon: 'fa-bullhorn' },
  { id: 'informasi', label: 'Ticker', icon: 'fa-comment-dots' },
  { id: 'piket_schedule', label: 'Piket', icon: 'fa-calendar-alt' }
];

const safeStringify = (obj: any, indent = 2) => {
  const cache = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) return '[Circular]';
      cache.add(value);
    }
    return value;
  }, indent);
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onLogout, db, user }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('lomba');
  const [dbData, setDbData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [modalType, setModalType] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribers = COLLECTIONS.map(col => {
      const q = query(collection(db, col.id), orderBy("timestamp", "desc"), limit(500));
      return onSnapshot(q, (sn) => {
        setDbData(prev => ({ ...prev, [col.id]: sn.docs.map(d => ({ id: d.id, ...deepSanitize(d.data()) })) }));
      });
    });
    return () => unsubscribers.forEach(u => u());
  }, [db]);

  useEffect(() => {
    apiService.checkDatabaseHealth().then(setHealthStatus);
  }, [activeTab]);

  const handlePreviewFile = (file: any) => {
    if (file.isLink) { setPreviewFile(file); return; }
    const arr = file.data.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    setPreviewUrl(URL.createObjectURL(new Blob([u8arr], { type: mime })));
    setPreviewFile(file);
  };

  const renderContent = () => {
    const colIdMap: Record<string, string> = {
      lomba: 'participants', pengumuman: 'pengumuman', informasi: 'informasi',
      schedule: 'piket_schedule', gtk_master: 'gtk_master', files: 'laporanGTK',
      users: 'users', queue: 'queue'
    };
    const colId = colIdMap[activeTab] || 'participants';
    const list = (dbData[colId] || []).filter(i => 
      (i.nama || i.judul || i.nama_petugas || i.username || i.teks || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-0.5">
            <h2 className="text-[18px] md:text-[22px] font-[1000] text-white uppercase italic tracking-tighter leading-none">
              Modul {activeTab === 'lomba' ? 'Kompetisi' : activeTab.replace('_', ' ')}.
            </h2>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Total: {list.length} Entri Terdeteksi</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <input type="text" placeholder="Cari..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 h-9 px-4 rounded-xl text-[11px] text-white outline-none focus:border-blue-500" />
            </div>
            {['gtk_master', 'pengumuman', 'informasi', 'schedule', 'users'].includes(activeTab) && (
              <button onClick={() => { setModalType(activeTab); setEditingItem(null); }} className="h-9 px-4 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase italic active:scale-95 transition-all">Tambah</button>
            )}
            <button onClick={() => apiService.notifyUpdate()} className="h-9 w-9 bg-white/5 text-slate-400 rounded-xl flex items-center justify-center hover:text-white transition-all"><i className="fas fa-sync-alt text-xs"></i></button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest italic">
              <tr>
                <th className="px-6 py-4">Identitas / Informasi</th>
                <th className="px-6 py-4 text-center">Status / Aset</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-900">
              {list.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="px-6 py-3.5">
                    <p className="font-black italic text-[14px] md:text-[15px] uppercase leading-[1.2] text-slate-950 truncate max-w-[200px] md:max-w-md">
                      {item.nama || item.judul || item.nama_petugas || item.username || item.teks}
                    </p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5 truncate">
                      {item.nip || item.kelas || item.category || (item.aktif ? 'Online' : 'Offline')}
                    </p>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    {activeTab === 'lomba' ? (
                      <div className="flex justify-center gap-1.5 scale-90">
                        <a href={item.idCardLink} target="_blank" className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-md hover:scale-105 transition-all"><i className="fas fa-id-card text-[10px]"></i></a>
                        <a href={item.lanyardLink} target="_blank" className="w-8 h-8 bg-slate-950 text-white rounded-lg flex items-center justify-center shadow-md hover:scale-105 transition-all"><i className="fas fa-ribbon text-[10px]"></i></a>
                      </div>
                    ) : activeTab === 'files' ? (
                      <div className="flex justify-center gap-1.5">
                        {item.files?.slice(0, 3).map((f: any, i: number) => (
                          <button key={i} onClick={() => handlePreviewFile(f)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[9px] shadow-sm ${f.isLink ? 'bg-blue-600' : 'bg-rose-600'}`}><i className={`fas ${f.isLink ? 'fa-link' : 'fa-file-pdf'}`}></i></button>
                        ))}
                      </div>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-[8px] font-black uppercase italic border border-slate-200">
                        {item.role || item.status || item.kategori || 'AKTIF'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-right whitespace-nowrap space-x-1.5">
                    <button className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><i className="fas fa-edit text-[10px]"></i></button>
                    <button onClick={() => apiService.deleteDocument(colId, item.id)} className="w-8 h-8 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-600 hover:text-white transition-all"><i className="fas fa-trash-alt text-[10px]"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[400] bg-slate-950 flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-500">
      {/* SIDEBAR RAMPAI */}
      <aside className="hidden md:flex w-64 bg-black/40 border-r border-white/5 flex-col py-8 px-5 backdrop-blur-3xl shrink-0 overflow-y-auto no-scrollbar">
        <div className="flex items-center gap-3 mb-10 px-2">
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20"><i className="fas fa-shield-halved"></i></div>
           <div><h2 className="text-sm font-black text-white italic leading-none">AKSES ROOT</h2><p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Versi 6.1</p></div>
        </div>
        <div className="space-y-1 flex-1">
           {COLLECTIONS.map((t) => (
             <button key={t.id} onClick={() => { setActiveTab(t.id as any); setSearchTerm(''); }} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${activeTab === t.id ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${activeTab === t.id ? 'bg-blue-600 text-white' : 'bg-white/5'}`}><i className={`fas ${t.icon} text-[10px]`}></i></div>
                <span className="text-[10px] font-black uppercase italic tracking-tighter">{t.label}</span>
             </button>
           ))}
        </div>
        <div className="mt-8 px-2 space-y-2">
           <button onClick={onLogout} className="w-full h-9 flex items-center gap-3 px-4 text-red-500 hover:bg-red-500/10 rounded-xl font-black text-[9px] uppercase italic transition-all"><i className="fas fa-power-off"></i> Keluar</button>
           <button onClick={onClose} className="w-full h-9 flex items-center gap-3 px-4 text-slate-500 hover:text-white rounded-xl font-black text-[9px] uppercase italic transition-all"><i className="fas fa-times"></i> Tutup</button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <header className="h-16 md:h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-10 bg-slate-950/50 backdrop-blur-md shrink-0">
           <h1 className="text-white font-black italic uppercase tracking-tight text-md md:text-lg">
             {user.nama.split(' ')[0]} <span className="text-blue-500 ml-1">/ Admin</span>
           </h1>
           <div className={`h-8 px-4 rounded-full border border-white/10 items-center gap-2 flex ${healthStatus?.healthy ? 'text-emerald-500' : 'text-red-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${healthStatus?.healthy ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Sinkronisasi Node: Aktif</span>
           </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8 no-scrollbar bg-slate-950/20">{renderContent()}</div>
      </main>

      {/* COMPACT MOBILE NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-white/5 flex items-center justify-around px-4 z-[450] backdrop-blur-xl">
         {COLLECTIONS.slice(0, 5).map(c => (
           <button key={c.id} onClick={() => setActiveTab(c.id as any)} className={`flex flex-col items-center gap-1 ${activeTab === c.id ? 'text-blue-500' : 'text-slate-500'}`}>
              <i className={`fas ${c.icon} text-sm`}></i>
              <span className="text-[7px] font-black uppercase tracking-tighter">{c.label}</span>
           </button>
         ))}
      </div>
    </div>
  );
};
