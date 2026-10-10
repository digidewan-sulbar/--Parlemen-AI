import React, { useState } from 'react';
import { RanperdaDetail, RoleCode, RanperdaStatusCode } from '../types';
import { STATUS_LABELS } from '../data/dummyELegislasiData';
import {
  Kanban,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Search,
  Filter,
  Eye,
  ArrowRight,
  User,
  ShieldAlert,
  ChevronRight,
  FileCheck,
  Send,
  Building2,
} from 'lucide-react';

interface Props {
  ranperdaList: RanperdaDetail[];
  currentRole: RoleCode;
  onSelectRanperda: (item: RanperdaDetail) => void;
  onUpdateRanperdaStatus: (id: string, newStatus: RanperdaStatusCode, note: string) => void;
}

export const DashboardKanbanView: React.FC<Props> = ({
  ranperdaList,
  currentRole,
  onSelectRanperda,
  onUpdateRanperdaStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInisiator, setFilterInisiator] = useState<string>('ALL');
  const [selectedTimelineRanperda, setSelectedTimelineRanperda] = useState<RanperdaDetail | null>(null);

  const filteredList = ranperdaList.filter((item) => {
    const matchSearch =
      item.judulRanperda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomorRanperda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.inisiatorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchInisiator =
      filterInisiator === 'ALL' || item.inisiatorType === filterInisiator;

    return matchSearch && matchInisiator;
  });

  const statusKeys: RanperdaStatusCode[] = [
    'DRAFT_PROPOSED',
    'HARMONIZATION_KEMENKUMHAM',
    'HARMONIZED',
    'PANSUS_DISCUSSION',
    'JOINT_APPROVAL',
    'FASILITASI_KEMENDAGRI',
    'NOREG_ISSUED',
    'ENACTED_JDIH',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{ranperdaList.length}</div>
            <div className="text-xs text-slate-400">Total Ranperda Berjalan</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-amber-950 text-amber-400 rounded-xl border border-amber-800">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-300">
              {ranperdaList.filter((r) => r.statusCode === 'HARMONIZATION_KEMENKUMHAM' || r.statusCode === 'FASILITASI_KEMENDAGRI').length}
            </div>
            <div className="text-xs text-slate-400">Proses Harmonisasi & Fasilitasi</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-purple-950 text-purple-400 rounded-xl border border-purple-800">
            <Kanban className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-purple-300">
              {ranperdaList.filter((r) => r.statusCode === 'PANSUS_DISCUSSION').length}
            </div>
            <div className="text-xs text-slate-400">Pembahasan Pansus DPRD</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-cyan-950 text-cyan-400 rounded-xl border border-cyan-800">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-cyan-300">
              {ranperdaList.filter((r) => r.statusCode === 'ENACTED_JDIH').length}
            </div>
            <div className="text-xs text-slate-400">Selesai & Pengundangan JDIH</div>
          </div>
        </div>
      </div>

      {/* Control & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor, judul Ranperda, atau OPD..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Inisiator:</span>
            <button
              onClick={() => setFilterInisiator('ALL')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                filterInisiator === 'ALL'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterInisiator('DPRD')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                filterInisiator === 'DPRD'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              DPRD
            </button>
            <button
              onClick={() => setFilterInisiator('EKSEKUTIF')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                filterInisiator === 'EKSEKUTIF'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Eksekutif
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board Layout */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1400px]">
          {statusKeys.map((statusCode) => {
            const statusConfig = STATUS_LABELS[statusCode];
            const cardsInColumn = filteredList.filter((r) => r.statusCode === statusCode);

            return (
              <div
                key={statusCode}
                className="w-80 flex-shrink-0 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex flex-col"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-extrabold text-[10px] flex items-center justify-center">
                      {statusConfig.stageNo}
                    </span>
                    <span className="font-bold text-xs text-white truncate max-w-[170px]">
                      {statusConfig.label}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-emerald-400">
                    {cardsInColumn.length}
                  </span>
                </div>

                {/* Column Cards Container */}
                <div className="p-3 space-y-3 flex-1 min-h-[420px]">
                  {cardsInColumn.length === 0 ? (
                    <div className="h-32 border border-dashed border-slate-800/80 rounded-xl flex items-center justify-center text-xs text-slate-600">
                      Tidak ada Ranperda
                    </div>
                  ) : (
                    cardsInColumn.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 space-y-3 transition shadow-md group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                            {item.nomorRanperda}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded border font-medium ${
                              item.inisiatorType === 'DPRD'
                                ? 'bg-purple-950 text-purple-300 border-purple-800'
                                : 'bg-blue-950 text-blue-300 border-blue-800'
                            }`}
                          >
                            {item.inisiatorType}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs text-slate-100 line-clamp-2 leading-relaxed group-hover:text-emerald-300 transition">
                          {item.judulRanperda}
                        </h4>

                        <div className="text-[11px] text-slate-400 space-y-1">
                          <div className="flex items-center gap-1.5 truncate">
                            <Building2 className="w-3 h-3 text-slate-500" />
                            <span className="truncate">{item.inisiatorName}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                            <span>SLA: {item.sisaHariSla} hari sisa</span>
                            <span
                              className={`font-semibold ${
                                item.statusSla === 'Melebihi SLA (Alert)'
                                  ? 'text-red-400'
                                  : item.statusSla === 'Mendekati Tenggat'
                                  ? 'text-amber-400'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {item.statusSla}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                          <button
                            onClick={() => setSelectedTimelineRanperda(item)}
                            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition"
                          >
                            <Clock className="w-3 h-3 text-emerald-400" />
                            <span>Timeline</span>
                          </button>

                          <button
                            onClick={() => onSelectRanperda(item)}
                            className="text-[10px] bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-slate-200 font-semibold px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Buka Detail</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline Stepper Modal */}
      {selectedTimelineRanperda && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-emerald-400 font-mono font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {selectedTimelineRanperda.nomorRanperda}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedTimelineRanperda.judulRanperda}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTimelineRanperda(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Stepper Timeline Visualizer */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Progress 8 Tahapan Pembentukan Ranperda
              </h4>

              <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
                {statusKeys.map((key, idx) => {
                  const cfg = STATUS_LABELS[key];
                  const currentIdx = statusKeys.indexOf(selectedTimelineRanperda.statusCode);
                  const isPassed = idx < currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={key} className="relative group">
                      {/* Circle Dot */}
                      <div
                        className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold border ${
                          isCurrent
                            ? 'bg-emerald-500 text-slate-950 border-white ring-4 ring-emerald-500/20'
                            : isPassed
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : 'bg-slate-950 text-slate-600 border-slate-800'
                        }`}
                      >
                        {cfg.stageNo}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold ${
                              isCurrent
                                ? 'text-emerald-400'
                                : isPassed
                                ? 'text-slate-200'
                                : 'text-slate-500'
                            }`}
                          >
                            {cfg.label}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              Posisi Aktif saat Ini
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{cfg.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 flex justify-end">
              <button
                onClick={() => {
                  onSelectRanperda(selectedTimelineRanperda);
                  setSelectedTimelineRanperda(null);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow"
              >
                <span>Buka Workspace Detail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
