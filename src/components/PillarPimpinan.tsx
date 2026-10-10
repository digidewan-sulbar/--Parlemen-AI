import React, { useState } from 'react';
import {
  ExecutiveSummaryItem,
  AgendaPimpinanItem,
  RanperdaItem,
  RdpRecommendationItem,
  RisalahItem,
  AuthUser,
} from '../types';
import { SentimentAnalysisSummary } from './SentimentAnalysisSummary';
import { ExecutiveSummaryFormModal } from './forms/ExecutiveSummaryFormModal';
import { AgendaPimpinanFormModal } from './forms/AgendaPimpinanFormModal';
import {
  UserCheck,
  Sparkles,
  Download,
  Calendar,
  FileSpreadsheet,
  PieChart,
  TrendingUp,
  Award,
  Users,
  Building2,
  ChevronRight,
  Send,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Lock,
  ShieldCheck,
  Info,
} from 'lucide-react';

interface Props {
  executiveSummaries: ExecutiveSummaryItem[];
  agendaPimpinanList: AgendaPimpinanItem[];
  ranperdaList: RanperdaItem[];
  rdpRecommendations: RdpRecommendationItem[];
  risalahList: RisalahItem[];
  currentUser?: AuthUser | null;
  onAddExecutiveSummary?: (item: ExecutiveSummaryItem) => void;
  onUpdateExecutiveSummary?: (item: ExecutiveSummaryItem) => void;
  onDeleteExecutiveSummary?: (id: string) => void;
  onAddAgendaPimpinan?: (item: AgendaPimpinanItem) => void;
  onUpdateAgendaPimpinan?: (item: AgendaPimpinanItem) => void;
  onDeleteAgendaPimpinan?: (id: string) => void;
  onOpenAiStudio: () => void;
}

export const PillarPimpinan: React.FC<Props> = ({
  executiveSummaries,
  agendaPimpinanList,
  ranperdaList,
  rdpRecommendations,
  risalahList,
  currentUser,
  onAddExecutiveSummary,
  onUpdateExecutiveSummary,
  onDeleteExecutiveSummary,
  onAddAgendaPimpinan,
  onUpdateAgendaPimpinan,
  onDeleteAgendaPimpinan,
  onOpenAiStudio,
}) => {
  // Authorization check: only admin and kabag can create/edit leader agendas & disposisi
  const canDisposisi = currentUser?.role === 'admin' || currentUser?.role === 'kabag';

  const [selectedSummary, setSelectedSummary] = useState<ExecutiveSummaryItem | null>(
    executiveSummaries[0] || null
  );

  // Modal States
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  const [editingExecutive, setEditingExecutive] = useState<ExecutiveSummaryItem | null>(null);

  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState<AgendaPimpinanItem | null>(null);

  // Compute Metrics for Executive Dashboard
  const totalRanperda = ranperdaList.length;
  const completedRanperda = ranperdaList.filter((r) => r.tahapanKe >= 6).length;
  const totalRdpRecs = rdpRecommendations.length;
  const resolvedRdpRecs = rdpRecommendations.filter((r) => r.status === 'Selesai').length;
  const opdComplianceRate = totalRdpRecs > 0 ? Math.round((resolvedRdpRecs / totalRdpRecs) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Pillar Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 border border-blue-800/40 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-500/30 mb-2">
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              PILAR LAYANAN FASILITASI KEPEMIMPINAN (EXECUTIVE SUPPORT)
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100">
              Executive Dashboard & Sistem Pendukung Keputusan Pimpinan Terpadu
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl">
              Sistem pendukung keputusan bagi 41 Anggota & Pimpinan DPRD Sulbar. Menyajikan Executive Summary 3 Paragraf (Highlight Keputusan, Isu Krusial & Rekomendasi Langkah Pimpinan), Grafik Real-Time, serta E-Agenda & Disposisi Terpusat.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAiStudio}
              className="bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Generate Executive Summary AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Metric Cards for 41 DPRD Members & SPBE Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-100 shadow-md flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Melayani Anggota DPRD</span>
            <div className="text-xl font-extrabold text-white">41 Anggota</div>
            <span className="text-[10px] text-blue-400 font-mono">DPRD Prov. Sulawesi Barat</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-100 shadow-md flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Progres Ranperda Aktif</span>
            <div className="text-xl font-extrabold text-white">
              {completedRanperda} / {totalRanperda}
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">Tahap Harmonisasi/Perda</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-100 shadow-md flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Kepatuhan Tindak Lanjut OPD</span>
            <div className="text-xl font-extrabold text-white">{opdComplianceRate}%</div>
            <span className="text-[10px] text-purple-400 font-mono">
              {resolvedRdpRecs} dari {totalRdpRecs} Rekomendasi Selesai
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-100 shadow-md flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Risalah Rapat AI Selesai</span>
            <div className="text-xl font-extrabold text-white">{risalahList.length} Dokumen</div>
            <span className="text-[10px] text-amber-400 font-mono">Otomatisasi Transkripsi</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Modul 3 Executive Summary + E-Agenda & Disposisi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Modul 3 Executive Summary AI (Decision Support) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100">
                  MODUL 3: Ringkasan Eksekutif (Executive Summary AI)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Bahan Pengambilan Keputusan Pimpinan DPRD (Maksimal 3 Paragraf)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingExecutive(null);
                  setIsExecutiveModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Summary</span>
              </button>
            </div>
          </div>

          {selectedSummary ? (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1 relative">
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingExecutive(selectedSummary);
                      setIsExecutiveModalOpen(true);
                    }}
                    className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition border border-slate-700"
                    title="Edit Executive Summary"
                  >
                    <Edit className="w-3.5 h-3.5 text-blue-400" />
                  </button>
                  {onDeleteExecutiveSummary && (
                    <button
                      onClick={() => {
                        onDeleteExecutiveSummary(selectedSummary.id);
                        const rem = executiveSummaries.filter((s) => s.id !== selectedSummary.id);
                        setSelectedSummary(rem[0] || null);
                      }}
                      className="p-1 bg-slate-800 hover:bg-red-950 text-red-400 rounded transition border border-slate-700 hover:border-red-500/50"
                      title="Hapus Executive Summary"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">
                  Bahan Pengambilan Keputusan Pimpinan | Tgl: {selectedSummary.tanggalRapat}
                </span>
                <h4 className="font-bold text-base text-white pr-16">
                  {selectedSummary.judulDokumen}
                </h4>
              </div>

              {/* Paragraf 1: Highlight Keputusan */}
              <div className="bg-slate-950 border border-emerald-900/60 rounded-xl p-4 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Paragraf 1: Highlight Keputusan Persidangan</span>
                </div>
                <p className="text-slate-200 leading-relaxed font-normal">
                  {selectedSummary.paragraf1HighlightKeputusan}
                </p>
              </div>

              {/* Paragraf 2: Isu Krusial */}
              <div className="bg-slate-950 border border-amber-900/60 rounded-xl p-4 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                  <AlertCircle className="w-4 h-4" />
                  <span>Paragraf 2: Isu Krusial & Pokok Masalah</span>
                </div>
                <p className="text-slate-200 leading-relaxed font-normal">
                  {selectedSummary.paragraf2IsuKrusial}
                </p>
              </div>

              {/* Paragraf 3: Rekomendasi Langkah Pimpinan */}
              <div className="bg-slate-950 border border-blue-900/60 rounded-xl p-4 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-[11px]">
                  <UserCheck className="w-4 h-4" />
                  <span>Paragraf 3: Rekomendasi Langkah Pimpinan DPRD</span>
                </div>
                <p className="text-slate-200 leading-relaxed font-semibold">
                  {selectedSummary.paragraf3RekomendasiLangkahPimpinan}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                <span>Diformat khusus untuk Pimpinan DPRD & Sekwan Sulbar</span>
                <button
                  onClick={() => {
                    alert('Executive Summary disalin ke papan klip untuk bahan briefing pimpinan.');
                    navigator.clipboard.writeText(
                      `${selectedSummary.judulDokumen}\n\n1. HIGHLIGHT KEPUTUSAN:\n${selectedSummary.paragraf1HighlightKeputusan}\n\n2. ISU KRUSIAL:\n${selectedSummary.paragraf2IsuKrusial}\n\n3. REKOMENDASI PIMPINAN:\n${selectedSummary.paragraf3RekomendasiLangkahPimpinan}`
                    );
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  Salin Teks Briefing
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 p-8 rounded-xl text-center text-slate-400 text-xs">
              Belum ada Executive Summary. Klik "Generate Executive Summary AI" untuk memproses.
            </div>
          )}

          {/* Cross-Meeting Sentiment Analysis Module for Pimpinan */}
          <SentimentAnalysisSummary
            variant="executive-dashboard"
            risalahList={risalahList}
          />
        </div>

        {/* Right Column: E-Agenda & Disposisi Pimpinan */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-sm text-slate-100">
                E-Agenda & Disposisi Pimpinan DPRD
              </h3>
            </div>

            {canDisposisi ? (
              <button
                onClick={() => {
                  setEditingAgenda(null);
                  setIsAgendaModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Agenda & Disposisi</span>
              </button>
            ) : (
              <div
                className="flex items-center gap-1.5 bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs px-2.5 py-1 rounded-lg"
                title="Hak Disposisi hanya dimiliki oleh akun Pimpinan, Kabag, dan Admin"
              >
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px] font-semibold">Disposisi Pimpinan (Resmi)</span>
              </div>
            )}
          </div>

          {!canDisposisi && (
            <div className="bg-blue-950/30 border border-blue-800/50 rounded-xl p-2.5 text-[11px] text-blue-200 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Mode Tinjau Administratif Operator:</strong> Jadwal dan lembar disposisi pimpinan disajikan untuk koordinasi teknis dan fasilitasi keprotokolan. Penambahan agenda resmi dan pengesahan disposisi dibatasi khusus akun <strong>Admin</strong> dan <strong>Kabag</strong>.
              </span>
            </div>
          )}

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
            {agendaPimpinanList.map((agenda) => (
              <div
                key={agenda.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-blue-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {agenda.tanggalWaktu}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold ${
                        agenda.status === 'Sedang Berlangsung'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {agenda.status}
                    </span>

                    {canDisposisi ? (
                      <>
                        <button
                          onClick={() => {
                            setEditingAgenda(agenda);
                            setIsAgendaModalOpen(true);
                          }}
                          className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition border border-slate-700 ml-1"
                          title="Edit Agenda & Disposisi"
                        >
                          <Edit className="w-3.5 h-3.5 text-blue-400" />
                        </button>

                        {onDeleteAgendaPimpinan && (
                          <button
                            onClick={() => {
                              onDeleteAgendaPimpinan(agenda.id);
                            }}
                            className="p-1 bg-slate-800 hover:bg-red-950 text-red-400 rounded transition border border-slate-700 hover:border-red-500/50"
                            title="Hapus Agenda"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono italic px-1 flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5 text-blue-400" />
                        <span>Sah</span>
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="font-bold text-sm text-slate-100 leading-snug">
                  {agenda.namaKegiatan}
                </h4>

                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div>
                    <span className="text-slate-500 font-semibold">Lokasi: </span>
                    {agenda.lokasi}
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold">Pimpinan Bertugas: </span>
                    <span className="text-blue-300 font-medium">{agenda.pimpinanBertugas}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold">Catatan Disposisi: </span>
                    <p className="text-slate-200 italic bg-slate-900 p-2 rounded border border-slate-800 mt-1">
                      "{agenda.disposisiCatatan}"
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-slate-500 text-[10px]">Instansi: {agenda.instansiTerkait}</span>
                  <button
                    onClick={() => alert(`Unduh Bahan Rapat PDF: ${agenda.fileBahanPdfUrl}`)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1 transition"
                  >
                    <Download className="w-3 h-3 text-blue-400" />
                    <span>Bahan Rapat PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Modals for Data Input */}
      <ExecutiveSummaryFormModal
        isOpen={isExecutiveModalOpen}
        onClose={() => setIsExecutiveModalOpen(false)}
        onSave={(data) => {
          if (editingExecutive && onUpdateExecutiveSummary) {
            onUpdateExecutiveSummary(data);
            if (selectedSummary?.id === data.id) setSelectedSummary(data);
          } else if (onAddExecutiveSummary) {
            onAddExecutiveSummary(data);
            setSelectedSummary(data);
          }
        }}
        initialData={editingExecutive}
      />

      <AgendaPimpinanFormModal
        isOpen={isAgendaModalOpen}
        onClose={() => setIsAgendaModalOpen(false)}
        onSave={(data) => {
          if (editingAgenda && onUpdateAgendaPimpinan) {
            onUpdateAgendaPimpinan(data);
          } else if (onAddAgendaPimpinan) {
            onAddAgendaPimpinan(data);
          }
        }}
        initialData={editingAgenda}
      />
    </div>
  );
};
