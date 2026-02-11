
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

export const ScheduleDutySection: React.FC = () => {
  const daysIndo = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at"];
  const currentDayName = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"][new Date().getDay()];
  const defaultDay = daysIndo.includes(currentDayName) ? currentDayName : "Senin";
  
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const [dutyList, setDutyList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dut = await apiService.getDutyStaffByDay(selectedDay);
        setDutyList(dut);
      } catch (error) {
        console.error("Failed to fetch schedule data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDay]);

  return (
    <section id="piket-harian" className="py-10 bg-slate-50/30 border-t border-slate-100 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Compact */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 p-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-950 uppercase italic leading-none">Jadwal Piket</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Standar: 07:00 — 16:00 WITA</p>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {daysIndo.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 md:px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                  selectedDay === day ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-950'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* List Petugas Compact */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-slate-100"></div>)}
          </div>
        ) : dutyList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dutyList.map((staff, i) => (
              <div key={staff.id || i} className="group bg-white border border-slate-200 rounded-2xl p-4 hover:border-blue-500 hover:shadow-lg transition-all flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="text-[11px] font-black text-slate-950 uppercase truncate leading-tight group-hover:text-blue-700">{staff.nama_petugas}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[8px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 uppercase">{staff.jenis_piket || 'Umum'}</span>
                    <span className="text-[8px] font-black text-blue-600 italic">{staff.waktu_mulai || '07:00'}-{staff.waktu_selesai || '16:00'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
            <p className="text-[10px] font-black text-slate-300 uppercase italic">Belum ada data untuk hari {selectedDay}</p>
          </div>
        )}
      </div>
    </section>
  );
};
