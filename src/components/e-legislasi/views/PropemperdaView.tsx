import React, { useState } from 'react';
import { PropemperdaItem, RoleCode } from '../types';
import {
  FileCheck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface Props {
  propemperdaList: PropemperdaItem[];
  currentRole: RoleCode;
  onAddPropemperda: (item: PropemperdaItem) => void;
}

export const PropemperdaView: React.FC<Props> = ({
  propemperdaList,
  currentRole,
  onAddPropemperda,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTriwulan, setFilterTriwulan] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [judul, setJudul] = useState('');
  const [usulanOleh, setUsulanOleh] = useState<'DPRD' | 'Gubernur / Pemprov'>('Gubernur / Pemprov');
  const [opdKomisi, setOpdKomisi] = useState('');
  const [skor, setSkor] = useState(85);
  const [targetTriwulan, setTargetTriwulan] = useState<'Triwulan I' | 'Triwulan II' | 'Triwulan III' | 'Triwulan IV'>('Triwulan I');
  const [keterangan, setKeterangan] = useState('');

  const filtered = propemperdaList.filter((item) => {
    const matchSearch =
      item.judulRanperda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.opdKomisiPengampu.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTriwulan =
      filterTriwulan === 'ALL' || item.targetTriwulan === filterTriwulan;
    return matchSearch && matchTriwulan;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !opdKomisi.trim()) return;

    const newItem: PropemperdaItem = {
      id: `PROP-2026-${String(propemperdaList.length + 1).padStart(3, '0')}`,
      nomorUrut: propemperdaList.length + 1,
      tahun: 2026,
      judulRanperda: judul,
      usulanOleh,
      opdKomisiPengampu: opdKomisi,
      skorPrioritasBapemperda: skor,
      targetTriwulan,
      statusProgram: 'Dalam Proses',
      keterangan: keterangan || 'Inisiatif Program Pembentukan Peraturan Daerah 2026',
    };

    onAddPropemperda(newItem);
    setIsModalOpen(false);
    setJudul('');
    setOpdKomisi('');
    setKeterangan('');
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              PROPEMPERDA TAHUN 2026
            </span>
            <span className="text-xs text-slate-400">| Bapemperda DPRD & Pemprov Sulbar</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Program Pembentukan Peraturan Daerah (Propemperda) Provinsi Sulawesi Barat
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Daftar prioritas Ranperda yang disetujui bersama dalam Rapat Paripurna DPRD untuk pembahasan TA 2026.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(currentRole === 'ROLE_SETWAN' || currentRole === 'ROLE_DPRD' || currentRole === 'ROLE_BIRO_HUKUM') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Usulkan Ranperda Propemperda</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari dalam Propemperda 2026..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 text-xs">
          <span className="text-slate-400">Target Triwulan:</span>
          {['ALL', 'Triwulan I', 'Triwulan II', 'Triwulan III', 'Triwulan IV'].map((tw) => (
            <button
              key={tw}
              onClick={() => setFilterTriwulan(tw)}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                filterTriwulan === tw
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tw === 'ALL' ? 'Semua' : tw}
            </button>
          ))}
        </div>
      </div>

      {/* Propemperda Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4 w-12 text-center">No</th>
                <th className="p-4">Judul Ranperda Propemperda</th>
                <th className="p-4">Usulan</th>
                <th className="p-4">OPD / Komisi Pengampu</th>
                <th className="p-4 text-center">Skor Prioritas</th>
                <th className="p-4">Target Target</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition">
                  <td className="p-4 text-center font-bold text-slate-400">
                    {item.nomorUrut}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-100">{item.judulRanperda}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{item.keterangan}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        item.usulanOleh === 'DPRD'
                          ? 'bg-purple-950 text-purple-300 border-purple-800'
                          : 'bg-blue-950 text-blue-300 border-blue-800'
                      }`}
                    >
                      {item.usulanOleh}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 font-medium">
                    {item.opdKomisiPengampu}
                  </td>
                  <td className="p-4 text-center">
                    <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 font-extrabold text-emerald-400">
                      {item.skorPrioritasBapemperda} / 100
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.targetTriwulan} 2026</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        item.statusProgram === 'Selesai / Diundangkan'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : item.statusProgram === 'Dalam Proses'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {item.statusProgram}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Item */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Tambah Usulan Propemperda 2026</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Judul Ranperda Propemperda <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ranperda Penyelenggaraan Keolahragaan..."
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Inisiator</label>
                  <select
                    value={usulanOleh}
                    onChange={(e) => setUsulanOleh(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Gubernur / Pemprov">Gubernur / Pemprov</option>
                    <option value="DPRD">DPRD (Inisiatif)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Triwulan</label>
                  <select
                    value={targetTriwulan}
                    onChange={(e) => setTargetTriwulan(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Triwulan I">Triwulan I</option>
                    <option value="Triwulan II">Triwulan II</option>
                    <option value="Triwulan III">Triwulan III</option>
                    <option value="Triwulan IV">Triwulan IV</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">OPD / Komisi Pengampu</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dinas Pemuda & Olahraga / Komisi IV"
                    value={opdKomisi}
                    onChange={(e) => setOpdKomisi(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Skor Bapemperda (1-100)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={skor}
                    onChange={(e) => setSkor(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Keterangan / Urgensi</label>
                <textarea
                  rows={2}
                  placeholder="Latar belakang urgensi Ranperda..."
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Simpan ke Propemperda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
