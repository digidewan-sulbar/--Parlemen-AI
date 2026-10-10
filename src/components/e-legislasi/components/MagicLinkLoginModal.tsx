import React from 'react';
import { RoleCode, RanperdaDetail, PicContact } from '../types';
import {
  KeyRound,
  X,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building2,
  Scale,
  Users,
  Globe,
  Sparkles,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  picContacts: PicContact[];
  ranperdaList: RanperdaDetail[];
  onSelectMagicLinkAccess: (role: RoleCode, ranperdaId?: string) => void;
}

export const MagicLinkLoginModal: React.FC<Props> = ({
  isOpen,
  onClose,
  picContacts,
  ranperdaList,
  onSelectMagicLinkAccess,
}) => {
  if (!isOpen) return null;

  const getRoleIcon = (role: RoleCode) => {
    switch (role) {
      case 'ROLE_KEMENKUMHAM':
        return <Scale className="w-4 h-4 text-amber-400" />;
      case 'ROLE_BIRO_HUKUM':
        return <Building2 className="w-4 h-4 text-rose-400" />;
      case 'ROLE_OPD':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'ROLE_KEMENDAGRI':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Simulasi Magic Link OTP / Token Access via WhatsApp
              </h3>
              <p className="text-[11px] text-slate-400">
                Pilih link token otentikasi di bawah untuk langsung menuju portal khusus tanpa ketik password
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

        <div className="space-y-3">
          {picContacts.map((pic) => {
            const sampleRanperda =
              ranperdaList.find((r) => {
                if (pic.roleCode === 'ROLE_KEMENKUMHAM')
                  return r.statusCode === 'HARMONIZATION_KEMENKUMHAM' || r.statusCode === 'DRAFT_PROPOSED';
                if (pic.roleCode === 'ROLE_KEMENDAGRI')
                  return r.statusCode === 'FASILITASI_KEMENDAGRI' || r.statusCode === 'JOINT_APPROVAL';
                return true;
              }) || ranperdaList[0];

            const tokenString = `MAGIC_TOKEN_${pic.roleCode}_${pic.id.substring(4)}`;
            const magicUrl = `${window.location.origin}/e-legislasi?magic_token=${tokenString}&role=${pic.roleCode}&ranperda_id=${sampleRanperda?.id}`;

            return (
              <div
                key={pic.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-emerald-500/50 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(pic.roleCode)}
                    <div>
                      <h4 className="font-bold text-white text-xs">{pic.namaPic}</h4>
                      <p className="text-[11px] text-slate-400">{pic.instansi}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 text-emerald-400">
                    {pic.roleCode}
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Generated Token URL:</div>
                  <div className="truncate text-emerald-400">{magicUrl}</div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[10px] text-slate-400">
                    Target Dokumen: <strong className="text-white">{sampleRanperda?.nomorRanperda}</strong>
                  </span>

                  <button
                    onClick={() => {
                      onSelectMagicLinkAccess(pic.roleCode, sampleRanperda?.id);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl shadow text-xs flex items-center gap-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Akses Portal Sekarang via Magic Link</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
