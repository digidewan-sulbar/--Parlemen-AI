import React, { useState } from 'react';
import { RanperdaDetail, RoleCode, PicContact, RanperdaStatusCode } from '../types';
import {
  ShieldCheck,
  Send,
  Users,
  Clock,
  AlertTriangle,
  FileCheck,
  RotateCcw,
  BookOpen,
  History,
  Phone,
  MessageSquare,
  Sparkles,
  Search,
  KeyRound,
} from 'lucide-react';

interface Props {
  ranperdaList: RanperdaDetail[];
  currentRole: RoleCode;
  picContacts: PicContact[];
  onOpenContactsModal: () => void;
  onOpenMagicLinkModal?: () => void;
  onOpenWhatsAppModal: (
    ranperda: RanperdaDetail,
    targetRole: RoleCode,
    nextStatus: RanperdaStatusCode
  ) => void;
  onUpdateRanperdaStatus: (
    id: string,
    newStatus: RanperdaStatusCode,
    note: string
  ) => void;
}

export const SetwanAdminMasterControlView: React.FC<Props> = ({
  ranperdaList,
  currentRole,
  picContacts,
  onOpenContactsModal,
  onOpenMagicLinkModal,
  onOpenWhatsAppModal,
  onUpdateRanperdaStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRanperda, setSelectedRanperda] = useState<RanperdaDetail>(
    ranperdaList[0]
  );

  const filteredList = ranperdaList.filter(
    (r) =>
      r.judulRanperda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.nomorRanperda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.inisiatorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Combine audit logs from all ranperda for global audit
  const allAuditLogs = ranperdaList.flatMap((r) =>
    r.auditLogs.map((log) => ({
      ...log,
      ranperdaNo: r.nomorRanperda,
      ranperdaTitle: r.judulRanperda,
    }))
  );

  const [activeSubTab, setActiveSubTab] = useState<'DISPOSISI' | 'AUDIT_LOGS'>('DISPOSISI');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
              PANEL ADMIN SETWAN & MASTER CONTROL
            </span>
            <span className="text-xs text-slate-400">| Disposisi, WhatsApp Trigger & Audit Trail</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Pusat Pengendali Alur E-Legislasi & Notifikasi Otomatis
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Kelola disposisi berkas ke Kemenkumham / Kemendagri, atur nomor WA PIC Instansi, dan pantau SLA idle time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <button
            onClick={onOpenContactsModal}
            className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Kontak WA PIC ({picContacts.length})</span>
          </button>

          {onOpenMagicLinkModal && (
            <button
              onClick={onOpenMagicLinkModal}
              className="px-3.5 py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>Simulasi Magic Link OTP</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('DISPOSISI')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeSubTab === 'DISPOSISI'
              ? 'bg-emerald-500 text-slate-950 shadow font-black'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Disposisi & Override Status Ranperda</span>
        </button>

        <button
          onClick={() => setActiveSubTab('AUDIT_LOGS')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeSubTab === 'AUDIT_LOGS'
              ? 'bg-emerald-500 text-slate-950 shadow font-black'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Trail & Log Notifikasi WhatsApp ({allAuditLogs.length})</span>
        </button>
      </div>

      {activeSubTab === 'DISPOSISI' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ranperda List Selector */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Ranperda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
              {filteredList.map((item) => {
                const isSelected = selectedRanperda?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedRanperda(item)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-emerald-950/30 border-emerald-500 shadow ring-1 ring-emerald-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {item.nomorRanperda}
                      </span>
                      <span className="px-2 py-0.5 rounded font-bold bg-slate-900 text-slate-300 border border-slate-800">
                        {item.statusCode}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-white line-clamp-2">
                      {item.judulRanperda}
                    </h4>

                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                      <span>{item.inisiatorName}</span>
                      <span className="text-emerald-400 font-bold">{item.sisaHariSla} hari sisa</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Master Control Action Card */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            {selectedRanperda ? (
              <>
                <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {selectedRanperda.nomorRanperda}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      {selectedRanperda.judulRanperda}
                    </h3>
                  </div>

                  <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                    SLA Status: <strong className="text-emerald-400">{selectedRanperda.statusSla}</strong>
                  </div>
                </div>

                {/* Disposisi Actions */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Aksi Disposisi Admin Setwan (Kirim WA Alert + Link OTP)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Disposisi to Kemenkumham */}
                    <button
                      onClick={() =>
                        onOpenWhatsAppModal(
                          selectedRanperda,
                          'ROLE_KEMENKUMHAM',
                          'HARMONIZATION_KEMENKUMHAM'
                        )
                      }
                      className="p-4 bg-amber-950/40 hover:bg-amber-950/80 border border-amber-800/80 rounded-2xl text-left space-y-2 transition group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-amber-300">
                          1. Kirim Harmonisasi ke Kanwil Kemenkumham
                        </span>
                        <Send className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Trigger Notifikasi WhatsApp ke Kanwil Kemenkumham Sulbar + sertakan Magic Link OTP.
                      </p>
                    </button>

                    {/* Disposisi to Kemendagri */}
                    <button
                      onClick={() =>
                        onOpenWhatsAppModal(
                          selectedRanperda,
                          'ROLE_KEMENDAGRI',
                          'FASILITASI_KEMENDAGRI'
                        )
                      }
                      className="p-4 bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-800/80 rounded-2xl text-left space-y-2 transition group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-cyan-300">
                          2. Kirim Fasilitasi ke Ditjen Otda Kemendagri
                        </span>
                        <Send className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition" />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Trigger Notifikasi WhatsApp ke Kemendagri RI + sertakan Magic Link OTP.
                      </p>
                    </button>
                  </div>

                  {/* Manual Status Override */}
                  <div className="pt-4 border-t border-slate-800/80 space-y-3">
                    <label className="block text-slate-300 font-semibold text-xs">
                      Manual Status Override (Bila terjadi koreksi khusus)
                    </label>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {(
                        [
                          'DRAFT_PROPOSED',
                          'HARMONIZED',
                          'PANSUS_DISCUSSION',
                          'JOINT_APPROVAL',
                          'NOREG_ISSUED',
                          'ENACTED_JDIH',
                        ] as RanperdaStatusCode[]
                      ).map((st) => (
                        <button
                          key={st}
                          onClick={() =>
                            onUpdateRanperdaStatus(
                              selectedRanperda.id,
                              st,
                              `Manual Status Override oleh Admin Setwan ke ${st}`
                            )
                          }
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl font-mono text-[11px] transition"
                        >
                          → {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Document Versioning List for selected Ranperda */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="font-bold text-white text-xs">
                    Versi Dokumen Terlampir ({selectedRanperda.documents.length})
                  </h4>

                  <div className="space-y-2">
                    {selectedRanperda.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs flex items-center justify-between text-slate-200"
                      >
                        <div>
                          <span className="font-bold text-emerald-400 font-mono">
                            {doc.versionName}:
                          </span>{' '}
                          {doc.fileName}{' '}
                          <span className="text-slate-500">({doc.fileSize})</span>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Pengunggah: {doc.uploadedBy} ({doc.uploadedRole}) - {doc.uploadedAt}
                          </p>
                        </div>
                        <button
                          onClick={() => alert(`Mengunduh ${doc.fileName}...`)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-bold border border-slate-700"
                        >
                          Unduh
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
                Pilih Ranperda dari daftar untuk mengelola disposisi.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Audit Trail Table */}
      {activeSubTab === 'AUDIT_LOGS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <span>Audit Trail Transaksi & Pengiriman WhatsApp System-Wide</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Ranperda</th>
                  <th className="p-3">Pengguna & Role</th>
                  <th className="p-3">Tindakan / Aksi</th>
                  <th className="p-3">Rincian Catatan / Pesan WA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {allAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/50 transition">
                    <td className="p-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="p-3 font-bold text-emerald-400 font-mono">
                      {log.ranperdaNo}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-white">{log.userName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.userRole}</div>
                    </td>
                    <td className="p-3 font-semibold text-amber-300">
                      {log.actionName}
                    </td>
                    <td className="p-3 text-slate-300 leading-relaxed text-[11px]">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
