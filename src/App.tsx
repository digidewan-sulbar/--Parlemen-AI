import React, { useState, useEffect } from 'react';
import {
  PillarType,
  RisalahItem,
  RdpRecommendationItem,
  ExecutiveSummaryItem,
  AgendaPimpinanItem,
  PressReleaseItem,
  ProtocolBriefingSheetItem,
  RanperdaItem,
  StatusRekomendasi,
  NotificationItem,
  NotificationPreferences,
  UserRole,
  AnggotaDprdItem,
} from './types';
import {
  INITIAL_RANPERDA,
  INITIAL_RISALAH,
  INITIAL_RDP_RECOMMENDATIONS,
  INITIAL_EXECUTIVE_SUMMARIES,
  INITIAL_AGENDA_PIMPINAN,
  INITIAL_PRESS_RELEASES,
  INITIAL_PROTOCOL_SHEETS,
  INITIAL_EVIDENCES,
  INITIAL_NOTIFICATIONS,
  DEFAULT_NOTIFICATION_PREFERENCES,
  INITIAL_ANGGOTA_DPRD,
} from './data/initialData';

import { HeaderNavbar } from './components/HeaderNavbar';
import { PillarPersidangan } from './components/PillarPersidangan';
import { PillarPimpinan } from './components/PillarPimpinan';
import { PillarHumas } from './components/PillarHumas';
import { PillarSpbeBlueprint } from './components/PillarSpbeBlueprint';
import { AiStudioDrawer } from './components/AiStudioDrawer';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { SmartSearchModal } from './components/SmartSearchModal';
import { DprdDirectoryModal } from './components/DprdDirectoryModal';
import { PejabatPemprovModal } from './components/PejabatPemprovModal';
import { SupabaseDbModal } from './components/SupabaseDbModal';
import { GitDeployModal } from './components/GitDeployModal';
import {
  apiGetRisalah,
  apiSaveRisalah,
  apiDeleteRisalah,
  apiGetRanperda,
  apiSaveRanperda,
  apiDeleteRanperda,
  apiGetRdp,
  apiSaveRdp,
  apiDeleteRdp,
  apiGetAgenda,
  apiSaveAgenda,
  apiDeleteAgenda,
  apiGetAnggota,
  apiSaveAnggota,
  apiDeleteAnggota,
  apiGetNotifications,
  apiSaveNotification,
  apiMarkNotificationRead,
  apiMarkAllNotificationsRead,
} from './utils/supabaseApi';

export default function App() {
  const [activePillar, setActivePillar] = useState<PillarType>('persidangan');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState<boolean>(false);
  const [isSmartSearchOpen, setIsSmartSearchOpen] = useState<boolean>(false);
  const [isDprdModalOpen, setIsDprdModalOpen] = useState<boolean>(false);
  const [isPejabatPemprovOpen, setIsPejabatPemprovOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [isGitDeployOpen, setIsGitDeployOpen] = useState<boolean>(false);

  // App Master Data States
  const [members, setMembers] = useState<AnggotaDprdItem[]>(INITIAL_ANGGOTA_DPRD);
  const [ranperdaList, setRanperdaList] = useState<RanperdaItem[]>(INITIAL_RANPERDA);
  const [risalahList, setRisalahList] = useState<RisalahItem[]>(INITIAL_RISALAH);
  const [rdpRecommendations, setRdpRecommendations] = useState<RdpRecommendationItem[]>(INITIAL_RDP_RECOMMENDATIONS);
  const [executiveSummaries, setExecutiveSummaries] = useState<ExecutiveSummaryItem[]>(INITIAL_EXECUTIVE_SUMMARIES);
  const [agendaPimpinanList, setAgendaPimpinanList] = useState<AgendaPimpinanItem[]>(INITIAL_AGENDA_PIMPINAN);
  const [pressReleases, setPressReleases] = useState<PressReleaseItem[]>(INITIAL_PRESS_RELEASES);
  const [protocolSheets, setProtocolSheets] = useState<ProtocolBriefingSheetItem[]>(INITIAL_PROTOCOL_SHEETS);
  const [evidences, setEvidences] = useState(INITIAL_EVIDENCES);

  // Smart Notification & User Preferences State
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [notifPreferences, setNotifPreferences] = useState<NotificationPreferences>(
    DEFAULT_NOTIFICATION_PREFERENCES
  );

  // Ctrl+K Shortcut for Smart Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSmartSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch Live Data from Supabase PostgreSQL on Mount
  const loadSupabaseData = async () => {
    try {
      const [rData, rpData, rdpData, agData, memData, notifData] = await Promise.all([
        apiGetRisalah(),
        apiGetRanperda(),
        apiGetRdp(),
        apiGetAgenda(),
        apiGetAnggota(),
        apiGetNotifications(),
      ]);

      if (rData && rData.length > 0) setRisalahList(rData);
      if (rpData && rpData.length > 0) setRanperdaList(rpData);
      if (rdpData && rdpData.length > 0) setRdpRecommendations(rdpData);
      if (agData && agData.length > 0) setAgendaPimpinanList(agData);
      if (memData && memData.length > 0) setMembers(memData);
      if (notifData && notifData.length > 0) setNotifications(notifData);
    } catch (err) {
      console.warn('Gagal memuat data dari Supabase, menggunakan data cache lokal:', err);
    }
  };

  useEffect(() => {
    loadSupabaseData();
  }, []);

  // Handlers for Notifications
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    apiMarkNotificationRead(id).catch(console.error);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    apiMarkAllNotificationsRead().catch(console.error);
  };

  const handleSimulateNotification = (newNotif: NotificationItem) => {
    setNotifications((prev) => [newNotif, ...prev]);
    apiSaveNotification(newNotif).catch(console.error);
  };

  const handleNavigateToDocument = (pillar: PillarType, docId?: string, docType?: string) => {
    setActivePillar(pillar);
  };

  // CRUD Handlers for Anggota DPRD
  const handleAddMember = (newMember: AnggotaDprdItem) => {
    setMembers((prev) => [newMember, ...prev]);
    apiSaveAnggota(newMember).catch(console.error);
  };

  const handleUpdateMember = (updatedMember: AnggotaDprdItem) => {
    setMembers((prev) => prev.map((m) => (m.id === updatedMember.id ? updatedMember : m)));
    apiSaveAnggota(updatedMember).catch(console.error);
  };

  const handleDeleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    apiDeleteAnggota(id).catch(console.error);
  };

  // CRUD Handlers for Ranperda
  const handleAddRanperda = (newRanperda: RanperdaItem) => {
    setRanperdaList((prev) => [newRanperda, ...prev]);
    apiSaveRanperda(newRanperda).catch(console.error);
  };

  const handleUpdateRanperda = (updated: RanperdaItem) => {
    setRanperdaList((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    apiSaveRanperda(updated).catch(console.error);
  };

  const handleDeleteRanperda = (id: string) => {
    setRanperdaList((prev) => prev.filter((r) => r.id !== id));
    apiDeleteRanperda(id).catch(console.error);
  };

  // CRUD Handlers for Risalah Rapat
  const handleAddRisalah = (newRisalah: RisalahItem) => {
    setRisalahList((prev) => [newRisalah, ...prev]);
    apiSaveRisalah(newRisalah).catch(console.error);
  };

  const handleUpdateRisalah = (updated: RisalahItem) => {
    setRisalahList((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    apiSaveRisalah(updated).catch(console.error);
  };

  const handleDeleteRisalah = (id: string) => {
    setRisalahList((prev) => prev.filter((r) => r.id !== id));
    apiDeleteRisalah(id).catch(console.error);
  };

  // CRUD Handlers for RDP Recommendations
  const handleAddRdp = (newRdp: RdpRecommendationItem) => {
    setRdpRecommendations((prev) => [newRdp, ...prev]);
    apiSaveRdp(newRdp).catch(console.error);
  };

  const handleUpdateRdp = (updated: RdpRecommendationItem) => {
    setRdpRecommendations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    apiSaveRdp(updated).catch(console.error);
  };

  const handleDeleteRdp = (id: string) => {
    setRdpRecommendations((prev) => prev.filter((r) => r.id !== id));
    apiDeleteRdp(id).catch(console.error);
  };

  const handleUpdateRdpStatus = (
    id: string,
    newStatus: StatusRekomendasi,
    proofText?: string,
    proofUrl?: string
  ) => {
    setRdpRecommendations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const oldStatus = item.status;
          const updated = {
            ...item,
            status: newStatus,
            buktiTindakLanjut: proofText
              ? {
                  keterangan: proofText,
                  fileUrl: proofUrl || '/docs/Bukti_OPD.pdf',
                  tanggalUpload: new Date().toISOString().split('T')[0],
                }
              : item.buktiTindakLanjut,
          };

          // Trigger automated notification on status change
          const statusNotif: NotificationItem = {
            id: `NOTIF-AUTO-${Date.now()}`,
            type: 'PERUBAHAN_STATUS_RDP',
            title: `Perubahan Status RDP: ${item.opdPenanggungJawab}`,
            message: `Status Rekomendasi No. ${item.nomorRdp} diperbarui dari "${oldStatus}" menjadi "${newStatus}".`,
            timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WITA',
            targetRole: 'Pimpinan DPRD',
            isRead: false,
            targetPillar: 'persidangan',
            targetDocId: item.id,
            targetDocType: 'rdp',
            meta: {
              nomorDokumen: item.nomorRdp,
              statusAwal: oldStatus,
              statusBaru: newStatus,
              opdName: item.opdPenanggungJawab,
            },
          };
          setNotifications((nPrev) => [statusNotif, ...nPrev]);
          apiSaveNotification(statusNotif).catch(console.error);
          apiSaveRdp(updated).catch(console.error);

          return updated;
        }
        return item;
      })
    );
  };

  // CRUD Handlers for Executive Summaries
  const handleAddExecutiveSummary = (newExec: ExecutiveSummaryItem) => {
    setExecutiveSummaries((prev) => [newExec, ...prev]);
  };

  const handleUpdateExecutiveSummary = (updated: ExecutiveSummaryItem) => {
    setExecutiveSummaries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleDeleteExecutiveSummary = (id: string) => {
    setExecutiveSummaries((prev) => prev.filter((e) => e.id !== id));
  };

  // CRUD Handlers for Agenda Pimpinan
  const handleAddAgendaPimpinan = (newAgenda: AgendaPimpinanItem) => {
    setAgendaPimpinanList((prev) => [newAgenda, ...prev]);
    apiSaveAgenda(newAgenda).catch(console.error);
  };

  const handleUpdateAgendaPimpinan = (updated: AgendaPimpinanItem) => {
    setAgendaPimpinanList((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    apiSaveAgenda(updated).catch(console.error);
  };

  const handleDeleteAgendaPimpinan = (id: string) => {
    setAgendaPimpinanList((prev) => prev.filter((a) => a.id !== id));
    apiDeleteAgenda(id).catch(console.error);
  };

  // CRUD Handlers for Humas Press Release
  const handleAddPressRelease = (newPress: PressReleaseItem) => {
    setPressReleases((prev) => [newPress, ...prev]);
  };

  const handleUpdatePressRelease = (updated: PressReleaseItem) => {
    setPressReleases((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeletePressRelease = (id: string) => {
    setPressReleases((prev) => prev.filter((p) => p.id !== id));
  };

  // CRUD Handlers for Protocol Briefing
  const handleAddProtocolSheet = (newProto: ProtocolBriefingSheetItem) => {
    setProtocolSheets((prev) => [newProto, ...prev]);
  };

  const handleUpdateProtocolSheet = (updated: ProtocolBriefingSheetItem) => {
    setProtocolSheets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProtocolSheet = (id: string) => {
    setProtocolSheets((prev) => prev.filter((p) => p.id !== id));
  };

  const handleApplyAiResult = (data: {
    risalah?: RisalahItem;
    rekomendasiRdp?: RdpRecommendationItem[];
    executiveSummary?: ExecutiveSummaryItem;
    pressRelease?: PressReleaseItem;
    protocolBriefing?: ProtocolBriefingSheetItem;
  }) => {
    if (data.risalah) {
      setRisalahList((prev) => [data.risalah!, ...prev]);
    }
    if (data.rekomendasiRdp && data.rekomendasiRdp.length > 0) {
      setRdpRecommendations((prev) => [...data.rekomendasiRdp!, ...prev]);
    }
    if (data.executiveSummary) {
      setExecutiveSummaries((prev) => [data.executiveSummary!, ...prev]);
    }
    if (data.pressRelease) {
      setPressReleases((prev) => [data.pressRelease!, ...prev]);
    }
    if (data.protocolBriefing) {
      setProtocolSheets((prev) => [data.protocolBriefing!, ...prev]);
    }
  };

  const unreadNotifCount = notifications.filter(
    (n) =>
      !n.isRead &&
      (n.targetRole === 'SEMUA' ||
        n.targetRole === notifPreferences.role ||
        (notifPreferences.role.startsWith('OPD Terkait') && n.targetRole.startsWith('OPD Terkait')))
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden bg-grid-pattern">
      {/* Background Radial Glow Effects */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-600/15 via-teal-600/5 to-transparent blur-3xl rounded-full"></div>
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-600/10 blur-3xl rounded-full"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Header & Pillar Navigation */}
        <HeaderNavbar
          activePillar={activePillar}
          setActivePillar={setActivePillar}
          onOpenAiStudio={() => setIsAiDrawerOpen(true)}
          unreadNotifCount={unreadNotifCount}
          onOpenNotifications={() => setIsNotifModalOpen(true)}
          onOpenSmartSearch={() => setIsSmartSearchOpen(true)}
          onOpenDprdDirectory={() => setIsDprdModalOpen(true)}
          onOpenPejabatPemprov={() => setIsPejabatPemprovOpen(true)}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          onOpenGitDeploy={() => setIsGitDeployOpen(true)}
          userRole={notifPreferences.role}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
          {activePillar === 'persidangan' && (
            <PillarPersidangan
              ranperdaList={ranperdaList}
              risalahList={risalahList}
              rdpRecommendations={rdpRecommendations}
              onAddRisalah={handleAddRisalah}
              onUpdateRisalah={handleUpdateRisalah}
              onDeleteRisalah={handleDeleteRisalah}
              onAddRanperda={handleAddRanperda}
              onUpdateRanperda={handleUpdateRanperda}
              onDeleteRanperda={handleDeleteRanperda}
              onAddRdp={handleAddRdp}
              onUpdateRdp={handleUpdateRdp}
              onDeleteRdp={handleDeleteRdp}
              onUpdateRdpStatus={handleUpdateRdpStatus}
              onOpenAiStudio={() => setIsAiDrawerOpen(true)}
            />
          )}

          {activePillar === 'pimpinan' && (
            <PillarPimpinan
              executiveSummaries={executiveSummaries}
              agendaPimpinanList={agendaPimpinanList}
              ranperdaList={ranperdaList}
              rdpRecommendations={rdpRecommendations}
              risalahList={risalahList}
              onAddExecutiveSummary={handleAddExecutiveSummary}
              onUpdateExecutiveSummary={handleUpdateExecutiveSummary}
              onDeleteExecutiveSummary={handleDeleteExecutiveSummary}
              onAddAgendaPimpinan={handleAddAgendaPimpinan}
              onUpdateAgendaPimpinan={handleUpdateAgendaPimpinan}
              onDeleteAgendaPimpinan={handleDeleteAgendaPimpinan}
              onOpenAiStudio={() => setIsAiDrawerOpen(true)}
            />
          )}

          {activePillar === 'humas' && (
            <PillarHumas
              pressReleases={pressReleases}
              protocolSheets={protocolSheets}
              onAddPressRelease={handleAddPressRelease}
              onUpdatePressRelease={handleUpdatePressRelease}
              onDeletePressRelease={handleDeletePressRelease}
              onAddProtocolSheet={handleAddProtocolSheet}
              onUpdateProtocolSheet={handleUpdateProtocolSheet}
              onDeleteProtocolSheet={handleDeleteProtocolSheet}
              onOpenAiStudio={() => setIsAiDrawerOpen(true)}
            />
          )}

          {activePillar === 'spbe-blueprint' && (
            <PillarSpbeBlueprint evidences={evidences} />
          )}
        </main>

        {/* Interactive AI Core Engine Drawer */}
        <AiStudioDrawer
          isOpen={isAiDrawerOpen}
          onClose={() => setIsAiDrawerOpen(false)}
          onApplyAiResult={handleApplyAiResult}
        />

        {/* Smart Notification Center Modal */}
        <NotificationCenterModal
          isOpen={isNotifModalOpen}
          onClose={() => setIsNotifModalOpen(false)}
          notifications={notifications}
          preferences={notifPreferences}
          onUpdatePreferences={setNotifPreferences}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onSimulateNotification={handleSimulateNotification}
          onNavigateToDocument={handleNavigateToDocument}
        />

        {/* Smart Cross-Document Search Modal */}
        <SmartSearchModal
          isOpen={isSmartSearchOpen}
          onClose={() => setIsSmartSearchOpen(false)}
          risalahList={risalahList}
          rdpRecommendations={rdpRecommendations}
          pressReleases={pressReleases}
          ranperdaList={ranperdaList}
          agendaPimpinanList={agendaPimpinanList}
          onNavigateToDocument={handleNavigateToDocument}
        />

        {/* 45 Anggota DPRD Directory Modal */}
        <DprdDirectoryModal
          isOpen={isDprdModalOpen}
          onClose={() => setIsDprdModalOpen(false)}
          members={members}
          onAddMember={handleAddMember}
          onUpdateMember={handleUpdateMember}
          onDeleteMember={handleDeleteMember}
        />

        {/* Database Pimpinan & Pejabat Pemprov Sulbar 2026 Modal */}
        <PejabatPemprovModal
          isOpen={isPejabatPemprovOpen}
          onClose={() => setIsPejabatPemprovOpen(false)}
        />

        {/* Supabase PostgreSQL Database Management & Monitoring Modal */}
        <SupabaseDbModal
          isOpen={isSupabaseModalOpen}
          onClose={() => setIsSupabaseModalOpen(false)}
          onDataMutated={loadSupabaseData}
        />

        {/* Git Deployment to GitHub Modal */}
        <GitDeployModal
          isOpen={isGitDeployOpen}
          onClose={() => setIsGitDeployOpen(false)}
        />

        {/* Executive Government Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/90 backdrop-blur-md py-8 text-xs text-slate-400 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/89/Coat_of_arms_of_West_Sulawesi.svg"
                alt="Logo Sulbar"
                className="h-8 w-auto opacity-80"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="font-bold text-slate-200">
                  E-PARLEMEN PROVINSI SULAWESI BARAT © 2026
                </p>
                <p className="text-[11px] text-slate-500">
                  Sekretariat DPRD Provinsi Sulawesi Barat
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={() => setActivePillar('spbe-blueprint')}
                className={`px-3 py-1 rounded-full border text-[11px] font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activePillar === 'spbe-blueprint'
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-md shadow-amber-950'
                    : 'bg-slate-900 border-slate-800 text-amber-400 hover:border-amber-500/50 hover:bg-slate-800'
                }`}
              >
                Blueprint & Evidence PIM III
              </button>
              <span className="bg-slate-900 px-3 py-1 rounded-full border border-slate-800 text-[11px] font-medium text-emerald-400">
                PIM III Reformasi Birokrasi
              </span>
              <span className="bg-slate-900 px-3 py-1 rounded-full border border-slate-800 text-[11px] font-medium text-amber-400">
                SPBE Perpres No. 95/2018
              </span>
              <span className="bg-slate-900 px-3 py-1 rounded-full border border-slate-800 text-[11px] font-medium text-cyan-400">
                AI Core Engine v2.4
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}


