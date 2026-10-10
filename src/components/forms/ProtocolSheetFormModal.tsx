import React, { useState, useEffect } from 'react';
import { ProtocolBriefingSheetItem } from '../../types';
import { X, UserCheck, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProtocolBriefingSheetItem) => void;
  initialData?: ProtocolBriefingSheetItem | null;
}

export const ProtocolSheetFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [namaAcara, setNamaAcara] = useState('');
  const [tanggalWaktu, setTanggalWaktu] = useState('');
  const [pimpinanHadir, setPimpinanHadir] = useState('');
  const [ringkasanAgenda, setRingkasanAgenda] = useState('');
  const [seatingArrangement, setSeatingArrangement] = useState('');
  const [penanggungJawab, setPenanggungJawab] = useState('');
  const [poinPenting, setPoinPenting] = useState('');

  useEffect(() => {
    if (initialData) {
      setNamaAcara(initialData.namaAcara);
      setTanggalWaktu(initialData.tanggalWaktu);
      setPimpinanHadir(initialData.pimpinanHadir);
      setRingkasanAgenda(initialData.ringkasanAgenda);
      setSeatingArrangement(initialData.seatingArrangement);
      setPenanggungJawab(initialData.penanggungJawab);
      setPoinPenting(
        initialData.poinPentingPimpinan ? initialData.poinPentingPimpinan.join('\n') : ''
      );
    } else {
      setNamaAcara('');
      setTanggalWaktu('Kamis, 30 Juli 2026 - 09.00 WITA');
      setPimpinanHadir('Ketua DPRD & Pimpinan Komisi');
      setRingkasanAgenda('');
      setSeatingArrangement('Meja Utama VIP: Ketua DPRD (Tengah), Gubernur (Kanan), Wakil Ketua (Kiri)');
      setPenanggungJawab('Subbagian Protokol & Kehumasan DPRD Sulbar');
      setPoinPenting('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaAcara.trim()) {
      alert('Nama Acara Briefing Protokol wajib diisi.');
      return;
    }

    const poinArr = poinPenting
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const item: ProtocolBriefingSheetItem = {
      id: initialData ? initialData.id : `PRT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      namaAcara,
      tanggalWaktu,
      pimpinanHadir,
      ringkasanAgenda,
      rundown: initialData?.rundown || [
        { waktu: '08.30 WITA', kegiatan: 'Registrasi Undangan VIP', pengampu: 'Tim Protokol' },
        { waktu: '09.00 WITA', kegiatan: 'Pembukaan & Lagu Indonesia Raya', pengampu: 'MC Protocol' },
        { waktu: '09.15 WITA', kegiatan: 'Sambutan Ketua DPRD Sulbar', pengampu: 'Ketua DPRD' },
      ],
      seatingArrangement,
      penanggungJawab,
      poinPentingPimpinan: poinArr.length > 0 ? poinArr : ['Garis bawahi komitmen SPBE Sulbar.'],
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
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                {initialData ? 'Edit Briefing Sheet Protokol' : 'Tambah Briefing Sheet Protokol Baru'}
              </h3>
              <p className="text-xs text-slate-400">
                Panduan Susunan Acara, Tata Tempat VIP & Poin Pengantar Pimpinan
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
              Nama Acara / Kegagiatan Keprotokolan
            </label>
            <input
              type="text"
              value={namaAcara}
              onChange={(e) => setNamaAcara(e.target.value)}
              placeholder="Contoh: Malam Resepsi Kenegaraan & Ramah Tamah Forkopimda"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hari, Tanggal & Waktu Pelaksanaan
              </label>
              <input
                type="text"
                value={tanggalWaktu}
                onChange={(e) => setTanggalWaktu(e.target.value)}
                placeholder="Kamis, 30 Juli 2026 - 19.30 WITA"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pimpinan DPRD Yang Dijadwalkan Hadir
              </label>
              <input
                type="text"
                value={pimpinanHadir}
                onChange={(e) => setPimpinanHadir(e.target.value)}
                placeholder="Ketua DPRD & Wakil Ketua III"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Ringkasan Agenda & Maksud Kegiatan
            </label>
            <textarea
              rows={2}
              value={ringkasanAgenda}
              onChange={(e) => setRingkasanAgenda(e.target.value)}
              placeholder="Jelaskan tujuan acara, latar belakang, serta luaran yang diharapkan..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Pengaturan Seating Arrangement (Tata Tempat VIP)
            </label>
            <textarea
              rows={2}
              value={seatingArrangement}
              onChange={(e) => setSeatingArrangement(e.target.value)}
              placeholder="Contoh: Baris Pertama: Ketua DPRD (Tengah), Pj. Gubernur (Kanan), Kapolda (Kiri)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Penanggung Jawab / Tim Protokol Lapangan
            </label>
            <input
              type="text"
              value={penanggungJawab}
              onChange={(e) => setPenanggungJawab(e.target.value)}
              placeholder="Kasubag Protokol & Humas Sekretariat DPRD Sulbar"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Poin-Poin Penting Pengantar Pimpinan (Pisahkan per baris)
            </label>
            <textarea
              rows={3}
              value={poinPenting}
              onChange={(e) => setPoinPenting(e.target.value)}
              placeholder="Poin 1: Menyampaikan apresiasi atas capaian Sulbar&#10;Poin 2: Menegaskan peran DPRD dalam pengawasan SPBE"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
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
              className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-500 hover:bg-purple-400 text-slate-950 transition shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Briefing Sheet Protokol</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
