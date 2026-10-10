import React, { useState } from 'react';
import { EvidenceItem } from '../types';
import {
  Layers,
  FileCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  ShieldCheck,
  Check,
  Clock,
  Sparkles,
  Award,
  ExternalLink,
} from 'lucide-react';

interface Props {
  evidences: EvidenceItem[];
}

export const PillarSpbeBlueprint: React.FC<Props> = ({ evidences }) => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'timeline' | 'evidences'>('blueprint');

  return (
    <div className="space-y-6">
      {/* Pillar Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-slate-900 border border-amber-800/40 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/30 mb-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              DOKUMEN CETAK BIRU & EVIDENCES DIKLAT PIM III
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100">
              E-Parlemen Sulbar: Arsitektur SPBE & Matriks Proyek Perubahan
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl">
              Proyek Perubahan Pelatihan Kepemimpinan Administrator (PIM III) Sekretariat DPRD Provinsi Sulawesi Barat — Periode Implementasi: 10 Agustus 2026 s.d. 3 Oktober 2026 (60 Hari / 8 Minggu / 40 Hari Kerja).
            </p>
          </div>

          <div className="bg-amber-950/80 border border-amber-800 px-4 py-2.5 rounded-xl text-center text-amber-300 font-mono text-xs">
            <span className="block text-[10px] text-amber-400 font-semibold uppercase">Project Leader</span>
            <span className="font-bold text-white text-xs">Kabag Persidangan, Perundang-Undangan & Kehumasan</span>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-800/80 mt-6 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'blueprint'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Matriks Arsitektur SPBE Sulbar</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'timeline'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Breakdown Timeline 60 Hari (Minggu 1-8)</span>
          </button>

          <button
            onClick={() => setActiveTab('evidences')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'evidences'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Bukti Fisik (Evidences) Evaluasi Diklat</span>
            <span className="bg-slate-900/40 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {evidences.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: BLUEPRINT SPBE MATRIX */}
      {activeTab === 'blueprint' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">
                II. ARSITEKTUR & DETAIL TEKNIS MODUL E-PARLEMEN SULBAR
              </h3>
              <p className="text-xs text-slate-400">
                Penyelarasan Arsitektur Data & Interoperabilitas SPBE Provinsi Sulawesi Barat
              </p>
            </div>
            <span className="text-xs bg-emerald-950 text-emerald-300 px-3 py-1 rounded-full border border-emerald-800 font-bold">
              Standard SPBE Perpres 95/2018
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                1. Pilar Layanan Persidangan (Core Engine)
              </span>
              <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside">
                <li><strong className="text-slate-100">E-Legislasi:</strong> Tracking 7 tahapan Ranperda (NA s.d. Pengundangan) dilengkapi WhatsApp/Email alert jika melebihi SLA.</li>
                <li><strong className="text-slate-100">E-Risalah AI:</strong> Pengunggahan audio (.mp3/.m4a) ke Engine Speech-to-Text AI untuk draf risalah beserta timestamp.</li>
                <li><strong className="text-slate-100">E-Rekomendasi RDP:</strong> Portal login OPD mitra untuk upload bukti tindak lanjut rekomendasi RDP.</li>
              </ul>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase text-blue-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                2. Pilar Layanan Pimpinan (Executive Support)
              </span>
              <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside">
                <li><strong className="text-slate-100">Executive Dashboard Pimpinan:</strong> Visualisasi grafik real-time Ranperda aktif, penyelesaian risalah, & kepatuhan OPD.</li>
                <li><strong className="text-slate-100">E-Agenda & Disposisi Pimpinan:</strong> Pimpinan dapat melihat jadwal harian/mingguan & mengunduh bahan rapat PDF via mobile.</li>
                <li><strong className="text-slate-100">Executive Summary AI:</strong> Ringkasan 3 paragraf bahan keputusan pimpinan.</li>
              </ul>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase text-purple-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                3. Pilar Layanan Humas & Protokol (Kehumasan)
              </span>
              <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside">
                <li><strong className="text-slate-100">Humas Media Release Auto-Draft:</strong> Auto-generate rilis berita 300–400 kata dari resume risalah AI.</li>
                <li><strong className="text-slate-100">E-Protocol Briefing Sheet:</strong> Protocol Sheet menampilkan rundown, seating arrangement, & penanggung jawab acara.</li>
              </ul>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                4. Interoperabilitas Data SPBE Sulbar
              </span>
              <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside">
                <li><strong className="text-slate-100">API Gateway SPBE:</strong> Pertukaran data aman ke Portal SPBE Pemprov Sulbar, JDIH, dan e-Office/TNDE.</li>
                <li><strong className="text-slate-100">Satu Data Parlemen Sulbar:</strong> Repositori tunggal data persidangan, legislasi, dan pengawasan.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TIMELINE BREAKDOWN 60 HARI */}
      {activeTab === 'timeline' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white">
              IV. BREAKDOWN TIMELINE MILESTONE SKALA HARI DALAM MINGGU (10 AGUSTUS - 3 OKTOBER 2026)
            </h3>
            <p className="text-xs text-slate-400">
              Total 60 Hari Kalender / 40 Hari Kerja Pelaksanaan Proyek Perubahan Diklat PIM III
            </p>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin text-xs">
            {[
              {
                m: 'Minggu 1 (Tahap I)',
                tgl: '10 Ags 2026 – 15 Ags 2026',
                kegiatan: 'Konsultasi intensif dengan Mentor (Sekwan), Penyusunan draf SK Tim Efektif & SK Tim Teknis IT, Rapat koordinasi perdana.',
                output: 'SK Tim Efektif (Signed), Notulen Rapat Koor 1, Matriks Pembagian Tugas.',
              },
              {
                m: 'Minggu 2 (Tahap I)',
                tgl: '17 Ags 2026 – 22 Ags 2026',
                kegiatan: 'Audiensi dengan Diskominfo Sulbar untuk penyelarasan arsitektur SPBE, Penyusunan 3 Draf SOP baru (Ranperda, Risalah AI, Rekomendasi OPD).',
                output: 'Berita Acara Rapat SPBE, Draf SOP Layanan Digital, Spesifikasi Server SPBE.',
              },
              {
                m: 'Minggu 3 (Tahap II)',
                tgl: '24 Ags 2026 – 29 Ags 2026',
                kegiatan: 'Finalisasi Kamus Data & ERD Aplikasi, Desain Antarmuka (UI/UX) Dashboard Pimpinan & Admin, Setup repositori basis data.',
                output: 'Dokumen Desain Sistem, Prototype UI/UX.',
              },
              {
                m: 'Minggu 4 (Tahap II)',
                tgl: '31 Ags 2026 – 05 Sep 2026',
                kegiatan: 'Pengodingan Modul Tracking Ranperda, Integrasi API Engine Speech-to-Text AI untuk Risalah Rapat, Pengodingan Portal Form Input Rekomendasi OPD.',
                output: 'Source Code v0.5, Module Test Result (Persidangan).',
              },
              {
                m: 'Minggu 5 (Tahap II)',
                tgl: '07 Sep 2026 – 12 Sep 2026',
                kegiatan: 'Pengodingan Executive Dashboard Pimpinan, Pengodingan Modul Digital Protocol Sheet & Auto Press-Release, Penetapan hak akses RBAC 41 DPRD.',
                output: 'Prototype E-Parlemen v1.0 (Full Feature Running).',
              },
              {
                m: 'Minggu 6 (Tahap III)',
                tgl: '14 Sep 2026 – 19 Sep 2026',
                kegiatan: 'Simulasi penggunaan E-Risalah AI pada 1 Rapat Paripurna & 1 RDP Komisi, Uji input tindak lanjut oleh 3 OPD Percontohan (Pilot OPD).',
                output: 'Laporan Uji Coba Lapangan, SK Sekwan SOP E-Parlemen (Signed).',
              },
              {
                m: 'Minggu 7 (Tahap III)',
                tgl: '21 Sep 2026 – 26 Sep 2026',
                kegiatan: 'Bimtek Aplikasi untuk Staf Persidangan, Protokol, & Admin OPD Pemprov, Pengujian Keamanan Sistem (Vulnerability Testing) bersama Diskominfo.',
                output: 'Daftar Hadir & Notulen Bimtek, Laporan Hasil Security Check.',
              },
              {
                m: 'Minggu 8 (Tahap IV)',
                tgl: '28 Sep 2026 – 03 Okt 2026',
                kegiatan: 'Soft Launching E-Parlemen Sulbar oleh Pimpinan DPRD & Sekwan, Finalisasi Laporan Akhir Proyek Perubahan, Penyerahan Laporan Akhir ke Penguji/Coach.',
                output: 'Video Launching, Buku Laporan Akhir Prochan PIM III.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-amber-300 font-mono">{item.m}</span>
                  <span className="text-slate-400 font-mono">{item.tgl}</span>
                </div>
                <p className="text-slate-200"><strong className="text-slate-400">Kegiatan: </strong>{item.kegiatan}</p>
                <div className="text-[11px] text-emerald-400 bg-emerald-950/60 p-2 rounded border border-emerald-900/50">
                  <strong>Output / Evidence Fisik: </strong>{item.output}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EVIDENCES TABLE */}
      {activeTab === 'evidences' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">
                V. BUKTI FISIK (EVIDENCES) KEBUTUHAN EVALUASI DIKLAT PIM III
              </h3>
              <p className="text-xs text-slate-400">
                Instrumen Penilaian dan Evaluasi Pameran / Seminar Laboratorium Kepemimpinan
              </p>
            </div>

            <span className="text-xs bg-amber-950 text-amber-300 px-3 py-1 rounded-full border border-amber-800 font-bold">
              Status: Verified 100%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                  <th className="p-3">Kategori Evaluasi Diklat</th>
                  <th className="p-3">Rincian Bukti Fisik / Dokumen</th>
                  <th className="p-3">Format / Bentuk Fisik</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Akses Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {evidences.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-950/50 transition">
                    <td className="p-3 font-semibold text-amber-300">{ev.kategori}</td>
                    <td className="p-3 font-medium text-slate-100">{ev.namaBukti}</td>
                    <td className="p-3 font-mono text-slate-400">{ev.formatBentuk}</td>
                    <td className="p-3">
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        {ev.statusKelengkapan}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => alert(`Membuka berkas bukti fisik: ${ev.namaBukti}`)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] px-2.5 py-1 rounded border border-slate-700 inline-flex items-center gap-1 transition"
                      >
                        <ExternalLink className="w-3 h-3 text-amber-400" />
                        <span>Lihat File</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
