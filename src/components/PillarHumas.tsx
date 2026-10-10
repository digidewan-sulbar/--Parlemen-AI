import React, { useState } from 'react';
import { PressReleaseItem, ProtocolBriefingSheetItem } from '../types';
import { PressReleaseFormModal } from './forms/PressReleaseFormModal';
import { ProtocolSheetFormModal } from './forms/ProtocolSheetFormModal';
import {
  Megaphone,
  Sparkles,
  FileText,
  Copy,
  Download,
  Clock,
  UserCheck,
  CheckCircle2,
  Calendar,
  Building,
  Share2,
  Printer,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';

interface Props {
  pressReleases: PressReleaseItem[];
  protocolSheets: ProtocolBriefingSheetItem[];
  onAddPressRelease?: (item: PressReleaseItem) => void;
  onUpdatePressRelease?: (item: PressReleaseItem) => void;
  onDeletePressRelease?: (id: string) => void;
  onAddProtocolSheet?: (item: ProtocolBriefingSheetItem) => void;
  onUpdateProtocolSheet?: (item: ProtocolBriefingSheetItem) => void;
  onDeleteProtocolSheet?: (id: string) => void;
  onOpenAiStudio: () => void;
}

export const PillarHumas: React.FC<Props> = ({
  pressReleases,
  protocolSheets,
  onAddPressRelease,
  onUpdatePressRelease,
  onDeletePressRelease,
  onAddProtocolSheet,
  onUpdateProtocolSheet,
  onDeleteProtocolSheet,
  onOpenAiStudio,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'press' | 'protocol'>('press');
  const [selectedPress, setSelectedPress] = useState<PressReleaseItem | null>(
    pressReleases[0] || null
  );
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolBriefingSheetItem | null>(
    protocolSheets[0] || null
  );

  // Modal States
  const [isPressModalOpen, setIsPressModalOpen] = useState(false);
  const [editingPress, setEditingPress] = useState<PressReleaseItem | null>(null);

  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);
  const [editingProtocol, setEditingProtocol] = useState<ProtocolBriefingSheetItem | null>(null);

  return (
    <div className="space-y-6">
      {/* Pillar Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-slate-900 border border-purple-800/40 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/30 mb-2">
              <Megaphone className="w-3.5 h-3.5 text-purple-400" />
              PILAR LAYANAN HUMAS & PROTOKOL (PUBLIC & CEREMONIAL ENGAGEMENT)
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100">
              Otomatisasi Kehumasan & Briefing Sheet Protokol Digital
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl">
              Memfasilitasi pembuatan Draf Press Release Media Otomatis (300-400 kata, gaya jurnalistik 5W+1H) serta Digital Protocol Briefing Sheet (Panduan susunan acara, tata tempat, & poin pengantar Pimpinan DPRD).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAiStudio}
              className="bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Auto-Generate Humas & Protokol AI</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-800/80 mt-6 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('press')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeSubTab === 'press'
                ? 'bg-purple-500 text-slate-950 shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Humas Media Release Auto-Draft (300-400 Kata)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('protocol')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeSubTab === 'protocol'
                ? 'bg-purple-500 text-slate-950 shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Digital Protocol Briefing Sheet</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: HUMAS MEDIA RELEASE AUTO-DRAFT */}
      {activeSubTab === 'press' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Selector / Sidebar */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-100 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2">
              <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider">
                Daftar Rilis Berita Humas
              </h3>
              <button
                onClick={() => {
                  setEditingPress(null);
                  setIsPressModalOpen(true);
                }}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Rilis</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
              {pressReleases.map((pr) => (
                <div
                  key={pr.id}
                  onClick={() => setSelectedPress(pr)}
                  className={`p-3 rounded-xl text-xs cursor-pointer border transition space-y-1 ${
                    selectedPress?.id === pr.id
                      ? 'bg-purple-950/60 border-purple-500/60 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-purple-400 font-mono font-semibold">{pr.tanggalRilis}</span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded text-slate-400 font-medium">
                      {pr.jumlahKata} kata
                    </span>
                  </div>
                  <h4 className="font-bold line-clamp-2">{pr.judulBerita}</h4>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded inline-block">
                    {pr.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Press Release Preview */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl space-y-6">
            {selectedPress ? (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-4 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="bg-purple-950 text-purple-300 border border-purple-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      RILIS BERITA RESMI HUMAS DPRD SULBAR
                    </span>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <span>Tanggal: {selectedPress.tanggalRilis}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">{selectedPress.jumlahKata} Kata (SLA 300-400)</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-extrabold text-white leading-snug">
                    {selectedPress.judulBerita}
                  </h3>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-200 text-xs md:text-sm leading-relaxed whitespace-pre-line font-serif space-y-3">
                  {selectedPress.kontenBerita}
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 text-xs text-slate-400">
                  <span className="text-[11px]">Subbag Humas, Protokol & Publikasi DPRD Prov. Sulawesi Barat</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingPress(selectedPress);
                        setIsPressModalOpen(true);
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition border border-slate-700"
                    >
                      <Edit className="w-3.5 h-3.5 text-purple-400" />
                      <span>Edit Rilis</span>
                    </button>
                    {onDeletePressRelease && (
                      <button
                        onClick={() => {
                          onDeletePressRelease(selectedPress.id);
                          const rem = pressReleases.filter((p) => p.id !== selectedPress.id);
                          setSelectedPress(rem[0] || null);
                        }}
                        className="bg-slate-800 hover:bg-red-950 text-red-400 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition border border-slate-700 hover:border-red-500/50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${selectedPress.judulBerita}\n\n${selectedPress.kontenBerita}`);
                        alert('Rilis berita berhasil disalin ke papan klip.');
                      }}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Rilis Berita</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 p-8 rounded-xl text-center text-slate-400 text-xs">
                Pilih atau generate rilis berita baru.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: DIGITAL PROTOCOL BRIEFING SHEET */}
      {activeSubTab === 'protocol' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] bg-purple-950 text-purple-300 font-bold px-2 py-0.5 rounded border border-purple-800">
                    DIGITAL PROTOCOL BRIEFING SHEET
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    {selectedProtocol?.namaAcara || 'Panduan Acara Digital Pimpinan DPRD'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Waktu: {selectedProtocol?.tanggalWaktu} | Pimpinan: {selectedProtocol?.pimpinanHadir}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setEditingProtocol(null);
                    setIsProtocolModalOpen(true);
                  }}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Briefing Sheet</span>
                </button>

                {selectedProtocol && (
                  <>
                    <button
                      onClick={() => {
                        setEditingProtocol(selectedProtocol);
                        setIsProtocolModalOpen(true);
                      }}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition border border-slate-700"
                      title="Edit Briefing Sheet"
                    >
                      <Edit className="w-4 h-4 text-purple-400" />
                    </button>
                    {onDeleteProtocolSheet && (
                      <button
                        onClick={() => {
                          onDeleteProtocolSheet(selectedProtocol.id);
                          const rem = protocolSheets.filter((p) => p.id !== selectedProtocol.id);
                          setSelectedProtocol(rem[0] || null);
                        }}
                        className="p-2 bg-slate-800 hover:bg-red-950 text-red-400 rounded-xl transition border border-slate-700 hover:border-red-500/50"
                        title="Hapus Briefing Sheet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {selectedProtocol ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Rundown & Seating */}
                <div className="space-y-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
                    <h4 className="font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      1. Susunan Acara (Rundown Kegiatan)
                    </h4>
                    <div className="space-y-2">
                      {selectedProtocol.rundown.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-[11px]"
                        >
                          <div>
                            <span className="font-mono font-bold text-emerald-400 block">{item.waktu}</span>
                            <span className="text-slate-200 font-medium">{item.kegiatan}</span>
                          </div>
                          <span className="text-slate-400 text-[10px] bg-slate-950 px-2 py-1 rounded border border-slate-800">
                            {item.pengampu}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                    <h4 className="font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      2. Tata Tempat (Seating Arrangement)
                    </h4>
                    <p className="text-slate-300 leading-relaxed font-normal bg-slate-900 p-3 rounded-lg border border-slate-800">
                      {selectedProtocol.seatingArrangement}
                    </p>
                  </div>
                </div>

                {/* Right Column: Talking Points & Penanggung Jawab */}
                <div className="space-y-4">
                  <div className="bg-slate-950 border border-purple-900/50 rounded-xl p-4 text-xs space-y-3">
                    <h4 className="font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      3. Poin-Poin Penting Penyampaian Pimpinan DPRD
                    </h4>
                    <ul className="space-y-2">
                      {selectedProtocol.poinPentingPimpinan.map((poin, idx) => (
                        <li
                          key={idx}
                          className="bg-slate-900 border border-purple-900/30 rounded-lg p-2.5 text-slate-200 leading-relaxed font-medium flex items-start gap-2"
                        >
                          <span className="bg-purple-900 text-purple-300 font-bold px-1.5 py-0.5 rounded text-[10px] mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{poin}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-1">
                    <span className="text-slate-500 font-bold uppercase text-[10px] block">
                      Penanggung Jawab Acara (Protokol)
                    </span>
                    <p className="text-emerald-400 font-mono font-bold">
                      {selectedProtocol.penanggungJawab}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Form Modals for Data Input */}
      <PressReleaseFormModal
        isOpen={isPressModalOpen}
        onClose={() => setIsPressModalOpen(false)}
        onSave={(data) => {
          if (editingPress && onUpdatePressRelease) {
            onUpdatePressRelease(data);
            if (selectedPress?.id === data.id) setSelectedPress(data);
          } else if (onAddPressRelease) {
            onAddPressRelease(data);
            setSelectedPress(data);
          }
        }}
        initialData={editingPress}
      />

      <ProtocolSheetFormModal
        isOpen={isProtocolModalOpen}
        onClose={() => setIsProtocolModalOpen(false)}
        onSave={(data) => {
          if (editingProtocol && onUpdateProtocolSheet) {
            onUpdateProtocolSheet(data);
            if (selectedProtocol?.id === data.id) setSelectedProtocol(data);
          } else if (onAddProtocolSheet) {
            onAddProtocolSheet(data);
            setSelectedProtocol(data);
          }
        }}
        initialData={editingProtocol}
      />
    </div>
  );
};
