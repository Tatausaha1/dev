
import { useState, useEffect } from 'react';

/**
 * Hook sederhana untuk mengecek status aktifasi layanan
 * Dalam produksi, ini bisa dihubungkan ke Firestore config
 */
export const useLayanan = () => {
  const [data, setData] = useState([
    { nama: 'Kehadiran', aktif: true },
    { nama: 'Legalisir', aktif: true }
  ]);

  return { data, loading: false };
};
