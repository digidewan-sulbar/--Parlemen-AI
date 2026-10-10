import React, { useState } from 'react';
import { RanperdaDetail, RoleCode } from '../types';
import { RichTextEditor } from '../../forms/RichTextEditor';
import {
  FilePlus,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Building2,
  Send,
  Sparkles,
} from 'lucide-react';

interface Props {
  currentRole: RoleCode;
  onSubmitRanperda: (data: Partial<RanperdaDetail>) => void;
}

export const PengajuanFormView: React.FC<Props> = ({ currentRole, onSubmitRanperda }) => {
  const [judulRanperda, setJudulRanperda] = useState('');
  const [inisiatorType, setInisiatorType] = useState<'DPRD' | 'EKSEKUTIF'>(
    currentRole === 'ROLE_DPRD' ? 'DPRD' : 'EKSEKUTIF'
  );
  const [inisiatorName, setInisiatorName] = useState('');
  const [komisiPengampu, setKomisiPengampu] = useState('Komisi I (Pemerintahan & Hukum)');
  const [deskripsiRingkas, setDeskripsiRingkas] = useState('');
  const [naskahAkademikTitle, setNaskahAkademikTitle] = useState('');

  // Simulated Files
  const [naFile, setNaFile] = useState<File | null>(null);
  const [drafFile, setDrafFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulRanperda.trim() || !inisiatorName.trim()) return;

    const newRanperda: Partial<RanperdaDetail> = {
      judulRanperda,
      tahun: 2026,
      inisiatorType,
      inisiatorName,
      komisiPengampu,
      opdPencegah: 'Biro Hukum Setda Sulbar',
      statusCode: 'DRAFT_PROPOSED',
      deskripsiRingkas,
      tanggalPengajuan: new Date().toISOString().split('T')[0],
      targetSlaDays: 30,
      sisaHariSla: 30,
      statusSla: 'Sesuai SLA',
      naskahAkademikTitle: naskahAkademikTitle || 'Naskah Akademik Terlampir',
      documents: [
        {
          id: `DOC-${Date.now()}-1`,
          versionName: 'V1.0 Draf Awal',
          fileName: drafFile ? drafFile.name : 'Draf_Awal_Ranperda_2026.pdf',
          fileSize: drafFile ? `${(drafFile.size / 1024 / 1024).toFixed(1)} MB` : '2.4 MB',
          uploadedBy: inisiatorName,
          uploadedRole: currentRole,
          uploadedAt: new Date().toLocaleString('id-ID'),
          keterangan: 'Draf Awal Ranperda terunggah saat pengajuan',
        },
        {
          id: `DOC-${Date.now()}-2`,
          versionName: 'V1.0 Naskah Akademik',
          fileName: naFile ? naFile.name : 'Naskah_Akademik_2026.pdf',
          fileSize: naFile ? `${(naFile.size / 1024 / 1024).toFixed(1)} MB` : '4.1 MB',
          uploadedBy: inisiatorName,
          uploadedRole: currentRole,
          uploadedAt: new Date().toLocaleString('id-ID'),
          keterangan: 'Naskah Akademik resmi terlampir',
        },
      ],
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toLocaleString('id-ID'),
          userName: inisiatorName,
          userRole: currentRole,
          actionName: 'Pengajuan Inisiatif Ranperda',
          details: 'Mengirimkan berkas Ranperda Baru ke Portal E-Legislasi Sulbar',
        },
      ],
      notificationLogs: [
        {
          id: `NOTIF-${Date.now()}`,
          timestamp: new Date().toLocaleString('id-ID'),
          recipient: 'Sekretariat DPRD & Kanwil Kemenkumham Sulbar',
          channel: 'WhatsApp',
          message: `[E-LEGISLASI] Pengajuan Ranperda Baru: "${judulRanperda}" telah diterima. Menunggu proses Harmonisasi Kemenkumham.`,
          status: 'Terkirim',
        },
      ],
    };

    onSubmitRanperda(newRanperda);
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
            <FilePlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Formulir Pengajuan Ranperda Inisiatif
            </h2>
            <p className="text-xs text-slate-400">
              Pengajuan Ranperda Inisiatif DPRD maupun Inisiatif Eksekutif (Pemprov Sulbar) dilengkapi Naskah Akademik.
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Ranperda Berhasil Diajukan!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Berkas Ranperda Anda telah tercatat dengan status <span className="text-emerald-400 font-bold">DRAFT_PROPOSED</span>.
              Notifikasi otomatis via WhatsApp telah dikirimkan ke Setwan & Kanwil Kemenkumham Sulbar untuk proses Harmonisasi.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setJudulRanperda('');
                setDeskripsiRingkas('');
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
            >
              Ajukan Ranperda Lainnya
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Section 1: Inisiator & Judul */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>1. Identitas Inisiator & Ranperda</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Jenis Inisiatif <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={inisiatorType}
                    onChange={(e) => setInisiatorType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="EKSEKUTIF">Eksekutif (Gubernur / Pemprov Sulbar)</option>
                    <option value="DPRD">DPRD (Komisi / Bapemperda)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Nama OPD / Komisi Pemrakarsa <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dinas Kesehatan Sulbar / Bapemperda"
                    value={inisiatorName}
                    onChange={(e) => setInisiatorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Judul Lengkap Ranperda <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ranperda Penyelenggaraan Pelayanan Kesehatan Masyarakat Kategori Khusus..."
                  value={judulRanperda}
                  onChange={(e) => setJudulRanperda(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Komisi Pembahas di DPRD
                  </label>
                  <select
                    value={komisiPengampu}
                    onChange={(e) => setKomisiPengampu(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Komisi I (Pemerintahan & Hukum)">Komisi I (Pemerintahan & Hukum)</option>
                    <option value="Komisi II (Perekonomian & Keuangan)">Komisi II (Perekonomian & Keuangan)</option>
                    <option value="Komisi III (Pembangunan & Infrastruktur)">Komisi III (Pembangunan & Infrastruktur)</option>
                    <option value="Komisi IV (Kesejahteraan Rakyat)">Komisi IV (Kesejahteraan Rakyat)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Judul Naskah Akademik (NA)
                  </label>
                  <input
                    type="text"
                    placeholder="Judul NA dan Perguruan Tinggi / Lembaga Penyusun"
                    value={naskahAkademikTitle}
                    onChange={(e) => setNaskahAkademikTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <RichTextEditor
                  label="Ringkasan Pokok Pikiran / Maksud & Tujuan Ranperda"
                  value={deskripsiRingkas}
                  onChange={setDeskripsiRingkas}
                  placeholder="Ketik latar belakang urgensi penyusunan Ranperda, landasan filosofis, sosiologis, yuridis, serta pokok-pokok pikiran dan maksud & tujuan utama..."
                  minHeight="320px"
                />
              </div>
            </div>

            {/* Section 2: Upload Documents */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                <span>2. Upload Berkas Draf Ranperda & Naskah Akademik</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Dropzone Draf Ranperda */}
                <div className="bg-slate-950 border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 text-center transition space-y-2">
                  <FileText className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="font-bold text-white">Draf Awal Ranperda (.PDF / .DOCX)</div>
                  <div className="text-[11px] text-slate-400">
                    {drafFile ? drafFile.name : 'Drag & drop atau klik pilih berkas'}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => e.target.files?.[0] && setDrafFile(e.target.files[0])}
                    className="hidden"
                    id="draf-upload-input"
                  />
                  <label
                    htmlFor="draf-upload-input"
                    className="inline-block bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition"
                  >
                    Pilih File Draf
                  </label>
                </div>

                {/* Dropzone NA */}
                <div className="bg-slate-950 border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 text-center transition space-y-2">
                  <FileText className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="font-bold text-white">Naskah Akademik (.PDF / .DOCX)</div>
                  <div className="text-[11px] text-slate-400">
                    {naFile ? naFile.name : 'Drag & drop atau klik pilih berkas'}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => e.target.files?.[0] && setNaFile(e.target.files[0])}
                    className="hidden"
                    id="na-upload-input"
                  />
                  <label
                    htmlFor="na-upload-input"
                    className="inline-block bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-lg text-[11px] cursor-pointer transition"
                  >
                    Pilih File NA
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition flex items-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pengajuan & Trigger WhatsApp Notifikasi</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
