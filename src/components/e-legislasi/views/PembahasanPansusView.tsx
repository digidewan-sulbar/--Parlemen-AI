import React, { useState } from 'react';
import { RanperdaDetail, DIMItem, RoleCode } from '../types';
import { RichTextEditor } from '../../forms/RichTextEditor';
import {
  Users,
  Table,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  FileText,
  MessageSquare,
  Edit,
  Trash2,
  Sparkles,
  Download,
  ShieldCheck,
  KeyRound,
  FileSpreadsheet,
} from 'lucide-react';

interface Props {
  ranperdaList: RanperdaDetail[];
  currentRole: RoleCode;
  onUpdateDIMList: (ranperdaId: string, dimList: DIMItem[]) => void;
}

export const PembahasanPansusView: React.FC<Props> = ({
  ranperdaList,
  currentRole,
  onUpdateDIMList,
}) => {
  const pansusList = ranperdaList.filter(
    (r) =>
      r.statusCode === 'HARMONIZED' ||
      r.statusCode === 'PANSUS_DISCUSSION' ||
      r.statusCode === 'JOINT_APPROVAL'
  );

  const [selectedRanperda, setSelectedRanperda] = useState<RanperdaDetail | null>(
    pansusList[0] || ranperdaList[0] || null
  );

  const [activeSubTab, setActiveSubTab] = useState<'DIM' | 'NOTULENSI'>('DIM');

  // Filter DIM
  const [filterFraksi, setFilterFraksi] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Form Modal Add/Edit DIM Item
  const [isDimModalOpen, setIsDimModalOpen] = useState(false);
  const [editingDimId, setEditingDimId] = useState<string | null>(null);

  const [pasalAyat, setPasalAyat] = useState('');
  const [teksAwal, setTeksAwal] = useState('');
  const [sumberTanggapan, setSumberTanggapan] = useState<DIMItem['sumberTanggapan']>('Fraksi Golkar');
  const [jenisTanggapan, setJenisTanggapan] = useState<DIMItem['jenisTanggapan']>('Ubah');
  const [drafPerubahan, setDrafPerubahan] = useState('');
  const [alasan, setAlasan] = useState('');
  const [statusKesepakatan, setStatusKesepakatan] = useState<DIMItem['statusKesepakatan']>('Pending');

  // Notulensi text state
  const [catatanRapat, setCatatanRapat] = useState(
    'Rapat Pansus Pembahasan Ranperda menyepakati perubahan pada Pasal 12 Ayat (2) dan meminta OPD menyusun simulasi dampak anggaran...'
  );

  if (!selectedRanperda) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
        Tidak ada Ranperda dalam tahap Pembahasan Pansus saat ini.
      </div>
    );
  }

  const currentDimList = selectedRanperda.dimList || [];

  const filteredDim = currentDimList.filter((dim) => {
    const matchFraksi = filterFraksi === 'ALL' || dim.sumberTanggapan === filterFraksi;
    const matchStatus = filterStatus === 'ALL' || dim.statusKesepakatan === filterStatus;
    return matchFraksi && matchStatus;
  });

  const handleSaveDim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasalAyat.trim() || !teksAwal.trim()) return;

    let updatedList: DIMItem[];

    if (editingDimId) {
      updatedList = currentDimList.map((item) =>
        item.id === editingDimId
          ? {
              ...item,
              nomorPasalAyat: pasalAyat,
              teksPasalAwal: teksAwal,
              sumberTanggapan,
              jenisTanggapan,
              drafUsulanPerubahan: drafPerubahan,
              alasanCatatan: alasan,
              statusKesepakatan,
              updatedAt: new Date().toLocaleString('id-ID'),
            }
          : item
      );
    } else {
      const newDim: DIMItem = {
        id: `DIM-${Date.now()}`,
        nomorPasalAyat: pasalAyat,
        teksPasalAwal: teksAwal,
        sumberTanggapan,
        jenisTanggapan,
        drafUsulanPerubahan: drafPerubahan,
        alasanCatatan: alasan,
        statusKesepakatan,
        updatedAt: new Date().toLocaleString('id-ID'),
      };
      updatedList = [newDim, ...currentDimList];
    }

    onUpdateDIMList(selectedRanperda.id, updatedList);
    setIsDimModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingDimId(null);
    setPasalAyat('');
    setTeksAwal('');
    setDrafPerubahan('');
    setAlasan('');
    setStatusKesepakatan('Pending');
  };

  const handleOpenEdit = (dim: DIMItem) => {
    setEditingDimId(dim.id);
    setPasalAyat(dim.nomorPasalAyat);
    setTeksAwal(dim.teksPasalAwal);
    setSumberTanggapan(dim.sumberTanggapan);
    setJenisTanggapan(dim.jenisTanggapan);
    setDrafPerubahan(dim.drafUsulanPerubahan);
    setAlasan(dim.alasanCatatan);
    setStatusKesepakatan(dim.statusKesepakatan);
    setIsDimModalOpen(true);
  };

  const handleQuickChangeStatus = (dimId: string, newStatus: DIMItem['statusKesepakatan']) => {
    const updatedList = currentDimList.map((item) =>
      item.id === dimId ? { ...item, statusKesepakatan: newStatus } : item
    );
    onUpdateDIMList(selectedRanperda.id, updatedList);
  };

  const handleDeleteDim = (dimId: string) => {
    const updatedList = currentDimList.filter((item) => item.id !== dimId);
    onUpdateDIMList(selectedRanperda.id, updatedList);
  };

  const handleExportDimCsv = () => {
    if (!selectedRanperda || currentDimList.length === 0) {
      alert('Tidak ada data DIM untuk diexport.');
      return;
    }

    const headers = ['Nomor Pasal/Ayat', 'Teks Draf Awal', 'Sumber Tanggapan', 'Jenis Tanggapan', 'Draf Usulan Perubahan', 'Alasan/Catatan', 'Status Kesepakatan'];
    const rows = currentDimList.map((item) => [
      `"${item.nomorPasalAyat.replace(/"/g, '""')}"`,
      `"${item.teksPasalAwal.replace(/"/g, '""')}"`,
      `"${item.sumberTanggapan.replace(/"/g, '""')}"`,
      `"${item.jenisTanggapan.replace(/"/g, '""')}"`,
      `"${(item.drafUsulanPerubahan || '').replace(/"/g, '""')}"`,
      `"${(item.alasanCatatan || '').replace(/"/g, '""')}"`,
      `"${item.statusKesepakatan.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MATRIKS_DIM_${selectedRanperda.nomorRanperda.replace(/\//g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [tteVerified, setTteVerified] = useState(false);

  const handleBSreEsignSimulate = () => {
    setTteVerified(true);
    alert('Tanda Tangan Elektronik (TTE / BSrE BSSN) Berhasil Diverifikasi pada Dokumen Matriks DIM & Notulensi Pansus!');
  };

  return (
    <div className="space-y-6">
      {/* Top Selector Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-purple-400 font-bold bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                WORKSPACE PEMBAHASAN PANSUS / BAPEMPERDA
              </span>
              <span className="text-xs text-slate-400">| Collaborative DIM Engine</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Daftar Inventarisasi Masalah (DIM) & Notulensi Rapat
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedRanperda.id}
              onChange={(e) => {
                const found = ranperdaList.find((r) => r.id === e.target.value);
                if (found) setSelectedRanperda(found);
              }}
              className="bg-slate-950 border border-slate-800 text-xs font-bold text-emerald-400 rounded-xl px-3 py-2 focus:outline-none"
            >
              {ranperdaList.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nomorRanperda} - {r.judulRanperda.substring(0, 45)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Ranperda Meta Info */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between text-xs gap-3">
          <div>
            <span className="text-slate-400">Pansus Pembahas:</span>{' '}
            <strong className="text-white">{selectedRanperda.pansusName || 'Pansus DPRD Sulbar'}</strong>{' '}
            <span className="text-slate-500">(Ketua: {selectedRanperda.pansusKetua || 'H. A. Muslim'})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Total Matriks DIM:</span>
            <span className="bg-purple-950 text-purple-300 font-extrabold px-2.5 py-0.5 rounded border border-purple-800">
              {currentDimList.length} Pasal
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation: DIM Table vs Notulensi */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveSubTab('DIM')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeSubTab === 'DIM'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Matriks DIM Interaktif ({currentDimList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('NOTULENSI')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeSubTab === 'NOTULENSI'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Notulensi Rapat & History Revisi</span>
          </button>
        </div>

        {activeSubTab === 'DIM' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportDimCsv}
              className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-purple-300 font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
              title="Export ke Format Spreadsheet (.csv / .xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-purple-400" />
              <span>Export Matriks DIM</span>
            </button>

            <button
              onClick={handleBSreEsignSimulate}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                tteVerified
                  ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-amber-300 hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{tteVerified ? 'TTE BSrE Verified' : 'Integrasi TTE BSrE'}</span>
            </button>

            <button
              onClick={() => {
                resetForm();
                setIsDimModalOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Item DIM</span>
            </button>
          </div>
        )}
      </div>

      {/* TAB CONTENT 1: COLLABORATIVE DIM TABLE */}
      {activeSubTab === 'DIM' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-purple-400" />
                <span>Filter Fraksi/OPD:</span>
              </span>
              <select
                value={filterFraksi}
                onChange={(e) => setFilterFraksi(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white rounded-lg px-2.5 py-1 text-xs"
              >
                <option value="ALL">Semua Sumber Tanggapan</option>
                <option value="Fraksi Golkar">Fraksi Golkar</option>
                <option value="Fraksi PDI-P">Fraksi PDI-P</option>
                <option value="Fraksi NasDem">Fraksi NasDem</option>
                <option value="Fraksi Demokrat">Fraksi Demokrat</option>
                <option value="OPD Pemrakarsa">OPD Pemrakarsa</option>
                <option value="Biro Hukum">Biro Hukum</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Status Kesepakatan:</span>
              {['ALL', 'Disetujui', 'Pending', 'Ditolak'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    filterStatus === st
                      ? 'bg-purple-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {st === 'ALL' ? 'Semua' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive DIM Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-3 w-28">Pasal / Ayat</th>
                    <th className="p-3 w-1/4">Teks Pasal Draf Awal</th>
                    <th className="p-3 w-32">Sumber & Tanggapan</th>
                    <th className="p-3 w-1/3">Draf Usulan Perubahan & Alasan</th>
                    <th className="p-3 text-center w-36">Status Kesepakatan</th>
                    <th className="p-3 text-right w-20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
                  {filteredDim.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        Belum ada data Daftar Inventarisasi Masalah (DIM) yang sesuai filter.
                      </td>
                    </tr>
                  ) : (
                    filteredDim.map((dim) => (
                      <tr key={dim.id} className="hover:bg-slate-800/50 transition">
                        <td className="p-3 font-mono font-bold text-emerald-400">
                          {dim.nomorPasalAyat}
                        </td>
                        <td className="p-3 text-slate-300 leading-relaxed text-[11px]">
                          {dim.teksPasalAwal}
                        </td>
                        <td className="p-3 space-y-1">
                          <span className="block font-bold text-slate-100 text-[11px]">
                            {dim.sumberTanggapan}
                          </span>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              dim.jenisTanggapan === 'Tetap'
                                ? 'bg-slate-800 text-slate-300'
                                : dim.jenisTanggapan === 'Ubah'
                                ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                : dim.jenisTanggapan === 'Hapus'
                                ? 'bg-red-950 text-red-300 border border-red-800'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}
                          >
                            {dim.jenisTanggapan}
                          </span>
                        </td>
                        <td className="p-3 space-y-1 text-[11px]">
                          <div className="font-semibold text-slate-100">
                            {dim.drafUsulanPerubahan || '-'}
                          </div>
                          <div className="text-[10px] text-slate-400 italic">
                            Catatan: {dim.alasanCatatan || '-'}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                dim.statusKesepakatan === 'Disetujui'
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                  : dim.statusKesepakatan === 'Pending'
                                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                                  : 'bg-red-950 text-red-300 border-red-800'
                              }`}
                            >
                              {dim.statusKesepakatan}
                            </span>

                            {/* Quick Status Toggles */}
                            <div className="flex items-center gap-1 mt-1">
                              <button
                                onClick={() => handleQuickChangeStatus(dim.id, 'Disetujui')}
                                title="Setuju"
                                className="p-1 rounded bg-emerald-950 hover:bg-emerald-800 text-emerald-400"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleQuickChangeStatus(dim.id, 'Pending')}
                                title="Pending"
                                className="p-1 rounded bg-amber-950 hover:bg-amber-800 text-amber-400"
                              >
                                <Clock className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleQuickChangeStatus(dim.id, 'Ditolak')}
                                title="Tolak"
                                className="p-1 rounded bg-red-950 hover:bg-red-800 text-red-400"
                              >
                                <XCircle className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEdit(dim)}
                              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition"
                              title="Edit DIM"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDim(dim.id)}
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition"
                              title="Hapus DIM"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: NOTULENSI & REVISI PASAL */}
      {activeSubTab === 'NOTULENSI' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span>Notulensi Rapat Pansus & Catatan Pembahasan</span>
          </h3>

          <RichTextEditor
            label=""
            value={catatanRapat}
            onChange={setCatatanRapat}
            placeholder="Ketik catatan notulensi rapat Pansus, poin-poin kesepakatan pembahasan, serta masukan dari fraksi dan OPD..."
            minHeight="340px"
          />

          <div className="flex justify-end pt-2">
            <button
              onClick={() => alert('Notulensi Rapat Pansus tersimpan secara realtime!')}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-purple-900/30 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Simpan Catatan Notulensi</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal Add/Edit DIM Item */}
      {isDimModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit className="w-4 h-4 text-purple-400" />
                <span>{editingDimId ? 'Edit Item DIM (Daftar Inventaris Masalah)' : 'Tambah Item DIM Baru'}</span>
              </h3>
              <button
                onClick={() => setIsDimModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDim} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Pasal / Ayat <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pasal 14 Ayat (1)"
                    value={pasalAyat}
                    onChange={(e) => setPasalAyat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Sumber Tanggapan
                  </label>
                  <select
                    value={sumberTanggapan}
                    onChange={(e) => setSumberTanggapan(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Fraksi Golkar">Fraksi Golkar</option>
                    <option value="Fraksi PDI-P">Fraksi PDI-P</option>
                    <option value="Fraksi NasDem">Fraksi NasDem</option>
                    <option value="Fraksi Demokrat">Fraksi Demokrat</option>
                    <option value="OPD Pemrakarsa">OPD Pemrakarsa</option>
                    <option value="Biro Hukum">Biro Hukum</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Teks Pasal Draf Awal <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Rumusan teks awal..."
                  value={teksAwal}
                  onChange={(e) => setTeksAwal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Jenis Tanggapan
                  </label>
                  <select
                    value={jenisTanggapan}
                    onChange={(e) => setJenisTanggapan(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Tetap">Tetap</option>
                    <option value="Ubah">Ubah</option>
                    <option value="Hapus">Hapus</option>
                    <option value="Tambah">Tambah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Status Kesepakatan
                  </label>
                  <select
                    value={statusKesepakatan}
                    onChange={(e) => setStatusKesepakatan(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Disetujui">Disetujui</option>
                    <option value="Pending">Pending</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>
              </div>

              <div>
                <RichTextEditor
                  label="Draft Usulan Perubahan Rumusan"
                  value={drafPerubahan}
                  onChange={setDrafPerubahan}
                  placeholder="Ketik rumusan alternatif / usulan penyempurnaan norma pasal..."
                  minHeight="220px"
                />
              </div>

              <div>
                <RichTextEditor
                  label="Alasan / Catatan Argumentasi Usulan"
                  value={alasan}
                  onChange={setAlasan}
                  placeholder="Ketik penjelasan hukum, rasio legis, sosiologis, atau konteks urgensi usulan..."
                  minHeight="220px"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDimModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-lg shadow-purple-900/30"
                >
                  Simpan Matriks DIM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
