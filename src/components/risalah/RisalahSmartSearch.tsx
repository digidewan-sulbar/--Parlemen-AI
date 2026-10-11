import React, { useState, useMemo } from 'react';
import { RisalahItem, TahapRisalah } from '../../types';
import { TAHAPAN_RISALAH_METADATA } from '../../utils/risalahTracking';
import {
  Search,
  Filter,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Tag,
  ArrowRight,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';
import { triggerDirectPdfDownload } from '../../utils/risalahPdf';
import { triggerDirectWordDownload } from '../../utils/risalahWord';

interface Props {
  risalahList: RisalahItem[];
  selectedRisalahId: string | null;
  onSelectRisalah: (risalah: RisalahItem) => void;
}

export const RisalahSmartSearch: React.FC<Props> = ({
  risalahList,
  selectedRisalahId,
  onSelectRisalah,
}) => {
  const [keyword, setKeyword] = useState('');
  const [selectedJenis, setSelectedJenis] = useState<string>('SEMUA');
  const [selectedTahap, setSelectedTahap] = useState<string>('SEMUA');
  const [selectedSentimen, setSelectedSentimen] = useState<string>('SEMUA');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Quick chips
  const quickChips = [
    { label: 'Kakao & Sawit', term: 'kakao' },
    { label: 'Kerusakan Jalan KM 42', term: 'jalan' },
    { label: 'Ekskavator PUPR', term: 'ekskavator' },
    { label: 'Kuorum 38 Anggota', term: 'kuorum' },
    { label: 'Beasiswa Sulbar Cerdas', term: 'beasiswa' },
    { label: 'Jadwal Bamus', term: 'bamus' },
    { label: 'Perdebatan Kritis', term: 'kritis' },
  ];

  // Search & Filter Logic
  const searchResults = useMemo(() => {
    const q = keyword.toLowerCase().trim();

    return risalahList.map((item) => {
      let isMatch = true;
      let matchedSnippets: Array<{
        type: 'transcript' | 'resume' | 'kesimpulan' | 'title';
        text: string;
        speaker?: string;
        timestamp?: string;
      }> = [];

      // Filter: Jenis Rapat
      if (selectedJenis !== 'SEMUA' && item.jenisRapat !== selectedJenis) {
        isMatch = false;
      }

      // Filter: Tahap Rekam Jejak
      if (selectedTahap !== 'SEMUA') {
        const itemTahap = item.statusTahap || '6. Disahkan & Final';
        if (itemTahap !== selectedTahap) {
          isMatch = false;
        }
      }

      // Filter: Sentimen
      if (selectedSentimen !== 'SEMUA') {
        const hasSentimentMatch = item.transkripPembicara.some(
          (t) => t.sentimen === selectedSentimen
        );
        if (!hasSentimentMatch) {
          isMatch = false;
        }
      }

      // Filter: Tanggal
      if (startDate && item.createdDate < startDate) {
        isMatch = false;
      }
      if (endDate && item.createdDate > endDate) {
        isMatch = false;
      }

      // Keyword Search
      if (q) {
        let keywordHit = false;

        // 1. Title or Nomor Risalah
        if (
          item.judulRapat.toLowerCase().includes(q) ||
          item.nomorRisalah.toLowerCase().includes(q) ||
          item.pimpinanRapat.toLowerCase().includes(q)
        ) {
          keywordHit = true;
          matchedSnippets.push({
            type: 'title',
            text: item.judulRapat,
          });
        }

        // 2. Transcripts
        item.transkripPembicara.forEach((t) => {
          if (
            t.pernyataan.toLowerCase().includes(q) ||
            t.pembicara.toLowerCase().includes(q) ||
            (t.nadaEmosi && t.nadaEmosi.toLowerCase().includes(q))
          ) {
            keywordHit = true;
            matchedSnippets.push({
              type: 'transcript',
              text: t.pernyataan,
              speaker: t.pembicara,
              timestamp: t.timestamp,
            });
          }
        });

        // 3. Resume
        item.resumePoinUtama.forEach((res) => {
          if (res.toLowerCase().includes(q)) {
            keywordHit = true;
            matchedSnippets.push({
              type: 'resume',
              text: res,
            });
          }
        });

        // 4. Kesimpulan
        item.kesimpulanKeputusan.forEach((kes) => {
          if (kes.toLowerCase().includes(q)) {
            keywordHit = true;
            matchedSnippets.push({
              type: 'kesimpulan',
              text: kes,
            });
          }
        });

        // 5. Tags / Topik
        if (
          item.topikKategori?.toLowerCase().includes(q) ||
          item.kataKunciPintar?.some((k) => k.toLowerCase().includes(q))
        ) {
          keywordHit = true;
        }

        if (!keywordHit) {
          isMatch = false;
        }
      }

      return {
        item,
        isMatch,
        matchedSnippets,
        matchCount: matchedSnippets.length,
      };
    }).filter((res) => res.isMatch);
  }, [risalahList, keyword, selectedJenis, selectedTahap, selectedSentimen, startDate, endDate]);

  const hasActiveFilters =
    keyword !== '' ||
    selectedJenis !== 'SEMUA' ||
    selectedTahap !== 'SEMUA' ||
    selectedSentimen !== 'SEMUA' ||
    startDate !== '' ||
    endDate !== '';

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedJenis('SEMUA');
    setSelectedTahap('SEMUA');
    setSelectedSentimen('SEMUA');
    setStartDate('');
    setEndDate('');
  };

  // Helper to highlight matched keyword in text
  const renderHighlightedText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={i}
              className="bg-emerald-400 text-slate-950 px-1 py-0.5 rounded font-bold"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-slate-100 shadow-xl space-y-4">
      {/* Top Banner & Search Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <span>Pencarian Pintar E-Risalah (Smart Search NLP)</span>
              <span className="bg-emerald-950 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-mono border border-emerald-800">
                AI Deep Search
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Temukan transkrip rapat, butir perdebatan, pembicara, kesimpulan, & rekam jejak risalah.
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 self-start sm:self-auto transition"
          >
            <RefreshCw className="w-3 h-3 text-emerald-400" />
            <span>Reset Pencarian</span>
          </button>
        )}
      </div>

      {/* Main Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-emerald-400" />
        </div>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Ketik kata kunci (misal: 'kakao', 'ekskavator', 'kuorum', 'beasiswa', atau nama pembicara)..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-24 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-inner"
        />
        {keyword && (
          <button
            onClick={() => setKeyword('')}
            className="absolute inset-y-0 right-10 pr-2 flex items-center text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setIsFilterExpanded((prev) => !prev)}
          className={`absolute inset-y-0 right-1.5 my-1 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
            isFilterExpanded || hasActiveFilters
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Tampilkan filter lanjutan"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>

      {/* Quick Keyword Chips */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          Rekomendasi Topik:
        </span>
        {quickChips.map((chip) => (
          <button
            key={chip.term}
            type="button"
            onClick={() => setKeyword(chip.term)}
            className={`text-[10px] px-2.5 py-1 rounded-full border transition flex items-center gap-1 ${
              keyword.toLowerCase() === chip.term.toLowerCase()
                ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-sm'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Expandable Advanced Filters Drawer */}
      {isFilterExpanded && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3 text-xs animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Filter Jenis Rapat */}
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                Jenis Rapat
              </label>
              <select
                value={selectedJenis}
                onChange={(e) => setSelectedJenis(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="SEMUA">Semua Jenis Rapat</option>
                <optgroup label="Paripurna & Umum">
                  <option value="Rapat Paripurna">Rapat Paripurna</option>
                  <option value="Rapat Bamus">Rapat Bamus</option>
                  <option value="Rapat Dengar Pendapat (RDP)">Rapat Dengar Pendapat (RDP)</option>
                </optgroup>
                <optgroup label="Alat Kelengkapan Dewan (AKD)">
                  <option value="Rapat Banggar">Rapat Banggar</option>
                  <option value="Rapat BK">Rapat BK</option>
                  <option value="Rapat Bapemperda">Rapat Bapemperda</option>
                </optgroup>
                <optgroup label="Komisi I - IV">
                  <option value="Rapat Komisi I">Rapat Komisi I</option>
                  <option value="Rapat Komisi II">Rapat Komisi II</option>
                  <option value="Rapat Komisi III">Rapat Komisi III</option>
                  <option value="Rapat Komisi IV">Rapat Komisi IV</option>
                  <option value="Rapat Komisi">Rapat Komisi (Umum)</option>
                </optgroup>
                <optgroup label="Pimpinan & Sekretariat">
                  <option value="Rapat Pimpinan">Rapat Pimpinan</option>
                  <option value="Rapat Pimpinan di Perluas">Rapat Pimpinan di Perluas</option>
                  <option value="Rapat Sekretariat DPRD">Rapat Sekretariat DPRD</option>
                </optgroup>
              </select>
            </div>

            {/* Filter Tahapan Rekam Jejak */}
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                Status Rekam Jejak
              </label>
              <select
                value={selectedTahap}
                onChange={(e) => setSelectedTahap(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="SEMUA">Semua Status Tahapan</option>
                <option value="6. Disahkan & Final">Disahkan & Final</option>
                <option value="5. Penyelarasan & Paraf Kabag">Paraf Kabag</option>
                <option value="4. Verifikasi & Telaah Notulis">Verifikasi Notulis</option>
                <option value="3. Olah & Standardisasi Kalimat Baku AI">Olah Baku AI</option>
                <option value="2. Transkripsi Suara-ke-Teks AI">Transkripsi AI</option>
                <option value="1. Perekaman Audio / Input Kasar">Perekaman Audio</option>
              </select>
            </div>

            {/* Filter Sentimen */}
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                Sentimen Transkrip
              </label>
              <select
                value={selectedSentimen}
                onChange={(e) => setSelectedSentimen(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="SEMUA">Semua Nada Sentimen</option>
                <option value="Positif">Positif / Konstruktif</option>
                <option value="Perdebatan / Kritis">Perdebatan / Kritis</option>
                <option value="Negatif">Negatif / Evaluasi</option>
                <option value="Netral">Netral Formal</option>
              </select>
            </div>

            {/* Date Filters */}
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                Filter Tanggal
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result Status Counter */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-2">
        <div className="flex items-center gap-1.5">
          <span>Hasil Pencarian:</span>
          <span className="font-bold text-emerald-400 font-mono">
            {searchResults.length}
          </span>
          <span>dari {risalahList.length} Dokumen Risalah</span>
          {hasActiveFilters && (
            <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2 py-0.2 rounded-full border border-emerald-800">
              Filter Aktif
            </span>
          )}
        </div>
        <span className="text-slate-500">
          Klik tombol "Buka Risalah" untuk menelaah isi lengkap
        </span>
      </div>

      {/* Matching Items Results List */}
      {searchResults.length === 0 ? (
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-8 text-center text-slate-400 space-y-2">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto opacity-70" />
          <p className="font-semibold text-xs text-slate-300">
            Tidak ditemukan dokumen risalah yang cocok dengan kriteria "{keyword}".
          </p>
          <p className="text-[11px] text-slate-500">
            Coba gunakan kata kunci yang lebih umum atau tekan tombol Reset Pencarian di atas.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
          {searchResults.map(({ item, matchedSnippets, matchCount }) => {
            const isSelected = selectedRisalahId === item.id;
            const itemTahap = item.statusTahap || '6. Disahkan & Final';
            const metaTahap = TAHAPAN_RISALAH_METADATA[itemTahap];

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? 'bg-slate-950 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-emerald-400 font-bold text-xs">
                        {item.nomorRisalah}
                      </span>
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-medium">
                        {item.jenisRapat}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${metaTahap.warnaBadge}`}
                      >
                        {metaTahap.labelSingkat}
                      </span>
                    </div>
                    <h4 className="font-semibold text-xs text-slate-100 hover:text-emerald-300 transition cursor-pointer" onClick={() => onSelectRisalah(item)}>
                      {renderHighlightedText(item.judulRapat, keyword)}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => onSelectRisalah(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 shadow'
                          : 'bg-emerald-600/80 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      <span>{isSelected ? 'Sedang Dibuka' : 'Buka Risalah'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => triggerDirectPdfDownload(item)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                      title="Unduh PDF Dokumen Risalah"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => triggerDirectWordDownload(item)}
                      className="p-1.5 bg-slate-800 hover:bg-blue-900/60 text-blue-300 rounded-lg transition"
                      title="Unduh Berkas Microsoft Word (.doc)"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Date & Speaker Info */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{item.hariTanggalWaktu.split(' | ')[0] || item.createdDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" />
                    <span className="text-slate-300">{item.pimpinanRapat.split(' (')[0]}</span>
                  </div>
                  {item.topikKategori && (
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-400/90">{item.topikKategori}</span>
                    </div>
                  )}
                </div>

                {/* Matched Snippet Preview */}
                {keyword && matchedSnippets.length > 0 && (
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Kutipan Ditemukan ({matchCount} titik):
                      </span>
                      {matchedSnippets[0].timestamp && (
                        <span className="font-mono text-slate-500">
                          {matchedSnippets[0].speaker} &bull; {matchedSnippets[0].timestamp}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 italic leading-relaxed">
                      "{renderHighlightedText(matchedSnippets[0].text, keyword)}"
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
