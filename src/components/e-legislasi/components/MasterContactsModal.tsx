import React, { useState } from 'react';
import { PicContact, RoleCode } from '../types';
import {
  Users,
  Phone,
  Mail,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  ExternalLink,
  Shield,
  Send,
  Sparkles,
  KeyRound,
  Copy,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  contacts: PicContact[];
  onSaveContacts: (newContacts: PicContact[]) => void;
  onSimulateMagicLink: (role: RoleCode, contactName: string) => void;
}

export const MasterContactsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  contacts,
  onSaveContacts,
  onSimulateMagicLink,
}) => {
  const [contactList, setContactList] = useState<PicContact[]>(contacts);
  const [isAdding, setIsAdding] = useState(false);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  // New Contact Form State
  const [namaPic, setNamaPic] = useState('');
  const [instansi, setInstansi] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNo, setWhatsappNo] = useState('+62');
  const [roleCode, setRoleCode] = useState<RoleCode>('ROLE_KEMENKUMHAM');

  if (!isOpen) return null;

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPic || !instansi || !whatsappNo) return;

    const newPic: PicContact = {
      id: `PIC-${Date.now()}`,
      namaPic,
      instansi,
      jabatan: jabatan || 'PIC Instansi Terkait',
      email: email || 'pic@instansi.go.id',
      whatsappNo: whatsappNo.startsWith('+62') ? whatsappNo : `+62${whatsappNo.replace(/^0/, '')}`,
      roleCode,
      statusActive: true,
    };

    const updated = [newPic, ...contactList];
    setContactList(updated);
    onSaveContacts(updated);

    // Reset Form
    setNamaPic('');
    setInstansi('');
    setJabatan('');
    setEmail('');
    setWhatsappNo('+62');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const updated = contactList.filter((c) => c.id !== id);
    setContactList(updated);
    onSaveContacts(updated);
  };

  const handleCopyMagicLink = (pic: PicContact) => {
    const magicUrl = `${window.location.origin}/e-legislasi?magic_token=TOKEN_${pic.roleCode}_${pic.id}&role=${pic.roleCode}`;
    navigator.clipboard.writeText(magicUrl);
    setCopiedTokenId(pic.id);
    setTimeout(() => setCopiedTokenId(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                MASTER CONTROL SETWAN
              </span>
              <span className="text-xs text-slate-400">| Buku Telepon & Contact Manager WA</span>
            </div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>Direktori PIC Instansi Eksternal & Magic Link Token</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Form Toggle */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Pengaturan kontak Person-In-Charge (PIC) Kemenkumham, Biro Hukum, OPD Pemrakarsa, dan Ditjen Otda Kemendagri untuk notifikasi WhatsApp otomatis.
          </p>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1.5 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdding ? 'Tutup Form' : 'Tambah PIC Instansi Baru'}</span>
          </button>
        </div>

        {/* Form Input New Contact */}
        {isAdding && (
          <form
            onSubmit={handleAddContact}
            className="bg-slate-950 border border-emerald-500/50 rounded-2xl p-4 space-y-4 text-xs animate-slide-in"
          >
            <h3 className="font-bold text-emerald-400 flex items-center gap-2 text-sm border-b border-slate-800 pb-2">
              <Sparkles className="w-4 h-4" />
              <span>Form Registrasi PIC Kontak Baru</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nama Lengkap & Gelar PIC
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Syafi'i, SH."
                  value={namaPic}
                  onChange={(e) => setNamaPic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Instansi Pemprov / Kementerian
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kanwil Kemenkumham Sulbar"
                  value={instansi}
                  onChange={(e) => setInstansi(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Jabatan / Posisi Work
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Legal Drafter Madya"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nomor WhatsApp (+62...)
                </label>
                <input
                  type="text"
                  required
                  placeholder="+6281234567890"
                  value={whatsappNo}
                  onChange={(e) => setWhatsappNo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Email Resmi
                </label>
                <input
                  type="email"
                  placeholder="pic@kemenkumham.go.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Hak Akses / Role Sesuai RBAC
                </label>
                <select
                  value={roleCode}
                  onChange={(e) => setRoleCode(e.target.value as RoleCode)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                >
                  <option value="ROLE_KEMENKUMHAM">Kanwil Kemenkumham Sulbar</option>
                  <option value="ROLE_BIRO_HUKUM">Biro Hukum Pemprov Sulbar</option>
                  <option value="ROLE_KEMENDAGRI">Ditjen Otda Kemendagri RI</option>
                  <option value="ROLE_OPD">OPD Pemrakarsa</option>
                  <option value="ROLE_SETWAN">Sekretariat DPRD Sulbar</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
              >
                Batal
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 text-slate-950 font-bold rounded-xl shadow"
              >
                Simpan PIC Kontak
              </button>
            </div>
          </form>
        )}

        {/* Contacts Directory Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-slate-200">
              Daftar Kontak Terverifikasi ({contactList.length})
            </span>
            <span>Status API WhatsApp Gateway: <strong className="text-emerald-400">Terhubung (Online)</strong></span>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {contactList.map((contact) => (
              <div
                key={contact.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-3 hover:border-slate-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-sm">{contact.namaPic}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 text-emerald-400">
                        {contact.roleCode}
                      </span>
                    </div>
                    <p className="text-slate-400 font-medium">{contact.instansi} - {contact.jabatan}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSimulateMagicLink(contact.roleCode, contact.namaPic)}
                      className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition"
                      title="Simulasi Direct Login via Magic Link WA"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Simulasi Magic Link Login</span>
                    </button>

                    <button
                      onClick={() => handleCopyMagicLink(contact)}
                      className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition"
                      title="Salin Magic Link OTP"
                    >
                      {copiedTokenId === contact.id ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="p-1.5 bg-slate-900 hover:bg-red-950 text-red-400 border border-slate-800 hover:border-red-800 rounded-lg transition"
                      title="Hapus Kontak"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800/80">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="font-mono font-bold text-white">{contact.whatsappNo}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 rounded ml-auto">WA Verified</span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800/80">
                    <Mail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition"
          >
            Tutup Buku Telepon
          </button>
        </div>
      </div>
    </div>
  );
};
