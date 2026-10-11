import { RisalahItem } from '../types';

/**
 * Triggers direct Microsoft Word (.doc) download for a Risalah item.
 * Creates an authentic Microsoft Word HTML format with standard styles,
 * Kop Surat DPRD Prov. Sulawesi Barat, metadata table, numbered sections,
 * and signature fields exactly identical to the preview in application.
 */
export function triggerDirectWordDownload(risalah: RisalahItem) {
  const cleanNomor = risalah.nomorRisalah.replace(/[\/\\:]/g, '_');
  const filename = `Risalah_DPRD_Sulbar_${cleanNomor}.doc`;

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${filename}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page {
            size: 210mm 297mm; /* A4 */
            margin: 20mm 20mm 20mm 20mm;
            mso-page-orientation: portrait;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            color: #000000;
            background-color: #ffffff;
            font-size: 11pt;
            line-height: 1.4;
            margin: 0;
            padding: 0;
          }
          .header-kop {
            text-align: center;
            border-bottom: 3px double #000000;
            padding-bottom: 8px;
            margin-bottom: 16px;
          }
          .kop-h2 {
            font-size: 13pt;
            font-weight: bold;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .kop-h1 {
            font-size: 16pt;
            font-weight: bold;
            margin: 2px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .kop-p {
            font-size: 9pt;
            margin: 1px 0;
            color: #222222;
          }
          .doc-title {
            text-align: center;
            margin-top: 10px;
            margin-bottom: 16px;
          }
          .doc-title-h3 {
            font-size: 13pt;
            font-weight: bold;
            text-decoration: underline;
            margin: 0 0 4px 0;
            text-transform: uppercase;
          }
          .doc-title-nomor {
            font-size: 10.5pt;
            font-weight: bold;
            margin: 0;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
          }
          .info-table td {
            padding: 4px 6px;
            vertical-align: top;
            font-size: 10.5pt;
          }
          .info-col-label {
            width: 28%;
            font-weight: bold;
          }
          .info-col-sep {
            width: 3%;
            text-align: center;
          }
          .section-box {
            margin-top: 14px;
            margin-bottom: 14px;
          }
          .section-title {
            font-size: 10.5pt;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1.5px solid #000000;
            padding-bottom: 3px;
            margin-bottom: 8px;
          }
          ol, ul {
            margin: 4px 0 8px 24px;
            padding: 0;
          }
          li {
            margin-bottom: 4px;
            line-height: 1.4;
          }
          .transcript-item {
            margin-bottom: 8px;
            padding-left: 10px;
            border-left: 2px solid #666666;
          }
          .speaker-name {
            font-weight: bold;
            text-decoration: underline;
          }
          .speaker-time {
            font-size: 9.5pt;
            color: #444444;
            font-style: italic;
          }
          .ttd-table {
            width: 100%;
            margin-top: 35px;
            border-collapse: collapse;
            page-break-inside: avoid;
          }
          .ttd-table td {
            width: 50%;
            text-align: center;
            vertical-align: top;
            font-size: 10.5pt;
            padding: 6px;
          }
          .ttd-space {
            height: 65px;
          }
        </style>
      </head>
      <body>
        <!-- Kop Surat -->
        <div class="header-kop">
          <p class="kop-h2">DEWAN PERWAKILAN RAKYAT DAERAH</p>
          <p class="kop-h1">PROVINSI SULAWESI BARAT</p>
          <p class="kop-p">Jalan Abdul Malik Pattana Endeng, Rangas, Simboro, Kabupaten Mamuju, Sulawesi Barat 91512</p>
          <p class="kop-p">Telepon: (0426) 2322334 | Email: sekretariat@dprd.sulbarprov.go.id | Website: dprd.sulbarprov.go.id</p>
        </div>

        <!-- Title -->
        <div class="doc-title">
          <p class="doc-title-h3">RISALAH PERSIDANGAN RAPAT RESMI</p>
          <p class="doc-title-nomor">NOMOR: ${risalah.nomorRisalah}</p>
        </div>

        <!-- Info Meta Table -->
        <table class="info-table">
          <tbody>
            <tr>
              <td class="info-col-label">Agenda / Judul Rapat</td>
              <td class="info-col-sep">:</td>
              <td><strong>${risalah.judulRapat}</strong></td>
            </tr>
            <tr>
              <td class="info-col-label">Jenis Persidangan</td>
              <td class="info-col-sep">:</td>
              <td>${risalah.jenisRapat}</td>
            </tr>
            <tr>
              <td class="info-col-label">Hari / Tanggal / Waktu</td>
              <td class="info-col-sep">:</td>
              <td>${risalah.hariTanggalWaktu}</td>
            </tr>
            ${risalah.ruanganRapat ? `
            <tr>
              <td class="info-col-label">Ruangan / Tempat Rapat</td>
              <td class="info-col-sep">:</td>
              <td><strong>${risalah.ruanganRapat}</strong> (Kompleks Kantor DPRD Sulbar)</td>
            </tr>
            ` : ''}
            <tr>
              <td class="info-col-label">Pimpinan Rapat</td>
              <td class="info-col-sep">:</td>
              <td><strong>${risalah.pimpinanRapat}</strong></td>
            </tr>
            <tr>
              <td class="info-col-label">Kehadiran Anggota & Undangan</td>
              <td class="info-col-sep">:</td>
              <td>${risalah.anggotaHadir}</td>
            </tr>
            ${risalah.namaNotulis ? `
            <tr>
              <td class="info-col-label">Notulis / Pembuat Risalah</td>
              <td class="info-col-sep">:</td>
              <td>${risalah.namaNotulis} ${risalah.nipNotulis ? `(NIP. ${risalah.nipNotulis})` : ''}</td>
            </tr>
            ` : ''}
          </tbody>
        </table>

        <!-- Section 1: Resume Poin Utama -->
        ${risalah.resumePoinUtama && risalah.resumePoinUtama.length > 0 ? `
        <div class="section-box">
          <div class="section-title">I. RESUME POIN-POIN UTAMA PEMBAHASAN RAPAT</div>
          <ol>
            ${risalah.resumePoinUtama.map(poin => `<li>${poin}</li>`).join('')}
          </ol>
        </div>
        ` : ''}

        <!-- Section 2: Kesimpulan Keputusan -->
        ${risalah.kesimpulanKeputusan && risalah.kesimpulanKeputusan.length > 0 ? `
        <div class="section-box">
          <div class="section-title">II. KESIMPULAN DAN KEPUTUSAN RESMI RAPAT</div>
          <ol>
            ${risalah.kesimpulanKeputusan.map(kes => `<li><strong>${kes}</strong></li>`).join('')}
          </ol>
        </div>
        ` : ''}

        <!-- Section 3: Transkrip Pembicara -->
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

        <!-- Tanda Tangan Section -->
        <table class="ttd-table">
          <tbody>
            <tr>
              <td>
                <p style="margin: 0; font-weight: 600;">Pembuat Risalah Persidangan,</p>
                <p style="margin: 0; font-weight: bold;">Notulis / Sekretariat DPRD</p>
                <div class="ttd-space"></div>
                <p style="margin: 0; font-weight: bold; text-decoration: underline;">${risalah.namaNotulis || 'Arianto, AP, M.M.'}</p>
                <p style="margin: 0; font-size: 9.5pt; color: #333333;">${risalah.nipNotulis ? `NIP. ${risalah.nipNotulis}` : 'NIP. 19720412 199803 1 004'}</p>
              </td>
              <td>
                <p style="margin: 0; font-weight: 600;">Mamuju, ${risalah.createdDate}</p>
                <p style="margin: 0; font-weight: bold;">Pimpinan Rapat Persidangan,</p>
                <div class="ttd-space"></div>
                <p style="margin: 0; font-weight: bold; text-decoration: underline;">${risalah.pimpinanRapat}</p>
                <p style="margin: 0; font-size: 9.5pt; color: #333333;">DPRD Provinsi Sulawesi Barat</p>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', wordHtml], {
    type: 'application/msword',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
