import { RdpRekomendasiExtended, WaTemplateConfig, WaLogItem } from './rdpTypes';

export const INITIAL_RDP_EXTENDED_DATA: RdpRekomendasiExtended[] = [
  {
    id: 'RDP-2026-001',
    nomorRdp: 'RDP/KOM-I/012/2026',
    judulRdp: 'Evaluasi Penyerapan Anggaran & Digitalisasi Sertifikasi Tanah Aset Pemprov',
    komisi: 'Komisi I',
    opdPenanggungJawab: 'Dinas Perumahan Rakyat, Perkim, Pertanahan & Perhubungan',
    opdPejabatNama: 'Drs. Maddareski Salatin, M.Si.',
    opdPejabatWa: '6281142556677',
    picNama: 'Bahar (Staf Perkim)',
    picWa: '6281133445566',
    poinCatatan: 'Lambatnya proses legalisasi sertifikat tanah sekolah dan puskesmas daerah di 3 kabupaten.',
    perintahTindakLanjut: 'Lakukan inventarisasi dan serahkan dokumen pemetaan digital aset tanah Pemprov paling lambat 14 hari kerja.',
    status: 'TERBIT_DIKIRIM',
    tanggalTerbit: '2026-08-01',
    slaDays: 14,
    deadlineDate: '2026-08-21',
    magicLinkToken: 'MAGIC-PERKIM-2026',
    evidenceFiles: [],
    statusLogs: [
      {
        id: 'LOG-1',
        statusAwal: 'DRAFT',
        statusBaru: 'TERBIT_DIKIRIM',
        timestamp: '2026-08-01 10:15 WITA',
        actor: 'Sekretariat Komisi I',
        keterangan: 'Disetujui Pimpinan Komisi I & dikirimkan via WA ke Kadis Perkim.',
      },
    ],
    lastWaSentTimestamp: '2026-08-01 10:16 WITA',
  },
  {
    id: 'RDP-2026-002',
    nomorRdp: 'RDP/KOM-IV/045/2026',
    judulRdp: 'Pemerataan Tenaga Pengajar dan Rehabilitasi Bangunan Sekolah Terpencil',
    komisi: 'Komisi IV',
    opdPenanggungJawab: 'Dinas Pendidikan dan Kebudayaan',
    opdPejabatNama: 'Muh. Nehru Sagena',
    opdPejabatWa: '6281242331100',
    picNama: 'Irham (Kabag Umum Disdik)',
    picWa: '6281288776655',
    poinCatatan: 'Kekurangan guru PPPK di wilayah pegunungan Mamasa dan infrastruktur sekolah rusak berat.',
    perintahTindakLanjut: 'Serahkan peta redistribusi guru PPPK dan jadwal rehabilitasi fisik DAK 2026.',
    status: 'DALAM_PROSES',
    tanggalTerbit: '2026-07-28',
    slaDays: 14,
    deadlineDate: '2026-08-17',
    magicLinkToken: 'MAGIC-DISDIK-2026',
    kronologiEksekusi: 'Tim Disdik telah menggelar rakor internal dan menyusun draf SK redistribusi guru.',
    evidenceFiles: [],
    statusLogs: [
      {
        id: 'LOG-2A',
        statusAwal: 'DRAFT',
        statusBaru: 'TERBIT_DIKIRIM',
        timestamp: '2026-07-28 14:00 WITA',
        actor: 'Sekretariat Komisi IV',
        keterangan: 'Rekomendasi RDP diterbitkan.',
      },
      {
        id: 'LOG-2B',
        statusAwal: 'TERBIT_DIKIRIM',
        statusBaru: 'DALAM_PROSES',
        timestamp: '2026-07-29 09:30 WITA',
        actor: 'Kadis Pendidikan',
        keterangan: 'Magic Link diakses oleh Kadis Disdik via WhatsApp.',
      },
    ],
    lastWaSentTimestamp: '2026-07-28 14:02 WITA',
  },
  {
    id: 'RDP-2026-003',
    nomorRdp: 'RDP/KOM-III/019/2026',
    judulRdp: 'Percepatan Perbaikan Jembatan Rusak Pasca Banjir di Kabupaten Pasangkayu',
    komisi: 'Komisi III',
    opdPenanggungJawab: 'Dinas Perumahan Rakyat, Perkim, Pertanahan & Perhubungan',
    opdPejabatNama: 'Drs. Maddareski Salatin, M.Si.',
    opdPejabatWa: '6281142556677',
    picNama: 'Bahar (Staf Perkim)',
    picWa: '6281133445566',
    poinCatatan: 'Akses ekonomi antar desa terputus akibat perbaikan jembatan darurat yang belum rampung.',
    perintahTindakLanjut: 'Kirimkan laporan progres fisik dan SPJ penggunaan dana tanggap darurat.',
    status: 'BUTUH_VERIFIKASI',
    tanggalTerbit: '2026-07-20',
    slaDays: 14,
    deadlineDate: '2026-08-09',
    magicLinkToken: 'MAGIC-PUPR-2026',
    kronologiEksekusi: 'Jembatan bailey darurat telah terpasang 100% dan uji beban dilaksanakan tanggal 4 Agustus 2026.',
    evidenceFiles: [
      {
        id: 'EV-101',
        fileName: 'Laporan_Fisik_Jembatan_Pasangkayu.pdf',
        fileSize: '3.4 MB',
        fileType: 'pdf',
        fileUrl: '/docs/Bukti_Jembatan_Pasangkayu.pdf',
        uploadedAt: '2026-08-05 11:20 WITA',
      },
      {
        id: 'EV-102',
        fileName: 'Foto_Serah_Terima_Uji_Beban.jpg',
        fileSize: '1.8 MB',
        fileType: 'jpg',
        fileUrl: '/docs/Foto_Uji_Beban.jpg',
        uploadedAt: '2026-08-05 11:22 WITA',
      },
    ],
    statusLogs: [
      {
        id: 'LOG-3A',
        statusAwal: 'DALAM_PROSES',
        statusBaru: 'BUTUH_VERIFIKASI',
        timestamp: '2026-08-05 11:25 WITA',
        actor: 'Kadis Perkim / PUPR',
        keterangan: 'OPD mengunggah 2 berkas bukti tindak lanjut.',
      },
    ],
    lastWaSentTimestamp: '2026-08-05 11:26 WITA',
  },
  {
    id: 'RDP-2026-004',
    nomorRdp: 'RDP/KOM-I/008/2026',
    judulRdp: 'Ketersediaan Infrastruktur Fiber Optik & Internet Desa Blankspot',
    komisi: 'Komisi I',
    opdPenanggungJawab: 'Dinas Kependudukan dan Pencatatan Sipil',
    opdPejabatNama: 'Muhammad Jaun, M.M.',
    opdPejabatWa: '6281241112233',
    picNama: 'Yudha (Staf Dukcapil)',
    picWa: '6281255443322',
    poinCatatan: 'Integrasi sistem SIAK terhambat jaringan internet lambat di daerah pedalaman.',
    perintahTindakLanjut: 'Koordinasikan jaringan Starlink/VSAT mobile unit untuk layanan adminduk keliling.',
    status: 'TUNTAS',
    tanggalTerbit: '2026-07-10',
    slaDays: 14,
    deadlineDate: '2026-07-30',
    magicLinkToken: 'MAGIC-DUKCAPIL-2026',
    kronologiEksekusi: 'Pengadaan 5 unit VSAT Starlink Mobile telah dilaksanakan dan operasional 100% untuk pelayanan jemput bola.',
    evidenceFiles: [
      {
        id: 'EV-201',
        fileName: 'BA_Serah_Terima_VSAT_Starlink.pdf',
        fileSize: '2.1 MB',
        fileType: 'pdf',
        fileUrl: '/docs/BA_Starlink_Dukcapil.pdf',
        uploadedAt: '2026-07-25 15:10 WITA',
      },
    ],
    statusLogs: [
      {
        id: 'LOG-4A',
        statusAwal: 'BUTUH_VERIFIKASI',
        statusBaru: 'TUNTAS',
        timestamp: '2026-07-27 10:00 WITA',
        actor: 'Ketua Komisi I DPRD',
        keterangan: 'Bukti disetujui Komisi I. Rekomendasi dinyatakan TUNTAS / CLOSED.',
      },
    ],
    lastWaSentTimestamp: '2026-07-27 10:05 WITA',
  },
  {
    id: 'RDP-2026-005',
    nomorRdp: 'RDP/KOM-II/031/2026',
    judulRdp: 'Penanganan Kelangkaan Pupuk Subsidized bagi Petani Kakao dan Sawit',
    komisi: 'Komisi II',
    opdPenanggungJawab: 'Dinas Tanaman Pangan, Hortikultura & Peternakan',
    opdPejabatNama: 'Hamdani Hamdi',
    opdPejabatWa: '6281242778899',
    picNama: 'Suryani (Staf Distan)',
    picWa: '6281266554433',
    poinCatatan: 'Alokasi pupuk bersubsidi tidak tepat sasaran dan terjadi penimbunan di kelompok tani tertentu.',
    perintahTindakLanjut: 'Verifikasi ulang data e-RDKK dan lakukan sidak ke distributor pupuk di Polewali Mandar.',
    status: 'OVERDUE',
    tanggalTerbit: '2026-07-12',
    slaDays: 14,
    deadlineDate: '2026-08-01',
    magicLinkToken: 'MAGIC-DISTAN-2026',
    kronologiEksekusi: 'Tenggat waktu SLA 14 hari kerja telah terlampaui tanpa laporan bukti balasan.',
    evidenceFiles: [],
    statusLogs: [
      {
        id: 'LOG-5A',
        statusAwal: 'DALAM_PROSES',
        statusBaru: 'OVERDUE',
        timestamp: '2026-08-02 00:01 WITA',
        actor: 'System Cron SLA Engine',
        keterangan: 'SLA 14 Hari Kerja terlampaui. Status otomatis berubah ke OVERDUE & Alert Eskalasi dikirim ke Sekda & Pimpinan DPRD.',
      },
    ],
    lastWaSentTimestamp: '2026-08-02 08:00 WITA',
  },
  {
    id: 'RDP-2026-006',
    nomorRdp: 'RDP/KOM-IV/052/2026',
    judulRdp: 'Penanganan Stunting & Pengadaan Alat Antropometri Kit di Posyandu',
    komisi: 'Komisi IV',
    opdPenanggungJawab: 'Dinas Kesehatan, Pengendalian Penduduk, dan KB',
    opdPejabatNama: 'dr. Hj. Nursyamsi Rahim',
    opdPejabatWa: '6281355998877',
    picNama: 'Maya SKM (Sekpri Kadis)',
    picWa: '6281311223344',
    poinCatatan: 'Laporan belum mencantumkan rincian distribusi alat antropometri per puskesmas.',
    perintahTindakLanjut: 'Lengkapi berita acara distribusi alat per desa dan data balita terlayani.',
    status: 'DIKEMBALIKAN',
    tanggalTerbit: '2026-07-22',
    slaDays: 14,
    deadlineDate: '2026-08-11',
    magicLinkToken: 'MAGIC-DINKES-2026',
    catatanKomisiRevisi: 'Laporan awal yang dikirim hanya berbentuk nota pembelian, belum ada Berita Acara Serah Terima (BAST) ke Puskesmas. Mohon dilengkapi.',
    evidenceFiles: [
      {
        id: 'EV-301',
        fileName: 'Nota_Pembelian_Alat_Antropometri.pdf',
        fileSize: '1.1 MB',
        fileType: 'pdf',
        fileUrl: '/docs/Nota_Antropometri.pdf',
        uploadedAt: '2026-08-03 09:15 WITA',
      },
    ],
    statusLogs: [
      {
        id: 'LOG-6A',
        statusAwal: 'BUTUH_VERIFIKASI',
        statusBaru: 'DIKEMBALIKAN',
        timestamp: '2026-08-04 14:20 WITA',
        actor: 'Komisi IV DPRD',
        keterangan: 'Komisi IV menolak bukti awal dan meminta kelengkapan BAST Puskesmas.',
      },
    ],
    lastWaSentTimestamp: '2026-08-04 14:22 WITA',
  },
];

export const DEFAULT_WA_TEMPLATES: WaTemplateConfig[] = [
  {
    id: 'TPL-1',
    triggerType: 'INSTANT_TERBIT',
    title: 'Notifikasi Terbit Rekomendasi RDP Baru',
    targetRole: 'Pejabat OPD Penanggung Jawab',
    templateText: `*PEMBERITAHUAN REKOMENDASI RDP DPRD SULBAR*
Yth. Bpk/Ibu {NAMA_PEJABAT} ({JABATAN})

Komisi {KOMISI} DPRD Prov. Sulawesi Barat telah menerbitkan Rekomendasi RDP Resmi No. *{NOMOR_RDP}*.

📌 *Perintah Tindak Lanjut:*
"{PERINTH_TINDAK_LANJUT}"

⏱️ *Batas Waktu SLA:* {SLA_DAYS} Hari Kerja (Tenggat: {DEADLINE_DATE})

Silakan akses Portal Evidence Vault & Upload Laporan melalui link berikut:
🔗 {MAGIC_LINK}

_Sekretariat DPRD Provinsi Sulawesi Barat - E-Parlemen 2026_`,
  },
  {
    id: 'TPL-2',
    triggerType: 'REMINDER_H3',
    title: 'Pengingat Otomatis H-3 Sebelum Tenggat SLA',
    targetRole: 'Pejabat OPD & PIC Staf',
    templateText: `*PENGINGAT (REMINDER H-3) REKOMENDASI RDP*
Yth. Bpk/Ibu {NAMA_PEJABAT} ({OPD_NAME})

Mengingatkan bahwa Rekomendasi RDP No. *{NOMOR_RDP}* tersisa *3 HARI KERJA* lagi sebelum tenggat SLA berakhir ({DEADLINE_DATE}).

Mohon segera mengunggah berkas bukti tindak lanjut melalui link resmi:
🔗 {MAGIC_LINK}

_Sistem Penagihan Otomatis E-Tracking RDP DPRD Sulbar_`,
  },
  {
    id: 'TPL-3',
    triggerType: 'REMINDER_H1',
    title: 'Pengingat Otomatis H-1 (Urgent)',
    targetRole: 'Pejabat OPD & PIC Staf',
    templateText: `⚠️ *PERINGATAN TENGGAT H-1 REKOMENDASI RDP*
Yth. Bpk/Ibu {NAMA_PEJABAT}

Tenggat waktu SLA untuk Rekomendasi No. *{NOMOR_RDP}* akan BERAKHIR BESOK HARI ({DEADLINE_DATE}).

Guna menghindari penetapan status OVERDUE & Alert Eskalasi ke Sekda Pemprov Sulbar, mohon submit bukti tindak lanjut sekarang:
🔗 {MAGIC_LINK}`,
  },
  {
    id: 'TPL-4',
    triggerType: 'ESCALATION_OVERDUE',
    title: 'Alert Eskalasi Overdue ke Sekda & Pimpinan DPRD',
    targetRole: 'Pimpinan DPRD, Sekda Pemprov, Pimpinan Komisi',
    templateText: `🚨 *ALERT ESKALASI OVERDUE REKOMENDASI RDP*
Yth. Bapak Sekretaris Daerah & Pimpinan DPRD Sulbar,

Sistem mencatat Rekomendasi RDP berikut telah MELEBIHI BATAS WAKTU (OVERDUE):

• Nomor: *{NOMOR_RDP}*
• OPD Penanggung Jawab: *{OPD_NAME}*
• Pejabat: {NAMA_PEJABAT}
• Tenggat SLA: {DEADLINE_DATE} (Terlambat {TERLAMBAT_HARI} Hari)

Mohon atensi pimpinan untuk pembinaan dan penagihan khusus.
_E-Parlemen System Governance - Pemprov Sulbar_`,
  },
  {
    id: 'TPL-5',
    triggerType: 'REVISI_DIKEMBALIKAN',
    title: 'Notifikasi Pengembalian/Revisi Laporan dari Komisi',
    targetRole: 'Pejabat OPD',
    templateText: `🔄 *REVISI BUKTI TINDAK LANJUT RDP*
Yth. Bpk/Ibu {NAMA_PEJABAT}

Laporan tindak lanjut RDP No. *{NOMOR_RDP}* dikembalikan oleh Komisi {KOMISI} DPRD dengan catatan:

📝 *Catatan Revisi:*
"{CATATAN_REVISI}"

Mohon lakukan klarifikasi dan unggah ulang berkas perbaikan melalui portal:
🔗 {MAGIC_LINK}`,
  },
];
