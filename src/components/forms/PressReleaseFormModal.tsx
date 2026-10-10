import React, { useState, useEffect } from 'react';
import { PressReleaseItem } from '../../types';
import { X, Megaphone, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PressReleaseItem) => void;
  initialData?: PressReleaseItem | null;
}

export const PressReleaseFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [judulBerita, setJudulBerita] = useState('');
  const [tanggalRilis, setTanggalRilis] = useState('30 Juli 2026');
  const [kategori, setKategori] = useState('Legislasi & Pengawasan');
  const [kontenBerita, setKontenBerita] = useState('');
  const [status, setStatus] = useState<'Draf AI' | 'Diverifikasi Kabag' | 'Dipublikasikan'>('Draf AI');

  useEffect(() => {
    if (initialData) {
      setJudulBerita(initialData.judulBerita);
      setTanggalRilis(initialData.tanggalRilis);
      setKategori(initialData.kategori);
      setKontenBerita(initialData.kontenBerita);
      setStatus(initialData.status);
    } else {
      setJudulBerita('');
      setTanggalRilis('30 Juli 2026');
      setKategori('Legislasi & Pengawasan');
      setKontenBerita('');
      setStatus('Draf AI');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulBerita.trim() || !kontenBerita.trim()) {
      alert('Judul Berita dan Konten Siaran Pers wajib diisi.');
      return;
    }

    const wordCount = kontenBerita.trim().split(/\s+/).filter(Boolean).length;

    const item: PressReleaseItem = {
      id: initialData ? initialData.id : `PRS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      judulBerita,
      tanggalRilis,
      kategori,
      jumlahKata: wordCount,
      kontenBerita,
      status,
    };

    onSave(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                {initialData ? 'Edit Rilis Berita Humas' : 'Tambah Rilis Berita Humas Baru'}
              </h3>
              <p className="text-xs text-slate-400">
                Format Berita Jurnalistik 5W+1H (Standar SLA 300-400 Kata)
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
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Judul Berita Siaran Pers
            </label>
            <input
              type="text"
              value={judulBerita}
              onChange={(e) => setJudulBerita(e.target.value)}
              placeholder="Contoh: DPRD Sulbar Sahkan Ranperda Ketersediaan Pangan Daerah"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tanggal Rilis Berita
              </label>
              <input
                type="text"
                value={tanggalRilis}
                onChange={(e) => setTanggalRilis(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kategori Berita
              </label>
              <input
                type="text"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                placeholder="Legislasi / Humas / RDP"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status Verifikasi Berita
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-semibold"
              >
                <option value="Draf AI">Draf AI (Konsep)</option>
                <option value="Diverifikasi Kabag">Diverifikasi Kabag (Approved)</option>
                <option value="Dipublikasikan">Dipublikasikan (Published)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Isi Teks Berita Jurnalistik (Gaya 5W+1H)
            </label>
            <textarea
              rows={8}
              value={kontenBerita}
              onChange={(e) => setKontenBerita(e.target.value)}
              placeholder="Mamuju, (30/07/2026) - Sekretariat DPRD Provinsi Sulawesi Barat merilis..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed font-mono"
              required
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Jumlah Kata Terhitung:{' '}
              <strong className="text-purple-300">
                {kontenBerita.trim().split(/\s+/).filter(Boolean).length} Kata
              </strong>
            </span>
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
              className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-500 hover:bg-purple-400 text-slate-950 transition shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Rilis Berita</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
