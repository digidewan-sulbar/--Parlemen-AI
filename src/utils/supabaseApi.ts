import {
  RisalahItem,
  RanperdaItem,
  RdpRecommendationItem,
  AgendaPimpinanItem,
  AnggotaDprdItem,
  NotificationItem,
} from '../types';

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
    const res = await fetch('/api/supabase/status');
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
  const res = await fetch('/api/supabase/seed-reset', { method: 'POST' });
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
