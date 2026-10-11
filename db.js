// db.js - Supabase Client Initialization for Hostinger / Node.js
// Digunakan untuk koneksi aplikasi ke Supabase dari server Hostinger

const { createClient } = require('@supabase/supabase-js');

// Konfigurasi Project Supabase Sekretariat DPRD Sulbar (SIPASADE)
const supabaseUrl = process.env.SUPABASE_URL || 'https://ydezarlbcofzmaosuphr.supabase.co';
const supabaseKey =
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy-key-fallback';

// Inisialisasi Supabase Client secara aman
let supabase = null;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (err) {
  console.warn('[db.js] Supabase Client initialization warning:', err.message);
}

module.exports = {
  supabase,
  createClient,
  supabaseUrl,
  getSupabase: () => supabase,
};
