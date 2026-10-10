import React, { useState, useEffect } from 'react';
import { RisalahItem, TahapRisalah, AuthUser } from '../../types';
import {
  TAHAPAN_ORDER,
  TAHAPAN_RISALAH_METADATA,
  applyTrackingUpdate,
  getTahapIndex,
} from '../../utils/risalahTracking';
import {
  X,
  History,
  CheckCircle2,
  Clock,
  User,
  FileCheck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Save,
  Lock,
  Info,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  risalah: RisalahItem | null;
  currentUser?: AuthUser | null;
  onUpdateRisalah: (updated: RisalahItem) => void;
}

export const RisalahUpdateTrackingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  risalah,
  currentUser,
  onUpdateRisalah,
}) => {
  const [selectedTahap, setSelectedTahap] = useState<TahapRisalah>('4. Verifikasi & Telaah Notulis');
  const [aktor, setAktor] = useState('');
  const [catatan, setCatatan] = useState('');
  const [versi, setVersi] = useState('v2.5');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Otentikasi & Pengesahan hanya untuk admin & kabag (tahap index 4 & 5)
  const isLeaderRole = currentUser?.role === 'admin' || currentUser?.role === 'kabag';

  useEffect(() => {
    setErrorMsg(null);
    if (risalah) {
      const current = risalah.statusTahap || '4. Verifikasi & Telaah Notulis';
      // If operator and current is already >= 4, keep it but prevent changing to 4/5
      setSelectedTahap(current);
      const meta = TAHAPAN_RISALAH_METADATA[current];
      setAktor(meta?.defaultAktor || 'Notulis Persidangan Setwan');
      setCatatan('');
      const currentIdx = getTahapIndex(current);
      setVersi(currentIdx === 5 ? 'v3.0 (Naskah Sah)' : `v2.${currentIdx}`);
    }
  }, [risalah, isOpen]);

  if (!isOpen || !risalah) return null;

  const handleTahapChange = (tahap: TahapRisalah) => {
    setErrorMsg(null);
    const idx = getTahapIndex(tahap);
    if (!isLeaderRole && idx >= 4) {
      setErrorMsg('Akses Otentikasi Terbatas: Tahapan Paraf Kabag dan Pengesahan Final hanya dapat diautentikasi oleh akun Kabag atau Admin.');
      return;
    }
    setSelectedTahap(tahap);
    const meta = TAHAPAN_RISALAH_METADATA[tahap];
    if (meta) {
      setAktor(meta.defaultAktor);
      setVersi(idx === 5 ? 'v3.0 (Naskah Sah)' : `v2.${idx + 1}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const idx = getTahapIndex(selectedTahap);
    if (!isLeaderRole && idx >= 4) {
      setErrorMsg('Akses Ditolak: Tahapan Paraf dan Pengesahan Risalah memerlukan otentikasi akun Kabag atau Admin.');
      return;
    }
    if (!aktor.trim()) {
      setErrorMsg('Nama aktor / pejabat penanggung jawab wajib diisi.');
      return;
    }
    if (!catatan.trim()) {
      setErrorMsg('Catatan rekam jejak / log aktivitas wajib diisi.');
      return;
    }
    setErrorMsg(null);

    const updated = applyTrackingUpdate(
      risalah,
      selectedTahap,
      aktor,
      catatan,
      versi || 'v2.0'
    );

    onUpdateRisalah(updated);
    onClose();
  };

  const quickActors = [
    'Arianto, AP, M.M. (Notulis Ahli)',
    'Kabag Persidangan & Perundang-undangan Setwan',
    'Ketua DPRD Prov. Sulawesi Barat',
    'Kasubag Risalah & Notulensi',
    'Engine AI Speech-to-Text & NLP',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl text-slate-100 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <span>Perbarui Rekam Jejak Proses Risalah</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full font-mono">
                  Audit Trail
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {risalah.nomorRisalah} &bull; {risalah.judulRapat}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {errorMsg && (
            <div className="bg-red-950/80 border border-red-700/80 rounded-xl p-3 flex items-center justify-between text-xs text-red-200">
              <span className="font-semibold">{errorMsg}</span>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="text-red-400 hover:text-white ml-2 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Operator Notice */}
          {!isLeaderRole && (
            <div className="bg-blue-950/40 border border-blue-800/60 rounded-xl p-3 text-xs text-blue-200 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Alur Otentikasi Terstandar (Akun Operator)</p>
                <p className="text-[11px] text-blue-300/90 mt-0.5">
                  Sebagai Operator Risalah, Anda berwenang memproses tahapan teknis & administratif (Tahap 1 s/d 4: Perekaman, Transkripsi AI, Pembersihan Bahasa Baku, dan Verifikasi Notulis). Tahap 5 (Paraf Kabag) dan Tahap 6 (Pengesahan Final Pimpinan) dibatasi khusus akun <strong>Kabag</strong> atau <strong>Admin</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Stage Selector */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">
              Pilih Tahapan Alur Pembuatan Risalah:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TAHAPAN_ORDER.map((tahap, idx) => {
                const isSelected = selectedTahap === tahap;
                const meta = TAHAPAN_RISALAH_METADATA[tahap];
                const isRestrictedForOp = !isLeaderRole && idx >= 4;

                return (
                  <button
                    key={tahap}
                    type="button"
                    onClick={() => handleTahapChange(tahap)}
                    className={`text-left p-3 rounded-xl border transition flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/50'
                        : isRestrictedForOp
                        ? 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:border-slate-800 opacity-75'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950'
                          : isRestrictedForOp
                          ? 'bg-slate-900 text-slate-500 border border-slate-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-200 flex items-center justify-between gap-1">
                        <span className="truncate">{meta.labelSingkat}</span>
                        {isRestrictedForOp && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-mono font-bold flex items-center gap-0.5 shrink-0">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Kabag/Admin</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {meta.deskripsi}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actor / Person in Charge */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Aktor / Pejabat Penanggung Jawab Tahap:
            </label>
            <input
              type="text"
              value={aktor}
              onChange={(e) => setAktor(e.target.value)}
              placeholder="Contoh: Arianto, AP, M.M. (Notulis Ahli Persidangan)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
              required
            />
            {/* Quick Actor Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[10px] text-slate-500">Pilih Cepat:</span>
              {quickActors.map((qa) => (
                <button
                  key={qa}
                  type="button"
                  onClick={() => setAktor(qa)}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700 transition"
                >
                  {qa.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Versi Dokumen:
              </label>
              <input
                type="text"
                value={versi}
                onChange={(e) => setVersi(e.target.value)}
                placeholder="Contoh: v2.5 atau v3.0 (Naskah Final)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Target SLA / Batas Waktu:
              </label>
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-400 text-xs flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{TAHAPAN_RISALAH_METADATA[selectedTahap]?.slaJam || 'Sesuai SOP'}</span>
              </div>
            </div>
          </div>

          {/* Activity Notes / Change Log */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Catatan Rekam Jejak / Keterangan Aktivitas:
            </label>
            <textarea
              rows={3}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Jelaskan rincian aktivitas yang telah dikerjakan pada tahap ini, seperti: 'Validasi daftar kehadiran 38 anggota, penyesuaian tata kalimat butir keputusan, dan penyiapan berkas paraf...'"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs leading-relaxed"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Rekam Jejak</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
