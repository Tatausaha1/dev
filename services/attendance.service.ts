
import { collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db, apiService } from './apiService.ts';

/**
 * Service untuk manajemen data Kehadiran GTK dengan dukungan Hybrid (File & Link)
 * Implementasi Base64 untuk file kecil dan URL untuk file besar.
 */
export const uploadKehadiran = async (
  files: File[], 
  form: { nama: string; nip: string; periode: string },
  links: any[] = []
): Promise<string> => {
  
  // Proses konversi file ke Base64 dengan pengecekan ukuran
  const filePromises = files.map(file => {
    return new Promise<{name: string, type: string, data: string, category: string, isLink: boolean}>((resolve, reject) => {
      // Limit Firestore per dokumen adalah 1MB. Base64 menambah ukuran ~33%.
      // Kita batasi file fisik maksimal 700KB untuk keamanan.
      if (file.size > 700 * 1024) {
        reject(new Error(`File "${file.name}" terlalu besar (>700KB). Gunakan "Link Mode" (Google Drive) untuk file ini.`));
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let category = 'Dokumen Pendukung';
        const name = file.name.toLowerCase();
        
        // Auto-categorization berdasarkan keyword nama file
        if (name.match(/\.(xlsx|xls)$/) || file.type.includes('excel') || file.type.includes('spreadsheet')) {
          category = 'Presensi Emis 4.0';
        } else if (name.includes('presensi') || name.includes('kehadiran')) {
          category = 'Bukti Presensi Bulanan';
        } else if (name.includes('makan') || name.includes('konsumsi')) {
          category = 'Daftar Uang Makan';
        } else if (name.includes('tukin') || name.includes('kinerja')) {
          category = 'Capaian Kinerja (Tukin)';
        }
        
        resolve({
          name: file.name,
          type: file.type,
          data: reader.result as string,
          category: category,
          isLink: false
        });
      };
      reader.onerror = error => reject(error);
    });
  });

  try {
    const processedFiles = await Promise.all(filePromises);
    const finalPayload = [...processedFiles, ...links];

    const docRef = await addDoc(collection(db, "laporanGTK"), {
      nama: form.nama,
      nip: form.nip,
      judulLaporan: form.periode,
      category: 'Kehadiran',
      timestamp: serverTimestamp(),
      status: 'sent',
      files: finalPayload,
      fileCount: finalPayload.length,
      isiLaporan: `Unggahan hybrid kehadiran periode ${form.periode} (${finalPayload.length} entri disinkronkan)`
    });

    apiService.notifyUpdate();
    return docRef.id;
  } catch (err) {
    throw err;
  }
};

export const subscribeToAttendance = (callback: (data: any[]) => void) => {
  const q = query(
    collection(db, "laporanGTK"),
    orderBy("timestamp", "desc"),
    limit(15)
  );

  return onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        nama: data.nama,
        nip: data.nip,
        periode: data.judulLaporan,
        fileCount: data.fileCount || data.files?.length || 0,
        files: data.files || [],
        status: data.status === 'approved' ? 'verified' : (data.status === 'rejected' ? 'rejected' : 'pending'),
        timestamp: data.timestamp?.toMillis() || Date.now()
      };
    });
    callback(reports);
  }, (error) => {
    console.warn("Attendance Service: Gagal berlangganan ke laporan GTK.", error.message);
  });
};
