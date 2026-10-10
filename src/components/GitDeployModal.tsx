import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  UploadCloud,
  CheckCircle2,
  ExternalLink,
  Key,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Copy,
  Check,
  X,
  Send,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface GitStatus {
  repository: string;
  branch: string;
  lastCommit: string;
  remoteConnected: boolean;
  repoUrl: string;
}

export const GitDeployModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('github_pat_token') || '');
  const [commitMessage, setCommitMessage] = useState('Sync updates from E-Parlemen AI Studio');
  const [deployResult, setDeployResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const REPO_URL = 'https://github.com/digidewan-sulbar/--Parlemen-AI';

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/git/status');
      const data = await res.json();
      if (data.success) {
        setGitStatus(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setDeployResult(null);
    }
  }, [isOpen]);

  const handleDeployPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubToken.trim()) {
      setDeployResult({
        success: false,
        message: 'Masukkan GitHub Personal Access Token (PAT) Anda terlebih dahulu.',
      });
      return;
    }

    setDeploying(true);
    setDeployResult(null);
    try {
      localStorage.setItem('github_pat_token', githubToken.trim());
      const res = await fetch('/api/git/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubToken.trim(),
          commitMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDeployResult({
          success: true,
          message: 'Berhasil di-deploy & di-push ke GitHub! Seluruh kode aplikasi kini sudah ada di repository Anda.',
        });
        fetchStatus();
      } else {
        setDeployResult({
          success: false,
          message: data.message || data.error || 'Gagal melakukan push ke GitHub. Periksa kembali token Anda.',
        });
      }
    } catch (err: any) {
      setDeployResult({
        success: false,
        message: 'Terjadi kesalahan: ' + err.message,
      });
    } finally {
      setDeploying(false);
    }
  };

  const copyBashCommand = () => {
    const cmd = `git remote set-url origin https://github.com/digidewan-sulbar/--Parlemen-AI.git\ngit add .\ngit commit -m "Auto deploy from E-Parlemen AI"\ngit push -u origin main`;
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950/80 border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Deploy Otomatis ke GitHub
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-500/40">
                  Direct Push
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Hubungkan dan dorong source code aplikasi langsung ke repositori Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Target Repo Info Card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 text-xs">
                <GitBranch className="w-4 h-4 text-emerald-400" />
                Target Repository:
              </span>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 font-mono text-[11px] flex items-center gap-1 hover:underline"
              >
                digidewan-sulbar/--Parlemen-AI
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-[11px]">
              <div>
                <span className="text-slate-500">Status Remote: </span>
                <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Terhubung (Branch: main)
                </span>
              </div>
              <div>
                <span className="text-slate-500">Last Local Commit: </span>
                <span className="text-slate-300 font-mono">
                  {gitStatus?.lastCommit || 'Memuat...'}
                </span>
              </div>
            </div>
          </div>

          {/* Form Direct Push via GitHub Token */}
          <form onSubmit={handleDeployPush} className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                1-Click Push via GitHub Token
              </h3>
              <a
                href="https://github.com/settings/tokens/new?scopes=repo&description=E-Parlemen-AI-Deploy"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline"
              >
                Buat Token GitHub (PAT) Baru
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                GitHub Personal Access Token (PAT)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Token hanya disimpan secara lokal di browser Anda untuk keperluan push ke GitHub repo Anda.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Pesan Commit (Opsional)
              </label>
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Pembaruan sistem E-Parlemen Sulbar..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Deploy Alert */}
            {deployResult && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                  deployResult.success
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
                }`}
              >
                {deployResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{deployResult.message}</p>
                  {deployResult.success && (
                    <a
                      href={REPO_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-300 underline text-[11px] mt-1 inline-flex items-center gap-1"
                    >
                      Buka Repositori di GitHub <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={deploying}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-950 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-xs"
            >
              {deploying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memproses Push ke GitHub...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Push & Deploy Sekarang ke GitHub</span>
                </>
              )}
            </button>
          </form>

          {/* Opsi Manual Terminal */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                Atau Salin Perintah Git Manual:
              </span>
              <button
                type="button"
                onClick={copyBashCommand}
                className="text-[10px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded flex items-center gap-1 transition"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd ? 'Tersalin!' : 'Salin Perintah'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[10px] text-emerald-400 overflow-x-auto whitespace-pre">
              {`git remote set-url origin https://github.com/digidewan-sulbar/--Parlemen-AI.git\ngit add .\ngit commit -m "Auto deploy from E-Parlemen AI"\ngit push -u origin main`}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950/80 border-t border-slate-800 p-3 sm:p-4 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Hostinger siap auto-pull via GitHub Webhook
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
