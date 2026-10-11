import React, { useState } from 'react';
import { RdpRekomendasiExtended, RdpStatus } from './rdpTypes';
import { PEJABAT_PEMPROV_SULBAR_2026 } from '../../data/pejabatPemprovData';
import { RichTextEditor } from '../forms/RichTextEditor';
import { formatWhatsAppPhone, HtmlDisplay } from './rdpWaUtils';
import { AuthUser } from '../../types';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Send,
  Building2,
  FileText,
  MessageSquare,
  ShieldCheck,
  X,
  ExternalLink,
  Edit,
  Trash2,
  PhoneCall,
  Download,
  AlertTriangle,
  Zap,
  Lock,
  Info,
} from 'lucide-react';

interface Props {
  dataList: RdpRekomendasiExtended[];
  currentUser?: AuthUser | null;
  onAddRecommendation: (newItem: RdpRekomendasiExtended) => void;
  onUpdateRecommendation: (updatedItem: RdpRekomendasiExtended) => void;
  onDeleteRecommendation: (id: string) => void;
  onSendWaNotification: (item: RdpRekomendasiExtended) => void;
  onOpenEvidencePortal: (item: RdpRekomendasiExtended) => void;
}

export const RdpMasterControlView: React.FC<Props> = ({
  dataList,
  currentUser,
  onAddRecommendation,
  onUpdateRecommendation,
  onDeleteRecommendation,
  onSendWaNotification,
  onOpenEvidencePortal,
}) => {
  const canVerify = currentUser?.role === 'admin' || currentUser?.role === 'kabag';
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKomisiFilter, setSelectedKomisiFilter] = useState<string>('ALL');

  // Form Modal State (Create / Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RdpRekomendasiExtended | null>(null);

  // Form Fields
  const [formNomorRdp, setFormNomorRdp] = useState('');
  const [formJudulRdp, setFormJudulRdp] = useState('');
  const [formKomisi, setFormKomisi] = useState<'Komisi I' | 'Komisi II' | 'Komisi III' | 'Komisi IV'>('Komisi I');
  const [formOpd, setFormOpd] = useState('');
  const [formPejabatNama, setFormPejabatNama] = useState('');
  const [formPejabatWa, setFormPejabatWa] = useState('');
  const [formPicNama, setFormPicNama] = useState('');
  const [formPicWa, setFormPicWa] = useState('');
  const [formPoinCatatan, setFormPoinCatatan] = useState('');
  const [formPerintah, setFormPerintah] = useState('');
  const [formSlaDays, setFormSlaDays] = useState(14);

  // Review / Verification Modal State
  const [reviewingItem, setReviewingItem] = useState<RdpRekomendasiExtended | null>(null);
  const [catatanRevisiInput, setCatatanRevisiInput] = useState('');

  // Handle OPD Selection from Master Pejabat Data
  const handleSelectPejabatMaster = (pejabatId: string) => {
    const found = PEJABAT_PEMPROV_SULBAR_2026.find((p) => p.id === pejabatId);
    if (found) {
      setFormOpd(found.instansiOpd);
      setFormPejabatNama(found.nama);
      setFormPejabatWa(found.no_whatsapp_utama || '');
      setFormPicNama(found.nama_pic_pendamping || '');
      setFormPicWa(found.no_whatsapp_pic || '');
    }
  };

  const handleOpenAddForm = () => {
    setEditingItem(null);
    const dateStr = new Date().toISOString().split('T')[0];
    setFormNomorRdp(`RDP/${formKomisi.replace(' ', '-').toUpperCase()}/${Math.floor(100 + Math.random() * 900)}/2026`);
    setFormJudulRdp('');
    setFormKomisi('Komisi I');
    setFormOpd('');
    setFormPejabatNama('');
    setFormPejabatWa('');
    setFormPicNama('');
    setFormPicWa('');
    setFormPoinCatatan('');
    setFormPerintah('');
    setFormSlaDays(14);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item: RdpRekomendasiExtended) => {
    setEditingItem(item);
    setFormNomorRdp(item.nomorRdp);
    setFormJudulRdp(item.judulRdp);
    setFormKomisi(item.komisi);
    setFormOpd(item.opdPenanggungJawab);
    setFormPejabatNama(item.opdPejabatNama);
    setFormPejabatWa(item.opdPejabatWa);
    setFormPicNama(item.picNama || '');
    setFormPicWa(item.picWa || '');
    setFormPoinCatatan(item.poinCatatan);
    setFormPerintah(item.perintahTindakLanjut);
    setFormSlaDays(item.slaDays || 14);
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudulRdp.trim() || !formOpd.trim()) {
      alert('Judul RDP dan OPD Penanggung Jawab wajib diisi.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const deadlineDateObj = new Date();
    deadlineDateObj.setDate(deadlineDateObj.getDate() + (formSlaDays || 14));
    const deadlineStr = deadlineDateObj.toISOString().split('T')[0];

    if (editingItem) {
      const updated: RdpRekomendasiExtended = {
        ...editingItem,
        nomorRdp: formNomorRdp,
        judulRdp: formJudulRdp,
        komisi: formKomisi,
        opdPenanggungJawab: formOpd,
        opdPejabatNama: formPejabatNama,
        opdPejabatWa: formPejabatWa,
        picNama: formPicNama,
        picWa: formPicWa,
        poinCatatan: formPoinCatatan,
        perintahTindakLanjut: formPerintah,
        slaDays: formSlaDays,
        deadlineDate: deadlineStr,
      };
      onUpdateRecommendation(updated);
    } else {
      const newId = `RDP-2026-${Math.floor(100 + Math.random() * 900)}`;
      const newItem: RdpRekomendasiExtended = {
        id: newId,
        nomorRdp: formNomorRdp,
        judulRdp: formJudulRdp,
        komisi: formKomisi,
        opdPenanggungJawab: formOpd,
        opdPejabatNama: formPejabatNama,
        opdPejabatWa: formPejabatWa,
        picNama: formPicNama,
        picWa: formPicWa,
        poinCatatan: formPoinCatatan,
        perintahTindakLanjut: formPerintah,
        status: 'TERBIT_DIKIRIM',
        tanggalTerbit: todayStr,
        slaDays: formSlaDays,
        deadlineDate: deadlineStr,
        magicLinkToken: `MAGIC-${formOpd.replace(/[^a-zA-Z]/g, '').substring(0, 6).toUpperCase()}-2026`,
        evidenceFiles: [],
        statusLogs: [
          {
            id: `LOG-${Date.now()}`,
            statusAwal: 'DRAFT',
            statusBaru: 'TERBIT_DIKIRIM',
            timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }),
            actor: 'Setwan Admin / Komisi DPRD',
            keterangan: 'Rekomendasi RDP resmi diterbitkan dan dikirimkan via WA.',
          },
        ],
      };
      onAddRecommendation(newItem);
    }

    setIsFormOpen(false);
  };

  // Review Verification Handlers (Approve -> TUNTAS / Reject -> DIKEMBALIKAN)
  const handleApproveTuntas = () => {
    if (!canVerify) {
      alert('Akses Ditolak: Hanya Admin dan Kabag yang berwenang mengotentikasi dan mengesahkan status TUNTAS rekomendasi RDP.');
      return;
    }
    if (!reviewingItem) return;
    const updated: RdpRekomendasiExtended = {
      ...reviewingItem,
      status: 'TUNTAS',
      statusLogs: [
        ...(reviewingItem.statusLogs || []),
        {
          id: `LOG-${Date.now()}`,
          statusAwal: reviewingItem.status,
          statusBaru: 'TUNTAS',
          timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }),
          actor: currentUser?.fullName ? `${currentUser.fullName} (${currentUser.jabatan})` : 'Pimpinan Komisi DPRD',
          keterangan: 'Bukti tindak lanjut diverifikasi dan disetujui. Rekomendasi dinyatakan TUNTAS.',
        },
      ],
    };
    onUpdateRecommendation(updated);
    setReviewingItem(null);
  };

  const handleRejectDikembalikan = () => {
    if (!canVerify) {
      alert('Akses Ditolak: Hanya Admin dan Kabag yang berwenang mengembalikan rekomendasi tindak lanjut RDP.');
      return;
    }
    if (!reviewingItem) return;
    if (!catatanRevisiInput.trim()) {
      alert('Mohon masukkan catatan revisi untuk OPD.');
      return;
    }
    const updated: RdpRekomendasiExtended = {
      ...reviewingItem,
      status: 'DIKEMBALIKAN',
      catatanKomisiRevisi: catatanRevisiInput,
      statusLogs: [
        ...(reviewingItem.statusLogs || []),
        {
          id: `LOG-${Date.now()}`,
          statusAwal: reviewingItem.status,
          statusBaru: 'DIKEMBALIKAN',
          timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }),
          actor: currentUser?.fullName ? `${currentUser.fullName} (${currentUser.jabatan})` : 'Komisi DPRD Sulbar',
          keterangan: `Laporan dikembalikan. Catatan: ${catatanRevisiInput}`,
        },
      ],
    };
    onUpdateRecommendation(updated);
    setReviewingItem(null);
    setCatatanRevisiInput('');
  };

  // Filter Data List
  const filteredList = dataList.filter((item) => {
    const matchesStatus = activeStatusFilter === 'ALL' || item.status === activeStatusFilter;
    const matchesKomisi = selectedKomisiFilter === 'ALL' || item.komisi === selectedKomisiFilter;
    const matchesSearch =
      item.judulRdp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomorRdp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.opdPenanggungJawab.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.opdPejabatNama.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesKomisi && matchesSearch;
  });

  const getStatusBadge = (status: RdpStatus) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'TERBIT_DIKIRIM':
        return 'bg-sky-950 text-sky-300 border-sky-700/80';
      case 'DALAM_PROSES':
        return 'bg-blue-950 text-blue-300 border-blue-700/80';
      case 'BUTUH_VERIFIKASI':
        return 'bg-amber-950 text-amber-300 border-amber-600/80 animate-pulse font-bold';
      case 'TUNTAS':
        return 'bg-emerald-950 text-emerald-300 border-emerald-700/80 font-bold';
      case 'OVERDUE':
        return 'bg-rose-950 text-rose-300 border-rose-700/80 animate-bounce font-black';
      case 'DIKEMBALIKAN':
        return 'bg-purple-950 text-purple-300 border-purple-700/80';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 border border-slate-800 p-4 rounded-xl">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Pusat Kendali & Pengelolaan Rekomendasi RDP</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Pengelolaan alur dokumen, verifikasi laporan OPD, dan penagihan tenggat waktu 14 Hari Kerja.
          </p>
        </div>

        <button
          onClick={handleOpenAddForm}
          className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Rekomendasi Baru</span>
        </button>
      </div>

      {/* Filter Tabs & Toolbar */}
      <div className="space-y-3">
        {/* Status Lifecycle Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {[
            { id: 'ALL', label: 'Semua Status' },
            { id: 'TERBIT_DIKIRIM', label: 'Terbit & WA' },
            { id: 'DALAM_PROSES', label: 'Dalam Proses' },
            { id: 'BUTUH_VERIFIKASI', label: 'Memerlukan Verifikasi Komisi' },
            { id: 'TUNTAS', label: 'Tuntas' },
            { id: 'OVERDUE', label: 'Terlambat' },
            { id: 'DIKEMBALIKAN', label: 'Dikembalikan / Perbaikan' },
          ].map((tab) => {
            const count =
              tab.id === 'ALL'
                ? dataList.length
                : dataList.filter((d) => d.status === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg border font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeStatusFilter === tab.id
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded-full font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Select Komisi Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nomor RDP, judul, OPD, atau nama pejabat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <select
              value={selectedKomisiFilter}
              onChange={(e) => setSelectedKomisiFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="ALL">Semua Komisi DPRD</option>
              <option value="Komisi I">Komisi I (Pemerintahan)</option>
              <option value="Komisi II">Komisi II (Perekonomian)</option>
              <option value="Komisi III">Komisi III (Pembangunan)</option>
              <option value="Komisi IV">Komisi IV (Kesra)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-800 text-[11px]">
              <tr>
                <th className="px-4 py-3">Rekomendasi & Komisi</th>
                <th className="px-4 py-3">OPD & Pejabat</th>
                <th className="px-4 py-3 text-center">Status Alur Kerja</th>
                <th className="px-4 py-3 text-center">Batas Waktu Tenggat</th>
                <th className="px-4 py-3 text-right">Aksi & Disposisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500 italic">
                    Tidak ada data rekomendasi RDP yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/60 transition group">
                    <td className="px-4 py-3.5 space-y-1 max-w-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-amber-400 font-bold bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 rounded">
                          {item.nomorRdp}
                        </span>
                        <span className="text-[10px] font-extrabold text-blue-400 uppercase">
                          {item.komisi}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-100 text-xs leading-snug group-hover:text-amber-300 transition">
                        {item.judulRdp}
                      </h4>
                      <div className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
                        <HtmlDisplay htmlStr={item.perintahTindakLanjut} />
                      </div>
                    </td>

                    <td className="px-4 py-3.5 space-y-1">
                      <p className="font-bold text-slate-200 text-xs flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{item.opdPenanggungJawab}</span>
                      </p>
                      <p className="text-[11px] text-slate-400">{item.opdPejabatNama}</p>
                      {item.opdPejabatWa && (
                        <a
                          href={`https://api.whatsapp.com/send?phone=${formatWhatsAppPhone(item.opdPejabatWa)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono hover:underline"
                          title="Hubungi langsung via WhatsApp"
                        >
                          <PhoneCall className="w-2.5 h-2.5" />
                          <span>+{formatWhatsAppPhone(item.opdPejabatWa)}</span>
                        </a>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-md border uppercase ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center font-mono">
                      <span className="text-slate-200 font-bold block">{item.deadlineDate}</span>
                      <span className="text-[10px] text-slate-500">SLA {item.slaDays} Hari</span>
                    </td>

                    <td className="px-4 py-3.5 text-right space-y-1.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSendWaNotification(item)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1 shadow"
                          title="Kirim Pesan WhatsApp Notifikasi / Penagihan"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Kirim WA</span>
                        </button>

                        {item.status === 'BUTUH_VERIFIKASI' && (
                          <button
                            onClick={() => setReviewingItem(item)}
                            className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1 shadow animate-pulse"
                            title="Tinjau Bukti & Setujui / Kembalikan"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verifikasi</span>
                          </button>
                        )}

                        <button
                          onClick={() => onOpenEvidencePortal(item)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-medium px-2 py-1 rounded-lg transition flex items-center gap-1 border border-slate-700"
                          title="Pratinjau Tampilan OPD"
                        >
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>Portal</span>
                        </button>

                        <button
                          onClick={() => handleOpenEditForm(item)}
                          className="p-1 text-slate-400 hover:text-amber-400 transition"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteRecommendation(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 transition"
                          title="Hapus"
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

      {/* FORM CREATE / EDIT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-amber-500/50 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>{editingItem ? 'Edit Rekomendasi RDP' : 'Entri Rekomendasi RDP Baru'}</span>
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              {/* Quick Select Pejabat OPD */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
                <label className="block text-[11px] font-bold text-amber-400 uppercase tracking-wide">
                  Pilih Otomatis OPD & Pejabat dari Master Data
                </label>
                <select
                  onChange={(e) => handleSelectPejabatMaster(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:border-amber-500"
                >
                  <option value="">-- Pilih Pejabat Pemprov Sulbar --</option>
                  {PEJABAT_PEMPROV_SULBAR_2026.map((pejabat) => (
                    <option key={pejabat.id} value={pejabat.id}>
                      {pejabat.nama} - {pejabat.instansiOpd}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nomor RDP *</label>
                  <input
                    type="text"
                    required
                    value={formNomorRdp}
                    onChange={(e) => setFormNomorRdp(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Komisi DPRD *</label>
                  <select
                    value={formKomisi}
                    onChange={(e) => setFormKomisi(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 font-semibold"
                  >
                    <option value="Komisi I">Komisi I (Pemerintahan)</option>
                    <option value="Komisi II">Komisi II (Perekonomian)</option>
                    <option value="Komisi III">Komisi III (Pembangunan)</option>
                    <option value="Komisi IV">Komisi IV (Kesra)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Judul / Perihal RDP *</label>
                  <input
                    type="text"
                    required
                    value={formJudulRdp}
                    onChange={(e) => setFormJudulRdp(e.target.value)}
                    placeholder="Contoh: Evaluasi Penyerapan DAK & Tenaga Pengajar PPPK..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">OPD Penanggung Jawab *</label>
                  <input
                    type="text"
                    required
                    value={formOpd}
                    onChange={(e) => setFormOpd(e.target.value)}
                    placeholder="Dinas Education..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Pejabat OPD</label>
                  <input
                    type="text"
                    value={formPejabatNama}
                    onChange={(e) => setFormPejabatNama(e.target.value)}
                    placeholder="Nama Kepala Dinas..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">No WhatsApp Pejabat (Format: 628...)</label>
                  <input
                    type="text"
                    value={formPejabatWa}
                    onChange={(e) => setFormPejabatWa(e.target.value)}
                    placeholder="628123456789"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tenggat SLA (Hari Kerja)</label>
                  <input
                    type="number"
                    value={formSlaDays}
                    onChange={(e) => setFormSlaDays(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-bold focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-slate-200 font-bold text-xs">
                    Poin Catatan Masalah RDP
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Format uraian poin temuan rapat, aduan masyarakat, atau catatan masalah Komisi dengan gaya Ms. Word (Tebal, Miring, Penomoran/Bullet).
                  </p>
                  <RichTextEditor
                    value={formPoinCatatan}
                    onChange={(val) => setFormPoinCatatan(val)}
                    placeholder="Uraikan poin-poin catatan rapat, temuan lapangan, aduan masyarakat..."
                    minHeight="140px"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-slate-200 font-bold text-xs">
                    Perintah & Rekomendasi Tindak Lanjut *
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Instruksi spesifik yang wajib dilaksanakan OPD Pemprov Sulbar (Gunakan alat format Paragraf, Judul, Tebal, Bullet/Penomoran).
                  </p>
                  <RichTextEditor
                    value={formPerintah}
                    onChange={(val) => setFormPerintah(val)}
                    placeholder="Ketik instruksi & perintah tindak lanjut RDP yang harus dijalankan OPD..."
                    minHeight="180px"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2 rounded-xl shadow-lg transition"
                >
                  Simpan & Terbitkan Rekomendasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VERIFICATION / REVIEW MODAL FOR KOMISI DPRD */}
      {reviewingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-amber-500/60 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span>Verifikasi Bukti Tindak Lanjut OPD</span>
              </h3>
              <button onClick={() => setReviewingItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="font-mono text-[10px] text-amber-400 font-bold">{reviewingItem.nomorRdp}</span>
                <h4 className="font-bold text-slate-100">{reviewingItem.judulRdp}</h4>
                <p className="text-slate-400">OPD: {reviewingItem.opdPenanggungJawab}</p>
              </div>

              <div>
                <span className="font-bold text-slate-200 block mb-1">Uraian & Kronologi Eksekusi OPD:</span>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-slate-300 italic">
                  "{reviewingItem.kronologiEksekusi || 'Belum ada deskripsi kronologi'}"
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-200 block mb-1">Berkas Bukti (Evidence Vault):</span>
                {reviewingItem.evidenceFiles && reviewingItem.evidenceFiles.length > 0 ? (
                  <div className="space-y-2">
                    {reviewingItem.evidenceFiles.map((file) => (
                      <div
                        key={file.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-200 block truncate">{file.fileName}</span>
                            <span className="text-[10px] text-slate-500">{file.fileSize} • {file.uploadedAt}</span>
                          </div>
                        </div>
                        <a
                          href={file.fileUrl}
                          download
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 rounded-lg border border-slate-700"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Belum ada berkas terunggah.</p>
                )}
              </div>

              {/* Notice for Operator if viewing */}
              {!canVerify && (
                <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-3 text-[11px] text-amber-200 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Mode Tinjau Administratif Operator:</strong> Anda dapat memeriksa kelengkapan berkas bukti dan kronologi tindak lanjut OPD. Hak verifikasi pengesahan <strong>TUNTAS</strong> atau <strong>DIKEMBALIKAN</strong> merupakan wewenang otentikasi akun <strong>Admin</strong> dan <strong>Kabag Persidangan</strong>.
                  </span>
                </div>
              )}

              {/* Reject Note Input */}
              {canVerify && (
                <div className="pt-2">
                  <label className="block font-bold text-rose-400 mb-1">
                    Catatan Komisi (Wajib Diisi Jika Mengembalikan Laporan)
                  </label>
                  <textarea
                    rows={2}
                    value={catatanRevisiInput}
                    onChange={(e) => setCatatanRevisiInput(e.target.value)}
                    placeholder="Contoh: Bukti foto serah terima kurang lengkap, mohon lampirkan BAST resmi..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:border-rose-500"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setReviewingItem(null)}
                className="px-4 py-2 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Tutup
              </button>

              {canVerify ? (
                <>
                  <button
                    onClick={handleRejectDikembalikan}
                    className="bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold text-xs px-4 py-2 rounded-xl transition"
                  >
                    Kembalikan / Minta Revisi
                  </button>
                  <button
                    onClick={handleApproveTuntas}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-lg transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Setujui & Tandai TUNTAS</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 font-mono">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Verifikasi Dibatasi (Admin & Kabag)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
