
import React, { useState, useEffect } from 'react';
import { LOGOS } from './constants.ts';
import { apiService } from './services/apiService.ts';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'nav' | 'login';
  onModeChange: (mode: 'nav' | 'login') => void;
  activeSection: string;
  activeView: string;
  onNavClick: (id: string, view: any, tab?: any) => void;
  currentUser: any | null;
  onAuthClick: () => void;
  onLogout: () => void;
  onLoginSuccess: (user: any) => void;
  navLinks: { name: string; id: string; icon?: string; view: any }[];
  serviceLinks?: { name: string; id: string; icon?: string; tab: any }[];
  onOpenAdminConsole?: () => void;
  activePTSPTab?: string;
}

interface MenuStructure {
  id: string;
  label: string;
  icon: string;
  view?: 'madrasah' | 'services' | 'trisola';
  sectionId?: string;
  tabId?: string;
  submenus?: {
    label: string;
    icon: string;
    sectionId: string;
    view: 'madrasah' | 'services' | 'trisola';
    tabId?: string;
  }[];
}

export const SideMenu: React.FC<SideMenuProps> = ({ 
  isOpen, 
  onClose,
  mode,
  onModeChange,
  activeSection, 
  activeView,
  onNavClick,
  currentUser, 
  onLoginSuccess,
  onLogout,
  onOpenAdminConsole
}) => {
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['beranda']));
  const [loginMethod, setLoginMethod] = useState<'pin' | 'account'>('pin');
  const [pin, setPin] = useState('');
  const [accountForm, setAccountForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dbStatus, setDbStatus] = useState<{ healthy: boolean; latency: number }>({ healthy: true, latency: 0 });

  const menuStructure: MenuStructure[] = [
    {
      id: 'beranda',
      label: 'Beranda',
      icon: 'fa-house',
      submenus: [
        { label: 'Ringkasan Portal', icon: 'fa-chart-pie', sectionId: 'hero', view: 'madrasah' },
        { label: 'Pengumuman Singkat', icon: 'fa-bullhorn', sectionId: 'portal-informasi', view: 'madrasah' }
      ]
    },
    {
      id: 'layanan',
      label: 'Layanan',
      icon: 'fa-grid-2',
      submenus: [
        { label: 'Semua Layanan', icon: 'fa-list-ul', sectionId: 'services-portal', view: 'services' },
        { label: 'Layanan Siswa', icon: 'fa-user-graduate', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'submit' },
        { label: 'Layanan Alumni', icon: 'fa-graduation-cap', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'submit' },
        { label: 'Layanan Mutasi', icon: 'fa-right-from-bracket', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'submit' },
        { label: 'Layanan GTK', icon: 'fa-user-tie', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'attendance' },
        { label: 'Administrasi Umum', icon: 'fa-building-columns', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'submit' }
      ]
    },
    {
      id: 'permohonan',
      label: 'Ajukan Permohonan',
      icon: 'fa-paper-plane',
      submenus: [
        { label: 'Ajukan Layanan', icon: 'fa-file-signature', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'submit' },
        { label: 'Usul Cuti ASN', icon: 'fa-calendar-check', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'submit' },
        { label: 'Pengaduan & Aspirasi', icon: 'fa-comment-dots', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'submit' }
      ]
    },
    {
      id: 'status',
      label: 'Cek Status',
      icon: 'fa-radar',
      submenus: [
        { label: 'Status Permohonan', icon: 'fa-magnifying-glass', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'track' },
        { label: 'Status Antrian', icon: 'fa-list-ol', sectionId: 'services-portal', view: 'services' },
        { label: 'Status Dokumen', icon: 'fa-file-circle-check', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'monitor' }
      ]
    },
    {
      id: 'zi',
      label: 'Zona Integritas',
      icon: 'fa-shield-halved',
      submenus: [
        { label: 'Komitmen ZI', icon: 'fa-handshake-simple', sectionId: 'portal-informasi', view: 'madrasah' },
        { label: 'Program Kerja', icon: 'fa-clipboard-list', sectionId: 'portal-informasi', view: 'madrasah' },
        { label: 'Inovasi Layanan', icon: 'fa-lightbulb', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'feed' },
        { label: 'Pengaduan Masyarakat', icon: 'fa-user-secret', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'submit' }
      ]
    },
    {
      id: 'info',
      label: 'Informasi',
      icon: 'fa-circle-info',
      submenus: [
        { label: 'SOP Pelayanan', icon: 'fa-scroll', sectionId: 'portal-informasi', view: 'madrasah' },
        { label: 'Standar Pelayanan', icon: 'fa-scale-balanced', sectionId: 'portal-informasi', view: 'madrasah' },
        { label: 'Jam Operasional', icon: 'fa-clock', sectionId: 'portal-informasi', view: 'madrasah' },
        { label: 'Pengumuman Resmi', icon: 'fa-bullhorn', sectionId: 'portal-informasi', view: 'madrasah' }
      ]
    },
    {
      id: 'kontak',
      label: 'Kontak',
      icon: 'fa-headset',
      submenus: [
        { label: 'Kontak Resmi', icon: 'fa-phone', sectionId: 'footer', view: 'madrasah' },
        { label: 'FAQ', icon: 'fa-question-circle', sectionId: 'portal-informasi', view: 'madrasah' },
        { label: 'Bantuan Layanan', icon: 'fa-life-ring', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'submit' }
      ]
    }
  ];

  useEffect(() => {
    if (isOpen) {
      apiService.checkDatabaseHealth().then(res => setDbStatus({ healthy: res.healthy, latency: res.latency || 0 }));
    }
  }, [isOpen]);

  useEffect(() => {
    if (pin.length === 4) handlePinLogin(pin);
  }, [pin]);

  const toggleMenu = (id: string) => {
    const next = new Set(expandedMenus);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedMenus(next);
  };

  const handlePinLogin = async (inputPin: string) => {
    setLoading(true);
    setError('');
    if (inputPin === '2024') {
      const res = await apiService.validateUser('admin', 'adminmq24');
      if (res.success) {
        onLoginSuccess(res.data);
        setPin('');
      } else {
        setError('DATABASE BELUM SIAP');
        setPin('');
      }
    } else {
      setError('PIN TIDAK VALID');
      setPin('');
    }
    setLoading(false);
  };

  const handleAccountLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await apiService.validateUser(accountForm.username, accountForm.password);
    if (res.success) {
      onLoginSuccess(res.data);
      setAccountForm({ username: '', password: '' });
    } else {
      setError(res.error || 'LOGIN GAGAL');
    }
    setLoading(false);
  };

  const handleKeyClick = (key: string) => {
    if (loading) return;
    if (key === 'C') setPin('');
    else if (pin.length < 4) setPin(p => p + key);
  };

  return (
    <div className={`fixed inset-0 z-[250] transition-all duration-700 ${isOpen ? 'visible' : 'invisible'}`}>
      <div className={`absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      
      <div className={`absolute right-0 top-0 bottom-0 w-[85%] sm:w-80 md:w-96 bg-white transition-all duration-700 shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {mode === 'nav' ? (
          <div className="flex flex-col h-full">
            <div className="p-4 flex justify-between items-start border-b border-slate-50 bg-slate-50/30 shrink-0">
               <div className="space-y-1">
                  <div className="flex items-center gap-2">
                     <img src={LOGOS.IMAM} className="h-5 w-auto rounded shadow-sm" alt="Logo" />
                     <div className="flex items-center gap-1 ml-1.5">
                        <span className={`w-1 h-1 rounded-full ${dbStatus.healthy ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                        <p className={`text-[7px] font-black uppercase tracking-widest ${dbStatus.healthy ? 'text-blue-600' : 'text-red-500'} whitespace-nowrap`}>
                          {dbStatus.healthy ? 'Node Cloud Aktif' : 'System Offline'}
                        </p>
                     </div>
                  </div>
                  <h2 className="text-lg font-[1000] text-slate-950 uppercase italic tracking-tighter leading-none">Portal <span className="text-blue-600">Utama.</span></h2>
               </div>
               <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-950 hover:bg-red-500 hover:text-white transition-all active:scale-90"><i className="fas fa-times text-xs"></i></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar bg-slate-50/30">
               {menuStructure.map((menu) => {
                 const isExpanded = expandedMenus.has(menu.id);
                 return (
                   <div key={menu.id} className="space-y-0.5">
                      <button 
                        onClick={() => toggleMenu(menu.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-300 ${isExpanded ? 'bg-slate-950 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-50'}`}
                      >
                         <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isExpanded ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                               <i className={`fas ${menu.icon} text-xs`}></i>
                            </div>
                            <span className="text-[12px] font-[900] uppercase italic tracking-tight">{menu.label}</span>
                         </div>
                         <i className={`fas fa-chevron-down text-[9px] transition-transform duration-300 ${isExpanded ? 'rotate-180 text-blue-400' : 'text-slate-300'}`}></i>
                      </button>

                      {isExpanded && menu.submenus && (
                        <div className="grid grid-cols-1 gap-0.5 pl-3 pr-1 py-1 animate-in slide-in-from-top-1 duration-300">
                          {menu.submenus.map((sub, idx) => (
                            <button 
                              key={idx}
                              onClick={() => { onNavClick(sub.sectionId, sub.view, sub.tabId); onClose(); }}
                              className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-all border border-transparent hover:border-slate-100 hover:shadow-sm"
                            >
                               <div className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                  <i className={`fas ${sub.icon} text-[9px]`}></i>
                               </div>
                               <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-950 uppercase tracking-wide">{sub.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                   </div>
                 );
               })}
            </div>

            <div className="p-4 bg-slate-950 border-t border-white/5 shrink-0">
               {currentUser ? (
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/10">
                       <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm shadow-lg"><i className="fas fa-user-shield"></i></div>
                       <div className="min-w-0">
                          <p className="text-[10px] font-black italic text-white truncate uppercase tracking-tight leading-none">{currentUser.nama.split(' ')[0]}</p>
                          <p className="text-[6px] font-bold text-slate-500 uppercase tracking-widest mt-1 whitespace-nowrap">{currentUser.role} Node Access</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                       {currentUser.role === 'ADMIN' && <button onClick={onOpenAdminConsole} className="w-full py-2.5 bg-white text-slate-950 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all italic flex items-center justify-center gap-2"><i className="fas fa-terminal"></i> Konsol Admin</button>}
                       <button onClick={onLogout} className="w-full py-2.5 bg-red-600/10 text-red-500 rounded-lg text-[8px] font-black uppercase tracking-widest border border-red-600/20 hover:bg-red-600 hover:text-white transition-all italic">Keluar Gateway</button>
                    </div>
                 </div>
               ) : (
                 <button onClick={() => onModeChange('login')} className="w-full py-3.5 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-white hover:text-slate-950 transition-all flex items-center justify-center gap-2 active:scale-95 italic">
                    Masuk Autentikasi <i className="fas fa-arrow-right text-[9px]"></i>
                 </button>
               )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full bg-slate-950 text-white animate-in fade-in slide-in-from-right-12">
             <div className="p-4 flex items-center justify-between border-b border-white/5 shrink-0">
                <button onClick={() => onModeChange('nav')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white hover:bg-blue-600 transition-all border border-white/10"><i className="fas fa-arrow-left text-xs"></i></button>
                <h2 className="text-[9px] font-black uppercase tracking-[0.2em] italic text-blue-400">Verifikasi Node</h2>
                <div className="w-8"></div>
             </div>
             
             <div className="flex-1 p-4 space-y-4 overflow-y-auto no-scrollbar">
                <div className="flex p-0.5 bg-white/5 rounded-lg border border-white/10">
                  <button onClick={() => setLoginMethod('pin')} className={`flex-1 py-1.5 rounded-md text-[9px] font-black uppercase italic transition-all ${loginMethod === 'pin' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Quick PIN</button>
                  <button onClick={() => setLoginMethod('account')} className={`flex-1 py-1.5 rounded-md text-[9px] font-black uppercase italic transition-all ${loginMethod === 'account' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Full Access</button>
                </div>

                {loginMethod === 'pin' ? (
                  <div className="space-y-6 flex flex-col items-center py-4">
                    <div className="text-center space-y-1.5">
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mx-auto text-lime-400">
                         {loading ? <i className="fas fa-spinner fa-spin text-lg"></i> : <i className="fas fa-shield-keyhole text-lg"></i>}
                      </div>
                      <p className={`text-[9px] font-black uppercase tracking-widest ${error ? 'text-red-400' : 'text-slate-500'}`}>{error || 'Authorized Entry'}</p>
                    </div>
                    <div className="flex justify-center gap-3">
                      {[...Array(4)].map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full border transition-all ${pin.length > i ? 'bg-lime-400 border-lime-400 shadow-[0_0_8px_#a3e635]' : 'border-white/10'}`}></div>)}
                    </div>
                    <div className="grid grid-cols-3 gap-3 w-full max-w-[180px]">
                      {['1','2','3','4','5','6','7','8','9','C','0','X'].map(key => (
                         <button key={key} onClick={() => { if (key === 'X') onModeChange('nav'); else handleKeyClick(key); }} className={`aspect-square rounded-lg flex items-center justify-center text-lg font-black transition-all active:scale-90 bg-white/5 border border-transparent hover:border-blue-600/30`}>{key === 'C' ? <i className="fas fa-backspace text-xs"></i> : key === 'X' ? <i className="fas fa-times text-xs"></i> : key}</button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAccountLogin} className="space-y-3 py-2">
                     <div className="space-y-1.5">
                        <label className="text-[7px] font-black uppercase text-slate-500 ml-1 tracking-widest">Username / NIP</label>
                        <input required className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-xs outline-none focus:border-blue-500" placeholder="ID Pegawai..." value={accountForm.username} onChange={e => setAccountForm({...accountForm, username: e.target.value})} />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[7px] font-black uppercase text-slate-500 ml-1 tracking-widest">Secret Key</label>
                        <input required type="password" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-xs outline-none focus:border-blue-500" placeholder="••••••••" value={accountForm.password} onChange={e => setAccountForm({...accountForm, password: e.target.value})} />
                     </div>
                     {error && <p className="text-[8px] font-black text-red-500 text-center uppercase tracking-widest">{error}</p>}
                     <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] italic shadow-lg active:scale-95 disabled:opacity-50 mt-2">
                        {loading ? 'Authenticating...' : 'Secure Login'}
                     </button>
                  </form>
                )}
             </div>

             <div className="p-4 flex flex-col items-center gap-1 bg-black/20 border-t border-white/5 shrink-0">
                <p className="text-[7px] font-black text-slate-600 uppercase tracking-[0.3em]">IMAM CORE Node v6.1</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
