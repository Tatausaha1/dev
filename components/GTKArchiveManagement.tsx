
import React, { useState, useMemo, useEffect } from 'react';

// Data Personel (Sesuai dengan daftar sebelumnya)
const DRIVE_DATA = [
  { id: 64, nama: "64. Akhmad Saukani", link: "1jtNrfeluhgEt64PMK_isUey9M6poUMOU" },
  { id: 69, nama: "Mahliadi", link: "1aSq6DVoPfmiWPoZVqz1eJWGkrlFj4fi9" },
  { id: 67, nama: "67. Muhtalani", link: "1gQbbEP100Txpo_xO8z7BCz_pDXFpmWMf" },
  { id: 66, nama: "66. Nor Syahrida", link: "1VBl-yqaHxJHUJR3mazgLnnbzu1Fn7Oi-" },
  { id: 65, nama: "65. Akhmad Rifani S.Pd", link: "1jZEB8XuJHLaPGnVfkLmoW4M1d6SCu357" },
  { id: 63, nama: "63. Silvianor Lita A.Md. Kom", link: "1hTqudb0dcfkKJNZIbIzGtLObJ8U3P_AS" },
  { id: 62, nama: "62. Welda Hermawati S.Pd", link: "1tKaQ_hTiWxWU6ZjVn3nNYktPWhquNBcN" },
  { id: 61, nama: "61. Wiwin Fahriyati S.Pd", link: "1q1DqYticwIN18dQInwrRRJz5C3BWXw33" },
  { id: 60, nama: "60. Siti Madinatul Munawarah S.Pd", link: "1BnYBGj7oCdnvzGr3GKzk4J3mAr4SYHdU" },
  { id: 59, nama: "59. Risnayanti S.Pd", link: "1rv2A6dwCFW5P6ZOWmdQYhU_ENdMC56bP" },
  { id: 58, nama: "58. Rangga Dahrizal S.Pd", link: "1B_oaZQWQfQimxt_Os0M3FiXhoXB0ETBJ" },
  { id: 57, nama: "57. Nor`Ih Santi S.Pd", link: "12LATjLI1NVbqwGGw9RZWn2AOflyZD7V4" },
  { id: 56, nama: "56. Milawati S.Pd", link: "1LSGwFLaamu0e3BcScD6AeMAtigKyb8Cg" },
  { id: 55, nama: "55. Hidayattullah S.Pd", link: "1yrwNlC_OCUH2jBtG50zfNSOE6d4QGp2C" },
  { id: 54, nama: "54. Ariyanti S.Pd", link: "1NHKZfv7IV6LS9On-T-tIaCrkZtq9aUol" },
  { id: 53, nama: "53. Rahmatullah Nizami S.Pd", link: "1bVLzxVlSg5eRGEbmboAkeWh2BK_QiW8e" },
  { id: 52, nama: "52. Muhammad Rizainnur Hafiz S.Pd", link: "1dkZ56AJYvIF9GygZcsyxx8wqYR2u0Cfe" },
  { id: 51, nama: "51. Masliana S.Pd", link: "1Y4qudLbrYElGQf1DeK7V1yujg4g2X-Ah" },
  { id: 50, nama: "50. Saprullah S.Pd.I", link: "1fJpLX98_GcWd5Yv8le6dV7p39_kH244Y" },
  { id: 49, nama: "49. Rity Riswati S.Pd", link: "1qCD3xTB2q8W-RG0I0_eFFsvpiGDOEQKB" },
  { id: 48, nama: "48. Helda Fitriani S.Pd", link: "1izrzUPnEjk-99E1y7aeyxdTeqjZNtMog" },
  { id: 47, nama: "47. Erni Soraya S.Pd", link: "1_OoZRABH6vDJjPTi7Pv9KkxcXjdcNPK1" },
  { id: 46, nama: "46. Ayu Minarti S.Pd", link: "1cr8RDQTvjV-bGagotdCfwrwWOMSRuW_e" },
  { id: 45, nama: "45. Asrida Maryanti S.Pd", link: "1IRzFjswgCbJkCcZz6Gto4zNknzcYs6WL" },
  { id: 44, nama: "44. Septian Rahman", link: "108qq2f9mWvwJ5j7OqWoP2ShWCK62YNZp" },
  { id: 43, nama: "43. Fitri Fatimah", link: "1Of_GEVEUwDHloUYzT92qPCfJ130weYHG" },
  { id: 42, nama: "42. Deta Atika Kamelia", link: "1rjCjDsGQQq-aoeC3EMEuzrIHnXPc1mHR" },
  { id: 41, nama: "41. Muhammad Hilman", link: "1xbIpW0GG0oTRDh9qKJY8Akgd3nPSTcCu" },
  { id: 40, nama: "40. Nurhayani S.Pd", link: "1fZ_ObsTlHFgRH0US4NbgKgWSHxTWPRXS" },
  { id: 39, nama: "39. Juhda Rahlia S.Ag", link: "1an5SvFE6ZjIqwF7omKPOxZO4MKAL9f6D" },
  { id: 38, nama: "38. Mahmudin S.Pd", link: "1lJqz4WTm9SiH3kKM5UA4HNyyv3K5Db3e" },
  { id: 37, nama: "37. Rina Ristanti S.Pd", link: "1gTjuyiTLSoXTy9Txa_-O8NuK53k8IU7D" },
  { id: 36, nama: "36. Noriyana S.Ag", link: "16R4CU7ObGtHvWpFMLgNOqWUxgxSTdEc1" },
  { id: 35, nama: "35. Muhammad Hefni S.Pd", link: "1fQVbcgZDcFa_guBQ_CMGq4kkGfdQEG79" },
  { id: 34, nama: "34. Hidayatullah A.Md", link: "1BsSrhqNziwrG4dQ4m4fj3h4t5cw4K5Yn" },
  { id: 33, nama: "33. Alfian Noor S.Pd", link: "16PblqWHqkDU-qbxUvoEmOgZBB-oSbgCB" },
  { id: 32, nama: "32. Akhmad Arifin", link: "108Ed6lbsStqxWNcRsi_GpmGm4hRzOVvS" },
  { id: 31, nama: "31. Muhammad Sayuti S.H.I M.M", link: "1QiAjqHML8g5XvC6wEUXSwMwTPmVulbDY" },
  { id: 30, nama: "30. Fahriah", link: "1LAd4WJmZqtXuwXOIoCUOdfUWuo__1MjJ" },
  { id: 29, nama: "29. Nor Arifin S.Sos.I", link: "1glp8PriM0igD6euvBUlehjC1rQrZJVjB" },
  { id: 28, nama: "28. Zuhaida Fitriani S.Pd.I", link: "1BVkAUPa1MbKvVxtfWwRtMh0etRc7uIwb" },
  { id: 27, nama: "27. Tutik Sujiyati S.Si", link: "1shr3XZwjfk8-Ee-wzli_VGcqdM-5WRuG" },
  { id: 26, nama: "26. Sri Hendriani S.Si", link: "1yT472wmUWrz8qM0G9806FvySCcb2iu9j" },
  { id: 25, nama: "25. Siti Shaufiah S.Ag", link: "1APYzDmGgHpzMiPJ2PIpH7hd0xgxQlneG" },
  { id: 24, nama: "24. Siti Raudah S.Pd. MM", link: "1PY8DMVYQRwV8ZyPDS5I-rY3APCavFDl5" },
  { id: 23, nama: "23. Rusmalina M.Pd", link: "1YSc8AbPjlgIc90XVXhvtPo-1uHrq7u5H" },
  { id: 22, nama: "22. Dra. Rusdiah M.Pd", link: "16MLpCz3tjJP1HaI3uQ2IGFn3xulkjvGa" },
  { id: 21, nama: "21. Nurmatiah S.Ag", link: "1P2nQjuE_8_QxxQpc3R_SPdR-7u1-Vx7j" },
  { id: 20, nama: "20. Normansyah S.Ag", link: "148ljriMGDpf_cM7lRYBOCMLYTyXBmV4L" },
  { id: 19, nama: "19. Noor Jannah S.Pd", link: "11s2w0bcwPo21Hvvg4k8DQRPuz2BbSv-n" },
  { id: 18, nama: "18. Muhammad Redha S.Pd.MM", link: "1YDVmEgCdBfcbO-6owhkKos5EeeOC9UhR" },
  { id: 17, nama: "17. Muhammad Nur Zaki S.Pd.I", link: "1fUe-Ttk6Mn1dBLgNIkCsB7HESdZJ-Kb7" },
  { id: 16, nama: "16. Muhammad Fadli S.E", link: "1cTiHXKi2aO3GVG8lhrN2Fa0wx5HSMfVu" },
  { id: 15, nama: "15. Muhammad As`Adi S.Pd.I", link: "1HpaxWAXE3esbT7XsSq37jC1Nmv22RO0M" },
  { id: 14, nama: "14. Mahriana S.Pd", link: "1N7xNcyuSSXIBUph2JX789IjCM9byNjBl" },
  { id: 13, nama: "13. Mahdiana Agustini M.Pd", link: "1w9GcL3dI60dqXBUZ_4YkT_fpsSOHRAGQ" },
  { id: 12, nama: "12. Lailatur Rahmah S.Pd.I", link: "133coGQRcbgLJ1NetnVXUZyPM1pj6QaG8" },
  { id: 11, nama: "11. Lailatun Nazilah S.Pd.I", link: "1yq0zAE2Fl66PHgxhM_KOEFkxpIMYUcMo" },
  { id: 10, nama: "10. Khairunnisa M.Pd", link: "1gHryO7mPvmNEM7mjc-0nicFxjPpj4_0" },
  { id: 9, nama: "9. Kamsiah S.Pd", link: "1jQ0c6RCpgB7KN-rvkCFWl3hGNHfrmTSU" },
  { id: 8, nama: "8. Harisuddin S.Pd.I", link: "1yEhepNu2oMzO5ZXUtJOlATeHYdXnIICe" },
  { id: 7, nama: "7. Drs. Halidi", link: "1IMWwc_u4OT_1_XYPwtWV3Xj_J3_qcdQy" },
  { id: 6, nama: "6. H. Someran S.Pd. M.M", link: "1WKng-yCUHE9X3OVDYbZWyZ5GD2IW_8Ta" },
  { id: 5, nama: "5. Eda Isnani S.Pd", link: "1gMhDNgfmcaWqSCBGaVAG3KskL7NsQw_S" },
  { id: 4, nama: "4. Dra. Mahmudah MM", link: "16dc89UrQqvU6q20lkpE9WRlqjpkQWPqM" },
  { id: 3, nama: "3. Arief Rahman Hakim S.Ag", link: "185qzmFtTbZY-tO3ZH2fsomGiLZMqhXdy" },
  { id: 2, nama: "2. Arbani S.Ag", link: "1CfSEkvfKNjM3-Oa8q1uOtKswasoP6rM" },
  { id: 1, nama: "1. Alfi Syahrin S.Sos", link: "1eiJj0-lyXihu839eZMRgNjUj33bgqB20" }
];

const Icons = {
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Folder: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7 7z" />
    </svg>
  ),
  Upload: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  External: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

export const GTKArchiveManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const filteredData = useMemo(() => {
    return DRIVE_DATA.filter(item => 
      item.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSelect = (item: any) => {
    setLoading(true);
    setSelectedPerson(item);
  };

  const openDriveLink = (link: string) => {
    window.open(`https://drive.google.com/drive/folders/${link}`, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-['Inter'] antialiased">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header Utama */}
        <header className="mb-10 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full">
             <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
             <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Database Node</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight italic uppercase">Manajemen Arsip Pegawai</h1>
          <p className="text-slate-500 font-medium">Sistem Integrasi Berkas & Google Drive MAN 1 HST</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar - Daftar Pegawai */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-5 rounded-[2.5rem] shadow-sm h-[750px] flex flex-col">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2 ml-1">
                   <div className="h-1 w-3 bg-blue-600 rounded-full"></div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cari Pegawai</label>
                </div>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Icons.Search />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Nama / NIP..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-bold uppercase italic tracking-tight"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                   <i className="fas fa-users text-slate-300 text-xs"></i>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Indeks Nama</span>
                </div>
                <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-lg text-[9px] font-black border border-blue-100">{filteredData.length}</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 no-scrollbar scroll-smooth">
                {filteredData.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold transition-all border border-transparent outline-none flex items-center gap-3 ${
                      selectedPerson?.id === item.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 border-blue-600' 
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedPerson?.id === item.id ? 'bg-white animate-pulse' : 'bg-slate-300'}`}></span>
                    <span className="truncate italic uppercase tracking-tighter">{item.nama}</span>
                  </button>
                ))}
                {filteredData.length === 0 && (
                  <div className="text-center py-10 flex flex-col items-center gap-3 opacity-30">
                    <i className="fas fa-search text-2xl"></i>
                    <p className="text-[10px] font-black uppercase italic tracking-widest">Tidak Ditemukan</p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Konten Utama */}
          <main className="lg:col-span-8 xl:col-span-9">
            {!selectedPerson ? (
              <div className="bg-white border-2 border-dashed border-slate-200 p-16 rounded-[3.5rem] flex flex-col items-center justify-center text-center h-[750px] shadow-sm">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-pulse border border-blue-100">
                  <Icons.Folder />
                </div>
                <h2 className="text-2xl font-[1000] text-slate-800 uppercase italic tracking-tighter">Pilih Pegawai</h2>
                <p className="text-slate-500 mt-2 max-w-sm font-medium">Silakan pilih nama pegawai dari daftar indeks di samping untuk mengakses folder dokumen cloud mereka.</p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 border border-white/20">
                      <Icons.User />
                    </div>
                    <div>
                      <h2 className="text-xl font-[1000] text-slate-800 leading-tight tracking-tight uppercase italic">{selectedPerson.nama}</h2>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                         <p className="text-[10px] text-blue-500 font-black tracking-widest uppercase italic">Node Cloud: Aktif</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => openDriveLink(selectedPerson.link)}
                      className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 group italic active:scale-95"
                    >
                      <span className="group-hover:-translate-y-1 transition-transform">
                        <Icons.Upload />
                      </span>
                      Unggah ke Drive
                    </button>
                    
                    <button 
                      onClick={() => openDriveLink(selectedPerson.link)}
                      className="flex-1 md:flex-none bg-slate-950 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-xl italic active:scale-95"
                    >
                      <Icons.External />
                      Buka Direktori
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-5 rounded-[1.8rem] text-[11px] flex items-start gap-4">
                  <div className="mt-0.5 text-blue-600">
                    <Icons.Info />
                  </div>
                  <p className="text-blue-800 font-bold leading-relaxed">
                    Pemberitahuan: Jika muncul pesan <b>"403 Forbidden"</b> atau konten tidak tampil di bawah, klik tombol <b>Buka Direktori</b>. Kebijakan privasi Google terkadang membatasi tampilan folder di dalam aplikasi (iframe).
                  </p>
                </div>

                <div className="relative w-full h-[580px] bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-200">
                  {loading && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
                      <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sinkronisasi Berkas...</span>
                    </div>
                  )}
                  <iframe 
                    src={`https://drive.google.com/embeddedfolderview?id=${selectedPerson.link}#list`}
                    className="w-full h-full border-none"
                    onLoad={() => setLoading(false)}
                    title={`Folder Drive ${selectedPerson.nama}`}
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
