import React, { useState } from 'react';
import {
  RoleCode,
  RanperdaDetail,
  PropemperdaItem,
  DIMItem,
  RanperdaStatusCode,
  NotificationLog,
  PicContact,
  DocumentVersion,
} from './types';
import {
  E_LEGISLASI_ROLES,
  INITIAL_RANPERDA_DETAIL_LIST,
  INITIAL_PROPEMPERDA_2026,
  INITIAL_PIC_CONTACTS,
  STATUS_LABELS,
} from './data/dummyELegislasiData';

// Modals
import { MasterContactsModal } from './components/MasterContactsModal';
import { WhatsAppTriggerModal } from './components/WhatsAppTriggerModal';
import { MagicLinkLoginModal } from './components/MagicLinkLoginModal';

// Sub Views
import { DashboardKanbanView } from './views/DashboardKanbanView';
import { PropemperdaView } from './views/PropemperdaView';
import { PengajuanFormView } from './views/PengajuanFormView';
import { HarmonisasiKemenkumhamView } from './views/HarmonisasiKemenkumhamView';
import { PembahasanPansusView } from './views/PembahasanPansusView';
import { FasilitasiKemendagriView } from './views/FasilitasiKemendagriView';
import { PenetapanPengundanganView } from './views/PenetapanPengundanganView';
import { TrackingPublicView } from './views/TrackingPublicView';
import { SetwanAdminMasterControlView } from './views/SetwanAdminMasterControlView';

import {
  Kanban,
  FileSpreadsheet,
  FilePlus,
  Scale,
  Users,
  Building2,
  Globe,
  Shield,
  Bell,
  CheckCircle2,
  X,
  Layers,
  Sparkles,
  Phone,
  KeyRound,
  ShieldCheck,
  Send,
} from 'lucide-react';

export const ELegislasiMain: React.FC = () => {
  // Global States for E-Legislasi
  const [currentRole, setCurrentRole] = useState<RoleCode>('ROLE_SETWAN');
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'propemperda'
    | 'pengajuan'
    | 'harmonisasi'
    | 'pansus'
    | 'fasilitasi'
    | 'pengundangan'
    | 'tracking'
    | 'admin_control'
  >('dashboard');

  const [ranperdaList, setRanperdaList] = useState<RanperdaDetail[]>(
    INITIAL_RANPERDA_DETAIL_LIST
  );

  const [propemperdaList, setPropemperdaList] = useState<PropemperdaItem[]>(
    INITIAL_PROPEMPERDA_2026
  );

  const [picContacts, setPicContacts] = useState<PicContact[]>(INITIAL_PIC_CONTACTS);

  // Modal States
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [isMagicLinkModalOpen, setIsMagicLinkModalOpen] = useState(false);

  // WhatsApp Trigger Modal State
  const [waModalState, setWaModalState] = useState<{
    isOpen: boolean;
    ranperda?: RanperdaDetail;
    targetRole?: RoleCode;
    nextStatus?: RanperdaStatusCode;
  }>({ isOpen: false });

  // Active Notification Toast Simulation
  const [activeToast, setActiveToast] = useState<{
    title: string;
    message: string;
    type: 'WA' | 'EMAIL';
  } | null>(null);

  const triggerToast = (title: string, message: string, type: 'WA' | 'EMAIL' = 'WA') => {
    setActiveToast({ title, message, type });
    setTimeout(() => setActiveToast(null), 6000);
  };

  // Status Machine Update Handler
  const handleUpdateRanperdaStatus = (
    id: string,
    newStatus: RanperdaStatusCode,
    note: string
  ) => {
    setRanperdaList((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const stageCfg = STATUS_LABELS[newStatus];
          const newAuditLog = {
            id: `AUD-${Date.now()}`,
            timestamp: new Date().toLocaleString('id-ID'),
            userName:
              E_LEGISLASI_ROLES.find((role) => role.code === currentRole)?.name ||
              'System User',
            userRole: currentRole,
            actionName: `Status Beralih ke ${stageCfg.label}`,
            details: note,
          };

          const newNotif: NotificationLog = {
            id: `NOTIF-${Date.now()}`,
            timestamp: new Date().toLocaleString('id-ID'),
            recipient: 'PIC Pemrakarsa & Setwan Sulbar',
            channel: 'WhatsApp',
            message: `[E-LEGISLASI ALERT] Status Ranperda "${r.judulRanperda}" telah diperbarui menjadi ${stageCfg.label}. Note: ${note}`,
            status: 'Terkirim',
          };

          // Trigger Toast
          triggerToast(
            `Status Beralih: ${stageCfg.label}`,
            `[WhatsApp Alert Dikirim] ${r.judulRanperda.substring(0, 50)}...`,
            'WA'
          );

          return {
            ...r,
            statusCode: newStatus,
            auditLogs: [newAuditLog, ...r.auditLogs],
            notificationLogs: [newNotif, ...r.notificationLogs],
          };
        }
        return r;
      })
    );
  };

  // Add Document Version to Ranperda
  const handleAddDocumentToRanperda = (ranperdaId: string, newDoc: DocumentVersion) => {
    setRanperdaList((prev) =>
      prev.map((r) => {
        if (r.id === ranperdaId) {
          const updatedDocs = [newDoc, ...r.documents];
          return { ...r, documents: updatedDocs };
        }
        return r;
      })
    );
    triggerToast(
      'Dokumen Versi Baru Terunggah',
      `[Document Integrity] ${newDoc.fileName} (${newDoc.versionName}) dicatat dalam sistem versioning.`,
      'WA'
    );
  };

  // Add Ranperda Handler
  const handleAddRanperda = (data: Partial<RanperdaDetail>) => {
    const newId = `RANPERDA-2026-${String(ranperdaList.length + 1).padStart(3, '0')}`;
    const newNo = `${String(ranperdaList.length + 1).padStart(2, '0')}/RANPERDA/2026`;

    const completeItem: RanperdaDetail = {
      id: newId,
      nomorRanperda: newNo,
      judulRanperda: data.judulRanperda || 'Ranperda Baru 2026',
      tahun: 2026,
      inisiatorType: data.inisiatorType || 'EKSEKUTIF',
      inisiatorName: data.inisiatorName || 'Pemprov Sulbar',
      komisiPengampu: data.komisiPengampu || 'Komisi I',
      opdPencegah: 'Biro Hukum Setda Sulbar',
      statusCode: 'DRAFT_PROPOSED',
      deskripsiRingkas: data.deskripsiRingkas || 'Inisiatif pembentukan peraturan daerah.',
      tanggalPengajuan: new Date().toISOString().split('T')[0],
      targetSlaDays: 30,
      sisaHariSla: 30,
      statusSla: 'Sesuai SLA',
      naskahAkademikTitle: data.naskahAkademikTitle || 'NA Terlampir',
      documents: data.documents || [],
      dimList: [],
      auditLogs: data.auditLogs || [],
      notificationLogs: data.notificationLogs || [],
    };

    setRanperdaList((prev) => [completeItem, ...prev]);
    triggerToast(
      'Pengajuan Ranperda Baru',
      `[WhatsApp Alert] Ranperda ${newNo} berhasil diajukan ke Setwan & Kemenkumham.`,
      'WA'
    );
  };

  // Add Propemperda Handler
  const handleAddPropemperda = (item: PropemperdaItem) => {
    setPropemperdaList((prev) => [item, ...prev]);
    triggerToast(
      'Propemperda 2026 Diperbarui',
      `Ranperda "${item.judulRanperda.substring(0, 40)}..." telah ditambahkan ke skema Propemperda.`,
      'EMAIL'
    );
  };

  // Update DIM List Handler
  const handleUpdateDIMList = (ranperdaId: string, dimList: DIMItem[]) => {
    setRanperdaList((prev) =>
      prev.map((r) => (r.id === ranperdaId ? { ...r, dimList } : r))
    );
    triggerToast(
      'Matriks DIM Diperbarui',
      `Terdapat perubahan pada ${dimList.length} item DIM pembahasan Pansus.`,
      'WA'
    );
  };

  // Magic Link Direct Switcher
  const handleMagicLinkAccess = (role: RoleCode, ranperdaId?: string) => {
    setCurrentRole(role);
    if (role === 'ROLE_KEMENKUMHAM') {
      setActiveTab('harmonisasi');
    } else if (role === 'ROLE_KEMENDAGRI') {
      setActiveTab('fasilitasi');
    } else if (role === 'ROLE_BIRO_HUKUM') {
      setActiveTab('fasilitasi');
    } else if (role === 'ROLE_OPD') {
      setActiveTab('pengajuan');
    } else {
      setActiveTab('dashboard');
    }

    const roleName = E_LEGISLASI_ROLES.find((r) => r.code === role)?.name || role;
    triggerToast(
      `Otentikasi Magic Link Berhasil`,
      `[Single-Click Login] Anda telah masuk sebagai ${roleName} tanpa password.`,
      'WA'
    );
  };

  // WhatsApp Modal Confirm Handler
  const handleConfirmWhatsAppSend = (
    ranperdaId: string,
    nextStatus: RanperdaStatusCode,
    customMessage: string,
    recipientPic: PicContact
  ) => {
    handleUpdateRanperdaStatus(
      ranperdaId,
      nextStatus,
      `[WhatsApp Gateway Sent] Notifikasi dikirimkan ke ${recipientPic.namaPic} (${recipientPic.instansi} - ${recipientPic.whatsappNo}). Pesan: ${customMessage.substring(0, 80)}...`
    );

    triggerToast(
      `WhatsApp API Gateway Terkirim!`,
      `Pesan & Magic Link berhasil terkirim ke ${recipientPic.namaPic} (${recipientPic.whatsappNo})`,
      'WA'
    );
  };

  const activeRoleObj = E_LEGISLASI_ROLES.find((r) => r.code === currentRole);

  return (
    <div className="space-y-6">
      {/* Modals */}
      <MasterContactsModal
        isOpen={isContactsModalOpen}
        onClose={() => setIsContactsModalOpen(false)}
        contacts={picContacts}
        onUpdateContacts={(updated) => {
          setPicContacts(updated);
          triggerToast('Buku Kontak PIC Diperbarui', 'Data nomor WA PIC instansi tersimpan.', 'WA');
        }}
        onSimulateMagicLink={(role) => handleMagicLinkAccess(role)}
      />

      <MagicLinkLoginModal
        isOpen={isMagicLinkModalOpen}
        onClose={() => setIsMagicLinkModalOpen(false)}
        picContacts={picContacts}
        ranperdaList={ranperdaList}
        onSelectMagicLinkAccess={handleMagicLinkAccess}
      />

      {waModalState.isOpen && waModalState.ranperda && waModalState.targetRole && waModalState.nextStatus && (
        <WhatsAppTriggerModal
          isOpen={waModalState.isOpen}
          onClose={() => setWaModalState({ isOpen: false })}
          ranperda={waModalState.ranperda}
          targetRole={waModalState.targetRole}
          nextStatus={waModalState.nextStatus}
          picContacts={picContacts}
          onConfirmSend={handleConfirmWhatsAppSend}
        />
      )}

      {/* Toast Notification Floating Banner */}
      {activeToast && (
        <div className="fixed top-20 right-6 z-50 max-w-md bg-slate-900 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl flex items-start gap-3 animate-slide-in text-xs text-white">
          <div className="p-2 bg-emerald-950 text-emerald-400 rounded-xl flex-shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="font-extrabold text-emerald-400 flex items-center justify-between">
              <span>{activeToast.title}</span>
              <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 text-emerald-300 font-mono">
                {activeToast.type} TRIGGER
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">{activeToast.message}</p>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* RBAC Role Switcher Header & Quick Action Tools */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                E-LEGISLASI SULBAR 2026
              </span>
              <span className="text-xs text-slate-400">| Multi-Institution Workflow Engine</span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">
              Modul Sub-Sistem E-Legislasi & Tracking Ranperda
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Master Control Setwan Direct Link in Top Header */}
            <button
              onClick={() => setActiveTab('admin_control')}
              className={`px-4 py-2 text-xs font-black rounded-xl flex items-center gap-2 transition border shadow ${
                activeTab === 'admin_control'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 ring-2 ring-emerald-500/30'
                  : 'bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border-emerald-800/80'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Master Control Setwan</span>
            </button>

            {/* Active Role Badge & Selector */}
            <div className="bg-slate-950 border border-slate-800 p-1.5 rounded-xl flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400 ml-1" />
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as RoleCode)}
                className="bg-slate-900 border border-slate-700 text-xs font-bold text-emerald-400 rounded-lg px-2.5 py-1 focus:outline-none focus:border-emerald-500"
              >
                {E_LEGISLASI_ROLES.map((role) => (
                  <option key={role.code} value={role.code}>
                    {role.name} ({role.userGroup})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Role Capability Description */}
        {activeRoleObj && (
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${activeRoleObj.badgeColor}`}>
                {activeRoleObj.code}
              </span>
              <span className="truncate">{activeRoleObj.description}</span>
            </div>
            <span className="text-[10px] text-slate-500 hidden md:inline">
              Hak Akses Terverifikasi
            </span>
          </div>
        )}
      </div>

      {/* Sub-Module Navigation Menu - Structured 2-Row Grid Layout */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1 border-b border-slate-800/80 pb-2">
          <span className="flex items-center gap-1.5 text-emerald-400 uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tahapan Siklus E-Legislasi (8 Modul Alur Pembentukan Perda)</span>
          </span>
          <span className="text-slate-500 hidden sm:inline">Pilih Modul Untuk Membuka Menu</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Row 1: Perencanaan, Pengajuan, Harmonisasi */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-slate-950/80 hover:bg-slate-800 text-slate-200 border-slate-800'
            }`}
          >
            <div className={`p-2 rounded-lg flex-shrink-0 ${activeTab === 'dashboard' ? 'bg-slate-950 text-emerald-400' : 'bg-slate-900 text-emerald-400 border border-slate-800'}`}>
              <Kanban className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className={`text-[10px] font-mono font-bold ${activeTab === 'dashboard' ? 'text-slate-900' : 'text-slate-500'}`}>TAHAP 01</div>
              <div className="text-xs font-bold truncate">Dashboard & Kanban</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('propemperda')}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
              activeTab === 'propemperda'
                ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-slate-950/80 hover:bg-slate-800 text-slate-200 border-slate-800'
            }`}
          >
            <div className={`p-2 rounded-lg flex-shrink-0 ${activeTab === 'propemperda' ? 'bg-slate-950 text-emerald-400' : 'bg-slate-900 text-emerald-400 border border-slate-800'}`}>
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className={`text-[10px] font-mono font-bold ${activeTab === 'propemperda' ? 'text-slate-900' : 'text-slate-500'}`}>TAHAP 02</div>
              <div className="text-xs font-bold truncate">Propemperda 2026</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('pengajuan')}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
              activeTab === 'pengajuan'
                ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-slate-950/80 hover:bg-slate-800 text-slate-200 border-slate-800'
            }`}
          >
            <div className={`p-2 rounded-lg flex-shrink-0 ${activeTab === 'pengajuan' ? 'bg-slate-950 text-emerald-400' : 'bg-slate-900 text-emerald-400 border border-slate-800'}`}>
              <FilePlus className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className={`text-[10px] font-mono font-bold ${activeTab === 'pengajuan' ? 'text-slate-900' : 'text-slate-500'}`}>TAHAP 03</div>
              <div className="text-xs font-bold truncate">Pengajuan Ranperda</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('harmonisasi')}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
              activeTab === 'harmonisasi'
                ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-slate-950/80 hover:bg-slate-800 text-slate-200 border-slate-800'
            }`}
          >
            <div className={`p-2 rounded-lg flex-shrink-0 ${activeTab === 'harmonisasi' ? 'bg-slate-950 text-amber-400' : 'bg-slate-900 text-amber-400 border border-slate-800'}`}>
              <Scale className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className={`text-[10px] font-mono font-bold ${activeTab === 'harmonisasi' ? 'text-slate-900' : 'text-slate-500'}`}>TAHAP 04</div>
              <div className="text-xs font-bold truncate">Harmonisasi Kemenkumham</div>
            </div>
          </button>

          {/* Row 2: Pansus & DIM, Fasilitasi Kemendagri, Lembaran Daerah, Tracking */}
          <button
            onClick={() => setActiveTab('pansus')}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
              activeTab === 'pansus'
                ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-slate-950/80 hover:bg-slate-800 text-slate-200 border-slate-800'
            }`}
          >
            <div className={`p-2 rounded-lg flex-shrink-0 ${activeTab === 'pansus' ? 'bg-slate-950 text-blue-400' : 'bg-slate-900 text-blue-400 border border-slate-800'}`}>
              <Users className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className={`text-[10px] font-mono font-bold ${activeTab === 'pansus' ? 'text-slate-900' : 'text-slate-500'}`}>TAHAP 05</div>
              <div className="text-xs font-bold truncate">Pembahasan Pansus & DIM</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('fasilitasi')}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
              activeTab === 'fasilitasi'
                ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-slate-950/80 hover:bg-slate-800 text-slate-200 border-slate-800'
            }`}
          >
            <div className={`p-2 rounded-lg flex-shrink-0 ${activeTab === 'fasilitasi' ? 'bg-slate-950 text-cyan-400' : 'bg-slate-900 text-cyan-400 border border-slate-800'}`}>
              <Building2 className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className={`text-[10px] font-mono font-bold ${activeTab === 'fasilitasi' ? 'text-slate-900' : 'text-slate-500'}`}>TAHAP 06</div>
              <div className="text-xs font-bold truncate">Fasilitasi Kemendagri & Noreg</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('pengundangan')}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
              activeTab === 'pengundangan'
                ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-slate-950/80 hover:bg-slate-800 text-slate-200 border-slate-800'
            }`}
          >
            <div className={`p-2 rounded-lg flex-shrink-0 ${activeTab === 'pengundangan' ? 'bg-slate-950 text-indigo-400' : 'bg-slate-900 text-indigo-400 border border-slate-800'}`}>
              <Globe className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className={`text-[10px] font-mono font-bold ${activeTab === 'pengundangan' ? 'text-slate-900' : 'text-slate-500'}`}>TAHAP 07</div>
              <div className="text-xs font-bold truncate">Lembaran Daerah & JDIH</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
              activeTab === 'tracking'
                ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-slate-950/80 hover:bg-slate-800 text-slate-200 border-slate-800'
            }`}
          >
            <div className={`p-2 rounded-lg flex-shrink-0 ${activeTab === 'tracking' ? 'bg-slate-950 text-rose-400' : 'bg-slate-900 text-rose-400 border border-slate-800'}`}>
              <Layers className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className={`text-[10px] font-mono font-bold ${activeTab === 'tracking' ? 'text-slate-900' : 'text-slate-500'}`}>TAHAP 08</div>
              <div className="text-xs font-bold truncate">Tracking Publik</div>
            </div>
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      {activeTab === 'dashboard' && (
        <DashboardKanbanView
          ranperdaList={ranperdaList}
          currentRole={currentRole}
          onSelectRanperda={(item) => setActiveTab('pansus')}
          onUpdateRanperdaStatus={handleUpdateRanperdaStatus}
        />
      )}

      {activeTab === 'admin_control' && (
        <SetwanAdminMasterControlView
          ranperdaList={ranperdaList}
          currentRole={currentRole}
          picContacts={picContacts}
          onOpenContactsModal={() => setIsContactsModalOpen(true)}
          onOpenMagicLinkModal={() => setIsMagicLinkModalOpen(true)}
          onOpenWhatsAppModal={(ranperda, targetRole, nextStatus) =>
            setWaModalState({
              isOpen: true,
              ranperda,
              targetRole,
              nextStatus,
            })
          }
          onUpdateRanperdaStatus={handleUpdateRanperdaStatus}
        />
      )}

      {activeTab === 'propemperda' && (
        <PropemperdaView
          propemperdaList={propemperdaList}
          currentRole={currentRole}
          onAddPropemperda={handleAddPropemperda}
        />
      )}

      {activeTab === 'pengajuan' && (
        <PengajuanFormView
          currentRole={currentRole}
          onSubmitRanperda={handleAddRanperda}
        />
      )}

      {activeTab === 'harmonisasi' && (
        <HarmonisasiKemenkumhamView
          ranperdaList={ranperdaList}
          currentRole={currentRole}
          onUpdateRanperdaStatus={handleUpdateRanperdaStatus}
          onAddDocumentToRanperda={handleAddDocumentToRanperda}
        />
      )}

      {activeTab === 'pansus' && (
        <PembahasanPansusView
          ranperdaList={ranperdaList}
          currentRole={currentRole}
          onUpdateDIMList={handleUpdateDIMList}
        />
      )}

      {activeTab === 'fasilitasi' && (
        <FasilitasiKemendagriView
          ranperdaList={ranperdaList}
          currentRole={currentRole}
          onUpdateRanperdaStatus={handleUpdateRanperdaStatus}
          onAddDocumentToRanperda={handleAddDocumentToRanperda}
        />
      )}

      {activeTab === 'pengundangan' && (
        <PenetapanPengundanganView
          ranperdaList={ranperdaList}
          currentRole={currentRole}
          onUpdateRanperdaStatus={handleUpdateRanperdaStatus}
        />
      )}

      {activeTab === 'tracking' && (
        <TrackingPublicView ranperdaList={ranperdaList} />
      )}
    </div>
  );
};
