import React, { useState, useEffect } from 'react';
import { RanperdaItem, RisalahItem, RdpRecommendationItem, StatusRekomendasi } from '../types';
import { SentimentAnalysisSummary } from './SentimentAnalysisSummary';
import { RanperdaFormModal } from './forms/RanperdaFormModal';
import { RisalahFormModal } from './forms/RisalahFormModal';
import { RdpFormModal } from './forms/RdpFormModal';
import { AudioRecorderAndUploader } from './AudioRecorderAndUploader';
import { RisalahPdfModal } from './RisalahPdfModal';
import { triggerDirectPdfDownload } from '../utils/risalahPdf';
import { ELegislasiMain } from './e-legislasi/ELegislasiMain';
import { ETrackingRdpMain } from './e-tracking-rdp/ETrackingRdpMain';
import { RisalahSmartSearch } from './risalah/RisalahSmartSearch';
import { RisalahTrackingSection } from './risalah/RisalahTrackingSection';
import { RisalahUpdateTrackingModal } from './risalah/RisalahUpdateTrackingModal';
import {
  createDefaultTrackingSteps,
  createAuditLogEntry,
  TAHAPAN_RISALAH_METADATA,
} from '../utils/risalahTracking';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Sparkles,
  Download,
  Printer,
  Search,
  Filter,
  Layers,
  ChevronRight,
  Send,
  Building,
  Check,
  FileCheck,
  Mic,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  History,
  X,
  Info,
} from 'lucide-react';

interface Props {
  ranperdaList: RanperdaItem[];
  risalahList: RisalahItem[];
  rdpRecommendations: RdpRecommendationItem[];
  onAddRisalah: (newRisalah: RisalahItem) => void;
  onUpdateRisalah?: (updatedRisalah: RisalahItem) => void;
  onDeleteRisalah?: (id: string) => void;
  onAddRanperda?: (newRanperda: RanperdaItem) => void;
  onUpdateRanperda?: (updatedRanperda: RanperdaItem) => void;
  onDeleteRanperda?: (id: string) => void;
  onAddRdp?: (newRdp: RdpRecommendationItem) => void;
  onUpdateRdp?: (updatedRdp: RdpRecommendationItem) => void;
  onDeleteRdp?: (id: string) => void;
  onUpdateRdpStatus: (id: string, newStatus: StatusRekomendasi, proofText?: string, proofUrl?: string) => void;
  onOpenAiStudio: () => void;
}

export const PillarPersidangan: React.FC<Props> = ({
  ranperdaList,
  risalahList,
  rdpRecommendations,
  onAddRisalah,
  onUpdateRisalah,
  onDeleteRisalah,
  onAddRanperda,
  onUpdateRanperda,
  onDeleteRanperda,
  onAddRdp,
  onUpdateRdp,
  onDeleteRdp,
  onUpdateRdpStatus,
  onOpenAiStudio,
}) => {
  const [activeTab, setActiveTab] = useState<'risalah' | 'legislasi' | 'rdp'>('risalah');
  const [selectedRisalah, setSelectedRisalah] = useState<RisalahItem | null>(risalahList[0] || null);

  // Sync selectedRisalah whenever risalahList updates
  useEffect(() => {
    if (selectedRisalah) {
      const match = risalahList.find((r) => r.id === selectedRisalah.id);
      if (match) {
        setSelectedRisalah(match);
      } else {
        setSelectedRisalah(risalahList[0] || null);
      }
    } else if (risalahList.length > 0) {
      setSelectedRisalah(risalahList[0]);
    }
  }, [risalahList]);

  // Form Modal States
  const [isRisalahModalOpen, setIsRisalahModalOpen] = useState(false);
  const [editingRisalah, setEditingRisalah] = useState<RisalahItem | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingTargetRisalah, setTrackingTargetRisalah] = useState<RisalahItem | null>(null);

  // Delete Confirmation Modal State
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: 'risalah' | 'ranperda' | 'rdp';
    id: string;
    title: string;
  } | null>(null);

  // In-app Notification Toast State (avoids window.alert)
  const [activeToast, setActiveToast] = useState<{
    title: string;
    message: string;
    type?: 'success' | 'warning' | 'info';
  } | null>(null);

  const triggerToast = (
    title: string,
    message: string,
    type: 'success' | 'warning' | 'info' = 'success'
  ) => {
    setActiveToast({ title, message, type });
    setTimeout(() => {
      setActiveToast((curr) => (curr?.title === title ? null : curr));
    }, 4500);
  };

  const [isRanperdaModalOpen, setIsRanperdaModalOpen] = useState(false);
  const [editingRanperda, setEditingRanperda] = useState<RanperdaItem | null>(null);

  const [isRdpModalOpen, setIsRdpModalOpen] = useState(false);
  const [editingRdp, setEditingRdp] = useState<RdpRecommendationItem | null>(null);

  // RDP Filter State
  const [rdpFilterOpd, setRdpFilterOpd] = useState<string>('SEMUA');
  const [rdpFilterStatus, setRdpFilterStatus] = useState<string>('SEMUA');
  const [selectedRdp, setSelectedRdp] = useState<RdpRecommendationItem | null>(null);
  const [proofInput, setProofInput] = useState('');
  const [proofStatus, setProofStatus] = useState<StatusRekomendasi>('Dalam Proses');

  // Quick Audio / Text Upload Form state inside Risalah
  const [inputJenis, setInputJenis] = useState<'Rapat Paripurna' | 'Rapat Bamus' | 'Rapat Komisi' | 'Rapat Dengar Pendapat (RDP)'>('Rapat Paripurna');
  const [inputJudul, setInputJudul] = useState('');
  const [inputHariTanggal, setInputHariTanggal] = useState('');
  const [inputPimpinan, setInputPimpinan] = useState('');
  const [inputAnggota, setInputAnggota] = useState('');
  const [inputTranscriptText, setInputTranscriptText] = useState('');
  const [isProcessingAudioText, setIsProcessingAudioText] = useState(false);

  // Helper stage names
  const STAGE_NAMES = [
    '1. Naskah Akademik',
    '2. Draf Ranperda',
    '3. Propemperda',
    '4. Rapat Paripurna / Komisi',
    '5. Fasilitasi Kemendagri',
    '6. Persetujuan Bersama',
    '7. Pengundangan Perda',
  ];

  // OPD list extracted from recommendations
  const uniqueOpds = Array.from(new Set(rdpRecommendations.map((r) => r.opdPenanggungJawab)));

  const filteredRdp = rdpRecommendations.filter((r) => {
    const matchOpd = rdpFilterOpd === 'SEMUA' || r.opdPenanggungJawab === rdpFilterOpd;
    const matchStatus = rdpFilterStatus === 'SEMUA' || r.status === rdpFilterStatus;
    return matchOpd && matchStatus;
  });

  const handleProcessRisalahDirect = async () => {
    if (!inputTranscriptText.trim()) {
      triggerToast('Transkrip Belum Diisi', 'Mohon masukkan draf teks transkrip rapat atau jalankan AI Core Engine.', 'warning');
      return;
    }

    setIsProcessingAudioText(true);
    try {
      const response = await fetch('/api/ai/process-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jenisRapat: inputJenis,
          judulRapat: inputJudul || 'Rapat DPRD Sulawesi Barat',
          hariTanggalWaktu: inputHariTanggal || 'Kamis, 30 Juli 2026',
          pimpinanRapat: inputPimpinan || 'Ketua DPRD Prov. Sulawesi Barat',
          anggotaHadir: inputAnggota || '38 dari 41 Anggota DPRD Sulbar',
          transcriptText: inputTranscriptText,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data?.risalah) {
        const generatedRisalah: RisalahItem = {
          id: `RSL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          nomorRisalah: `Risalah/${inputJenis.substring(0, 3).toUpperCase()}/${Math.floor(10 + Math.random() * 90)}/2026`,
          judulRapat: resData.data.risalah.judulRapat || inputJudul || 'Rapat DPRD Sulbar',
          jenisRapat: inputJenis,
          hariTanggalWaktu: resData.data.risalah.hariTanggalWaktu || inputHariTanggal || 'Kamis, 30 Juli 2026',
          pimpinanRapat: resData.data.risalah.pimpinanRapat || inputPimpinan || 'Ketua DPRD Sulbar',
          anggotaHadir: resData.data.risalah.anggotaHadir || inputAnggota || '38 Anggota DPRD',
          transkripPembicara: resData.data.risalah.transkripPembicara || [],
          resumePoinUtama: resData.data.risalah.resumePoinUtama || [],
          kesimpulanKeputusan: resData.data.risalah.kesimpulanKeputusan || [],
          namaNotulis: 'Arianto, AP, M.M.',
          nipNotulis: '19720412 199803 1 004',
          statusTahap: '3. Olah & Standardisasi Kalimat Baku AI',
          progressPersen: 55,
          tahapTracking: createDefaultTrackingSteps('3. Olah & Standardisasi Kalimat Baku AI', 'Arianto, AP, M.M.'),
          auditLogs: [
            createAuditLogEntry(
              '3. Olah & Standardisasi Kalimat Baku AI',
              'Engine Speech-to-Text & Diarization AI',
              'Olah transkrip rekaman suara rapat resmi berhasil diformulasikan ke format risalah persidangan.',
              'v2.0 (Draf Baku AI)'
            ),
          ],
          createdDate: new Date().toISOString().split('T')[0],
        };

        onAddRisalah(generatedRisalah);
        setSelectedRisalah(generatedRisalah);
        setInputTranscriptText('');
        triggerToast('Risalah AI Selesai Dirumuskan', `Risalah "${generatedRisalah.judulRapat}" telah dibuat & siap ditelaah notulis.`, 'success');
      } else {
        triggerToast('Gagal Merumuskan Risalah', resData.error || 'Server error saat memproses risalah AI.', 'warning');
      }
    } catch (err: any) {
      triggerToast('Terjadi Kesalahan', err.message, 'warning');
    } finally {
      setIsProcessingAudioText(false);
    }
  };

  const handleUpdateRdpProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRdp) return;
    onUpdateRdpStatus(
      selectedRdp.id,
      proofStatus,
      proofInput || 'Bukti dokumen tindak lanjut telah diunggah oleh Admin OPD.',
      '/docs/Bukti_Tindak_Lanjut_OPD.pdf'
    );
    setSelectedRdp(null);
    setProofInput('');
    triggerToast('Bukti Tindak Lanjut Terkirim', 'Bukti tindak lanjut OPD berhasil disimpan & dikirim ke DPRD Sulbar.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Pillar Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-500/30 mb-2">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              PILAR LAYANAN PERSIDANGAN & PERUNDANG-UNDANGAN (CORE ENGINE)
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100">
              Smart System Persidangan
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAiStudio}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Jalankan AI Core Engine</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs inside Persidangan */}
        <div className="flex items-center gap-2 border-t border-slate-800/80 mt-6 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('risalah')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'risalah'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Modul 1: E-Risalah Berbantu AI</span>
            <span className="bg-slate-900/30 text-[10px] px-1.5 py-0.5 rounded-full">
              {risalahList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('legislasi')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'legislasi'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Modul 2 : E-Legislasi</span>
            <span className="bg-slate-900/30 text-[10px] px-1.5 py-0.5 rounded-full">
              {ranperdaList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rdp')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'rdp'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Modul 3 : E-Tracking RDP</span>
            <span className="bg-slate-900/30 text-[10px] px-1.5 py-0.5 rounded-full">
              {rdpRecommendations.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: MODUL 1 - E-RISALAH AI */}
      {activeTab === 'risalah' && (
        <div className="space-y-6">
          {/* Fitur 1: Smart Search / Pencarian Pintar Modul 1 */}
          <RisalahSmartSearch
            risalahList={risalahList}
            selectedRisalahId={selectedRisalah?.id || null}
            onSelectRisalah={(item) => setSelectedRisalah(item)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Input / Direct Processing */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 shadow-md flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-100">
                    Olah Transkrip Suara-ke-Teks
                  </h3>
                </div>
                <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
                  Engine Speech-to-Text AI
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Jenis Rapat</label>
                  <select
                    value={inputJenis}
                    onChange={(e: any) => setInputJenis(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Rapat Paripurna">Rapat Paripurna</option>
                    <option value="Rapat Bamus">Rapat Bamus</option>
                    <option value="Rapat Komisi">Rapat Komisi</option>
                    <option value="Rapat Dengar Pendapat (RDP)">Rapat Dengar Pendapat (RDP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Judul Agenda Rapat</label>
                  <input
                    type="text"
                    placeholder="misal: Rapat Paripurna Ranperda Pertambahan Kakao..."
                    value={inputJudul}
                    onChange={(e) => setInputJudul(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Waktu & Tanggal</label>
                    <input
                      type="text"
                      placeholder="Senin, 28 Juli 2026 | 09:00 WITA"
                      value={inputHariTanggal}
                      onChange={(e) => setInputHariTanggal(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Pimpinan Rapat</label>
                    <input
                      type="text"
                      placeholder="Ketua DPRD Sulbar"
                      value={inputPimpinan}
                      onChange={(e) => setInputPimpinan(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <AudioRecorderAndUploader
                  transcriptText={inputTranscriptText}
                  onTranscriptChange={(val) => {
                    if (typeof val === 'function') {
                      setInputTranscriptText(val);
                    } else {
                      setInputTranscriptText(val);
                    }
                  }}
                  onSaveAudioAndTranscript={(audioUrl, finalTranscript) => {
                    setInputTranscriptText(finalTranscript);
                  }}
                  onProcessToRisalah={(textToProcess) => {
                    const cleanPlainText = textToProcess.replace(/<[^>]*>?/gm, '');

                    // Smart multi-speaker transcript parser
                    const rawLines = textToProcess
                      .replace(/<p[^>]*>/gi, '')
                      .replace(/<\/p>/gi, '\n')
                      .replace(/<br\s*\/?>/gi, '\n')
                      .replace(/<[^>]*>?/gm, '')
                      .split('\n')
                      .map((l) => l.trim())
                      .filter((l) => l.length > 0);

                    const parsedSpeakerTranscripts: Array<{
                      pembicara: string;
                      timestamp: string;
                      pernyataan: string;
                      sentimen: 'Positif' | 'Netral' | 'Perdebatan / Kritis' | 'Negatif';
                    }> = [];

                    for (const line of rawLines) {
                      const bracketMatch = line.match(/^\[([^\]]+)\]:\s*(.*)$/);
                      const colonMatch = !bracketMatch ? line.match(/^([^:]+):\s*(.*)$/) : null;

                      if (bracketMatch) {
                        parsedSpeakerTranscripts.push({
                          pembicara: bracketMatch[1].trim(),
                          timestamp: 'Sesi Perekaman Audio',
                          pernyataan: bracketMatch[2].trim() || line,
                          sentimen: 'Netral',
                        });
                      } else if (colonMatch && colonMatch[1].length < 65) {
                        parsedSpeakerTranscripts.push({
                          pembicara: colonMatch[1].trim(),
                          timestamp: 'Sesi Perekaman Audio',
                          pernyataan: colonMatch[2].trim() || line,
                          sentimen: 'Netral',
                        });
                      } else {
                        if (parsedSpeakerTranscripts.length > 0) {
                          parsedSpeakerTranscripts[parsedSpeakerTranscripts.length - 1].pernyataan +=
                            ' ' + line;
                        } else {
                          parsedSpeakerTranscripts.push({
                            pembicara: 'Pembicara Persidangan',
                            timestamp: 'Sesi Perekaman Audio',
                            pernyataan: line,
                            sentimen: 'Netral',
                          });
                        }
                      }
                    }

                    const finalTranskripPembicara =
                      parsedSpeakerTranscripts.length > 0
                        ? parsedSpeakerTranscripts
                        : [
                            {
                              pembicara: 'Transkrip Hasil Perekaman Audio',
                              timestamp: '00:00 - Selesai',
                              pernyataan: textToProcess,
                              sentimen: 'Netral' as const,
                            },
                          ];

                    const draft: RisalahItem = {
                      id: `RSL-AUDIO-${Math.floor(1000 + Math.random() * 9000)}`,
                      nomorRisalah: `Risalah/PAR/${Math.floor(10 + Math.random() * 90)}/2026`,
                      judulRapat: inputJudul || 'Rapat Hasil Transkripsi Audio & Perekaman Direct',
                      jenisRapat: inputJenis,
                      hariTanggalWaktu: inputHariTanggal || 'Kamis, 30 Juli 2026 - 09.00 WITA',
                      pimpinanRapat: inputPimpinan || 'Dr. H. Amalia Aras, S.E., M.M.',
                      anggotaHadir: '38 dari 41 Anggota DPRD Sulbar & Undangan Pemprov',
                      namaNotulis: 'Arianto, AP, M.M.',
                      nipNotulis: '19720412 199803 1 004',
                      transkripPembicara: finalTranskripPembicara,
                      resumePoinUtama: [
                        cleanPlainText.length > 150
                          ? cleanPlainText.substring(0, 150) + '...'
                          : cleanPlainText || 'Pembahasan pokok persidangan dewan',
                      ],
                      kesimpulanKeputusan: [
                        'Notulensi resmi hasil perekaman persidangan disahkan untuk disarikan.',
                      ],
                      statusTahap: '2. Transkripsi Suara-ke-Teks AI',
                      progressPersen: 35,
                      tahapTracking: createDefaultTrackingSteps('2. Transkripsi Suara-ke-Teks AI', 'Arianto, AP, M.M.'),
                      auditLogs: [
                        createAuditLogEntry(
                          '2. Transkripsi Suara-ke-Teks AI',
                          'Audio Speech-to-Text Recorder Engine',
                          'Perekaman audio persidangan berhasil diunggah dan ditranskripsikan ke naskah kerja notulis.',
                          'v1.1 (Transkrip Kasar)'
                        ),
                      ],
                      createdDate: new Date().toISOString().split('T')[0],
                    };

                    setEditingRisalah(draft);
                    setIsRisalahModalOpen(true);
                  }}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleProcessRisalahDirect}
                disabled={isProcessingAudioText}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl shadow transition flex items-center justify-center gap-2"
              >
                {isProcessingAudioText ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Memproses Transkripsi AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Olah Risalah Rapat Resmi AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Risalah Display View */}
          <div className="lg:col-span-7 space-y-4">
            {/* List Selector & Action Controls */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-slate-200">
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="text-slate-400 font-medium">Pilih Arsip Risalah:</span>
                <select
                  value={selectedRisalah?.id || ''}
                  onChange={(e) => {
                    const item = risalahList.find((r) => r.id === e.target.value);
                    if (item) setSelectedRisalah(item);
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-emerald-400 font-semibold focus:outline-none"
                >
                  {risalahList.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nomorRisalah} - {r.jenisRapat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingRisalah(null);
                    setIsRisalahModalOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Risalah Manual</span>
                </button>
              </div>
            </div>

            {selectedRisalah ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl space-y-6">
                {/* Toolbar Resmi & Tombol Aksi Dokumen E-Risalah Resmi Sulbar */}
                <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                  {/* Left: Official Badges & Identifiers */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-700/80 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>DOKUMEN E-RISALAH RESMI SULBAR</span>
                    </span>
                    <span className="font-mono text-xs text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 font-bold">
                      {selectedRisalah.nomorRisalah}
                    </span>
                    {(() => {
                      const itemTahap = selectedRisalah.statusTahap || '4. Verifikasi & Telaah Notulis';
                      const meta = TAHAPAN_RISALAH_METADATA[itemTahap];
                      const pct = selectedRisalah.progressPersen !== undefined ? selectedRisalah.progressPersen : 75;
                      return (
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${meta?.warnaBadge || 'bg-slate-800 text-slate-300'}`}>
                          <span>{meta?.labelSingkat || itemTahap}</span>
                          <span className="font-mono opacity-80">({pct}%)</span>
                        </span>
                      );
                    })()}
                  </div>

                  {/* Right: Primary Interactive Action Buttons (Edit Risalah, Pratinjau Cetak, Unduh PDF, Hapus) */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRisalah(selectedRisalah);
                        setIsRisalahModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
                      title="Edit Dokumen Risalah Ini"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Risalah</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsPdfModalOpen(true);
                      }}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl transition text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95"
                      title="Pratinjau layout cetak A4 dengan Kop Surat Resmi"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Pratinjau Cetak</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        triggerDirectPdfDownload(selectedRisalah);
                        triggerToast('Unduh PDF', 'Menyiapkan berkas PDF resmi untuk diunduh/dicetak...', 'info');
                      }}
                      className="px-3 py-2 bg-slate-800 hover:bg-emerald-950/70 text-emerald-300 border border-slate-700 hover:border-emerald-700/60 rounded-xl transition text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95"
                      title="Unduh File PDF Dokumen Risalah"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Unduh PDF</span>
                    </button>

                    {onDeleteRisalah && (
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteConfirmTarget({
                            type: 'risalah',
                            id: selectedRisalah.id,
                            title: selectedRisalah.judulRapat,
                          });
                        }}
                        className="px-3 py-2 bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white border border-red-800/60 hover:border-red-500 rounded-xl transition text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
                        title="Hapus Dokumen Risalah Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Header Official Risalah Title Banner */}
                <div className="border-b border-slate-800 pb-4 text-center space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide leading-snug px-4">
                    {selectedRisalah.judulRapat}
                  </h3>
                  <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
                    <span className="text-emerald-400 font-semibold">{selectedRisalah.jenisRapat}</span>
                    <span>&bull;</span>
                    <span>{selectedRisalah.hariTanggalWaktu}</span>
                    <span>&bull;</span>
                    <span>Pimpinan: <strong className="text-slate-200">{selectedRisalah.pimpinanRapat}</strong></span>
                  </div>
                </div>

                {/* Fitur 2: Rekam Jejak / Tracking Proses Pembuatan Risalah */}
                <RisalahTrackingSection
                  risalah={selectedRisalah}
                  onOpenUpdateModal={() => {
                    setTrackingTargetRisalah(selectedRisalah);
                    setIsTrackingModalOpen(true);
                  }}
                />

                {/* Section A: Hari / Tanggal / Waktu & Jenis */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">a. Hari / Tanggal / Waktu & Jenis Rapat</span>
                      <span className="font-semibold text-slate-200">{selectedRisalah.hariTanggalWaktu}</span>
                      <span className="ml-2 text-emerald-400 font-medium">({selectedRisalah.jenisRapat})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">b. Pimpinan & Anggota DPRD Hadir</span>
                      <span className="font-semibold text-slate-200 block">{selectedRisalah.pimpinanRapat}</span>
                      <span className="text-slate-400 font-normal">{selectedRisalah.anggotaHadir}</span>
                    </div>
                  </div>
                  {selectedRisalah.namaNotulis && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">c. Notulis / Pembuat Risalah</span>
                      <span className="font-semibold text-emerald-300">{selectedRisalah.namaNotulis}</span>
                      {selectedRisalah.nipNotulis && (
                        <span className="text-slate-400 text-[11px] ml-2 font-mono">(NIP. {selectedRisalah.nipNotulis})</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Section B2: Analisis Sentimen NLP AI */}
                <SentimentAnalysisSummary
                  variant="meeting-detail"
                  selectedRisalah={selectedRisalah}
                />

                {/* Section C: Transkrip Teks Pembicara dengan Timestamp */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      d. Timestamp & Transkrip Teks Pembicara (Speech-to-Text AI)
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {selectedRisalah.transkripPembicara.length} Kutipan Pembicaraan
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                    {selectedRisalah.transkripPembicara.map((t, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1 hover:border-slate-700 transition"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-emerald-300">{t.pembicara}</span>
                            {t.sentimen && (
                              <span
                                className={`px-2 py-0.2 rounded text-[10px] font-bold border ${
                                  t.sentimen === 'Positif'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                    : t.sentimen === 'Negatif'
                                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                    : t.sentimen === 'Perdebatan / Kritis'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                    : 'bg-slate-800 text-slate-300 border-slate-700'
                                }`}
                              >
                                {t.sentimen}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {t.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed italic">"{t.pernyataan}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section D: Resume Poin Utama & Kesimpulan / Keputusan Rapat */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                    <h5 className="font-bold text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      e1. Resume Poin-Poin Utama
                    </h5>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                      {selectedRisalah.resumePoinUtama.map((poin, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {poin}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-950 border border-emerald-900/50 rounded-xl p-4 text-xs space-y-2">
                    <h5 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      e2. Kesimpulan / Keputusan Rapat
                    </h5>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-200">
                      {selectedRisalah.kesimpulanKeputusan.map((kes, idx) => (
                        <li key={idx} className="leading-relaxed font-medium">
                          {kes}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Export & Footer Management Actions */}
                <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-800 text-xs gap-3">
                  <div className="space-y-0.5 text-slate-400 text-[11px]">
                    <div>
                      Dibuat pada: <strong className="text-slate-300">{selectedRisalah.createdDate}</strong> &bull; E-Parlemen Sekretariat DPRD Sulbar
                    </div>
                    {selectedRisalah.namaNotulis && (
                      <div className="text-slate-500">
                        Notulis Penanggung Jawab: <span className="text-slate-400 font-semibold">{selectedRisalah.namaNotulis}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRisalah(selectedRisalah);
                        setIsRisalahModalOpen(true);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow text-xs active:scale-95"
                      title="Edit Dokumen Risalah Ini"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Risalah</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPdfModalOpen(true)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition text-xs active:scale-95"
                      title="Pratinjau Kop Surat Resmi & Cetak"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Pratinjau Kop Surat</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerDirectPdfDownload(selectedRisalah);
                        triggerToast('Unduh PDF', 'Menyiapkan berkas PDF resmi untuk diunduh/dicetak...', 'info');
                      }}
                      className="bg-slate-800 hover:bg-emerald-950/60 text-emerald-300 font-semibold px-3.5 py-2 rounded-xl border border-emerald-800/60 flex items-center gap-1.5 transition shadow text-xs active:scale-95"
                      title="Unduh File PDF Dokumen Risalah Rapat"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Unduh PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const jsonStr = JSON.stringify(selectedRisalah, null, 2);
                        const blob = new Blob([jsonStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${selectedRisalah.nomorRisalah.replace(/[\/\\:]/g, '_')}.json`;
                        a.click();
                        triggerToast('Export JSON', 'Data risalah berhasil diexport ke format JSON.', 'info');
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition text-xs"
                      title="Ekspor Data Format JSON"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Export JSON</span>
                    </button>
                    {onDeleteRisalah && (
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteConfirmTarget({
                            type: 'risalah',
                            id: selectedRisalah.id,
                            title: selectedRisalah.judulRapat,
                          });
                        }}
                        className="bg-red-950/50 hover:bg-red-600 text-red-400 hover:text-white px-3 py-2 rounded-xl border border-red-800/60 hover:border-red-500 flex items-center gap-1.5 transition text-xs font-semibold active:scale-95"
                        title="Hapus Dokumen Risalah Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400 space-y-3 shadow-xl">
                <div className="p-3 bg-slate-800/80 text-emerald-400 rounded-2xl w-fit mx-auto border border-slate-700">
                  <FileText className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-sm text-slate-200">Belum Ada Dokumen Risalah Terpilih</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Pilih salah satu risalah dari tabel arsip di bawah, gunakan fitur Pencarian Pintar (Smart Search), atau buat risalah rapat baru secara manual.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRisalah(null);
                      setIsRisalahModalOpen(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition inline-flex items-center gap-1.5 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Risalah Baru</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tabel Arsip Dokumen Risalah */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-sm text-slate-100">
                    Arsip & Pengelolaan Dokumen Risalah Rapat ({risalahList.length})
                  </h4>
                </div>
                <button
                  onClick={() => {
                    setEditingRisalah(null);
                    setIsRisalahModalOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Risalah Baru</span>
                </button>
              </div>

              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="p-3">Nomor & Jenis</th>
                      <th className="p-3">Judul Rapat</th>
                      <th className="p-3">Notulis / Pembuat</th>
                      <th className="p-3">Status Rekam Jejak</th>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3 text-right">Aksi & Pengelolaan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {risalahList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-500 text-xs">
                          Belum ada arsip dokumen risalah rapat di sistem.
                        </td>
                      </tr>
                    ) : (
                      risalahList.map((item) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-800/50 transition ${
                          selectedRisalah?.id === item.id ? 'bg-slate-800/80 text-white' : ''
                        }`}
                      >
                        <td className="p-3">
                          <span className="font-mono font-bold text-emerald-400 block">
                            {item.nomorRisalah}
                          </span>
                          <span className="text-[10px] text-slate-400">{item.jenisRapat}</span>
                        </td>
                        <td className="p-3 font-medium max-w-xs">
                          <span className="line-clamp-2">{item.judulRapat}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-medium text-slate-200 block">
                            {item.namaNotulis || 'Notulis DPRD'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {item.nipNotulis ? `NIP. ${item.nipNotulis}` : '-'}
                          </span>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {(() => {
                            const itemTahap = item.statusTahap || '6. Disahkan & Final';
                            const meta = TAHAPAN_RISALAH_METADATA[itemTahap];
                            const pct = item.progressPersen !== undefined ? item.progressPersen : 100;
                            return (
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                      meta?.warnaBadge || 'bg-slate-800 text-slate-300'
                                    }`}
                                  >
                                    {meta?.labelSingkat || itemTahap}
                                  </span>
                                  <span className="font-mono text-[10px] text-emerald-400 font-semibold">
                                    {pct}%
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTrackingTargetRisalah(item);
                                    setIsTrackingModalOpen(true);
                                  }}
                                  className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition underline decoration-slate-600 hover:decoration-emerald-400"
                                >
                                  <History className="w-2.5 h-2.5" />
                                  <span>Lihat / Update Log</span>
                                </button>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">
                          {item.createdDate}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedRisalah(item)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium transition"
                            >
                              Buka
                            </button>
                            <button
                              onClick={() => {
                                setEditingRisalah(item);
                                setIsRisalahModalOpen(true);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-emerald-900/60 text-emerald-400 rounded-lg transition"
                              title="Edit Risalah"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => triggerDirectPdfDownload(item)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow"
                              title="Unduh File PDF Dokumen Risalah"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Unduh PDF</span>
                            </button>
                            {onDeleteRisalah && (
                              <button
                                onClick={() => {
                                  setDeleteConfirmTarget({
                                    type: 'risalah',
                                    id: item.id,
                                    title: item.judulRapat,
                                  });
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-red-950/80 text-red-400 rounded-lg transition"
                                title="Hapus Risalah"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* TAB 2: E-LEGISLASI (RANPERDA WORKFLOW & MULTI-INSTITUTION TRACKING) */}
      {activeTab === 'legislasi' && <ELegislasiMain />}

      {/* TAB 3: MODUL 3 - E-TRACKING REKOMENDASI RDP (CORE ENGINE) */}
      {activeTab === 'rdp' && <ETrackingRdpMain />}




      {/* Form Modals for Data Input */}
      <RisalahUpdateTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => {
          setIsTrackingModalOpen(false);
          setTrackingTargetRisalah(null);
        }}
        risalah={trackingTargetRisalah}
        onUpdateRisalah={(updated) => {
          if (onUpdateRisalah) onUpdateRisalah(updated);
          if (selectedRisalah?.id === updated.id) {
            setSelectedRisalah(updated);
          }
          triggerToast('Status Rekam Jejak Diperbarui', `Tahapan risalah kini diperbarui ke "${updated.statusTahap}".`, 'info');
        }}
      />

      <RisalahFormModal
        isOpen={isRisalahModalOpen}
        onClose={() => {
          setIsRisalahModalOpen(false);
          setEditingRisalah(null);
        }}
        onSave={(data) => {
          const isExisting = risalahList.some((r) => r.id === data.id);
          if (isExisting && onUpdateRisalah) {
            onUpdateRisalah(data);
            triggerToast('Risalah Berhasil Diperbarui', `Perubahan naskah risalah "${data.judulRapat}" telah disimpan.`, 'success');
          } else {
            onAddRisalah(data);
            triggerToast('Risalah Baru Ditambahkan', `Dokumen risalah "${data.judulRapat}" berhasil didaftarkan ke sistem.`, 'success');
          }
          setSelectedRisalah(data);
          setIsRisalahModalOpen(false);
          setEditingRisalah(null);
        }}
        initialData={editingRisalah}
      />

      <RanperdaFormModal
        isOpen={isRanperdaModalOpen}
        onClose={() => setIsRanperdaModalOpen(false)}
        onSave={(data) => {
          if (editingRanperda && onUpdateRanperda) {
            onUpdateRanperda(data);
          } else if (onAddRanperda) {
            onAddRanperda(data);
          }
        }}
        initialData={editingRanperda}
      />

      <RdpFormModal
        isOpen={isRdpModalOpen}
        onClose={() => setIsRdpModalOpen(false)}
        onSave={(data) => {
          if (editingRdp && onUpdateRdp) {
            onUpdateRdp(data);
          } else if (onAddRdp) {
            onAddRdp(data);
          }
        }}
        initialData={editingRdp}
      />

      <RisalahPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        risalah={selectedRisalah}
      />

      {/* Modal Konfirmasi Hapus Data */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 bg-red-950/80 border border-red-800 text-red-400 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Konfirmasi Hapus Data</h3>
                <p className="text-slate-400 text-xs">
                  {deleteConfirmTarget.type === 'risalah'
                    ? 'Arsip Dokumen Risalah Rapat'
                    : deleteConfirmTarget.type === 'ranperda'
                    ? 'Data Ranperda'
                    : 'Rekomendasi RDP'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong className="text-red-300 font-semibold">"{deleteConfirmTarget.title}"</strong>? Data yang telah dihapus tidak dapat dikembalikan.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirmTarget.type === 'risalah' && onDeleteRisalah) {
                    const deletedTitle = deleteConfirmTarget.title;
                    const deletedId = deleteConfirmTarget.id;
                    onDeleteRisalah(deletedId);
                    const remaining = risalahList.filter((r) => r.id !== deletedId);
                    setSelectedRisalah(remaining.length > 0 ? remaining[0] : null);
                    triggerToast('Risalah Dihapus', `Dokumen risalah "${deletedTitle}" telah berhasil dihapus dari sistem.`, 'warning');
                  } else if (deleteConfirmTarget.type === 'ranperda' && onDeleteRanperda) {
                    onDeleteRanperda(deleteConfirmTarget.id);
                    triggerToast('Ranperda Dihapus', `Data ranperda "${deleteConfirmTarget.title}" telah dihapus.`, 'warning');
                  } else if (deleteConfirmTarget.type === 'rdp' && onDeleteRdp) {
                    onDeleteRdp(deleteConfirmTarget.id);
                    triggerToast('RDP Dihapus', `Data rekomendasi "${deleteConfirmTarget.title}" telah dihapus.`, 'warning');
                  }
                  setDeleteConfirmTarget(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notification Toast Banner */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 text-xs animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-xl shrink-0 ${
                activeToast.type === 'warning'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : activeToast.type === 'info'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {activeToast.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4" />
              ) : activeToast.type === 'info' ? (
                <Info className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 space-y-0.5">
              <h5 className="font-bold text-slate-100">{activeToast.title}</h5>
              <p className="text-slate-300 leading-relaxed text-[11px]">{activeToast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveToast(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
