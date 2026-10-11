import {
  RisalahItem,
  RanperdaItem,
  RdpRecommendationItem,
  AgendaPimpinanItem,
  AnggotaDprdItem,
  NotificationItem,
} from '../types';
import { getStoredAuthUser } from './auth';

function getAuthHeaders(): Record<string, string> {
  const user = getStoredAuthUser();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (user?.role) {
    headers['x-user-role'] = user.role;
  }
  return headers;
}

export interface SupabaseStatusResponse {
  success: boolean;
  connected: boolean;
  connectionInfo?: {
    connected: boolean;
    database: string;
    version: string;
    now: string;
    projectUrl: string;
    host: string;
  };
  stats?: {
    risalah: number;
    ranperda: number;
    rdp: number;
    agenda: number;
    press: number;
    protocol: number;
    anggota: number;
    notifications: number;
  };
  error?: string;
  projectUrl?: string;
}

export async function checkSupabaseStatus(): Promise<SupabaseStatusResponse> {
  try {
    const res = await fetch('/api/supabase/status', {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return {
      success: false,
      connected: false,
      error: err.message || 'Gagal menghubungi server',
      projectUrl: 'https://ydezarlbcofzmaosuphr.supabase.co',
    };
  }
}

export async function reseedSupabaseDatabase(): Promise<{ success: boolean; message?: string; stats?: any }> {
  const res = await fetch('/api/supabase/seed-reset', {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return await res.json();
}

// ----------------- Risalah -----------------
export async function apiGetRisalah(): Promise<RisalahItem[] | null> {
  try {
    const res = await fetch('/api/risalah');
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) return json.data;
    return null;
  } catch {
    return null;
  }
}

export async function apiSaveRisalah(item: RisalahItem): Promise<boolean> {
  try {
    const res = await fetch('/api/risalah', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const json = await res.json();
    return !!json.success;
  } catch {
    return false;
  }
}

export async function apiDeleteRisalah(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/risalah/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    return !!json.success;
  } catch {
    return false;
  }
}

// ----------------- Ranperda -----------------
export async function apiGetRanperda(): Promise<RanperdaItem[] | null> {
  try {
    const res = await fetch('/api/ranperda');
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) return json.data;
    return null;
  } catch {
    return null;
  }
}

export async function apiSaveRanperda(item: RanperdaItem): Promise<boolean> {
  try {
    const res = await fetch('/api/ranperda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const json = await res.json();
    return !!json.success;
  } catch {
    return false;
  }
}

export async function apiDeleteRanperda(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/ranperda/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    return !!json.success;
  } catch {
    return false;
  }
}

// ----------------- RDP Recommendations -----------------
export async function apiGetRdp(): Promise<RdpRecommendationItem[] | null> {
  try {
    const res = await fetch('/api/rdp');
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) return json.data;
    return null;
  } catch {
    return null;
  }
}

export async function apiSaveRdp(item: RdpRecommendationItem): Promise<boolean> {
  try {
    const res = await fetch('/api/rdp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const json = await res.json();
    return !!json.success;
  } catch {
    return false;
  }
}

export async function apiDeleteRdp(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/rdp/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    return !!json.success;
  } catch {
    return false;
  }
}

// ----------------- Agenda Pimpinan -----------------
export async function apiGetAgenda(): Promise<AgendaPimpinanItem[] | null> {
  try {
    const res = await fetch('/api/agenda');
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) return json.data;
    return null;
  } catch {
    return null;
  }
}

export async function apiSaveAgenda(item: AgendaPimpinanItem): Promise<boolean> {
  try {
    const res = await fetch('/api/agenda', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    const json = await res.json();
    return !!json.success;
  } catch {
    return false;
  }
}

export async function apiDeleteAgenda(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/agenda/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    return !!json.success;
  } catch {
    return false;
  }
}

// ----------------- Anggota DPRD -----------------
export async function apiGetAnggota(): Promise<AnggotaDprdItem[] | null> {
  try {
    const res = await fetch('/api/anggota-dprd');
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) return json.data;
    return null;
  } catch {
    return null;
  }
}

export async function apiSaveAnggota(item: AnggotaDprdItem): Promise<boolean> {
  try {
    const res = await fetch('/api/anggota-dprd', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    const json = await res.json();
    return !!json.success;
  } catch {
    return false;
  }
}

export async function apiDeleteAnggota(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/anggota-dprd/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    return !!json.success;
  } catch {
    return false;
  }
}

// ----------------- Notifications -----------------
export async function apiGetNotifications(): Promise<NotificationItem[] | null> {
  try {
    const res = await fetch('/api/notifications');
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) return json.data;
    return null;
  } catch {
    return null;
  }
}

export async function apiSaveNotification(item: NotificationItem): Promise<boolean> {
  try {
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const json = await res.json();
    return !!json.success;
  } catch {
    return false;
  }
}

export async function apiMarkNotificationRead(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/notifications/${encodeURIComponent(id)}/read`, {
      method: 'PUT',
    });
    const json = await res.json();
    return !!json.success;
  } catch {
    return false;
  }
}

export async function apiMarkAllNotificationsRead(): Promise<boolean> {
  try {
    const res = await fetch('/api/notifications/read-all', {
      method: 'PUT',
    });
    const json = await res.json();
    return !!json.success;
  } catch {
    return false;
  }
}

// ----------------- Press Releases -----------------
export async function apiGetPress(): Promise<any[] | null> {
  try {
    const res = await fetch('/api/press');
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) return json.data;
    return null;
  } catch {
    return null;
  }
}

export async function apiSavePress(item: any): Promise<boolean> {
  try {
    const res = await fetch('/api/press', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const json = await res.json();
    return !!json.success;
  } catch {
    return false;
  }
}

export async function apiDeletePress(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/press/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    return !!json.success;
  } catch {
    return false;
  }
}

// ----------------- Protocol Briefing Sheets -----------------
export async function apiGetProtocol(): Promise<any[] | null> {
  try {
    const res = await fetch('/api/protocol');
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) return json.data;
    return null;
  } catch {
    return null;
  }
}

export async function apiSaveProtocol(item: any): Promise<boolean> {
  try {
    const res = await fetch('/api/protocol', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const json = await res.json();
    return !!json.success;
  } catch {
    return false;
  }
}

export async function apiDeleteProtocol(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/protocol/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    return !!json.success;
  } catch {
    return false;
  }
}

// ----------------- AI Bakuisasi & Transkripsi Audio -----------------
export async function apiRefineTranscriptBaku(
  transcriptText: string,
  meta?: { judulRapat?: string; jenisRapat?: string }
): Promise<{ success: boolean; refinedTranscript: string; message?: string }> {
  try {
    const res = await fetch('/api/ai/refine-transcript', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcriptText,
        judulRapat: meta?.judulRapat,
        jenisRapat: meta?.jenisRapat,
      }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return {
      success: false,
      refinedTranscript: transcriptText,
      message: err.message,
    };
  }
}

export async function apiTranscribeAudioFile(
  audioBase64: string,
  audioMimeType?: string,
  meta?: { judulRapat?: string; jenisRapat?: string }
): Promise<{ success: boolean; transcript: string; message?: string }> {
  try {
    const res = await fetch('/api/ai/transcribe-audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioBase64,
        audioMimeType,
        judulRapat: meta?.judulRapat,
        jenisRapat: meta?.jenisRapat,
      }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return {
      success: false,
      transcript: '',
      message: err.message,
    };
  }
}
