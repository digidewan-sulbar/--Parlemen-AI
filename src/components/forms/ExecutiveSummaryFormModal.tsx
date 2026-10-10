import React, { useState, useEffect } from 'react';
import { ExecutiveSummaryItem } from '../../types';
import { X, Sparkles, Save, UserCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExecutiveSummaryItem) => void;
  initialData?: ExecutiveSummaryItem | null;
}

export const ExecutiveSummaryFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [judulDokumen, setJudulDokumen] = useState('');
  const [tanggalRapat, setTanggalRapat] = useState('30 Juli 2026');
  const [paragraf1, setParagraf1] = useState('');
  const [paragraf2, setParagraf2] = useState('');
  const [paragraf3, setParagraf3] = useState('');

  useEffect(() => {
    if (initialData) {
      setJudulDokumen(initialData.judulDokumen);
      setTanggalRapat(initialData.tanggalRapat);
      setParagraf1(initialData.paragraf1HighlightKeputusan);
      setParagraf2(initialData.paragraf2IsuKrusial);
      setParagraf3(initialData.paragraf3RekomendasiLangkahPimpinan);
    } else {
      setJudulDokumen('');
      setTanggalRapat('30 Juli 2026');
      setParagraf1('');
      setParagraf2('');
      setParagraf3('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulDokumen.trim()) {
      alert('Judul Dokumen Executive Summary wajib diisi.');
      return;
    }

    const item: ExecutiveSummaryItem = {
      id: initialData ? initialData.id : `EXC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      judulDokumen,
      tanggalRapat,
      paragraf1HighlightKeputusan: paragraf1,
      paragraf2IsuKrusial: paragraf2,
      paragraf3RekomendasiLangkahPimpinan: paragraf3,
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
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                {initialData ? 'Edit Executive Summary' : 'Tambah Executive Summary Pimpinan'}
              </h3>
              <p className="text-xs text-slate-400">
                Bahan Pengambilan Keputusan Pimpinan DPRD (Format 3 Paragraf Standar PIM III)
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Judul Dokumen Executive Summary
              </label>
              <input
                type="text"
                value={judulDokumen}
                onChange={(e) => setJudulDokumen(e.target.value)}
                placeholder="Contoh: Executive Summary Rapat Paripurna LKPJ TA 2025"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tanggal Pelaksanaan Rapat
              </label>
              <input
                type="text"
                value={tanggalRapat}
                onChange={(e) => setTanggalRapat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-blue-400 mb-1 flex items-center gap-1.5">
              <span>Paragraf 1: Highlight Keputusan Utama</span>
            </label>
            <textarea
              rows={3}
              value={paragraf1}
              onChange={(e) => setParagraf1(e.target.value)}
              placeholder="Rincian hasil keputusan rapat, kesepakatan komisi, atau persetujuan kuorum dewan..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <span>Paragraf 2: Isu Krusial & Perdebatan</span>
            </label>
            <textarea
              rows={3}
              value={paragraf2}
              onChange={(e) => setParagraf2(e.target.value)}
              placeholder="Sanggahan fraksi, dinamika anggaran, tantangan realisasi OPD Pemprov Sulbar..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
              <span>Paragraf 3: Rekomendasi Langkah Strategis Pimpinan</span>
            </label>
            <textarea
              rows={3}
              value={paragraf3}
              onChange={(e) => setParagraf3(e.target.value)}
              placeholder="Langkah tindak lanjut Ketua/Wakil Ketua DPRD, arahan disposisi, atau koordinasi Pemprov..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
              required
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
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-500 hover:bg-blue-400 text-slate-950 transition shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Executive Summary</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
