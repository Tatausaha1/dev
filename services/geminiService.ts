
import { GoogleGenAI, Modality } from "@google/genai";

/**
 * Memeriksa koneksi ke Gemini API.
 */
export const testGeminiConnection = async (): Promise<{ success: boolean; latency?: number; error?: string }> => {
  const start = Date.now();
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'ping',
    });
    return { success: true, latency: Date.now() - start };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
};

/**
 * Menghasilkan respons teks untuk asisten chat IMAM.
 */
export const getCreativeChat = async (message: string): Promise<{ text: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message,
    config: {
      systemInstruction: 'Anda adalah IMAM, asisten AI untuk MAN 1 Hulu Sungai Tengah. Bersikaplah profesional, ramah, dan membantu. Berikan jawaban yang ringkas dalam bahasa Indonesia.',
    },
  });
  return { text: response.text || "" };
};

/**
 * Menghasilkan audio dari teks (TTS).
 */
export const generateAudioResponse = async (text: string): Promise<string | undefined> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

/**
 * Menghubungkan ke Live API untuk interaksi resepsionis real-time.
 */
export const connectLiveReceptionist = (callbacks: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      systemInstruction: `Anda adalah IMAM, resepsionis AI pintar MAN 1 Hulu Sungai Tengah.
      
      PENGETAHUAN UTAMA ANDA:
      1. LAYANAN PTSP: Legalisir Ijazah (butuh fotokopi legalisir asli), Mutasi Siswa (antar madrasah/sekolah), Surat Keterangan Aktif (untuk beasiswa).
      2. JADWAL: Operasional Senin-Jumat jam 07:00 - 16:00 WITA.
      3. LOMBA DESAIN 2026: Tema "Bakambang, Babuah, Batuah". Hadiah total 400rb + Sertifikat Kepsek. Deadline 1 Feb 2026.
      4. KONTAK: WhatsApp CS di 0853-9170-6131.
      
      GAYA BICARA: Ramah, singkat (maks 2-3 kalimat), gunakan bahasa Indonesia formal yang sopan.`,
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
      }
    }
  });
};
