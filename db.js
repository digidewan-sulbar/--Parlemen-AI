// db.js - Supabase Client Initialization for Hostinger / Node.js
// Digunakan untuk koneksi aplikasi ke Supabase dari server Hostinger

const { createClient } = require('@supabase/supabase-js');

// Konfigurasi Project Supabase Sekretariat DPRD Sulbar (SIPASADE)
const supabaseUrl = process.env.SUPABASE_URL || 'https://ydezarlbcofzmaosuphr.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || '';

// Inisialisasi Supabase Client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = {
  supabase,
  createClient,
  supabaseUrl,
};
