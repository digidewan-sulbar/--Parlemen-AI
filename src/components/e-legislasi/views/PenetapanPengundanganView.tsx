import React, { useState } from 'react';
import { RanperdaDetail, RoleCode } from '../types';
import {
  FileCheck2,
  Download,
  Share2,
  CheckCircle2,
  Globe,
  FileCode,
  Printer,
  Sparkles,
} from 'lucide-react';

interface Props {
  ranperdaList: RanperdaDetail[];
  currentRole: RoleCode;
  onUpdateRanperdaStatus: (id: string, newStatus: any, note: string) => void;
}

export const PenetapanPengundanganView: React.FC<Props> = ({
  ranperdaList,
  currentRole,
  onUpdateRanperdaStatus,
}) => {
  const readyList = ranperdaList.filter(
    (r) => r.statusCode === 'NOREG_ISSUED' || r.statusCode === 'ENACTED_JDIH'
  );

  const [selectedRanperda, setSelectedRanperda] = useState<RanperdaDetail | null>(
    readyList[0] || ranperdaList[0] || null
  );

  const [nomorLembaranDaerah, setNomorLembaranDaerah] = useState(
    selectedRanperda?.nomorLembaranDaerah || ''
  );
  const [tanggalPengundangan, setTanggalPengundangan] = useState(
    selectedRanperda?.tanggalPengundangan || new Date().toISOString().split('T')[0]
  );

  const [isExportSuccess, setIsExportSuccess] = useState(false);

  const handleEnactAndExportJDIH = () => {
    if (!selectedRanperda) return;

    const noPerda = nomorLembaranDaerah || `PERDA NO. ${Math.floor(Math.random() * 10 + 1)} TAHUN 2026`;

    onUpdateRanperdaStatus(
      selectedRanperda.id,
      'ENACTED_JDIH',
      `Telah diundangkan dalam Lembaran Daerah Sulawesi Barat sebagai: ${noPerda} pada tanggal ${tanggalPengundangan}. Metadata diunggah otomatis ke portal JDIH Prov Sulbar.`
    );

    setIsExportSuccess(true);
    setTimeout(() => setIsExportSuccess(false), 4000);
  };

  const handleExportJDIHJson = () => {
    if (!selectedRanperda) return;

    const jdihMetadata = {
      tipe_dokumen: 'PERATURAN DAERAH',
      judul: selectedRanperda.judulRanperda,
      nomor_perda: selectedRanperda.nomorLembaranDaerah || 'PERDA NO. 1 TAHUN 2026',
      nomor_register: selectedRanperda.nomorRegisterPerda || 'NOREG 01/SULBAR/2026',
      tanggal_pengundangan: selectedRanperda.tanggalPengundangan || '2026-02-20',
      pemerintah_daerah: 'Pemerintah Provinsi Sulawesi Barat',
      bahasa: 'Indonesia',
      status: 'Berlaku',
      integrasi: 'JDIHN Nasional / BPHN Kemnkumham',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jdihMetadata, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `JDIH_Sulbar_${selectedRanperda.nomorRanperda.replace(/\//g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              PENETAPAN, LEMBARAN DAERAH & JDIH EXPORTER
            </span>
            <span className="text-xs text-slate-400">| Tahap Akhir Pembentukan Perda</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Pengundangan Lembaran Daerah & Integrasi JDIH Sulbar
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Penandatanganan resmi Gubernur & Pengundangan oleh Sekretaris Daerah Provinsi Sulawesi Barat.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Ranperda Siap Pengundangan ({readyList.length})
          </h3>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {readyList.map((item) => {
              const isSelected = selectedRanperda?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedRanperda(item);
                    setNomorLembaranDaerah(item.nomorLembaranDaerah || '');
                    setTanggalPengundangan(item.tanggalPengundangan || new Date().toISOString().split('T')[0]);
                  }}
                  className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-emerald-950/30 border-emerald-500 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {item.nomorRanperda}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        item.statusCode === 'ENACTED_JDIH'
                          ? 'bg-emerald-600 text-slate-950'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      }`}
                    >
                      {item.statusCode === 'ENACTED_JDIH' ? 'Terbit Perda / JDIH' : 'Noreg Diterbitkan'}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-white line-clamp-2">
                    {item.judulRanperda}
                  </h4>

                  <div className="text-[10px] text-slate-400 border-t border-slate-800/60 pt-1">
                    Noreg: <span className="font-mono text-emerald-300">{item.nomorRegisterPerda || '-'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Form & Exporter */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          {selectedRanperda ? (
            <>
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {selectedRanperda.nomorRanperda}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedRanperda.judulRanperda}
                </h3>
              </div>

              {isExportSuccess && (
                <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 p-4 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Pengundangan Berhasil! Perda resmi terbit dan tersinkronisasi ke Portal JDIH Nasional.</span>
                </div>
              )}

              {/* Form Input Lembaran Daerah */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
                <h4 className="font-bold text-emerald-400 flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Pengundangan Lembaran Daerah Provinsi Sulawesi Barat</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Nomor Peraturan Daerah (Perda)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: PERDA NO. 2 TAHUN 2026"
                      value={nomorLembaranDaerah}
                      onChange={(e) => setNomorLembaranDaerah(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Tanggal Pengundangan oleh Sekda
                    </label>
                    <input
                      type="date"
                      value={tanggalPengundangan}
                      onChange={(e) => setTanggalPengundangan(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleEnactAndExportJDIH}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Simpan Pengundangan Perda</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportJDIHJson}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2"
                  >
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span>Export Metadata JDIH (JSON)</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
              Pilih Ranperda dari daftar di sebelah kiri untuk memproses pengundangan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
