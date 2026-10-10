import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  Layers,
  Copy,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Terminal,
  Activity,
} from 'lucide-react';
import { checkSupabaseStatus, reseedSupabaseDatabase, SupabaseStatusResponse } from '../utils/supabaseApi';

interface SupabaseDbModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataMutated?: () => void;
}

export function SupabaseDbModal({ isOpen, onClose, onDataMutated }: SupabaseDbModalProps) {
  const [status, setStatus] = useState<SupabaseStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReseeding, setIsReseeding] = useState(false);
  const [copiedString, setCopiedString] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const connectionString =
    'postgresql://postgres:mfCDed7RmgB6E4uZ@db.ydezarlbcofzmaosuphr.supabase.co:5432/postgres';

  const loadStatus = async () => {
    setIsLoading(true);
    setActionMessage(null);
    try {
      const res = await checkSupabaseStatus();
      setStatus(res);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(connectionString);
    setCopiedString(true);
    setTimeout(() => setCopiedString(false), 3000);
  };

  const handleReseed = async () => {
    if (
      !confirm(
        'Sinkronisasikan ulang skema tabel & seed dataset resmi DPRD Sulbar ke Supabase? Tindakan ini aman dan memastikan data terstruktur siap digunakan.'
      )
    ) {
      return;
    }
    setIsReseeding(true);
    setActionMessage(null);
    try {
      const res = await reseedSupabaseDatabase();
      if (res.success) {
        setActionMessage('✅ Database Supabase berhasil disinkronkan & diperbarui!');
        await loadStatus();
        if (onDataMutated) onDataMutated();
      } else {
        setActionMessage('❌ Gagal menyinkronkan: ' + (res.message || 'Unknown error'));
      }
    } catch (err: any) {
      setActionMessage('❌ Error: ' + err.message);
    } finally {
      setIsReseeding(false);
    }
  };

  const tables = [
    {
      name: 'risalah',
      label: 'Dokumen E-Risalah Resmi & Transkrip AI',
      count: status?.stats?.risalah ?? 0,
      desc: 'Naskah risalah, rekaman audio, transkrip pembicara, analisis sentimen, tracking 6 tahap & audit logs',
      icon: '📜',
    },
    {
      name: 'ranperda',
      label: 'Legislasi Ranperda & SLA Tracker',
      count: status?.stats?.ranperda ?? 0,
      desc: '7 Tahapan Propemperda, komisi pengampu, target SLA, dan status harmonisasi Kemendagri',
      icon: '⚖️',
    },
    {
      name: 'rdp_recommendations',
      label: 'Rekomendasi RDP & Pengawasan OPD',
      count: status?.stats?.rdp ?? 0,
      desc: 'Poin catatan komisi, perintah tindak lanjut OPD Pemprov Sulbar, tenggat & bukti verifikasi',
      icon: '🏛️',
    },
    {
      name: 'agenda_pimpinan',
      label: 'Agenda & Disposisi Pimpinan DPRD',
      count: status?.stats?.agenda ?? 0,
      desc: 'Jadwal protokoler pimpinan, instansi terkait, disposisi catatan & file bahan rapat PDF',
      icon: '📅',
    },
    {
      name: 'press_releases',
      label: 'Rilis Berita Humas (Press Release)',
      count: status?.stats?.press ?? 0,
      desc: 'Draf berita resmi birokrasi 5W+1H hasil intisari rapat DPRD Sulbar',
      icon: '📰',
    },
    {
      name: 'protocol_briefing_sheets',
      label: 'Digital Protocol Briefing Sheets',
      count: status?.stats?.protocol ?? 0,
      desc: 'Susunan acara (rundown), seating arrangement, dan poin arahan pimpinan',
      icon: '📋',
    },
    {
      name: 'anggota_dprd',
      label: 'Direktori 45 Anggota & Pimpinan DPRD Sulbar',
      count: status?.stats?.anggota ?? 0,
      desc: 'Ketua, Wakil Ketua, Komisi I-IV, Fraksi Partai, Badan Anggaran & Kontak',
      icon: '👥',
    },
    {
      name: 'notifications',
      label: 'Notifikasi SPBE Multi-Role',
      count: status?.stats?.notifications ?? 0,
      desc: 'Peringatan otomatis tenggat RDP, kuorum paripurna, dan alert dinas OPD',
      icon: '🔔',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl shadow-emerald-950/50 overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Integrasi Database Supabase PostgreSQL
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  PostgreSQL 17 Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Project: <code className="text-emerald-300 font-mono">ydezarlbcofzmaosuphr.supabase.co</code> (Sekretariat DPRD Provinsi Sulawesi Barat)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {actionMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 flex items-center justify-between animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">{actionMessage}</span>
              </div>
              <button
                onClick={() => setActionMessage(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* Connection Status Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-3.5 h-3.5 rounded-full ${
                    status?.connected
                      ? 'bg-emerald-400 ring-4 ring-emerald-500/20 animate-pulse'
                      : 'bg-red-500 ring-4 ring-red-500/20'
                  }`}
                />
                <span className="text-sm font-semibold text-white">
                  {status?.connected
                    ? 'Status: Terkoneksi & Aktif (Supabase Cloud)'
                    : 'Status: Menghubungkan ke Supabase...'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadStatus}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Mengecek...' : 'Cek Status'}
                </button>
                <button
                  onClick={handleReseed}
                  disabled={isReseeding}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1.5 shadow-md shadow-emerald-900/40 transition-colors disabled:opacity-50"
                >
                  <ShieldCheck className={`w-3.5 h-3.5 ${isReseeding ? 'animate-spin' : ''}`} />
                  {isReseeding ? 'Menyinkronkan...' : 'Sinkronkan / Re-Seed Data'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Engine Database</div>
                <div className="text-xs font-mono font-medium text-emerald-400 mt-0.5">PostgreSQL 17 (Supabase)</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Host Endpoint</div>
                <div className="text-xs font-mono font-medium text-slate-200 mt-0.5 truncate" title="db.ydezarlbcofzmaosuphr.supabase.co">
                  db.ydezarlbcofzmaosuphr.supabase.co
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Port & Database</div>
                <div className="text-xs font-mono font-medium text-slate-200 mt-0.5">5432 / postgres</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Dokumen / Baris</div>
                <div className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                  {status?.stats
                    ? Object.values(status.stats).reduce((a: number, b: number) => a + b, 0)
                    : 0}{' '}
                  records live
                </div>
              </div>
            </div>
          </div>

          {/* Tables Live Status */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                Daftar Skema & Jumlah Baris di Supabase Live
              </h3>
              <span className="text-[11px] text-slate-500">
                8 Tabel Terstruktur Otomatis
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tables.map((tbl) => (
                <div
                  key={tbl.name}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all flex items-start gap-3"
                >
                  <span className="text-xl p-2 rounded-lg bg-slate-900 border border-slate-800">{tbl.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 truncate">{tbl.label}</span>
                      <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {tbl.count} data
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">table: {tbl.name}</div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{tbl.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hostinger & Web Server Deployment Notes */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/20 space-y-3">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Petunjuk Sambungan ke Web Server Hostinger</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Karena Anda menghubungkan aplikasi ini ke web server Hostinger, database Supabase ini sudah langsung siap digunakan. Di dashboard Hostinger (Node.js App / VPS / Shared Hosting), Anda cukup memasukkan environment variable berikut:
            </p>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 font-mono text-[11px]">
              <div className="text-slate-400 text-[10px]"># Hostinger .env Configuration</div>
              <div className="text-emerald-300 break-all">
                SUPABASE_URL=https://ydezarlbcofzmaosuphr.supabase.co
              </div>
              <div className="text-emerald-300 break-all flex items-center justify-between gap-2">
                <span>DATABASE_URL={connectionString}</span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 flex items-center gap-1 text-[10px] transition-colors"
                  title="Salin Connection String"
                >
                  {copiedString ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedString ? 'Tersalin' : 'Salin'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                SSL Mode <code className="text-emerald-300 font-mono">require / rejectUnauthorized: false</code> sudah otomatis diaktifkan untuk koneksi aman terenkripsi antarnode.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <a
            href="https://supabase.com/dashboard/project/ydezarlbcofzmaosuphr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Buka Supabase Dashboard Project
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
