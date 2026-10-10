import React, { useState } from 'react';
import {
  NotificationItem,
  NotificationPreferences,
  UserRole,
  NotificationType,
  PillarType,
} from '../types';
import {
  Bell,
  CheckCheck,
  Settings,
  Calendar,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Send,
  Mail,
  MessageSquare,
  UserCheck,
  Building2,
  Sliders,
  Check,
  Sparkles,
  X,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  preferences: NotificationPreferences;
  onUpdatePreferences: (newPrefs: NotificationPreferences) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSimulateNotification: (notif: NotificationItem) => void;
  onNavigateToDocument: (pillar: PillarType, docId?: string, docType?: string) => void;
}

export const NotificationCenterModal: React.FC<Props> = ({
  isOpen,
  onClose,
  notifications,
  preferences,
  onUpdatePreferences,
  onMarkAsRead,
  onMarkAllAsRead,
  onSimulateNotification,
  onNavigateToDocument,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'preferences' | 'simulate'>('list');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Simulation Form State
  const [simType, setSimType] = useState<NotificationType>('JADWAL_RAPAT');
  const [simTitle, setSimTitle] = useState('');
  const [simMessage, setSimMessage] = useState('');
  const [simRole, setSimRole] = useState<UserRole | 'SEMUA'>('Pimpinan DPRD');
  const [simDocNumber, setSimDocNumber] = useState('');

  if (!isOpen) return null;

  // Filter notifications based on role & preferences
  const visibleNotifications = notifications.filter((notif) => {
    // Role filter
    const matchesRole =
      notif.targetRole === 'SEMUA' ||
      notif.targetRole === preferences.role ||
      (preferences.role.startsWith('OPD Terkait') && notif.targetRole.startsWith('OPD Terkait'));

    if (!matchesRole) return false;

    // Type preferences filter
    if (notif.type === 'JADWAL_RAPAT' && !preferences.notifyJadwalRapat) return false;
    if (notif.type === 'TENGGAT_RDP' && !preferences.notifyTenggatRdp) return false;
    if (notif.type === 'PERUBAHAN_STATUS_RDP' && !preferences.notifyPerubahanStatusRdp) return false;

    // Sub-filter by type in UI tab
    if (filterType !== 'ALL' && notif.type !== filterType) return false;

    return true;
  });

  const unreadCount = visibleNotifications.filter((n) => !n.isRead).length;

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = simTitle || (
      simType === 'JADWAL_RAPAT'
        ? 'Undangan Rapat Paripurna Baru'
        : simType === 'TENGGAT_RDP'
        ? 'Peringatan SLA Rekomendasi RDP'
        : 'Update Status Tindak Lanjut OPD'
    );

    const message = simMessage || (
      simType === 'JADWAL_RAPAT'
        ? 'Rapat Dengar Pendapat gabungan Komisi dan OPD terkait diselenggarakan besok jam 09.00 WITA.'
        : simType === 'TENGGAT_RDP'
        ? 'Rekomendasi RDP mendekati tenggat SLA 3 hari kerja. Mohon segera unggah bukti dokumen.'
        : 'Status rekomendasi RDP diperbarui menjadi "Perlu Diverifikasi" oleh admin Sekretariat.'
    );

    const newNotif: NotificationItem = {
      id: `NOTIF-SIM-${Date.now()}`,
      type: simType,
      title,
      message,
      timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WITA',
      targetRole: simRole,
      isRead: false,
      targetPillar: simType === 'JADWAL_RAPAT' ? 'pimpinan' : 'persidangan',
      meta: {
        nomorDokumen: simDocNumber || 'RDP-SIM-2026/009',
        opdName: preferences.role.includes('OPD') ? preferences.role : 'Dinas PUPR Sulbar',
      },
    };

    onSimulateNotification(newNotif);
    setSimTitle('');
    setSimMessage('');
    setSimDocNumber('');
    setActiveTab('list');
    alert('Notifikasi simulasi baru berhasil dikirimkan!');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Sistem Notifikasi Cerdas E-Parlemen</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {unreadCount} Baru
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Notifikasi Jadwal, Tenggat RDP & Status Berdasarkan Peran & Preferensi User
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

        {/* Navigation Tabs */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === 'list'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Notifikasi Saya</span>
              {unreadCount > 0 && (
                <span className="bg-slate-950 text-emerald-400 px-1.5 py-0.2 rounded-full text-[10px]">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === 'preferences'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Preferensi & Peran ({preferences.role.split(' ')[0]})</span>
            </button>

            <button
              onClick={() => setActiveTab('simulate')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === 'simulate'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulasi Alert</span>
            </button>
          </div>

          {activeTab === 'list' && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium whitespace-nowrap"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tandai Semua Dibaca</span>
            </button>
          )}
        </div>

        {/* Tab Content Container */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: NOTIFICATION LIST */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {/* Filter Pills */}
              <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1">
                <span className="text-slate-400 font-medium">Filter Kategori:</span>
                <button
                  onClick={() => setFilterType('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                    filterType === 'ALL'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  Semua ({visibleNotifications.length})
                </button>
                <button
                  onClick={() => setFilterType('JADWAL_RAPAT')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                    filterType === 'JADWAL_RAPAT'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  1. Jadwal Rapat
                </button>
                <button
                  onClick={() => setFilterType('TENGGAT_RDP')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                    filterType === 'TENGGAT_RDP'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  2. Tenggat RDP
                </button>
                <button
                  onClick={() => setFilterType('PERUBAHAN_STATUS_RDP')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                    filterType === 'PERUBAHAN_STATUS_RDP'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  3. Status RDP
                </button>
              </div>

              {/* List */}
              {visibleNotifications.length > 0 ? (
                <div className="space-y-3">
                  {visibleNotifications.map((notif) => {
                    const isJadwal = notif.type === 'JADWAL_RAPAT';
                    const isTenggat = notif.type === 'TENGGAT_RDP';
                    const isStatus = notif.type === 'PERUBAHAN_STATUS_RDP';

                    return (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-xl border text-xs space-y-2 transition relative ${
                          !notif.isRead
                            ? 'bg-slate-950 border-emerald-500/40 shadow-md ring-1 ring-emerald-500/20'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                                isJadwal
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : isTenggat
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              }`}
                            >
                              {isJadwal && <Calendar className="w-3.5 h-3.5" />}
                              {isTenggat && <AlertTriangle className="w-3.5 h-3.5" />}
                              {isStatus && <RefreshCw className="w-3.5 h-3.5" />}
                              <span>
                                {isJadwal
                                  ? 'Jadwal Rapat'
                                  : isTenggat
                                  ? 'Tenggat RDP'
                                  : 'Perubahan Status'}
                              </span>
                            </span>

                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            )}
                          </div>

                          <span className="text-[10px] text-slate-500 font-mono">
                            {notif.timestamp}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-sm text-slate-100">{notif.title}</h4>
                          <p className="text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
                        </div>

                        {notif.meta && (
                          <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2.5 text-[11px] text-slate-400 flex flex-wrap gap-3">
                            {notif.meta.nomorDokumen && (
                              <div>
                                <span className="text-slate-500">No. Dok: </span>
                                <span className="text-emerald-400 font-mono font-semibold">
                                  {notif.meta.nomorDokumen}
                                </span>
                              </div>
                            )}
                            {notif.meta.tenggatWaktu && (
                              <div>
                                <span className="text-slate-500">Tenggat: </span>
                                <span className="text-amber-300 font-semibold">
                                  {notif.meta.tenggatWaktu}
                                </span>
                              </div>
                            )}
                            {notif.meta.opdName && (
                              <div>
                                <span className="text-slate-500">OPD: </span>
                                <span className="text-slate-200">{notif.meta.opdName}</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                          <span className="text-slate-500">
                            Penerima: <span className="text-slate-300">{notif.targetRole}</span>
                          </span>

                          <div className="flex items-center gap-3">
                            {!notif.isRead && (
                              <button
                                onClick={() => onMarkAsRead(notif.id)}
                                className="text-slate-400 hover:text-emerald-400 transition"
                              >
                                Tandai dibaca
                              </button>
                            )}

                            {notif.targetPillar && (
                              <button
                                onClick={() => {
                                  onMarkAsRead(notif.id);
                                  onNavigateToDocument(
                                    notif.targetPillar!,
                                    notif.targetDocId,
                                    notif.targetDocType
                                  );
                                  onClose();
                                }}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition"
                              >
                                <span>Buka Agenda/Dokumen</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-slate-950 p-8 rounded-xl text-center text-slate-500 text-xs">
                  Tidak ada notifikasi aktif untuk peran {preferences.role} dan filter pilihan saat ini.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PREFERENCES & ROLE CONFIG */}
          {activeTab === 'preferences' && (
            <div className="space-y-6 text-xs">
              {/* Role Selection */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <UserCheck className="w-4 h-4" />
                  <span>1. Pilih Peran Anda dalam Sistem E-Parlemen</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Notifikasi akan disesuaikan secara otomatis sesuai kewenangan peran Anda di Sekretariat DPRD / Pemprov Sulbar.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Pimpinan DPRD',
                    'Sekretariat DPRD',
                    'OPD Terkait (Dinas PUPR)',
                    'OPD Terkait (Dinas Pendidikan)',
                    'OPD Terkait (Diskominfo)',
                    'OPD Terkait (Bappeda)',
                  ].map((role) => (
                    <button
                      key={role}
                      onClick={() => onUpdatePreferences({ ...preferences, role: role as UserRole })}
                      className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                        preferences.role === role
                          ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{role}</span>
                      {preferences.role === role && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notification Category Toggles */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                  <Bell className="w-4 h-4" />
                  <span>2. Jenis Notifikasi Cerdas yang Aktif</span>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-200 block">
                        Jadwal Rapat & Agenda Mendatang
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Termasuk tautan bahan rapat, rundown, dan risalah terkait
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.notifyJadwalRapat}
                      onChange={(e) =>
                        onUpdatePreferences({ ...preferences, notifyJadwalRapat: e.target.checked })
                      }
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-200 block">
                        Peringatan Tenggat Waktu RDP (SLA OPD)
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Peringatan otomatis saat rekomendasi RDP mendekati batas hari kerja
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.notifyTenggatRdp}
                      onChange={(e) =>
                        onUpdatePreferences({ ...preferences, notifyTenggatRdp: e.target.checked })
                      }
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                    <div>
                      <span className="font-semibold text-slate-200 block">
                        Perubahan Status Rekomendasi RDP
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Pemberitahuan saat OPD mengunggah bukti tindak lanjut atau mengubah status
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.notifyPerubahanStatusRdp}
                      onChange={(e) =>
                        onUpdatePreferences({ ...preferences, notifyPerubahanStatusRdp: e.target.checked })
                      }
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                  </label>
                </div>
              </div>

              {/* Delivery Channels & Lead Days */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Sliders className="w-4 h-4" />
                  <span>3. Kanal Pengiriman & Ambang Batas Hari (Threshold)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.enableInApp}
                      onChange={(e) =>
                        onUpdatePreferences({ ...preferences, enableInApp: e.target.checked })
                      }
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                    <Bell className="w-3.5 h-3.5 text-emerald-400" />
                    <span>In-App Notification</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.enableEmail}
                      onChange={(e) =>
                        onUpdatePreferences({ ...preferences, enableEmail: e.target.checked })
                      }
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>Email Blast Alert</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.enableWhatsapp}
                      onChange={(e) =>
                        onUpdatePreferences({ ...preferences, enableWhatsapp: e.target.checked })
                      }
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Gateway</span>
                  </label>
                </div>

                <div className="pt-2">
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Ambang Batas Peringatan Tenggat RDP (Lead Days)
                  </label>
                  <select
                    value={preferences.alertLeadDays}
                    onChange={(e) =>
                      onUpdatePreferences({ ...preferences, alertLeadDays: Number(e.target.value) })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value={3}>3 Hari Sebelum Tenggat Waktu (Sangat Mendesak)</option>
                    <option value={5}>5 Hari Sebelum Tenggat Waktu (Standar SLA)</option>
                    <option value={7}>7 Hari Sebelum Tenggat Waktu (Peringatan Dini)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SIMULATE NOTIFICATION */}
          {activeTab === 'simulate' && (
            <form onSubmit={handleSimulateSubmit} className="space-y-4 text-xs">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
                <span className="text-emerald-400 font-bold uppercase text-[10px]">
                  Simulasi Pemicu Notifikasi Cerdas
                </span>
                <p className="text-slate-300">
                  Uji coba pengiriman notifikasi baru untuk memverifikasi fungsionalitas pengiriman otomatis kepada pengguna berdasarkan peran.
                </p>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Jenis Notifikasi</label>
                <select
                  value={simType}
                  onChange={(e: any) => setSimType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="JADWAL_RAPAT">1. Jadwal Rapat yang Akan Datang</option>
                  <option value="TENGGAT_RDP">2. Rekomendasi RDP Mendekati Tenggat Waktu</option>
                  <option value="PERUBAHAN_STATUS_RDP">3. Perubahan Status Rekomendasi RDP</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Target Peran Penerima</label>
                  <select
                    value={simRole}
                    onChange={(e: any) => setSimRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="SEMUA">Semua Peran (Publik / Pimpinan & OPD)</option>
                    <option value="Pimpinan DPRD">Pimpinan DPRD</option>
                    <option value="Sekretariat DPRD">Sekretariat DPRD</option>
                    <option value="OPD Terkait (Dinas PUPR)">OPD Terkait (Dinas PUPR)</option>
                    <option value="OPD Terkait (Dinas Pendidikan)">OPD Terkait (Dinas Pendidikan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Nomor Referensi Dokumen</label>
                  <input
                    type="text"
                    placeholder="misal: RDP-K3-014/2026"
                    value={simDocNumber}
                    onChange={(e) => setSimDocNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Judul Notifikasi</label>
                <input
                  type="text"
                  placeholder="misal: Peringatan Evaluasi Tanggap Darurat Jalan"
                  value={simTitle}
                  onChange={(e) => setSimTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Pesan Pesan Notifikasi</label>
                <textarea
                  rows={3}
                  placeholder="Ketikkan isi rincian instruksi atau pengumuman rapat..."
                  value={simMessage}
                  onChange={(e) => setSimMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl shadow transition flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Notifikasi Simulasi</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
