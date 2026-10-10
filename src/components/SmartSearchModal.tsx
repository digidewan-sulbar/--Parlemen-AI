import React, { useState, useMemo } from 'react';
import {
  RisalahItem,
  RdpRecommendationItem,
  PressReleaseItem,
  RanperdaItem,
  AgendaPimpinanItem,
  SearchResultItem,
  SearchFilters,
  PillarType,
} from '../types';
import {
  Search,
  Filter,
  Calendar,
  User,
  Building,
  FileText,
  ExternalLink,
  Sparkles,
  X,
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Megaphone,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  risalahList: RisalahItem[];
  rdpRecommendations: RdpRecommendationItem[];
  pressReleases: PressReleaseItem[];
  ranperdaList: RanperdaItem[];
  agendaPimpinanList: AgendaPimpinanItem[];
  onNavigateToDocument: (pillar: PillarType, docId?: string, docType?: string) => void;
}

export const SmartSearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  risalahList,
  rdpRecommendations,
  pressReleases,
  ranperdaList,
  agendaPimpinanList,
  onNavigateToDocument,
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    docType: 'ALL',
    startDate: '',
    endDate: '',
    anggotaDprd: '',
    opdName: '',
  });

  if (!isOpen) return null;

  // Compile structured list of search results
  const searchResults = useMemo(() => {
    const results: SearchResultItem[] = [];

    const kw = filters.keyword.toLowerCase().trim();
    const mbr = filters.anggotaDprd.toLowerCase().trim();
    const opd = filters.opdName.toLowerCase().trim();

    // 1. Risalah Rapat
    if (filters.docType === 'ALL' || filters.docType === 'risalah') {
      risalahList.forEach((item) => {
        const titleMatch = item.judulRapat.toLowerCase().includes(kw) || item.nomorRisalah.toLowerCase().includes(kw);
        const resumeMatch = item.resumePoinUtama.some((p) => p.toLowerCase().includes(kw));
        const transcriptMatch = item.transkripPembicara.some(
          (t) => t.pembicara.toLowerCase().includes(kw) || t.pernyataan.toLowerCase().includes(kw)
        );

        const memberNames = Array.from(
          new Set([item.pimpinanRapat, ...item.transkripPembicara.map((t) => t.pembicara)])
        );
        const memberMatch = !mbr || memberNames.some((m) => m.toLowerCase().includes(mbr));

        // Date check
        const dateMatch =
          (!filters.startDate || item.createdDate >= filters.startDate) &&
          (!filters.endDate || item.createdDate <= filters.endDate);

        if ((!kw || titleMatch || resumeMatch || transcriptMatch) && memberMatch && dateMatch) {
          results.push({
            id: item.id,
            docType: 'risalah',
            title: item.judulRapat,
            subtitle: `${item.nomorRisalah} | ${item.jenisRapat}`,
            date: item.createdDate || '2026-07-28',
            snippet: item.resumePoinUtama[0] || item.transkripPembicara[0]?.pernyataan || '',
            memberNames,
            targetPillar: 'persidangan',
            rawItem: item,
          });
        }
      });
    }

    // 2. Rekomendasi RDP
    if (filters.docType === 'ALL' || filters.docType === 'rdp') {
      rdpRecommendations.forEach((item) => {
        const titleMatch =
          item.judulRdp.toLowerCase().includes(kw) ||
          item.nomorRdp.toLowerCase().includes(kw) ||
          item.poinCatatan.toLowerCase().includes(kw) ||
          item.perintahTindakLanjut.toLowerCase().includes(kw);

        const opdMatch = !opd || item.opdPenanggungJawab.toLowerCase().includes(opd);
        const memberMatch = !mbr || item.komisi.toLowerCase().includes(mbr);

        const dateMatch =
          (!filters.startDate || item.tenggatWaktu >= filters.startDate) &&
          (!filters.endDate || item.tenggatWaktu <= filters.endDate);

        if ((!kw || titleMatch) && opdMatch && memberMatch && dateMatch) {
          results.push({
            id: item.id,
            docType: 'rdp',
            title: item.judulRdp,
            subtitle: `${item.nomorRdp} | Komisi: ${item.komisi} | Status: ${item.status}`,
            date: item.tenggatWaktu,
            snippet: item.perintahTindakLanjut,
            opdName: item.opdPenanggungJawab,
            targetPillar: 'persidangan',
            rawItem: item,
          });
        }
      });
    }

    // 3. Ranperda
    if (filters.docType === 'ALL' || filters.docType === 'ranperda') {
      ranperdaList.forEach((item) => {
        const titleMatch =
          item.judulRanperda.toLowerCase().includes(kw) ||
          item.nomorRanperda.toLowerCase().includes(kw) ||
          item.keteranganProgres.toLowerCase().includes(kw);

        const memberMatch = !mbr || item.komisiPengampu.toLowerCase().includes(mbr);

        const dateMatch =
          (!filters.startDate || item.tanggalMulai >= filters.startDate) &&
          (!filters.endDate || item.tanggalMulai <= filters.endDate);

        if ((!kw || titleMatch) && memberMatch && dateMatch) {
          results.push({
            id: item.id,
            docType: 'ranperda',
            title: item.judulRanperda,
            subtitle: `${item.nomorRanperda} | Tahap ${item.tahapanKe}: ${item.namaTahapan}`,
            date: item.tanggalMulai,
            snippet: item.keteranganProgres,
            targetPillar: 'persidangan',
            rawItem: item,
          });
        }
      });
    }

    // 4. Agenda Pimpinan
    if (filters.docType === 'ALL' || filters.docType === 'agenda') {
      agendaPimpinanList.forEach((item) => {
        const titleMatch =
          item.namaKegiatan.toLowerCase().includes(kw) ||
          item.lokasi.toLowerCase().includes(kw) ||
          item.disposisiCatatan.toLowerCase().includes(kw);

        const memberMatch = !mbr || item.pimpinanBertugas.toLowerCase().includes(mbr);
        const opdMatch = !opd || item.instansiTerkait.toLowerCase().includes(opd);

        if ((!kw || titleMatch) && memberMatch && opdMatch) {
          results.push({
            id: item.id,
            docType: 'agenda',
            title: item.namaKegiatan,
            subtitle: `Waktu: ${item.tanggalWaktu} | Lokasi: ${item.lokasi}`,
            date: item.tanggalWaktu,
            snippet: item.disposisiCatatan,
            opdName: item.instansiTerkait,
            memberNames: [item.pimpinanBertugas],
            targetPillar: 'pimpinan',
            rawItem: item,
          });
        }
      });
    }

    // 5. Rilis Berita Humas
    if (filters.docType === 'ALL' || filters.docType === 'pressRelease') {
      pressReleases.forEach((item) => {
        const titleMatch =
          item.judulBerita.toLowerCase().includes(kw) ||
          item.kontenBerita.toLowerCase().includes(kw) ||
          item.kategori.toLowerCase().includes(kw);

        if (!kw || titleMatch) {
          results.push({
            id: item.id,
            docType: 'pressRelease',
            title: item.judulBerita,
            subtitle: `Rilis Berita | Kategori: ${item.kategori} | Status: ${item.status}`,
            date: item.tanggalRilis,
            snippet: item.kontenBerita.substring(0, 160) + '...',
            targetPillar: 'humas',
            rawItem: item,
          });
        }
      });
    }

    return results;
  }, [filters, risalahList, rdpRecommendations, ranperdaList, agendaPimpinanList, pressReleases]);

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      docType: 'ALL',
      startDate: '',
      endDate: '',
      anggotaDprd: '',
      opdName: '',
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Search Header */}
        <div className="bg-slate-950 p-6 border-b border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <Search className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Pencarian Cerdas Dokumen E-Parlemen</h3>
                <p className="text-xs text-slate-400">
                  Cari Lintas Risalah, Rekomendasi RDP, Ranperda, Agenda Pimpinan & Rilis Humas
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Keyword Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-emerald-400 absolute left-4 top-3.5" />
            <input
              type="text"
              autoFocus
              placeholder="Ketik kata kunci dokumen (misal: 'Kakao', 'Jalan Poros', 'Beasiswa', 'RTRW', 'Kemendagri')..."
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              className="w-full bg-slate-900 border-2 border-emerald-500/50 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400 shadow-inner"
            />
          </div>

          {/* Advanced Search Filter Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5 font-semibold">Jenis Dokumen</label>
              <select
                value={filters.docType}
                onChange={(e: any) => setFilters({ ...filters, docType: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">Semua Jenis Dokumen</option>
                <option value="risalah">Risalah Rapat AI</option>
                <option value="rdp">Rekomendasi RDP</option>
                <option value="ranperda">Ranperda 7 Tahapan</option>
                <option value="agenda">Agenda Pimpinan</option>
                <option value="pressRelease">Rilis Berita Humas</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5 font-semibold">Nama Anggota DPRD</label>
              <input
                type="text"
                placeholder="misal: Dr. H. Amalia, H. Usman"
                value={filters.anggotaDprd}
                onChange={(e) => setFilters({ ...filters, anggotaDprd: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5 font-semibold">Nama OPD Pemprov</label>
              <input
                type="text"
                placeholder="misal: Dinas PUPR, Diskominfo"
                value={filters.opdName}
                onChange={(e) => setFilters({ ...filters, opdName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5 font-semibold">Dari Tanggal</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5 font-semibold">Sampai Tanggal</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Preset Keyword Pills */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              <span className="text-slate-500 text-[11px] font-medium whitespace-nowrap">Pencarian Cepat:</span>
              {['Kakao & Sawit', 'Kerusakan Jalan', 'Beasiswa', 'RTRW', 'Diskominfo', 'Komisi III', 'PUPR'].map(
                (preset) => (
                  <button
                    key={preset}
                    onClick={() => setFilters({ ...filters, keyword: preset })}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-800 text-[11px] whitespace-nowrap transition"
                  >
                    #{preset}
                  </button>
                )
              )}
            </div>

            <button
              onClick={handleResetFilters}
              className="text-slate-400 hover:text-white text-[11px] underline whitespace-nowrap ml-2"
            >
              Reset Filter
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span>
              Menampilkan <span className="font-bold text-emerald-400">{searchResults.length}</span> Dokumen Terstruktur
            </span>
            <span className="text-[11px] text-slate-500 font-mono">E-Parlemen Smart Indexing Engine</span>
          </div>

          {searchResults.length > 0 ? (
            searchResults.map((item) => {
              const isRisalah = item.docType === 'risalah';
              const isRdp = item.docType === 'rdp';
              const isRanperda = item.docType === 'ranperda';
              const isAgenda = item.docType === 'agenda';

              return (
                <div
                  key={`${item.docType}-${item.id}`}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 text-xs space-y-2 transition shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1 ${
                          isRisalah
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : isRdp
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : isRanperda
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : isAgenda
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {isRisalah && <FileText className="w-3 h-3" />}
                        {isRdp && <Building className="w-3 h-3" />}
                        {isRanperda && <CheckCircle2 className="w-3 h-3" />}
                        {isAgenda && <Calendar className="w-3 h-3" />}
                        <span>
                          {isRisalah
                            ? 'Risalah Rapat'
                            : isRdp
                            ? 'Rekomendasi RDP'
                            : isRanperda
                            ? 'Ranperda'
                            : isAgenda
                            ? 'Agenda Pimpinan'
                            : 'Rilis Humas'}
                        </span>
                      </span>

                      <span className="text-slate-400 font-mono text-[11px]">{item.subtitle}</span>
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono">Tgl: {item.date}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-100">{item.title}</h4>

                  <p className="text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed italic">
                    "{item.snippet}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      {item.opdName && (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Building className="w-3 h-3" />
                          <span>{item.opdName}</span>
                        </span>
                      )}

                      {item.memberNames && item.memberNames.length > 0 && (
                        <span className="flex items-center gap-1 text-blue-300">
                          <User className="w-3 h-3" />
                          <span>{item.memberNames.slice(0, 2).join(', ')}</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        onNavigateToDocument(item.targetPillar, item.id, item.docType);
                        onClose();
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition text-[11px]"
                    >
                      <span>Buka Dokumen Original</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-slate-950 p-12 rounded-xl text-center text-slate-500 text-xs">
              Tidak ditemukan dokumen yang cocok dengan kata kunci dan kriteria filter saat ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
