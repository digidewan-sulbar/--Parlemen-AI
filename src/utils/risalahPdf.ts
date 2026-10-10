import { RisalahItem } from '../types';

/**
 * Triggers direct PDF download/print window for a Risalah item.
 * Document title is set to Risalah_DPRD_Sulbar_[Nomor] so saving as PDF yields a clean filename.
 */
export function triggerDirectPdfDownload(risalah: RisalahItem) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Pop-up terblokir. Izinkan pop-up di browser Anda untuk mengunduh PDF.');
    return;
  }

  const cleanNomor = risalah.nomorRisalah.replace(/[\/\\:]/g, '_');
  const filename = `Risalah_DPRD_Sulbar_${cleanNomor}`;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm 20mm 20mm 20mm;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 0;
            font-size: 12pt;
            line-height: 1.5;
          }
          .header-kop {
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 3px solid #000;
            padding-bottom: 8px;
            margin-bottom: 2px;
            position: relative;
          }
          .header-kop img {
            width: 80px;
            height: auto;
            position: absolute;
            left: 10px;
            top: 0;
          }
          .kop-text {
            text-align: center;
            margin-left: 90px;
          }
          .kop-text h2 {
            font-size: 14pt;
            font-weight: bold;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .kop-text h1 {
            font-size: 17pt;
            font-weight: bold;
            margin: 2px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .kop-text p {
            font-size: 9.5pt;
            margin: 1px 0;
            color: #222;
          }
          .doc-title {
            text-align: center;
            margin-top: 14px;
            margin-bottom: 16px;
          }
          .doc-title h3 {
            font-size: 13pt;
            font-weight: bold;
            text-decoration: underline;
            margin: 0 0 4px 0;
            text-transform: uppercase;
          }
          .doc-title p {
            font-size: 11pt;
            margin: 0;
            font-family: monospace;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
          }
          .info-table td {
            padding: 5px 8px;
            vertical-align: top;
            font-size: 11pt;
          }
          .info-table tr td:first-child {
            width: 28%;
            font-weight: bold;
          }
          .info-table tr td:nth-child(2) {
            width: 3%;
          }
          .section-box {
            margin-bottom: 16px;
          }
          .section-title {
            font-size: 11pt;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1.5px solid #000;
            padding-bottom: 3px;
            margin-bottom: 8px;
          }
          ul, ol {
            margin: 4px 0 8px 22px;
            padding: 0;
          }
          li {
            margin-bottom: 4px;
          }
          .transcript-item {
            margin-bottom: 8px;
            padding-left: 10px;
            border-left: 2px solid #666;
          }
          .speaker-name {
            font-weight: bold;
            text-decoration: underline;
          }
          .speaker-time {
            font-size: 10pt;
            color: #444;
            font-style: italic;
          }
          .ttd-section {
            margin-top: 35px;
            display: flex;
            justify-content: space-between;
            page-break-inside: avoid;
          }
          .ttd-box {
            width: 45%;
            text-align: center;
            font-size: 11pt;
          }
          .ttd-space {
            height: 65px;
          }
        </style>
      </head>
      <body>
        <!-- Kop Surat -->
        <div class="header-kop">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/63/Logo_DPRD_Sulawesi_Barat.png" alt="Logo DPRD" />
          <div class="kop-text">
            <h2>DEWAN PERWAKILAN RAKYAT DAERAH</h2>
            <h1>PROVINSI SULAWESI BARAT</h1>
            <p>Jalan Abdul Malik Pattana Endeng, Rangas, Simboro, Kabupaten Mamuju, Sulawesi Barat 91512</p>
            <p>Telepon: (0426) 2322334 | Email: sekretariat@dprd.sulbarprov.go.id | Website: dprd.sulbarprov.go.id</p>
          </div>
        </div>
        <div style="border-bottom: 1px solid #000; margin-bottom: 18px;"></div>

        <!-- Title -->
        <div class="doc-title">
          <h3>RISALAH RESMI PERSIDANGAN DEWAN</h3>
          <p>Nomor: ${risalah.nomorRisalah}</p>
        </div>

        <!-- Meta Table -->
        <table class="info-table">
          <tbody>
            <tr>
              <td>Jenis Rapat</td>
              <td>:</td>
              <td>${risalah.jenisRapat}</td>
            </tr>
            <tr>
              <td>Judul / Agenda Rapat</td>
              <td>:</td>
              <td>${risalah.judulRapat}</td>
            </tr>
            <tr>
              <td>Hari / Tanggal / Waktu</td>
              <td>:</td>
              <td>${risalah.hariTanggalWaktu}</td>
            </tr>
            <tr>
              <td>Pimpinan Rapat</td>
              <td>:</td>
              <td>${risalah.pimpinanRapat}</td>
            </tr>
            <tr>
              <td>Anggota Hadir</td>
              <td>:</td>
              <td>${risalah.anggotaHadir}</td>
            </tr>
            ${risalah.namaNotulis ? `
            <tr>
              <td>Notulis / Pembuat Risalah</td>
              <td>:</td>
              <td>${risalah.namaNotulis} ${risalah.nipNotulis ? `(NIP. ${risalah.nipNotulis})` : ''}</td>
            </tr>
            ` : ''}
          </tbody>
        </table>

        <!-- Section 1: Transkrip Pembicara -->
        ${risalah.transkripPembicara && risalah.transkripPembicara.length > 0 ? `
        <div class="section-box">
          <div class="section-title">I. TRANSKRIP & PERNYATAAN PEMBICARA PERSIDANGAN</div>
          ${risalah.transkripPembicara.map(t => `
            <div class="transcript-item">
              <div>
                <span class="speaker-name">${t.pembicara}</span>
                <span class="speaker-time">(${t.timestamp})</span>
              </div>
              <div style="font-style: italic; margin-top: 2px;">
                ${t.pernyataan}
              </div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Section 2: Resume Poin Utama -->
        ${risalah.resumePoinUtama && risalah.resumePoinUtama.length > 0 ? `
        <div class="section-box">
          <div class="section-title">II. RESUME POIN-POIN UTAMA PERMUSDOKAN</div>
          <ul>
            ${risalah.resumePoinUtama.map(poin => `<li>${poin}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <!-- Section 3: Kesimpulan & Keputusan -->
        ${risalah.kesimpulanKeputusan && risalah.kesimpulanKeputusan.length > 0 ? `
        <div class="section-box">
          <div class="section-title">III. KESIMPULAN DAN KEPUTUSAN RAPAT</div>
          <ol>
            ${risalah.kesimpulanKeputusan.map(kes => `<li><strong>${kes}</strong></li>`).join('')}
          </ol>
        </div>
        ` : ''}

        <!-- Signatures -->
        <div class="ttd-section">
          <div class="ttd-box">
            <p style="margin: 0; font-weight: 600;">Pembuat Risalah Persidangan,</p>
            <p style="margin: 0; font-weight: bold;">Notulis / Sekretariat DPRD</p>
            <div class="ttd-space"></div>
            <p style="margin: 0; font-weight: bold; text-decoration: underline;">${risalah.namaNotulis || 'Arianto, AP, M.M.'}</p>
            <p style="margin: 0; font-size: 10pt; color: #333;">${risalah.nipNotulis ? `NIP. ${risalah.nipNotulis}` : 'NIP. 19720412 199803 1 004'}</p>
          </div>

          <div class="ttd-box">
            <p style="margin: 0; font-weight: 600;">Mengetahui / Mengesahkan,</p>
            <p style="margin: 0; font-weight: bold;">Pimpinan Rapat DPRD Prov. Sulbar</p>
            <div class="ttd-space"></div>
            <p style="margin: 0; font-weight: bold; text-decoration: underline;">${risalah.pimpinanRapat}</p>
            <p style="margin: 0; font-size: 10pt; color: #333;">Ketua / Wakil Ketua DPRD Prov. Sulbar</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 400);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
