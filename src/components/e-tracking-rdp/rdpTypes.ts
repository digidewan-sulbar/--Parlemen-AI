export type RdpStatus =
  | 'DRAFT'
  | 'TERBIT_DIKIRIM'
  | 'DALAM_PROSES'
  | 'BUTUH_VERIFIKASI'
  | 'TUNTAS'
  | 'OVERDUE'
  | 'DIKEMBALIKAN';

export interface EvidenceFile {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'jpg' | 'png' | 'doc';
  fileUrl: string;
  uploadedAt: string;
}

export interface StatusLog {
  id: string;
  statusAwal: RdpStatus;
  statusBaru: RdpStatus;
  timestamp: string;
  actor: string;
  keterangan: string;
}

export interface RdpRekomendasiExtended {
  id: string;
  nomorRdp: string;
  judulRdp: string;
  komisi: 'Komisi I' | 'Komisi II' | 'Komisi III' | 'Komisi IV';
  opdPenanggungJawab: string;
  opdPejabatNama: string;
  opdPejabatWa: string;
  picNama?: string;
  picWa?: string;
  poinCatatan: string;
  perintahTindakLanjut: string;
  status: RdpStatus;
  tanggalTerbit: string;
  slaDays: number; // default 14 Hari Kerja
  deadlineDate: string;
  magicLinkToken: string;
  kronologiEksekusi?: string;
  evidenceFiles?: EvidenceFile[];
  statusLogs?: StatusLog[];
  catatanKomisiRevisi?: string;
  lastWaSentTimestamp?: string;
}

export interface OpdComplianceMetrics {
  opdName: string;
  totalRdp: number;
  tuntasCount: number;
  dalamProsesCount: number;
  overdueCount: number;
  butuhVerifikasiCount: number;
  avgResponseDays: number;
  complianceScorePercent: number;
}

export interface WaTemplateConfig {
  id: string;
  triggerType: 'INSTANT_TERBIT' | 'REMINDER_H3' | 'REMINDER_H1' | 'ESCALATION_OVERDUE' | 'REVISI_DIKEMBALIKAN' | 'TUNTAS_VERIFIED';
  title: string;
  targetRole: string;
  templateText: string;
}

export interface WaLogItem {
  id: string;
  recipientName: string;
  recipientPhone: string;
  nomorRdp: string;
  triggerType: string;
  messageText: string;
  sentAt: string;
  status: 'DELIVERED' | 'READ' | 'FAILED' | 'PENDING';
}
