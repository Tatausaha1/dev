
// Fix: Added missing UserRole type used for role-based access control across the app.
export type UserRole = 'ADMIN' | 'KEPSEK' | 'GURU' | 'STAFF' | 'SISWA' | 'GUEST';

// Fix: Added VoiceName type for TTS voice selection.
export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';

export interface PTSPData {
  namaLengkap: string;
  nomorIdentitas: string;
  kategori: string;
  subjek: string;
  pesan: string;
  whatsapp: string;
}

export type PTSPStatus = 'Pending' | 'Proses' | 'Selesai';

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface WorkSchedule {
  hari: string;
  jam: string;
  keterangan: string;
}

// Interface baru untuk Laporan Guru dan Tenaga Kependidikan (GTK)
export interface LaporanGTK {
  id?: string;
  nama: string;
  nip: string;
  jabatan: string;
  judulLaporan: string;
  isiLaporan: string;
  timestamp: any;
  status: 'pending' | 'approved' | 'rejected' | 'sent';
  files?: any[];
}

// Interface khusus untuk komponen LayananKehadiran
export interface AttendanceRecord {
  nama: string;
  nip: string;
  periode: string;
  status: 'pending' | 'verified' | 'rejected';
  timestamp: number;
  fileName: string;
  fileData: string;
}

export interface SubmissionData {
  id?: string;
  nama: string;
  kelas: string;
  email: string;
  whatsapp: string;
  idCardLink: string;
  lanyardLink: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'approved';
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
