import React, { useState } from 'react';
import {
  BookOpen,
  X,
  Download,
  Printer,
  Search,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Users,
  Building2,
  Database,
  GitBranch,
  Sparkles,
  HelpCircle,
  Clock,
  Layers,
  Megaphone,
  UserCheck,
  Lock,
  ExternalLink,
  Bookmark,
  Share2,
} from 'lucide-react';
import { generateEbookPdf } from '../utils/ebookPdfGenerator';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface Chapter {
  id: string;
  bab: string;
  title: string;
  icon: any;
  tag: string;
  tagColor: string;
  readTime: string;
  sections: {
    heading: string;
    description: string;
    steps?: string[];
    roleAccess?: string[];
    tips?: string;
  }[];
}

const CHAPTERS: Chapter[] = [
  {
    id: 'bab-1',
    bab: 'BAB 1',
    title: 'Gambaran Umum, Visi & Trilogi Layanan Parlemen',
    icon: Sparkles,
    tag: 'Arsitektur SPBE',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    readTime: '3 Menit',
    sections: [
      {
        heading: '1.1 Pengantar & Latar Belakang Digitalisasi',
        description:
          'E-Parlemen DPRD Provinsi Sulawesi Barat v2.4 AI Core adalah sistem tata kelola persidangan dan fasilitasi kedewanan berbasis Sistem Pemerintahan Berbasis Elektronik (SPBE) sesuai amanat Perpres No. 95 Tahun 2018. Aplikasi ini mengintegrasikan kecerdasan artifisial terkini untuk mempercepat administrasi legislatif, mencegah keterlambatan pembahasan regulasi, dan memperluas transparansi kepada masyarakat.',
      },
      {
        heading: '1.2 Konsep Trilogi Layanan Parlemen',
        description:
          'Sistem ini mengonsolidasikan 3 pilar layanan utama Sekretariat DPRD:',
        steps: [
          'Pilar 1 - Persidangan & Risalah Legislasi: Manajemen 10 kategori rapat resmi, transkripsi suara-ke-teks otomatis, analisis sentimen perdebatan sidang, pengawasan SLA 7 tahapan Ranperda, dan e-tracking rekomendasi RDP.',
          'Pilar 2 - Fasilitasi Pimpinan: Sinkronisasi kalender terpadu Ketua dan 3 Wakil Ketua DPRD, Executive Summary (One-Pager Briefing) instan oleh AI sebelum sidang paripurna, dan penelusuran disposisi arahan pimpinan.',
          'Pilar 3 - Kehumasan & Publikasi: Otomasi pembuatan Siaran Pers jurnalistik 5W+1H dari transkrip persidangan, publikasi multi-kanal ke media massa dan portal publik, serta monitoring opini masyarakat.',
        ],
      },
      {
        heading: '1.3 Arsitektur Cloud & Keamanan Data',
        description:
          'Aplikasi beroperasi di atas stack teknologi modern: React 19 + TypeScript, Tailwind CSS, didukung backend database PostgreSQL 17 via Supabase Cloud Engine, hosting berkinerja tinggi, dan repositori terkelola di GitHub (--Parlemen-AI).',
        tips: 'Semua berkas audio dan data notulensi tersimpan dengan enkripsi data-at-rest dan terhubung langsung ke sistem pencadangan otomatis.',
      },
    ],
  },
  {
    id: 'bab-2',
    bab: 'BAB 2',
    title: 'Akses Sistem, Manajemen Akun & 3 Level Pengguna',
    icon: Lock,
    tag: 'Autentikasi',
    tagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    readTime: '4 Menit',
    sections: [
      {
        heading: '2.1 Tiga Level Hak Akses Pengguna',
        description:
          'Aplikasi dirancang dengan sistem Role-Based Access Control (RBAC) yang ketat guna memastikan setiap pejabat dan operator menjalankan tugas sesuai tugas pokok dan fungsinya:',
        roleAccess: [
          'Level 1: Administrator (User: admin | Pass: admin.321) — Memiliki kendali menyeluruh atas konfigurasi sistem, database Supabase PostgreSQL, sinkronisasi deploy GitHub, manajemen 45 anggota dewan dan pejabat OPD, serta perbaikan data error.',
          'Level 2: Kepala Bagian / Kabag (User: kabag | Pass: kabag.321) — Berwenang memvalidasi risalah rapat sebelum dipublikasikan, memantau batas waktu SLA Ranperda, mengesahkan rekomendasi RDP, mengelola agenda pimpinan, dan menyetujui rilis pers humas.',
          'Level 3: Operator Sidang (User: operator | Pass: op.321) — Berperan langsung di ruang sidang untuk merekam audio rapat, mengunggah rekaman suara, menjalankan transkripsi AI, memeriksa keabsahan teks notulensi, dan menginput dokumen hasil sidang.',
        ],
      },
      {
        heading: '2.2 Langkah Demi Langkah Masuk ke Aplikasi',
        description:
          'Untuk masuk ke dalam sistem, ikuti tahapan resmi berikut:',
        steps: [
          'Langkah 1: Akses alamat aplikasi E-Parlemen DPRD Sulbar di peramban web.',
          'Langkah 2: Pada kotak masuk, ketik Nama Pengguna (Username) dan Kata Sandi (Password) Anda.',
          'Langkah 3: Anda juga dapat menggunakan tombol jalan pintas cepat (Chip Akun Cepat) untuk pengujian peran.',
          'Langkah 4: Centang opsi "Ingat Sesi Masuk" bila menggunakan komputer dinas pribadi.',
          'Langkah 5: Klik tombol biru/hijau "Masuk ke Sistem E-Parlemen". Sistem akan memverifikasi kredensial dan membuka antarmuka kerja Anda.',
        ],
        tips: 'Bila ingin berpindah akun atau selesai bertugas di komputer umum, selalu klik avatar profil di pojok kanan atas lalu pilih "Keluar / Logout".',
      },
    ],
  },
  {
    id: 'bab-3',
    bab: 'BAB 3',
    title: 'Pilar 1: Modul Risalah Rapat AI & 10 Kategori Rapat Resmi',
    icon: FileText,
    tag: 'Core Risalah',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    readTime: '5 Menit',
    sections: [
      {
        heading: '3.1 Pengenalan 10 Kategori Rapat Resmi DPRD Sulbar',
        description:
          'E-Parlemen mengakomodasi seluruh forum persidangan legislatif resmi Sulawesi Barat, meliputi:',
        steps: [
          '1. Rapat Banggar (Badan Anggaran): Forum pembahasan KUA-PPAS, RAPBD Induk, dan Perubahan APBD Provinsi Sulawesi Barat.',
          '2. Rapat BK (Badan Kehormatan): Penegakan kode etik kedewanan dan tindak lanjut laporan tata beracara dewan.',
          '3. Rapat Bapemperda: Perumusan naskah dan evaluasi Program Pembentukan Peraturan Daerah.',
          '4. Rapat Pimpinan: Rapat koordinasi tertutup Ketua dan ketiga Wakil Ketua DPRD Sulbar.',
          '5. Rapat Pimpinan di Perluas: Rapat konsultasi pimpinan dewan bersama pimpinan seluruh Fraksi dan Komisi.',
          '6. Rapat Sekretariat DPRD: Rapat internal aparatur sekretariat untuk penguatan fasilitasi teknis kedewanan.',
          '7. Rapat Komisi I: Bidang Pemerintahan, Keamanan, Ketertiban, Hukum, dan Aparatur Sipil Negara.',
          '8. Rapat Komisi II: Bidang Perekonomian, Keuangan Daerah, Pertanian, Perkebunan, dan Maritim.',
          '9. Rapat Komisi III: Bidang Pembangunan Infrastruktur, Pekerjaan Umum, Energi, dan Lingkungan Hidup.',
          '10. Rapat Komisi IV: Bidang Kesejahteraan Rakyat, Pendidikan, Kesehatan, Ketenagakerjaan, dan Sosial.',
        ],
      },
      {
        heading: '3.2 Alur 4 Tahap Pengerjaan Risalah Berbasis AI',
        description:
          'Proses digitalisasi risalah rapat berjalan dalam 4 tahap sistematis:',
        steps: [
          'Tahap 1: Perekaman Audio / Input Kasar — Operator menyalakan fitur perekam suara langsung atau mengunggah rekaman berkas (MP3/WAV/M4A). Daftar peserta hadir otomatis tersinkron dengan 45 anggota dewan dan OPD terkait.',
          'Tahap 2: Transkripsi Suara-ke-Teks AI — Model AI mengenali pembicara (diarization), memberi tanda waktu (timestamp), dan mengubah suara menjadi transkrip akurat.',
          'Tahap 3: Olah & Standardisasi Bahasa Baku AI — Kecerdasan buatan menyempurnakan bahasa lisan menjadi kalimat formal sesuai Pedoman Umum Ejaan Bahasa Indonesia (PUEBI) dan tata naskah dinas.',
          'Tahap 4: Risalah Final & Rekomendasi Resmi — Dokumen risalah siap diunduh dalam format kop surat resmi DPRD Sulawesi Barat berstandar cetak A4.',
        ],
        tips: 'Gunakan mikrofon eksternal atau output audio mixer ruang sidang untuk menghasilkan rekaman jernih dan meminimalkan kebisingan latar.',
      },
      {
        heading: '3.3 Analisis Sentimen & Dinamika Sidang',
        description:
          'Sistem otomatis memetakan proporsi pernyataan fraksi dan peserta rapat ke dalam 4 kategori sentimen: Positif (Apresiasi/Dukungan), Negatif (Kritik/Evaluasi Keras), Netral (Pemaparan Data/Laporan), dan Perdebatan/Kritis (Silang Pendapat Kebijakan).',
      },
      {
        heading: '3.4 Pratinjau & Cetak Dokumen Risalah Format Kop Resmi',
        description:
          'Setiap risalah rapat dilengkapi tombol "Pratinjau PDF". Klik tombol tersebut untuk melihat dokumen lengkap berkop Garuda / Lambang DPRD Sulbar, nomor risalah, dasar pelaksanaan, daftar pembicara, kesimpulan rapat, dan kolom tanda tangan pimpinan/sekretaris dewan.',
      },
    ],
  },
  {
    id: 'bab-4',
    bab: 'BAB 4',
    title: 'Pilar 1: Pelacakan E-Legislasi (Ranperda) & E-Tracking RDP',
    icon: Clock,
    tag: 'SLA & Pengawasan',
    tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    readTime: '4 Menit',
    sections: [
      {
        heading: '4.1 Manajemen 7 Tahapan Ranperda',
        description:
          'Setiap Rancangan Peraturan Daerah (Ranperda) yang diinisiasi oleh DPRD (Komisi/Bapemperda) maupun Pemprov Sulbar dipantau melalui 7 tahapan berurutan:',
        steps: [
          'Tahap 1: Naskah Akademik (Kajian ilmiah, naskah riset)',
          'Tahap 2: Draf Ranperda (Penyusunan pasal-pasal batang tubuh)',
          'Tahap 3: Pembahasan Propemperda (Penjadwalan prioritas tahunan)',
          'Tahap 4: Rapat Paripurna / Pembahasan Komisi (Tanggapan fraksi & jawaban eksekutif)',
          'Tahap 5: Fasilitasi Kemendagri (Sinkronisasi regulasi nasional)',
          'Tahap 6: Persetujuan Bersama DPRD dan Gubernur Sulbar',
          'Tahap 7: Pengundangan Lembaran Daerah menjadi Perda Definitif',
        ],
      },
      {
        heading: '4.2 Early Warning System & Service Level Agreement (SLA)',
        description:
          'Untuk menghindari keterlambatan pembahasan perda, sistem memasang indikator SLA pada setiap Ranperda:',
        steps: [
          'Sesuai SLA (Hijau): Waktu pembahasan masih dalam batas aman target hari.',
          'Mendekati Tenggat (Kuning): Waktu tersisa tinggal 5 hari kerja, sistem memicu notifikasi peringatan.',
          'Melebihi SLA (Merah Alert): Telah melewati batas waktu toleransi, memicu alert prioritas kepada Kabag dan Pimpinan Badan Pembentukan Perda.',
        ],
        tips: 'Klik "Perbarui Tahapan" untuk menaikkan progres Ranperda ke tahap berikutnya saat rapat pembahasan telah selesai dilaksanakan.',
      },
      {
        heading: '4.3 E-Tracking Rekomendasi Rapat Dengar Pendapat (RDP)',
        description:
          'Modul ini mengawasi tindak lanjut rekomendasi hasil RDP terhadap Kepala Dinas dan Badan Pemprov Sulbar. Memuat target tanggal penyelesaian, instansi penanggung jawab, dan status: Selesai, Sedang Berjalan, atau Belum Ditindaklanjuti disertai unggahan dokumen bukti fisik.',
      },
    ],
  },
  {
    id: 'bab-5',
    bab: 'BAB 5',
    title: 'Pilar 2: Fasilitasi Pimpinan & Executive Summary AI',
    icon: UserCheck,
    tag: 'Executive Core',
    tagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    readTime: '3 Menit',
    sections: [
      {
        heading: '5.1 Kalender Terpadu Pimpinan DPRD',
        description:
          'Menyajikan jadwal terkoordinasi antara Ketua DPRD, Wakil Ketua I, Wakil Ketua II, dan Wakil Ketua III. Fitur ini memastikan tidak ada benturan agenda rapat Forkopimda, sidang paripurna, maupun penugasan dinas luar daerah.',
      },
      {
        heading: '5.2 Executive Summary AI (One-Pager Briefing)',
        description:
          'Fitur andalan bagi pimpinan sebelum memimpin sidang atau pertemuan penting:',
        steps: [
          'AI mengekstrak inti pembicaraan, substansi pokok sengketa, dan rekomendasi teknis menjadi ringkasan 1 halaman.',
          'Menampilkan sikap dan dinamika per fraksi dewan secara ringkas.',
          'Menyediakan poin-poin panduan keputusan (talking points) yang siap dibacakan oleh Ketua Sidang.',
        ],
      },
      {
        heading: '5.3 Manajemen Disposisi & Instruksi Pimpinan',
        description:
          'Pimpinan dewan dapat menerbitkan disposisi elektronik langsung ke komisi pengampu atau sekretaris dewan dengan pelacakan status tindak lanjut secara seketika.',
      },
    ],
  },
  {
    id: 'bab-6',
    bab: 'BAB 6',
    title: 'Pilar 3: Humas, Protokol & AI Press Release Generator',
    icon: Megaphone,
    tag: 'Kehumasan',
    tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    readTime: '3 Menit',
    sections: [
      {
        heading: '6.1 AI Press Release Generator Multi-Kanal',
        description:
          'Mengatasi keterlambatan publikasi berita sidang dengan kecerdasan buatan:',
        steps: [
          'Langkah 1: Pilih risalah rapat atau topik sidang yang ingin dipublikasikan.',
          'Langkah 2: Klik tombol "Generate Siaran Pers AI". AI menyusun naskah berita format jurnalistik 5W+1H (What, Who, When, Where, Why, How).',
          'Langkah 3: Periksa kutipan narasumber pimpinan sidang dan sesuaikan bila diperlukan.',
          'Langkah 4: Klik "Salin Naskah Rilis" atau "Publikasikan ke Portal" untuk mendistribusikan materi ke media center, medsos Instagram, dan siaran pers WhatsApp rekan jurnalis.',
        ],
      },
      {
        heading: '6.2 Monitoring Opini Publik & Respon Masyarakat',
        description:
          'Menyediakan dashboard pelacakan umpan balik masyarakat atas peraturan daerah yang disahkan dan keterbukaan informasi publik DPRD Sulbar.',
      },
    ],
  },
  {
    id: 'bab-7',
    bab: 'BAB 7',
    title: 'Direktori 45 Anggota DPRD & Pejabat Pemprov Sulbar 2026',
    icon: Users,
    tag: 'Master Data',
    tagColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    readTime: '3 Menit',
    sections: [
      {
        heading: '7.1 Direktori 45 Anggota & Pimpinan DPRD Sulbar',
        description:
          'Menyimpan basis data komprehensif seluruh 45 wakil rakyat DPRD Provinsi Sulawesi Barat periode berjalan:',
        steps: [
          'Memuat: Nama Lengkap, Gelar, Partai Politik, Fraksi, Daerah Pemilihan (Dapil I s/d VII), dan Jabatan AKD (Komisi/Banggar/BK/Bapemperda).',
          'Administrator dapat menambah anggota baru, mengedit data penugasan, atau memperbarui informasi profil anggota.',
          'Terhubung langsung dengan fitur daftar hadir rapat dan pencarian global.',
        ],
      },
      {
        heading: '7.2 Direktori Pejabat & Kepala OPD Pemprov Sulbar 2026',
        description:
          'Menyediakan data kontak dan jabatan Sekretaris Daerah, para Asisten Setda, Inspektur Daerah, dan 26 Kepala Dinas/Badan/Biro lingkungan Pemerintah Provinsi Sulawesi Barat sebagai rujukan tindak lanjut RDP dan kemitraan komisi.',
      },
    ],
  },
  {
    id: 'bab-8',
    bab: 'BAB 8',
    title: 'Manajemen Supabase Database, Deploy GitHub & Troubleshooting',
    icon: Database,
    tag: 'Teknis & Support',
    tagColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    readTime: '4 Menit',
    sections: [
      {
        heading: '8.1 Database Supabase PostgreSQL 17',
        description:
          'Data aplikasi disimpan secara terpusat pada Supabase PostgreSQL 17. Pengaturan koneksi tersimpan aman di server dan dapat dipantau melalui tombol "Supabase DB" di navigasi atas.',
        tips: 'Klik "Sinkronkan Ulang Data" di modal Supabase DB untuk menarik pembaruan terkini jika terjadi kendala jaringan.',
      },
      {
        heading: '8.2 Deploy Otomatis ke GitHub (--Parlemen-AI)',
        description:
          'Setiap pembaruan fitur dapat langsung dideploy ke repositori GitHub resmi https://github.com/digidewan-sulbar/--Parlemen-AI pada branch main melalui tombol "Deploy GitHub".',
      },
      {
        heading: '8.3 Pertanyaan Sering Diajukan (FAQ & Solusi Masalah)',
        description:
          'Daftar jawaban atas pertanyaan dan kendala yang kerap dihadapi saat pengoperasian aplikasi sehari-hari:',
        steps: [
          'T: Mikrofon tidak merekam saat mengklik Mulai Rekam?\nJ: Periksa izin peramban (Browser Permission) di sebelah kiri bilah URL, ubah Microphone ke "Allow / Izinkan".',
          'T: Lupa kata sandi akun Operator atau Kabag?\nJ: Hubungi Administrator sistem (user: admin) untuk menyetel ulang kata sandi melalui panel kendali.',
          'T: Bagaimana cara mengunduh buku panduan ini dalam format PDF?\nJ: Klik tombol "Unduh PDF Resmi" di pojok kanan atas modal ini, atau klik tombol "Cetak / Save As PDF" untuk pratinjau cetak langsung.',
        ],
      },
    ],
  },
];

export const BukuPanduanModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeChapterId, setActiveChapterId] = useState<string>('bab-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentChapterIndex = CHAPTERS.findIndex((c) => c.id === activeChapterId);
  const currentChapter = CHAPTERS[currentChapterIndex] || CHAPTERS[0];

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      generateEbookPdf();
    } catch (err) {
      console.error('Gagal generate PDF:', err);
    } finally {
      setTimeout(() => setIsGeneratingPdf(false), 800);
    }
  };

  const handlePrintView = () => {
    window.print();
  };

  const handleCopyChapterSummary = () => {
    const text = `=== ${currentChapter.bab}: ${currentChapter.title} ===\n\n` +
      currentChapter.sections
        .map((s) => `${s.heading}\n${s.description}\n${s.steps ? s.steps.join('\n') : ''}`)
        .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Filter chapters based on search query
  const filteredChapters = CHAPTERS.filter((chap) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchTitle = chap.title.toLowerCase().includes(query) || chap.bab.toLowerCase().includes(query);
    const matchSection = chap.sections.some(
      (s) =>
        s.heading.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        (s.steps && s.steps.some((st) => st.toLowerCase().includes(query)))
    );
    return matchTitle || matchSection;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl text-slate-100 shadow-2xl overflow-hidden my-auto flex flex-col h-[92vh]">
        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shadow-md shadow-emerald-950/50">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-slate-100">
                  Buku Panduan & Manual E-Book
                </h3>
                <span className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/40 uppercase tracking-wider">
                  Edisi 2026 v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Panduan Operasional Lengkap Seluruh Halaman, Menu & Fitur E-Parlemen AI DPRD Sulbar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 active:scale-95 cursor-pointer disabled:opacity-60"
              title="Unduh Buku Manual format PDF Resmi (10 Halaman Lengkap)"
            >
              <Download className={`w-4 h-4 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">
                {isGeneratingPdf ? 'Memproses PDF...' : 'Unduh E-Book (PDF)'}
              </span>
              <span className="sm:hidden">PDF</span>
            </button>

            {/* Print View Button */}
            <button
              onClick={handlePrintView}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 transition flex items-center gap-1.5 active:scale-95 cursor-pointer hidden md:flex"
              title="Cetak atau Simpan Halaman ke PDF Browser"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>Cetak / Print</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Breadcrumb Bar */}
        <div className="bg-slate-950/60 border-b border-slate-800/80 px-5 py-2.5 flex items-center justify-between gap-4 flex-wrap flex-shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari fitur, menu, bab, kata kunci (misal: risalah, banggar, login, sla)..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500/70"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="hidden sm:inline">
              Membaca: <strong className="text-emerald-400">{currentChapter.bab}</strong> — {currentChapter.title}
            </span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
              Bab {currentChapterIndex + 1} dari {CHAPTERS.length}
            </span>
          </div>
        </div>

        {/* Modal Main Body (Sidebar + Content) */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Table of Contents */}
          <div className="w-72 sm:w-80 border-r border-slate-800 bg-slate-950/90 overflow-y-auto flex-shrink-0 p-3 space-y-1.5 scrollbar-thin">
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Daftar Isi E-Book</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                8 Bab
              </span>
            </div>

            {filteredChapters.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                Tidak ditemukan bab yang sesuai dengan kata kunci "{searchQuery}".
              </div>
            ) : (
              filteredChapters.map((chap) => {
                const IconComponent = chap.icon;
                const isActive = chap.id === activeChapterId;
                return (
                  <button
                    key={chap.id}
                    onClick={() => setActiveChapterId(chap.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer flex items-start gap-3 border ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-950/60 to-slate-900 border-emerald-500/60 shadow-md shadow-emerald-950/40 text-emerald-200'
                        : 'bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700 text-slate-300 border-transparent'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                        isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                          {chap.bab}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {chap.readTime}
                        </span>
                      </div>
                      <p className="text-xs font-semibold leading-tight line-clamp-2">
                        {chap.title}
                      </p>
                      <span
                        className={`inline-block mt-1 text-[9px] font-medium px-1.5 py-0.2 rounded border ${chap.tagColor}`}
                      >
                        {chap.tag}
                      </span>
                    </div>
                  </button>
                );
              })
            )}

            {/* Quick Helper Download Box inside TOC */}
            <div className="mt-4 p-3 bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-xl text-center">
              <p className="text-xs font-bold text-slate-200 mb-1">
                Butuh Dokumen Fisik / Arsip?
              </p>
              <p className="text-[11px] text-slate-400 mb-2.5">
                Unduh buku ini dalam format PDF lengkap dengan nomor halaman dan tata letak resmi.
              </p>
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF (10 Halaman)</span>
              </button>
            </div>
          </div>

          {/* Chapter Content Reader View */}
          <div className="flex-1 overflow-y-auto bg-slate-900/40 p-4 sm:p-8 space-y-6">
            {/* Chapter Header Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs px-2.5 py-1 rounded-md border border-emerald-500/40 font-mono">
                    {currentChapter.bab}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${currentChapter.tagColor}`}
                  >
                    {currentChapter.tag}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyChapterSummary}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                    title="Salin isi bab ke clipboard"
                  >
                    <Share2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{copiedNotification ? 'Tersalin!' : 'Salin Teks Bab'}</span>
                  </button>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
                {currentChapter.title}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>Dokumentasi Standar Operasional Prosedur (SOP) Digital DPRD Sulbar</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Clock className="w-3 h-3" />
                  Estimasi Baca: {currentChapter.readTime}
                </span>
              </p>
            </div>

            {/* Chapter Sections */}
            <div className="space-y-6">
              {currentChapter.sections.map((section, sIdx) => (
                <div
                  key={sIdx}
                  className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-lg hover:border-slate-700/80 transition"
                >
                  <h3 className="text-base sm:text-lg font-bold text-emerald-300 mb-2.5 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{section.heading}</span>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {section.description}
                  </p>

                  {/* Step-by-Step Flow List if present */}
                  {section.steps && (
                    <div className="space-y-2 mt-3 mb-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
                      <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                        Langkah Operasional Fitur:
                      </p>
                      {section.steps.map((st, stIdx) => (
                        <div key={stIdx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-normal">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {stIdx + 1}
                          </span>
                          <span className="flex-1 whitespace-pre-line">{st}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Role Access Matrix if present */}
                  {section.roleAccess && (
                    <div className="space-y-2.5 mt-3 mb-4">
                      {section.roleAccess.map((ra, raIdx) => (
                        <div
                          key={raIdx}
                          className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl text-xs text-slate-300 flex items-start gap-2.5"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{ra}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tips Card if present */}
                  {section.tips && (
                    <div className="bg-amber-950/30 border border-amber-600/40 p-3.5 rounded-xl text-xs text-amber-200/90 flex items-start gap-2.5 mt-3">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300 shrink-0 uppercase">
                        Tip Praktis
                      </span>
                      <span>{section.tips}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Chapter Switcher Navigation */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4 flex-wrap">
              <button
                disabled={currentChapterIndex === 0}
                onClick={() => {
                  if (currentChapterIndex > 0) {
                    setActiveChapterId(CHAPTERS[currentChapterIndex - 1].id);
                  }
                }}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Bab Sebelumnya</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh E-Book PDF Lengkap</span>
                </button>
              </div>

              <button
                disabled={currentChapterIndex === CHAPTERS.length - 1}
                onClick={() => {
                  if (currentChapterIndex < CHAPTERS.length - 1) {
                    setActiveChapterId(CHAPTERS[currentChapterIndex + 1].id);
                  }
                }}
                className="px-4 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 disabled:opacity-40 text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-700/60 transition flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Bab Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
