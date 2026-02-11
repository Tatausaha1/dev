import React, { useState, useEffect } from 'react';
import { LOGOS } from '../../constants.ts';
import { apiService } from '../../services/apiService.ts';

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
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['beranda', 'layanan']));
  const [loginMethod, setLoginMethod] = useState<'pin' | 'account'>('pin');
  const [pin, setPin] = useState('');
  const [accountForm, setAccountForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dbStatus, setDbStatus] = useState<{ healthy: boolean; latency: number }>({ healthy: true, latency: 0 });

  const menuStructure: MenuStructure[] = [
    {
      id: 'beranda',
      label: 'Navigasi Utama',
      icon: 'fa-house',
      submenus: [
        { label: 'Halaman Depan', icon: 'fa-home', sectionId: 'hero', view: 'madrasah' },
        { label: 'Portal Layanan', icon: 'fa-grid-2', sectionId: 'services-portal', view: 'services' },
        { label: 'Kompetisi Desain', icon: 'fa-palette', sectionId: 'lomba-section', view: 'madrasah' }
      ]
    },
    {
      id: 'layanan',
      label: 'Layanan Publik',
      icon: 'fa-hand-holding-heart',
      submenus: [
        { label: 'Ajukan Permohonan', icon: 'fa-file-signature', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'submit' },
        { label: 'Lacak Berkas', icon: 'fa-radar', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'track' },
        { label: 'Legalisir & Alumni', icon: 'fa-graduation-cap', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'submit' }
      ]
    },
    {
      id: 'gtk_internal',
      label: 'Node GTK Internal',
      icon: 'fa-user-tie',
      submenus: [
        { label: 'Presensi Bulanan', icon: 'fa-fingerprint', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'attendance' },
        { label: 'Data Tahunan GTK', icon: 'fa-database', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'attendance' },
        { label: 'Monitoring Sinkron', icon: 'fa-satellite-dish', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'monitor' },
        { label: 'Usul Cuti ASN', icon: 'fa-calendar-check', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'submit' }
      ]
    },
    {
      id: 'zi_transparency',
      label: 'Zona Integritas',
      icon: 'fa-shield-halved',
      submenus: [
        { label: 'Log Aktivitas Live', icon: 'fa-chart-line', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'feed' },
        { label: 'Pengaduan & Pungli', icon: 'fa-user-secret', sectionId: 'ptsp-section', view: 'madrasah', tabId: 'submit' },
        { label: 'Informasi & SOP', icon: 'fa-scroll', sectionId: 'portal-informasi', view: 'madrasah' }
      ]
    },
    {
      id: 'info_center',
      label: 'Pusat Informasi',
      icon: 'fa-circle-info',
      submenus: [
        { label: 'Pengumuman Resmi', icon: 'fa-bullhorn', sectionId: 'portal-informasi', view: 'madrasah' },
        { label: 'Kontak & Bantuan', icon: 'fa-headset', sectionId: 'footer', view: 'madrasah' },
        { label: 'Kemitraan (Sponsor)', icon: 'fa-handshake', sectionId: 'sponsors-section', view: 'madrasah' }
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
                          {dbStatus.healthy ? 'Node Cloud Online' : 'System Disconnected'}
                        </p>
                     </div>
                  </div>
                  <h2 className="text-lg font-[1000] text-slate-950 uppercase italic tracking-tighter leading-none">Navigation <span className="text-blue-600">Hub.</span></h2>
               </div>
               <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-950 hover:bg-red-500 hover:text-white transition-all active:scale-90"><i className="fas fa-times text-xs"></i></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 no-scrollbar bg-slate-50/30">
               {menuStructure.map((menu) => {
                 const isExpanded = expandedMenus.has(menu.id);
                 return (
                   <div key={menu.id} className="space-y-1">
                      <button 
                        onClick={() => toggleMenu(menu.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-500 ${isExpanded ? 'bg-slate-950 text-white shadow-xl translate-x-[-4px]' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-100'}`}
                      >
                         <div className="flex items-center gap-4">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 ${isExpanded ? 'bg-blue-600 text-white rotate-6' : 'bg-slate-50 text-slate-400'}`}>
                               <i className={`fas ${menu.icon} text-sm`}></i>
                            </div>
                            <span className="text-[12.5px] font-[1000] uppercase italic tracking-tight">{menu.label}</span>
                         </div>
                         <i className={`fas fa-chevron-right text-[8px] transition-transform duration-500 ${isExpanded ? 'rotate-90 text-blue-400' : 'text-slate-300'}`}></i>
                      </button>

                      {isExpanded && menu.submenus && (
                        <div className="grid grid-cols-1 gap-1 pl-4 pr-1 py-1 animate-in slide-in-from-left-2 duration-500">
                          {menu.submenus.map((sub, idx) => (
                            <button 
                              key={idx}
                              onClick={() => { onNavClick(sub.sectionId, sub.view, sub.tabId); onClose(); }}
                              className="group flex items-center gap-4 p-2.5 rounded-xl hover:bg-white transition-all border border-transparent hover:border-slate-100 hover:shadow-sm"
                            >
                               <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                  <i className={`fas ${sub.icon} text-[10px]`}></i>
                               </div>
                               <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-950 uppercase tracking-widest">{sub.label}</span>
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
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                       <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg shadow-lg"><i className="fas fa-user-shield"></i></div>
                       <div className="min-w-0">
                          <p className="text-[11px] font-black italic text-white truncate uppercase tracking-tight leading-none">{currentUser.nama}</p>
                          <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 whitespace-nowrap">{currentUser.role} Authorization Node</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                       {currentUser.role === 'ADMIN' && <button onClick={onOpenAdminConsole} className="w-full py-3 bg-white text-slate-950 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all italic flex items-center justify-center gap-3 shadow-lg active:scale-95"><i className="fas fa-terminal"></i> Console Admin</button>}
                       <button onClick={onLogout} className="w-full py-3 bg-red-600/10 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-red-600/20 hover:bg-red-600 hover:text-white transition-all italic active:scale-95">Disconnect Session</button>
                    </div>
                 </div>
               ) : (
                 <button onClick={() => onModeChange('login')} className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] shadow-xl hover:bg-white hover:text-slate-950 transition-all flex items-center justify-center gap-3 active:scale-95 italic">
                    Authentication Gate <i className="fas fa-key text-[10px]"></i>
                 </button>
               )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full bg-slate-950 text-white animate-in fade-in slide-in-from-right-12">
             <div className="p-4 flex items-center justify-between border-b border-white/5 shrink-0">
                <button onClick={() => onModeChange('nav')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white hover:bg-blue-600 transition-all border border-white/10"><i className="fas fa-arrow-left text-xs"></i></button>
                <h2 className="text-[9px] font-black uppercase tracking-[0.2em] italic text-blue-400">Security Verification</h2>
                <div className="w-8"></div>
             </div>
             
             <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
                <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                  <button onClick={() => setLoginMethod('pin')} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase italic transition-all ${loginMethod === 'pin' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>Quick PIN</button>
                  <button onClick={() => setLoginMethod('account')} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase italic transition-all ${loginMethod === 'account' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>Cloud Access</button>
                </div>

                {loginMethod === 'pin' ? (
                  <div className="space-y-8 flex flex-col items-center py-4">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-lime-400 shadow-inner">
                         {loading ? <i className="fas fa-spinner fa-spin text-2xl"></i> : <i className="fas fa-shield-keyhole text-2xl"></i>}
                      </div>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${error ? 'text-red-400 animate-shake' : 'text-slate-500'}`}>{error || 'Secure Entry'}</p>
                    </div>
                    <div className="flex justify-center gap-4">
                      {[...Array(4)].map((_, i) => <div key={i} className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${pin.length > i ? 'bg-lime-400 border-lime-400 shadow-[0_0_15px_#a3e635]' : 'border-white/10'}`}></div>)}
                    </div>
                    <div className="grid grid-cols-3 gap-4 w-full max-w-[220px]">
                      {['1','2','3','4','5','6','7','8','9','C','0','X'].map(key => (
                         <button key={key} onClick={() => { if (key === 'X') onModeChange('nav'); else handleKeyClick(key); }} className={`aspect-square rounded-2xl flex items-center justify-center text-xl font-black transition-all active:scale-90 bg-white/5 border border-white/5 hover:border-blue-600/50 hover:bg-blue-600/10`}>{key === 'C' ? <i className="fas fa-backspace text-sm"></i> : key === 'X' ? <i className="fas fa-times text-sm"></i> : key}</button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAccountLogin} className="space-y-5 py-4">
                     <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase text-slate-500 ml-1 tracking-widest italic">Identity Identifier</label>
                        <input required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white text-sm outline-none focus:border-blue-500 focus:bg-white/10 transition-all" placeholder="Username / NIP..." value={accountForm.username} onChange={e => setAccountForm({...accountForm, username: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase text-slate-500 ml-1 tracking-widest italic">Secret Cipher</label>
                        <input required type="password" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white text-sm outline-none focus:border-blue-500 focus:bg-white/10 transition-all" placeholder="••••••••" value={accountForm.password} onChange={e => setAccountForm({...accountForm, password: e.target.value})} />
                     </div>
                     {error && <p className="text-[9px] font-black text-red-500 text-center uppercase tracking-widest animate-pulse">{error}</p>}
                     <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[11px] italic shadow-2xl shadow-blue-900/50 active:scale-95 disabled:opacity-50 mt-4 transition-all">
                        {loading ? 'Decrypting...' : 'Initiate Secure Login'}
                     </button>
                  </form>
                )}
             </div>

             <div className="p-6 flex flex-col items-center gap-1.5 bg-black/20 border-t border-white/5 shrink-0">
                <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] italic">IMAM CORE NODE OS v6.1.4</p>
                <div className="flex gap-2 opacity-20">
                   <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                   <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                   <div className="w-1 h-1 rounded-full bg-amber-500"></div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
