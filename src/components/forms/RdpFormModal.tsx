import React, { useState, useEffect } from 'react';
import { RdpRecommendationItem, StatusRekomendasi } from '../../types';
import { RichTextEditor } from './RichTextEditor';
import { X, FileCheck, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: RdpRecommendationItem) => void;
  initialData?: RdpRecommendationItem | null;
}

export const RdpFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [nomorRdp, setNomorRdp] = useState('');
  const [judulRdp, setJudulRdp] = useState('');
  const [komisi, setKomisi] = useState<'Komisi I' | 'Komisi II' | 'Komisi III' | 'Komisi IV'>('Komisi I');
  const [opdPenanggungJawab, setOpdPenanggungJawab] = useState('');
  const [poinCatatan, setPoinCatatan] = useState('');
  const [perintahTindakLanjut, setPerintahTindakLanjut] = useState('');
  const [status, setStatus] = useState<StatusRekomendasi>('Dalam Proses');
  const [tenggatWaktu, setTenggatWaktu] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  useEffect(() => {
    if (initialData) {
      setNomorRdp(initialData.nomorRdp);
      setJudulRdp(initialData.judulRdp);
      setKomisi(initialData.komisi);
      setOpdPenanggungJawab(initialData.opdPenanggungJawab);
      setPoinCatatan(initialData.poinCatatan);
      setPerintahTindakLanjut(initialData.perintahTindakLanjut);
      setStatus(initialData.status);
      setTenggatWaktu(initialData.tenggatWaktu);
    } else {
      setNomorRdp(`REC-RDP/2026/${Math.floor(100 + Math.random() * 900)}`);
      setJudulRdp('');
      setKomisi('Komisi I');
      setOpdPenanggungJawab('Dinas Pekerjaan Umum & Penataan Ruang Sulbar');
      setPoinCatatan('');
      setPerintahTindakLanjut('');
      setStatus('Dalam Proses');
      setTenggatWaktu(
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      );
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulRdp.trim() || !opdPenanggungJawab.trim()) {
      alert('Judul Rekomendasi RDP dan OPD Penanggung Jawab wajib diisi.');
      return;
    }

    const item: RdpRecommendationItem = {
      id: initialData ? initialData.id : `RDP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      nomorRdp,
      judulRdp,
      komisi,
      opdPenanggungJawab,
      poinCatatan,
      perintahTindakLanjut,
      status,
      tenggatWaktu,
      buktiTindakLanjut: initialData?.buktiTindakLanjut,
    };

    onSave(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                {initialData ? 'Edit Rekomendasi RDP' : 'Tambah Rekomendasi RDP Baru'}
              </h3>
              <p className="text-xs text-slate-400">
                Formulir Pengawasan Tindak Lanjut OPD Pemprov Sulawesi Barat
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nomor Register Rekomendasi RDP
              </label>
              <input
                type="text"
                value={nomorRdp}
                onChange={(e) => setNomorRdp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Komisi Dewan Pengawas
              </label>
              <select
                value={komisi}
                onChange={(e: any) => setKomisi(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Komisi I">Komisi I (Pemerintahan, Hukum, HAM)</option>
                <option value="Komisi II">Komisi II (Ekonomi, Keuangan, Aset)</option>
                <option value="Komisi III">Komisi III (Pembangunan, Infrastruktur)</option>
                <option value="Komisi IV">Komisi IV (Kesejahteraan Rakyat, Pendidikan)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Judul Rekomendasi Hasil RDP
            </label>
            <input
              type="text"
              value={judulRdp}
              onChange={(e) => setJudulRdp(e.target.value)}
              placeholder="Contoh: Percepatan Perbaikan Jalan Poros Mamuju - Mamasa"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                OPD / Dinas Penanggung Jawab
              </label>
              <input
                type="text"
                value={opdPenanggungJawab}
                onChange={(e) => setOpdPenanggungJawab(e.target.value)}
                placeholder="Dinas PUPR / Dinas Kesehatan / Dinas Pendidikan"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tenggat Waktu SLA OPD
              </label>
              <input
                type="date"
                value={tenggatWaktu}
                onChange={(e) => setTenggatWaktu(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Status Progres Rekomendasi
            </label>
            <select
              value={status}
              onChange={(e: any) => setStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
            >
              <option value="Belum Diproses">Belum Diproses (Pending)</option>
              <option value="Dalam Proses">Dalam Proses (On Going)</option>
              <option value="Perlu Diverifikasi">Perlu Diverifikasi (Verifikasi Admin)</option>
              <option value="Selesai">Selesai (Completed & Verified)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-200">
              Poin Catatan Temuan Lapangan
            </label>
            <p className="text-[11px] text-slate-400">
              Catatan masalah, aduan masyarakat, atau temuan komisi dengan format MS Word (Tebal, Miring, Bullet, Paragraf).
            </p>
            <RichTextEditor
              value={poinCatatan}
              onChange={(val) => setPoinCatatan(val)}
              placeholder="Catatan masalah, aduan masyarakat, atau temuan komisi..."
              minHeight="140px"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-200">
              Instruksi / Perintah & Rekomendasi Tindak Lanjut Komisi
            </label>
            <p className="text-[11px] text-slate-400">
              Instruksi spesifik yang wajib dilaksanakan OPD Pemprov Sulbar (Gunakan format Judul, Tebal, Penomoran, Rata Kiri/Tengah/Kanan).
            </p>
            <RichTextEditor
              value={perintahTindakLanjut}
              onChange={(val) => setPerintahTindakLanjut(val)}
              placeholder="Instruksi spesifik yang harus dilaksanakan OPD Pemprov Sulbar..."
              minHeight="180px"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Rekomendasi RDP</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
