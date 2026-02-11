# IMAM V6.1 - Integrated Madrasah Academic Management
### Portal Pelayanan Terpadu Satu Pintu (PTSP) Digital - MAN 1 Hulu Sungai Tengah

**IMAM V6.1** adalah ekosistem manajemen madrasah modern berbasis cloud yang mengintegrasikan AI (Gemini), Firestore, dan Real-time Database untuk pelayanan publik yang transparan dan akuntabel.

---

## 🚀 Panduan Deploy ke Vercel (Recommended)

Platform ini dioptimalkan sepenuhnya untuk infrastruktur **Vercel**. Ikuti langkah-langkah berikut untuk mengaktifkan portal Anda secara global:

### 1. Persiapan Repositori GitHub
Pastikan seluruh kode sumber telah diunggah ke repositori GitHub Anda. 
*   **PENTING**: File `.gitignore` harus ada untuk memastikan folder `node_modules` dan file `.env` lokal tidak ikut terunggah (keamanan kredensial).

### 2. Hubungkan ke Vercel
1. Buka [Vercel Dashboard](https://vercel.com/) dan login menggunakan akun GitHub Anda.
2. Klik tombol **"Add New"** lalu pilih **"Project"**.
3. Cari nama repositori proyek ini dan klik **"Import"**.

### 3. Konfigurasi Variabel Lingkungan (KRUSIAL)
Agar fitur kecerdasan buatan (IMAM AI Brain) berfungsi, Anda **WAJIB** menambahkan API Key sebelum melakukan deployment:
1. Pada halaman konfigurasi sebelum deploy, buka bagian **Environment Variables**.
2. Tambahkan variabel baru:
   - **Key**: `API_KEY`
   - **Value**: `[Masukkan Kode Gemini API Key Anda]`
3. Tambahkan juga (opsional untuk redundansi):
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `[Masukkan Kode Gemini API Key Anda]`
4. Klik **Add**.

### 4. Pengaturan Build & Output
Sistem akan mendeteksi **Vite** secara otomatis. Pastikan pengaturan berikut benar:
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 5. Klik "Deploy"
Tunggu proses build selama kurang lebih 1-2 menit. Vercel akan memberikan domain publik (misal: `ptsp-man1hst.vercel.app`) yang bisa langsung diakses.

---

## 🛠 Troubleshooting Sinkronisasi
Jika Anda mengalami kendala sinkronisasi antara AI Studio dan GitHub:
1. Gunakan perintah Git manual di terminal lokal Anda.
2. Pastikan Anda melakukan `git pull` terlebih dahulu sebelum melakukan `push` untuk menghindari konflik versi.
3. Cek status koneksi pada file `SystemHealthAlert.tsx` jika database terasa lambat.

---

## 🛡️ Keamanan & Privasi Data
Portal ini menggunakan **Firestore Security Rules** untuk melindungi data sensitif GTK. Data hanya dapat diakses secara detail oleh pengguna yang telah terverifikasi melalui **Authentication Gate** di menu samping.

&copy; 2026 **IMAM Core Node** | Madrasah Cloud Service MAN 1 Hulu Sungai Tengah.  
*Bakambang, Babuah, Batuah.*