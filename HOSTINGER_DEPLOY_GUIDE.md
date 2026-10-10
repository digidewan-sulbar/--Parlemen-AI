# Panduan Deploy Otomatis SIPASADE ke Hostinger via GitHub

Repositori GitHub: `https://github.com/digidewan-sulbar/sipasade.git`

---

## 1. Konfigurasi yang Sudah Disiapkan di Repository
1. **Script Build & Production**:
   - `npm run build`: Mem-bundle frontend Vite (`dist/`) sekaligus backend Express (`dist-server/server.js`).
   - `npm start`: Menjalankan server production `node dist-server/server.js`.
2. **File Manajemen Proses PM2**:
   - `ecosystem.config.cjs`: Konfigurasi bawaan PM2 untuk auto-restart dan cluster mode di Hostinger.
3. **Koneksi Supabase**:
   - `db.js` & `db.ts`: Siap terhubung ke Supabase (`https://ydezarlbcofzmaosuphr.supabase.co`).
4. **CI/CD GitHub Actions**:
   - `.github/workflows/deploy.yml`: Workflow otomatis memeriksa build setiap kali push ke branch `main`.

---

## 2. Cara Menghubungkan Hostinger Langsung ke GitHub (Opsi Paling Praktis)

### Metode A: Fitur "Git" di Control Panel Hostinger (hPanel)
1. Buka **hPanel Hostinger** Anda.
2. Masuk ke menu **Advanced** > **Git** (atau cari "Git" di kolom pencarian hPanel).
3. Isi form pembuatan repository:
   - **Repository URL**: `https://github.com/digidewan-sulbar/sipasade.git`
   - **Branch**: `main` (atau `master`)
   - **Install directory**: `public_html` (atau folder aplikasi Node.js Anda)
4. Klik **Create** / **Deploy**.
5. Buka tab **Auto Deployment / Webhook**:
   - Salin **Webhook URL** yang disediakan oleh Hostinger.
   - Buka GitHub repository Anda di `https://github.com/digidewan-sulbar/sipasade/settings/hooks`.
   - Klik **Add webhook**, tempel Webhook URL tersebut, pilih `Content type: application/json`, lalu klik **Add webhook**.
   - Sekarang, setiap kali Anda push commit ke GitHub, Hostinger otomatis menarik (`pull`) kode terbaru!

---

### Metode B: Menu Node.js di Hostinger (Node.js Application Manager)
Jika Anda menggunakan paket Cloud/VPS atau Node.js Selector di Hostinger:
1. Masuk ke **hPanel** > **Node.js** > **Create Application**.
2. Konfigurasi:
   - **Node.js version**: 20.x
   - **Application root**: folder tempat repo Anda di-clone
   - **Application startup file**: `dist-server/server.js` (atau jalankan script `start`)
   - **Application mode**: `Production`
3. Tambahkan Environment Variable di menu Hostinger:
   - `DATABASE_URL`: `postgresql://postgres:mfCDed7RmgB6E4uZ@db.ydezarlbcofzmaosuphr.supabase.co:5432/postgres`
   - `SUPABASE_URL`: `https://ydezarlbcofzmaosuphr.supabase.co`
   - `SUPABASE_ANON_KEY`: *(Key anon dari Supabase Dashboard > Project Settings > API)*
   - `NODE_ENV`: `production`
4. Jalankan perintah build sekali:
   ```bash
   npm install
   npm run build
   ```
5. Klik **Restart Application**.
