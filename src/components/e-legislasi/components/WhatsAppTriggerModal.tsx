import React, { useState } from 'react';
import { RanperdaDetail, PicContact, RoleCode, RanperdaStatusCode } from '../types';
import {
  Send,
  MessageSquare,
  CheckCircle2,
  X,
  Phone,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  KeyRound,
  FileText,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ranperda: RanperdaDetail;
  targetRole: RoleCode;
  nextStatus: RanperdaStatusCode;
  picContacts: PicContact[];
  onConfirmSend: (
    ranperdaId: string,
    nextStatus: RanperdaStatusCode,
    customMessage: string,
    recipientPic: PicContact
  ) => void;
}

export const WhatsAppTriggerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  ranperda,
  targetRole,
  nextStatus,
  picContacts,
  onConfirmSend,
}) => {
  if (!isOpen) return null;

  // Find recipient contact matching role
  const matchingPic =
    picContacts.find((c) => c.roleCode === targetRole) || picContacts[0];

  const [selectedPic, setSelectedPic] = useState<PicContact>(matchingPic);
  
  // Magic Token Simulation
  const magicToken = `MAGIC_${targetRole}_${Date.now().toString(36).toUpperCase()}`;
  const magicUrl = `${window.location.origin}/e-legislasi?magic_token=${magicToken}&role=${targetRole}&ranperda_id=${ranperda.id}`;

  const defaultMsg = `Yth. Bapak/Ibu ${selectedPic.namaPic} (${selectedPic.instansi}),\n\nTerdapat pengajuan berkas Ranperda Baru untuk diproses:\n📌 Judul: ${ranperda.judulRanperda}\n📑 Nomor: ${ranperda.nomorRanperda}\n🏛️ Inisiator: ${ranperda.inisiatorName}\n\nSilakan akses dan unduh draf berkas secara otomatis via Magic Link Login tanpa password berikut:\n🔗 ${magicUrl}\n\nSalam,\nSekretariat DPRD Provinsi Sulawesi Barat`;

  const [customMessage, setCustomMessage] = useState(defaultMsg);

  const handleSend = () => {
    onConfirmSend(ranperda.id, nextStatus, customMessage, selectedPic);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Disposisi Dokumen & Trigger WhatsApp Alert
              </h3>
              <p className="text-[11px] text-slate-400">
                Penerusan Berkas via WhatsApp Gateway API (Wablas/Fonnte/Wwebjs)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs">
          {/* Ranperda Info Summary */}
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {ranperda.nomorRanperda}
              </span>
              <span className="text-slate-400">Target Stage: <strong className="text-emerald-300">{nextStatus}</strong></span>
            </div>
            <h4 className="font-bold text-sm text-white">{ranperda.judulRanperda}</h4>
          </div>

          {/* Select Recipient PIC */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Pilih Kontak PIC Instansi Penerima
            </label>
            <select
              value={selectedPic.id}
              onChange={(e) => {
                const pic = picContacts.find((c) => c.id === e.target.value);
                if (pic) {
                  setSelectedPic(pic);
                  setCustomMessage(
                    `Yth. Bapak/Ibu ${pic.namaPic} (${pic.instansi}),\n\nTerdapat pengajuan berkas Ranperda Baru untuk diproses:\n📌 Judul: ${ranperda.judulRanperda}\n📑 Nomor: ${ranperda.nomorRanperda}\n🏛️ Inisiator: ${ranperda.inisiatorName}\n\nSilakan akses dan unduh draf berkas secara otomatis via Magic Link Login tanpa password berikut:\n🔗 ${magicUrl}\n\nSalam,\nSekretariat DPRD Provinsi Sulawesi Barat`
                  );
                }
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
            >
              {picContacts.map((pic) => (
                <option key={pic.id} value={pic.id}>
                  {pic.namaPic} - {pic.instansi} ({pic.whatsappNo})
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Details Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-slate-300">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                Penerima WhatsApp
              </span>
              <p className="font-bold text-white text-xs">{selectedPic.namaPic}</p>
              <p className="text-[11px] text-slate-400">{selectedPic.instansi} - {selectedPic.jabatan}</p>
            </div>
            <div className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1.5 rounded-xl font-mono font-bold text-xs flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{selectedPic.whatsappNo}</span>
            </div>
          </div>

          {/* WhatsApp Message Preview Box */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
              <span>Preview Pesan WhatsApp (Dapat Disesuaikan)</span>
              <span className="text-[10px] text-emerald-400 font-mono">Magic Link Enabled</span>
            </label>
            <textarea
              rows={6}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-emerald-300 font-mono text-[11px] leading-relaxed focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Magic Link Info Banner */}
          <div className="bg-emerald-950/30 border border-emerald-800/80 rounded-xl p-3 text-[11px] text-emerald-300 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              Magic Link OTP membawa otentikasi aman sekali pakai. Ketika PIC mengeklik link di WA, sistem otomatis langsung membawa ke portal khusus instansi terkait!
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition"
          >
            Batal
          </button>
          <button
            onClick={handleSend}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl shadow-lg transition flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Kirim WA Alert & Perbarui Status Ranperda</span>
          </button>
        </div>
      </div>
    </div>
  );
};
