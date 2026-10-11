import { RisalahItem } from '../types';

/**
 * Triggers direct PDF download / print window for a Risalah item.
 * Layout and formatting precisely aligns 100% with:
 * 1. RisalahPdfModal (in-app preview)
 * 2. Standard Tata Naskah Dinas DPRD Provinsi Sulawesi Barat
 * 3. Including: Ruangan Rapat, Agenda, Jenis, Waktu, Pimpinan, Kehadiran,
 *    Section I (Resume Poin), Section II (Kesimpulan Resmi), Section III (Transkrip),
 *    and Dual-Signature (Notulis & Pimpinan Rapat DPRD Prov. Sulbar).
 */
export function triggerDirectPdfDownload(risalah: RisalahItem) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Pop-up terblokir. Izinkan pop-up di browser Anda untuk mengunduh/mencetak berkas PDF.');
    return;
  }

  const cleanNomor = risalah.nomorRisalah.replace(/[\/\\:]/g, '_');
  const filename = `Risalah_DPRD_Sulbar_${cleanNomor}`;
  const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/6/63/Logo_DPRD_Sulawesi_Barat.png';

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="utf-8">
        <title>${filename}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm 20mm 20mm 20mm;
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 0;
            font-size: 11pt;
            line-height: 1.45;
          }
          .header-kop {
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 2.5px solid #000;
            padding-bottom: 8px;
            margin-bottom: 2px;
            position: relative;
          }
          .header-kop img {
            width: 80px;
            height: auto;
            position: absolute;
            left: 10px;
            top: 2px;
          }
          .kop-text {
            text-align: center;
            margin-left: 90px;
          }
          .kop-text h2 {
            font-size: 13pt;
            font-weight: bold;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            line-height: 1.2;
          }
          .kop-text h1 {
            font-size: 16pt;
            font-weight: bold;
            margin: 3px 0 2px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
            line-height: 1.2;
          }
          .kop-text p {
            font-size: 9pt;
            margin: 1px 0;
            color: #222;
            line-height: 1.3;
          }
          .doc-title {
            text-align: center;
            margin-top: 14px;
            margin-bottom: 16px;
          }
          .doc-title h3 {
            font-size: 12.5pt;
            font-weight: bold;
            text-decoration: underline;
            margin: 0 0 3px 0;
            text-transform: uppercase;
          }
          .doc-title p {
            font-size: 10.5pt;
            margin: 0;
            font-family: monospace;
            font-weight: bold;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
          }
          .info-table td {
            padding: 4px 6px;
            vertical-align: top;
            font-size: 10.5pt;
            line-height: 1.35;
          }
          .info-table tr td:first-child {
            width: 28%;
            font-weight: bold;
          }
          .info-table tr td:nth-child(2) {
            width: 3%;
            text-align: center;
          }
          .section-box {
            margin-bottom: 14px;
          }
          .section-title {
            font-size: 10.5pt;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1.5px solid #000;
            padding-bottom: 2px;
            margin-bottom: 6px;
          }
          ul, ol {
            margin: 3px 0 6px 22px;
            padding: 0;
          }
          li {
            margin-bottom: 3px;
            line-height: 1.4;
          }
          .transcript-item {
            margin-bottom: 6px;
            padding-left: 8px;
            border-left: 2px solid #555;
            page-break-inside: avoid;
          }
          .speaker-name {
            font-weight: bold;
            text-decoration: underline;
          }
          .speaker-time {
            font-size: 9.5pt;
            color: #444;
            font-style: italic;
          }
          .ttd-section {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            page-break-inside: avoid;
          }
          .ttd-box {
            width: 45%;
            text-align: center;
            font-size: 10.5pt;
          }
          .ttd-space {
            height: 60px;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <!-- Kop Surat Resmi DPRD Sulbar -->
        <div class="header-kop">
          <img src="${logoUrl}" alt="Logo DPRD Sulawesi Barat" crossOrigin="anonymous" />
          <div class="kop-text">
            <h2>DEWAN PERWAKILAN RAKYAT DAERAH</h2>
            <h1>PROVINSI SULAWESI BARAT</h1>
            <p>Jalan Abdul Malik Pattana Endeng, Rangas, Simboro, Kabupaten Mamuju, Sulawesi Barat 91512</p>
            <p>Telepon: (0426) 2322334 | Pos-el: sekretariat@dprd.sulbarprov.go.id | Laman: dprd.sulbarprov.go.id</p>
          </div>
        </div>
        <div style="border-bottom: 1px solid #000; margin-bottom: 16px;"></div>

        <!-- Judul Risalah Resmi -->
        <div class="doc-title">
          <h3>RISALAH PERSIDANGAN RAPAT RESMI</h3>
          <p>NOMOR: ${risalah.nomorRisalah}</p>
        </div>

        <!-- Matriks Metadata Persidangan -->
        <table class="info-table">
          <tbody>
            <tr>
              <td>Agenda / Judul Rapat</td>
              <td>:</td>
              <td><strong>${risalah.judulRapat}</strong></td>
            </tr>
            <tr>
              <td>Jenis Persidangan</td>
              <td>:</td>
              <td>${risalah.jenisRapat}</td>
            </tr>
            <tr>
              <td>Hari, Tanggal & Waktu</td>
              <td>:</td>
              <td>${risalah.hariTanggalWaktu}</td>
            </tr>
            ${risalah.ruanganRapat ? `
            <tr>
              <td>Ruangan / Tempat Rapat</td>
              <td>:</td>
              <td><strong>${risalah.ruanganRapat}</strong> (Kompleks Kantor DPRD Sulbar)</td>
            </tr>
            ` : ''}
            <tr>
              <td>Pimpinan Rapat</td>
              <td>:</td>
              <td><strong>${risalah.pimpinanRapat}</strong></td>
            </tr>
            <tr>
              <td>Kehadiran Anggota & Undangan</td>
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

        <div style="border-bottom: 1px solid #aaa; margin: 12px 0 14px 0;"></div>

        <!-- Bagian I: Resume Poin-Poin Utama -->
        ${risalah.resumePoinUtama && risalah.resumePoinUtama.length > 0 ? `
        <div class="section-box">
          <div class="section-title">I. RESUME POIN-POIN UTAMA PEMBAHASAN RAPAT</div>
          <ol>
            ${risalah.resumePoinUtama.map(poin => `<li>${poin}</li>`).join('')}
          </ol>
        </div>
        ` : ''}

        <!-- Bagian II: Kesimpulan dan Keputusan Resmi -->
        ${risalah.kesimpulanKeputusan && risalah.kesimpulanKeputusan.length > 0 ? `
        <div class="section-box">
          <div class="section-title">II. KESIMPULAN DAN KEPUTUSAN RESMI RAPAT</div>
          <ol>
            ${risalah.kesimpulanKeputusan.map(kes => `<li><strong>${kes}</strong></li>`).join('')}
          </ol>
        </div>
        ` : ''}

        <!-- Bagian III: Petikan Transkrip Pembicara -->
        ${risalah.transkripPembicara && risalah.transkripPembicara.length > 0 ? `
        <div class="section-box">
          <div class="section-title">III. CATATAN PETIKAN TRANSKRIP PEMBICARA PERSIDANGAN</div>
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

        <!-- Tanda Tangan Notulis & Pimpinan -->
        <div class="ttd-section">
          <div class="ttd-box">
            <p style="margin: 0; font-weight: 600;">Pembuat Risalah Persidangan,</p>
            <p style="margin: 0; font-weight: bold;">Notulis / Sekretariat DPRD</p>
            <div class="ttd-space"></div>
            <p style="margin: 0; font-weight: bold; text-decoration: underline;">${risalah.namaNotulis || 'Arianto, AP, M.M.'}</p>
            <p style="margin: 0; font-size: 9.5pt; color: #333;">${risalah.nipNotulis ? `NIP. ${risalah.nipNotulis}` : 'NIP. 19720412 199803 1 004'}</p>
          </div>

          <div class="ttd-box">
            <p style="margin: 0; font-weight: 600;">Mamuju, ${risalah.createdDate}</p>
            <p style="margin: 0; font-weight: bold;">Pimpinan Rapat Persidangan,</p>
            <div class="ttd-space"></div>
            <p style="margin: 0; font-weight: bold; text-decoration: underline;">${risalah.pimpinanRapat}</p>
            <p style="margin: 0; font-size: 9.5pt; color: #333;">DPRD Provinsi Sulawesi Barat</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
