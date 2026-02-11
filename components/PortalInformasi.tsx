import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from '../services/apiService';

interface PortalInformasiProps {
  isLoggedIn?: boolean;
}

export const PortalInformasi: React.FC<PortalInformasiProps> = ({ isLoggedIn = false }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = () => {};
    if (isLoggedIn) {
        setLoading(true);
        const q = query(collection(db, "pengumuman"), orderBy("timestamp", "desc"), limit(20));
        unsub = onSnapshot(q, (sn) => {
          setData(sn.docs.map(d => ({ id: d.id, ...d.data() })));
          setLoading(false);
        }, (err) => {
          console.warn("Firestore: Akses pengumuman dibatasi.", err.message);
          setLoading(false);
        });
    } else {
        setLoading(false);
    }
    return () => unsub();
  }, [isLoggedIn]);

  // Wrapper section dengan min-h untuk stabilitas layout
  return (
    <section id="portal-informasi" className="py-6 md:py-10 bg-transparent w-full scroll-mt-32 min-h-[400px] transition-all duration-700">
      <div className="max-w-7xl mx-auto px-4">
        {!isLoggedIn ? (
          <div className="bg-slate-900 rounded-[3rem] p-12 text-center border border-white/5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-500">
             <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20"><i className="fas fa-bullhorn text-2xl"></i></div>
             <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Pengumuman Terproteksi.</h3>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest max-w-sm mx-auto">Informasi internal madrasah hanya dapat diakses oleh civitas akademika yang telah masuk ke sistem.</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
              <div>
                <h2 className="text-xl md:text-2xl font-[1000] text-slate-950 uppercase italic tracking-tighter leading-none">Pengumuman & Info</h2>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5 whitespace-nowrap">Live Digital Bulletin Board</p>
              </div>
            </div>

            <div className="bg-white/40 backdrop-blur-md border border-slate-100 rounded-[1.8rem] md:rounded-[2.5rem] shadow-sm overflow-hidden overflow-x-auto no-scrollbar min-h-[300px]">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[9px] font-black uppercase text-slate-400 italic">
                    <th className="px-5 py-3 w-32">Tanggal</th>
                    <th className="px-5 py-3">Isi Pengumuman</th>
                    <th className="px-5 py-3 text-right w-28">Kategori</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={3} className="px-5 py-20 text-center animate-pulse text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Menyinkronkan Database...</td></tr>
                  ) : data.length > 0 ? (
                    data.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-5 py-2.5">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter whitespace-nowrap">{item.tanggal || 'Baru Saja'}</p>
                        </td>
                        <td className="px-5 py-2.5">
                          <p className="text-[11px] font-black text-slate-950 uppercase italic group-hover:text-blue-600 transition-colors leading-tight">{item.judul || 'Info Penting'}</p>
                          <p className="text-[9px] text-slate-500 font-bold mt-0.5 leading-snug">{item.deskripsi || '-'}</p>
                        </td>
                        <td className="px-5 py-2.5 text-right">
                          <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter border whitespace-nowrap ${
                            item.kategori === 'Penting' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>
                            {item.kategori || 'Umum'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-5 py-12 text-center">
                        <i className="fas fa-comment-slash text-2xl text-slate-100 mb-3 block"></i>
                        <p className="text-[9px] font-black text-slate-300 uppercase italic">Belum ada pengumuman terbaru.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};