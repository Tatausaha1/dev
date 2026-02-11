import React from 'react';
import { CUTI_SERVICES } from '../constants.ts';

interface LayananCutiPortalProps {
  onBack: () => void;
  // Fix: Added optional isTabMode property to resolve TypeScript error in LayananSubmit.tsx
  isTabMode?: boolean;
}

// Fix: Destructured isTabMode from props in the component definition
export const LayananCutiPortal: React.FC<LayananCutiPortalProps> = ({ onBack, isTabMode }) => {
  return (
    <div className="animate-in slide-in-from-right-4 duration-500 space-y-10">
      {/* Header Hub Cuti */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-5">
           <button onClick={onBack} className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-950 hover:text-white transition-all shadow-sm active:scale-90">
              <i className="fas fa-arrow-left text-sm"></i>
           </button>
           <div className="space-y-1">
              <h3 className="text-2xl md:text-4xl font-[1000] text-slate-950 italic uppercase tracking-tighter leading-none">Hub Layanan <span className="text-blue-600">Cuti ASN.</span></h3>
              <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Kantor Kementerian Agama Hulu Sungai Tengah</p>
           </div>
        </div>
        <div className="hidden lg:flex items-center gap-4">
           <div className="px-5 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic">Service Hub Active</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Utama: Pengajuan & Pantau */}
        <div className="lg:col-span-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Pengajuan */}
              <a 
                href={CUTI_SERVICES.FORM_USUL} 
                target="_blank" 
                className="group relative bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100/50"></div>
                <div className="relative z-10">
                   <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                      <i className="fas fa-file-signature text-2xl"></i>
                   </div>
                   <h4 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter mb-2">Formulir Usul Cuti</h4>
                   <p className="text-slate-400 text-xs font-bold leading-relaxed uppercase tracking-wider">Isi formulir pengajuan cuti resmi ASN Kemenag HST secara digital melalui portal resmi.</p>
                </div>
                <div className="mt-10 flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-widest italic group-hover:translate-x-2 transition-transform">
                   Buka Formulir <i className="fas fa-external-link-alt"></i>
                </div>
              </a>

              {/* Card Antrean */}
              <a 
                href={CUTI_SERVICES.QUEUE_SHEET} 
                target="_blank" 
                className="group relative bg-slate-950 p-8 rounded-[3rem] border border-white/5 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20"></div>
                <div className="relative z-10">
                   <div className="w-16 h-16 bg-emerald-600 text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <i className="fas fa-list-check text-2xl"></i>
                   </div>
                   <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Pantau Antrean</h4>
                   <p className="text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-wider">Lacak status proses pengajuan cuti Anda secara real-time melalui sistem antrean cloud.</p>
                </div>
                <div className="mt-10 flex items-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-widest italic group-hover:translate-x-2 transition-transform">
                   Lihat Spreadsheet <i className="fas fa-table"></i>
                </div>
              </a>
           </div>

           {/* Banner Informasi */}
           <div className="bg-blue-50 border border-blue-100 p-8 rounded-[3rem] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
              <div className="absolute -bottom-8 -right-8 opacity-5">
                 <i className="fas fa-info-circle text-[12rem]"></i>
              </div>
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-blue-600 shadow-sm shrink-0 border border-blue-100">
                 <i className="fas fa-bullhorn text-3xl"></i>
              </div>
              <div className="space-y-2 relative z-10 text-center md:text-left">
                 <h4 className="text-xl font-black text-slate-950 uppercase italic tracking-tight">Prosedur Digital.</h4>
                 <p className="text-sm font-bold text-slate-600 leading-relaxed">
                   Pastikan Anda telah mengisi formulir dengan data yang valid. Status "Selesai" pada antrean menandakan dokumen cuti Anda telah diproses oleh bagian Kepegawaian Kemenag HST.
                 </p>
              </div>
           </div>
        </div>

        {/* Sidebar: Templates */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
              <div className="space-y-1">
                 <h4 className="text-lg font-black text-slate-950 uppercase italic tracking-tighter leading-none">Template Dokumen.</h4>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unduh Format Resmi</p>
              </div>

              <div className="space-y-4">
                 {/* Template PNS */}
                 <a 
                   href={CUTI_SERVICES.DOC_TEMPLATE_PNS} 
                   target="_blank" 
                   className="group flex items-center gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-500 hover:bg-white transition-all shadow-sm active:scale-95"
                 >
                    <div className="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                       <i className="fas fa-file-word text-lg"></i>
                    </div>
                    <div>
                       <p className="text-[11px] font-black text-slate-900 uppercase italic">Cuti PNS</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Format Kemenag HST</p>
                    </div>
                    <i className="fas fa-download ml-auto text-[10px] text-slate-300 group-hover:text-blue-500 transition-colors"></i>
                 </a>

                 {/* Template PPPK */}
                 <a 
                   href={CUTI_SERVICES.DOC_TEMPLATE_PPPK} 
                   target="_blank" 
                   className="group flex items-center gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-500 hover:bg-white transition-all shadow-sm active:scale-95"
                 >
                    <div className="w-12 h-12 bg-white text-emerald-600 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                       <i className="fas fa-file-word text-lg"></i>
                    </div>
                    <div>
                       <p className="text-[11px] font-black text-slate-900 uppercase italic">Cuti PPPK</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Format Khusus PPPK</p>
                    </div>
                    <i className="fas fa-download ml-auto text-[10px] text-slate-300 group-hover:text-emerald-500 transition-colors"></i>
                 </a>
              </div>

              <div className="pt-6 border-t border-slate-50">
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                   *Gunakan template di atas jika diminta mengunggah lampiran fisik dalam formulir.
                 </p>
              </div>
           </div>

           <div className="p-8 bg-slate-950 rounded-[3rem] text-white flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-blue-400">
                 <i className="fas fa-headset"></i>
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest">Bantuan Teknis</p>
              <a href="https://wa.me/6285391706131" target="_blank" className="text-xs font-bold text-blue-400 hover:underline italic">Kontak Kepegawaian</a>
           </div>
        </div>
      </div>
    </div>
  );
};