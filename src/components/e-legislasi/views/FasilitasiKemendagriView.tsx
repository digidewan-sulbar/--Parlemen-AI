import React, { useState } from 'react';
import { RanperdaDetail, RoleCode, DocumentVersion } from '../types';
import { DocumentUploadModal } from '../components/DocumentUploadModal';
import {
  Building2,
  FileCheck,
  Send,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  Award,
  Lock,
  Download,
  Upload,
  Globe,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  ranperdaList: RanperdaDetail[];
  currentRole: RoleCode;
  onUpdateRanperdaStatus: (id: string, newStatus: any, note: string) => void;
  onAddDocumentToRanperda?: (ranperdaId: string, doc: DocumentVersion) => void;
}

export const FasilitasiKemendagriView: React.FC<Props> = ({
  ranperdaList,
  currentRole,
  onUpdateRanperdaStatus,
  onAddDocumentToRanperda,
}) => {
  const fasilitasiList = ranperdaList.filter(
    (r) =>
      r.statusCode === 'JOINT_APPROVAL' ||
      r.statusCode === 'FASILITASI_KEMENDAGRI' ||
      r.statusCode === 'NOREG_ISSUED' ||
      r.statusCode === 'ENACTED_JDIH'
  );

  const [selectedRanperda, setSelectedRanperda] = useState<RanperdaDetail | null>(
    fasilitasiList[0] || ranperdaList[0] || null
  );

  const [catatanKemendagri, setCatatanKemendagri] = useState(
    selectedRanperda?.catatanFasilitasiKemendagri || ''
  );
  const [noregInput, setNoregInput] = useState(
    selectedRanperda?.nomorRegisterPerda || ''
  );

  const [isNoregSuccess, setIsNoregSuccess] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const isKemendagriRole = currentRole === 'ROLE_KEMENDAGRI';
  const isBiroHukumRole = currentRole === 'ROLE_BIRO_HUKUM';
  const isAuthorized = isKemendagriRole || isBiroHukumRole || currentRole === 'ROLE_SETWAN';

  const handleGenerateNoreg = () => {
    if (!selectedRanperda) return;

    const generatedNoreg =
      noregInput ||
      `NOREG ${Math.floor(Math.random() * 80 + 10)}-${Math.floor(
        Math.random() * 800 + 100
      )}/SULBAR/2026`;

    setNoregInput(generatedNoreg);

    onUpdateRanperdaStatus(
      selectedRanperda.id,
      'NOREG_ISSUED',
      `Nomor Register Perda Diterbitkan Ditjen Otda Kemendagri RI: ${generatedNoreg}. Catatan Fasilitasi: ${
        catatanKemendagri || 'Sesuai dengan ketentuan perundang-undangan nasional.'
      }`
    );

    setIsNoregSuccess(`Nomor Register Perda (${generatedNoreg}) Berhasil Diterbitkan & Dicatat!`);
    setTimeout(() => setIsNoregSuccess(null), 4000);
  };

  const handleUploadSuccess = (newDoc: DocumentVersion) => {
    if (selectedRanperda && onAddDocumentToRanperda) {
      onAddDocumentToRanperda(selectedRanperda.id, newDoc);
    }
    setIsNoregSuccess(`Surat Hasil Fasilitasi/Evaluasi ${newDoc.fileName} berhasil diunggah!`);
    setTimeout(() => setIsNoregSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Upload Modal */}
      {selectedRanperda && (
        <DocumentUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          ranperdaTitle={selectedRanperda.judulRanperda}
          currentRole={currentRole}
          existingDocuments={selectedRanperda.documents}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
              PORTAL KEMENDAGRI (DITJEN OTDA) & BIRO HUKUM
            </span>
            <span className="text-xs text-slate-400">| Fasilitasi, Evaluasi & Penerbitan Noreg</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Workspace Fasilitasi Kemendagri & Penerbitan Nomor Register (Noreg) Perda
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Peninjauan draf hasil Persetujuan Bersama Paripurna DPRD & Gubernur oleh Ditjen Otda Kemendagri untuk penerbitan Noreg Perda.
          </p>
        </div>

        {selectedRanperda && isAuthorized && (
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1.5 flex-shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Surat Hasil Fasilitasi</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Ranperda Siap Fasilitasi ({fasilitasiList.length})
          </h3>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {fasilitasiList.map((item) => {
              const isSelected = selectedRanperda?.id === item.id;
              const hasNoreg = item.statusCode === 'NOREG_ISSUED' || item.statusCode === 'ENACTED_JDIH';

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedRanperda(item);
                    setCatatanKemendagri(item.catatanFasilitasiKemendagri || '');
                    setNoregInput(item.nomorRegisterPerda || '');
                  }}
                  className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-cyan-950/30 border-cyan-500 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {item.nomorRanperda}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        hasNoreg
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      }`}
                    >
                      {hasNoreg ? 'Noreg Terbit' : 'Proses Fasilitasi'}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-white line-clamp-2">
                    {item.judulRanperda}
                  </h4>

                  <div className="text-[10px] text-slate-400 border-t border-slate-800/60 pt-1 flex items-center justify-between">
                    <span>Inisiator: {item.inisiatorName}</span>
                    <span className="text-slate-500">{item.tanggalPersetujuanBersama || item.tanggalPengajuan}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail & Generator */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          {selectedRanperda ? (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {selectedRanperda.nomorRanperda}
                    </span>
                    <span className="text-xs text-slate-400">Persetujuan Paripurna: {selectedRanperda.tanggalPersetujuanBersama || 'Selesai'}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {selectedRanperda.judulRanperda}
                  </h3>
                </div>

                <div className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800">
                  {selectedRanperda.statusCode}
                </div>
              </div>

              {isNoregSuccess && (
                <div className="bg-emerald-950/90 border border-emerald-600 text-emerald-300 p-4 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>{isNoregSuccess}</span>
                </div>
              )}

              {/* Documents & Download Section for Kemendagri Reviewer */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="font-bold text-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Draf Hasil Persetujuan Bersama Paripurna (v3.0_Persetujuan_Bersama_Final)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Siap Evaluasi Ditjen Otda</span>
                </div>

                <div className="space-y-2">
                  {selectedRanperda.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs flex items-center justify-between text-slate-200"
                    >
                      <div className="truncate pr-2">
                        <span className="font-bold text-cyan-400 font-mono">
                          {doc.versionName}:
                        </span>{' '}
                        {doc.fileName} <span className="text-slate-500">({doc.fileSize})</span>
                      </div>
                      <button
                        onClick={() =>
                          alert(`Mengunduh berkas Draf Final ${doc.fileName}...`)
                        }
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-bold flex items-center gap-1.5 flex-shrink-0 border border-slate-700"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh Draf Final</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Form */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
                <h4 className="font-bold text-cyan-300 flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>1. Catatan Evaluasi & Hasil Fasilitasi Ditjen Otda Kemendagri</span>
                </h4>

                <textarea
                  rows={3}
                  placeholder="Masukkan catatan hasil review/fasilitasi Kemendagri Ditjen Otda..."
                  value={catatanKemendagri}
                  onChange={(e) => setCatatanKemendagri(e.target.value)}
                  disabled={!isAuthorized}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none"
                />

                {/* Generator Section */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>2. Penerbitan Nomor Register (Noreg) Perda</span>
                  </h4>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Nomor Register (Noreg) Perda Resmi Ditjen Otda
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Contoh: NOREG 04-12/SULBAR/2026"
                        value={noregInput}
                        onChange={(e) => setNoregInput(e.target.value)}
                        disabled={!isAuthorized}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setNoregInput(
                            `NOREG ${Math.floor(Math.random() * 80 + 10)}-${Math.floor(
                              Math.random() * 800 + 100
                            )}/SULBAR/2026`
                          )
                        }
                        disabled={!isAuthorized}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-2 rounded-xl text-xs flex-shrink-0"
                      >
                        Auto-Generate
                      </button>
                    </div>
                  </div>

                  {isAuthorized && (
                    <button
                      type="button"
                      onClick={handleGenerateNoreg}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Terbitkan Noreg Perda & Kirim WA Alert ke Biro Hukum Sulbar</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
              Pilih Ranperda dari daftar di sebelah kiri untuk mengulas Fasilitasi Kemendagri.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
