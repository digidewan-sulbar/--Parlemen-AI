import { TahapRisalah, RisalahTrackingStep, RisalahTrackingAuditLog, RisalahItem } from '../types';

export const TAHAPAN_ORDER: TahapRisalah[] = [
  '1. Perekaman Audio / Input Kasar',
  '2. Transkripsi Suara-ke-Teks AI',
  '3. Olah & Standardisasi Kalimat Baku AI',
  '4. Verifikasi & Telaah Notulis',
  '5. Penyelarasan & Paraf Kabag',
  '6. Disahkan & Final',
];

export interface TahapMeta {
  tahap: TahapRisalah;
  labelSingkat: string;
  nomorUrut: number;
  deskripsi: string;
  defaultAktor: string;
  slaJam: string;
  warnaBadge: string;
}

export const TAHAPAN_RISALAH_METADATA: Record<TahapRisalah, TahapMeta> = {
  '1. Perekaman Audio / Input Kasar': {
    tahap: '1. Perekaman Audio / Input Kasar',
    labelSingkat: 'Perekaman Audio',
    nomorUrut: 1,
    deskripsi: 'Pengambilan rekaman audio rapat dewan / unggah file suara persidangan.',
    defaultAktor: 'Petugas Audio & Risalah Setwan',
    slaJam: 'Segera pasca rapat (1 jam)',
    warnaBadge: 'bg-slate-700 text-slate-200 border-slate-600',
  },
  '2. Transkripsi Suara-ke-Teks AI': {
    tahap: '2. Transkripsi Suara-ke-Teks AI',
    labelSingkat: 'Transkripsi AI STT',
    nomorUrut: 2,
    deskripsi: 'Konversi ucapan suara ke teks multi-pembicara & deteksi timestamp otomatis.',
    defaultAktor: 'Engine Speech-to-Text & Diarization AI',
    slaJam: 'Otomatis AI (< 5 menit)',
    warnaBadge: 'bg-cyan-900/60 text-cyan-300 border-cyan-700/60',
  },
  '3. Olah & Standardisasi Kalimat Baku AI': {
    tahap: '3. Olah & Standardisasi Kalimat Baku AI',
    labelSingkat: 'Olah Kalimat Baku AI',
    nomorUrut: 3,
    deskripsi: 'Restrukturisasi kalimat rekaman menjadi kalimat baku resmi persidangan tanpa mengubah substansi.',
    defaultAktor: 'AI Natural Language Processing (NLP)',
    slaJam: 'Otomatis AI (< 3 menit)',
    warnaBadge: 'bg-purple-900/60 text-purple-300 border-purple-700/60',
  },
  '4. Verifikasi & Telaah Notulis': {
    tahap: '4. Verifikasi & Telaah Notulis',
    labelSingkat: 'Verifikasi Notulis',
    nomorUrut: 4,
    deskripsi: 'Pengecekan daftar kuorum hadir, resume poin substansi & keabsahan transkrip oleh notulis dewan.',
    defaultAktor: 'Pranata Risalah & Notulis DPRD',
    slaJam: 'Maks. 1x24 jam',
    warnaBadge: 'bg-amber-900/60 text-amber-300 border-amber-700/60',
  },
  '5. Penyelarasan & Paraf Kabag': {
    tahap: '5. Penyelarasan & Paraf Kabag',
    labelSingkat: 'Paraf Kabag Persidangan',
    nomorUrut: 5,
    deskripsi: 'Review kepatuhan tata tertib dewan, pencermatan rekomendasi, dan paraf koordinasi kabag.',
    defaultAktor: 'Kabag Persidangan & Perundang-undangan',
    slaJam: 'Maks. 1x24 jam',
    warnaBadge: 'bg-blue-900/60 text-blue-300 border-blue-700/60',
  },
  '6. Disahkan & Final': {
    tahap: '6. Disahkan & Final',
    labelSingkat: 'Disahkan & Final',
    nomorUrut: 6,
    deskripsi: 'Penomoran resmi, penetapan status risalah sah oleh pimpinan sidang / DPRD Sulbar.',
    defaultAktor: 'Pimpinan Rapat / Ketua DPRD Sulbar',
    slaJam: 'Finalisasi Dokumen',
    warnaBadge: 'bg-emerald-900/70 text-emerald-300 border-emerald-600',
  },
};

export function getTahapIndex(tahap: TahapRisalah): number {
  return TAHAPAN_ORDER.indexOf(tahap);
}

export function getTahapProgress(tahap?: TahapRisalah): number {
  if (!tahap) return 20;
  const idx = getTahapIndex(tahap);
  if (idx === -1) return 20;
  const percentages = [15, 35, 55, 75, 90, 100];
  return percentages[idx] || 20;
}

export function createDefaultTrackingSteps(
  currentTahap: TahapRisalah = '6. Disahkan & Final',
  namaNotulis: string = 'Arianto, AP, M.M.'
): RisalahTrackingStep[] {
  const currentIdx = getTahapIndex(currentTahap);

  return TAHAPAN_ORDER.map((tahap, idx) => {
    const meta = TAHAPAN_RISALAH_METADATA[tahap];
    let status: 'completed' | 'current' | 'pending' = 'pending';
    let waktu: string | undefined = undefined;
    let versi = `v1.${idx}`;

    if (idx < currentIdx) {
      status = 'completed';
      waktu = `Tahap ${idx + 1} Tuntas`;
    } else if (idx === currentIdx) {
      status = currentIdx === 5 ? 'completed' : 'current';
      waktu = currentIdx === 5 ? 'Resmi Disahkan' : 'Sedang Berlangsung';
      versi = currentIdx === 5 ? 'v3.0 (Final)' : `v2.${idx}`;
    }

    let aktor = meta.defaultAktor;
    if (idx === 3 && namaNotulis) {
      aktor = `${namaNotulis} (Notulis)`;
    }

    return {
      id: `step-${idx + 1}`,
      nomorUrut: idx + 1,
      namaTahap: tahap,
      labelSingkat: meta.labelSingkat,
      status,
      waktuPenyelesaian: waktu,
      aktorPenanggungJawab: aktor,
      catatanAktivitas: meta.deskripsi,
      versiDokumen: versi,
    };
  });
}

export function createAuditLogEntry(
  tahap: TahapRisalah,
  aktor: string,
  catatan: string,
  versiDokumen: string = 'v1.0'
): RisalahTrackingAuditLog {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Makassar',
  };
  const waktuStr = `${now.toLocaleDateString('id-ID', options)} WITA`;

  return {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    waktu: waktuStr,
    tahap,
    aktor,
    aksi: `Pembaruan Rekam Jejak Tahap: ${TAHAPAN_RISALAH_METADATA[tahap]?.labelSingkat || tahap}`,
    catatanPerubahan: catatan,
    versiDokumen,
  };
}

export function applyTrackingUpdate(
  risalah: RisalahItem,
  targetTahap: TahapRisalah,
  aktor: string,
  catatan: string,
  versiBaru: string
): RisalahItem {
  const newIdx = getTahapIndex(targetTahap);
  const newProgress = getTahapProgress(targetTahap);

  // Update steps
  const updatedSteps: RisalahTrackingStep[] = TAHAPAN_ORDER.map((tahap, idx) => {
    const meta = TAHAPAN_RISALAH_METADATA[tahap];
    let status: 'completed' | 'current' | 'pending' = 'pending';
    let waktu: string | undefined = undefined;

    if (idx < newIdx) {
      status = 'completed';
      waktu = 'Tuntas Diverifikasi';
    } else if (idx === newIdx) {
      status = newIdx === 5 ? 'completed' : 'current';
      waktu = newIdx === 5 ? 'Naskah Disahkan' : 'Sedang Diproses';
    }

    return {
      id: `step-${idx + 1}`,
      nomorUrut: idx + 1,
      namaTahap: tahap,
      labelSingkat: meta.labelSingkat,
      status,
      waktuPenyelesaian: waktu,
      aktorPenanggungJawab: idx === newIdx ? aktor : (meta.defaultAktor),
      catatanAktivitas: idx === newIdx ? catatan : meta.deskripsi,
      versiDokumen: idx === newIdx ? versiBaru : undefined,
    };
  });

  const newLog = createAuditLogEntry(targetTahap, aktor, catatan, versiBaru);
  const existingLogs = risalah.auditLogs || [];

  return {
    ...risalah,
    statusTahap: targetTahap,
    progressPersen: newProgress,
    tahapTracking: updatedSteps,
    auditLogs: [newLog, ...existingLogs],
  };
}
