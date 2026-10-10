import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import {
  testDbConnection,
  initDatabase,
  seedDatabaseIfEmpty,
  getDatabaseStats,
  dbGetAllRisalah,
  dbInsertRisalah,
  dbDeleteRisalah,
  dbGetAllRanperda,
  dbInsertRanperda,
  dbDeleteRanperda,
  dbGetAllRdp,
  dbInsertRdp,
  dbDeleteRdp,
  dbGetAllAgenda,
  dbInsertAgenda,
  dbDeleteAgenda,
  dbGetAllAnggota,
  dbInsertAnggota,
  dbDeleteAnggota,
  dbGetAllNotifications,
  dbInsertNotification,
  dbMarkNotificationRead,
  dbMarkAllNotificationsRead,
} from "./db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Helper to get GoogleGenAI client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "dummy-key-for-dev",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "E-Parlemen Sulbar",
    version: "1.0.0",
    spbeIntegrated: true,
  });
});

// Modul 1-4 Core AI Processing Endpoint
app.post("/api/ai/process-all", async (req, res) => {
  try {
    const {
      jenisRapat, // "Rapat Paripurna" | "Rapat Bamus" | "Rapat Banggar" | "Rapat BK" | "Rapat Bapemperda" | "Rapat Pimpinan" | "Rapat Pimpinan di Perluas" | "Rapat Sekretariat DPRD" | "Rapat Komisi I" | "Rapat Komisi II" | "Rapat Komisi III" | "Rapat Komisi IV" | "Rapat Dengar Pendapat (RDP)"
      judulRapat,
      hariTanggalWaktu,
      pimpinanRapat,
      anggotaHadir,
      transcriptText,
      audioBase64,
      audioMimeType,
    } = req.body;

    if (!transcriptText && !audioBase64) {
      return res.status(400).json({
        error: "Mohon sediakan teks draf transkrip atau unggah file audio rapat.",
      });
    }

    const ai = getGenAI();

    const systemInstruction = `
Anda adalah Core AI Engine dan Asisten Digital Terintegrasi untuk sistem "E-Parlemen Sekretariat DPRD Provinsi Sulawesi Barat" sesuai SPBE Perpres No. 95/2018.

Tugas Anda adalah memproses draf transkrip/audio rapat dan merumuskan output terstruktur lengkap untuk 3 Pilar Layanan Sekretariat DPRD Sulbar:

1. E-RISALAH BERBANTU AI (Persidangan):
   - Hari/Tanggal/Waktu & Jenis Rapat (${jenisRapat || 'Rapat Paripurna'}).
   - Pimpinan Rapat (${pimpinanRapat || 'Pimpinan DPRD'}).
   - Anggota DPRD yang Hadir (${anggotaHadir || '41 Anggota DPRD'}).
   - Timestamp & Transkrip Teks Berdasarkan Pembicara dengan Analisis Sentimen untuk setiap segmen (pilihan: "Positif", "Negatif", "Netral", "Perdebatan / Kritis") serta kualifikasi nada emosi.
   - PENTING (PERBAIKAN KALIMAT LISAN MENGJADI KALIMAT BAKU): Pada field 'pernyataan' di 'transkripPembicara', rapikan kalimat-kalimat lisan/rekaman yang tidak terstruktur atau kurang baku menjadi Bahasa Indonesia resmi birokrasi, TANPA mengubah substansi, poin, atau arti yang disampaikan pembicara. Hilangkan kata sela lisan (seperti 'ee', 'anu', 'maksudnya').
   - Ringkasan Sentimen Rapat (sentimenSummary: jumlah positif, negatif, netral, perdebatan, ringkasan nada umum, dan daftar isu perdebatan utama).
   - Resume Poin-Poin Utama & Kesimpulan/Keputusan Rapat.

2. E-TRACKING REKOMENDASI RDP (Pengawasan):
   - Ekstrak seluruh poin catatan/rekomendasi rapat kepada OPD Pemprov Sulbar.
   - Kelompokkan berdasarkan OPD Penanggung Jawab (misal: Dinas PU PR, Dinas Pendidikan & Kebudayaan, Dinas Kesehatan, Bappeda, Dinas Pertanian, dsb).
   - Status default: "Belum Diproses".
   - Buatkan ringkasan 1 kalimat perintah tindak lanjut presisi untuk OPD.

3. EXECUTIVE DASHBOARD PIMPINAN (Fasilitasi Pimpinan):
   - Executive Summary maksimal 3 paragraf.
   - Berorientasi Bahan Pengambilan Keputusan Pimpinan DPRD dengan struktur:
     * Highlight Keputusan
     * Isu Krusial
     * Rekomendasi Langkah Pimpinan

4. AUTO-DRAFT HUMAS & PROTOKOL (Kehumasan):
   - Draf Rilis Berita Resmi Kehumasan (Press Release) 300-400 kata, gaya jurnalistik formal (5W+1H), judul atraktif birokratis.
   - Digital Protocol Briefing Sheet: Ringkasan agenda, Rundown (susunan acara), Tata Tempat (seating arrangement), Penanggung Jawab (PIC), dan Poin-poin penting yang harus disampaikan Pimpinan DPRD saat memimpin/menutup rapat.

Gunakan Bahasa Indonesia formal birokratis, presisi, dan sesuai standar tata kelola pemerintahan daerah Provinsi Sulawesi Barat. Output WAJIB berupa JSON valid sesuai schema yang dipinta.
`;

    const contentsParts: any[] = [];

    if (audioBase64) {
      contentsParts.push({
        inlineData: {
          mimeType: audioMimeType || "audio/mp3",
          data: audioBase64,
        },
      });
      contentsParts.push({
        text: `Transkripkan audio rapat di atas dan proses seluruh modul E-Parlemen Sulbar untuk judul rapat: "${
          judulRapat || "Rapat DPRD Provinsi Sulawesi Barat"
        }", Jenis: "${jenisRapat || "Rapat Paripurna"}", Tanggal/Waktu: "${
          hariTanggalWaktu || "Hari Ini"
        }", Pimpinan: "${pimpinanRapat || "Ketua DPRD Sulbar"}", Hadir: "${
          anggotaHadir || "Anggota DPRD Sulbar"
        }".`,
      });
    } else {
      contentsParts.push({
        text: `Berikut adalah draf transkrip rapat:
---
${transcriptText}
---
Judul Rapat: ${judulRapat || "Rapat Paripurna DPRD Sulbar"}
Jenis Rapat: ${jenisRapat || "Rapat Paripurna"}
Hari/Tanggal/Waktu: ${hariTanggalWaktu || "Sesuai Jadwal"}
Pimpinan Rapat: ${pimpinanRapat || "Ketua DPRD Provinsi Sulawesi Barat"}
Anggota Hadir: ${anggotaHadir || "Anggota DPRD Provinsi Sulawesi Barat"}

Silakan olah menjadi output lengkap E-Parlemen Sulbar.`,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts: contentsParts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risalah: {
              type: Type.OBJECT,
              properties: {
                jenisRapat: { type: Type.STRING },
                judulRapat: { type: Type.STRING },
                hariTanggalWaktu: { type: Type.STRING },
                pimpinanRapat: { type: Type.STRING },
                anggotaHadir: { type: Type.STRING },
                transkripPembicara: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      timestamp: { type: Type.STRING },
                      pembicara: { type: Type.STRING },
                      pernyataan: { type: Type.STRING },
                      sentimen: { type: Type.STRING },
                      nadaEmosi: { type: Type.STRING },
                    },
                    required: ["timestamp", "pembicara", "pernyataan"],
                  },
                },
                sentimenSummary: {
                  type: Type.OBJECT,
                  properties: {
                    positifCount: { type: Type.INTEGER },
                    negatifCount: { type: Type.INTEGER },
                    netralCount: { type: Type.INTEGER },
                    perdebatanCount: { type: Type.INTEGER },
                    ringkasanNada: { type: Type.STRING },
                    isuPerdebatanUtama: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                },
                resumePoinUtama: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                kesimpulanKeputusan: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                "jenisRapat",
                "judulRapat",
                "hariTanggalWaktu",
                "pimpinanRapat",
                "anggotaHadir",
                "transkripPembicara",
                "resumePoinUtama",
                "kesimpulanKeputusan",
              ],
            },
            rekomendasiRdp: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  opdPenanggungJawab: { type: Type.STRING },
                  poinCatatan: { type: Type.STRING },
                  perintahTindakLanjut: { type: Type.STRING },
                  statusDefault: { type: Type.STRING },
                  tenggatWaktuDays: { type: Type.INTEGER },
                },
                required: [
                  "id",
                  "opdPenanggungJawab",
                  "poinCatatan",
                  "perintahTindakLanjut",
                  "statusDefault",
                ],
              },
            },
            executiveSummary: {
              type: Type.OBJECT,
              properties: {
                paragraf1HighlightKeputusan: { type: Type.STRING },
                paragraf2IsuKrusial: { type: Type.STRING },
                paragraf3RekomendasiLangkahPimpinan: { type: Type.STRING },
              },
              required: [
                "paragraf1HighlightKeputusan",
                "paragraf2IsuKrusial",
                "paragraf3RekomendasiLangkahPimpinan",
              ],
            },
            humasProtocol: {
              type: Type.OBJECT,
              properties: {
                pressReleaseTitle: { type: Type.STRING },
                pressReleaseContent: { type: Type.STRING },
                pressReleaseWordCount: { type: Type.INTEGER },
                protocolBriefing: {
                  type: Type.OBJECT,
                  properties: {
                    ringkasanAgenda: { type: Type.STRING },
                    rundown: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          waktu: { type: Type.STRING },
                          kegiatan: { type: Type.STRING },
                          pengampu: { type: Type.STRING },
                        },
                        required: ["waktu", "kegiatan", "pengampu"],
                      },
                    },
                    seatingArrangement: { type: Type.STRING },
                    penanggungJawab: { type: Type.STRING },
                    poinPentingPimpinan: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: [
                    "ringkasanAgenda",
                    "rundown",
                    "seatingArrangement",
                    "penanggungJawab",
                    "poinPentingPimpinan",
                  ],
                },
              },
              required: [
                "pressReleaseTitle",
                "pressReleaseContent",
                "protocolBriefing",
              ],
            },
          },
          required: [
            "risalah",
            "rekomendasiRdp",
            "executiveSummary",
            "humasProtocol",
          ],
        },
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error: any) {
    console.error("Error processing AI request:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Gagal memproses AI Engine E-Parlemen",
    });
  }
});

// Single module targeted API endpoint
app.post("/api/ai/generate-module", async (req, res) => {
  try {
    const { moduleType, prompt, context } = req.body;
    const ai = getGenAI();

    let systemInstruction = "Anda adalah AI Engine E-Parlemen DPRD Sulbar.";
    if (moduleType === "risalah") {
      systemInstruction += " Spesialis penyusunan Risalah Rapat Resmi DPRD Sulbar.";
    } else if (moduleType === "rekomendasi") {
      systemInstruction += " Spesialis ekstraksi rekomendasi RDP & Perintah Tindak Lanjut OPD Pemprov Sulbar.";
    } else if (moduleType === "executive") {
      systemInstruction += " Spesialis Executive Summary Pimpinan DPRD Sulbar (3 paragraf: Highlight Keputusan, Isu Krusial, Rekomendasi Langkah Pimpinan).";
    } else if (moduleType === "humas") {
      systemInstruction += " Spesialis Humas & Protokol DPRD Sulbar (Press Release 300-400 kata & Digital Protocol Briefing Sheet).";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Konteks/Input:
${JSON.stringify(context || {})}
Instruksi Tambahan:
${prompt}`,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      success: true,
      result: response.text,
    });
  } catch (error: any) {
    console.error("Error in generate-module:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Gagal memproses modul AI",
    });
  }
});

// =========================================================================
// SUPABASE DATABASE ENDPOINTS
// =========================================================================

// Status & Health Endpoint
app.get("/api/supabase/status", async (req, res) => {
  try {
    const conn = await testDbConnection();
    if (!conn.connected) {
      return res.status(503).json({
        success: false,
        connected: false,
        error: conn.error,
        projectUrl: conn.projectUrl,
      });
    }
    const stats = await getDatabaseStats();
    return res.json({
      success: true,
      connected: true,
      connectionInfo: conn,
      stats,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      connected: false,
      error: error.message,
    });
  }
});

// Seed & Reset Endpoint
app.post("/api/supabase/seed-reset", async (req, res) => {
  try {
    await initDatabase();
    await seedDatabaseIfEmpty();
    const stats = await getDatabaseStats();
    return res.json({
      success: true,
      message: "Database Supabase berhasil disinkronisasi & di-seed!",
      stats,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Risalah CRUD
app.get("/api/risalah", async (req, res) => {
  try {
    const data = await dbGetAllRisalah();
    return res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error GET /api/risalah:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/risalah", async (req, res) => {
  try {
    const saved = await dbInsertRisalah(req.body);
    return res.json({ success: true, data: saved });
  } catch (error: any) {
    console.error("Error POST /api/risalah:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/api/risalah/:id", async (req, res) => {
  try {
    const item = { ...req.body, id: req.params.id };
    const updated = await dbInsertRisalah(item);
    return res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error PUT /api/risalah:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/risalah/:id", async (req, res) => {
  try {
    const ok = await dbDeleteRisalah(req.params.id);
    return res.json({ success: ok });
  } catch (error: any) {
    console.error("Error DELETE /api/risalah:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Ranperda CRUD
app.get("/api/ranperda", async (req, res) => {
  try {
    const data = await dbGetAllRanperda();
    return res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error GET /api/ranperda:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/ranperda", async (req, res) => {
  try {
    const saved = await dbInsertRanperda(req.body);
    return res.json({ success: true, data: saved });
  } catch (error: any) {
    console.error("Error POST /api/ranperda:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/api/ranperda/:id", async (req, res) => {
  try {
    const item = { ...req.body, id: req.params.id };
    const updated = await dbInsertRanperda(item);
    return res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error PUT /api/ranperda:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/ranperda/:id", async (req, res) => {
  try {
    const ok = await dbDeleteRanperda(req.params.id);
    return res.json({ success: ok });
  } catch (error: any) {
    console.error("Error DELETE /api/ranperda:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// RDP Recommendations CRUD
app.get("/api/rdp", async (req, res) => {
  try {
    const data = await dbGetAllRdp();
    return res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error GET /api/rdp:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/rdp", async (req, res) => {
  try {
    const saved = await dbInsertRdp(req.body);
    return res.json({ success: true, data: saved });
  } catch (error: any) {
    console.error("Error POST /api/rdp:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/api/rdp/:id", async (req, res) => {
  try {
    const item = { ...req.body, id: req.params.id };
    const updated = await dbInsertRdp(item);
    return res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error PUT /api/rdp:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/rdp/:id", async (req, res) => {
  try {
    const ok = await dbDeleteRdp(req.params.id);
    return res.json({ success: ok });
  } catch (error: any) {
    console.error("Error DELETE /api/rdp:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Agenda Pimpinan CRUD
app.get("/api/agenda", async (req, res) => {
  try {
    const data = await dbGetAllAgenda();
    return res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error GET /api/agenda:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/agenda", async (req, res) => {
  try {
    const saved = await dbInsertAgenda(req.body);
    return res.json({ success: true, data: saved });
  } catch (error: any) {
    console.error("Error POST /api/agenda:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/api/agenda/:id", async (req, res) => {
  try {
    const item = { ...req.body, id: req.params.id };
    const updated = await dbInsertAgenda(item);
    return res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error PUT /api/agenda:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/agenda/:id", async (req, res) => {
  try {
    const ok = await dbDeleteAgenda(req.params.id);
    return res.json({ success: ok });
  } catch (error: any) {
    console.error("Error DELETE /api/agenda:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Anggota DPRD CRUD
app.get("/api/anggota-dprd", async (req, res) => {
  try {
    const data = await dbGetAllAnggota();
    return res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error GET /api/anggota-dprd:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/anggota-dprd", async (req, res) => {
  try {
    const saved = await dbInsertAnggota(req.body);
    return res.json({ success: true, data: saved });
  } catch (error: any) {
    console.error("Error POST /api/anggota-dprd:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/api/anggota-dprd/:id", async (req, res) => {
  try {
    const item = { ...req.body, id: req.params.id };
    const updated = await dbInsertAnggota(item);
    return res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error PUT /api/anggota-dprd:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/anggota-dprd/:id", async (req, res) => {
  try {
    const ok = await dbDeleteAnggota(req.params.id);
    return res.json({ success: ok });
  } catch (error: any) {
    console.error("Error DELETE /api/anggota-dprd:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Notifications
app.get("/api/notifications", async (req, res) => {
  try {
    const data = await dbGetAllNotifications();
    return res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error GET /api/notifications:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/notifications", async (req, res) => {
  try {
    const saved = await dbInsertNotification(req.body);
    return res.json({ success: true, data: saved });
  } catch (error: any) {
    console.error("Error POST /api/notifications:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/api/notifications/:id/read", async (req, res) => {
  try {
    await dbMarkNotificationRead(req.params.id);
    return res.json({ success: true });
  } catch (error: any) {
    console.error("Error PUT /api/notifications/:id/read:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/api/notifications/read-all", async (req, res) => {
  try {
    await dbMarkAllNotificationsRead();
    return res.json({ success: true });
  } catch (error: any) {
    console.error("Error PUT /api/notifications/read-all:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Git Deployment & Status API Endpoints
app.get("/api/git/status", async (req, res) => {
  try {
    const { execSync } = await import("child_process");
    let branch = "main";
    let lastCommit = "";
    let remoteUrl = "https://github.com/digidewan-sulbar/--Parlemen-AI.git";
    try {
      branch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();
    } catch {}
    try {
      lastCommit = execSync("git log -1 --pretty=format:'%h - %s (%cr)'", { encoding: "utf8" }).trim();
    } catch {}
    try {
      remoteUrl = execSync("git remote get-url origin", { encoding: "utf8" }).trim();
    } catch {}

    return res.json({
      success: true,
      repository: remoteUrl,
      branch,
      lastCommit,
      remoteConnected: true,
      repoUrl: "https://github.com/digidewan-sulbar/--Parlemen-AI",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/git/deploy", async (req, res) => {
  try {
    const { execSync } = await import("child_process");
    const { token, commitMessage } = req.body;
    const msg = commitMessage || `Auto deploy update ${new Date().toISOString()}`;

    // Stage changes and commit if any uncommitted
    try {
      execSync("git add .", { encoding: "utf8" });
      execSync(`git commit -m "${msg.replace(/"/g, '\\"')}"`, { encoding: "utf8" });
    } catch (e) {
      // Nothing to commit, continue
    }

    if (token) {
      const cleanToken = token.trim();
      const authenticatedRemote = `https://${cleanToken}@github.com/digidewan-sulbar/--Parlemen-AI.git`;
      execSync(`git push "${authenticatedRemote}" main --force`, { encoding: "utf8" });
      return res.json({
        success: true,
        message: "Berhasil deploy & push kode terbaru ke repository GitHub!",
        repoUrl: "https://github.com/digidewan-sulbar/--Parlemen-AI",
      });
    } else {
      return res.json({
        success: false,
        needToken: true,
        message: "Perlu GitHub Personal Access Token (PAT) untuk otentikasi push ke repositori.",
      });
    }
  } catch (error: any) {
    console.error("Error POST /api/git/deploy:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

async function startServer() {
  // Mount Vite or static files first so HTTP server is ready immediately
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Start listening on port 3000 immediately so dev server health-check passes instantly
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[E-Parlemen Sulbar] Server running on http://0.0.0.0:${PORT}`);

    // Non-blocking asynchronous Supabase verification & seeding in the background
    (async () => {
      try {
        console.log("[Supabase DB] Verifying connection in background...");
        const conn = await testDbConnection();
        if (conn.connected) {
          console.log("[Supabase DB] Connected to Supabase PostgreSQL 17 successfully!");
          await initDatabase();
          await seedDatabaseIfEmpty();
          const stats = await getDatabaseStats();
          console.log("[Supabase DB] Live stats:", stats);
        } else {
          console.warn("[Supabase DB] Connection warning:", conn.error);
        }
      } catch (err: any) {
        console.warn("[Supabase DB] Background init warning:", err.message);
      }
    })();
  });
}

// Global safety error handlers
process.on("unhandledRejection", (reason) => {
  console.warn("[Server] Unhandled Rejection (handled safely):", reason);
});

startServer();
