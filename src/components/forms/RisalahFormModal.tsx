import React, { useState, useEffect } from 'react';
import { RisalahItem, JenisRapat } from '../../types';
import { RichTextEditor } from './RichTextEditor';
import { PesertaRapatManagerModal } from '../PesertaRapatManagerModal';
import { createDefaultTrackingSteps, createAuditLogEntry } from '../../utils/risalahTracking';
import { normalizeTranscriptDocument } from '../../utils/indonesianTextNormalizer';
import { apiRefineTranscriptBaku } from '../../utils/supabaseApi';
import { X, FileText, Save, Plus, Trash2, Maximize2, Sparkles, Users, RefreshCw, CheckCircle2, Building2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: RisalahItem) => void;
  initialData?: RisalahItem | null;
}

export const RisalahFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [nomorRisalah, setNomorRisalah] = useState('');
  const [judulRapat, setJudulRapat] = useState('');
  const [jenisRapat, setJenisRapat] = useState<JenisRapat>('Rapat Paripurna');
  const [hariTanggalWaktu, setHariTanggalWaktu] = useState('');
  const [ruanganRapat, setRuanganRapat] = useState('Ruang Sidang Paripurna Utama');
  const [pimpinanRapat, setPimpinanRapat] = useState('');
  const [anggotaHadir, setAnggotaHadir] = useState('');
  const [namaNotulis, setNamaNotulis] = useState('');
  const [nipNotulis, setNipNotulis] = useState('');
  const [isPesertaModalOpen, setIsPesertaModalOpen] = useState(false);
  
  // Rich Text Inputs
  const [poinUtamaInput, setPoinUtamaInput] = useState<string[]>(['']);
  const [kesimpulanInput, setKesimpulanInput] = useState<string[]>(['']);
  const [transkripCatatanHtml, setTranskripCatatanHtml] = useState('');
  const [initialFormattedTranscript, setInitialFormattedTranscript] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [refineNotice, setRefineNotice] = useState<string | null>(null);

  useEffect(() => {
    setFormError(null);
    if (initialData) {
      setNomorRisalah(initialData.nomorRisalah);
      setJudulRapat(initialData.judulRapat);
      setJenisRapat(initialData.jenisRapat);
      setHariTanggalWaktu(initialData.hariTanggalWaktu);
      setRuanganRapat(initialData.ruanganRapat || 'Ruang Sidang Paripurna Utama');
      setPimpinanRapat(initialData.pimpinanRapat);
      setAnggotaHadir(initialData.anggotaHadir);
      setNamaNotulis(initialData.namaNotulis || 'Arianto, AP, M.M.');
      setNipNotulis(initialData.nipNotulis || '19720412 199803 1 004');
      setPoinUtamaInput(
        initialData.resumePoinUtama.length > 0 ? initialData.resumePoinUtama : ['']
      );
      setKesimpulanInput(
        initialData.kesimpulanKeputusan.length > 0 ? initialData.kesimpulanKeputusan : ['']
      );
      
      // Combine transcripts if existing
      if (initialData.transkripPembicara && initialData.transkripPembicara.length > 0) {
        const formatted = initialData.transkripPembicara
          .map((t) => `<b>${t.pembicara} (${t.timestamp}):</b> ${t.pernyataan}`)
          .join('<br/><br/>');
        setTranskripCatatanHtml(formatted);
        setInitialFormattedTranscript(formatted);
      } else {
        setTranskripCatatanHtml('');
        setInitialFormattedTranscript('');
      }
    } else {
      setNomorRisalah(`Risalah/PAR/${Math.floor(10 + Math.random() * 90)}/2026`);
      setJudulRapat('');
      setJenisRapat('Rapat Paripurna');
      setHariTanggalWaktu('Kamis, 30 Juli 2026 - 09.00 WITA');
      setRuanganRapat('Ruang Sidang Paripurna Utama');
      setPimpinanRapat('Dr. H. Amalia Aras, S.E., M.M.');
      setAnggotaHadir('38 dari 41 Anggota DPRD Sulbar & OPD Pemprov');
      setNamaNotulis('Arianto, AP, M.M.');
      setNipNotulis('19720412 199803 1 004');
      setPoinUtamaInput(['']);
      setKesimpulanInput(['']);
      setTranskripCatatanHtml('');
      setInitialFormattedTranscript('');
    }
  }, [initialData, isOpen]);

  const handleAddPoinUtama = () => {
    setPoinUtamaInput((prev) => [...prev, '']);
  };

  const handlePoinUtamaChange = (index: number, val: string) => {
    setPoinUtamaInput((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemovePoinUtama = (index: number) => {
    setPoinUtamaInput((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddKesimpulan = () => {
    setKesimpulanInput((prev) => [...prev, '']);
  };

  const handleKesimpulanChange = (index: number, val: string) => {
    setKesimpulanInput((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemoveKesimpulan = (index: number) => {
    setKesimpulanInput((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulRapat.trim()) {
      setFormError('Judul Agenda Rapat wajib diisi.');
      return;
    }
    setFormError(null);

    // Process transcripts from rich text HTML if entered or modified
    let parsedTranscripts = initialData ? initialData.transkripPembicara : [];
    
    if (initialData && transkripCatatanHtml === initialFormattedTranscript) {
      parsedTranscripts = initialData.transkripPembicara;
    } else if (transkripCatatanHtml.trim()) {
      const rawLines = transkripCatatanHtml
        .replace(/<p[^>]*>/gi, '')
        .replace(/<\/p>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<div[^>]*>/gi, '')
        .replace(/<\/div>/gi, '\n')
        .replace(/<[^>]*>?/gm, '')
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const itemsFromText: typeof parsedTranscripts = [];

      for (const line of rawLines) {
        const parenColonMatch = line.match(/^([^(]+)\s*\(([^)]+)\):\s*(.*)$/);
        const bracketMatch = !parenColonMatch ? line.match(/^\[([^\]]+)\]:\s*(.*)$/) : null;
        const colonMatch = !parenColonMatch && !bracketMatch ? line.match(/^([^:]+):\s*(.*)$/) : null;

        if (parenColonMatch) {
          itemsFromText.push({
            pembicara: parenColonMatch[1].trim(),
            timestamp: parenColonMatch[2].trim(),
            pernyataan: parenColonMatch[3].trim() || line,
            sentimen: 'Netral',
          });
        } else if (bracketMatch) {
          itemsFromText.push({
            pembicara: bracketMatch[1].trim(),
            timestamp: 'Transkrip Rekaman',
            pernyataan: bracketMatch[2].trim() || line,
            sentimen: 'Netral',
          });
        } else if (colonMatch && colonMatch[1].length < 60) {
          itemsFromText.push({
            pembicara: colonMatch[1].trim(),
            timestamp: 'Transkrip Rekaman',
            pernyataan: colonMatch[2].trim() || line,
            sentimen: 'Netral',
          });
        } else {
          if (itemsFromText.length > 0) {
            itemsFromText[itemsFromText.length - 1].pernyataan += ' ' + line;
          } else {
            itemsFromText.push({
              pembicara: 'Catatan / Notulensi Rapat',
              timestamp: 'Transkrip Rekaman',
              pernyataan: line,
              sentimen: 'Netral',
            });
          }
        }
      }

      if (itemsFromText.length > 0) {
        parsedTranscripts = itemsFromText;
      }
    }

    const currentNotulis = namaNotulis.trim() || 'Arianto, AP, M.M.';
    const currentNip = nipNotulis.trim() || '19720412 199803 1 004';
    const cleanPoints = poinUtamaInput.filter((p) => p.replace(/<[^>]*>/g, '').trim() !== '' || p.trim() !== '');
    const cleanConclusions = kesimpulanInput.filter((k) => k.replace(/<[^>]*>/g, '').trim() !== '' || k.trim() !== '');

    const nextLogs = initialData?.auditLogs && initialData.auditLogs.length > 0
      ? [
          createAuditLogEntry(
            initialData.statusTahap || '4. Verifikasi & Telaah Notulis',
            currentNotulis,
            `Pembaruan naskah risalah resmi berhasil disimpan (Editor Notulensi DPRD Sulbar).`,
            `v${((initialData.auditLogs.length + 1) * 0.5 + 1).toFixed(1)}`
          ),
          ...initialData.auditLogs,
        ]
      : [
          createAuditLogEntry(
            '4. Verifikasi & Telaah Notulis',
            currentNotulis,
            'Penyusunan naskah risalah awal melalui lembar kerja input risalah.',
            'v1.0'
          ),
        ];

    const item: RisalahItem = {
      id: initialData ? initialData.id : `RSL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      nomorRisalah: nomorRisalah.trim(),
      judulRapat: judulRapat.trim(),
      jenisRapat,
      hariTanggalWaktu: hariTanggalWaktu.trim(),
      ruanganRapat: ruanganRapat.trim() || 'Ruang Sidang Paripurna Utama',
      pimpinanRapat: pimpinanRapat.trim(),
      anggotaHadir: anggotaHadir.trim(),
      namaNotulis: currentNotulis,
      nipNotulis: currentNip,
      transkripPembicara: parsedTranscripts,
      resumePoinUtama: cleanPoints.length > 0 ? cleanPoints : ['Pembahasan agenda persidangan dewan.'],
      kesimpulanKeputusan: cleanConclusions.length > 0 ? cleanConclusions : ['Hasil persidangan disahkan untuk tindak lanjut.'],
      statusTahap: initialData?.statusTahap || '4. Verifikasi & Telaah Notulis',
      progressPersen: initialData?.progressPersen !== undefined ? initialData.progressPersen : 75,
      tahapTracking: initialData?.tahapTracking || createDefaultTrackingSteps('4. Verifikasi & Telaah Notulis', currentNotulis),
      auditLogs: nextLogs,
      topikKategori: initialData?.topikKategori,
      kataKunciPintar: initialData?.kataKunciPintar,
      createdDate: initialData?.createdDate || new Date().toISOString().split('T')[0],
    };

    onSave(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl text-slate-100 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header - Enlarged Workspace Banner */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-100">
                  {initialData ? 'Edit Dokumen Risalah Rapat' : 'Tambah Risalah Rapat Manual (Editor Luas)'}
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" /> Lembar Kerja Diperbesar
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Layanan Input Risalah Persidangan DPRD Sulbar dengan Fitur Pengolah Kata Ms. Word (Bold, Italic, Underline, Bullet, Numbering)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Enlarged inputs & Rich Text Editing */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-100">
          {formError && (
            <div className="bg-red-950/80 border border-red-700/80 rounded-xl p-3.5 flex items-center justify-between text-xs text-red-200">
              <span className="font-semibold">{formError}</span>
              <button
                type="button"
                onClick={() => setFormError(null)}
                className="text-red-400 hover:text-white ml-2 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Top Row: Meta Parameters */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Nomor Register Risalah
              </label>
              <input
                type="text"
                value={nomorRisalah}
                onChange={(e) => setNomorRisalah(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Jenis Persidangan / Rapat
              </label>
              <select
                value={jenisRapat}
                onChange={(e: any) => setJenisRapat(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-semibold"
              >
                <optgroup label="Rapat Paripurna & Musyawarah">
                  <option value="Rapat Paripurna">Rapat Paripurna</option>
                  <option value="Rapat Bamus">Rapat Bamus (Badan Musyawarah)</option>
                  <option value="Rapat Dengar Pendapat (RDP)">Rapat Dengar Pendapat (RDP)</option>
                </optgroup>
                <optgroup label="Alat Kelengkapan Dewan (AKD)">
                  <option value="Rapat Banggar">Rapat Banggar (Badan Anggaran)</option>
                  <option value="Rapat BK">Rapat BK (Badan Kehormatan)</option>
                  <option value="Rapat Bapemperda">Rapat Bapemperda</option>
                </optgroup>
                <optgroup label="Rapat Komisi DPRD Sulbar">
                  <option value="Rapat Komisi I">Rapat Komisi I</option>
                  <option value="Rapat Komisi II">Rapat Komisi II</option>
                  <option value="Rapat Komisi III">Rapat Komisi III</option>
                  <option value="Rapat Komisi IV">Rapat Komisi IV</option>
                  <option value="Rapat Komisi">Rapat Komisi (Gabungan / Umum)</option>
                </optgroup>
                <optgroup label="Pimpinan & Sekretariat">
                  <option value="Rapat Pimpinan">Rapat Pimpinan</option>
                  <option value="Rapat Pimpinan di Perluas">Rapat Pimpinan di Perluas</option>
                  <option value="Rapat Sekretariat DPRD">Rapat Sekretariat DPRD</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Hari, Tanggal & Waktu Pelaksanaan
              </label>
              <input
                type="text"
                value={hariTanggalWaktu}
                onChange={(e) => setHariTanggalWaktu(e.target.value)}
                placeholder="Kamis, 30 Juli 2026 - 09.00 WITA"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Ruangan Rapat / Lokasi</span>
              </label>
              <input
                type="text"
                list="daftar-ruangan-rapat"
                value={ruanganRapat}
                onChange={(e) => setRuanganRapat(e.target.value)}
                placeholder="Pilih atau ketik ruangan..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                required
              />
              <datalist id="daftar-ruangan-rapat">
                <option value="Ruang Sidang Paripurna Utama" />
                <option value="Ruang Rapat Badan Musyawarah (Bamus) Lantai 1" />
                <option value="Ruang Rapat Badan Anggaran (Banggar)" />
                <option value="Ruang Rapat Pimpinan Gedung Utama" />
                <option value="Ruang Rapat Komisi I Gedung A" />
                <option value="Ruang Rapat Komisi II Gedung A" />
                <option value="Ruang Rapat Komisi III Gedung B" />
                <option value="Ruang Rapat Komisi IV Gedung A" />
                <option value="Ruang Rapat Bapemperda" />
                <option value="Ruang Rapat Sekretariat Dewan" />
                <option value="Aula Serbaguna DPRD Prov. Sulbar" />
              </datalist>
            </div>
          </div>

          {/* Judul Agenda Rapat */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Judul Agenda / Topik Rapat Persidangan
            </label>
            <input
              type="text"
              value={judulRapat}
              onChange={(e) => setJudulRapat(e.target.value)}
              placeholder="Contoh: Rapat Paripurna Penyampaian Nota Keuangan dan LKPJ Gubernur Sulbar TA 2025"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-base text-emerald-300 font-bold focus:outline-none focus:border-emerald-500 placeholder:font-normal placeholder:text-sm"
              required
            />
          </div>

          {/* Row: Pimpinan & Anggota Hadir */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Pimpinan Rapat Persidangan
              </label>
              <input
                type="text"
                value={pimpinanRapat}
                onChange={(e) => setPimpinanRapat(e.target.value)}
                placeholder="Dr. H. Amalia Aras, S.E., M.M."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-200">
                  Kehadiran Anggota Dewan & Undangan OPD
                </label>
                <button
                  type="button"
                  onClick={() => setIsPesertaModalOpen(true)}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 px-2 py-0.5 rounded-lg transition"
                >
                  <Users className="w-3 h-3" />
                  <span>+ Pilih / Input Peserta Rapat</span>
                </button>
              </div>
              <input
                type="text"
                value={anggotaHadir}
                onChange={(e) => setAnggotaHadir(e.target.value)}
                placeholder="38 dari 41 Anggota DPRD Sulbar & Kepala Dinas Pemprov"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Row: Notulis / Pembuat Risalah & NIP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/40 p-3.5 border border-slate-800/80 rounded-xl">
            <div>
              <label className="block text-xs font-bold text-emerald-400 mb-1">
                Nama Notulis / Pembuat Risalah Rapat (Akan Tertulis di Dokumen PDF)
              </label>
              <input
                type="text"
                value={namaNotulis}
                onChange={(e) => setNamaNotulis(e.target.value)}
                placeholder="Arianto, AP, M.M."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-400 mb-1">
                NIP Notulis / Pembuat Risalah
              </label>
              <input
                type="text"
                value={nipNotulis}
                onChange={(e) => setNipNotulis(e.target.value)}
                placeholder="19720412 199803 1 004"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Ms Word Style Rich Editor: Poin Utama Resume */}
          <div className="space-y-3 bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-slate-100 block">
                  Poin-Poin Utama Resume Pembahasan Rapat
                </label>
                <p className="text-xs text-slate-400">
                  Gunakan format penulisan Ms. Word (Garis Tebal, Miring, Garis Bawah, Daftar Bullet & Numbering)
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddPoinUtama}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Poin Baru
              </button>
            </div>

            {poinUtamaInput.map((pt, idx) => (
              <div key={idx} className="space-y-1 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">
                    Poin Utama #{idx + 1}
                  </span>
                  {poinUtamaInput.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePoinUtama(idx)}
                      className="text-xs text-red-400 hover:text-red-300 hover:bg-slate-800 px-2 py-0.5 rounded transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  )}
                </div>
                <RichTextEditor
                  value={pt}
                  onChange={(val) => handlePoinUtamaChange(idx, val)}
                  placeholder={`Ketik poin pembahasan rapat #${idx + 1} di sini... Gunakan toolbar di atas untuk cetak tebal, miring, atau penomoran list.`}
                  minHeight="90px"
                />
              </div>
            ))}
          </div>

          {/* Ms Word Style Rich Editor: Kesimpulan & Keputusan */}
          <div className="space-y-3 bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-slate-100 block">
                  Kesimpulan & Keputusan Resmi Persidangan
                </label>
                <p className="text-xs text-slate-400">
                  Format keputusan rapat dewan dengan dukungan fitur pemformatan teks lengkap
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddKesimpulan}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Keputusan
              </button>
            </div>

            {kesimpulanInput.map((ks, idx) => (
              <div key={idx} className="space-y-1 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">
                    Keputusan #{idx + 1}
                  </span>
                  {kesimpulanInput.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveKesimpulan(idx)}
                      className="text-xs text-red-400 hover:text-red-300 hover:bg-slate-800 px-2 py-0.5 rounded transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  )}
                </div>
                <RichTextEditor
                  value={ks}
                  onChange={(val) => handleKesimpulanChange(idx, val)}
                  placeholder={`Ketik teks keputusan resmi #${idx + 1} di sini...`}
                  minHeight="90px"
                />
              </div>
            ))}
          </div>

          {/* Ms Word Style Rich Editor: Transkrip / Catatan Pembicaraan Rapat */}
          <div className="space-y-2 bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-sm font-bold text-slate-100 block">
                  Catatan Petikan Transkrip Pembicara Dewan (Opsional / Lengkap)
                </label>
                <p className="text-xs text-slate-400">
                  Tempat mengetik atau menempelkan seluruh kutipan dan jalannya persidangan dewan secara leluasa.
                </p>
              </div>

              <button
                type="button"
                onClick={async () => {
                  if (!transkripCatatanHtml.trim()) return;
                  setIsRefining(true);
                  setRefineNotice(null);
                  try {
                    const res = await apiRefineTranscriptBaku(transkripCatatanHtml, {
                      judulRapat,
                      jenisRapat,
                    });
                    if (res.success && res.refinedTranscript) {
                      setTranskripCatatanHtml(res.refinedTranscript);
                      setRefineNotice('✨ Transkrip berhasil diselaraskan ke Bahasa Indonesia Baku Resmi.');
                      setTimeout(() => setRefineNotice(null), 4000);
                    } else {
                      const local = normalizeTranscriptDocument(transkripCatatanHtml);
                      setTranskripCatatanHtml(local.normalizedText);
                      setRefineNotice(`✨ Diselaraskan ke Bahasa Baku (${local.wordsReplacedCount} kata diperbaiki).`);
                      setTimeout(() => setRefineNotice(null), 4000);
                    }
                  } catch {
                    const local = normalizeTranscriptDocument(transkripCatatanHtml);
                    setTranskripCatatanHtml(local.normalizedText);
                    setRefineNotice(`✨ Diselaraskan ke Bahasa Baku (${local.wordsReplacedCount} kata diperbaiki).`);
                    setTimeout(() => setRefineNotice(null), 4000);
                  } finally {
                    setIsRefining(false);
                  }
                }}
                disabled={isRefining || !transkripCatatanHtml.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition shadow"
              >
                {isRefining ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Membakuisasikan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>✨ Rapikan ke Bahasa Baku (AI)</span>
                  </>
                )}
              </button>
            </div>

            {refineNotice && (
              <div className="bg-emerald-950/70 border border-emerald-500/50 rounded-xl p-2.5 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{refineNotice}</span>
              </div>
            )}

            <RichTextEditor
              value={transkripCatatanHtml}
              onChange={(val) => setTranskripCatatanHtml(val)}
              placeholder="Ketik atau tempelkan kutipan pembicaraan rapat dewan di sini... Anda dapat memberi tanda tebal pada nama anggota dewan, underline pada angka penting, serta bullet/numbering list..."
              minHeight="180px"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Dokumen e-Risalah akan tersimpan secara terstruktur di database DPRD Sulbar.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-xl flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Risalah Rapat</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <PesertaRapatManagerModal
        isOpen={isPesertaModalOpen}
        onClose={() => setIsPesertaModalOpen(false)}
        onApplyToRisalah={(text) => {
          setAnggotaHadir(text.replace(/\n/g, '; '));
        }}
      />
    </div>
  );
};
