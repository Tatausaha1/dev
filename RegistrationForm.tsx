import React, { useState } from 'react';
import { addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

interface FormProps {
  participantsRef: any;
}

export const RegistrationForm: React.FC<FormProps> = ({ participantsRef }) => {
  const [formData, setFormData] = useState({ nama: '', kelas: '', email: '', whatsapp: '', idCardLink: '', lanyardLink: '' });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.idCardLink.includes('drive.google.com')) return alert("Link Google Drive harus valid dan dapat diakses publik!");
    setLoading(true);
    try {
      await addDoc(participantsRef, { ...formData, status: 'pending', timestamp: new Date().toISOString() });
      setShowSuccess(true);
      setFormData({ nama: '', kelas: '', email: '', whatsapp: '', idCardLink: '', lanyardLink: '' });
    } catch (err) { alert("Terjadi kesalahan saat menyimpan data."); } finally { setLoading(false); }
  };

  return (
    <section id="register" className="py-6 md:py-20 px-4 md:px-6 scroll-mt-24 md:scroll-mt-32">
      {showSuccess ? (
        <div className="max-w-xl mx-auto py-8 md:py-12 text-center animate-in">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-blue-600 text-white rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-2xl shadow-blue-200">
            <i className="fas fa-check text-xl md:text-3xl"></i>
          </div>
          <h2 className="text-xl md:text-3xl font-[950] text-slate-950 uppercase italic mb-1 md:mb-3">Berhasil!</h2>
          <p className="text-slate-800 mb-5 md:mb-8 text-[13px] md:text-base font-bold leading-tight">Karya anda telah masuk dalam antrean penilaian juri.</p>
          <button onClick={() => setShowSuccess(false)} className="px-6 py-3 md:px-8 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl text-[9px] md:text-[11px] font-[950] uppercase tracking-widest hover:bg-blue-600 transition-all">Kirim Karya Lain</button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-3xl rounded-2xl md:rounded-[3rem] border border-slate-200 p-5 md:p-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12">
            <div className="lg:col-span-4 space-y-2 md:space-y-4 text-center lg:text-left">
              <span className="text-[9px] md:text-[11px] font-[950] text-blue-700 uppercase tracking-[0.2em]">Portal Pengumpulan</span>
              <h2 className="text-2xl md:text-4xl font-[950] text-slate-950 uppercase italic tracking-tighter leading-none">Kirimkan <br className="hidden lg:block"/> Karya Terbaikmu.</h2>
              <p className="text-slate-800 text-[12px] md:text-base leading-snug md:leading-relaxed font-bold">
                Pastikan link Google Drive sudah diatur ke akses <span className="text-blue-700 underline decoration-blue-500/30">Publik</span> agar juri bisa melihat desainmu.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-3 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-6">
                {[
                  { l: 'Nama Lengkap', i: 'fa-user', k: 'nama', p: 'Nama sesuai absen...' },
                  { l: 'Kelas & Jurusan', i: 'fa-graduation-cap', k: 'kelas', p: 'Contoh: XI-A...' },
                  { l: 'Nomor WhatsApp', i: 'fab fa-whatsapp', k: 'whatsapp', p: '08xx-xxxx' },
                  { l: 'Alamat Email', i: 'fa-envelope', k: 'email', p: 'email@student.com', t: 'email' }
                ].map(f => (
                  <div key={f.k} className="space-y-1">
                    <label className="text-[9px] md:text-[11px] font-[950] text-slate-900 uppercase tracking-widest ml-1">{f.l}</label>
                    <div className="relative">
                      <i className={`fas ${f.i} absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-400 text-[12px] md:text-base`}></i>
                      <input 
                        required 
                        type={f.t || 'text'} 
                        className="w-full bg-slate-50 pl-10 md:pl-14 pr-4 py-2.5 md:py-4 rounded-xl md:rounded-2xl border-2 border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-[13px] md:text-sm font-bold text-slate-950 placeholder:text-slate-400" 
                        placeholder={f.p} 
                        value={formData[f.k as keyof typeof formData]} 
                        onChange={e => setFormData({...formData, [f.k]: e.target.value})} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-2.5 md:gap-6">
                {[
                  { l: 'Link G-Drive: Desain ID Card (Portrait)', i: 'fa-id-card', k: 'idCardLink' },
                  { l: 'Link G-Drive: Desain Lanyard (Lebar 2 cm)', i: 'fa-ribbon', k: 'lanyardLink' }
                ].map(f => (
                  <div key={f.k} className="space-y-1">
                    <label className="text-[9px] md:text-[11px] font-[950] text-slate-900 uppercase tracking-widest ml-1">{f.l}</label>
                    <div className="relative">
                      <i className={`fas ${f.i} absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-400 text-[12px] md:text-base`}></i>
                      <input 
                        required 
                        type="url" 
                        className="w-full bg-slate-50 pl-10 md:pl-14 pr-4 py-2.5 md:py-4 rounded-xl md:rounded-2xl border-2 border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-[13px] md:text-sm font-bold text-slate-950 placeholder:text-slate-400" 
                        placeholder="https://drive.google.com/file/d/..." 
                        value={formData[f.k as keyof typeof formData]} 
                        onChange={e => setFormData({...formData, [f.k]: e.target.value})} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button 
                disabled={loading} 
                className="w-full py-4 md:py-5 bg-slate-950 text-white rounded-xl md:rounded-[2rem] text-[11px] md:text-xs font-[950] uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-xl md:shadow-2xl shadow-slate-300 hover:bg-blue-700 hover:-translate-y-1 active:scale-98 transition-all flex items-center justify-center gap-3 mt-2"
              >
                {loading ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-cloud-upload-alt"></i>}
                Selesaikan Pengiriman
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};