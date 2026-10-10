import React, { useState, useEffect } from 'react';
import { RanperdaItem, RanperdaStage } from '../../types';
import { X, FileText, Save, Plus, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: RanperdaItem) => void;
  initialData?: RanperdaItem | null;
}

export const RanperdaFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [nomorRanperda, setNomorRanperda] = useState('');
  const [judulRanperda, setJudulRanperda] = useState('');
  const [inisiator, setInisiator] = useState<'DPRD (Komisi/Bapemperda)' | 'Gubernur / Pemprov Sulbar'>(
    'DPRD (Komisi/Bapemperda)'
  );
  const [komisiPengampu, setKomisiPengampu] = useState<
    'Komisi I' | 'Komisi II' | 'Komisi III' | 'Komisi IV' | 'Bapemperda'
  >('Komisi I');
  const [tahapanKe, setTahapanKe] = useState<RanperdaStage>(1);
  const [namaTahapan, setNamaTahapan] = useState('1. Naskah Akademik & Draf Awal');
  const [tanggalMulai, setTanggalMulai] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [targetSlaDays, setTargetSlaDays] = useState(30);
  const [sisaHariSla, setSisaHariSla] = useState(30);
  const [statusSla, setStatusSla] = useState<'Sesuai SLA' | 'Mendekati Tenggat' | 'Melebihi SLA (Alert)'>(
    'Sesuai SLA'
  );
  const [keteranganProgres, setKeteranganProgres] = useState('');

  const TAHAPAN_MAP: Record<RanperdaStage, string> = {
    1: '1. Naskah Akademik & Draf Awal',
    2: '2. Draf Ranperda Terkaji',
    3: '3. Pembahasan Propemperda',
    4: '4. Rapat Paripurna / Pembahasan Komisi',
    5: '5. Fasilitasi Kemendagri',
    6: '6. Persetujuan Bersama',
    7: '7. Pengundangan Perda',
  };

  useEffect(() => {
    if (initialData) {
      setNomorRanperda(initialData.nomorRanperda);
      setJudulRanperda(initialData.judulRanperda);
      setInisiator(initialData.inisiator);
      setKomisiPengampu(initialData.komisiPengampu);
      setTahapanKe(initialData.tahapanKe);
      setNamaTahapan(initialData.namaTahapan);
      setTanggalMulai(initialData.tanggalMulai);
      setTargetSlaDays(initialData.targetSlaDays);
      setSisaHariSla(initialData.sisaHariSla);
      setStatusSla(initialData.statusSla);
      setKeteranganProgres(initialData.keteranganProgres);
    } else {
      setNomorRanperda(`Ranperda/2026/${Math.floor(10 + Math.random() * 90)}`);
      setJudulRanperda('');
      setInisiator('DPRD (Komisi/Bapemperda)');
      setKomisiPengampu('Komisi I');
      setTahapanKe(1);
      setNamaTahapan(TAHAPAN_MAP[1]);
      setTanggalMulai(new Date().toISOString().split('T')[0]);
      setTargetSlaDays(30);
      setSisaHariSla(30);
      setStatusSla('Sesuai SLA');
      setKeteranganProgres('Naskah akademik sedang dirumuskan oleh Tim Ahli.');
    }
  }, [initialData, isOpen]);

  const handleStageChange = (stage: RanperdaStage) => {
    setTahapanKe(stage);
    setNamaTahapan(TAHAPAN_MAP[stage]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulRanperda.trim()) {
      alert('Judul Ranperda wajib diisi.');
      return;
    }

    const item: RanperdaItem = {
      id: initialData ? initialData.id : `RNP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      nomorRanperda,
      judulRanperda,
      inisiator,
      komisiPengampu,
      tahapanKe,
      namaTahapan,
      tanggalMulai,
      targetSlaDays: Number(targetSlaDays),
      sisaHariSla: Number(sisaHariSla),
      statusSla,
      keteranganProgres,
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
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                {initialData ? 'Edit Data Ranperda' : 'Tambah Input Ranperda Baru'}
              </h3>
              <p className="text-xs text-slate-400">
                Formulir Rantai Tahapan Legislasi & Tracking SLA Pemprov Sulbar
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

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nomor Register Ranperda
              </label>
              <input
                type="text"
                value={nomorRanperda}
                onChange={(e) => setNomorRanperda(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pengusul / Inisiator
              </label>
              <select
                value={inisiator}
                onChange={(e: any) => setInisiator(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="DPRD (Komisi/Bapemperda)">DPRD (Komisi / Bapemperda)</option>
                <option value="Gubernur / Pemprov Sulbar">Gubernur / Pemprov Sulbar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Judul Ranperda
            </label>
            <input
              type="text"
              value={judulRanperda}
              onChange={(e) => setJudulRanperda(e.target.value)}
              placeholder="Contoh: Ranperda Perlindungan & Pemberdayaan Petani Kakao Sulbar"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Komisi / Alat Kelengkapan Dewan (AKD) Pengampu
              </label>
              <select
                value={komisiPengampu}
                onChange={(e: any) => setKomisiPengampu(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Komisi I">Komisi I (Pemerintahan & Hukum)</option>
                <option value="Komisi II">Komisi II (Perekonomian & Keuangan)</option>
                <option value="Komisi III">Komisi III (Pembangunan & Infrastruktur)</option>
                <option value="Komisi IV">Komisi IV (Kesejahteraan Rakyat)</option>
                <option value="Bapemperda">Bapemperda (Badan Pembentukan Perda)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tahapan Progres Ranperda (1-7)
              </label>
              <select
                value={tahapanKe}
                onChange={(e) => handleStageChange(Number(e.target.value) as RanperdaStage)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value={1}>Tahap 1: Naskah Akademik</option>
                <option value={2}>Tahap 2: Draf Ranperda Terkaji</option>
                <option value={3}>Tahap 3: Pembahasan Propemperda</option>
                <option value={4}>Tahap 4: Paripurna / Pembahasan Komisi</option>
                <option value={5}>Tahap 5: Fasilitasi Kemendagri</option>
                <option value={6}>Tahap 6: Persetujuan Bersama</option>
                <option value={7}>Tahap 7: Pengundangan Perda</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tanggal Mulai Tahapan
              </label>
              <input
                type="date"
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target SLA (Hari)
              </label>
              <input
                type="number"
                value={targetSlaDays}
                onChange={(e) => setTargetSlaDays(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status Indikator SLA
              </label>
              <select
                value={statusSla}
                onChange={(e: any) => setStatusSla(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Sesuai SLA">Sesuai SLA (Aman)</option>
                <option value="Mendekati Tenggat">Mendekati Tenggat (Perhatian)</option>
                <option value="Melebihi SLA (Alert)">Melebihi SLA (Alert Warning)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Catatan Keterangan Progres
            </label>
            <textarea
              rows={3}
              value={keteranganProgres}
              onChange={(e) => setKeteranganProgres(e.target.value)}
              placeholder="Berikan detail progres pembahasan, tim ahli, atau fasilitasi instansi..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
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
              <span>Simpan Data Ranperda</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
