
import React, { useState } from 'react';
import { LOGOS, DOWNLOAD_LINKS } from './constants.ts';

export const CompetitionInfo: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [showFullRules, setShowFullRules] = useState(false);

  const assets = [
    { name: "MAN 1 Hulu Sungai Tengah", type: "Madrasah", img: LOGOS.MAN1HuluSungaiTengah, link: DOWNLOAD_LINKS.MAN1HuluSungaiTengah, isPreviewable: true, desc: "Logo resmi Madrasah Aliyah Negeri 1 Hulu Sungai Tengah." },
    { name: "KEMENAG", type: "Instansi", img: LOGOS.KEMENAG, link: DOWNLOAD_LINKS.KEMENAG, isPreviewable: true, desc: "Logo Kementerian Agama Republik Indonesia." },
    { name: "IMAM V6.1", type: "Ekosistem Digital", img: LOGOS.IMAM, link: DOWNLOAD_LINKS.IMAM, isPreviewable: true, desc: "Logo identitas sistem manajemen akademik digital." },
    { name: "Contoh Lanyard", type: "Referensi", img: LOGOS.LANYARD_REF, link: DOWNLOAD_LINKS.LANYARD_REF, isPreviewable: true, desc: "Referensi visual untuk proporsi desain tali (lanyard)." }
  ];

  const coreGuidelines = [
    { 
      t: "Tema & Identitas", 
      i: "fa-palette", 
      d: "Tema: 'Bakambang, Babuah, Batuah'. Wajib menggunakan palet warna IMAM: Tosca & Kuning." 
    },
    { 
      t: "ID Card (ISO 7810)", 
      i: "fa-id-card", 
      d: "85.60 x 53.98 mm (Standar PVC). Wajib 2 sisi: Depan (Identitas) & Belakang (Perpustakaan)." 
    },
    { 
      t: "Spek Lanyard", 
      i: "fa-ribbon", 
      d: "Lebar 1.5 cm atau 2 cm. Wajib mencantumkan tagline secara berulang sepanjang tali." 
    },
    { 
      t: "Teks Wajib", 
      i: "fa-quote-left", 
      d: "'MAN 1 Hulu Sungai Tengah | IMAM V6.1 Bakambang, Babuah, Batuah' wajib disertakan." 
    }
  ];

  return (
    <section id="assets" className="py-12 md:py-20 relative z-10 scroll-mt-32">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-7 space-y-8 md:space-y-10">
          <div className="space-y-2">
            <span className="text-[10px] font-[950] text-blue-700 uppercase tracking-[0.2em]">Ringkasan Lomba Resmi</span>
            <h2 className="text-2xl md:text-4xl font-[950] text-slate-950 uppercase italic tracking-tighter leading-none">Panduan <br/> Kompetisi.</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {coreGuidelines.map((d, i) => (
              <div key={i} className="group bg-white/70 p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:shadow-xl hover:border-blue-400 transition-all">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner group-hover:bg-blue-700 group-hover:text-white transition-all">
                  <i className={`fas ${d.i} text-base md:text-lg`}></i>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[11px] md:text-[12px] font-[950] uppercase text-slate-950 tracking-tight">{d.t}</h4>
                  <p className="text-[12px] md:text-[13px] text-slate-800 leading-snug font-bold">{d.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-950 rounded-2xl text-white">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
               <i className="fas fa-scroll text-xl"></i>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-[950] text-blue-400 uppercase tracking-widest">Syarat & Ketentuan Lengkap</p>
              <p className="text-[11px] text-slate-300 font-bold">Baca detail hak cipta, kriteria penilaian, dan jadwal pengiriman.</p>
            </div>
            <button 
              onClick={() => setShowFullRules(true)}
              className="px-5 py-2.5 bg-white text-slate-950 rounded-xl text-[9px] font-[950] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all cursor-pointer"
            >
              Lihat S&K
            </button>
          </div>

          <div className="space-y-3 pt-2 md:pt-4">
            <p className="text-[10px] font-[950] text-slate-900 uppercase tracking-[0.2em] ml-1">Pustaka Aset & Referensi</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              {assets.map((a, i) => (
                <div key={i} className="group bg-white border-2 border-slate-100 p-3 md:p-5 rounded-2xl md:rounded-3xl flex flex-col items-center hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all text-center relative overflow-hidden">
                  <div className="h-12 md:h-16 flex items-center mb-2 md:mb-3">
                    <img src={a.img} className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-110" alt={a.name} />
                  </div>
                  <p className="text-[7px] md:text-[8px] font-[950] text-blue-700 uppercase tracking-widest mb-0.5 md:mb-1">{a.type}</p>
                  <p className="text-[9px] md:text-[10px] font-[950] text-slate-950 uppercase truncate w-full mb-3">{a.name}</p>
                  
                  <div className="flex gap-2 w-full mt-auto">
                    <button 
                      onClick={() => setSelectedAsset(a)}
                      className="flex-1 py-2 bg-blue-700 text-white rounded-lg text-[8px] font-[950] uppercase tracking-widest hover:bg-blue-800 transition-colors cursor-pointer"
                    >
                      Pratinjau
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-slate-950 p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] text-white shadow-2xl space-y-6 md:space-y-8 relative overflow-hidden lg:sticky lg:top-32">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-600/20 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-600/10 rounded-full blur-[80px]"></div>
            
            <div className="space-y-1 md:space-y-2 relative z-10">
              <h3 className="text-2xl md:text-4xl font-[950] uppercase italic tracking-tighter leading-none">Penghargaan <br/> Pemenang.</h3>
              <p className="text-slate-400 text-[10px] md:text-sm font-bold">Apresiasi untuk karya terbaik.</p>
            </div>
            
            <div className="space-y-4 md:space-y-5 relative z-10">
              {[
                { 
                  l: "Dana Pembinaan", 
                  v: "Total IDR 400.000", 
                  d: "Diharapkan dapat membantu pengembangan bakat.",
                  i: "fa-money-bill-wave", 
                  c: "text-emerald-400" 
                },
                { 
                  l: "Penghargaan Khusus", 
                  v: "Sertifikat Kepala Madrasah", 
                  d: "Simbol prestasi tertinggi kebanggaan madrasah.",
                  i: "fa-award", 
                  c: "text-amber-400" 
                },
                { 
                  l: "Jadwal", 
                  v: "Batas 01 Feb 2026", 
                  d: "Pengumuman pemenang: 02 Februari 2026.",
                  i: "fa-calendar-check", 
                  c: "text-blue-400" 
                }
              ].map((p, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/20">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 mt-1"><i className={`fas ${p.i} ${p.c} text-lg md:text-xl`}></i></div>
                  <div className="space-y-0.5">
                    <p className={`text-[8px] md:text-[9px] font-[950] uppercase tracking-widest ${p.c}`}>{p.l}</p>
                    <p className="text-white text-sm md:text-base font-black tracking-tight leading-tight">{p.v}</p>
                    <p className="text-slate-400 text-[9px] md:text-[10px] font-medium leading-snug">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 relative z-10">
               <p className="text-[8px] md:text-[9px] font-[950] text-slate-500 uppercase tracking-[0.2em] mb-2">Dipersembahkan oleh:</p>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black">HM</div>
                  <div>
                    <p className="text-[10px] md:text-[11px] font-[950] text-white uppercase tracking-wider">Kepala Madrasah:</p>
                    <p className="text-[11px] md:text-[12px] font-black text-blue-400 italic">H. Someran, S.Pd., MM</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      {showFullRules && (
        <div className="fixed inset-0 z-[250] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="space-y-1">
                <h2 className="text-2xl font-[950] text-slate-950 uppercase italic tracking-tighter">Syarat & Ketentuan.</h2>
                <p className="text-[10px] font-[950] text-blue-700 uppercase tracking-widest">Aturan Resmi & Legal</p>
              </div>
              <button onClick={() => setShowFullRules(false)} className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-950 hover:bg-slate-950 hover:text-white transition-all border border-slate-200 cursor-pointer">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-8 space-y-8 text-sm text-slate-900 leading-relaxed font-bold">
              <section className="space-y-3">
                <h4 className="text-xs font-[950] text-slate-950 uppercase tracking-widest border-l-4 border-blue-700 pl-3">1. Ketentuan Umum</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Terbuka bagi seluruh siswa aktif <b>MAN 1 Hulu Sungai Tengah</b>.</li>
                  <li>Desain orisinal, tidak mengandung SARA, dan belum pernah dilombakan.</li>
                  <li>Integrasi Logo: Wajib menyertakan logo <b>Kemenag, MAN 1 HST,</b> dan <b>IMAM V6.1</b>.</li>
                  <li>Tagline Wajib: <span className="text-blue-700 font-[950] italic">"Bakambang, Babuah, Batuah"</span>.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h4 className="text-xs font-[950] text-slate-950 uppercase tracking-widest border-l-4 border-blue-700 pl-3">2. Spesifikasi Teknis</h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                   <div>
                      <p className="text-[10px] font-[950] text-slate-950 uppercase mb-1">A. ID Card (Kartu Pelajar & Perpustakaan)</p>
                      <p className="text-[12px] text-slate-800">Dimensi Standar PVC (85.60 x 53.98 mm). Sisi depan berisi identitas, sisi belakang berisi tata tertib & QR Code sistem IMAM.</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-[950] text-slate-950 uppercase mb-1">B. Lanyard (Tali)</p>
                      <p className="text-[12px] text-slate-800">Lebar 1.5cm atau 2cm. Dominasi warna <b>Tosca</b> atau kombinasi kontras dengan <b>Kuning</b> sesuai identitas IMAM.</p>
                   </div>
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="text-xs font-[950] text-slate-950 uppercase tracking-widest border-l-4 border-blue-700 pl-3">3. Penilaian & Hak Cipta</h4>
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 bg-blue-100 border border-blue-200 rounded-xl">
                      <p className="text-[9px] font-[950] text-blue-700 uppercase">Kreativitas</p>
                      <p className="text-xl font-[950] text-slate-950">30%</p>
                   </div>
                   <div className="p-3 bg-indigo-100 border border-indigo-200 rounded-xl">
                      <p className="text-[9px] font-[950] text-indigo-700 uppercase">Keserasian Tema</p>
                      <p className="text-xl font-[950] text-slate-950">30%</p>
                   </div>
                </div>
                <p className="text-[11px] text-slate-800 italic mt-2 font-bold">Karya pemenang utama akan menjadi identitas resmi kartu pelajar/perpustakaan digital MAN 1 HST.</p>
              </section>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button onClick={() => setShowFullRules(false)} className="px-8 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-[950] uppercase tracking-widest hover:bg-blue-700 transition-all cursor-pointer">
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Dynamic Asset Preview Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-[300] bg-slate-950/98 backdrop-blur-3xl flex flex-col animate-in">
          <div className="flex justify-between items-center p-6 md:p-8 lg:px-12">
            <div className="space-y-1">
              <h2 className="text-xl md:text-3xl font-[950] text-white uppercase italic tracking-tighter">{selectedAsset.name}</h2>
              <p className="text-[10px] md:text-[11px] font-[950] text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <i className="fas fa-expand"></i> Pratinjau Aset {selectedAsset.type} &bull; HD
              </p>
            </div>
            <button 
              onClick={() => setSelectedAsset(null)}
              className="w-12 h-12 md:w-16 md:h-16 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/10 cursor-pointer active:scale-90"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden">
            <div className="relative h-full w-full flex items-center justify-center">
              <img 
                src={selectedAsset.img} 
                className="max-w-full max-h-full object-contain rounded-xl md:rounded-3xl shadow-[0_0_120px_rgba(59,130,246,0.4)] border border-white/5"
                alt={selectedAsset.name}
                style={{ filter: 'contrast(1.05) saturate(1.1)' }}
              />
            </div>
          </div>

          <div className="p-6 md:p-8 lg:px-12 bg-slate-900/50 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20"><i className="fas fa-info-circle text-xl"></i></div>
              <div className="space-y-0.5">
                <p className="text-[10px] md:text-[12px] font-[950] text-white uppercase tracking-widest">Informasi Aset</p>
                <p className="text-[11px] md:text-xs text-slate-300 max-w-lg leading-snug font-bold">
                  {selectedAsset.desc}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <a 
                href={selectedAsset.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 md:flex-none px-8 py-4 bg-white text-slate-950 rounded-2xl text-[10px] md:text-[11px] font-[950] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-xl text-center whitespace-nowrap"
              >
                Unduh Master File
              </a>
              <button 
                onClick={() => setSelectedAsset(null)}
                className="hidden md:flex items-center justify-center px-6 py-4 bg-slate-800 text-slate-400 rounded-2xl text-[10px] font-[950] uppercase tracking-widest border border-white/5 hover:bg-slate-700 transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
