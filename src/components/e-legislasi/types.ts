export type RoleCode =
  | 'ROLE_SETWAN'
  | 'ROLE_OPD'
  | 'ROLE_DPRD'
  | 'ROLE_KEMENKUMHAM'
  | 'ROLE_BIRO_HUKUM'
  | 'ROLE_KEMENDAGRI';

export type RanperdaStatusCode =
  | 'DRAFT_PROPOSED'
  | 'HARMONIZATION_KEMENKUMHAM'
  | 'HARMONIZED'
  | 'PANSUS_DISCUSSION'
  | 'JOINT_APPROVAL'
  | 'FASILITASI_KEMENDAGRI'
  | 'NOREG_ISSUED'
  | 'ENACTED_JDIH';

export interface RoleInfo {
  code: RoleCode;
  name: string;
  userGroup: string;
  description: string;
  badgeColor: string;
}

export interface DIMItem {
  id: string;
  nomorPasalAyat: string;
  teksPasalAwal: string;
  sumberTanggapan: 'Fraksi Golkar' | 'Fraksi PDI-P' | 'Fraksi NasDem' | 'Fraksi Demokrat' | 'OPD Pemrakarsa' | 'Biro Hukum' | 'Bapemperda';
  jenisTanggapan: 'Tetap' | 'Ubah' | 'Hapus' | 'Tambah';
  drafUsulanPerubahan: string;
  alasanCatatan: string;
  statusKesepakatan: 'Disetujui' | 'Pending' | 'Ditolak';
  updatedAt: string;
}

export type DocumentCategory =
  | 'DRAF_RANPERDA'
  | 'NASKAH_AKADEMIK'
  | 'MATRIKS_SANDINGAN'
  | 'SURAT_BA_SELESAI';

export interface DocumentVersion {
  id: string;
  versionName: string; // e.g. "v1.0_Draft_Awal", "v1.1_Hasil_Harmonisasi_Kemenkumham", "v2.0_Hasil_Pansus_DPRD", "v3.0_Persetujuan_Bersama_Final"
  category?: DocumentCategory;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploadedRole: RoleCode;
  uploadedAt: string;
  downloadUrl?: string;
  keterangan: string;
}

export interface PicContact {
  id: string;
  namaPic: string;
  instansi: string;
  jabatan: string;
  email: string;
  whatsappNo: string; // Format: +62...
  roleCode: RoleCode;
  statusActive: boolean;
}

export interface MagicLinkToken {
  token: string;
  roleCode: RoleCode;
  ranperdaId: string;
  createdForPic: string;
  createdAt: string;
  expiresAt: string;
  url: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: RoleCode;
  actionName: string;
  details: string;
  documentRef?: string;
}

export interface NotificationLog {
  id: string;
  timestamp: string;
  recipient: string;
  channel: 'WhatsApp' | 'Email' | 'In-App';
  message: string;
  status: 'Terkirim' | 'Gagal';
}

export interface RanperdaDetail {
  id: string;
  nomorRanperda: string;
  judulRanperda: string;
  tahun: number;
  inisiatorType: 'DPRD' | 'EKSEKUTIF';
  inisiatorName: string; // e.g., "Komisi III DPRD Sulbar" or "Dinas Lingkungan Hidup Sulbar"
  komisiPengampu: string;
  opdPencegah: string;
  statusCode: RanperdaStatusCode;
  deskripsiRingkas: string;
  
  // Dates & SLA
  tanggalPengajuan: string;
  targetSlaDays: number;
  sisaHariSla: number;
  statusSla: 'Sesuai SLA' | 'Mendekati Tenggat' | 'Melebihi SLA (Alert)';
  
  // Specific Data
  naskahAkademikTitle?: string;
  beritaAcaraHarmonisasiNo?: string;
  beritaAcaraHarmonisasiDate?: string;
  pansusName?: string;
  pansusKetua?: string;
  nomorPersetujuanBersama?: string;
  tanggalPersetujuanBersama?: string;
  catatanFasilitasiKemendagri?: string;
  nomorRegisterPerda?: string; // Noreg
  tanggalNoreg?: string;
  nomorLembaranDaerah?: string;
  tanggalPengundangan?: string;
  
  // Nested Objects
  documents: DocumentVersion[];
  dimList: DIMItem[];
  auditLogs: AuditLog[];
  notificationLogs: NotificationLog[];
}

export interface PropemperdaItem {
  id: string;
  nomorUrut: number;
  tahun: number;
  judulRanperda: string;
  usulanOleh: 'DPRD' | 'Gubernur / Pemprov';
  opdKomisiPengampu: string;
  skorPrioritasBapemperda: number;
  targetTriwulan: 'Triwulan I' | 'Triwulan II' | 'Triwulan III' | 'Triwulan IV';
  statusProgram: 'Dalam Proses' | 'Selesai / Diundangkan' | 'Ditunda' | 'Belum Dimulai';
  keterangan: string;
}
