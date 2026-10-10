import React, { useState } from 'react';
import { RdpRekomendasiExtended, EvidenceFile } from './rdpTypes';
import { HtmlDisplay } from './rdpWaUtils';
import {
  ShieldCheck,
  Building2,
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  Lock,
  Smartphone,
  AlertCircle,
  FileCheck2,
  Key,
} from 'lucide-react';

interface Props {
  recommendation: RdpRekomendasiExtended;
  onUpdateRecommendation: (updated: RdpRekomendasiExtended) => void;
  onBackToDashboard?: () => void;
}

export const RdpOpdEvidencePortalView: React.FC<Props> = ({
  recommendation,
  onUpdateRecommendation,
  onBackToDashboard,
}) => {
  const [kronologiText, setKronologiText] = useState(recommendation.kronologiEksekusi || '');
  const [uploadedFiles, setUploadedFiles] = useState<EvidenceFile[]>(recommendation.evidenceFiles || []);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // File Upload Simulation
  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsSimulatingUpload(true);

    const file = e.target.files[0];
    setTimeout(() => {
      const newFile: EvidenceFile = {
        id: `EV-${Date.now()}`,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.png') ? 'png' : 'jpg',
        fileUrl: URL.createObjectURL(file),
        uploadedAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }),
      };
      setUploadedFiles((prev) => [...prev, newFile]);
      setIsSimulatingUpload(false);
    }, 1200);
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kronologiText.trim()) {
      alert('Mohon isi uraian kronologi eksekusi tindak lanjut.');
      return;
    }
    if (uploadedFiles.length === 0) {
      alert('Mohon unggah minimal 1 berkas bukti tindak lanjut (PDF / Foto).');
      return;
    }

    const updated: RdpRekomendasiExtended = {
      ...recommendation,
      kronologiEksekusi: kronologiText,
      evidenceFiles: uploadedFiles,
      status: 'BUTUH_VERIFIKASI',
      statusLogs: [
        ...(recommendation.statusLogs || []),
        {
          id: `LOG-${Date.now()}`,
          statusAwal: recommendation.status,
          statusBaru: 'BUTUH_VERIFIKASI',
          timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }),
          actor: `${recommendation.opdPenanggungJawab} (${recommendation.opdPejabatNama})`,
          keterangan: 'OPD mengunggah berkas bukti tindak lanjut & mengajukan verifikasi ke Komisi DPRD.',
        },
      ],
    };

    onUpdateRecommendation(updated);
    setIsSubmitSuccess(true);
    setTimeout(() => setIsSubmitSuccess(false), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Simulation Header Banner for Mobile Magic Link Access */}
      <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-emerald-400" /> Pintu Akses OPD
            </span>
            <span className="text-slate-500 text-xs font-mono">Kode Akses: {recommendation.magicLinkToken}</span>
          </div>

          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="text-xs text-slate-400 hover:text-white transition underline"
            >
              Kembali ke Dasbor Utama
            </button>
          )}
        </div>

        <div className="space-y-2">
          <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
            {recommendation.nomorRdp}
          </span>
          <h2 className="text-lg font-black text-slate-100 leading-snug">
            {recommendation.judulRdp}
          </h2>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs space-y-1 mt-3">
            <div className="flex justify-between text-slate-300">
              <span className="font-semibold text-emerald-400">{recommendation.opdPenanggungJawab}</span>
              <span className="text-slate-400">{recommendation.opdPejabatNama}</span>
            </div>
            <div className="text-slate-300">
              <strong className="text-amber-400 block mb-0.5">Instruksi Komisi {recommendation.komisi}:</strong>
              <HtmlDisplay htmlStr={recommendation.perintahTindakLanjut} />
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {isSubmitSuccess && (
        <div className="bg-emerald-950/90 border border-emerald-500/80 rounded-2xl p-4 flex items-center gap-3 text-emerald-300 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-black">Laporan Berhasil Terkirim ke Komisi DPRD!</p>
            <p className="font-normal text-emerald-400/90">
              Status rekomendasi telah berubah menjadi <strong>BUTUH VERIFIKASI</strong>. Komisi DPRD akan meninjau berkas bukti Anda.
            </p>
          </div>
        </div>
      )}

      {/* Rejection / Revision Note Banner */}
      {recommendation.status === 'DIKEMBALIKAN' && recommendation.catatanKomisiRevisi && (
        <div className="bg-rose-950/90 border border-rose-600/80 rounded-2xl p-4 space-y-1 text-rose-200 text-xs animate-fadeIn">
          <div className="flex items-center gap-2 font-black text-rose-300">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span>PERATAN REVISI DARI KOMISI {recommendation.komisi.toUpperCase()}</span>
          </div>
          <p className="bg-rose-900/50 p-2.5 rounded-xl border border-rose-800 italic">
            "{recommendation.catatanKomisiRevisi}"
          </p>
        </div>
      )}

      {/* Form Submission Box */}
      <form onSubmit={handleSubmitReport} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <span>Unggah Bukti Fisik & Laporan Tindak Lanjut</span>
          </h3>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
            Tenggat Waktu: {recommendation.deadlineDate}
          </span>
        </div>

        {/* Kronologi Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-200">
            Uraian & Kronologi Eksekusi Tindak Lanjut *
          </label>
          <p className="text-[11px] text-slate-400">
            Jelaskan langkah-langkah konkret, rapat koordinasi, atau tindakan lapangan yang telah diselesaikan oleh OPD Anda.
          </p>
          <textarea
            rows={4}
            required
            value={kronologiText}
            onChange={(e) => setKronologiText(e.target.value)}
            placeholder="Contoh: Kami telah menggelar rapat koordinasi teknis bersama jajaran dan telah menyelesaikan serah terima berkas fisik..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-medium leading-relaxed"
          />
        </div>

        {/* File Uploader */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-200">
            Berkas Bukti / Dokumen Pendukung Fisik *
          </label>
          <p className="text-[11px] text-slate-400">
            Unggah SK, Surat BAST, Foto Dokumentasi, atau Laporan Hasil Kerja (PDF, JPG, PNG).
          </p>

          <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/60 bg-slate-900/60 rounded-2xl p-6 text-center transition group relative">
            <input
              type="file"
              onChange={handleSimulateFileUpload}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="space-y-2 flex flex-col items-center justify-center">
              <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-emerald-400 transition" />
              <div>
                <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">
                  {isSimulatingUpload ? 'Mengunggah Berkas...' : 'Klik atau Tarik Berkas Ke Sini'}
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Maksimal 10 MB per berkas</span>
              </div>
            </div>
          </div>

          {/* List of Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-slate-400 block">Berkas Terunggah ({uploadedFiles.length}):</span>
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold text-slate-200 block truncate">{file.fileName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{file.fileSize} • {file.uploadedAt}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file.id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 transition"
                    title="Hapus Berkas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Action */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 italic">
            *Laporan akan dikirim ke Komisi {recommendation.komisi} untuk verifikasi.
          </span>

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xl transition flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Kirim Laporan Tindak Lanjut</span>
          </button>
        </div>
      </form>
    </div>
  );
};
