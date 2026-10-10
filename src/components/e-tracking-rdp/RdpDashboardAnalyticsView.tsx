import React from 'react';
import { RdpRekomendasiExtended, OpdComplianceMetrics } from './rdpTypes';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  Building2,
  TrendingUp,
  Award,
  ShieldCheck,
  Zap,
  BarChart3,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface Props {
  dataList: RdpRekomendasiExtended[];
  onSelectRecommendation: (item: RdpRekomendasiExtended) => void;
  onOpenEvidencePortal: (item: RdpRekomendasiExtended) => void;
}

export const RdpDashboardAnalyticsView: React.FC<Props> = ({
  dataList,
  onSelectRecommendation,
  onOpenEvidencePortal,
}) => {
  // Metric Calculations
  const totalRdp = dataList.length;
  const draftCount = dataList.filter((d) => d.status === 'DRAFT').length;
  const dikirimCount = dataList.filter((d) => d.status === 'TERBIT_DIKIRIM').length;
  const prosesCount = dataList.filter((d) => d.status === 'DALAM_PROSES').length;
  const verifikasiCount = dataList.filter((d) => d.status === 'BUTUH_VERIFIKASI').length;
  const tuntasCount = dataList.filter((d) => d.status === 'TUNTAS').length;
  const overdueCount = dataList.filter((d) => d.status === 'OVERDUE').length;
  const dikembalikanCount = dataList.filter((d) => d.status === 'DIKEMBALIKAN').length;

  const tuntasPercentage = totalRdp > 0 ? Math.round((tuntasCount / totalRdp) * 100) : 0;

  // Build Rapor Kepatuhan OPD by grouping
  const opdGroupMap: { [opd: string]: RdpRekomendasiExtended[] } = {};
  dataList.forEach((item) => {
    if (!opdGroupMap[item.opdPenanggungJawab]) {
      opdGroupMap[item.opdPenanggungJawab] = [];
    }
    opdGroupMap[item.opdPenanggungJawab].push(item);
  });

  const opdMetrics: OpdComplianceMetrics[] = Object.keys(opdGroupMap).map((opdName) => {
    const items = opdGroupMap[opdName];
    const total = items.length;
    const tuntas = items.filter((i) => i.status === 'TUNTAS').length;
    const proses = items.filter((i) => i.status === 'DALAM_PROSES' || i.status === 'TERBIT_DIKIRIM').length;
    const overdue = items.filter((i) => i.status === 'OVERDUE').length;
    const verif = items.filter((i) => i.status === 'BUTUH_VERIFIKASI').length;

    // Score formula: (Tuntas * 100 + Verif * 80 + Proses * 50 - Overdue * 30) / Total
    let score = Math.round(((tuntas * 100 + verif * 80 + proses * 50 - overdue * 30) / (total * 100)) * 100);
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    return {
      opdName,
      totalRdp: total,
      tuntasCount: tuntas,
      dalamProsesCount: proses,
      overdueCount: overdue,
      butuhVerifikasiCount: verif,
      avgResponseDays: overdue > 0 ? 16 : tuntas > 0 ? 6 : 9,
      complianceScorePercent: score,
    };
  });

  // Sort by compliance score descending
  opdMetrics.sort((a, b) => b.complianceScorePercent - a.complianceScorePercent);

  // SLA Timer helper
  const calculateSlaTimer = (deadlineStr: string, status: string) => {
    if (status === 'TUNTAS') {
      return { text: 'SELESAI TUNTAS', color: 'bg-emerald-950 text-emerald-300 border-emerald-700/80', isOverdue: false };
    }
    const today = new Date('2026-08-08'); // Current system date benchmark
    const deadline = new Date(deadlineStr);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `TERLAMBAT ${Math.abs(diffDays)} HARI`,
        color: 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse font-bold',
        isOverdue: true,
      };
    } else if (diffDays <= 3) {
      return {
        text: `SISA ${diffDays} HARI (KRITIS)`,
        color: 'bg-amber-950 text-amber-300 border-amber-600/80 font-bold',
        isOverdue: false,
      };
    } else {
      return {
        text: `SISA ${diffDays} HARI KERJA`,
        color: 'bg-sky-950 text-sky-300 border-sky-700/80',
        isOverdue: false,
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Executive Dashboard */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-400" /> Pusat Kendali Eksekutif
              </span>
              <span className="text-slate-500 text-xs font-mono">Pemantauan Tenggat Waktu Langsung</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
              Dasbor Pemantauan Rekomendasi RDP DPRD
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Pemantauan alur tindak lanjut rekomendasi Rapat Dengar Pendapat Komisi I-IV, kepatuhan batas waktu (14 Hari Kerja), dan rapor respons instansi OPD Pemprov Sulbar.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center gap-4 shrink-0 shadow-inner">
            <div className="text-center px-2">
              <span className="text-xs text-slate-400 block font-medium">Tingkat Kepatuhan</span>
              <span className="text-2xl font-black text-emerald-400">{tuntasPercentage}%</span>
            </div>
            <div className="h-10 w-[1px] bg-slate-800" />
            <div className="text-center px-2">
              <span className="text-xs text-slate-400 block font-medium">Terlambat</span>
              <span className={`text-2xl font-black ${overdueCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                {overdueCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Lifecycle Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Terbit</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-slate-100">{totalRdp}</span>
            <Building2 className="w-5 h-5 text-slate-500" />
          </div>
          <span className="text-[10px] text-slate-500 block">Komisi I - IV DPRD</span>
        </div>

        <div className="bg-slate-950 border border-sky-800/40 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-sky-400 block tracking-wider">Terbit & WA</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-sky-300">{dikirimCount}</span>
            <Send className="w-5 h-5 text-sky-400" />
          </div>
          <span className="text-[10px] text-sky-500/80 block">Menunggu Dibuka</span>
        </div>

        <div className="bg-slate-950 border border-blue-800/40 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-blue-400 block tracking-wider">Dalam Proses</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-blue-300">{prosesCount}</span>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-[10px] text-blue-500/80 block">Dibuka OPD via Tautan</span>
        </div>

        <div className="bg-slate-950 border border-amber-800/40 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">Butuh Verifikasi</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-amber-300">{verifikasiCount}</span>
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-[10px] text-amber-500/80 block">Bukti Diunggah OPD</span>
        </div>

        <div className="bg-slate-950 border border-emerald-800/40 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">Tuntas</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-emerald-300">{tuntasCount}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-[10px] text-emerald-500/80 block">Disetujui Komisi</span>
        </div>

        <div className="bg-slate-950 border border-rose-800/40 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-rose-400 block tracking-wider">Terlambat</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-rose-300">{overdueCount}</span>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <span className="text-[10px] text-rose-500/80 block">Melewati 14 Hari</span>
        </div>

        <div className="bg-slate-950 border border-purple-800/40 rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-purple-400 block tracking-wider">Dikembalikan</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-purple-300">{dikembalikanCount}</span>
            <RotateCcw className="w-5 h-5 text-purple-400" />
          </div>
          <span className="text-[10px] text-purple-500/80 block">Butuh Revisi OPD</span>
        </div>
      </div>

      {/* Main Grid: Live SLA Monitor & Rapor Kepatuhan OPD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: SLA Live Monitoring Cards (8 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wide">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Pemantauan Tenggat Waktu Rekomendasi</span>
            </h3>
            <span className="text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
              Tenggat Standar: 14 Hari Kerja
            </span>
          </div>

          <div className="space-y-3">
            {dataList.map((item) => {
              const slaStatus = calculateSlaTimer(item.deadlineDate, item.status);

              return (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-800 hover:border-blue-500/50 rounded-xl p-4 space-y-3 transition group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {item.nomorRdp}
                        </span>
                        <span className="text-[10px] font-extrabold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/80 uppercase">
                          {item.komisi}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${slaStatus.color}`}
                        >
                          {slaStatus.text}
                        </span>
                      </div>
                      <h4
                        onClick={() => onSelectRecommendation(item)}
                        className="font-bold text-slate-100 text-sm hover:text-blue-400 transition cursor-pointer leading-snug"
                      >
                        {item.judulRdp}
                      </h4>
                    </div>
                  </div>

                  <div className="bg-slate-900/70 rounded-lg p-2.5 border border-slate-800/80 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-semibold text-amber-400">{item.opdPenanggungJawab}</span>
                      <span className="text-[11px] text-slate-400">
                        {item.opdPejabatNama}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                      "{item.perintahTindakLanjut}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <div className="flex items-center gap-3 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Terbit: {item.tanggalTerbit}</span>
                      </span>
                      <span>•</span>
                      <span className="font-mono text-slate-300">
                        Tenggat: <strong className="text-slate-200">{item.deadlineDate}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenEvidencePortal(item)}
                        className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1"
                        title="Akses Bilik Bukti OPD"
                      >
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span>Bilik OPD</span>
                      </button>
                      <button
                        onClick={() => onSelectRecommendation(item)}
                        className="text-[10px] bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded-md transition"
                      >
                        Rincian & Alur Kerja
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Rapor Kepatuhan OPD Benchmark Table (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wide">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Rapor Kepatuhan Respons OPD Pemprov</span>
            </h3>
            <BarChart3 className="w-4 h-4 text-slate-500" />
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
            <p className="text-xs text-slate-400 leading-relaxed">
              Peringkat kepatuhan OPD berdasarkan kecepatan dan penyelesaian rekomendasi RDP Komisi DPRD Sulbar.
            </p>

            <div className="space-y-3">
              {opdMetrics.map((opd, idx) => {
                const getScoreBadge = (score: number) => {
                  if (score >= 85) return 'bg-emerald-950 text-emerald-300 border-emerald-700';
                  if (score >= 60) return 'bg-amber-950 text-amber-300 border-amber-700';
                  return 'bg-rose-950 text-rose-300 border-rose-700';
                };

                return (
                  <div
                    key={opd.opdName}
                    className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-3 space-y-2 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-mono font-black text-slate-500">#{idx + 1}</span>
                        <h4 className="text-xs font-bold text-slate-100 truncate" title={opd.opdName}>
                          {opd.opdName}
                        </h4>
                      </div>
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded border ${getScoreBadge(
                          opd.complianceScorePercent
                        )}`}
                      >
                        {opd.complianceScorePercent} POIN
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          opd.complianceScorePercent >= 85
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : opd.complianceScorePercent >= 60
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                            : 'bg-gradient-to-r from-rose-500 to-red-400'
                        }`}
                        style={{ width: `${opd.complianceScorePercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Total RDP: {opd.totalRdp}</span>
                      <span className="text-emerald-400">Tuntas: {opd.tuntasCount}</span>
                      <span className="text-blue-400">Proses: {opd.dalamProsesCount}</span>
                      <span className={opd.overdueCount > 0 ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                        Terlambat: {opd.overdueCount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
