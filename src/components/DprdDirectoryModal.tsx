import React, { useState } from 'react';
import { AnggotaDprdItem, AuthUser } from '../types';
import { INITIAL_ANGGOTA_DPRD } from '../data/initialData';
import {
  Users,
  Plus,
  Trash2,
  Edit,
  Printer,
  Download,
  Search,
  Phone,
  MessageSquare,
  Building,
  Award,
  X,
  Check,
  FileSpreadsheet,
  Filter,
  ShieldCheck,
  PhoneCall,
  User,
  Lock,
  Info,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  members?: AnggotaDprdItem[];
  currentUser?: AuthUser | null;
  onAddMember?: (newMember: AnggotaDprdItem) => void;
  onUpdateMember?: (updatedMember: AnggotaDprdItem) => void;
  onDeleteMember?: (id: string) => void;
  onSelectSpeaker?: (nama: string, jabatan: string) => void;
}

export const DprdDirectoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  members: propMembers,
  currentUser,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onSelectSpeaker,
}) => {
  const [localMembers, setLocalMembers] = useState<AnggotaDprdItem[]>(INITIAL_ANGGOTA_DPRD);
  const activeMembers = propMembers || localMembers;

  // Authorization check: only admin and kabag can add/edit/delete DPRD data
  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'kabag';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterKategori, setFilterKategori] = useState<string>('SEMUA');
  const [filterFraksi, setFilterFraksi] = useState<string>('SEMUA');

  // Form State for Add/Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<AnggotaDprdItem | null>(null);

  const [formNama, setFormNama] = useState('');
  const [formJabatan, setFormJabatan] = useState('');
  const [formKategori, setFormKategori] = useState<'Pimpinan DPRD' | 'Komisi I' | 'Komisi II' | 'Komisi III' | 'Komisi IV'>('Komisi I');
  const [formFraksi, setFormFraksi] = useState('Partai Golkar');
  const [formNoHp, setFormNoHp] = useState('');
  const [formKelengkapan, setFormKelengkapan] = useState('BANGGAR');

  if (!isOpen) return null;

  const handleOpenAddForm = () => {
    if (!canManage) return;
    setEditingMember(null);
    setFormNama('');
    setFormJabatan('Anggota Komisi I');
    setFormKategori('Komisi I');
    setFormFraksi('Partai Golkar');
    setFormNoHp('');
    setFormKelengkapan('BANGGAR');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (member: AnggotaDprdItem) => {
    if (!canManage) return;
    setEditingMember(member);
    setFormNama(member.nama);
    setFormJabatan(member.jabatan);
    setFormKategori(member.kategori);
    setFormFraksi(member.fraksiPartai);
    setFormNoHp(member.noHp);
    setFormKelengkapan(member.kelengkapanLain);
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) {
      alert('Akses Ditolak: Hanya Admin dan Kabag yang berwenang menambah atau mengubah data Anggota DPRD.');
      return;
    }
    if (!formNama.trim()) {
      alert('Nama anggota DPRD tidak boleh kosong.');
      return;
    }

    if (editingMember) {
      const updated: AnggotaDprdItem = {
        ...editingMember,
        nama: formNama,
        jabatan: formJabatan,
        kategori: formKategori,
        fraksiPartai: formFraksi,
        noHp: formNoHp,
        kelengkapanLain: formKelengkapan,
      };
      if (onUpdateMember) {
        onUpdateMember(updated);
      } else {
        setLocalMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      }
    } else {
      const newMember: AnggotaDprdItem = {
        id: `DPRD-${Date.now()}`,
        nama: formNama,
        jabatan: formJabatan,
        kategori: formKategori,
        fraksiPartai: formFraksi,
        noHp: formNoHp || '-',
        kelengkapanLain: formKelengkapan,
      };
      if (onAddMember) {
        onAddMember(newMember);
      } else {
        setLocalMembers((prev) => [newMember, ...prev]);
      }
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!canManage) {
      alert('Akses Ditolak: Hanya Admin dan Kabag yang berwenang menghapus data Anggota DPRD.');
      return;
    }
    if (onDeleteMember) {
      onDeleteMember(id);
    } else {
      setLocalMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  // Filtered members list
  const filteredMembers = activeMembers.filter((m) => {
    const matchSearch =
      m.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.noHp.includes(searchTerm) ||
      m.kelengkapanLain.toLowerCase().includes(searchTerm.toLowerCase());

    const matchKat = filterKategori === 'SEMUA' || m.kategori === filterKategori;
    const matchFraksi = filterFraksi === 'SEMUA' || m.fraksiPartai.toLowerCase().includes(filterFraksi.toLowerCase());

    return matchSearch && matchKat && matchFraksi;
  });

  // Print Member List
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>DIREKTORI PIMPINAN DAN ANGGOTA DPRD PROVINSI SULAWESI BARAT MASA JABATAN 2024-2029</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; font-size: 11pt; color: #1e293b; }
            .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 20px; }
            .logo-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
            .logo { height: 60px; }
            h1 { font-size: 14pt; margin: 0; text-transform: uppercase; font-weight: bold; }
            h2 { font-size: 12pt; margin: 4px 0 0 0; color: #334155; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #94a3b8; padding: 6px 8px; text-align: left; font-size: 10pt; }
            th { background-color: #f1f5f9; font-weight: bold; }
            .footer { margin-top: 30px; text-align: right; font-size: 10pt; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="logo-container">
            <img class="logo" src="https://upload.wikimedia.org/wikipedia/commons/8/89/Coat_of_arms_of_West_Sulawesi.svg" alt="Pemprov Sulbar" />
            <div style="text-align:center;">
              <h1>DEWAN PERWAKILAN RAKYAT DAERAH</h1>
              <h2>PROVINSI SULAWESI BARAT</h2>
              <p style="margin:2px 0 0 0; font-size:9pt; color:#64748b;">Kompleks Perkantoran Gubernur, Jl. H. Abd. Malik Pattana Endeng, Rangas, Mamuju</p>
            </div>
            <img class="logo" src="https://upload.wikimedia.org/wikipedia/commons/6/63/Logo_DPRD_Sulawesi_Barat.png" alt="DPRD Sulbar" />
          </div>
          <div class="header">
            <h2 style="font-size:12pt; margin-top:10px;">SUSUNAN PIMPINAN DAN ANGGOTA DPRD PROVINSI SULAWESI BARAT</h2>
            <p style="margin:2px 0; font-size:10pt;">Keputusan DPRD Provinsi Sulawesi Barat - Masa Jabatan 2024-2029 (Total: ${filteredMembers.length} Orang)</p>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 30px; text-align:center;">No</th>
                <th>Nama Anggota / Pimpinan</th>
                <th>Jabatan / Komisi</th>
                <th>Fraksi / Partai</th>
                <th>Kelengkapan Dewan (AKD)</th>
                <th>No. Telepon / HP</th>
              </tr>
            </thead>
            <tbody>
              ${filteredMembers
                .map(
                  (m, idx) => `
                <tr>
                  <td style="text-align:center;">${idx + 1}</td>
                  <td><strong>${m.nama}</strong></td>
                  <td>${m.jabatan}</td>
                  <td>${m.fraksiPartai}</td>
                  <td>${m.kelengkapanLain}</td>
                  <td>${m.noHp}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Mamuju, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p style="margin-top: 50px;"><strong>Sekretariat DPRD Provinsi Sulawesi Barat</strong></p>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['No', 'Nama Anggota', 'Jabatan', 'Kategori', 'Fraksi/Partai', 'Kelengkapan Dewan (AKD)', 'No HP'];
    const rows = filteredMembers.map((m, index) => [
      index + 1,
      `"${m.nama}"`,
      `"${m.jabatan}"`,
      `"${m.kategori}"`,
      `"${m.fraksiPartai}"`,
      `"${m.kelengkapanLain}"`,
      `"${m.noHp}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Direktori_DPRD_Sulbar_45_Orang_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/89/Coat_of_arms_of_West_Sulawesi.svg"
              alt="Logo Sulbar"
              className="h-10 w-auto"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Direktori Pimpinan & Anggota DPRD Sulawesi Barat (45 Orang)
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Masa Jabatan 2024-2029
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Susunan Pimpinan Dewan & Anggota Komisi I, II, III, dan IV DPRD Provinsi Sulawesi Barat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/63/Logo_DPRD_Sulawesi_Barat.png"
              alt="Logo DPRD"
              className="h-10 w-auto hidden sm:block"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Search & Filters */}
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-[280px]">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama, no HP, atau AKD..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Filter Kategori / Komisi */}
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="SEMUA">Semua Kategori (45 Orang)</option>
              <option value="Pimpinan DPRD">4 Pimpinan DPRD</option>
              <option value="Komisi I">Komisi I (Pemerintahan)</option>
              <option value="Komisi II">Komisi II (Perekonomian)</option>
              <option value="Komisi III">Komisi III (Pembangunan)</option>
              <option value="Komisi IV">Komisi IV (Kesra)</option>
            </select>

            {/* Filter Fraksi */}
            <select
              value={filterFraksi}
              onChange={(e) => setFilterFraksi(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="SEMUA">Semua Fraksi / Partai</option>
              <option value="GOLKAR">Partai Golkar</option>
              <option value="DEMOKRAT">Partai Demokrat</option>
              <option value="NASDEM">Partai NasDem</option>
              <option value="PAN">PAN</option>
              <option value="PDI">PDI-P</option>
              <option value="GERINDRA">Gerindra</option>
              <option value="F.GAB">Fraksi Gabungan</option>
            </select>
          </div>

          {/* Action Buttons: Add, Print, Export */}
          <div className="flex items-center gap-2">
            {canManage ? (
              <button
                onClick={handleOpenAddForm}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Anggota</span>
              </button>
            ) : (
              <div
                className="bg-slate-950 border border-slate-800 text-slate-400 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm"
                title="Akses terbatas: Hanya Admin dan Kabag yang dapat menambah atau mengedit data"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] text-amber-300 font-semibold">Akses Terproteksi (Operator)</span>
              </div>
            )}

            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
              title="Cetak Cetak Daftar Resmi DPRD"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Print SK DPRD</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
              title="Export CSV Data Anggota"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Operator Notice Banner */}
          {!canManage && (
            <div className="bg-blue-950/40 border border-blue-800/60 rounded-xl p-3 text-xs text-blue-200 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Mode Operator (Referensi Resmi Terproteksi)</p>
                <p className="text-[11px] text-blue-300/90 mt-0.5">
                  Sebagai Operator, Anda memiliki akses penuh untuk mencari, memilih pembicara aktif risalah, mencetak SK resmi DPRD, dan mengekspor CSV. Penambahan atau pengubahan data master anggota DPRD dibatasi khusus untuk akun <strong>Admin</strong> dan <strong>Kabag</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Form Create/Edit Panel */}
          {isFormOpen && (
            <form
              onSubmit={handleSaveForm}
              className="bg-slate-950 border border-emerald-500/40 rounded-xl p-5 shadow-lg space-y-4 animate-fadeIn"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  {editingMember ? 'Edit Data Anggota DPRD' : 'Form Entri Anggota DPRD Baru'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    required
                    value={formNama}
                    onChange={(e) => setFormNama(e.target.value)}
                    placeholder="Contoh: H. SYAMSULSAMAD, S.IP, M.Si"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Kategori Structure</label>
                  <select
                    value={formKategori}
                    onChange={(e) =>
                      setFormKategori(e.target.value as any)
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Pimpinan DPRD">Pimpinan DPRD</option>
                    <option value="Komisi I">Komisi I (Pemerintahan)</option>
                    <option value="Komisi II">Komisi II (Perekonomian)</option>
                    <option value="Komisi III">Komisi III (Pembangunan)</option>
                    <option value="Komisi IV">Komisi IV (Kesra)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Jabatan Struktur</label>
                  <input
                    type="text"
                    required
                    value={formJabatan}
                    onChange={(e) => setFormJabatan(e.target.value)}
                    placeholder="Ketua / Wakil / Sekretaris / Anggota"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Fraksi / Partai Politik</label>
                  <input
                    type="text"
                    required
                    value={formFraksi}
                    onChange={(e) => setFormFraksi(e.target.value)}
                    placeholder="GOLKAR / DEMOKRAT / PAN / PDI / GERINDRA / NASDEM / F.GAB"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Kelengkapan Lain (AKD)</label>
                  <input
                    type="text"
                    value={formKelengkapan}
                    onChange={(e) => setFormKelengkapan(e.target.value)}
                    placeholder="BANGGAR / BAMUS / BAPEMPERDA / BK"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Nomor Telepon / WhatsApp</label>
                  <input
                    type="text"
                    value={formNoHp}
                    onChange={(e) => setFormNoHp(e.target.value)}
                    placeholder="0852xxxxxx"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-500 flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingMember ? 'Simpan Perubahan' : 'Tambah Anggota'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Table Directory View */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60 shadow-inner">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-center w-12">No</th>
                    <th className="px-4 py-3">Nama Lengkap Anggota</th>
                    <th className="px-4 py-3">Jabatan & Komisi</th>
                    <th className="px-4 py-3">Fraksi / Partai</th>
                    <th className="px-4 py-3">AKD (Badan)</th>
                    <th className="px-4 py-3">Kontak Telepon / WA</th>
                    <th className="px-4 py-3 text-right">Aksi CRUD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500 italic">
                        Tidak ada data anggota DPRD yang sesuai dengan pencarian atau filter.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member, index) => {
                      const isPimpinan = member.kategori === 'Pimpinan DPRD';
                      const cleanPhone = member.noHp.replace(/[^0-9]/g, '');

                      return (
                        <tr
                          key={member.id}
                          className={`hover:bg-slate-900/80 transition ${
                            isPimpinan ? 'bg-amber-950/10' : ''
                          }`}
                        >
                          <td className="px-4 py-3 text-center text-slate-500 font-mono font-medium">
                            {index + 1}
                          </td>

                          <td className="px-4 py-3 font-semibold text-slate-100">
                            <div className="flex items-center gap-2">
                              {isPimpinan && (
                                <Award className="w-4 h-4 text-amber-400 shrink-0" title="Pimpinan DPRD" />
                              )}
                              <span>{member.nama}</span>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${
                                isPimpinan
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-slate-800 text-slate-200 border-slate-700'
                              }`}
                            >
                              {member.jabatan}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                              {member.fraksiPartai}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <span className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800 font-mono">
                              {member.kelengkapanLain || '-'}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            {member.noHp && member.noHp !== '-' ? (
                              <div className="flex items-center gap-2">
                                <a
                                  href={`tel:${member.noHp}`}
                                  className="text-slate-200 hover:text-emerald-400 font-mono transition flex items-center gap-1"
                                >
                                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>{member.noHp}</span>
                                </a>

                                {cleanPhone && (
                                  <a
                                    href={`https://wa.me/${
                                      cleanPhone.startsWith('0')
                                        ? '62' + cleanPhone.substring(1)
                                        : cleanPhone
                                    }`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-2 py-1 rounded-md transition flex items-center gap-1 shadow"
                                    title="Hubungi WA"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>Hubungi WA</span>
                                  </a>
                                )}
                                <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                                  Valid
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-rose-400 bg-rose-950/50 border border-rose-900/60 px-2 py-0.5 rounded font-medium inline-block">
                                WA Belum Terisi
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {onSelectSpeaker && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onSelectSpeaker(member.nama, `${member.jabatan} (${member.fraksiPartai})`);
                                    onClose();
                                  }}
                                  className="text-[10px] bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 font-bold px-2 py-1 rounded-lg transition flex items-center gap-1 shadow"
                                  title="Pilih Cepat Anggota DPRD Ini Sebagai Pembicara Aktif"
                                >
                                  <User className="w-3 h-3 text-emerald-400" />
                                  <span>Pilih Pembicara</span>
                                </button>
                              )}
                              {canManage ? (
                                <>
                                  <button
                                    onClick={() => handleOpenEditForm(member)}
                                    className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition"
                                    title="Edit Data Anggota (Akses Admin & Kabag)"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(member.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition"
                                    title="Hapus Data Anggota (Akses Admin & Kabag)"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-mono italic px-1 flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5 opacity-60" />
                                  <span>Terkunci</span>
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap justify-between items-center gap-2">
          <span>
            Total Terdata: <strong className="text-emerald-400">{activeMembers.length} Orang</strong> (Daftar Aktif:{' '}
            <strong className="text-white">{filteredMembers.length}</strong>)
          </span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-1.5 rounded-lg transition"
          >
            Tutup Direktori
          </button>
        </div>
      </div>
    </div>
  );
};
