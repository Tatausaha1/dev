
import React from 'react';
import { UserRole } from '../types';
import { ProductionDashboard } from './ProductionDashboard';
import { LayananKehadiran } from './LayananKehadiran.tsx';
import { AttendanceMonitor } from './AttendanceMonitor.tsx';
import { LayananSubmit } from './LayananSubmit.tsx';
import { LayananTrack } from './LayananTrack.tsx';
import { GTKArchiveManagement } from './GTKArchiveManagement.tsx';

interface PTSPSectionProps {
  userRole: UserRole;
  onGTKReportOpen: (gtkData?: any) => void;
  activeTab: 'monitor' | 'attendance' | 'submit' | 'track' | 'feed' | 'archive' | 'none';
  onTabChange: (tab: any) => void;
}

const ServiceFlow = () => (
  <div className="mb-16 p-8 bg-slate-50 border border-slate-200 rounded-[3rem] hidden md:block">
    <div className="flex items-center justify-between relative">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
      {[
        { step: 1, label: 'Pilih Layanan', icon: 'fa-hand-pointer' },
        { step: 2, label: 'Isi Formulir', icon: 'fa-file-edit' },
        { step: 3, label: 'Verifikasi Admin', icon: 'fa-user-check' },
        { step: 4, label: 'Proses Dokumen', icon: 'fa-cog' },
        { step: 5, label: 'Selesai / Unduh', icon: 'fa-cloud-download' }
      ].map((s, i) => (
        <div key={i} className="relative z-10 flex flex-col items-center gap-3 bg-slate-50 px-4">
          <div className="w-12 h-12 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center text-blue-600 shadow-sm">
            <i className={`fas ${s.icon} text-sm`}></i>
          </div>
          <div className="text-center">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Tahap {s.step}</p>
            <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const IntegrityBanner = () => (
  <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
    {[
      { label: 'Bebas Pungli', sub: 'Layanan Gratis 100%', icon: 'fa-hand-holding-dollar', color: 'text-emerald-600' },
      { label: 'Transparan', sub: 'Status Lacak Real-time', icon: 'fa-eye', color: 'text-blue-600' },
      { label: 'Akuntabel', sub: 'Terintegrasi Node Cloud', icon: 'fa-shield-check', color: 'text-indigo-600' }
    ].map((item, i) => (
      <div key={i} className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 ${item.color}`}>
          <i className={`fas ${item.icon}`}></i>
        </div>
        <div>
          <h4 className="text-[11px] font-black uppercase text-slate-900 leading-none">{item.label}</h4>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.sub}</p>
        </div>
      </div>
    ))}
  </div>
);

export const PTSPSection: React.FC<PTSPSectionProps> = ({ 
  userRole, 
  onGTKReportOpen, 
  activeTab, 
  onTabChange 
}) => {
  const isAdmin = userRole === 'ADMIN';
  const isLoggedIn = userRole !== 'GUEST';
  const isHubVisible = activeTab === 'none' || !activeTab;

  const navGroups = [
    {
      group: 'Sistem & Pantau',
      items: [
        { id: 'monitor', label: 'Pantau Berkas', icon: 'fa-chart-line-up', sub: 'Status Sinkron' },
        { id: 'feed', label: 'Log Live', icon: 'fa-box-archive', sub: 'Aktivitas Realtime' }
      ]
    },
    {
      group: 'Unit Layanan Publik',
      items: [
        { id: 'submit', label: 'Ajukan Layanan', icon: 'fa-paper-plane', sub: 'Formulir Digital' },
        { id: 'track', label: 'Lacak Status', icon: 'fa-radar', sub: 'Tracking Berkas' }
      ]
    },
    {
      group: 'Node GTK Internal',
      items: [
        { id: 'attendance', label: 'Presensi', icon: 'fa-fingerprint', sub: 'Laporan Mandiri' },
        ...(isAdmin ? [{ id: 'archive', label: 'Arsip', icon: 'fa-database', sub: 'Cloud Master' }] : [])
      ]
    }
  ];

  const handleCategoryClick = (cat: any) => {
    if (cat.internal) onTabChange('attendance');
    else onTabChange('submit');
  };

  return (
    <section id="ptsp-section" className="py-10 md:py-24 bg-transparent relative scroll-mt-32">
       <div className="max-w-7xl mx-auto px-4">
          
          <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                 <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Operational Flow V7.5</p>
              </div>
              <h2 className="text-4xl md:text-8xl font-[1000] text-slate-950 tracking-tighter leading-[0.85] italic uppercase">
                Gateway <span className="text-blue-600 not-italic">Terpadu.</span>
              </h2>
            </div>

            {!isHubVisible && (
              <button 
                onClick={() => onTabChange('none')}
                className="flex items-center justify-center gap-4 px-8 py-5 bg-slate-950 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-2xl italic w-full md:w-auto border border-white/10"
              >
                <i className="fas fa-arrow-left text-blue-400"></i>
                Kembali ke Dashboard
              </button>
            )}
          </div>

          {isHubVisible ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
               <IntegrityBanner />
               <ServiceFlow />
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {navGroups.map((group, idx) => (
                    <div key={idx} className="space-y-6">
                        <div className="flex items-center gap-3 px-4">
                          <div className="h-1 w-3 bg-blue-600 rounded-full"></div>
                          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{group.group}</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {group.items.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => onTabChange(item.id as any)}
                              className="group relative flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:border-blue-200 transition-all duration-500 text-left overflow-hidden active:scale-95"
                            >
                                <div className="w-14 h-14 bg-slate-950 text-white rounded-3xl flex items-center justify-center shadow-lg group-hover:bg-blue-600 group-hover:rotate-6 transition-all shrink-0">
                                  <i className={`fas ${item.icon} text-xl`}></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-lg font-[1000] text-slate-950 italic uppercase tracking-tighter leading-none group-hover:text-blue-600 transition-colors">{item.label}</h4>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">{item.sub}</p>
                                </div>
                                <i className="fas fa-chevron-right text-slate-200 group-hover:text-blue-400 group-hover:translate-x-2 transition-all"></i>
                            </button>
                          ))}
                        </div>
                    </div>
                  ))}
               </div>
               
               <div className="mt-16 flex justify-center">
                  <div className="flex items-center gap-4 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 italic">
                     <i className="fas fa-award text-sm"></i>
                     <p className="text-[9px] font-black uppercase tracking-widest">Zona Integritas Menuju WBK/WBBM MAN 1 HST</p>
                  </div>
               </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
               {activeTab === 'submit' && (
                 <LayananSubmit 
                   onCategoryClick={handleCategoryClick} 
                   onOpenForm={() => onTabChange('submit')} 
                 />
               )}
               {activeTab === 'monitor' && <AttendanceMonitor onUploadClick={onGTKReportOpen} userRole={userRole} />}
               {activeTab === 'attendance' && <LayananKehadiran userRole={userRole} />}
               {activeTab === 'track' && <LayananTrack />}
               {activeTab === 'feed' && <ProductionDashboard isLoggedIn={isLoggedIn} />}
               {activeTab === 'archive' && isAdmin && <GTKArchiveManagement />}
            </div>
          )}
       </div>
       <div className="md:hidden h-20"></div>
    </section>
  );
};
