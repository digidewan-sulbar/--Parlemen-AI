import React, { useState } from 'react';
import { RdpRekomendasiExtended, WaTemplateConfig, WaLogItem } from './rdpTypes';
import { DEFAULT_WA_TEMPLATES } from './rdpMockData';
import {
  MessageSquare,
  Send,
  Bell,
  CheckCheck,
  Zap,
  Edit,
  Save,
  Clock,
  PhoneCall,
  AlertTriangle,
  Smartphone,
  ShieldAlert,
  Play,
  RotateCcw,
} from 'lucide-react';

interface Props {
  dataList: RdpRekomendasiExtended[];
  onTriggerInstantWa: (item: RdpRekomendasiExtended, templateText: string) => void;
}

export const RdpWaNotificationEngineView: React.FC<Props> = ({
  dataList,
  onTriggerInstantWa,
}) => {
  const [templates, setTemplates] = useState<WaTemplateConfig[]>(DEFAULT_WA_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('TPL-1');
  const [editingTemplateText, setEditingTemplateText] = useState<string>(DEFAULT_WA_TEMPLATES[0].templateText);
  const [selectedRecommendationId, setSelectedRecommendationId] = useState<string>(
    dataList[0]?.id || ''
  );

  const [waLogs, setWaLogs] = useState<WaLogItem[]>([
    {
      id: 'LOG-WA-1',
      recipientName: 'Drs. Maddareski Salatin, M.Si. (Kadis Perkim)',
      recipientPhone: '6281142556677',
      nomorRdp: 'RDP/KOM-I/012/2026',
      triggerType: 'INSTANT_TERBIT',
      messageText: 'Rekomendasi RDP No. RDP/KOM-I/012/2026 telah diterbitkan...',
      sentAt: '2026-08-08 09:15 WITA',
      status: 'READ',
    },
    {
      id: 'LOG-WA-2',
      recipientName: 'Muh. Nehru Sagena (Kadis Pendidikan)',
      recipientPhone: '6281242331100',
      nomorRdp: 'RDP/KOM-IV/045/2026',
      triggerType: 'REMINDER_H3',
      messageText: 'Reminder H-3: SLA Rekomendasi RDP tersisa 3 hari...',
      sentAt: '2026-08-08 08:00 WITA',
      status: 'DELIVERED',
    },
    {
      id: 'LOG-WA-3',
      recipientName: 'Dr. H. Jamil Barambangi (Sekda Pemprov Sulbar)',
      recipientPhone: '6281142000000',
      nomorRdp: 'RDP/KOM-II/031/2026',
      triggerType: 'ESCALATION_OVERDUE',
      messageText: 'ALERT ESKALASI OVERDUE: Rekomendasi RDP No. RDP/KOM-II/031/2026 melebih batas waktu SLA...',
      sentAt: '2026-08-08 08:05 WITA',
      status: 'DELIVERED',
    },
  ]);

  const activeTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];
  const activeRdp = dataList.find((r) => r.id === selectedRecommendationId) || dataList[0];

  const handleSelectTemplate = (tpl: WaTemplateConfig) => {
    setSelectedTemplateId(tpl.id);
    setEditingTemplateText(tpl.templateText);
  };

  const handleSaveTemplate = () => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === selectedTemplateId ? { ...t, templateText: editingTemplateText } : t))
    );
    alert('Template pesan WhatsApp berhasil diperbarui.');
  };

  // Preview Formatter
  const getFormattedMessagePreview = () => {
    if (!activeRdp) return editingTemplateText;
    return editingTemplateText
      .replace(/{NAMA_PEJABAT}/g, activeRdp.opdPejabatNama)
      .replace(/{JABATAN}/g, activeRdp.opdPenanggungJawab)
      .replace(/{OPD_NAME}/g, activeRdp.opdPenanggungJawab)
      .replace(/{KOMISI}/g, activeRdp.komisi)
      .replace(/{NOMOR_RDP}/g, activeRdp.nomorRdp)
      .replace(/{PERINTH_TINDAK_LANJUT}/g, activeRdp.perintahTindakLanjut)
      .replace(/{SLA_DAYS}/g, String(activeRdp.slaDays))
      .replace(/{DEADLINE_DATE}/g, activeRdp.deadlineDate)
      .replace(/{MAGIC_LINK}/g, `https://e-parlemen.sulbarprov.go.id/portal/${activeRdp.magicLinkToken}`)
      .replace(/{TERLAMBAT_HARI}/g, '3');
  };

  const handleSimulateDispatch = () => {
    if (!activeRdp) return;
    const previewText = getFormattedMessagePreview();

    const newLog: WaLogItem = {
      id: `LOG-WA-${Date.now()}`,
      recipientName: `${activeRdp.opdPejabatNama} (${activeRdp.opdPenanggungJawab})`,
      recipientPhone: activeRdp.opdPejabatWa || '628123456789',
      nomorRdp: activeRdp.nomorRdp,
      triggerType: activeTemplate.triggerType,
      messageText: previewText.substring(0, 80) + '...',
      sentAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }),
      status: 'DELIVERED',
    };

    setWaLogs((prev) => [newLog, ...prev]);
    onTriggerInstantWa(activeRdp, previewText);
  };

  const handleRunCronReminders = () => {
    // Simulate auto scan for H-3, H-1, and OVERDUE
    const overdueItems = dataList.filter((d) => d.status === 'OVERDUE');
    const newLogs: WaLogItem[] = overdueItems.map((item) => ({
      id: `CRON-LOG-${Math.random()}`,
      recipientName: `Sekda Sulbar & Pimpinan ${item.komisi}`,
      recipientPhone: '628114200000',
      nomorRdp: item.nomorRdp,
      triggerType: 'ESCALATION_OVERDUE',
      messageText: `ALERT ESKALASI OVERDUE RDP ${item.nomorRdp} OPD ${item.opdPenanggungJawab}...`,
      sentAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }),
      status: 'DELIVERED',
    }));

    setWaLogs((prev) => [...newLogs, ...prev]);
    alert(`Cron Scheduler WhatsApp Selesai Dijalankan: ${newLogs.length} alert eskalasi terkirim.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 w-fit mb-2">
            <MessageSquare className="w-3 h-3 text-emerald-400" /> Layanan Pesan WhatsApp Otomatis
          </span>
          <h2 className="text-xl font-black text-slate-100">
            Layanan Notifikasi Pesan WhatsApp Otomatis
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Penagihan otomatis berjadwal (Seketika, Pengingat H-3, H-1, & Eskalasi Keterlambatan ke Sekda/Pimpinan DPRD).
          </p>
        </div>

        <button
          onClick={handleRunCronReminders}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 shrink-0"
        >
          <Play className="w-4 h-4" />
          <span>Jalankan Penjadwal Otomatis Pesan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Template Selector & Live Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Edit className="w-4 h-4 text-emerald-400" />
              <span>Kelola Format Pesan Notifikasi</span>
            </h3>

            {/* Template Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between gap-1.5 ${
                    selectedTemplateId === tpl.id
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500 shadow'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
                    {tpl.triggerType}
                  </span>
                  <span className="text-xs font-bold leading-tight line-clamp-1">{tpl.title}</span>
                </button>
              ))}
            </div>

            {/* Select Target RDP for Live Preview */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Pilih Target Rekomendasi RDP (Simulasi Pengiriman)
              </label>
              <select
                value={selectedRecommendationId}
                onChange={(e) => setSelectedRecommendationId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:border-emerald-500 font-semibold"
              >
                {dataList.map((rdp) => (
                  <option key={rdp.id} value={rdp.id}>
                    [{rdp.nomorRdp}] {rdp.opdPenanggungJawab} - {rdp.opdPejabatNama}
                  </option>
                ))}
              </select>
            </div>

            {/* Template Editor Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300">
                  Draf Teks Format Pesan
                </label>
                <button
                  onClick={handleSaveTemplate}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-3 py-1 rounded-lg transition flex items-center gap-1"
                >
                  <Save className="w-3 h-3 text-emerald-400" />
                  <span>Simpan Format Pesan</span>
                </button>
              </div>

              <textarea
                rows={6}
                value={editingTemplateText}
                onChange={(e) => setEditingTemplateText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-mono focus:border-emerald-500 leading-relaxed"
              />
              <span className="text-[10px] text-slate-500 block">
                Variabel tersedia: &#123;NAMA_PEJABAT&#125;, &#123;JABATAN&#125;, &#123;OPD_NAME&#125;, &#123;KOMISI&#125;, &#123;NOMOR_RDP&#125;, &#123;PERINTH_TINDAK_LANJUT&#125;, &#123;SLA_DAYS&#125;, &#123;DEADLINE_DATE&#125;, &#123;MAGIC_LINK&#125;
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Live WA Message Preview & Dispatch Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Smartphone Simulator Preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" />
                <span>Pratinjau Tampilan Ponsel Pejabat</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Aplikasi WhatsApp</span>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-900/60 rounded-xl p-3 text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-emerald-900/40 pb-1">
                <span>Penerima: <strong className="text-emerald-300">{activeRdp?.opdPejabatNama}</strong></span>
                <span className="font-mono text-emerald-400">+{activeRdp?.opdPejabatWa}</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-200 font-mono whitespace-pre-wrap leading-relaxed shadow-inner">
                {getFormattedMessagePreview()}
              </div>
            </div>

            <button
              onClick={handleSimulateDispatch}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Sekarang ke WhatsApp Pejabat</span>
            </button>
          </div>

          {/* WA Log Stream */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Catatan Riwayat Pengiriman WhatsApp</span>
            </h4>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {waLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-200 truncate">{log.recipientName}</span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{log.messageText}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{log.sentAt}</span>
                    <span className="text-amber-400">{log.triggerType}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
