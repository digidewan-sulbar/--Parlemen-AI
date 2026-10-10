import { AuthUser, AuthRole } from '../types';

export interface UserAccountConfig {
  username: string;
  passwordHash: string; // Plaintext or hash check
  role: AuthRole;
  levelAkses: number;
  fullName: string;
  jabatan: string;
  nip: string;
  badgeLabel: string;
  colorScheme: {
    bg: string;
    text: string;
    border: string;
  };
}

export const VALID_ACCOUNTS: UserAccountConfig[] = [
  {
    username: 'admin',
    passwordHash: 'admin.321',
    role: 'admin',
    levelAkses: 1,
    fullName: 'Administrator Sistem E-Parlemen',
    jabatan: 'Pranata Komputer Ahli / IT & Database Admin',
    nip: '19850412 201001 1 008',
    badgeLabel: 'Level 1: Admin',
    colorScheme: {
      bg: 'bg-emerald-950/80',
      text: 'text-emerald-300',
      border: 'border-emerald-500/50',
    },
  },
  {
    username: 'kabag',
    passwordHash: 'kabag.321',
    role: 'kabag',
    levelAkses: 2,
    fullName: 'H. Muhammad Ridwan, S.STP., M.Si',
    jabatan: 'Kepala Bagian Persidangan & Perundang-undangan',
    nip: '19790615 200212 1 002',
    badgeLabel: 'Level 2: Kabag',
    colorScheme: {
      bg: 'bg-amber-950/80',
      text: 'text-amber-300',
      border: 'border-amber-500/50',
    },
  },
  {
    username: 'operator',
    passwordHash: 'op.321',
    role: 'operator',
    levelAkses: 3,
    fullName: 'Staf Operator Risalah DPRD Sulbar',
    jabatan: 'Pengelola Risalah Persidangan & Data RDP',
    nip: '19940822 202012 1 005',
    badgeLabel: 'Level 3: Operator',
    colorScheme: {
      bg: 'bg-blue-950/80',
      text: 'text-blue-300',
      border: 'border-blue-500/50',
    },
  },
];

const AUTH_STORAGE_KEY = 'eparlemen_sulbar_session_user';

export function authenticateUser(rawUsername: string, rawPassword: string): { user: AuthUser | null; error?: string } {
  const cleanUsername = rawUsername.trim().toLowerCase();
  const cleanPassword = rawPassword.trim();

  if (!cleanUsername || !cleanPassword) {
    return { user: null, error: 'Silakan isi username dan kata sandi.' };
  }

  const account = VALID_ACCOUNTS.find(
    (acc) => acc.username.toLowerCase() === cleanUsername
  );

  if (!account) {
    return { user: null, error: 'Username tidak terdaftar di sistem.' };
  }

  if (account.passwordHash !== cleanPassword) {
    return { user: null, error: 'Kata sandi yang Anda masukkan salah.' };
  }

  const authUser: AuthUser = {
    username: account.username,
    role: account.role,
    levelAkses: account.levelAkses,
    fullName: account.fullName,
    jabatan: account.jabatan,
    nip: account.nip,
    loginAt: new Date().toISOString(),
    token: `ep-token-${account.role}-${Date.now()}`,
  };

  return { user: authUser };
}

export function getStoredAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (parsed && parsed.username && parsed.role) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to read auth user from storage', e);
  }
  return null;
}

export function storeAuthUser(user: AuthUser, rememberMe = true): void {
  try {
    const str = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, str);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, str);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to store auth user', e);
  }
}

export function clearStoredAuthUser(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear auth storage', e);
  }
}
