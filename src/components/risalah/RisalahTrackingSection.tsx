import React, { useState } from 'react';
import { RisalahItem, TahapRisalah, RisalahTrackingStep } from '../../types';
import {
  TAHAPAN_ORDER,
  TAHAPAN_RISALAH_METADATA,
  getTahapIndex,
  getTahapProgress,
  createDefaultTrackingSteps,
} from '../../utils/risalahTracking';
import {
  History,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileCheck,
  User,
  ShieldCheck,
  Mic,
  ArrowRight,
  Edit3,
  Calendar,
  Layers,
  FileText,
} from 'lucide-react';

interface Props {
  risalah: RisalahItem;
  onOpenUpdateModal: () => void;
}

export const RisalahTrackingSection: React.FC<Props> = ({
  risalah,
  onOpenUpdateModal,
}) => {
  const [isAuditTrailOpen, setIsAuditTrailOpen] = useState(false);

  const currentTahap: TahapRisalah =
    risalah.statusTahap || '4. Verifikasi & Telaah Notulis';
  const progressPercent =
    risalah.progressPersen !== undefined
      ? risalah.progressPersen
      : getTahapProgress(currentTahap);
  const currentMeta = TAHAPAN_RISALAH_METADATA[currentTahap];
  const currentIdx = getTahapIndex(currentTahap);

  // If tracking steps are not yet populated on this item, generate default ones
  const steps: RisalahTrackingStep[] =
    risalah.tahapTracking && risalah.tahapTracking.length === 6
      ? risalah.tahapTracking
      : createDefaultTrackingSteps(currentTahap, risalah.namaNotulis);

  const auditLogs = risalah.auditLogs || [];

  const getStepIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Mic className="w-3.5 h-3.5" />;
      case 1:
        return <Sparkles className="w-3.5 h-3.5" />;
      case 2:
        return <Edit3 className="w-3.5 h-3.5" />;
      case 3:
        return <User className="w-3.5 h-3.5" />;
      case 4:
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 5:
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      default:
        return <FileCheck className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 text-xs space-y-4 shadow-inner">
      {/* Top Bar: Title, Status Badge, and Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-100 uppercase tracking-wide text-[11px]">
                Rekam Jejak Proses & Validasi Risalah
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${currentMeta.warnaBadge}`}
              >
                {currentMeta.labelSingkat}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Alur 6 Tahapan Standar Penatausahaan Risalah Sidang DPRD Prov. Sulawesi Barat
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onOpenUpdateModal}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs shadow transition flex items-center gap-1.5"
            title="Perbarui status atau tambah catatan riwayat rekam jejak"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Perbarui Tahapan / Log</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Percentage */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium">
            Progres Siklus Pembuatan Risalah:
          </span>
          <span className="font-mono font-bold text-emerald-400">
            {progressPercent}% {progressPercent === 100 ? '(Tuntas & Sah)' : '(Dalam Proses)'}
          </span>
        </div>
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              progressPercent === 100
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-r from-emerald-600 to-amber-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Visual 6-Step Stepper */}
      <div className="pt-2">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {steps.map((step, idx) => {
            const isCompleted = step.status === 'completed' || (progressPercent === 100);
            const isCurrent = step.status === 'current' && progressPercent < 100;
            const isPending = step.status === 'pending' && !isCompleted;

            return (
              <div
                key={step.id || idx}
                className={`p-2.5 rounded-xl border flex flex-col justify-between transition relative overflow-hidden ${
                  isCompleted
                    ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                    : isCurrent
                    ? 'bg-slate-900 border-amber-500/80 text-white shadow-lg ring-1 ring-amber-500/40'
                    : 'bg-slate-950 border-slate-800/70 text-slate-500'
                }`}
              >
                {/* Top Number & Icon */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCompleted
                        ? 'bg-emerald-500 text-slate-950'
                        : isCurrent
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div
                    className={`${
                      isCompleted
                        ? 'text-emerald-400'
                        : isCurrent
                        ? 'text-amber-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {getStepIcon(idx)}
                  </div>
                </div>

                {/* Label */}
                <div>
                  <div
                    className={`font-bold text-[11px] leading-tight line-clamp-1 ${
                      isCompleted
                        ? 'text-slate-200'
                        : isCurrent
                        ? 'text-amber-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.labelSingkat}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {step.aktorPenanggungJawab.split(' (')[0]}
                  </div>
                </div>

                {/* Step Status Badge */}
                <div className="mt-2 pt-1 border-t border-slate-800/60 flex items-center justify-between text-[9px] font-mono">
                  {isCompleted ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Selesai
                    </span>
                  ) : isCurrent ? (
                    <span className="text-amber-400 flex items-center gap-1 font-semibold">
                      <Clock className="w-2.5 h-2.5 animate-spin" /> Sedang Proses
                    </span>
                  ) : (
                    <span className="text-slate-500">Menunggu</span>
                  )}

                  {step.versiDokumen && (
                    <span className="text-slate-500 bg-slate-900/80 px-1 rounded">
                      {step.versiDokumen.split(' ')[0]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Focus Detail Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Tahap Saat Ini:</span>
            <span className="text-xs font-semibold text-emerald-300">
              {currentMeta.labelSingkat}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              (SLA: {currentMeta.slaJam})
            </span>
          </div>
          <p className="text-[11px] text-slate-300 italic">
            "{steps[currentIdx]?.catatanAktivitas || currentMeta.deskripsi}"
          </p>
        </div>

        <div className="text-right sm:shrink-0 flex items-center sm:flex-col sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-800 pt-1.5 sm:pt-0">
          <span className="text-[10px] text-slate-400">Penanggung Jawab:</span>
          <span className="text-[11px] font-medium text-slate-200">
            {steps[currentIdx]?.aktorPenanggungJawab || currentMeta.defaultAktor}
          </span>
        </div>
      </div>

      {/* Expandable Audit Trail History Log */}
      <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-900/50">
        <button
          type="button"
          onClick={() => setIsAuditTrailOpen((prev) => !prev)}
          className="w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-850 flex items-center justify-between text-left text-xs text-slate-300 font-semibold transition"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Riwayat Rekam Jejak & Log Perubahan ({auditLogs.length} Entri)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span>{isAuditTrailOpen ? 'Tutup Rincian' : 'Buka Log Detail'}</span>
            {isAuditTrailOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {isAuditTrailOpen && (
          <div className="p-4 space-y-3 border-t border-slate-800 max-h-64 overflow-y-auto scrollbar-thin">
            {auditLogs.length === 0 ? (
              <div className="text-center py-4 text-slate-500 italic">
                Belum ada entri catatan rekam jejak kustom. Klik "Perbarui Tahapan / Log" untuk menambah catatan baru.
              </div>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1 relative"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-300">{log.aktor}</span>
                      <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono border border-slate-700">
                        {log.versiDokumen}
                      </span>
                    </div>
                    <span className="text-slate-400 font-mono text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {log.waktu}
                    </span>
                  </div>

                  <div className="font-semibold text-slate-200 text-[11px]">
                    {log.aksi}
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {log.catatanPerubahan}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
