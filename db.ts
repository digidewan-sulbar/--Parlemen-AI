import { Pool } from 'pg';
import dotenv from 'dotenv';
import {
  INITIAL_RANPERDA,
  INITIAL_RISALAH,
  INITIAL_RDP_RECOMMENDATIONS,
  INITIAL_AGENDA_PIMPINAN,
  INITIAL_PRESS_RELEASES,
  INITIAL_PROTOCOL_SHEETS,
  INITIAL_ANGGOTA_DPRD,
  INITIAL_NOTIFICATIONS,
} from './src/data/initialData';

dotenv.config();

// User-provided Supabase connection string
const SUPABASE_DB_URL =
  process.env.SUPABASE_DB_URL ||
  process.env.DATABASE_URL ||
  'postgresql://postgres:mfCDed7RmgB6E4uZ@db.ydezarlbcofzmaosuphr.supabase.co:5432/postgres';

export const pool = new Pool({
  connectionString: SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Guard against idle connection drops crashing the Node.js process
pool.on('error', (err) => {
  console.warn('[Supabase DB Pool] Idle client warning (safe):', err.message);
});

export async function testDbConnection() {
  try {
    const res = await pool.query('SELECT current_database(), version(), now();');
    return {
      connected: true,
      database: res.rows[0].current_database,
      version: res.rows[0].version,
      now: res.rows[0].now,
      projectUrl: 'https://ydezarlbcofzmaosuphr.supabase.co',
      host: 'db.ydezarlbcofzmaosuphr.supabase.co',
    };
  } catch (error: any) {
    console.error('Database connection test failed:', error.message);
    return {
      connected: false,
      error: error.message,
      projectUrl: 'https://ydezarlbcofzmaosuphr.supabase.co',
    };
  }
}

export async function initDatabase() {
  console.log('[Supabase DB] Initializing tables and schema...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Table risalah
    await client.query(`
      CREATE TABLE IF NOT EXISTS risalah (
        id VARCHAR(100) PRIMARY KEY,
        nomor_risalah VARCHAR(255),
        judul_rapat TEXT NOT NULL,
        jenis_rapat VARCHAR(100),
        hari_tanggal_waktu VARCHAR(255),
        pimpinan_rapat TEXT,
        anggota_hadir TEXT,
        transkrip_pembicara JSONB DEFAULT '[]'::jsonb,
        resume_poin_utama JSONB DEFAULT '[]'::jsonb,
        kesimpulan_keputusan JSONB DEFAULT '[]'::jsonb,
        sentimen_summary JSONB DEFAULT '{}'::jsonb,
        audio_file_url TEXT,
        created_date VARCHAR(50),
        nama_notulis VARCHAR(255),
        nip_notulis VARCHAR(100),
        status_tahap VARCHAR(100),
        progress_persen INTEGER DEFAULT 0,
        tahap_tracking JSONB DEFAULT '[]'::jsonb,
        audit_logs JSONB DEFAULT '[]'::jsonb,
        topik_kategori VARCHAR(255),
        kata_kunci_pintar JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Table ranperda
    await client.query(`
      CREATE TABLE IF NOT EXISTS ranperda (
        id VARCHAR(100) PRIMARY KEY,
        nomor_ranperda VARCHAR(255),
        judul_ranperda TEXT NOT NULL,
        inisiator VARCHAR(255),
        komisi_pengampu VARCHAR(100),
        tahapan_ke INTEGER,
        nama_tahapan VARCHAR(255),
        tanggal_mulai VARCHAR(50),
        target_sla_days INTEGER,
        sisa_hari_sla INTEGER,
        status_sla VARCHAR(100),
        keterangan_progres TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Table rdp_recommendations
    await client.query(`
      CREATE TABLE IF NOT EXISTS rdp_recommendations (
        id VARCHAR(100) PRIMARY KEY,
        nomor_rdp VARCHAR(255),
        judul_rdp TEXT NOT NULL,
        komisi VARCHAR(100),
        opd_penanggung_jawab VARCHAR(255),
        poin_catatan TEXT,
        perintah_tindak_lanjut TEXT,
        status VARCHAR(100),
        tenggat_waktu VARCHAR(50),
        bukti_tindak_lanjut JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 4. Table agenda_pimpinan
    await client.query(`
      CREATE TABLE IF NOT EXISTS agenda_pimpinan (
        id VARCHAR(100) PRIMARY KEY,
        tanggal_waktu VARCHAR(255),
        nama_kegiatan TEXT NOT NULL,
        lokasi TEXT,
        pimpinan_bertugas VARCHAR(255),
        instansi_terkait VARCHAR(255),
        disposisi_catatan TEXT,
        file_bahan_pdf_url TEXT,
        status VARCHAR(100),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 5. Table press_releases
    await client.query(`
      CREATE TABLE IF NOT EXISTS press_releases (
        id VARCHAR(100) PRIMARY KEY,
        judul_berita TEXT NOT NULL,
        tanggal_rilis VARCHAR(50),
        kategori VARCHAR(100),
        jumlah_kata INTEGER,
        konten_berita TEXT,
        status VARCHAR(100),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 6. Table protocol_briefing_sheets
    await client.query(`
      CREATE TABLE IF NOT EXISTS protocol_briefing_sheets (
        id VARCHAR(100) PRIMARY KEY,
        nama_acara TEXT NOT NULL,
        tanggal_waktu VARCHAR(255),
        pimpinan_hadir TEXT,
        ringkasan_agenda TEXT,
        rundown JSONB DEFAULT '[]'::jsonb,
        seating_arrangement TEXT,
        penanggung_jawab VARCHAR(255),
        poin_penting_pimpinan JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 7. Table anggota_dprd
    await client.query(`
      CREATE TABLE IF NOT EXISTS anggota_dprd (
        id VARCHAR(100) PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        jabatan VARCHAR(255),
        kategori VARCHAR(100),
        fraksi_partai VARCHAR(255),
        no_hp VARCHAR(50),
        kelengkapan_lain VARCHAR(255),
        foto_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 8. Table notifications
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(100) PRIMARY KEY,
        type VARCHAR(100),
        title TEXT NOT NULL,
        message TEXT,
        timestamp VARCHAR(100),
        target_role VARCHAR(100),
        is_read BOOLEAN DEFAULT FALSE,
        target_pillar VARCHAR(100),
        target_doc_id VARCHAR(100),
        target_doc_type VARCHAR(100),
        meta JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 9. Table system_meta
    await client.query(`
      CREATE TABLE IF NOT EXISTS system_meta (
        key VARCHAR(100) PRIMARY KEY,
        value JSONB,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Add indexes for search performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_risalah_jenis ON risalah(jenis_rapat);
      CREATE INDEX IF NOT EXISTS idx_risalah_status ON risalah(status_tahap);
      CREATE INDEX IF NOT EXISTS idx_ranperda_komisi ON ranperda(komisi_pengampu);
      CREATE INDEX IF NOT EXISTS idx_rdp_opd ON rdp_recommendations(opd_penanggung_jawab);
      CREATE INDEX IF NOT EXISTS idx_rdp_status ON rdp_recommendations(status);
      CREATE INDEX IF NOT EXISTS idx_notifications_role ON notifications(target_role);
      CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
    `);

    await client.query('COMMIT');
    console.log('[Supabase DB] Tables & indexes initialized successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[Supabase DB] Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function seedDatabaseIfEmpty() {
  console.log('[Supabase DB] Checking data counts for initial seed...');
  const client = await pool.connect();
  try {
    // Check risalah
    const rCount = await client.query('SELECT COUNT(*) FROM risalah');
    if (parseInt(rCount.rows[0].count, 10) === 0) {
      console.log('[Supabase DB] Seeding initial risalah data...');
      for (const item of INITIAL_RISALAH) {
        await client.query(
          `INSERT INTO risalah (
            id, nomor_risalah, judul_rapat, jenis_rapat, hari_tanggal_waktu, pimpinan_rapat, anggota_hadir,
            transkrip_pembicara, resume_poin_utama, kesimpulan_keputusan, sentimen_summary, audio_file_url,
            created_date, nama_notulis, nip_notulis, status_tahap, progress_persen, tahap_tracking, audit_logs,
            topik_kategori, kata_kunci_pintar
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
          ON CONFLICT (id) DO NOTHING`,
          [
            item.id,
            item.nomorRisalah,
            item.judulRapat,
            item.jenisRapat,
            item.hariTanggalWaktu,
            item.pimpinanRapat,
            item.anggotaHadir,
            JSON.stringify(item.transkripPembicara || []),
            JSON.stringify(item.resumePoinUtama || []),
            JSON.stringify(item.kesimpulanKeputusan || []),
            JSON.stringify(item.sentimenSummary || {}),
            item.audioFileUrl || null,
            item.createdDate,
            item.namaNotulis || null,
            item.nipNotulis || null,
            item.statusTahap || '4. Verifikasi & Telaah Notulis',
            item.progressPersen || 50,
            JSON.stringify(item.tahapTracking || []),
            JSON.stringify(item.auditLogs || []),
            item.topikKategori || null,
            JSON.stringify(item.kataKunciPintar || []),
          ]
        );
      }
    }

    // Check ranperda
    const rpCount = await client.query('SELECT COUNT(*) FROM ranperda');
    if (parseInt(rpCount.rows[0].count, 10) === 0) {
      console.log('[Supabase DB] Seeding initial ranperda data...');
      for (const item of INITIAL_RANPERDA) {
        await client.query(
          `INSERT INTO ranperda (
            id, nomor_ranperda, judul_ranperda, inisiator, komisi_pengampu, tahapan_ke,
            nama_tahapan, tanggal_mulai, target_sla_days, sisa_hari_sla, status_sla, keterangan_progres
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (id) DO NOTHING`,
          [
            item.id,
            item.nomorRanperda,
            item.judulRanperda,
            item.inisiator,
            item.komisiPengampu,
            item.tahapanKe,
            item.namaTahapan,
            item.tanggalMulai,
            item.targetSlaDays,
            item.sisaHariSla,
            item.statusSla,
            item.keteranganProgres,
          ]
        );
      }
    }

    // Check rdp recommendations
    const rdpCount = await client.query('SELECT COUNT(*) FROM rdp_recommendations');
    if (parseInt(rdpCount.rows[0].count, 10) === 0) {
      console.log('[Supabase DB] Seeding initial RDP recommendations...');
      for (const item of INITIAL_RDP_RECOMMENDATIONS) {
        await client.query(
          `INSERT INTO rdp_recommendations (
            id, nomor_rdp, judul_rdp, komisi, opd_penanggung_jawab, poin_catatan,
            perintah_tindak_lanjut, status, tenggat_waktu, bukti_tindak_lanjut
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO NOTHING`,
          [
            item.id,
            item.nomorRdp,
            item.judulRdp,
            item.komisi,
            item.opdPenanggungJawab,
            item.poinCatatan,
            item.perintahTindakLanjut,
            item.status,
            item.tenggatWaktu,
            item.buktiTindakLanjut ? JSON.stringify(item.buktiTindakLanjut) : null,
          ]
        );
      }
    }

    // Check agenda pimpinan
    const agCount = await client.query('SELECT COUNT(*) FROM agenda_pimpinan');
    if (parseInt(agCount.rows[0].count, 10) === 0) {
      console.log('[Supabase DB] Seeding initial agenda pimpinan...');
      for (const item of INITIAL_AGENDA_PIMPINAN) {
        await client.query(
          `INSERT INTO agenda_pimpinan (
            id, tanggal_waktu, nama_kegiatan, lokasi, pimpinan_bertugas, instansi_terkait,
            disposisi_catatan, file_bahan_pdf_url, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO NOTHING`,
          [
            item.id,
            item.tanggalWaktu,
            item.namaKegiatan,
            item.lokasi,
            item.pimpinanBertugas,
            item.instansiTerkait,
            item.disposisiCatatan,
            item.fileBahanPdfUrl || null,
            item.status,
          ]
        );
      }
    }

    // Check press releases
    const prCount = await client.query('SELECT COUNT(*) FROM press_releases');
    if (parseInt(prCount.rows[0].count, 10) === 0) {
      console.log('[Supabase DB] Seeding initial press releases...');
      for (const item of INITIAL_PRESS_RELEASES) {
        await client.query(
          `INSERT INTO press_releases (
            id, judul_berita, tanggal_rilis, kategori, jumlah_kata, konten_berita, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO NOTHING`,
          [
            item.id,
            item.judulBerita,
            item.tanggalRilis,
            item.kategori,
            item.jumlahKata,
            item.kontenBerita,
            item.status,
          ]
        );
      }
    }

    // Check protocol briefing sheets
    const protoCount = await client.query('SELECT COUNT(*) FROM protocol_briefing_sheets');
    if (parseInt(protoCount.rows[0].count, 10) === 0) {
      console.log('[Supabase DB] Seeding initial protocol sheets...');
      for (const item of INITIAL_PROTOCOL_SHEETS) {
        await client.query(
          `INSERT INTO protocol_briefing_sheets (
            id, nama_acara, tanggal_waktu, pimpinan_hadir, ringkasan_agenda,
            rundown, seating_arrangement, penanggung_jawab, poin_penting_pimpinan
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO NOTHING`,
          [
            item.id,
            item.namaAcara,
            item.tanggalWaktu,
            item.pimpinanHadir,
            item.ringkasanAgenda,
            JSON.stringify(item.rundown || []),
            item.seatingArrangement,
            item.penanggungJawab,
            JSON.stringify(item.poinPentingPimpinan || []),
          ]
        );
      }
    }

    // Check anggota dprd
    const memCount = await client.query('SELECT COUNT(*) FROM anggota_dprd');
    if (parseInt(memCount.rows[0].count, 10) === 0) {
      console.log('[Supabase DB] Seeding initial anggota DPRD Sulbar...');
      for (const item of INITIAL_ANGGOTA_DPRD) {
        await client.query(
          `INSERT INTO anggota_dprd (
            id, nama, jabatan, kategori, fraksi_partai, no_hp, kelengkapan_lain, foto_url
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING`,
          [
            item.id,
            item.nama,
            item.jabatan,
            item.kategori,
            item.fraksiPartai,
            item.noHp,
            item.kelengkapanLain,
            item.fotoUrl || null,
          ]
        );
      }
    }

    // Check notifications
    const notifCount = await client.query('SELECT COUNT(*) FROM notifications');
    if (parseInt(notifCount.rows[0].count, 10) === 0) {
      console.log('[Supabase DB] Seeding initial notifications...');
      for (const item of INITIAL_NOTIFICATIONS) {
        await client.query(
          `INSERT INTO notifications (
            id, type, title, message, timestamp, target_role, is_read,
            target_pillar, target_doc_id, target_doc_type, meta
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO NOTHING`,
          [
            item.id,
            item.type,
            item.title,
            item.message,
            item.timestamp,
            item.targetRole,
            item.isRead,
            item.targetPillar || null,
            item.targetDocId || null,
            item.targetDocType || null,
            JSON.stringify(item.meta || {}),
          ]
        );
      }
    }

    console.log('[Supabase DB] Database seed completed successfully!');
  } catch (error) {
    console.error('[Supabase DB] Error seeding database:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getDatabaseStats() {
  const client = await pool.connect();
  try {
    const risalah = await client.query('SELECT COUNT(*) FROM risalah');
    const ranperda = await client.query('SELECT COUNT(*) FROM ranperda');
    const rdp = await client.query('SELECT COUNT(*) FROM rdp_recommendations');
    const agenda = await client.query('SELECT COUNT(*) FROM agenda_pimpinan');
    const press = await client.query('SELECT COUNT(*) FROM press_releases');
    const protocol = await client.query('SELECT COUNT(*) FROM protocol_briefing_sheets');
    const anggota = await client.query('SELECT COUNT(*) FROM anggota_dprd');
    const notifs = await client.query('SELECT COUNT(*) FROM notifications');

    return {
      risalah: parseInt(risalah.rows[0].count, 10),
      ranperda: parseInt(ranperda.rows[0].count, 10),
      rdp: parseInt(rdp.rows[0].count, 10),
      agenda: parseInt(agenda.rows[0].count, 10),
      press: parseInt(press.rows[0].count, 10),
      protocol: parseInt(protocol.rows[0].count, 10),
      anggota: parseInt(anggota.rows[0].count, 10),
      notifications: parseInt(notifs.rows[0].count, 10),
    };
  } finally {
    client.release();
  }
}

// ----------------------------------------------------
// CRUD DAO Helpers
// ----------------------------------------------------

// RISALAH
export async function dbGetAllRisalah() {
  const res = await pool.query('SELECT * FROM risalah ORDER BY created_at DESC');
  return res.rows.map((row) => ({
    id: row.id,
    nomorRisalah: row.nomor_risalah,
    judulRapat: row.judul_rapat,
    jenisRapat: row.jenis_rapat,
    hariTanggalWaktu: row.hari_tanggal_waktu,
    pimpinanRapat: row.pimpinan_rapat,
    anggotaHadir: row.anggota_hadir,
    transkripPembicara: row.transkrip_pembicara || [],
    resumePoinUtama: row.resume_poin_utama || [],
    kesimpulanKeputusan: row.kesimpulan_keputusan || [],
    sentimenSummary: row.sentimen_summary || {},
    audioFileUrl: row.audio_file_url,
    createdDate: row.created_date,
    namaNotulis: row.nama_notulis,
    nipNotulis: row.nip_notulis,
    statusTahap: row.status_tahap,
    progressPersen: row.progress_persen,
    tahapTracking: row.tahap_tracking || [],
    auditLogs: row.audit_logs || [],
    topikKategori: row.topik_kategori,
    kataKunciPintar: row.kata_kunci_pintar || [],
  }));
}

export async function dbInsertRisalah(item: any) {
  const query = `
    INSERT INTO risalah (
      id, nomor_risalah, judul_rapat, jenis_rapat, hari_tanggal_waktu, pimpinan_rapat, anggota_hadir,
      transkrip_pembicara, resume_poin_utama, kesimpulan_keputusan, sentimen_summary, audio_file_url,
      created_date, nama_notulis, nip_notulis, status_tahap, progress_persen, tahap_tracking, audit_logs,
      topik_kategori, kata_kunci_pintar, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, NOW())
    ON CONFLICT (id) DO UPDATE SET
      nomor_risalah = EXCLUDED.nomor_risalah,
      judul_rapat = EXCLUDED.judul_rapat,
      jenis_rapat = EXCLUDED.jenis_rapat,
      hari_tanggal_waktu = EXCLUDED.hari_tanggal_waktu,
      pimpinan_rapat = EXCLUDED.pimpinan_rapat,
      anggota_hadir = EXCLUDED.anggota_hadir,
      transkrip_pembicara = EXCLUDED.transkrip_pembicara,
      resume_poin_utama = EXCLUDED.resume_poin_utama,
      kesimpulan_keputusan = EXCLUDED.kesimpulan_keputusan,
      sentimen_summary = EXCLUDED.sentimen_summary,
      audio_file_url = EXCLUDED.audio_file_url,
      created_date = EXCLUDED.created_date,
      nama_notulis = EXCLUDED.nama_notulis,
      nip_notulis = EXCLUDED.nip_notulis,
      status_tahap = EXCLUDED.status_tahap,
      progress_persen = EXCLUDED.progress_persen,
      tahap_tracking = EXCLUDED.tahap_tracking,
      audit_logs = EXCLUDED.audit_logs,
      topik_kategori = EXCLUDED.topik_kategori,
      kata_kunci_pintar = EXCLUDED.kata_kunci_pintar,
      updated_at = NOW()
    RETURNING *;
  `;
  const res = await pool.query(query, [
    item.id,
    item.nomorRisalah || '',
    item.judulRapat || '',
    item.jenisRapat || 'Rapat Paripurna',
    item.hariTanggalWaktu || '',
    item.pimpinanRapat || '',
    item.anggotaHadir || '',
    JSON.stringify(item.transkripPembicara || []),
    JSON.stringify(item.resumePoinUtama || []),
    JSON.stringify(item.kesimpulanKeputusan || []),
    JSON.stringify(item.sentimenSummary || {}),
    item.audioFileUrl || null,
    item.createdDate || new Date().toISOString().split('T')[0],
    item.namaNotulis || '',
    item.nipNotulis || '',
    item.statusTahap || '4. Verifikasi & Telaah Notulis',
    item.progressPersen || 50,
    JSON.stringify(item.tahapTracking || []),
    JSON.stringify(item.auditLogs || []),
    item.topikKategori || '',
    JSON.stringify(item.kataKunciPintar || []),
  ]);
  return res.rows[0];
}

export async function dbDeleteRisalah(id: string) {
  const res = await pool.query('DELETE FROM risalah WHERE id = $1 RETURNING id;', [id]);
  return res.rowCount && res.rowCount > 0;
}

// RANPERDA
export async function dbGetAllRanperda() {
  const res = await pool.query('SELECT * FROM ranperda ORDER BY tahapan_ke ASC, created_at DESC');
  return res.rows.map((r) => ({
    id: r.id,
    nomorRanperda: r.nomor_ranperda,
    judulRanperda: r.judul_ranperda,
    inisiator: r.inisiator,
    komisiPengampu: r.komisi_pengampu,
    tahapanKe: r.tahapan_ke,
    namaTahapan: r.nama_tahapan,
    tanggalMulai: r.tanggal_mulai,
    targetSlaDays: r.target_sla_days,
    sisaHariSla: r.sisa_hari_sla,
    statusSla: r.status_sla,
    keteranganProgres: r.keterangan_progres,
  }));
}

export async function dbInsertRanperda(item: any) {
  const query = `
    INSERT INTO ranperda (
      id, nomor_ranperda, judul_ranperda, inisiator, komisi_pengampu, tahapan_ke,
      nama_tahapan, tanggal_mulai, target_sla_days, sisa_hari_sla, status_sla, keterangan_progres, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
    ON CONFLICT (id) DO UPDATE SET
      nomor_ranperda = EXCLUDED.nomor_ranperda,
      judul_ranperda = EXCLUDED.judul_ranperda,
      inisiator = EXCLUDED.inisiator,
      komisi_pengampu = EXCLUDED.komisi_pengampu,
      tahapan_ke = EXCLUDED.tahapan_ke,
      nama_tahapan = EXCLUDED.nama_tahapan,
      tanggal_mulai = EXCLUDED.tanggal_mulai,
      target_sla_days = EXCLUDED.target_sla_days,
      sisa_hari_sla = EXCLUDED.sisa_hari_sla,
      status_sla = EXCLUDED.status_sla,
      keterangan_progres = EXCLUDED.keterangan_progres,
      updated_at = NOW()
    RETURNING *;
  `;
  const res = await pool.query(query, [
    item.id,
    item.nomorRanperda,
    item.judulRanperda,
    item.inisiator,
    item.komisiPengampu,
    item.tahapanKe,
    item.namaTahapan,
    item.tanggalMulai,
    item.targetSlaDays,
    item.sisaHariSla,
    item.statusSla,
    item.keteranganProgres,
  ]);
  return res.rows[0];
}

export async function dbDeleteRanperda(id: string) {
  const res = await pool.query('DELETE FROM ranperda WHERE id = $1 RETURNING id;', [id]);
  return res.rowCount && res.rowCount > 0;
}

// RDP RECOMMENDATIONS
export async function dbGetAllRdp() {
  const res = await pool.query('SELECT * FROM rdp_recommendations ORDER BY created_at DESC');
  return res.rows.map((r) => ({
    id: r.id,
    nomorRdp: r.nomor_rdp,
    judulRdp: r.judul_rdp,
    komisi: r.komisi,
    opdPenanggungJawab: r.opd_penanggung_jawab,
    poinCatatan: r.poin_catatan,
    perintahTindakLanjut: r.perintah_tindak_lanjut,
    status: r.status,
    tenggatWaktu: r.tenggat_waktu,
    buktiTindakLanjut: r.bukti_tindak_lanjut,
  }));
}

export async function dbInsertRdp(item: any) {
  const query = `
    INSERT INTO rdp_recommendations (
      id, nomor_rdp, judul_rdp, komisi, opd_penanggung_jawab, poin_catatan,
      perintah_tindak_lanjut, status, tenggat_waktu, bukti_tindak_lanjut, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
    ON CONFLICT (id) DO UPDATE SET
      nomor_rdp = EXCLUDED.nomor_rdp,
      judul_rdp = EXCLUDED.judul_rdp,
      komisi = EXCLUDED.komisi,
      opd_penanggung_jawab = EXCLUDED.opd_penanggung_jawab,
      poin_catatan = EXCLUDED.poin_catatan,
      perintah_tindak_lanjut = EXCLUDED.perintah_tindak_lanjut,
      status = EXCLUDED.status,
      tenggat_waktu = EXCLUDED.tenggat_waktu,
      bukti_tindak_lanjut = EXCLUDED.bukti_tindak_lanjut,
      updated_at = NOW()
    RETURNING *;
  `;
  const res = await pool.query(query, [
    item.id,
    item.nomorRdp,
    item.judulRdp,
    item.komisi,
    item.opdPenanggungJawab,
    item.poinCatatan,
    item.perintahTindakLanjut,
    item.status,
    item.tenggatWaktu,
    item.buktiTindakLanjut ? JSON.stringify(item.buktiTindakLanjut) : null,
  ]);
  return res.rows[0];
}

export async function dbDeleteRdp(id: string) {
  const res = await pool.query('DELETE FROM rdp_recommendations WHERE id = $1 RETURNING id;', [id]);
  return res.rowCount && res.rowCount > 0;
}

// AGENDA PIMPINAN
export async function dbGetAllAgenda() {
  const res = await pool.query('SELECT * FROM agenda_pimpinan ORDER BY created_at DESC');
  return res.rows.map((r) => ({
    id: r.id,
    tanggalWaktu: r.tanggal_waktu,
    namaKegiatan: r.nama_kegiatan,
    lokasi: r.lokasi,
    pimpinanBertugas: r.pimpinan_bertugas,
    instansiTerkait: r.instansi_terkait,
    disposisiCatatan: r.disposisi_catatan,
    fileBahanPdfUrl: r.file_bahan_pdf_url,
    status: r.status,
  }));
}

export async function dbInsertAgenda(item: any) {
  const query = `
    INSERT INTO agenda_pimpinan (
      id, tanggal_waktu, nama_kegiatan, lokasi, pimpinan_bertugas, instansi_terkait,
      disposisi_catatan, file_bahan_pdf_url, status, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
    ON CONFLICT (id) DO UPDATE SET
      tanggal_waktu = EXCLUDED.tanggal_waktu,
      nama_kegiatan = EXCLUDED.nama_kegiatan,
      lokasi = EXCLUDED.lokasi,
      pimpinan_bertugas = EXCLUDED.pimpinan_bertugas,
      instansi_terkait = EXCLUDED.instansi_terkait,
      disposisi_catatan = EXCLUDED.disposisi_catatan,
      file_bahan_pdf_url = EXCLUDED.file_bahan_pdf_url,
      status = EXCLUDED.status,
      updated_at = NOW()
    RETURNING *;
  `;
  const res = await pool.query(query, [
    item.id,
    item.tanggalWaktu,
    item.namaKegiatan,
    item.lokasi,
    item.pimpinanBertugas,
    item.instansiTerkait,
    item.disposisiCatatan,
    item.fileBahanPdfUrl || null,
    item.status,
  ]);
  return res.rows[0];
}

export async function dbDeleteAgenda(id: string) {
  const res = await pool.query('DELETE FROM agenda_pimpinan WHERE id = $1 RETURNING id;', [id]);
  return res.rowCount && res.rowCount > 0;
}

// ANGGOTA DPRD
export async function dbGetAllAnggota() {
  const res = await pool.query('SELECT * FROM anggota_dprd ORDER BY created_at ASC');
  return res.rows.map((r) => ({
    id: r.id,
    nama: r.nama,
    jabatan: r.jabatan,
    kategori: r.kategori,
    fraksiPartai: r.fraksi_partai,
    noHp: r.no_hp,
    kelengkapanLain: r.kelengkapan_lain,
    fotoUrl: r.foto_url,
  }));
}

export async function dbInsertAnggota(item: any) {
  const query = `
    INSERT INTO anggota_dprd (
      id, nama, jabatan, kategori, fraksi_partai, no_hp, kelengkapan_lain, foto_url, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    ON CONFLICT (id) DO UPDATE SET
      nama = EXCLUDED.nama,
      jabatan = EXCLUDED.jabatan,
      kategori = EXCLUDED.kategori,
      fraksi_partai = EXCLUDED.fraksi_partai,
      no_hp = EXCLUDED.no_hp,
      kelengkapan_lain = EXCLUDED.kelengkapan_lain,
      foto_url = EXCLUDED.foto_url,
      updated_at = NOW()
    RETURNING *;
  `;
  const res = await pool.query(query, [
    item.id,
    item.nama,
    item.jabatan,
    item.kategori,
    item.fraksiPartai,
    item.noHp,
    item.kelengkapanLain,
    item.fotoUrl || null,
  ]);
  return res.rows[0];
}

export async function dbDeleteAnggota(id: string) {
  const res = await pool.query('DELETE FROM anggota_dprd WHERE id = $1 RETURNING id;', [id]);
  return res.rowCount && res.rowCount > 0;
}

// NOTIFICATIONS
export async function dbGetAllNotifications() {
  const res = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC');
  return res.rows.map((r) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    message: r.message,
    timestamp: r.timestamp,
    targetRole: r.target_role,
    isRead: r.is_read,
    targetPillar: r.target_pillar,
    targetDocId: r.target_doc_id,
    targetDocType: r.target_doc_type,
    meta: r.meta || {},
  }));
}

export async function dbInsertNotification(item: any) {
  const query = `
    INSERT INTO notifications (
      id, type, title, message, timestamp, target_role, is_read,
      target_pillar, target_doc_id, target_doc_type, meta
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    ON CONFLICT (id) DO UPDATE SET
      is_read = EXCLUDED.is_read
    RETURNING *;
  `;
  const res = await pool.query(query, [
    item.id,
    item.type,
    item.title,
    item.message,
    item.timestamp,
    item.targetRole,
    item.isRead ?? false,
    item.targetPillar || null,
    item.targetDocId || null,
    item.targetDocType || null,
    JSON.stringify(item.meta || {}),
  ]);
  return res.rows[0];
}

export async function dbMarkNotificationRead(id: string) {
  await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = $1', [id]);
}

export async function dbMarkAllNotificationsRead() {
  await pool.query('UPDATE notifications SET is_read = TRUE');
}

