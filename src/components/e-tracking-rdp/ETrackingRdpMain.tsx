import React, { useState } from 'react';
import { RdpRekomendasiExtended } from './rdpTypes';
import { INITIAL_RDP_EXTENDED_DATA } from './rdpMockData';
import { RdpDashboardAnalyticsView } from './RdpDashboardAnalyticsView';
import { RdpMasterControlView } from './RdpMasterControlView';
import { RdpOpdEvidencePortalView } from './RdpOpdEvidencePortalView';
import { RdpWaNotificationEngineView } from './RdpWaNotificationEngineView';
import { openWhatsAppWithRdpMessage, formatWhatsAppPhone } from './rdpWaUtils';
import { AuthUser } from '../../types';
import {
  BarChart3,
  ShieldCheck,
  Zap,
  MessageSquare,
  Sparkles,
  Search,
  Building2,
  Clock,
  Send,
  Layers,
} from 'lucide-react';

interface ETrackingRdpMainProps {
  currentUser?: AuthUser | null;
}

export const ETrackingRdpMain: React.FC<ETrackingRdpMainProps> = ({ currentUser }) => {
  const [dataList, setDataList] = useState<RdpRekomendasiExtended[]>(INITIAL_RDP_EXTENDED_DATA);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'MASTER_CONTROL' | 'EVIDENCE_VAULT' | 'WA_ENGINE'>('DASHBOARD');
  const [selectedRdpForVault, setSelectedRdpForVault] = useState<RdpRekomendasiExtended>(INITIAL_RDP_EXTENDED_DATA[0]);

  // CRUD Handlers
  const handleAddRecommendation = (newItem: RdpRekomendasiExtended) => {
    setDataList((prev) => [newItem, ...prev]);
  };

  const handleUpdateRecommendation = (updatedItem: RdpRekomendasiExtended) => {
    setDataList((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const handleDeleteRecommendation = (id: string) => {
    setDataList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOpenEvidencePortal = (item: RdpRekomendasiExtended) => {
    setSelectedRdpForVault(item);
    setActiveTab('EVIDENCE_VAULT');
  };

  const handleTriggerInstantWa = (item: RdpRekomendasiExtended, templateText?: string) => {
    // Open WhatsApp Web/App immediately with the formatted RDP message
    openWhatsAppWithRdpMessage(item, templateText);

    const updated: RdpRekomendasiExtended = {
      ...item,
      lastWaSentTimestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }),
      statusLogs: [
        ...(item.statusLogs || []),
        {
          id: `LOG-${Date.now()}`,
          statusAwal: item.status,
          statusBaru: item.status,
          timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }),
          actor: 'Layanan Notifikasi WhatsApp Otomatis',
          keterangan: `Notifikasi & Penagihan RDP terkirim via WhatsApp ke ${item.opdPejabatNama} (+${formatWhatsAppPhone(item.opdPejabatWa)}).`,
        },
      ],
    };
    handleUpdateRecommendation(updated);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Module Title Header */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Mesin Utama Persidangan • Modul 3
            </span>
            <span className="text-slate-500 text-xs font-mono">DPRD Prov. Sulawesi Barat</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight">
            Pemantauan Rekomendasi RDP (Rapat Dengar Pendapat)
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Sistem pemantauan alur tindak lanjut RDP Komisi I-IV DPRD, penagihan tenggat waktu 14 Hari Kerja, penyimpan bukti fisik OPD, dan notifikasi pesan otomatis.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'DASHBOARD'
                ? 'bg-amber-500 text-slate-950 shadow font-extrabold'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dasbor & Rapor</span>
            <span className="sm:hidden">Dasbor</span>
          </button>

          <button
            onClick={() => setActiveTab('MASTER_CONTROL')}
            className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'MASTER_CONTROL'
                ? 'bg-amber-500 text-slate-950 shadow font-extrabold'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pusat Kendali RDP</span>
            <span className="sm:hidden">Kendali</span>
          </button>

          <button
            onClick={() => setActiveTab('EVIDENCE_VAULT')}
            className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'EVIDENCE_VAULT'
                ? 'bg-amber-500 text-slate-950 shadow font-extrabold'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bilik Bukti OPD</span>
            <span className="sm:hidden">Bukti</span>
          </button>

          <button
            onClick={() => setActiveTab('WA_ENGINE')}
            className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'WA_ENGINE'
                ? 'bg-amber-500 text-slate-950 shadow font-extrabold'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pesan Otomatis</span>
            <span className="sm:hidden">Notifikasi</span>
          </button>
        </div>
      </div>

      {/* Tab Render Switcher */}
      {activeTab === 'DASHBOARD' && (
        <RdpDashboardAnalyticsView
          dataList={dataList}
          onSelectRecommendation={(item) => {
            setSelectedRdpForVault(item);
            setActiveTab('MASTER_CONTROL');
          }}
          onOpenEvidencePortal={handleOpenEvidencePortal}
        />
      )}

      {activeTab === 'MASTER_CONTROL' && (
        <RdpMasterControlView
          dataList={dataList}
          currentUser={currentUser}
          onAddRecommendation={handleAddRecommendation}
          onUpdateRecommendation={handleUpdateRecommendation}
          onDeleteRecommendation={handleDeleteRecommendation}
          onSendWaNotification={(item) => handleTriggerInstantWa(item, 'Rekomendasi RDP')}
          onOpenEvidencePortal={handleOpenEvidencePortal}
        />
      )}

      {activeTab === 'EVIDENCE_VAULT' && (
        <RdpOpdEvidencePortalView
          recommendation={selectedRdpForVault}
          onUpdateRecommendation={handleUpdateRecommendation}
          onBackToDashboard={() => setActiveTab('DASHBOARD')}
        />
      )}

      {activeTab === 'WA_ENGINE' && (
        <RdpWaNotificationEngineView
          dataList={dataList}
          onTriggerInstantWa={handleTriggerInstantWa}
        />
      )}
    </div>
  );
};
