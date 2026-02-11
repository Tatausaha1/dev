
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

type ScheduleTab = 'piket' | 'pelajaran' | 'kerja';

export const MadrasahScheduleSection: React.FC = () => {
  const daysIndo = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at"];
  const currentDayName = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"][new Date().getDay()];
  const defaultDay = daysIndo.includes(currentDayName) ? currentDayName : "Senin";

  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const [activeTab, setActiveTab] = useState<ScheduleTab>('piket');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const collectionName = 
        activeTab === 'piket' ? 'madrasah_piket_sesi' : 
        activeTab === 'pelajaran' ? 'madrasah_pelajaran' : 'madrasah_kerja_ptsp';
      
      const result = await apiService.getMadrasahData(collectionName, selectedDay);
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, [selectedDay, activeTab]);

  const TabButton = ({ id, label, icon }: { id: ScheduleTab, label: string, icon: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
        activeTab === id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:text-slate-900'
      }`}
    >
      <i className={`fas ${icon}`}></i> {label}
    </button>
  );

  return (
    <section id="jadwal-madrasah" className="py-12 bg-white border-t border-slate-100 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Header & Control Column */}
          <div className="lg:w-1/3 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[8px] font-black uppercase tracking-widest">
                <i className="fas fa-clock"></i> Madrasah Operational
              </div>
              <h2 className="text-3xl font-[1000] text-slate-950 uppercase italic tracking-tighter leading-none">Jadwal <br/> <span className="text-blue-600">Terpadu.</span></h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Sistem sinkronisasi jam akademik, piket sesi, dan operasional PTSP MAN 1 HST.</p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {daysIndo.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${
                    selectedDay === day ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-950'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <TabButton id="piket" label="Piket Sesi" icon="fa-user-shield" />
              <TabButton id="pelajaran" label="Akademik" icon="fa-book-open" />
              <TabButton id="kerja" label="Operasional" icon="fa-briefcase" />
            </div>
          </div>

          {/* Content Display Column */}
          <div className="lg:w-2/3 w-full">
            <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-6 md:p-8 min-h-[400px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full py-20 gap-4">
                  <i className="fas fa-satellite-dish animate-pulse text-4xl text-blue-200"></i>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Synchronizing Cloud...</p>
                </div>
              ) : data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4">
                  {activeTab === 'piket' && data.map((item, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 transition-all flex items-center gap-4 group">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex flex-col items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <i className="fas fa-shield-halved text-xs"></i>
                        <span className="text-[7px] font-black mt-1 uppercase">{item.sesi}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{item.waktu || '00:00'}</p>
                        <h4 className="text-[11px] font-black text-slate-950 uppercase italic truncate">{item.petugas || 'Petugas Belum Ada'}</h4>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Sesi: {item.sesi}</p>
                      </div>
                    </div>
                  ))}

                  {activeTab === 'pelajaran' && (
                    <div className="col-span-full space-y-2">
                      <div className="grid grid-cols-11 gap-1 mb-4 hidden md:grid">
                        {[...Array(11)].map((_, i) => (
                          <div key={i} className="text-center text-[8px] font-black text-slate-300 uppercase">Jam {i+1}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {data.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 transition-all">
                            <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xs">
                              {item.jam_ke}
                            </div>
                            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2">
                               <div>
                                 <h5 className="text-[10px] font-black text-slate-950 uppercase">{item.keterangan || 'KBM'}</h5>
                                 <p className="text-[8px] font-bold text-slate-400 uppercase">{item.hari}, Jam Ke-{item.jam_ke}</p>
                               </div>
                               <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black italic">
                                 {item.waktu || '07:30 - 08:15'}
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'kerja' && data.map((item, idx) => (
                    <div key={idx} className="col-span-full bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-8 items-center">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center text-2xl shadow-xl shadow-blue-200">
                          <i className="fas fa-briefcase"></i>
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter">Jam Operasional.</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: <span className="text-emerald-500">Normal</span></p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center min-w-[120px]">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Jam Kerja</p>
                          <p className="text-sm font-black text-slate-950 italic">{item.jam_kerja || '07:00 - 16:00'}</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center min-w-[120px]">
                          <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Jam PTSP</p>
                          <p className="text-sm font-black text-blue-700 italic">{item.jam_ptsp || '08:00 - 15:30'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                  <div className="w-20 h-20 bg-white rounded-[2rem] shadow-lg flex items-center justify-center mb-6 text-slate-200">
                    <i className="fas fa-calendar-xmark text-3xl"></i>
                  </div>
                  <h4 className="text-xl font-black text-slate-400 uppercase italic tracking-tighter">
                    Data Tidak Tersedia.
                  </h4>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-2 max-w-xs mx-auto">
                    Koleksi untuk {activeTab} pada hari {selectedDay} belum dikonfigurasi oleh admin madrasah.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
