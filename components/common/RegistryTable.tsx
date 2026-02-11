import React from 'react';
import { StatusBadge } from './InteractionHub.tsx';

interface RegistryTableProps {
  participants: any[];
  currentUser: any | null;
}

export const RegistryTable: React.FC<RegistryTableProps> = ({ participants, currentUser }) => (
  <section id="registry-table" className="py-4 md:py-10 relative z-10 scroll-mt-24 px-2 md:px-0">
    <div className="max-w-6xl mx-auto w-full">
      
      {/* Header Padat */}
      <div className="mb-4 md:mb-6 flex items-end justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]"></div>
          <div>
            <h2 className="text-xl md:text-3xl font-[1000] text-slate-950 uppercase italic tracking-tighter leading-none">Status <span className="text-blue-600 not-italic">Pendaftaran.</span></h2>
            <p className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-0.5">Cloud Database Index</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-slate-950 text-white px-4 py-2 rounded-xl border border-white/5 shadow-lg">
          <span className="text-[9px] font-black uppercase italic">Live: <span className="text-blue-400">{participants.length}</span> Nodes</span>
        </div>
      </div>

      {/* Desktop Table - Ultra Condensed */}
      <div className="hidden md:block bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden relative">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
              <th className="px-5 py-3 w-16 text-center">No</th>
              <th className="px-5 py-3">Identitas Detil</th>
              <th className="px-5 py-3 text-center">Kelas</th>
              <th className="px-5 py-3 text-center">Aset Digital</th>
              <th className="px-5 py-3 text-right">Status Jalur</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {participants.map((p, i) => (
              <tr key={p.id} className="group hover:bg-blue-50/30 transition-all duration-200">
                <td className="px-5 py-2.5 font-black text-slate-300 digital-font text-center text-xs italic">
                  {(i + 1).toString().padStart(2, '0')}
                </td>
                <td className="px-5 py-2.5">
                  <div className="flex flex-col leading-tight">
                    <span className="font-[900] text-slate-950 italic text-sm tracking-tight group-hover:text-blue-700 transition-colors uppercase">
                      {p.nama}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                      WA: {p.whatsapp || 'NOT_LINKED'}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-2.5 text-center">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[8px] font-black uppercase italic border border-slate-200">
                    {p.kelas}
                  </span>
                </td>
                <td className="px-5 py-2.5">
                  <div className="flex justify-center gap-1.5">
                    {currentUser ? (
                      <>
                        <a href={p.idCardLink} target="_blank" className="w-8 h-8 bg-white border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:border-blue-600">
                          <i className="fas fa-id-card text-[10px]"></i>
                        </a>
                        <a href={p.lanyardLink} target="_blank" className="w-8 h-8 bg-white border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:border-blue-600">
                          <i className="fas fa-ribbon text-[10px]"></i>
                        </a>
                      </>
                    ) : (
                      <div className="w-16 h-8 bg-slate-50 border border-slate-100 text-slate-200 rounded-lg flex items-center justify-center text-[8px] font-black uppercase italic cursor-not-allowed">
                        <i className="fas fa-lock mr-1.5"></i> Locked
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-5 py-2.5 text-right scale-[0.85] origin-right">
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE LIST DETAIL - Ultra Compact Cards */}
      <div className="md:hidden flex flex-col gap-1.5">
        {participants.map((p, i) => (
          <div key={p.id} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2 transition-all active:bg-blue-50 relative overflow-hidden">
            {/* Indikator Nomor Mini */}
            <div className="absolute top-0 left-0 px-2 py-0.5 bg-slate-50 text-slate-300 font-black text-[7px] rounded-br-lg italic border-r border-b border-slate-100">
              ID-{(i + 1).toString().padStart(2, '0')}
            </div>

            <div className="flex justify-between items-start pt-1">
              <div className="min-w-0 flex-1 pr-4">
                <h4 className="font-[1000] text-slate-950 italic text-[13px] leading-tight truncate uppercase tracking-tight">
                  {p.nama}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[8px] font-black text-blue-600 uppercase italic bg-blue-50 px-1.5 py-0.5 rounded">
                    {p.kelas}
                  </span>
                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">
                    {p.whatsapp || 'AUTHENTICATION_PENDING'}
                  </span>
                </div>
              </div>
              <div className="scale-[0.75] origin-top-right -mt-1">
                <StatusBadge status={p.status} />
              </div>
            </div>
            
            {/* Quick Actions Padat */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
              <div className="flex gap-1.5">
                {currentUser ? (
                  <>
                    <a href={p.idCardLink} target="_blank" className="bg-slate-950 text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg italic">
                      <i className="fas fa-id-card text-[9px]"></i> ID_CARD
                    </a>
                    <a href={p.lanyardLink} target="_blank" className="bg-white text-slate-400 border border-slate-200 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-2 italic">
                      <i className="fas fa-ribbon text-[9px]"></i> TALI
                    </a>
                  </>
                ) : (
                  <div className="bg-slate-50 text-slate-300 border border-slate-100 px-3 py-1.5 rounded-xl text-[7px] font-black uppercase tracking-[0.2em] flex items-center gap-2 italic cursor-not-allowed">
                    <i className="fas fa-shield-halved"></i> SECURE_ENCRYPTED_NODE
                  </div>
                )}
              </div>
              <div className="text-[7px] font-black text-slate-200 digital-font uppercase tracking-tighter italic">
                VERIFIED_DOC
              </div>
            </div>
          </div>
        ))}

        {participants.length === 0 && (
          <div className="py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2">
            <i className="fas fa-database text-2xl text-slate-100"></i>
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em] italic">No Nodes Discovered In Sector</p>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-[7px] font-black text-slate-200 uppercase tracking-[0.5em] animate-pulse italic">End-to-End Encrypted Cloud Synchronizer</p>
    </div>
  </section>
);
