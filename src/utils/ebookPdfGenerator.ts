import { jsPDF } from 'jspdf';

/**
 * Utility to generate a professional, multi-page PDF E-Book
 * "Buku Panduan & Manual Penggunaan Aplikasi E-Parlemen AI DPRD Provinsi Sulawesi Barat"
 */
export function generateEbookPdf(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  let currentPage = 1;

  // Helper for adding headers and footers to content pages
  const addHeaderFooter = (titleText: string = 'BUKU PANDUAN APLIKASI E-PARLEMEN SULBAR v2.4') => {
    // Header line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, 12, pageWidth - margin, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(titleText, margin, 9);
    doc.text('DPRD PROVINSI SULAWESI BARAT', pageWidth - margin, 9, { align: 'right' });

    // Footer line
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('E-Parlemen AI Core • SPBE Perpres 95/2018', margin, pageHeight - 8);
    doc.text(`Halaman ${currentPage}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  // Background decoration
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative header band
  doc.setFillColor(5, 150, 105); // emerald-600
  doc.rect(0, 0, pageWidth, 8, 'F');

  doc.setFillColor(217, 119, 6); // amber-600
  doc.rect(0, 8, pageWidth, 3, 'F');

  // Center Emblem / Box
  doc.setFillColor(30, 41, 59); // slate-800
  doc.roundedRect(margin, 40, contentWidth, 55, 4, 4, 'F');
  doc.setDrawColor(16, 185, 129); // emerald-500
  doc.setLineWidth(1);
  doc.roundedRect(margin, 40, contentWidth, 55, 4, 4, 'D');

  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PEMERINTAH PROVINSI SULAWESI BARAT', pageWidth / 2, 52, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('SEKRETARIAT DEWAN PERWAKILAN RAKYAT DAERAH', pageWidth / 2, 62, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.setFont('helvetica', 'normal');
  doc.text('Kompleks Perkantoran Gubernur Sulbar, Jl. H. Abd. Malik Pattana Endeng, Mamuju', pageWidth / 2, 72, { align: 'center' });
  doc.text('Sistem Pemerintahan Berbasis Elektronik (SPBE) Terintegrasi', pageWidth / 2, 80, { align: 'center' });

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text('BUKU PANDUAN RESMI', pageWidth / 2, 125, { align: 'center' });

  doc.setTextColor(52, 211, 153); // emerald-400
  doc.setFontSize(20);
  doc.text('E-PARLEMEN SULBAR', pageWidth / 2, 137, { align: 'center' });

  doc.setTextColor(251, 191, 36); // amber-400
  doc.setFontSize(13);
  doc.text('MANUAL OPERASIONAL SISTEM & FITUR LENGKAP v2.4 AI CORE', pageWidth / 2, 147, { align: 'center' });

  // Divider
  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 40, 155, pageWidth / 2 + 40, 155);

  // Subtitle / Description text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(226, 232, 240);
  const coverDesc = [
    'Panduan komprehensif bagi Administrator, Kepala Bagian (Kabag),',
    'dan Operator Sidang dalam mengoperasikan Trilogi Layanan Parlemen:',
    '1. Persidangan & Risalah AI  •  2. Fasilitasi Pimpinan  •  3. Kehumasan & Publikasi',
  ];
  let cY = 166;
  coverDesc.forEach((line) => {
    doc.text(line, pageWidth / 2, cY, { align: 'center' });
    cY += 6;
  });

  // Metadata Card at bottom
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, 205, contentWidth, 52, 3, 3, 'F');
  doc.setDrawColor(51, 65, 85);
  doc.roundedRect(margin, 205, contentWidth, 52, 3, 3, 'D');

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('INFORMASI DOKUMEN & IDENTITAS SISTEM:', margin + 6, 215);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(248, 250, 252);
  doc.text('• Edisi / Versi           : E-Parlemen v2.4 AI Core Engine 2026', margin + 6, 223);
  doc.text('• Level Pengguna       : Administrator, Kabag Persidangan, Operator Sidang', margin + 6, 230);
  doc.text('• Infrastruktur Data   : Supabase PostgreSQL 17 & Hostinger Cloud Engine', margin + 6, 237);
  doc.text('• Repositori Kode      : https://github.com/digidewan-sulbar/--Parlemen-AI', margin + 6, 244);
  doc.text('• Status Dokumen       : Dokumen Resmi Panduan Operasional Sekretariat DPRD', margin + 6, 251);

  // Footer cover
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('SEKRETARIAT DPRD PROVINSI SULAWESI BARAT — TAHUN ANGGARAN 2026', pageWidth / 2, 280, { align: 'center' });

  // ==========================================
  // PAGE 2: KATA PENGANTAR & DAFTAR ISI
  // ==========================================
  doc.addPage();
  currentPage++;
  addHeaderFooter('KATA PENGANTAR & DAFTAR ISI');

  let y = 25;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('KATA PENGANTAR SEKRETARIAT DPRD', margin, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const kataPengantar = [
    'Puji syukur ke hadirat Tuhan Yang Maha Esa, aplikasi E-Parlemen DPRD Provinsi Sulawesi Barat v2.4 AI Core hadir sebagai terobosan transformasi digital dan Reformasi Birokrasi (Aksi Perubahan PIM III) dalam kerangka Sistem Pemerintahan Berbasis Elektronik (SPBE) sesuai Perpres No. 95 Tahun 2018.',
    '',
    'Aplikasi ini memadukan kecerdasan artifisial terdepan untuk mentranskripsi risalah rapat, menganalisis dinamika sentimen sidang secara objektif, melacak masa pembahasan Ranperda berbasis SLA (Service Level Agreement), mengawasi tindak lanjut rekomendasi RDP terhadap OPD, serta mengotomatiskan penerbitan rilis pers resmi untuk publik.',
    '',
    'Buku manual ini disusun secara sistematis agar segenap aparatur Sekretariat DPRD Provinsi Sulawesi Barat—mulai dari Administrator Sistem, Kepala Bagian, hingga Operator Sidang—dapat mengoperasikan seluruh menu dan fitur dengan mudah, cepat, dan presisi.',
  ];

  kataPengantar.forEach((p) => {
    if (p === '') {
      y += 3;
    } else {
      const split = doc.splitTextToSize(p, contentWidth);
      doc.text(split, margin, y);
      y += split.length * 4.8;
    }
  });

  y += 6;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // DAFTAR ISI
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('DAFTAR ISI BUKU MANUAL', margin, y);
  y += 8;

  const tocItems = [
    { no: 'BAB 1', title: 'Gambaran Umum, Arsitektur & Trilogi Layanan Parlemen', hal: 'Hal. 3' },
    { no: 'BAB 2', title: 'Akses Sistem, Manajemen Akun & 3 Level Hak Akses', hal: 'Hal. 4' },
    { no: 'BAB 3', title: 'Pilar 1: Modul Risalah Rapat AI & 10 Kategori Rapat Resmi', hal: 'Hal. 5' },
    { no: 'BAB 4', title: 'Pilar 1: Tracking Ranperda (SLA) & E-Tracking RDP OPD', hal: 'Hal. 6' },
    { no: 'BAB 5', title: 'Pilar 2: Fasilitasi Pimpinan, Agenda Terpadu & Executive Summary AI', hal: 'Hal. 7' },
    { no: 'BAB 6', title: 'Pilar 3: Humas, Protokol & AI Press Release Generator Multi-Kanal', hal: 'Hal. 8' },
    { no: 'BAB 7', title: 'Direktori 45 Anggota DPRD & Pejabat Pemprov Sulbar 2026', hal: 'Hal. 9' },
    { no: 'BAB 8', title: 'Manajemen Supabase Database, Deploy GitHub & Troubleshooting', hal: 'Hal. 10' },
  ];

  tocItems.forEach((item) => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y - 4, contentWidth, 9, 1.5, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(5, 150, 105);
    doc.text(item.no, margin + 3, y + 2);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(item.title, margin + 22, y + 2);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(item.hal, pageWidth - margin - 4, y + 2, { align: 'right' });

    y += 11;
  });

  // ==========================================
  // PAGE 3: BAB 1 - GAMBARAN UMUM & ARSITEKTUR
  // ==========================================
  doc.addPage();
  currentPage++;
  addHeaderFooter('BAB 1 — GAMBARAN UMUM & ARSITEKTUR SISTEM');

  y = 25;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('BAB 1: GAMBARAN UMUM & ARSITEKTUR SISTEM', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const bab1Content = [
    'Aplikasi E-Parlemen DPRD Provinsi Sulawesi Barat adalah platform digital cerdas berbasis AI Core Engine v2.4 yang dibangun untuk meningkatkan transparansi, akuntabilitas, dan efisiensi kerja kedewanan di lingkungan Sekretariat DPRD Provinsi Sulawesi Barat.',
    '',
    '1.1 Landasan Regulasi & Tata Kelola:',
    '• Peraturan Presiden No. 95 Tahun 2018 tentang Sistem Pemerintahan Berbasis Elektronik (SPBE).',
    '• Undang-Undang No. 23 Tahun 2014 tentang Pemerintahan Daerah.',
    '• Peraturan Tata Tertib DPRD Provinsi Sulawesi Barat tentang Risalah Rapat dan Fasilitasi Pimpinan.',
    '• Aksi Perubahan Pelatihan Kepemimpinan Administrator (PIM III) Reformasi Birokrasi.',
    '',
    '1.2 Tiga Pilar Utama (Trilogi Layanan Parlemen):',
    '1. Pilar 1 - Persidangan & Risalah Legislasi:',
    '   Mengelola perekaman dan transkripsi suara otomatis menggunakan AI, pembakuan bahasa notulensi, analisis dinamika debat/sentimen fraksi, pengawasan batas waktu (SLA) Ranperda, dan pemantauan tindak lanjut RDP oleh OPD mitra kerja.',
    '',
    '2. Pilar 2 - Fasilitasi Pimpinan:',
    '   Menyajikan sinkronisasi kalender agenda Ketua dan 3 Wakil Ketua DPRD, pembuatan Executive Summary (One-Pager Briefing) instan oleh AI sebelum sidang, serta pengawasan distribusi disposisi pimpinan.',
    '',
    '3. Pilar 3 - Kehumasan & Publikasi:',
    '   Menyulap notulensi dan rekaman sidang menjadi Berita Siaran Pers resmi 5W+1H siap tayang di portal resmi, media sosial, dan rilis pers media massa lokal/nasional.',
  ];

  bab1Content.forEach((line) => {
    if (line === '') {
      y += 2.5;
    } else {
      const isBold = line.startsWith('1.') || line.startsWith('BAB');
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setTextColor(isBold ? 15 : 51, isBold ? 23 : 65, isBold ? 42 : 85);
      const split = doc.splitTextToSize(line, contentWidth);
      doc.text(split, margin, y);
      y += split.length * 4.4;
    }
  });

  // Box Diagram Arsitektur
  y += 4;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('SKEMA ALIRAN DATA DIGITAL E-PARLEMEN SULBAR:', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('[Ruang Rapat DPRD] Audio Rekaman Mic Sidang / File WAV/MP3', margin + 4, y + 13);
  doc.text('           ↓', margin + 4, y + 17);
  doc.text('[AI Core Engine] Transkripsi Otomatis → Kalimat Baku → Analisis Sentimen & Rekomendasi', margin + 4, y + 21);
  doc.text('           ↓', margin + 4, y + 25);
  doc.text('[Output Terpadu] Format Cetak Risalah Resmi • SLA Ranperda • Exec Summary Pimpinan • Rilis Berita Pers', margin + 4, y + 29);
  doc.text('[Database Awan] Supabase PostgreSQL 17 + Hostinger Cloud + Repositori GitHub Auto-Deploy', margin + 4, y + 33);

  // ==========================================
  // PAGE 4: BAB 2 - MANAJEMEN AKSES & LOGIN
  // ==========================================
  doc.addPage();
  currentPage++;
  addHeaderFooter('BAB 2 — MANAJEMEN AKSES & 3 LEVEL PENGGUNA');

  y = 25;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('BAB 2: MANAJEMEN AKSES, LOGIN & HAK AKSES', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const bab2Intro = [
    'Untuk menjamin keamanan data persidangan dan membagi tanggung jawab kerja secara profesional, sistem E-Parlemen menerapkan pembatasan akses berbasis 3 level peran (Role-Based Access Control). Setiap pengguna wajib masuk melalui halaman login terenkripsi.',
  ];
  bab2Intro.forEach((p) => {
    const split = doc.splitTextToSize(p, contentWidth);
    doc.text(split, margin, y);
    y += split.length * 4.4;
  });

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('2.1 Tabel Kredensial & Matriks Hak Akses:', margin, y);
  y += 6;

  // Table Role
  const roles = [
    {
      level: 'Level 1: Administrator',
      user: 'admin',
      pass: 'admin.321',
      desc: 'Satu-satunya level yang dapat melihat & mengakses: Supabase DB, Deploy GitHub, dan Integrasi Database PostgreSQL. Berwenang penuh atas data Pejabat, Anggota DPRD & otentikasi/disposisi.',
      color: [16, 185, 129],
    },
    {
      level: 'Level 2: Kepala Bagian (Kabag)',
      user: 'kabag',
      pass: 'kabag.321',
      desc: 'Berwenang menambah & mengedit data Pejabat Pemprov & Anggota DPRD, mengotentikasi paraf risalah rapat, serta mendisposisi agenda pimpinan. Fitur database & deploy GitHub disembunyikan.',
      color: [245, 158, 11],
    },
    {
      level: 'Level 3: Operator',
      user: 'operator',
      pass: 'op.321',
      desc: 'Tugas teknis & administratif harian: membuat risalah, transkripsi AI, edit draf teks, rilis berita humas, serta cetak PDF. Dibatasi dari perubahan master data, otentikasi/disposisi, dan DB.',
      color: [59, 130, 246],
    },
  ];

  roles.forEach((r) => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'F');
    doc.setDrawColor(r.color[0], r.color[1], r.color[2]);
    doc.setLineWidth(0.8);
    doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(r.color[0], r.color[1], r.color[2]);
    doc.text(r.level, margin + 4, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Username: ${r.user}   |   Password: ${r.pass}`, margin + 65, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const splitDesc = doc.splitTextToSize(r.desc, contentWidth - 8);
    doc.text(splitDesc, margin + 4, y + 12);

    y += 26;
  });

  y += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('2.2 Prosedur Masuk (Login) & Keluar (Logout):', margin, y);
  y += 5;

  const stepsLogin = [
    '1. Buka tautan resmi E-Parlemen DPRD Sulbar di peramban (Chrome, Edge, Firefox, Safari).',
    '2. Masukkan Username dan Password sesuai tabel hak akses di atas.',
    '3. (Opsional) Centang "Ingat Sesi Masuk" agar tidak perlu memasukkan sandi berulang kali pada komputer kedinasan.',
    '4. Klik tombol "Masuk ke Sistem E-Parlemen". Anda akan diarahkan ke Beranda Pilar Persidangan.',
    '5. Untuk keluar (Logout): Klik profil Anda di pojok kanan atas navbar, lalu pilih "Keluar / Logout".',
  ];

  stepsLogin.forEach((st) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const split = doc.splitTextToSize(st, contentWidth);
    doc.text(split, margin, y);
    y += split.length * 4.2;
  });

  // ==========================================
  // PAGE 5: BAB 3 - PILAR 1: RISALAH RAPAT AI
  // ==========================================
  doc.addPage();
  currentPage++;
  addHeaderFooter('BAB 3 — PILAR 1: MODUL RISALAH RAPAT AI & 10 JENIS RAPAT');

  y = 25;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('BAB 3: PILAR 1 — RISALAH RAPAT AI & 10 JENIS RAPAT', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const bab3Intro = [
    'Modul Risalah Rapat Terintegrasi adalah jantung digitalisasi persidangan DPRD Sulbar. Modul ini mengakomodasi seluruh jenis rapat resmi Alat Kelengkapan Dewan (AKD) dan memanfaatkan AI untuk memangkas waktu pembuatan notulensi dari 3-5 hari menjadi kurang dari 15 menit.',
  ];
  bab3Intro.forEach((p) => {
    const split = doc.splitTextToSize(p, contentWidth);
    doc.text(split, margin, y);
    y += split.length * 4.4;
  });

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('3.1 Daftar 10 Jenis Rapat Resmi DPRD Sulawesi Barat:', margin, y);
  y += 5;

  const daftarRapat = [
    '1. Rapat Banggar (Badan Anggaran) — Pembahasan KUA-PPAS, APBD Induk & Perubahan.',
    '2. Rapat BK (Badan Kehormatan) — Penegakan kode etik dan tata beracara dewan.',
    '3. Rapat Bapemperda — Perumusan program pembentukan peraturan daerah.',
    '4. Rapat Pimpinan — Rapat koordinasi Ketua dan para Wakil Ketua DPRD.',
    '5. Rapat Pimpinan di Perluas — Melibatkan Pimpinan Dewan bersama seluruh Ketua Fraksi & Ketua Komisi.',
    '6. Rapat Sekretariat DPRD — Rapat internal pejabat struktural dan staf sekretariat pendukung.',
    '7. Rapat Komisi I — Bidang Pemerintahan, Hukum, Keamanan, dan Aparatur.',
    '8. Rapat Komisi II — Bidang Perekonomian, Pertanian, Perkebunan, dan Kelautan.',
    '9. Rapat Komisi III — Bidang Pembangunan, Infrastruktur, dan Lingkungan Hidup.',
    '10. Rapat Komisi IV — Bidang Kesejahteraan Rakyat, Pendidikan, Kesehatan, dan Sosial.',
  ];

  daftarRapat.forEach((r) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const split = doc.splitTextToSize(r, contentWidth);
    doc.text(split, margin, y);
    y += split.length * 3.8;
  });

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('3.2 Empat Tahap Alur Kerja Pembuatan Risalah AI:', margin, y);
  y += 5;

  const alurRisalah = [
    '• Tahap 1 (Perekaman / Upload Kasar): Operator menyalakan rekaman audio langsung melalui mikrofon peramban atau mengunggah rekaman sidang (format MP3/WAV/M4A).',
    '• Tahap 2 (Transkripsi Suara-ke-Teks AI): Mesin AI mengenali suara pembicara (diarization), mencocokkan nama anggota dewan/OPD, dan menghasilkan transkrip kata demi kata berserta timestamp.',
    '• Tahap 3 (Olah Kalimat Baku AI): AI menyunting bahasa tutur lisan menjadi kalimat formal sesuai Pedoman Umum Ejaan Bahasa Indonesia (PUEBI) dan tata naskah dinas resmi.',
    '• Tahap 4 (Finalisasi & Analisis Sentimen): Sistem membuat ringkasan hasil rapat, mendeteksi dinamika perdebatan fraksi, dan menghasilkan dokumen format kop dinas siap cetak PDF.',
  ];

  alurRisalah.forEach((al) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const split = doc.splitTextToSize(al, contentWidth);
    doc.text(split, margin, y);
    y += split.length * 4;
  });

  // ==========================================
  // PAGE 6: BAB 4 - PILAR 1: RANPERDA (SLA) & RDP
  // ==========================================
  doc.addPage();
  currentPage++;
  addHeaderFooter('BAB 4 — PILAR 1: TRACKING RANPERDA & E-TRACKING RDP');

  y = 25;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('BAB 4: TRACKING RANPERDA (SLA) & E-TRACKING RDP OPD', margin, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('4.1 Sistem Pelacakan 7 Tahapan Ranperda & Service Level Agreement (SLA):', margin, y);
  y += 5;

  const tahapanRanperda = [
    '1. Tahap 1: Naskah Akademik (Kajian ilmiah dan filosofis latar belakang regulasi).',
    '2. Tahap 2: Draf Ranperda (Penyusunan pasal demi pasal dan batang tubuh).',
    '3. Tahap 3: Pembahasan Propemperda (Penetapan skala prioritas legislasi tahunan).',
    '4. Tahap 4: Pembahasan Komisi / Rapat Paripurna (Tanggapan fraksi dan pandangan umum).',
    '5. Tahap 5: Fasilitasi Kemendagri (Harmonisasi vertikal kementerian).',
    '6. Tahap 6: Persetujuan Bersama DPRD dan Gubernur Sulawesi Barat.',
    '7. Tahap 7: Pengundangan Lembaran Daerah menjadi Peraturan Daerah (Perda) definitif.',
  ];

  tahapanRanperda.forEach((t) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const split = doc.splitTextToSize(t, contentWidth);
    doc.text(split, margin, y);
    y += split.length * 3.8;
  });

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Mekanisme SLA & Peringatan Dini (Early Warning System):', margin, y);
  y += 4.5;

  const slaInfo = [
    '• Status "Sesuai SLA" (Hijau): Masa pembahasan masih jauh dari batas waktu toleransi.',
    '• Status "Mendekati Tenggat" (Kuning): Sisa hari ≤ 5 hari kerja, sistem memicu notifikasi siaga.',
    '• Status "Melebihi SLA" (Merah Alert): Melewati target hari, memicu notifikasi otomatis ke Kabag dan Pimpinan Dewan agar segera diagendakan percepatan rapat evaluasi.',
  ];

  slaInfo.forEach((sl) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const split = doc.splitTextToSize(sl, contentWidth);
    doc.text(split, margin, y);
    y += split.length * 3.8;
  });

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('4.2 Modul E-Tracking RDP (Rapat Dengar Pendapat) OPD Pemprov Sulbar:', margin, y);
  y += 5;

  const rdpInfo = [
    'Fasilitas ini memantau realisasi rekomendasi dewan yang ditujukan kepada Kepala Dinas/Badan Pemprov Sulbar pasca RDP komisi. Status terdiri atas:',
    '• Selesai (Disertai unggahan bukti dokumen pertanggungjawaban fisik/SK OPD).',
    '• Sedang Berjalan (Proses pekerjaan fisik lapangan atau administrasi).',
    '• Belum Ditindaklanjuti (Memerlukan surat peringatan dan pemanggilan ulang ke komisi pengampu).',
  ];

  rdpInfo.forEach((r) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const split = doc.splitTextToSize(r, contentWidth);
    doc.text(split, margin, y);
    y += split.length * 3.8;
  });

  // ==========================================
  // PAGE 7: BAB 5 - PILAR 2: FASILITASI PIMPINAN
  // ==========================================
  doc.addPage();
  currentPage++;
  addHeaderFooter('BAB 5 — PILAR 2: FASILITASI PIMPINAN & EXEC SUMMARY');

  y = 25;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('BAB 5: PILAR 2 — FASILITASI PIMPINAN & EXEC SUMMARY AI', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const bab5Content = [
    'Pilar Fasilitasi Pimpinan dirancang khusus untuk memenuhi kebutuhan Ketua DPRD dan 3 Wakil Ketua DPRD dalam mengambil keputusan strategis daerah secara cepat dan tepat berbasis data akurat.',
    '',
    '5.1 Fitur Executive Summary AI (Ringkasan Eksekutif 1 Halaman):',
    '• Sebelum pimpinan memimpin sidang paripurna atau rapat pimpinan, sistem AI secara otomatis merangkum dokumen persidangan, risalah sebelumnya, dan pokok perdebatan menjadi 1 lembar ringkasan padat.',
    '• Memuat: Latar Belakang Isu, Sikap Masing-Masing Fraksi, Potensi Masalah Hukum/Anggaran, dan Rekomendasi Solutif untuk Pimpinan Sidang.',
    '• Dapat diunduh atau dibaca langsung melalui gawai tablet/smartphone pimpinan.',
    '',
    '5.2 Kalender Agenda Terpadu Pimpinan DPRD:',
    '• Menyelaraskan jadwal agenda Ketua DPRD, Wakil Ketua I, Wakil Ketua II, dan Wakil Ketua III.',
    '• Mencegah tumpang tindih penugasan kunjungan kerja luar daerah dan rapat koordinasi Forkopimda.',
    '• Menampilkan status kehadiran pimpinan dan disposisi delegasi tugas kepada anggota dewan lainnya.',
    '',
    '5.3 Disposisi Digital & Arahan Pimpinan:',
    '• Memungkinkan pimpinan memberikan instruksi tertulis langsung ke Komisi atau Sekretaris DPRD.',
    '• Pencatatan riwayat disposisi tercatat rapi secara digital dan terhubung ke notifikasi staf pelaksana.',
  ];

  bab5Content.forEach((line) => {
    if (line === '') {
      y += 2.5;
    } else {
      const isHeader = line.startsWith('5.');
      doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
      doc.setTextColor(isHeader ? 15 : 51, isHeader ? 23 : 65, isHeader ? 42 : 85);
      const split = doc.splitTextToSize(line, contentWidth);
      doc.text(split, margin, y);
      y += split.length * 4.2;
    }
  });

  // ==========================================
  // PAGE 8: BAB 6 - PILAR 3: HUMAS & AI PRESS RELEASE
  // ==========================================
  doc.addPage();
  currentPage++;
  addHeaderFooter('BAB 6 — PILAR 3: HUMAS & AI PRESS RELEASE GENERATOR');

  y = 25;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('BAB 6: PILAR 3 — HUMAS & AI PRESS RELEASE GENERATOR', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const bab6Content = [
    'Pilar Kehumasan dan Protokol menjembatani aspirasi dewan dengan masyarakat luas melalui otomasi penerbitan berita resmi yang faktual, cepat, dan terukur.',
    '',
    '6.1 AI Press Release Generator:',
    '• Beroperasi otomatis mengubah ribuan baris transkrip sidang dan perdebatan menjadi Siaran Pers resmi bernilai jurnalistik tinggi dengan rumus 5W + 1H (What, Who, Where, When, Why, How).',
    '• Mengutip secara tepat pernyataan Ketua Sidang dan narasumber kunci tanpa distorsi opini.',
    '• Menyediakan tombol "Copy Rilis Berita" untuk segera dibagikan ke grup wartawan atau media center DPRD.',
    '',
    '6.2 Multi-Kanal Publikasi:',
    '• Portal Web Resmi DPRD: Rilis artikel lengkap dengan foto dokumentasi sidang.',
    '• Media Sosial (Instagram/Facebook): Ringkasan infografis dan sorotan poin keputusan dewan.',
    '• Siaran WhatsApp Media Massa: Format pesan ringkas bagi rekan-rekan jurnalis peliput parlemen.',
    '',
    '6.3 Monitoring Respon & Opini Publik:',
    '• Memantau feedback masyarakat atas kebijakan perda atau rekomendasi yang diputuskan dewan.',
  ];

  bab6Content.forEach((line) => {
    if (line === '') {
      y += 2.5;
    } else {
      const isHeader = line.startsWith('6.');
      doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
      doc.setTextColor(isHeader ? 15 : 51, isHeader ? 23 : 65, isHeader ? 42 : 85);
      const split = doc.splitTextToSize(line, contentWidth);
      doc.text(split, margin, y);
      y += split.length * 4.2;
    }
  });

  // ==========================================
  // PAGE 9: BAB 7 - MASTER DATA DEWAN & PEMPROV
  // ==========================================
  doc.addPage();
  currentPage++;
  addHeaderFooter('BAB 7 — DIREKTORI 45 ANGGOTA DPRD & PEMPROV 2026');

  y = 25;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('BAB 7: DIREKTORI 45 ANGGOTA DEWAN & PEMPROV 2026', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const bab7Content = [
    'Aplikasi E-Parlemen telah dilengkapi dengan direktori master data lengkap seluruh pemangku kepentingan legislatif dan eksekutif Sulawesi Barat Tahun Anggaran 2026.',
    '',
    '7.1 Direktori 45 Pimpinan & Anggota DPRD Sulawesi Barat:',
    '• Profil lengkap 45 Anggota Dewan mencakup: Nama, Fraksi Partai Politik, Daerah Pemilihan (Dapil I s/d VII), dan Penugasan Komisi/AKD.',
    '• Fitur CRUD (Tambah, Edit, Hapus) tersedia khusus untuk Administrator sistem.',
    '• Integrasi langsung dengan daftar hadir rapat otomatis dan sistem notifikasi.',
    '',
    '7.2 Direktori Pejabat & Kepala OPD Pemprov Sulawesi Barat 2026:',
    '• Memuat data Sekretaris Daerah, Para Asisten Setda, Inspektur Daerah, dan 26 Kepala Dinas/Badan/Biro.',
    '• Menjadi referensi otomatis saat memilih target penugasan RDP dan OPD pengampu naskah Ranperda.',
  ];

  bab7Content.forEach((line) => {
    if (line === '') {
      y += 2.5;
    } else {
      const isHeader = line.startsWith('7.');
      doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
      doc.setTextColor(isHeader ? 15 : 51, isHeader ? 23 : 65, isHeader ? 42 : 85);
      const split = doc.splitTextToSize(line, contentWidth);
      doc.text(split, margin, y);
      y += split.length * 4.2;
    }
  });

  // ==========================================
  // PAGE 10: BAB 8 - DATABASE, GITHUB & FAQ
  // ==========================================
  doc.addPage();
  currentPage++;
  addHeaderFooter('BAB 8 — DATABASE SUPABASE, GITHUB & PANDUAN FAQ');

  y = 25;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('BAB 8: DATABASE SUPABASE, GITHUB & TROUBLESHOOTING', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const bab8Content = [
    '8.1 Integrasi Database Supabase PostgreSQL 17 (Khusus Admin):',
    '• Fitur Supabase DB dan monitoring koneksi database PostgreSQL 17 hanya dapat dilihat dan diakses oleh akun Administrator demi keamanan data SPBE.',
    '• Menampilkan status koneksi realtime, latency ms, dan statistik jumlah baris data di tabel.',
    '',
    '8.2 Deploy Otomatis Melalui GitHub Repositori (Khusus Admin):',
    '• Terhubung langsung ke repositori resmi: https://github.com/digidewan-sulbar/--Parlemen-AI (branch main).',
    '• Tombol "Deploy GitHub" eksklusif hanya terlihat untuk akun Administrator guna mencegah perubahan tanpa otorisasi.',
    '',
    '8.3 Tanya Jawab Sering Diajukan (FAQ & Troubleshooting):',
    '• Q: Mengapa suara mikrofon tidak terbaca saat rekaman risalah?',
    '  A: Pastikan izin mikrofon peramban (browser microphone permission) disetel ke "Allow / Izinkan".',
    '• Q: Apakah data risalah tersimpan aman jika jaringan internet terputus?',
    '  A: Ya, sistem memiliki mekanisme fallback cache lokal otomatis dan akan menyinkronkan kembali ke Supabase saat daring.',
    '• Q: Bagaimana cara mencetak risalah dalam format tata naskah resmi?',
    '  A: Klik kartu risalah terkait, lalu tekan tombol "Pratinjau PDF" di dalam modul risalah.',
    '',
    'LAYANAN BANTUAN HELPDESK:',
    'Bagian Persidangan & TI Sekretariat DPRD Provinsi Sulawesi Barat',
    'Email: sekretariat@dprd.sulbarprov.go.id • Hotline WhatsApp: 0811-420-2026',
  ];

  bab8Content.forEach((line) => {
    if (line === '') {
      y += 2.5;
    } else {
      const isHeader = line.startsWith('8.') || line.startsWith('LAYANAN');
      doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
      doc.setTextColor(isHeader ? 15 : 51, isHeader ? 23 : 65, isHeader ? 42 : 85);
      const split = doc.splitTextToSize(line, contentWidth);
      doc.text(split, margin, y);
      y += split.length * 4.2;
    }
  });

  // End of doc: Trigger file download
  doc.save('Buku_Panduan_E-Parlemen_Sulbar_2026.pdf');
}
