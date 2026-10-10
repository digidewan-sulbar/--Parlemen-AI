import React, { useState } from 'react';
import { AuthUser, AuthRole } from '../types';
import { authenticateUser, storeAuthUser, VALID_ACCOUNTS } from '../utils/auth';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Building2,
  KeyRound,
  FileText,
  Users,
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const { user, error } = authenticateUser(username, password);
      if (error || !user) {
        setErrorMessage(error || 'Gagal masuk ke sistem. Periksa kembali username dan kata sandi.');
        setIsLoading(false);
      } else {
        storeAuthUser(user, rememberMe);
        setIsLoading(false);
        onLoginSuccess(user);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden bg-grid-pattern">
      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-emerald-600/20 via-teal-600/10 to-transparent blur-3xl rounded-full opacity-60"></div>
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-blue-600/10 blur-3xl rounded-full"></div>
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-amber-600/10 blur-3xl rounded-full"></div>
      </div>

      {/* Top Government Ribbon */}
      <header className="relative z-10 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-md px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-full border border-amber-500/30 text-amber-300 font-semibold text-[11px]">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/89/Coat_of_arms_of_West_Sulawesi.svg"
                alt="Lambang Sulbar"
                className="h-4 w-auto drop-shadow"
                referrerPolicy="no-referrer"
              />
              <span>PEMERINTAH PROVINSI SULAWESI BARAT</span>
            </div>
            <span className="hidden sm:inline text-slate-400 font-medium">|</span>
            <span className="font-semibold text-slate-200 hidden sm:inline">
              SEKRETARIAT DEWAN PERWAKILAN RAKYAT DAERAH (DPRD)
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Sistem Online v2.4 (Terintegrasi)</span>
          </div>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          {/* Main Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl shadow-black/80 backdrop-blur-xl p-6 sm:p-10 relative overflow-hidden">
            {/* Top Accent Border */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-teal-400"></div>

            {/* Logo & Portal Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl mb-4 group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition duration-300"></div>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/89/Coat_of_arms_of_West_Sulawesi.svg"
                  alt="Lambang Sulbar"
                  className="h-16 w-auto relative z-10 drop-shadow-md"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1.5">
                E-PARLEMEN SULBAR
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Sistem Terpadu Persidangan, Fasilitasi Pimpinan, & Kehumasan
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] px-3 py-0.5 rounded-full font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portal Autentikasi Pegawai & Pejabat</span>
              </div>
            </div>

            {/* Quick Demo Access Bar */}
            <div className="mb-6 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  Pilih Cepat Akun (3 Level Akses):
                </span>
                <span className="text-[10px] text-slate-500">Klik untuk isi otomatis</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {VALID_ACCOUNTS.map((acc) => {
                  const isSelected = username === acc.username;
                  return (
                    <button
                      key={acc.username}
                      type="button"
                      onClick={() => handleQuickFill(acc.username, acc.passwordHash)}
                      className={`text-left p-2 rounded-xl border text-xs transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? `${acc.colorScheme.bg} ${acc.colorScheme.border} ${acc.colorScheme.text} ring-1 ring-emerald-500/40 shadow-sm`
                          : 'bg-slate-900/90 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span className="capitalize">{acc.username}</span>
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/40">
                          Lv.{acc.levelAkses}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                        {acc.passwordHash}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="mb-5 bg-rose-950/70 border border-rose-500/60 rounded-xl p-3.5 flex items-start gap-3 text-rose-200 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Autentikasi Gagal</p>
                  <p className="text-[11px] text-rose-300/90 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nama Pengguna (Username)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Masukkan username (contoh: admin, kabag, operator)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Masukkan kata sandi akun"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-mono"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                    title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 focus:ring-1"
                  />
                  <span>Ingat sesi masuk saya</span>
                </label>

                <span className="text-[11px] text-slate-500">
                  Keamanan SPBE Terstandar
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-950/60 transition-all duration-200 flex items-center justify-center gap-2 border border-emerald-400/40 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memverifikasi Akses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke E-Parlemen</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Level Access Information Card */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Matriks Hak Akses Pengguna Resmi (RBAC)
              </h2>

              <div className="space-y-2.5 text-xs">
                <div className="bg-slate-950/70 p-3 rounded-xl border border-emerald-900/60 flex items-start gap-3">
                  <span className="bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-800/80 shrink-0">
                    1. Admin
                  </span>
                  <div className="text-[11px] text-slate-300">
                    <p className="font-semibold text-white">Khusus Administrator IT & Basis Data:</p>
                    <p className="text-slate-400 mt-0.5">
                      Satu-satunya level yang dapat melihat & mengakses: <strong>Supabase DB</strong>, <strong>Deploy GitHub</strong>, dan <strong>Integrasi Database PostgreSQL</strong>. Serta berwenang penuh atas data master dan otentikasi.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-amber-900/60 flex items-start gap-3">
                  <span className="bg-amber-950 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px] border border-amber-800/80 shrink-0">
                    2. Kabag
                  </span>
                  <div className="text-[11px] text-slate-300">
                    <p className="font-semibold text-white">Kepala Bagian Persidangan & Pimpinan:</p>
                    <p className="text-slate-400 mt-0.5">
                      Berwenang menambah & mengedit data <strong>Pejabat Pemprov</strong>, <strong>Pimpinan & Anggota DPRD</strong>, serta <strong>mengotentikasi paraf risalah & mendisposisi agenda</strong>. (Fitur DB & Deploy GitHub disembunyikan).
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-blue-900/60 flex items-start gap-3">
                  <span className="bg-blue-950 text-blue-300 font-bold px-2 py-0.5 rounded text-[10px] border border-blue-800/60 shrink-0">
                    3. Operator
                  </span>
                  <div className="text-[11px] text-slate-300">
                    <p className="font-semibold text-white">Staf Operator Administrasi & Teknis:</p>
                    <p className="text-slate-400 mt-0.5">
                      Mengerjakan tugas administratif & teknis: <strong>membuat risalah rapat, transkripsi AI, edit draft naskah, rilis berita humas, input berkas, dan cetak PDF</strong>. Dibatasi dari pengubahan master data Pejabat/DPRD, otentikasi/disposisi, dan database.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/90 py-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 Sekretariat DPRD Provinsi Sulawesi Barat. Seluruh Hak Dilindungi.
          </span>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Perpres No. 95/2018 (SPBE)</span>
            <span>•</span>
            <span>Aman & Terenkripsi</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
