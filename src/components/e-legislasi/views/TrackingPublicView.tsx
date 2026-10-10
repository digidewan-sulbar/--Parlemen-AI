import React, { useState } from 'react';
import { RanperdaDetail } from '../types';
import { STATUS_LABELS } from '../data/dummyELegislasiData';
import {
  Search,
  CheckCircle2,
  Clock,
  Download,
  Building2,
  Calendar,
  FileText,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface Props {
  ranperdaList: RanperdaDetail[];
}

export const TrackingPublicView: React.FC<Props> = ({ ranperdaList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRanperda, setSelectedRanperda] = useState<RanperdaDetail | null>(
    ranperdaList[0] || null
  );

  const filtered = ranperdaList.filter(
    (r) =>
      r.judulRanperda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.nomorRanperda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.inisiatorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusKeys = Object.keys(STATUS_LABELS) as (keyof typeof STATUS_LABELS)[];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
          PORTAL MONITORING PUBLIK E-LEGISLASI SULBAR
        </span>
        <h2 className="text-xl font-extrabold text-white">
          Sistem Melayani Keterbukaan Informasi Pembentukan Peraturan Daerah
        </h2>
        <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Masyarakat dan pemangku kepentingan dapat memantau secara real-time setiap tahapan pembentukan Ranperda Provinsi Sulawesi Barat secara transparan.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto pt-2">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Ketik kata kunci judul Ranperda, nomor, atau OPD pemrakarsa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
          />
        </div>
      </div>

      {/* Select Ranperda Cards Horizontal Scroll or Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Pilih Ranperda untuk Dilihat Progressnya ({filtered.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((item) => {
            const isSelected = selectedRanperda?.id === item.id;
            const currentStage = STATUS_LABELS[item.statusCode]?.stageNo || 1;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedRanperda(item)}
                className={`p-4 rounded-2xl border transition cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-emerald-950/20 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {item.nomorRanperda}
                  </span>
                  <span className="bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded">
                    Tahap {currentStage} / 8
                  </span>
                </div>

                <h4 className="font-bold text-xs text-white line-clamp-2 leading-relaxed">
                  {item.judulRanperda}
                </h4>

                {/* Micro Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${(currentStage / 8) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{STATUS_LABELS[item.statusCode]?.label}</span>
                    <span>{Math.round((currentStage / 8) * 100)}% Selesai</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Detail Progress Visualizer */}
      {selectedRanperda && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                {selectedRanperda.nomorRanperda}
              </span>
              <span className="text-xs bg-purple-950 text-purple-300 px-2.5 py-0.5 rounded border border-purple-800 font-semibold">
                Inisiator: {selectedRanperda.inisiatorName}
              </span>
            </div>
            <h3 className="text-base md:text-lg font-bold text-white leading-snug">
              {selectedRanperda.judulRanperda}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedRanperda.deskripsiRingkas}
            </p>
          </div>

          {/* Stepper Timeline 8 Stages */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Tracking 8 Tahapan Pembentukan Ranperda</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {statusKeys.map((key, idx) => {
                const cfg = STATUS_LABELS[key];
                const activeIdx = statusKeys.indexOf(selectedRanperda.statusCode);
                const isPassed = idx < activeIdx;
                const isCurrent = idx === activeIdx;

                return (
                  <div
                    key={key}
                    className={`p-2.5 rounded-xl border text-center space-y-1.5 transition ${
                      isCurrent
                        ? 'bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/20'
                        : isPassed
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full mx-auto text-[11px] font-extrabold flex items-center justify-center ${
                        isCurrent
                          ? 'bg-emerald-500 text-slate-950'
                          : isPassed
                          ? 'bg-emerald-800 text-emerald-200'
                          : 'bg-slate-800 text-slate-600'
                      }`}
                    >
                      {cfg.stageNo}
                    </div>
                    <div className="text-[10px] font-bold line-clamp-2 leading-tight">
                      {cfg.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Download Public Documents */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Dokumen Publik Terverifikasi</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedRanperda.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="truncate">
                    <div className="font-bold text-slate-200 truncate">{doc.versionName}</div>
                    <div className="text-[10px] text-slate-400 truncate">{doc.fileName}</div>
                  </div>
                  <button
                    onClick={() => alert(`Pengunduhan berkas publik ${doc.fileName} dimulai...`)}
                    className="p-2 bg-emerald-950 hover:bg-emerald-800 text-emerald-400 border border-emerald-700/80 rounded-lg transition"
                    title="Unduh Berkas Resmi"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
