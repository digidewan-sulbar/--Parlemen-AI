import React, { useState, useEffect } from 'react';
import { PesertaRapatItem, AnggotaDprdItem } from '../types';
import { INITIAL_ANGGOTA_DPRD } from '../data/initialData';
import { PEJABAT_PEMPROV_SULBAR_2026, PejabatPemprovItem } from '../data/pejabatPemprovData';
import {
  X,
  UserPlus,
  Users,
  CheckSquare,
  Square,
  Copy,
  Printer,
  ExternalLink,
  Trash2,
  Check,
  Building2,
  Briefcase,
  User,
  Plus,
  FileText,
  DownloadCloud,
  Search,
  PhoneCall,
  UserCheck,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApplyToRisalah?: (formattedList: string) => void;
  onSelectSpeaker?: (nama: string, jabatan: string) => void;
  initialTab?: 'peserta' | 'dprd' | 'pejabat';
}

export const INITIAL_PESERTA_RAPAT: PesertaRapatItem[] = [
  {
    id: 'PR-1',
    nama: 'Dr. H. Amalia Aras, S.E., M.M.',
    jabatan: 'Ketua DPRD / Pimpinan Rapat',
    instansiOpd: 'DPRD Provinsi Sulawesi Barat',
    isTerpilih: true,
  },
  {
    id: 'PR-2',
    nama: 'H. Abdul Halim, S.Ag.',
    jabatan: 'Wakil Ketua I DPRD',
    instansiOpd: 'DPRD Provinsi Sulawesi Barat',
    isTerpilih: true,
  },
  {
    id: 'PR-3',
    nama: 'Arianto, AP, M.M.',
    jabatan: 'Sekretaris DPRD (Sekwan)',
    instansiOpd: 'Sekretariat DPRD Sulbar',
    isTerpilih: true,
  },
  {
    id: 'PR-4',
    nama: 'Ir. H. Syahrir, M.Si.',
    jabatan: 'Kepala Dinas Kominfo',
    instansiOpd: 'Dinas Kominfo Pemprov Sulbar',
    isTerpilih: true,
  },
  {
    id: 'PR-5',
    nama: 'Drs. H. Syamsul, M.Si.',
    jabatan: 'Kepala Dinas PUPR',
    instansiOpd: 'Dinas PUPR Pemprov Sulbar',
    isTerpilih: false,
  },
  {
    id: 'PR-6',
    nama: 'Dr. Hj. Nursiah, M.Si.',
    jabatan: 'Kepala Bappeda',
    instansiOpd: 'Bappeda Pemprov Sulbar',
    isTerpilih: false,
  },
];

export const PesertaRapatManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onApplyToRisalah,
  onSelectSpeaker,
  initialTab = 'peserta',
}) => {
  // Tab State
  const [activeTab, setActiveTab] = useState<'peserta' | 'dprd' | 'pejabat'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // State for list of participants
  const [pesertaList, setPesertaList] = useState<PesertaRapatItem[]>(INITIAL_PESERTA_RAPAT);

  // Form inputs for adding a new participant
  const [namaInput, setNamaInput] = useState('');
  const [jabatanInput, setJabatanInput] = useState('');
  const [instansiInput, setInstansiInput] = useState('');

  // Search and filters for DPRD Directory
  const [dprdSearch, setDprdSearch] = useState('');
  const [dprdFilterCat, setDprdFilterCat] = useState<string>('SEMUA');

  // Search and filters for Pemprov Pejabat Directory
  const [pejabatSearch, setPejabatSearch] = useState('');
  const [pejabatFilterCat, setPejabatFilterCat] = useState<string>('SEMUA');

  // Window Baru Pop-up State (Daftar Nama Tersusun Kebawah)
  const [isWindowBaruOpen, setIsWindowBaruOpen] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(false);

  if (!isOpen) return null;

  // Handle Add Participant manually
  const handleAddPeserta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaInput.trim()) return;

    const newItem: PesertaRapatItem = {
      id: `PR-${Date.now()}`,
      nama: namaInput.trim(),
      jabatan: jabatanInput.trim() || 'Peserta Rapat',
      instansiOpd: instansiInput.trim() || 'Pemprov Sulbar',
      isTerpilih: true,
    };

    setPesertaList((prev) => [newItem, ...prev]);
    setNamaInput('');
    setJabatanInput('');
    setInstansiInput('');
  };

  // Toggle Selection
  const toggleSelect = (id: string) => {
    setPesertaList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isTerpilih: !p.isTerpilih } : p))
    );
  };

  // Import all 26 Pemprov Sulbar Officials into list
  const handleImportPemprovPejabat = () => {
    const pemprovItems: PesertaRapatItem[] = PEJABAT_PEMPROV_SULBAR_2026.map((pjb) => ({
      id: `PR-PJB-${pjb.id}`,
      nama: pjb.nama,
      jabatan: pjb.jabatan,
      instansiOpd: pjb.instansiOpd,
      isTerpilih: true,
    }));

    setPesertaList((prev) => {
      const existingNames = new Set(prev.map((p) => p.nama));
      const newToAppend = pemprovItems.filter((p) => !existingNames.has(p.nama));
      return [...prev, ...newToAppend];
    });
  };

  // Import all 45 DPRD Members into list
  const handleImportDprdMembers = () => {
    const dprdItems: PesertaRapatItem[] = INITIAL_ANGGOTA_DPRD.map((m) => ({
      id: `PR-DPRD-${m.id}`,
      nama: m.nama,
      jabatan: `${m.jabatan} (${m.fraksiPartai})`,
      instansiOpd: 'DPRD Provinsi Sulawesi Barat',
      isTerpilih: true,
    }));

    setPesertaList((prev) => {
      const existingNames = new Set(prev.map((p) => p.nama));
      const newToAppend = dprdItems.filter((p) => !existingNames.has(p.nama));
      return [...prev, ...newToAppend];
    });
  };

  // Add single DPRD member to peserta list
  const handleAddSingleDprdToPeserta = (m: AnggotaDprdItem) => {
    const newItem: PesertaRapatItem = {
      id: `PR-DPRD-${m.id}-${Date.now()}`,
      nama: m.nama,
      jabatan: `${m.jabatan} (${m.fraksiPartai})`,
      instansiOpd: 'DPRD Provinsi Sulawesi Barat',
      isTerpilih: true,
    };
    setPesertaList((prev) => {
      if (prev.some((p) => p.nama === m.nama)) return prev;
      return [newItem, ...prev];
    });
  };

  // Add single Pejabat to peserta list
  const handleAddSinglePejabatToPeserta = (pjb: PejabatPemprovItem) => {
    const newItem: PesertaRapatItem = {
      id: `PR-PJB-${pjb.id}-${Date.now()}`,
      nama: pjb.nama,
      jabatan: pjb.jabatan,
      instansiOpd: pjb.instansiOpd,
      isTerpilih: true,
    };
    setPesertaList((prev) => {
      if (prev.some((p) => p.nama === pjb.nama)) return prev;
      return [newItem, ...prev];
    });
  };

  // Select / Deselect All
  const handleSelectAll = (select: boolean) => {
    setPesertaList((prev) => prev.map((p) => ({ ...p, isTerpilih: select })));
  };

  // Delete Item
  const handleDeletePeserta = (id: string) => {
    setPesertaList((prev) => prev.filter((p) => p.id !== id));
  };

  // Selected Items
  const selectedPeserta = pesertaList.filter((p) => p.isTerpilih);

  // Formatted String (Tersusun Kebawah)
  const formattedTextList = selectedPeserta
    .map((p, idx) => `${idx + 1}. ${p.nama} - ${p.jabatan} (${p.instansiOpd})`)
    .join('\n');

  // Copy to Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(formattedTextList);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  // Print Window List
  const handlePrint = () => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    printWin.document.write(`
      <html>
        <head>
          <title>Daftar Peserta Rapat Persidangan DPRD Sulbar</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #1e293b; line-height: 1.6; }
            h2 { border-bottom: 2px solid #0284c7; padding-bottom: 8px; margin-bottom: 4px; color: #0f172a; }
            .subtitle { font-size: 12px; color: #64748b; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
            ol { padding-left: 20px; }
            li { margin-bottom: 10px; font-size: 14px; }
            .name { font-weight: bold; color: #0f172a; }
            .details { color: #334155; }
            .footer { margin-top: 40px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h2>DAFTAR KEHADIRAN PESERTA RAPAT PERSIDANGAN</h2>
          <div class="subtitle">DPRD Provinsi Sulawesi Barat • Tanggal: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <ol>
            ${selectedPeserta
              .map(
                (p) =>
                  `<li><span class="name">${p.nama}</span> — <span class="details">${p.jabatan} (${p.instansiOpd})</span></li>`
              )
              .join('')}
          </ol>
          <div class="footer">Dicetak melalui Sistem Informasi Persidangan DPRD Sulbar pada ${new Date().toLocaleString('id-ID')} WITA.</div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  // Filtered DPRD List
  const filteredDprd = INITIAL_ANGGOTA_DPRD.filter((m) => {
    const matchesSearch =
      m.nama.toLowerCase().includes(dprdSearch.toLowerCase()) ||
      m.jabatan.toLowerCase().includes(dprdSearch.toLowerCase()) ||
      m.fraksiPartai.toLowerCase().includes(dprdSearch.toLowerCase());

    if (dprdFilterCat === 'SEMUA') return matchesSearch;
    if (dprdFilterCat === 'Pimpinan') return matchesSearch && m.kategori === 'Pimpinan DPRD';
    return matchesSearch && m.kategori === dprdFilterCat;
  });

  // Filtered Pemprov Pejabat List
  const filteredPejabat = PEJABAT_PEMPROV_SULBAR_2026.filter((pjb) => {
    const matchesSearch =
      pjb.nama.toLowerCase().includes(pejabatSearch.toLowerCase()) ||
      pjb.jabatan.toLowerCase().includes(pejabatSearch.toLowerCase()) ||
      pjb.instansiOpd.toLowerCase().includes(pejabatSearch.toLowerCase());

    if (pejabatFilterCat === 'SEMUA') return matchesSearch;
    if (pejabatFilterCat === 'Pimpinan Utama') return matchesSearch && pjb.kategori === 'pimpinan';
    if (pejabatFilterCat === 'Asisten/Sekda') return matchesSearch && pjb.kategori === 'asisten';
    if (pejabatFilterCat === 'Biro') return matchesSearch && pjb.kategori === 'biro';
    if (pejabatFilterCat === 'Dinas/Badan (OPD)') return matchesSearch && pjb.kategori === 'opd';

    return matchesSearch;
  });

  const existingParticipantNames = new Set(pesertaList.map((p) => p.nama));

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header Modal */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Input & Kelola Data Peserta Rapat</h2>
              <p className="text-xs text-slate-400">
                Pendaftaran peserta rapat, direktori pimpinan & anggota DPRD, serta pejabat Pemprov Sulbar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Header Bar */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('peserta')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'peserta'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>1. List/Input Peserta ({pesertaList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dprd')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'dprd'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5 text-sky-400" />
            <span>2. Pimpinan & Anggota DPRD (45)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pejabat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'pejabat'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Pejabat Pemprov. Sulbar (26)</span>
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: LIST / INPUT PESERTA RAPAT */}
          {activeTab === 'peserta' && (
            <div className="space-y-4 animate-fadeIn">
              {/* FORM INPUT DATA PESERTA RAPAT */}
              <form
                onSubmit={handleAddPeserta}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                      Form Input Data Peserta Rapat Baru
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Isi Nama, Jabatan, & Instansi/OPD</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <User className="w-3 h-3 text-emerald-400" />
                      <span>Nama Peserta *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={namaInput}
                      onChange={(e) => setNamaInput(e.target.value)}
                      placeholder="cth. Ir. H. Ahmad, M.Si."
                      className="w-full text-xs bg-slate-900 text-slate-100 border border-slate-800 rounded-lg p-2.5 focus:ring-1 focus:ring-emerald-500 outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-emerald-400" />
                      <span>Jabatan *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={jabatanInput}
                      onChange={(e) => setJabatanInput(e.target.value)}
                      placeholder="cth. Anggota Komisi I / Kadis"
                      className="w-full text-xs bg-slate-900 text-slate-100 border border-slate-800 rounded-lg p-2.5 focus:ring-1 focus:ring-emerald-500 outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-emerald-400" />
                      <span>Instansi / OPD / Fraksi *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={instansiInput}
                      onChange={(e) => setInstansiInput(e.target.value)}
                      placeholder="cth. Dinas Kesehatan Pemprov Sulbar"
                      className="w-full text-xs bg-slate-900 text-slate-100 border border-slate-800 rounded-lg p-2.5 focus:ring-1 focus:ring-emerald-500 outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Simpan Data Peserta ke List</span>
                  </button>
                </div>
              </form>

              {/* ACTION TOOLBAR & BULK IMPORTS */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                      Daftar List Peserta Rapat ({pesertaList.length})
                    </span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      {selectedPeserta.length} Terpilih
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleImportDprdMembers}
                      className="text-[11px] bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-700/80 px-2.5 py-1 rounded-lg transition font-bold flex items-center gap-1 shadow"
                      title="Impor seluruh 45 Pimpinan & Anggota DPRD Sulawesi Barat"
                    >
                      <DownloadCloud className="w-3.5 h-3.5 text-sky-400" />
                      <span>+ Muat 45 Anggota DPRD</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleImportPemprovPejabat}
                      className="text-[11px] bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-700/80 px-2.5 py-1 rounded-lg transition font-bold flex items-center gap-1 shadow"
                      title="Impor seluruh 26 Gubernur, Sekda, Asisten, Biro & Kepala OPD Pemprov Sulbar 2026"
                    >
                      <DownloadCloud className="w-3.5 h-3.5 text-amber-400" />
                      <span>+ Muat 26 Pejabat Pemprov</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectAll(true)}
                      className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg transition"
                    >
                      Pilih Semua
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectAll(false)}
                      className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg transition"
                    >
                      Hapus Semua
                    </button>

                    {/* Buka Window Baru Daftar Peserta */}
                    <button
                      type="button"
                      onClick={() => setIsWindowBaruOpen(true)}
                      disabled={selectedPeserta.length === 0}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow ${
                        selectedPeserta.length > 0
                          ? 'bg-sky-600 hover:bg-sky-500 text-white cursor-pointer'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka Window List (Tersusun Kebawah)</span>
                    </button>
                  </div>
                </div>

                {/* LIST CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {pesertaList.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => toggleSelect(item.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-start justify-between gap-2 ${
                        item.isTerpilih
                          ? 'bg-slate-900 border-emerald-500/60 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-75'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          className="mt-0.5 text-slate-400 hover:text-emerald-400"
                        >
                          {item.isTerpilih ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600" />
                          )}
                        </button>

                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                            <span className="font-bold text-slate-100">{item.nama}</span>
                          </div>
                          <p className="text-[11px] text-emerald-400 font-medium">{item.jabatan}</p>
                          <p className="text-[10px] text-slate-400">{item.instansiOpd}</p>

                          {onSelectSpeaker && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectSpeaker(item.nama, `${item.jabatan} (${item.instansiOpd})`);
                                onClose();
                              }}
                              className="mt-1 text-[10px] bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 font-bold px-2 py-0.5 rounded-md transition flex items-center gap-1 shadow"
                              title="Pilih Cepat Peserta Ini Sebagai Pembicara Aktif"
                            >
                              <User className="w-3 h-3 text-emerald-400" />
                              <span>Pilih Sebagai Pembicara</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePeserta(item.id);
                        }}
                        className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition"
                        title="Hapus Peserta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIREKTORI PIMPINAN & ANGGOTA DPRD */}
          {activeTab === 'dprd' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={dprdSearch}
                      onChange={(e) => setDprdSearch(e.target.value)}
                      placeholder="Cari Nama Anggota, Komisi, Fraksi..."
                      className="w-full bg-slate-900 text-slate-100 pl-9 pr-3 py-2 text-xs border border-slate-800 rounded-lg focus:border-sky-500 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    {['SEMUA', 'Pimpinan', 'Komisi I', 'Komisi II', 'Komisi III', 'Komisi IV'].map(
                      (cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setDprdFilterCat(cat)}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition whitespace-nowrap ${
                            dprdFilterCat === cat
                              ? 'bg-sky-600 text-white shadow'
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                          }`}
                        >
                          {cat}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Menampilkan {filteredDprd.length} Pimpinan & Anggota DPRD Sulbar</span>
                  <button
                    type="button"
                    onClick={handleImportDprdMembers}
                    className="text-sky-400 hover:underline font-bold flex items-center gap-1"
                  >
                    <DownloadCloud className="w-3 h-3" />
                    <span>Muat Semua 45 Anggota ke List Peserta</span>
                  </button>
                </div>
              </div>

              {/* GRID MEMBER CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                {filteredDprd.map((m) => {
                  const isAdded = existingParticipantNames.has(m.nama);
                  return (
                    <div
                      key={m.id}
                      className="p-3 bg-slate-950/80 border border-slate-800 hover:border-sky-500/50 rounded-xl space-y-2 transition flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-sky-950 text-sky-300 border border-sky-800 rounded font-bold">
                            {m.kategori}
                          </span>
                          <span className="text-[10px] text-slate-400">{m.fraksiPartai}</span>
                        </div>
                        <h4 className="font-bold text-slate-100 text-xs">{m.nama}</h4>
                        <p className="text-[11px] text-sky-400 font-medium">{m.jabatan}</p>
                        <p className="text-[10px] text-slate-400">AKD: {m.kelengkapanLain}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        {isAdded ? (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Di List Peserta
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddSingleDprdToPeserta(m)}
                            className="text-[10px] bg-slate-900 hover:bg-sky-950 text-sky-300 border border-slate-700 hover:border-sky-700 font-bold px-2 py-1 rounded-lg transition flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> + List Peserta
                          </button>
                        )}

                        {onSelectSpeaker && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectSpeaker(
                                m.nama,
                                `${m.jabatan} (${m.fraksiPartai} - DPRD Sulbar)`
                              );
                              onClose();
                            }}
                            className="text-[10px] bg-sky-600 hover:bg-sky-500 text-white font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1 shadow"
                          >
                            <UserCheck className="w-3 h-3" /> Pilih Pembicara
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DIREKTORI PEJABAT PEMPROV SULBAR */}
          {activeTab === 'pejabat' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={pejabatSearch}
                      onChange={(e) => setPejabatSearch(e.target.value)}
                      placeholder="Cari Nama Pejabat, Kadis, Kaban, OPD..."
                      className="w-full bg-slate-900 text-slate-100 pl-9 pr-3 py-2 text-xs border border-slate-800 rounded-lg focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    {['SEMUA', 'Pimpinan Utama', 'Asisten/Sekda', 'Biro', 'Dinas/Badan (OPD)'].map(
                      (cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setPejabatFilterCat(cat)}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition whitespace-nowrap ${
                            pejabatFilterCat === cat
                              ? 'bg-amber-600 text-white shadow'
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                          }`}
                        >
                          {cat}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Menampilkan {filteredPejabat.length} Pejabat & Kepala OPD Pemprov Sulbar</span>
                  <button
                    type="button"
                    onClick={handleImportPemprovPejabat}
                    className="text-amber-400 hover:underline font-bold flex items-center gap-1"
                  >
                    <DownloadCloud className="w-3 h-3" />
                    <span>Muat Semua 26 Pejabat ke List Peserta</span>
                  </button>
                </div>
              </div>

              {/* GRID PEJABAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                {filteredPejabat.map((pjb) => {
                  const isAdded = existingParticipantNames.has(pjb.nama);
                  return (
                    <div
                      key={pjb.id}
                      className="p-3 bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 rounded-xl space-y-2 transition flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded uppercase font-bold">
                            {pjb.kategori}
                          </span>
                          <span className="text-[10px] text-slate-400">{pjb.instansiOpd}</span>
                        </div>
                        <h4 className="font-bold text-slate-100 text-xs">{pjb.nama}</h4>
                        <p className="text-[11px] text-amber-400 font-medium">{pjb.jabatan}</p>

                        {pjb.no_whatsapp_utama && (
                          <a
                            href={`https://api.whatsapp.com/send?phone=62${pjb.no_whatsapp_utama.replace(/^0/, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono hover:underline"
                          >
                            <PhoneCall className="w-2.5 h-2.5" />
                            <span>+{pjb.no_whatsapp_utama}</span>
                          </a>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        {isAdded ? (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Di List Peserta
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddSinglePejabatToPeserta(pjb)}
                            className="text-[10px] bg-slate-900 hover:bg-amber-950 text-amber-300 border border-slate-700 hover:border-amber-700 font-bold px-2 py-1 rounded-lg transition flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> + List Peserta
                          </button>
                        )}

                        {onSelectSpeaker && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectSpeaker(pjb.nama, `${pjb.jabatan} (${pjb.instansiOpd})`);
                              onClose();
                            }}
                            className="text-[10px] bg-amber-600 hover:bg-amber-500 text-white font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1 shadow"
                          >
                            <UserCheck className="w-3 h-3" /> Pilih Pembicara
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Terpilih: <span className="text-emerald-400 font-bold">{selectedPeserta.length}</span> dari {pesertaList.length} Peserta Rapat
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onApplyToRisalah && (
              <button
                type="button"
                onClick={() => {
                  onApplyToRisalah(formattedTextList);
                  onClose();
                }}
                disabled={selectedPeserta.length === 0}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Sisipkan Ke Form Risalah</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsWindowBaruOpen(true)}
              disabled={selectedPeserta.length === 0}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Tampilkan Window List</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      {/* POP-UP WINDOW BARU: DAFTAR NAMA PESERTA RAPAT TERSUSUN KEBAWAH */}
      {isWindowBaruOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/50 rounded-2xl max-w-2xl w-full text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
            {/* Header Window Baru */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-sky-950 border border-sky-800 text-sky-400 rounded-xl">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    Window Daftar Peserta Rapat Tersusun
                  </h3>
                  <p className="text-xs text-sky-400 font-medium">
                    Susunan Kebawah ({selectedPeserta.length} Peserta Terpilih)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsWindowBaruOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-800 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Window Content: Stacked Downward List */}
            <div className="p-5 overflow-y-auto space-y-4 bg-slate-950 font-mono text-xs text-slate-200">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="text-center border-b border-slate-800 pb-3 mb-3">
                  <h4 className="font-bold text-sm text-slate-100 uppercase tracking-wide">
                    DAFTAR KEHADIRAN PESERTA RAPAT
                  </h4>
                  <p className="text-[11px] text-emerald-400 font-sans mt-0.5">
                    DPRD PROVINSI SULAWESI BARAT
                  </p>
                </div>

                <div className="space-y-2.5 font-sans leading-relaxed text-sm">
                  {selectedPeserta.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg flex items-start gap-3"
                    >
                      <span className="font-bold text-emerald-400 font-mono">{index + 1}.</span>
                      <div>
                        <p className="font-bold text-slate-100 text-sm">{item.nama}</p>
                        <p className="text-xs text-sky-400 font-medium">{item.jabatan}</p>
                        <p className="text-xs text-slate-400">{item.instansiOpd}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Window Footer Actions */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Format tersusun kebawah siap disalin atau dicetak.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-slate-700"
                >
                  {copiedStatus ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Ke Clipboard</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-slate-700"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Print</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsWindowBaruOpen(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
