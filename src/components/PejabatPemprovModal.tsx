import React, { useState } from 'react';
import { PejabatPemprovItem, PEJABAT_PEMPROV_SULBAR_2026 } from '../data/pejabatPemprovData';
import { AuthUser } from '../types';
import {
  X,
  Search,
  Building2,
  User,
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  UserCheck,
  Layers,
  FileSpreadsheet,
  Phone,
  PhoneCall,
  MessageSquare,
  ExternalLink,
  Lock,
  Info,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: AuthUser | null;
  onSelectSpeaker?: (nama: string, jabatan: string) => void;
}

export const PejabatPemprovModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectSpeaker,
}) => {
  const [dataPejabat, setDataPejabat] = useState<PejabatPemprovItem[]>(PEJABAT_PEMPROV_SULBAR_2026);
  const [activeCategory, setActiveCategory] = useState<'all' | 'pimpinan' | 'asisten' | 'biro' | 'opd'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Authorization check: only admin and kabag can add/edit/delete Pejabat Pemprov
  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'kabag';

  // Form State for Adding / Editing
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formNama, setFormNama] = useState('');
  const [formJabatan, setFormJabatan] = useState('');
  const [formKategori, setFormKategori] = useState<'pimpinan' | 'asisten' | 'biro' | 'opd'>('opd');
  const [formInstansi, setFormInstansi] = useState('');
  const [formNoWa, setFormNoWa] = useState('');
  const [formPicNama, setFormPicNama] = useState('');
  const [formPicWa, setFormPicWa] = useState('');
  const [formJabatanKategori, setFormJabatanKategori] = useState<'PIMPINAN_DPRD' | 'ANGGOTA_KOMISI' | 'KEPALA_OPD' | 'PEJABAT_PEMPROV'>('KEPALA_OPD');

  if (!isOpen) return null;

  // Filtered List
  const filteredList = dataPejabat.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.kategori === activeCategory;
    const matchesSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.instansiOpd.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.no_whatsapp_utama && item.no_whatsapp_utama.includes(searchQuery)) ||
      (item.nama_pic_pendamping && item.nama_pic_pendamping.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Handle Save (Add or Edit)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) {
      alert('Akses Ditolak: Hanya Admin dan Kabag yang berwenang menambah atau mengedit data Pejabat Pemprov.');
      return;
    }
    if (!formNama.trim() || !formJabatan.trim()) return;

    if (editingId) {
      setDataPejabat((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                nama: formNama.trim(),
                jabatan: formJabatan.trim(),
                kategori: formKategori,
                instansiOpd: formInstansi.trim() || 'Pemprov Sulbar',
                no_whatsapp_utama: formNoWa.trim() || undefined,
                nama_pic_pendamping: formPicNama.trim() || undefined,
                no_whatsapp_pic: formPicWa.trim() || undefined,
                jabatan_kategori: formJabatanKategori,
              }
            : item
        )
      );
    } else {
      const newItem: PejabatPemprovItem = {
        id: `PJB-${Date.now()}`,
        nama: formNama.trim(),
        jabatan: formJabatan.trim(),
        kategori: formKategori,
        instansiOpd: formInstansi.trim() || 'Pemprov Sulbar',
        no_whatsapp_utama: formNoWa.trim() || undefined,
        nama_pic_pendamping: formPicNama.trim() || undefined,
        no_whatsapp_pic: formPicWa.trim() || undefined,
        jabatan_kategori: formJabatanKategori,
      };
      setDataPejabat((prev) => [newItem, ...prev]);
    }

    resetForm();
  };

  const startEdit = (item: PejabatPemprovItem) => {
    if (!canManage) return;
    setEditingId(item.id);
    setFormNama(item.nama);
    setFormJabatan(item.jabatan);
    setFormKategori(item.kategori);
    setFormInstansi(item.instansiOpd);
    setFormNoWa(item.no_whatsapp_utama || '');
    setFormPicNama(item.nama_pic_pendamping || '');
    setFormPicWa(item.no_whatsapp_pic || '');
    setFormJabatanKategori(item.jabatan_kategori || (item.kategori === 'opd' ? 'KEPALA_OPD' : 'PEJABAT_PEMPROV'));
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormNama('');
    setFormJabatan('');
    setFormKategori('opd');
    setFormInstansi('');
    setFormNoWa('');
    setFormPicNama('');
    setFormPicWa('');
    setFormJabatanKategori('KEPALA_OPD');
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!canManage) {
      alert('Akses Ditolak: Hanya Admin dan Kabag yang berwenang menghapus data Pejabat Pemprov.');
      return;
    }
    setDataPejabat((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCopyText = (item: PejabatPemprovItem) => {
    const text = `${item.nama} - ${item.jabatan} (${item.instansiOpd})`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Print Database
  const handlePrint = () => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    printWin.document.write(`
      <html>
        <head>
          <title>Database Pimpinan dan Pejabat Perangkat Daerah Pemprov Sulbar 2026</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 25px; color: #1e293b; line-height: 1.5; }
            h2 { border-bottom: 2px solid #0284c7; padding-bottom: 6px; margin-bottom: 4px; font-size: 18px; color: #0f172a; }
            .subtitle { font-size: 11px; color: #64748b; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
            th { bg-color: #f1f5f9; background: #f1f5f9; font-weight: bold; color: #0f172a; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .badge { font-weight: bold; color: #0369a1; text-transform: uppercase; font-size: 10px; }
            .footer { margin-top: 30px; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px; }
          </style>
        </head>
        <body>
          <h2>DAFTAR PIMPINAN DAN PEJABAT PERANGKAT DAERAH</h2>
          <div class="subtitle">PEMERINTAH PROVINSI SULAWESI BARAT TAHUN 2026</div>
          <table>
            <thead>
              <tr>
                <th style="width: 40px;">No</th>
                <th>Nama Lengkap</th>
                <th>Jabatan Pejabat</th>
                <th>Kategori</th>
                <th>Instansi / Perangkat Daerah</th>
              </tr>
            </thead>
            <tbody>
              ${filteredList
                .map(
                  (p, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${p.nama}</strong></td>
                  <td>${p.jabatan}</td>
                  <td class="badge">${p.kategori}</td>
                  <td>${p.instansiOpd}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <div class="footer">Dicetak dari Sistem E-Parlemen DPRD Provinsi Sulawesi Barat pada ${new Date().toLocaleString('id-ID')} WITA.</div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header Modal */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500/20 to-sky-500/20 border border-amber-500/40 text-amber-300 rounded-xl shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-white">
                  Database Pimpinan & Pejabat Pemprov Sulbar 2026
                </h2>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40 uppercase">
                  Resmi 2026
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Data Gubernur, Sekda, Asisten Setda, Kepala Biro & Kepala OPD Pemprov Sulawesi Barat
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

        {/* Toolbar: Search & Add */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama pejabat, jabatan, atau OPD..."
              className="w-full bg-slate-900 text-xs text-slate-100 pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500/70 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {canManage ? (
              <button
                onClick={() => {
                  if (isFormOpen && !editingId) {
                    resetForm();
                  } else {
                    resetForm();
                    setIsFormOpen(true);
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Pejabat Baru</span>
              </button>
            ) : (
              <div
                className="bg-slate-950 border border-slate-800 text-slate-400 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow"
                title="Akses terbatas: Hanya Admin dan Kabag yang dapat menambah atau mengedit data"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] text-amber-300 font-semibold">Akses Terproteksi (Operator)</span>
              </div>
            )}

            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3 py-2 rounded-xl transition border border-slate-700 flex items-center gap-1.5"
              title="Cetak Database Pejabat"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak / Print</span>
            </button>
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Semua ({dataPejabat.length})
          </button>
          <button
            onClick={() => setActiveCategory('pimpinan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeCategory === 'pimpinan'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Gubernur & Sekda (2)
          </button>
          <button
            onClick={() => setActiveCategory('asisten')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeCategory === 'asisten'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Asisten Setda (3)
          </button>
          <button
            onClick={() => setActiveCategory('biro')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeCategory === 'biro'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Kepala Biro (6)
          </button>
          <button
            onClick={() => setActiveCategory('opd')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeCategory === 'opd'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Kepala OPD Pemprov (15)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Operator Notice Banner */}
          {!canManage && (
            <div className="bg-amber-950/30 border border-amber-800/60 rounded-xl p-3 text-xs text-amber-200 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Mode Operator (Referensi Resmi Pejabat Terproteksi)</p>
                <p className="text-[11px] text-amber-300/90 mt-0.5">
                  Sebagai Operator, Anda memiliki akses penuh untuk mencari profil pejabat, menyalin data instansi, menghubungi nomor WhatsApp resmi, dan memilih narasumber rapat. Penambahan atau pengubahan data master pejabat dibatasi khusus untuk akun <strong>Admin</strong> dan <strong>Kabag</strong>.
                </p>
              </div>
            </div>
          )}

          {/* FORM INPUT / EDIT DATA */}
          {isFormOpen && (
            <form
              onSubmit={handleSaveForm}
              className="bg-slate-950 border border-amber-500/40 rounded-xl p-4 space-y-3 animate-fadeIn"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>{editingId ? 'Edit Data Pejabat' : 'Input Data Pejabat Baru'}</span>
                </span>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Nama Pejabat *
                  </label>
                  <input
                    type="text"
                    required
                    value={formNama}
                    onChange={(e) => setFormNama(e.target.value)}
                    placeholder="cth. Dr. H. Suhardi Duka, M.M."
                    className="w-full text-xs bg-slate-900 text-slate-100 border border-slate-800 rounded-lg p-2.5 focus:ring-1 focus:ring-amber-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Jabatan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formJabatan}
                    onChange={(e) => setFormJabatan(e.target.value)}
                    placeholder="cth. Kepala Dinas Kominfo"
                    className="w-full text-xs bg-slate-900 text-slate-100 border border-slate-800 rounded-lg p-2.5 focus:ring-1 focus:ring-amber-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Kategori Pejabat *
                  </label>
                  <select
                    value={formKategori}
                    onChange={(e) => setFormKategori(e.target.value as any)}
                    className="w-full text-xs bg-slate-900 text-slate-100 border border-slate-800 rounded-lg p-2.5 focus:ring-1 focus:ring-amber-500 outline-none font-medium"
                  >
                    <option value="pimpinan">Gubernur / Sekda</option>
                    <option value="asisten">Asisten Setda</option>
                    <option value="biro">Kepala Biro</option>
                    <option value="opd">Kepala OPD Pemprov</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Instansi / OPD / Biro *
                  </label>
                  <input
                    type="text"
                    required
                    value={formInstansi}
                    onChange={(e) => setFormInstansi(e.target.value)}
                    placeholder="cth. Dinas Pendidikan & Kebudayaan"
                    className="w-full text-xs bg-slate-900 text-slate-100 border border-slate-800 rounded-lg p-2.5 focus:ring-1 focus:ring-amber-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-emerald-400 mb-1">
                    No. WhatsApp Utama (Format: 628...)
                  </label>
                  <input
                    type="text"
                    value={formNoWa}
                    onChange={(e) => setFormNoWa(e.target.value)}
                    placeholder="cth. 628123456789"
                    className="w-full text-xs bg-slate-900 text-slate-100 border border-slate-800 rounded-lg p-2.5 focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Nama PIC / Ajudan Pendamping
                  </label>
                  <input
                    type="text"
                    value={formPicNama}
                    onChange={(e) => setFormPicNama(e.target.value)}
                    placeholder="cth. Budi (Ajudan / Sekpri)"
                    className="w-full text-xs bg-slate-900 text-slate-100 border border-slate-800 rounded-lg p-2.5 focus:ring-1 focus:ring-amber-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    No. WhatsApp PIC Pendamping
                  </label>
                  <input
                    type="text"
                    value={formPicWa}
                    onChange={(e) => setFormPicWa(e.target.value)}
                    placeholder="cth. 628198765432"
                    className="w-full text-xs bg-slate-900 text-slate-100 border border-slate-800 rounded-lg p-2.5 focus:ring-1 focus:ring-amber-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Jabatan Kategori System
                  </label>
                  <select
                    value={formJabatanKategori}
                    onChange={(e) => setFormJabatanKategori(e.target.value as any)}
                    className="w-full text-xs bg-slate-900 text-slate-100 border border-slate-800 rounded-lg p-2.5 focus:ring-1 focus:ring-amber-500 outline-none font-medium"
                  >
                    <option value="PIMPINAN_DPRD">PIMPINAN_DPRD</option>
                    <option value="ANGGOTA_KOMISI">ANGGOTA_KOMISI</option>
                    <option value="KEPALA_OPD">KEPALA_OPD</option>
                    <option value="PEJABAT_PEMPROV">PEJABAT_PEMPROV</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-1.5 rounded-lg shadow transition"
                >
                  Simpan Data Pejabat
                </button>
              </div>
            </form>
          )}

          {/* GRID DATA LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredList.map((item, idx) => {
              const getKategoriBadge = () => {
                switch (item.kategori) {
                  case 'pimpinan':
                    return 'bg-sky-950 text-sky-300 border-sky-700/80';
                  case 'asisten':
                    return 'bg-indigo-950 text-indigo-300 border-indigo-700/80';
                  case 'biro':
                    return 'bg-purple-950 text-purple-300 border-purple-700/80';
                  default:
                    return 'bg-emerald-950 text-emerald-300 border-emerald-700/80';
                }
              };

              return (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-between gap-3 hover:border-amber-500/50 transition group shadow-sm"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border uppercase ${getKategoriBadge()}`}
                      >
                        {item.kategori}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-100 text-sm group-hover:text-amber-300 transition leading-snug">
                      {item.nama}
                    </h4>

                    <p className="text-xs text-amber-400 font-semibold">{item.jabatan}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{item.instansiOpd}</span>
                    </p>

                    {/* WhatsApp Status Badge & Number */}
                    <div className="pt-1.5 flex flex-wrap items-center justify-between gap-1 text-[11px]">
                      {item.no_whatsapp_utama ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-mono font-bold bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-md">
                          <MessageSquare className="w-3 h-3 text-emerald-400" />
                          <span>+{item.no_whatsapp_utama}</span>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded ml-0.5">WA Validated</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-medium bg-rose-950/50 border border-rose-900/60 px-2 py-0.5 rounded-md">
                          <MessageSquare className="w-3 h-3 text-rose-500" />
                          <span>WA Belum Terisi</span>
                        </span>
                      )}

                      {item.nama_pic_pendamping && (
                        <span className="text-[10px] text-slate-400 truncate max-w-[140px]" title={`PIC: ${item.nama_pic_pendamping}`}>
                          PIC: {item.nama_pic_pendamping}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {item.no_whatsapp_utama && (
                        <a
                          href={`https://wa.me/${item.no_whatsapp_utama}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1 shadow"
                          title="Hubungi Langsung via WhatsApp"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>Hubungi WA</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                        </a>
                      )}

                      {onSelectSpeaker ? (
                        <button
                          onClick={() => {
                            onSelectSpeaker(item.nama, `${item.jabatan} (${item.instansiOpd})`);
                            onClose();
                          }}
                          className="text-[11px] bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-700/80 font-bold px-2 py-1 rounded-lg transition flex items-center gap-1 shadow"
                          title="Pilih Cepat Pejabat Ini Sebagai Pembicara Aktif"
                        >
                          <User className="w-3 h-3 text-amber-400" />
                          <span>Pilih</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCopyText(item)}
                          className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium px-2 py-1 rounded-md transition flex items-center gap-1"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {canManage ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEdit(item)}
                          className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded transition"
                          title="Edit Data Pejabat (Akses Admin & Kabag)"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded transition"
                          title="Hapus Data Pejabat (Akses Admin & Kabag)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono italic px-1 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 opacity-60" />
                        <span>Terverifikasi</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredList.length === 0 && (
            <div className="text-center py-12 bg-slate-950 border border-slate-800 rounded-xl">
              <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-300">Tidak ada data pejabat ditemukan</p>
              <p className="text-xs text-slate-500 mt-1">
                Coba ubah filter pencarian atau tambahkan pejabat baru.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Total Terdaftar: <strong className="text-amber-400 font-bold">{dataPejabat.length} Pejabat Pemprov Sulbar 2026</strong>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition"
          >
            Tutup Window
          </button>
        </div>
      </div>
    </div>
  );
};
