import React, { useState } from 'react';
import { PillarType, UserRole, AuthUser } from '../types';
import {
  FileText,
  UserCheck,
  Megaphone,
  Layers,
  Sparkles,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Bell,
  Search,
  Users,
  Database,
  GitBranch,
  LogOut,
  UserCircle2,
  ChevronDown,
  BookOpen,
} from 'lucide-react';

interface Props {
  activePillar: PillarType;
  setActivePillar: (pillar: PillarType) => void;
  onOpenAiStudio: () => void;
  unreadNotifCount: number;
  onOpenNotifications: () => void;
  onOpenSmartSearch: () => void;
  onOpenDprdDirectory: () => void;
  onOpenPejabatPemprov?: () => void;
  onOpenSupabaseModal?: () => void;
  onOpenGitDeploy?: () => void;
  onOpenBukuPanduan?: () => void;
  userRole: UserRole;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const HeaderNavbar: React.FC<Props> = ({
  activePillar,
  setActivePillar,
  onOpenAiStudio,
  unreadNotifCount,
  onOpenNotifications,
  onOpenSmartSearch,
  onOpenDprdDirectory,
  onOpenPejabatPemprov,
  onOpenSupabaseModal,
  onOpenGitDeploy,
  onOpenBukuPanduan,
  userRole,
  currentUser,
  onLogout,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  return (
    <header className="bg-slate-950/95 text-white border-b border-slate-800/80 sticky top-0 z-40 shadow-2xl backdrop-blur-xl border-t-2 border-t-amber-500/90">
      {/* Top Govt Ribbon Bar */}
      <div className="bg-slate-950/90 px-4 py-1.5 border-b border-slate-800/60 text-xs flex flex-wrap justify-between items-center text-slate-300">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-300 font-semibold text-[11px]">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/89/Coat_of_arms_of_West_Sulawesi.svg"
              alt="Lambang Sulbar"
              className="h-4 w-auto drop-shadow"
              referrerPolicy="no-referrer"
            />
            <span>PEMPROV SULBAR</span>
          </div>
          <span className="font-bold text-slate-100 tracking-wide">
            SEKRETARIAT DPRD PROVINSI SULAWESI BARAT
          </span>
        </div>

        {/* Supabase PostgreSQL Status Indicator in Top Ribbon */}
        {onOpenSupabaseModal && (
          <button
            onClick={onOpenSupabaseModal}
            className="flex items-center gap-2 bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all shadow-sm group cursor-pointer"
            title="Database Supabase Terhubung - Klik untuk rincian & status tabel"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[10px] text-emerald-200">Supabase:</span>
            <span className="font-semibold text-white">PostgreSQL 17 Terhubung</span>
            <Database className="w-3 h-3 text-emerald-400 group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </div>

      {/* Main Brand & Executive Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand with Official Left Logo */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative bg-slate-950 p-2 rounded-xl border border-slate-800 shadow-xl flex items-center justify-center shrink-0">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/89/Coat_of_arms_of_West_Sulawesi.svg"
                alt="Logo Pemprov Sulbar"
                className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent font-sans">
                E-PARLEMEN SULBAR
              </h1>
              <span className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/40 shadow-sm uppercase tracking-wider">
                PRO v2.4 AI Core
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium tracking-wide flex items-center gap-1.5 mt-0.5">
              <span>Trilogi Layanan Persidangan, Fasilitasi Pimpinan & Kehumasan DPRD Sulbar</span>
            </p>
          </div>
        </div>

        {/* Header Action Buttons + Right Official Logo */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Button 45 Anggota DPRD Directory */}
          <button
            onClick={onOpenDprdDirectory}
            className="bg-slate-900/90 hover:bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 hover:border-emerald-500/80 text-xs px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 active:scale-95 group"
            title="Direktori 45 Pimpinan & Anggota DPRD Sulawesi Barat"
          >
            <Users className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">45 DPRD</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded-md font-bold border border-emerald-500/30">
              AKD
            </span>
          </button>

          {/* Button Pejabat Pemprov Sulbar 2026 Directory */}
          {onOpenPejabatPemprov && (
            <button
              onClick={onOpenPejabatPemprov}
              className="bg-slate-900/90 hover:bg-amber-950/80 text-amber-300 border border-amber-700/60 hover:border-amber-500/80 text-xs px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-amber-950/40 active:scale-95 group"
              title="Database Pimpinan & Kepala OPD Pemprov Sulawesi Barat 2026"
            >
              <Building2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Pejabat Pemprov</span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded-md font-bold border border-amber-500/30">
                2026
              </span>
            </button>
          )}

          {/* Supabase DB Management Modal Trigger */}
          {onOpenSupabaseModal && (
            <button
              onClick={onOpenSupabaseModal}
              className="bg-slate-900/90 hover:bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 text-xs px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 active:scale-95 group"
              title="Kelola & Pantau Database Supabase PostgreSQL"
            >
              <Database className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-semibold hidden sm:inline">Supabase DB</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                PG17
              </span>
            </button>
          )}

          {/* Notification Bell Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700/80 hover:border-amber-500/50 transition-all duration-200 flex items-center gap-2 shadow-lg active:scale-95 group"
          >
            <Bell className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline font-medium">Notifikasi</span>
            {unreadNotifCount > 0 ? (
              <span className="bg-gradient-to-r from-red-600 to-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse shadow-md shadow-red-900/50">
                {unreadNotifCount}
              </span>
            ) : (
              <span className="bg-slate-950 text-slate-400 text-[10px] px-1.5 py-0.5 rounded-md font-mono">
                0
              </span>
            )}
          </button>

          {/* Git Deploy Trigger */}
          {onOpenGitDeploy && (
            <button
              onClick={onOpenGitDeploy}
              className="bg-slate-900/90 hover:bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 hover:border-indigo-500/80 text-xs px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-indigo-950/40 active:scale-95 group"
              title="Deploy Otomatis ke GitHub (--Parlemen-AI)"
            >
              <GitBranch className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Deploy GitHub</span>
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-1.5 py-0.5 rounded-md font-bold border border-indigo-500/30">
                main
              </span>
            </button>
          )}

          {/* Buku Panduan & Manual E-Book Trigger */}
          {onOpenBukuPanduan && (
            <button
              onClick={onOpenBukuPanduan}
              className="bg-slate-900/90 hover:bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 text-xs px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 active:scale-95 group cursor-pointer"
              title="Buku Panduan & Manual E-Book Aplikasi (Format PDF & Baca Interaktif)"
            >
              <BookOpen className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Buku Panduan</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded-md font-bold border border-emerald-500/30">
                PDF
              </span>
            </button>
          )}

          {/* AI Core Engine Drawer Trigger */}
          <button
            onClick={onOpenAiStudio}
            className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950/60 transition-all duration-300 flex items-center justify-center gap-2 border border-emerald-400/40 active:scale-95 hover:shadow-emerald-500/20"
          >
            <Sparkles className="w-4 h-4 text-emerald-200 animate-spin" style={{ animationDuration: '4s' }} />
            <span>AI Core Engine</span>
          </button>

          {/* Active User Account & Logout Menu */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`bg-slate-900/95 hover:bg-slate-800 text-slate-200 text-xs px-3 py-2 rounded-xl border transition-all duration-200 flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer ${
                  currentUser.role === 'admin'
                    ? 'border-emerald-500/50 hover:border-emerald-400'
                    : currentUser.role === 'kabag'
                    ? 'border-amber-500/50 hover:border-amber-400'
                    : 'border-blue-500/50 hover:border-blue-400'
                }`}
                title={`Masuk sebagai: ${currentUser.fullName} (${currentUser.role})`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                    currentUser.role === 'admin'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : currentUser.role === 'kabag'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }`}
                >
                  {currentUser.role === 'admin' ? 'A' : currentUser.role === 'kabag' ? 'K' : 'O'}
                </div>

                <div className="text-left hidden sm:block">
                  <div className="font-bold text-white leading-tight capitalize">
                    {currentUser.username}
                  </div>
                  <div
                    className={`text-[9px] font-semibold uppercase leading-tight ${
                      currentUser.role === 'admin'
                        ? 'text-emerald-400'
                        : currentUser.role === 'kabag'
                        ? 'text-amber-400'
                        : 'text-blue-400'
                    }`}
                  >
                    Level {currentUser.levelAkses}: {currentUser.role}
                  </div>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Menu Popover */}
              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/80 z-50 p-4 backdrop-blur-xl animate-fadeIn">
                    <div className="pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                            currentUser.role === 'admin'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                              : currentUser.role === 'kabag'
                              ? 'bg-amber-950 text-amber-300 border border-amber-700/60'
                              : 'bg-blue-950 text-blue-300 border border-blue-700/60'
                          }`}
                        >
                          {currentUser.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-white truncate">
                            {currentUser.fullName}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {currentUser.jabatan}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
                        <span className="text-slate-400 font-medium">Tingkat Otoritas:</span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            currentUser.role === 'admin'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : currentUser.role === 'kabag'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}
                        >
                          Level {currentUser.levelAkses} • {currentUser.role.toUpperCase()}
                        </span>
                      </div>

                      {currentUser.nip && (
                        <p className="mt-2 text-[10px] text-slate-500 font-mono">
                          NIP: {currentUser.nip}
                        </p>
                      )}
                    </div>

                    <div className="pt-3">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-500/40 hover:border-rose-400 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm group"
                      >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span>Keluar / Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}


        </div>
      </div>

      {/* Navigation Pillar Tabs */}
      <div className="bg-slate-950/80 backdrop-blur-md border-t border-slate-800/80 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-1.5 scrollbar-none">
          <button
            onClick={() => setActivePillar('persidangan')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 whitespace-nowrap ${
              activePillar === 'persidangan'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-950/50 glow-emerald'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
            }`}
          >
            <FileText className={`w-4 h-4 ${activePillar === 'persidangan' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>Pilar 1: Persidangan & Legislasi</span>
            <span className="ml-1 px-2 py-0.5 text-[10px] bg-emerald-950/80 text-emerald-300 rounded-md font-bold border border-emerald-700/50">
              Core
            </span>
          </button>

          <button
            onClick={() => setActivePillar('pimpinan')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 whitespace-nowrap ${
              activePillar === 'pimpinan'
                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/50 shadow-md shadow-blue-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
            }`}
          >
            <UserCheck className={`w-4 h-4 ${activePillar === 'pimpinan' ? 'text-blue-400' : 'text-slate-400'}`} />
            <span>Pilar 2: Fasilitasi Pimpinan</span>
            <span className="ml-1 px-2 py-0.5 text-[10px] bg-blue-950/80 text-blue-300 rounded-md font-bold border border-blue-700/50">
              Executive
            </span>
          </button>

          <button
            onClick={() => setActivePillar('humas')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 whitespace-nowrap ${
              activePillar === 'humas'
                ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/50 shadow-md shadow-purple-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
            }`}
          >
            <Megaphone className={`w-4 h-4 ${activePillar === 'humas' ? 'text-purple-400' : 'text-slate-400'}`} />
            <span>Pilar 3: Humas & Protokol</span>
            <span className="ml-1 px-2 py-0.5 text-[10px] bg-purple-950/80 text-purple-300 rounded-md font-bold border border-purple-700/50">
              Kehumasan
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
