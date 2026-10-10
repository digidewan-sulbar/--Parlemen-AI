import React, { useState } from 'react';
import { DocumentVersion, DocumentCategory, RoleCode } from '../types';
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  File,
  Sparkles,
  History,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ranperdaTitle: string;
  currentRole: RoleCode;
  existingDocuments: DocumentVersion[];
  onUploadSuccess: (newDoc: DocumentVersion) => void;
}

export const DocumentUploadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  ranperdaTitle,
  currentRole,
  existingDocuments,
  onUploadSuccess,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocumentCategory>('DRAF_RANPERDA');
  const [versionTag, setVersionTag] = useState<string>('v1.1_Hasil_Harmonisasi_Kemenkumham');
  const [keterangan, setKeterangan] = useState('');
  const [uploadedByName, setUploadedByName] = useState('PIC Verifikator');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx' && ext !== 'doc') {
      setErrorMsg('Format file tidak valid! Harap unggah berkas bertipe .pdf atau .docx');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Silakan pilih atau seret berkas terlebih dahulu.');
      return;
    }

    const fileSizeMb = (selectedFile.size / (1024 * 1024)).toFixed(1);

    const newDoc: DocumentVersion = {
      id: `DOC-${Date.now()}`,
      versionName: versionTag,
      category: category,
      fileName: selectedFile.name,
      fileSize: `${fileSizeMb} MB`,
      uploadedBy: uploadedByName || 'Verifikator System',
      uploadedRole: currentRole,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      keterangan: keterangan || 'Unggahan dokumen revisi/hasil harmonisasi resmi.',
    };

    onUploadSuccess(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm md:text-base text-white">
                Unggah Dokumen & Versioning System
              </h3>
              <p className="text-[11px] text-slate-400 truncate max-w-xs md:max-w-md">
                {ranperdaTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="bg-red-950/80 border border-red-700 text-red-300 p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Category & Version Auto Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Kategori Berkas
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="DRAF_RANPERDA">Draf Ranperda</option>
                <option value="NASKAH_AKADEMIK">Naskah Akademik (NA)</option>
                <option value="MATRIKS_SANDINGAN">Matriks Sandingan / DIM</option>
                <option value="SURAT_BA_SELESAI">Surat / Berita Acara Harmonisasi & Fasilitasi</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Penanda Versi (Auto-Versioning)
              </label>
              <select
                value={versionTag}
                onChange={(e) => setVersionTag(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
              >
                <option value="v1.0_Draft_Awal">v1.0_Draft_Awal (OPD / Pemrakarsa)</option>
                <option value="v1.1_Hasil_Harmonisasi_Kemenkumham">
                  v1.1_Hasil_Harmonisasi_Kemenkumham
                </option>
                <option value="v2.0_Hasil_Pansus_DPRD">v2.0_Hasil_Pansus_DPRD</option>
                <option value="v3.0_Persetujuan_Bersama_Final">
                  v3.0_Persetujuan_Bersama_Final (Siap Kemendagri)
                </option>
                <option value="v4.0_Perda_Lembaran_Daerah">
                  v4.0_Perda_Lembaran_Daerah (JDIH Final)
                </option>
              </select>
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              File Berkas (.pdf atau .docx)
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 ${
                dragActive
                  ? 'border-emerald-400 bg-emerald-950/20'
                  : selectedFile
                  ? 'border-emerald-500/80 bg-slate-950/90'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
              }`}
            >
              <input
                type="file"
                id="file-upload-input"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{selectedFile.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Ukuran Berkas: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <label
                    htmlFor="file-upload-input"
                    className="text-[11px] text-emerald-400 hover:underline cursor-pointer inline-block mt-1 font-semibold"
                  >
                    Ganti Berkas
                  </label>
                </div>
              ) : (
                <label htmlFor="file-upload-input" className="cursor-pointer space-y-1">
                  <UploadCloud className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="font-bold text-slate-200">
                    Tarik & Lepaskan berkas di sini, atau{' '}
                    <span className="text-emerald-400 underline">Cari Berkas</span>
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Mendukung format PDF dan Microsoft Word (.docx) hingga 25MB
                  </p>
                </label>
              )}
            </div>
          </div>

          {/* Pengunggah & Catatan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Nama Pengunggah / Petugas
              </label>
              <input
                type="text"
                value={uploadedByName}
                onChange={(e) => setUploadedByName(e.target.value)}
                placeholder="Nama Lengkap & Jabatan"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Catatan Perubahan / Log Revisi
              </label>
              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Rincian perbaikan bab/pasal..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Existing Document Version History */}
          {existingDocuments.length > 0 && (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <History className="w-3.5 h-3.5 text-emerald-400" />
                <span>Riwayat Dokumen Terseimpan ({existingDocuments.length}):</span>
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {existingDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-slate-950 border border-slate-800/80 p-2 rounded-xl flex items-center justify-between text-[11px]"
                  >
                    <div className="truncate pr-2">
                      <span className="font-bold text-emerald-400 font-mono">
                        {doc.versionName}
                      </span>{' '}
                      - <span className="text-slate-200">{doc.fileName}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">
                      {doc.uploadedAt} ({doc.uploadedRole})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl shadow-lg transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simpan & Simulasikan Versioning</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
