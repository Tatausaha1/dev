
import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { doc, onSnapshot, collection, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { LOGOS } from './constants.ts';
import { db, apiService } from './services/apiService.ts';

import { LogoHeader } from './components/layouts/LogoHeader.tsx';
import { SideMenu } from './components/layouts/SideMenu.tsx';
import { Hero } from './components/features/Hero.tsx';
import { HomePTSP } from './components/HomePTSP.tsx';
import { CompetitionInfo } from './pages/CompetitionInfo.tsx';
import { Sponsors } from './components/features/Sponsors.tsx';
import { RegistrationForm } from './components/features/forms/RegistrationForm.tsx';
import { RegistryTable } from './components/common/RegistryTable.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { GTKReportForm } from './components/features/forms/GTKReportForm.tsx'; 
import { FloatingInteractionHub } from './components/common/InteractionHub.tsx';
import { PTSPSection } from './components/PTSPSection.tsx';
import { PortalInformasi } from './components/PortalInformasi.tsx';
import { RecentActivity } from './components/RecentActivity.tsx';
import { Footer } from './components/Footer.tsx';
import { SystemHealthAlert } from './components/SystemHealthAlert.tsx';
import { ServicesPortal } from './components/ServicesPortal.tsx';
import { LayananSubmit } from './components/LayananSubmit.tsx';
import { NewsTicker } from './components/NewsTicker.tsx';

const participantsRef = collection(db, "participants");

const BackgroundLayer: React.FC = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-transparent">
    <div className="absolute inset-0 flex justify-end items-end">
      <div className="relative w-full h-full md:w-3/4 flex justify-end items-end">
        <img 
          src={LOGOS.KEPALA_MADRASAH} 
          loading="lazy"
          className="h-[60vh] md:h-full w-auto object-contain object-right-bottom transition-opacity duration-1000 opacity-[0.2] md:opacity-[0.45]" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/60"></div>
      </div>
    </div>
    <div className="absolute inset-0 opacity-[0.015] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
    <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-600/5 rounded-full blur-[120px] -mr-40 -mt-40"></div>
  </div>
);

const App: React.FC = () => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuMode, setMenuMode] = useState<'nav' | 'login'>('nav');
  const [activeSection, setActiveSection] = useState('hero');
  const [activeView, setActiveView] = useState<'madrasah' | 'trisola' | 'services'>('madrasah');
  const [isServiceSelectorOpen, setIsServiceSelectorOpen] = useState(false);
  const [activePTSPTab, setActivePTSPTab] = useState<'monitor' | 'attendance' | 'submit' | 'track' | 'feed' | 'archive' | 'none'>('none');
  const [isGTKReportOpen, setIsGTKReportOpen] = useState(false);
  const [selectedGTKData, setSelectedGTKData] = useState<any>(null);

  const navLinks = [
    { name: 'Beranda', id: 'hero', icon: 'fa-house', view: 'madrasah' },
    { name: 'Portal Utama', id: 'services-portal', icon: 'fa-grid-2', view: 'services' },
    { name: 'Info Madrasah', id: 'portal-informasi', icon: 'fa-circle-info', view: 'madrasah' },
    { name: 'Kompetisi Lomba', id: 'lomba-section', icon: 'fa-palette', view: 'madrasah' }
  ];

  const serviceLinks = [
    { name: 'Pantau Berkas', id: 'ptsp-section', icon: 'fa-chart-line', tab: 'monitor' },
    { name: 'Presensi GTK', id: 'ptsp-section', icon: 'fa-fingerprint', tab: 'attendance' },
    { name: 'Ajukan Layanan', id: 'ptsp-section', icon: 'fa-paper-plane', tab: 'submit' },
    { name: 'Lacak Status', id: 'ptsp-section', icon: 'fa-radar', tab: 'track' },
    { name: 'Log & Aktivitas', id: 'ptsp-section', icon: 'fa-box-archive', tab: 'feed' }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('mq_user_profile');
    if (saved) setCurrentUser(JSON.parse(saved));

    let unsubParticipants = () => {};
    if (currentUser) {
      unsubParticipants = onSnapshot(
        query(participantsRef, orderBy("timestamp", "desc"), limit(20)), 
        (sn) => {
          setParticipants(sn.docs.map(d => ({ id: d.id, ...d.data() })));
        },
        (error) => {
          console.warn("Firestore: Akses daftar peserta dibatasi.", error.message);
        }
      );
    } else {
      setParticipants([]);
    }

    const handleScroll = () => {
      if (activeView !== 'madrasah') return;
      let current = 'hero';
      [...navLinks, ...serviceLinks].forEach(link => {
        const el = document.getElementById(link.id);
        if (el && el.getBoundingClientRect().top <= 300) current = link.id;
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubParticipants();
    };
  }, [activeView, currentUser]);

  const handleNavClick = (id: string, view: any, tab?: any) => {
    setActiveView(view);
    setIsMenuOpen(false);
    setMenuMode('nav');
    if (tab) setActivePTSPTab(tab);
    
    if (view === 'madrasah') {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
      }, 100);
    } else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (cat: any) => {
    setIsServiceSelectorOpen(false);
    if (cat.internal) {
      handleNavClick('ptsp-section', 'madrasah', 'attendance');
    } else {
      handleNavClick('ptsp-section', 'madrasah', 'submit');
    }
  };

  const handleAuthTrigger = () => {
    setMenuMode('login');
    setIsMenuOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('mq_user_profile');
    setCurrentUser(null);
    setIsAdminOpen(false);
    setMenuMode('nav');
  };

  const handleLoginSuccess = (user: any) => {
    localStorage.setItem('mq_user_profile', JSON.stringify(user));
    setCurrentUser(user);
    setMenuMode('nav');
    if (user.role === 'ADMIN') setIsAdminOpen(true);
    else setIsMenuOpen(true);
  };

  return (
    <div className={`min-h-screen bg-white text-slate-900 ${currentUser ? 'pb-24' : 'pb-6'} md:pb-0 transition-colors duration-500`}>
      <BackgroundLayer />
      <div className="relative z-10">
        <SystemHealthAlert />
        <LogoHeader 
          currentUser={currentUser} 
          onAuthClick={handleAuthTrigger} 
          onLogout={handleLogout} 
          activeView={activeView}
          onBackToHome={() => setActiveView('madrasah')}
          onMenuOpen={() => { 
            if (isMenuOpen) {
              setIsMenuOpen(false);
            } else {
              setMenuMode('nav'); 
              setIsMenuOpen(true);
            }
          }} 
        />

        {/* Fixed Height Ticker Wrapper for Layout Stability */}
        <div className="pt-[68px] md:pt-[92px] h-[28px] md:h-[32px] overflow-hidden">
           {activeView === 'madrasah' && <NewsTicker />}
        </div>

        <SideMenu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)}
          mode={menuMode}
          onModeChange={setMenuMode}
          activeSection={activeSection} 
          activeView={activeView} 
          onNavClick={handleNavClick}
          currentUser={currentUser} 
          onAuthClick={handleAuthTrigger} 
          onLogout={handleLogout}
          onLoginSuccess={handleLoginSuccess}
          navLinks={navLinks} 
          serviceLinks={serviceLinks}
          onOpenAdminConsole={() => setIsAdminOpen(true)}
          activePTSPTab={activePTSPTab}
        />
        
        <main className={`relative z-10 w-full pt-4 md:pt-10 ${activeView === 'madrasah' ? 'max-w-6xl mx-auto' : ''}`}>
          {activeView === 'services' ? (
            <ServicesPortal onNavigate={(id, tab) => handleNavClick(id, 'madrasah', tab)} />
          ) : (
            <>
              <div id="hero" className="scroll-mt-32">
                <HomePTSP 
                  onStartLayanan={() => setIsServiceSelectorOpen(true)} 
                  onTrackLayanan={() => handleNavClick('ptsp-section', 'madrasah', 'track')} 
                />
              </div>
              <div className="space-y-16 md:space-y-32 pb-32 px-2 md:px-0">
                <div id="ptsp-section" className="scroll-mt-32">
                  <PTSPSection 
                    userRole={currentUser?.role || 'GUEST'} 
                    onGTKReportOpen={(data) => { setSelectedGTKData(data); setIsGTKReportOpen(true); }}
                    activeTab={activePTSPTab}
                    onTabChange={setActivePTSPTab}
                  />
                </div>
                
                <RecentActivity isLoggedIn={!!currentUser} />

                {/* Information Portal Section with min-height fix for stability */}
                <div id="portal-informasi" className="scroll-mt-32 min-h-[100px] h-auto">
                   <PortalInformasi isLoggedIn={!!currentUser} />
                </div>
                
                <div id="lomba-section" className="scroll-mt-32">
                   <CompetitionInfo />
                   <RegistrationForm participantsRef={participantsRef} />
                   <div className="pt-12 md:pt-20 border-t border-slate-100 mt-12 md:mt-20">
                     <RegistryTable participants={participants} currentUser={currentUser} />
                   </div>
                </div>
                <div id="sponsors-section" className="scroll-mt-32"><Sponsors /></div>
              </div>
            </>
          )}
        </main>
        
        <Footer />
        <FloatingInteractionHub />
      </div>
      
      {isServiceSelectorOpen && (
        <div className="fixed inset-0 z-[600] flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsServiceSelectorOpen(false)} />
          <div className="relative w-full md:max-w-3xl bg-white rounded-t-[2rem] md:rounded-[3rem] shadow-[0_-20px_80px_-20px_rgba(0,0,0,0.3)] p-4 md:p-10 animate-in slide-in-from-bottom-full duration-500">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden"></div>
            
            <div className="flex justify-end items-center mb-4 px-2">
              <button onClick={() => setIsServiceSelectorOpen(false)} className="w-9 h-9 md:w-11 md:h-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-950 hover:text-white transition-all active:scale-90">
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>
            
            <div className="max-h-[70vh] overflow-y-auto no-scrollbar pb-2">
              <LayananSubmit 
                onCategoryClick={handleCategorySelect} 
                onOpenForm={() => { setIsServiceSelectorOpen(false); handleNavClick('ptsp-section', 'madrasah', 'submit'); }} 
                isModalMode={true}
              />
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-center gap-2">
               <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">MAN 1 Hulu Sungai Tengah</p>
            </div>
          </div>
        </div>
      )}

      {isAdminOpen && currentUser?.role === 'ADMIN' && (
        <AdminDashboard onClose={() => setIsAdminOpen(false)} onLogout={handleLogout} db={db} user={currentUser} />
      )}
      {isGTKReportOpen && (
        <GTKReportForm onClose={() => setIsGTKReportOpen(false)} db={db} editingReport={selectedGTKData} />
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
