import React, { useState, useEffect } from 'react';
import { AgendaPimpinanItem } from '../../types';
import { X, Calendar, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AgendaPimpinanItem) => void;
  initialData?: AgendaPimpinanItem | null;
}

export const AgendaPimpinanFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [namaKegiatan, setNamaKegiatan] = useState('');
  const [tanggalWaktu, setTanggalWaktu] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [pimpinanBertugas, setPimpinanBertugas] = useState('');
  const [instansiTerkait, setInstansiTerkait] = useState('');
  const [disposisiCatatan, setDisposisiCatatan] = useState('');
  const [status, setStatus] = useState<'Terjadwal' | 'Sedang Berlangsung' | 'Selesai'>('Terjadwal');

  useEffect(() => {
    if (initialData) {
      setNamaKegiatan(initialData.namaKegiatan);
      setTanggalWaktu(initialData.tanggalWaktu);
      setLokasi(initialData.lokasi);
      setPimpinanBertugas(initialData.pimpinanBertugas);
      setInstansiTerkait(initialData.instansiTerkait);
      setDisposisiCatatan(initialData.disposisiCatatan);
      setStatus(initialData.status);
    } else {
      setNamaKegiatan('');
      setTanggalWaktu('Kamis, 30 Juli 2026 - 09.30 WITA');
      setLokasi('Ruang Paripurna DPRD Prov. Sulawesi Barat');
      setPimpinanBertugas('Ketua DPRD & Wakil Ketua I');
      setInstansiTerkait('Gubernur & OPD Pemprov Sulbar');
      setDisposisiCatatan('Persiapkan ruang VIP & materi briefing protokol.');
      setStatus('Terjadwal');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKegiatan.trim()) {
      alert('Nama Kegiatan Agenda Pimpinan wajib diisi.');
      return;
    }

    const item: AgendaPimpinanItem = {
      id: initialData ? initialData.id : `AGD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      tanggalWaktu,
      namaKegiatan,
      lokasi,
      pimpinanBertugas,
      instansiTerkait,
      disposisiCatatan,
      status,
      fileBahanPdfUrl: '/docs/Bahan_Agenda_Pimpinan.pdf',
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
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                {initialData ? 'Edit Agenda Pimpinan' : 'Tambah Agenda & Disposisi Pimpinan'}
              </h3>
              <p className="text-xs text-slate-400">
                Jadwal Kegiatan Resmi Pimpinan DPRD Sulawesi Barat
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
              Nama Agenda / Kegiatan Pimpinan
            </label>
            <input
              type="text"
              value={namaKegiatan}
              onChange={(e) => setNamaKegiatan(e.target.value)}
              placeholder="Contoh: Rapat Bamus Penyusunan Jadwal Paripurna Bulan Agustus 2026"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hari, Tanggal & Waktu
              </label>
              <input
                type="text"
                value={tanggalWaktu}
                onChange={(e) => setTanggalWaktu(e.target.value)}
                placeholder="Kamis, 30 Juli 2026 - 09.30 WITA"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Lokasi / Tempat Acara
              </label>
              <input
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Ruang Rapat Pimpinan / Ruang Paripurna"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pimpinan Dewan Yang Bertugas
              </label>
              <input
                type="text"
                value={pimpinanBertugas}
                onChange={(e) => setPimpinanBertugas(e.target.value)}
                placeholder="Dr. H. Amalia Aras, S.E., M.M. (Ketua)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Instansi / Pihak Terkait
              </label>
              <input
                type="text"
                value={instansiTerkait}
                onChange={(e) => setInstansiTerkait(e.target.value)}
                placeholder="Bappeda / Pemprov Sulbar / Forkopimda"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Status Agenda
            </label>
            <select
              value={status}
              onChange={(e: any) => setStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
            >
              <option value="Terjadwal">Terjadwal (Scheduled)</option>
              <option value="Sedang Berlangsung">Sedang Berlangsung (In Progress)</option>
              <option value="Selesai">Selesai (Completed)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Catatan Disposisi Pimpinan / Sekretariat
            </label>
            <textarea
              rows={3}
              value={disposisiCatatan}
              onChange={(e) => setDisposisiCatatan(e.target.value)}
              placeholder="Instruksi khusus penyiapan dokumen, fasilitasi konsumsi, atau koordinasi protokol..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
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
              <span>Simpan Agenda Pimpinan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
