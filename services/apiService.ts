
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection, 
  getDocs, 
  getDoc,
  query, 
  where, 
  limit, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp as firestoreTimestamp,
  setDoc,
  addDoc,
  writeBatch
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
  getDatabase, 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { firebaseConfig } from '../constants.ts';
import { PTSPData, APIResponse } from '../types';

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export const rtdb = getDatabase(app, "https://suratseketika-default-rtdb.firebaseio.com/");

const syncChannel = new BroadcastChannel('imam_db_sync');

export const deepSanitize = (data: any): any => {
  if (data === null || typeof data !== 'object') return data;
  if (typeof data.seconds === 'number' && typeof data.nanoseconds === 'number') {
    return new Date(data.seconds * 1000).toISOString();
  }
  const constructorName = data.constructor?.name || '';
  if (data.firestore || constructorName.includes('Reference') || constructorName.startsWith('Q')) {
    return data.path ? `Ref(${data.path})` : '[Internal SDK Object]';
  }
  if (Array.isArray(data)) return data.map(deepSanitize);
  const result: any = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (key.startsWith('_')) continue;
      const val = data[key];
      if (typeof val === 'string' && val.length > 1000) result[key] = val;
      else result[key] = deepSanitize(val);
    }
  }
  return result;
};

export const apiService = {
  subscribe: (callback: () => void) => {
    syncChannel.onmessage = (event) => {
      if (event.data.type === 'REFRESH_DATA') callback();
    };
    return () => { syncChannel.onmessage = null; };
  },

  notifyUpdate: () => {
    syncChannel.postMessage({ type: 'REFRESH_DATA' });
  },

  checkDatabaseHealth: async (): Promise<{ healthy: boolean; latency?: number; error?: string }> => {
    const start = Date.now();
    try {
      const healthQuery = doc(db, "public_dashboard", "summary");
      await getDoc(healthQuery);
      return { healthy: true, latency: Date.now() - start };
    } catch (e: any) {
      return { healthy: false, error: e.message };
    }
  },

  getPublicSummary: async () => {
    try {
      const docRef = doc(db, "public_dashboard", "summary");
      const snap = await getDoc(docRef);
      if (snap.exists()) return { success: true, data: deepSanitize(snap.data()) };
      return { success: true, data: { reports: 158, participants: 36, activeNodes: 4 } };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  submitLayanan: async (payload: any): Promise<APIResponse<string>> => {
    const trackingId = `REQ-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
    try {
      // Create request in service_requests (Align with Mapping Spec)
      const requestData = {
        requestId: trackingId,
        serviceId: payload.id || 'generic',
        serviceName: payload.name || 'Layanan Umum',
        categoryId: payload.categoryId || 'umum',
        categoryName: payload.categoryName || 'Administrasi Umum',
        applicantName: payload.applicantName || 'Anonymous',
        status: 'submitted',
        timestamp: firestoreTimestamp()
      };

      await setDoc(doc(db, "service_requests", trackingId), requestData);

      // Create initial log for ZI Transparency
      await addDoc(collection(db, "service_logs"), {
        requestId: trackingId,
        status: 'submitted',
        message: 'Permohonan berhasil diterima oleh sistem cloud.',
        actor: 'system',
        timestamp: firestoreTimestamp()
      });

      apiService.notifyUpdate();
      return { success: true, data: trackingId };
    } catch (e: any) { return { success: false, error: e.message }; }
  },

  trackLayanan: async (trackingId: string): Promise<APIResponse<any>> => {
    try {
      const docRef = doc(db, "service_requests", trackingId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const logsQ = query(collection(db, "service_logs"), where("requestId", "==", trackingId), orderBy("timestamp", "desc"));
        const logsSnap = await getDocs(logsQ);
        const logs = logsSnap.docs.map(d => deepSanitize(d.data()));
        return { success: true, data: { ...deepSanitize(snap.data()), logs } };
      }
      return { success: false, error: "ID tidak ditemukan." };
    } catch (e: any) { return { success: false, error: e.message }; }
  },

  validateUser: async (username: string, password: string): Promise<APIResponse<any>> => {
    try {
      const q = query(collection(db, "users"), where("username", "==", username.trim()), limit(1));
      const snap = await getDocs(q);
      let userDoc = snap.empty ? null : snap.docs[0];
      if (!userDoc) {
        const qNip = query(collection(db, "users"), where("nip", "==", username.trim()), limit(1));
        const snapNip = await getDocs(qNip);
        if (!snapNip.empty) userDoc = snapNip.docs[0];
      }
      if (!userDoc) return { success: false, error: "Akun tidak terdaftar." };
      const userData = { id: userDoc.id, ...deepSanitize(userDoc.data()) } as any;
      if (userData.password === password) return { success: true, data: userData };
      return { success: false, error: "Kredensial salah." };
    } catch (e: any) {
      return { success: false, error: "Database terproteksi. Login memerlukan otorisasi." };
    }
  },

  getRecentLayanan: async (limitCount: number = 15) => {
    try {
      const q = query(collection(db, "service_requests"), orderBy("timestamp", "desc"), limit(limitCount));
      const snap = await getDocs(q);
      return { success: true, data: snap.docs.map(d => deepSanitize(d.data())) };
    } catch (e) { return { success: false, data: [] }; }
  },

  submitGTKReport: async (payload: any): Promise<APIResponse<string>> => {
    try {
      const docRef = doc(collection(db, "laporanGTK"));
      await setDoc(docRef, { ...payload, status: 'sent', timestamp: firestoreTimestamp() });
      apiService.notifyUpdate();
      return { success: true, data: docRef.id };
    } catch (e: any) { return { success: false, error: e.message }; }
  },

  addUser: async (payload: any): Promise<APIResponse<string>> => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        ...payload,
        timestamp: firestoreTimestamp()
      });
      apiService.notifyUpdate();
      return { success: true, data: docRef.id };
    } catch (e: any) { return { success: false, error: e.message }; }
  },

  // Fix: Added missing deleteDocument method for AdminDashboard to allow document deletion
  deleteDocument: async (collectionName: string, docId: string): Promise<APIResponse<null>> => {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      apiService.notifyUpdate();
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  },

  // Fix: Added missing updateGTKReport method for GTKReportForm to allow updating existing reports
  updateGTKReport: async (id: string, payload: any): Promise<APIResponse<null>> => {
    try {
      const docRef = doc(db, "laporanGTK", id);
      await updateDoc(docRef, payload);
      apiService.notifyUpdate();
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  },

  // Fix: Added missing getDutyStaffByDay method for ScheduleDutySection to fetch daily duty schedule
  getDutyStaffByDay: async (day: string) => {
    try {
      const q = query(collection(db, "piket_schedule"), where("hari", "==", day));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...deepSanitize(d.data()) }));
    } catch (e) { return []; }
  },

  // Fix: Added missing getMadrasahData method for MadrasahScheduleSection to fetch categorized madrasah data by day
  getMadrasahData: async (collectionName: string, day: string) => {
    try {
      const q = query(collection(db, collectionName), where("hari", "==", day));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...deepSanitize(d.data()) }));
    } catch (e) { return []; }
  },

  // Fix: Added missing initializeDatabase method for SystemHealthAlert to setup initial schema and admin user
  initializeDatabase: async (): Promise<APIResponse<null>> => {
    try {
      const batch = writeBatch(db);
      
      // Summary init
      const summaryRef = doc(db, "public_dashboard", "summary");
      batch.set(summaryRef, { reports: 158, participants: 36, activeNodes: 4 }, { merge: true });

      // Admin user init (PIN: 2024 is adminmq24)
      const adminRef = doc(db, "users", "admin");
      batch.set(adminRef, {
        username: "admin",
        password: "adminmq24",
        nama: "Administrator",
        role: "ADMIN",
        nip: "2024"
      }, { merge: true });

      await batch.commit();
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  }
};
