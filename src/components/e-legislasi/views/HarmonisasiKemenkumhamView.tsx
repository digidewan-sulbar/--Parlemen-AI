import React, { useState } from 'react';
import { RanperdaDetail, RoleCode, DocumentVersion } from '../types';
import { DocumentUploadModal } from '../components/DocumentUploadModal';
import {
  Scale,
  FileCheck2,
  Upload,
  CheckCircle2,
  FileText,
  Building2,
  AlertTriangle,
  Clock,
  Sparkles,
  Download,
  RotateCcw,
  Inbox,
  History,
  FileCode,
} from 'lucide-react';

interface Props {
  ranperdaList: RanperdaDetail[];
  currentRole: RoleCode;
  onUpdateRanperdaStatus: (id: string, newStatus: any, note: string) => void;
  onAddDocumentToRanperda?: (ranperdaId: string, doc: DocumentVersion) => void;
}

export const HarmonisasiKemenkumhamView: React.FC<Props> = ({
  ranperdaList,
  currentRole,
  onUpdateRanperdaStatus,
  onAddDocumentToRanperda,
}) => {
  const [inboxTab, setInboxTab] = useState<'INBOX' | 'COMPLETED'>('INBOX');

  // Filter Ranperda
  const inboxList = ranperdaList.filter(
    (r) =>
      r.statusCode === 'DRAFT_PROPOSED' ||
      r.statusCode === 'HARMONIZATION_KEMENKUMHAM'
  );

  const completedList = ranperdaList.filter(
    (r) =>
      r.statusCode === 'HARMONIZED' ||
      r.statusCode === 'PANSUS_DISCUSSION' ||
      r.statusCode === 'JOINT_APPROVAL' ||
      r.statusCode === 'FASILITASI_KEMENDAGRI' ||
      r.statusCode === 'NOREG_ISSUED' ||
      r.statusCode === 'ENACTED_JDIH'
  );

  const activeList = inboxTab === 'INBOX' ? inboxList : completedList;

  const [selectedItem, setSelectedItem] = useState<RanperdaDetail | null>(
    activeList[0] || ranperdaList[0] || null
  );

  const [catatanLegalDrafting, setCatatanLegalDrafting] = useState('');
  const [nomorBAHarmonisasi, setNomorBAHarmonisasi] = useState('');
  const [isSuccessMessage, setIsSuccessMessage] = useState<string | null>(null);

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const isKemenkumhamRole =
    currentRole === 'ROLE_KEMENKUMHAM' || currentRole === 'ROLE_SETWAN';

  const handleApproveHarmonisasi = () => {
    if (!selectedItem) return;

    const noBA =
      nomorBAHarmonisasi ||
      `W.33.HN.01.02-${Math.floor(Math.random() * 800 + 100)} TAHUN 2026`;

    onUpdateRanperdaStatus(
      selectedItem.id,
      'HARMONIZED',
      `Berita Acara Harmonisasi diterbitkan Kanwil Kemenkumham Sulbar dengan Nomor: ${noBA}. Catatan: ${
        catatanLegalDrafting || 'Seluruh konsepsi hukum telah selaras dengan UU No. 13/2022.'
      }`
    );

    setIsSuccessMessage('Berita Acara Harmonisasi Selesai berhasil diterbitkan!');
    setTimeout(() => setIsSuccessMessage(null), 4000);
  };

  const handleReturnForRevision = () => {
    if (!selectedItem) return;

    onUpdateRanperdaStatus(
      selectedItem.id,
      'DRAFT_PROPOSED',
      `[BUTUH PERBAIKAN] Draf dikembalikan Kanwil Kemenkumham ke Pemrakarsa/Setwan untuk perbaikan teknis legal drafting. Catatan: ${
        catatanLegalDrafting || 'Terdapat pasal bertentangan dengan hierarki hukum di atasnya.'
      }`
    );

    setIsSuccessMessage('Status diperbarui: Dikembalikan ke Pemrakarsa untuk Perbaikan (Butuh Perbaikan).');
    setTimeout(() => setIsSuccessMessage(null), 4000);
  };

  const handleUploadSuccess = (newDoc: DocumentVersion) => {
    if (selectedItem && onAddDocumentToRanperda) {
      onAddDocumentToRanperda(selectedItem.id, newDoc);
    }
    setIsSuccessMessage(`Dokumen ${newDoc.fileName} (${newDoc.versionName}) berhasil diunggah!`);
    setTimeout(() => setIsSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Upload Modal */}
      {selectedItem && (
        <DocumentUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          ranperdaTitle={selectedItem.judulRanperda}
          currentRole={currentRole}
          existingDocuments={selectedItem.documents}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-amber-400 font-bold bg-amber-950 px-2.5 py-0.5 rounded border border-amber-800">
              PORTAL HARMONISASI KEMENKUMHAM SULBAR
            </span>
            <span className="text-xs text-slate-400">| Sesuai UU No. 13 Tahun 2022</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Workspace Penyelarasan Konsepsi Hukum (Harmonisasi Kanwil Kemenkumham)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pemeriksaan draf legal drafting & naskah akademik oleh Kanwil Kemenkumham Sulawesi Barat sebelum dilanjutkan ke DPRD.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isKemenkumhamRole && selectedItem && (
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Draf Perbaikan / Surat BA</span>
            </button>
          )}

          {!isKemenkumhamRole && (
            <div className="bg-amber-950/40 border border-amber-800/80 rounded-xl p-3 text-xs text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                Role Anda saat ini view-only. Beralih ke <strong>Kanwil Kemenkumham</strong> untuk aksi.
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Inbox / Completed Tabs */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          {/* Sub Navigation */}
          <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => {
                setInboxTab('INBOX');
                if (inboxList.length > 0) setSelectedItem(inboxList[0]);
              }}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                inboxTab === 'INBOX'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Inbox Pengajuan ({inboxList.length})</span>
            </button>

            <button
              onClick={() => {
                setInboxTab('COMPLETED');
                if (completedList.length > 0) setSelectedItem(completedList[0]);
              }}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                inboxTab === 'COMPLETED'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Riwayat Selesai ({completedList.length})</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {activeList.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              const isDone =
                item.statusCode === 'HARMONIZED' ||
                item.statusCode === 'PANSUS_DISCUSSION' ||
                item.statusCode === 'ENACTED_JDIH';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-amber-950/30 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {item.nomorRanperda}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        isDone
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {isDone ? 'Harmonisasi Selesai' : 'Pending Harmonisasi'}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-white line-clamp-2">
                    {item.judulRanperda}
                  </h4>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
                    <span className="truncate">{item.inisiatorName}</span>
                    <span className="text-[10px] text-slate-500">{item.tanggalPengajuan}</span>
                  </div>
                </div>
              );
            })}

            {activeList.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                Tidak ada pengajuan Ranperda di kategori ini.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Split Screen Workspace */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6">
          {selectedItem ? (
            <>
              {/* Workspace Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {selectedItem.nomorRanperda}
                    </span>
                    <span className="text-xs text-slate-400">Inisiator: {selectedItem.inisiatorName}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {selectedItem.judulRanperda}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-full font-bold">
                    {selectedItem.statusCode}
                  </span>
                </div>
              </div>

              {isSuccessMessage && (
                <div className="bg-emerald-950/90 border border-emerald-600 text-emerald-300 p-3.5 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>{isSuccessMessage}</span>
                </div>
              )}

              {/* Split Screen Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Panel 1: Reader & Downloads */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>Draf & Naskah Akademik</span>
                    </span>
                    <span className="text-[10px] text-slate-400">PDF / DOCX Reader</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 h-60 overflow-y-auto space-y-3 leading-relaxed">
                    <p className="font-bold text-center text-white">
                      PERATURAN DAERAH PROVINSI SULAWESI BARAT<br />
                      NOMOR ... TAHUN 2026
                    </p>
                    <p className="font-semibold text-center text-emerald-400">
                      TENTANG<br />
                      {selectedItem.judulRanperda.toUpperCase()}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      <strong>Naskah Akademik:</strong> {selectedItem.naskahAkademikTitle || 'Terlampir'}<br />
                      <strong>Menimbang:</strong> a. Bahwa untuk kepastian hukum...
                    </p>
                    <p className="text-[11px] text-slate-300">
                      <strong>Pasal 1:</strong> Ketentuan Umum Pemerintahan Daerah Provinsi Sulawesi Barat.
                    </p>
                  </div>

                  {/* Document Version Attachments with Download */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                      <span>Dokumen Terkait ({selectedItem.documents.length}):</span>
                      {isKemenkumhamRole && (
                        <button
                          onClick={() => setIsUploadOpen(true)}
                          className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Unggah Versi Baru</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {selectedItem.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs flex items-center justify-between text-slate-200 hover:border-slate-700 transition"
                        >
                          <div className="truncate pr-2">
                            <span className="font-bold text-emerald-400 font-mono">
                              {doc.versionName}:
                            </span>{' '}
                            {doc.fileName}
                          </div>
                          <button
                            onClick={() =>
                              alert(`Mengunduh berkas ${doc.fileName} (${doc.fileSize})...`)
                            }
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-[10px] font-bold flex items-center gap-1 flex-shrink-0 border border-slate-700"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Panel 2: Legal Drafting Form & Decision Controls */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-amber-400" />
                      <span>Input Berita Acara & Catatan Review</span>
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Nomor Surat / Berita Acara Harmonisasi Selesai
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: W.33.HN.01.02-142 TAHUN 2026"
                        value={nomorBAHarmonisasi}
                        onChange={(e) => setNomorBAHarmonisasi(e.target.value)}
                        disabled={!isKemenkumhamRole}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Catatan Legal Drafting & Hasil Penyelarasan
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Masukkan rincian pasal perbaikan atau catatan berita acara harmonisasi..."
                        value={catatanLegalDrafting}
                        onChange={(e) => setCatatanLegalDrafting(e.target.value)}
                        disabled={!isKemenkumhamRole}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    {isKemenkumhamRole && (
                      <div className="pt-2 border-t border-slate-800 space-y-2">
                        <button
                          type="button"
                          onClick={handleApproveHarmonisasi}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow"
                        >
                          <FileCheck2 className="w-4 h-4" />
                          <span>Status: Harmonisasi Selesai (Terbitkan BA)</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleReturnForRevision}
                          className="w-full bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold py-2 rounded-xl transition flex items-center justify-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4 text-rose-400" />
                          <span>Status: Butuh Perbaikan (Kembalikan ke OPD)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
              Pilih Ranperda dari daftar di sebelah kiri untuk membuka Workspace Harmonisasi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
