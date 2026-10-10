export interface PesertaRapatItem {
  id: string;
  nama: string;
  jabatan: string;
  instansiOpd: string;
  isTerpilih?: boolean;
}

export type PillarType =
  | 'persidangan'
  | 'pimpinan'
  | 'humas'
  | 'spbe-blueprint'
  | 'ai-studio-engine';

export type RanperdaStage =
  | 1 // Naskah Akademik
  | 2 // Draf Ranperda
  | 3 // Pembahasan Propemperda
  | 4 // Rapat Paripurna / Pembahasan Komisi
  | 5 // Fasilitasi Kemendagri
  | 6 // Persetujuan Bersama
  | 7; // Pengundangan Perda

export interface RanperdaItem {
  id: string;
  nomorRanperda: string;
  judulRanperda: string;
  inisiator: 'DPRD (Komisi/Bapemperda)' | 'Gubernur / Pemprov Sulbar';
  komisiPengampu: 'Komisi I' | 'Komisi II' | 'Komisi III' | 'Komisi IV' | 'Bapemperda';
  tahapanKe: RanperdaStage;
  namaTahapan: string;
  tanggalMulai: string;
  targetSlaDays: number;
  sisaHariSla: number;
  statusSla: 'Sesuai SLA' | 'Mendekati Tenggat' | 'Melebihi SLA (Alert)';
  keteranganProgres: string;
}

export interface TranskripPembicara {
  timestamp: string;
  pembicara: string;
  pernyataan: string;
  sentimen?: 'Positif' | 'Negatif' | 'Netral' | 'Perdebatan / Kritis';
  nadaEmosi?: string;
}

export interface SentimenSummary {
  positifCount: number;
  negatifCount: number;
  netralCount: number;
  perdebatanCount: number;
  ringkasanNada: string;
  isuPerdebatanUtama: string[];
}

export type TahapRisalah =
  | '1. Perekaman Audio / Input Kasar'
  | '2. Transkripsi Suara-ke-Teks AI'
  | '3. Olah & Standardisasi Kalimat Baku AI'
  | '4. Verifikasi & Telaah Notulis'
  | '5. Penyelarasan & Paraf Kabag'
  | '6. Disahkan & Final';

export interface RisalahTrackingStep {
  id: string;
  nomorUrut: number;
  namaTahap: TahapRisalah;
  labelSingkat: string;
  status: 'completed' | 'current' | 'pending';
  waktuPenyelesaian?: string;
  aktorPenanggungJawab: string;
  catatanAktivitas: string;
  versiDokumen?: string;
}

export interface RisalahTrackingAuditLog {
  id: string;
  waktu: string;
  tahap: TahapRisalah;
  aktor: string;
  aksi: string;
  catatanPerubahan: string;
  versiDokumen: string;
}

export interface RisalahItem {
  id: string;
  nomorRisalah: string;
  judulRapat: string;
  jenisRapat: 'Rapat Paripurna' | 'Rapat Bamus' | 'Rapat Komisi' | 'Rapat Dengar Pendapat (RDP)';
  hariTanggalWaktu: string;
  pimpinanRapat: string;
  anggotaHadir: string;
  transkripPembicara: TranskripPembicara[];
  resumePoinUtama: string[];
  kesimpulanKeputusan: string[];
  sentimenSummary?: SentimenSummary;
  audioFileUrl?: string;
  createdDate: string;
  namaNotulis?: string;
  nipNotulis?: string;
  statusTahap?: TahapRisalah;
  progressPersen?: number;
  tahapTracking?: RisalahTrackingStep[];
  auditLogs?: RisalahTrackingAuditLog[];
  topikKategori?: string;
  kataKunciPintar?: string[];
}

export type StatusRekomendasi = 'Belum Diproses' | 'Dalam Proses' | 'Selesai' | 'Perlu Diverifikasi';

export interface RdpRecommendationItem {
  id: string;
  nomorRdp: string;
  judulRdp: string;
  komisi: 'Komisi I' | 'Komisi II' | 'Komisi III' | 'Komisi IV';
  opdPenanggungJawab: string;
  poinCatatan: string;
  perintahTindakLanjut: string;
  status: StatusRekomendasi;
  tenggatWaktu: string;
  buktiTindakLanjut?: {
    keterangan: string;
    fileUrl: string;
    tanggalUpload: string;
  };
}

export interface ExecutiveSummaryItem {
  id: string;
  judulDokumen: string;
  tanggalRapat: string;
  paragraf1HighlightKeputusan: string;
  paragraf2IsuKrusial: string;
  paragraf3RekomendasiLangkahPimpinan: string;
}

export interface AgendaPimpinanItem {
  id: string;
  tanggalWaktu: string;
  namaKegiatan: string;
  lokasi: string;
  pimpinanBertugas: string;
  instansiTerkait: string;
  disposisiCatatan: string;
  fileBahanPdfUrl?: string;
  status: 'Terjadwal' | 'Sedang Berlangsung' | 'Selesai';
}

export interface PressReleaseItem {
  id: string;
  judulBerita: string;
  tanggalRilis: string;
  kategori: string;
  jumlahKata: number;
  kontenBerita: string;
  status: 'Draf AI' | 'Diverifikasi Kabag' | 'Dipublikasikan';
}

export interface RundownItem {
  waktu: string;
  kegiatan: string;
  pengampu: string;
}

export interface ProtocolBriefingSheetItem {
  id: string;
  namaAcara: string;
  tanggalWaktu: string;
  pimpinanHadir: string;
  ringkasanAgenda: string;
  rundown: RundownItem[];
  seatingArrangement: string;
  penanggungJawab: string;
  poinPentingPimpinan: string[];
}

export interface EvidenceItem {
  id: string;
  kategori: string; // Leadership, IT Artifacts, SOP, Bimtek, Diseminasi
  namaBukti: string;
  formatBentuk: string;
  statusKelengkapan: 'Lengkap (Verified)' | 'Dalam Proses' | 'Pending';
  linkAkses: string;
}

export interface AiProcessState {
  isProcessing: boolean;
  progressMessage: string;
  resultData: {
    risalah?: RisalahItem;
    rekomendasiRdp?: RdpRecommendationItem[];
    executiveSummary?: ExecutiveSummaryItem;
    pressRelease?: PressReleaseItem;
    protocolBriefing?: ProtocolBriefingSheetItem;
  } | null;
  error: string | null;
}

// User Roles in E-Parlemen Sulbar
export type UserRole =
  | 'Pimpinan DPRD'
  | 'Sekretariat DPRD'
  | 'OPD Terkait (Dinas PUPR)'
  | 'OPD Terkait (Dinas Pendidikan)'
  | 'OPD Terkait (Diskominfo)'
  | 'OPD Terkait (Bappeda)';

export type NotificationType =
  | 'JADWAL_RAPAT'
  | 'TENGGAT_RDP'
  | 'PERUBAHAN_STATUS_RDP';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  targetRole: UserRole | 'SEMUA';
  isRead: boolean;
  targetPillar?: PillarType;
  targetDocId?: string;
  targetDocType?: 'risalah' | 'rdp' | 'agenda' | 'ranperda' | 'pressRelease';
  meta?: {
    nomorDokumen?: string;
    tenggatWaktu?: string;
    statusAwal?: string;
    statusBaru?: string;
    opdName?: string;
    linkBahanPdf?: string;
  };
}

export interface NotificationPreferences {
  role: UserRole;
  enableInApp: boolean;
  enableEmail: boolean;
  enableWhatsapp: boolean;
  notifyJadwalRapat: boolean;
  notifyTenggatRdp: boolean;
  notifyPerubahanStatusRdp: boolean;
  alertLeadDays: number; // e.g. 3, 5, 7 days threshold
  specificOpdFilter: string; // e.g. 'SEMUA' or OPD Name
}

export interface SearchFilters {
  keyword: string;
  docType: 'ALL' | 'risalah' | 'rdp' | 'ranperda' | 'agenda' | 'pressRelease';
  startDate: string;
  endDate: string;
  anggotaDprd: string;
  opdName: string;
}

export interface SearchResultItem {
  id: string;
  docType: 'risalah' | 'rdp' | 'ranperda' | 'agenda' | 'pressRelease';
  title: string;
  subtitle: string;
  date: string;
  snippet: string;
  opdName?: string;
  memberNames?: string[];
  targetPillar: PillarType;
  rawItem: any;
}

export interface AnggotaDprdItem {
  id: string;
  nama: string;
  jabatan: string; // e.g. "Ketua DPRD", "Wakil Ketua I", "Ketua Komisi I", "Wakil Ketua Komisi I", "Sekretaris Komisi I", "Anggota"
  kategori: 'Pimpinan DPRD' | 'Komisi I' | 'Komisi II' | 'Komisi III' | 'Komisi IV';
  fraksiPartai: string; // e.g. "Partai Golkar", "DEMOKRAT", "PDI", "PAN", "GERINDRA", "NASDEM", "F.GAB"
  noHp: string;
  kelengkapanLain: string; // e.g. "BANGGAR", "BAMUS", "BAPEMPERDA", "BK", "Pimpinan"
  fotoUrl?: string;
}

