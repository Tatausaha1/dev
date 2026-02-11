# IMAM V6.1 - Integrated Madrasah Academic Management
### Portal Pelayanan Terpadu Satu Pintu (PTSP) Digital - MAN 1 Hulu Sungai Tengah

**IMAM V6.1** adalah platform manajemen pelayanan publik dan internal madrasah berbasis cloud yang dirancang untuk mendukung transformasi digital menuju Zona Integritas (WBK/WBBM).

---

## 🚨 Git Disaster Recovery (Jika Push Gagal/Terlalu Berat)

Jika Anda lupa mengatur `.gitignore` dan Git mencoba mengunggah ribuan file dari `node_modules`, jalankan 3 perintah sakti ini secara berurutan:

### 1. Paksa Git "Melupakan" File Sampah
Ini akan menghapus file dari daftar unggahan tapi **TIDAK** menghapus folder asli di laptop Anda:
```bash
git rm -r --cached .
```

### 2. Tambahkan Ulang dengan Filter Baru
Pastikan file `.gitignore` sudah ada di folder root, lalu jalankan:
```bash
git add .
```

### 3. Commit Pembersihan
```bash
git commit -m "chore: remove untracked node_modules and cleanup repository"
git push origin main
```

---

## 🚀 Fitur Utama (Core Modules)

- **Gateway Terpadu**: Jalur tunggal untuk pengajuan layanan siswa, alumni, dan umum.
- **Synchronized Tracking**: Pelacakan status berkas secara real-time dengan ID unik (REQ-YYYY-xxxx).
- **Node GTK Internal**: Manajemen presensi, laporan kinerja (tukin), dan integrasi EMIS 4.0.
- **Cloud Archiving**: Penyimpanan dokumen terenkripsi dengan teknologi Hybrid (Base64 & Cloud Storage).
- **IMAM Brain AI**: Asisten virtual cerdas berbasis Google Gemini 3.0 untuk bantuan layanan 24/7.
- **Live Queue Manager**: Sistem antrean loket terintegrasi dengan Voice-over-IP AI.

---

## 🛠 Spesifikasi Teknis (Tech Stack)

- **Frontend**: React 19 (TypeScript) + Tailwind CSS.
- **Database**: Firebase Firestore (NoSQL) dengan Sinkronisasi Real-time.
- **Engine AI**: Google Gemini API (Flash 3.0 & Pro Preview).

---

## 🛡️ Keamanan & Privasi
Sistem ini mengimplementasikan **Security Rules Firestore level-4**:
- Pemohon hanya dapat membaca data miliknya sendiri.
- Log aktivitas bersifat *Append-only* (tidak dapat dihapus).

---

&copy; 2026 **IMAM Core Node** | Madrasah Cloud Service MAN 1 Hulu Sungai Tengah.  
*Bakambang, Babuah, Batuah.*