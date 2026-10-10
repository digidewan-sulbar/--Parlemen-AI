import React from 'react';
import { RisalahItem, SentimenSummary } from '../types';
import {
  PieChart,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Scale,
  Sparkles,
  Zap,
} from 'lucide-react';

interface Props {
  variant: 'meeting-detail' | 'executive-dashboard';
  risalahList?: RisalahItem[];
  selectedRisalah?: RisalahItem | null;
}

export const SentimentAnalysisSummary: React.FC<Props> = ({
  variant,
  risalahList = [],
  selectedRisalah,
}) => {
  // If variant is meeting-detail (selected risalah sentiment)
  if (variant === 'meeting-detail') {
    if (!selectedRisalah) return null;

    const summary = selectedRisalah.sentimenSummary || {
      positifCount: selectedRisalah.transkripPembicara.filter((t) => t.sentimen === 'Positif').length,
      negatifCount: selectedRisalah.transkripPembicara.filter((t) => t.sentimen === 'Negatif').length,
      netralCount: selectedRisalah.transkripPembicara.filter((t) => t.sentimen === 'Netral').length,
      perdebatanCount: selectedRisalah.transkripPembicara.filter((t) => t.sentimen === 'Perdebatan / Kritis').length,
      ringkasanNada: 'Analisis sentimen berbasis pemrosesan NLP AI terhadap transkrip persidangan.',
      isuPerdebatanUtama: [],
    };

    const totalSegments =
      summary.positifCount + summary.negatifCount + summary.netralCount + summary.perdebatanCount || 1;

    const positifPct = Math.round((summary.positifCount / totalSegments) * 100);
    const negatifPct = Math.round((summary.negatifCount / totalSegments) * 100);
    const netralPct = Math.round((summary.netralCount / totalSegments) * 100);
    const perdebatanPct = Math.round((summary.perdebatanCount / totalSegments) * 100);

    return (
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-100 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-100 uppercase tracking-wider">
                Analisis Sentimen & Nada Bicara Rapat (AI NLP Segment)
              </h4>
              <p className="text-[10px] text-slate-400">
                Deteksi Otomatis Dinamika Diskusi Persidangan DPRD Sulbar
              </p>
            </div>
          </div>

          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-mono">
            {totalSegments} Segmen Teranalisis
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold text-slate-300">
            <span>Distribusi Nada Segmen Diskusi:</span>
            <span className="text-emerald-400 font-mono">{positifPct}% Konstruktif</span>
          </div>

          <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800 p-0.5">
            <div
              style={{ width: `${positifPct}%` }}
              className="bg-emerald-500 h-full rounded-l transition-all"
              title={`Positif: ${positifPct}%`}
            />
            <div
              style={{ width: `${netralPct}%` }}
              className="bg-slate-400 h-full transition-all"
              title={`Netral: ${netralPct}%`}
            />
            <div
              style={{ width: `${perdebatanPct}%` }}
              className="bg-amber-500 h-full transition-all"
              title={`Perdebatan / Kritis: ${perdebatanPct}%`}
            />
            <div
              style={{ width: `${negatifPct}%` }}
              className="bg-red-500 h-full rounded-r transition-all"
              title={`Negatif: ${negatifPct}%`}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Positif ({summary.positifCount})
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              Netral ({summary.netralCount})
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Perdebatan/Kritis ({summary.perdebatanCount})
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Negatif ({summary.negatifCount})
            </span>
          </div>
        </div>

        {/* Tone Summary & Issues */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 space-y-2">
          <div className="flex items-start gap-2 text-slate-200">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200 block text-[11px]">Ringkasan Suasana Persidangan:</span>
              <p className="text-slate-300 italic text-[11px] leading-relaxed">"{summary.ringkasanNada}"</p>
            </div>
          </div>

          {summary.isuPerdebatanUtama && summary.isuPerdebatanUtama.length > 0 && (
            <div className="border-t border-slate-800 pt-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase block mb-1">
                Fokus Sorotan Perdebatan Utama:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                {summary.isuPerdebatanUtama.map((isu, idx) => (
                  <li key={idx}>{isu}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Variant 2: Executive Dashboard Cross-Meeting Sentiment
  let totalPos = 0;
  let totalNeg = 0;
  let totalNeu = 0;
  let totalDebate = 0;

  risalahList.forEach((r) => {
    if (r.sentimenSummary) {
      totalPos += r.sentimenSummary.positifCount || 0;
      totalNeg += r.sentimenSummary.negatifCount || 0;
      totalNeu += r.sentimenSummary.netralCount || 0;
      totalDebate += r.sentimenSummary.perdebatanCount || 0;
    } else if (r.transkripPembicara) {
      r.transkripPembicara.forEach((t) => {
        if (t.sentimen === 'Positif') totalPos++;
        else if (t.sentimen === 'Negatif') totalNeg++;
        else if (t.sentimen === 'Perdebatan / Kritis') totalDebate++;
        else totalNeu++;
      });
    }
  });

  const grandTotal = totalPos + totalNeg + totalNeu + totalDebate || 1;
  const posPct = Math.round((totalPos / grandTotal) * 100);
  const debatePct = Math.round((totalDebate / grandTotal) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100">
              Executive Dashboard - Analisis Sentimen Persidangan DPRD
            </h3>
            <p className="text-[11px] text-slate-400">
              Kompilasi Nada Suasana Persidangan dari Lintas Risalah Rapat DPRD Sulbar
            </p>
          </div>
        </div>

        <span className="text-xs bg-blue-950 text-blue-300 px-3 py-1 rounded-full font-bold border border-blue-800 self-start sm:self-auto">
          {risalahList.length} Risalah Terproses
        </span>
      </div>

      {/* Overview Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-950 border border-emerald-900/60 p-3 rounded-xl">
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Positif / Konstruktif</span>
            <ThumbsUp className="w-3.5 h-3.5" />
          </div>
          <div className="text-lg font-extrabold text-white">{totalPos} Segmen</div>
          <span className="text-[10px] text-emerald-400 font-mono">{posPct}% dari total diskursus</span>
        </div>

        <div className="bg-slate-950 border border-amber-900/60 p-3 rounded-xl">
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Perdebatan / Kritis</span>
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div className="text-lg font-extrabold text-white">{totalDebate} Segmen</div>
          <span className="text-[10px] text-amber-400 font-mono">{debatePct}% sorotan dewan</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Netral Formal</span>
            <Scale className="w-3.5 h-3.5" />
          </div>
          <div className="text-lg font-extrabold text-white">{totalNeu} Segmen</div>
          <span className="text-[10px] text-slate-400 font-mono">Protokoler rapat</span>
        </div>

        <div className="bg-slate-950 border border-red-900/60 p-3 rounded-xl">
          <div className="flex items-center justify-between text-red-400 mb-1">
            <span className="text-[10px] font-bold uppercase">Negatif / Defensif</span>
            <ThumbsDown className="w-3.5 h-3.5" />
          </div>
          <div className="text-lg font-extrabold text-white">{totalNeg} Segmen</div>
          <span className="text-[10px] text-red-400 font-mono">Keterlambatan OPD</span>
        </div>
      </div>

      {/* Cross Meeting Highlights */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Ringkasan Isu Perdebatan Terpanas bagi Pimpinan DPRD
          </span>
          <span className="text-[10px] text-slate-500 font-mono">AI Executive Digest</span>
        </div>

        <div className="space-y-2">
          {risalahList.map((r) => {
            const debateCount = r.sentimenSummary?.perdebatanCount || 0;
            return (
              <div
                key={r.id}
                className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="font-semibold text-slate-200 block">{r.judulRapat}</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {r.sentimenSummary?.ringkasanNada || 'Diskusi persidangan terkendali.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono text-[10px] border border-amber-500/30">
                    {debateCount} Poin Kritis
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
