import React from 'react';
import { RdpRekomendasiExtended } from './rdpTypes';

/**
 * Clean phone numbers into standard International WhatsApp format (e.g. 628123456789)
 */
export const formatWhatsAppPhone = (phone: string | undefined): string => {
  if (!phone) return '628114200000';
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('08')) {
    cleaned = '628' + cleaned.substring(2);
  } else if (cleaned.startsWith('8')) {
    cleaned = '628' + cleaned.substring(1);
  }
  return cleaned;
};

/**
 * Convert HTML content from RichTextEditor into clean WhatsApp formatted text
 */
export const formatHtmlToWhatsappText = (htmlStr: string): string => {
  if (!htmlStr) return '';

  let text = htmlStr
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '*$1*')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '_$1_')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '_$1_')
    .replace(/<u[^>]*>(.*?)<\/u>/gi, '_$1_')
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '*$1*\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n')
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '_"$1"_\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]*>?/gm, '');

  return text.replace(/\n{3,}/g, '\n\n').trim();
};

/**
 * React Component to render rich text or plain text cleanly
 */
export const HtmlDisplay: React.FC<{ htmlStr: string; className?: string }> = ({
  htmlStr,
  className = '',
}) => {
  if (!htmlStr) return null;
  if (/<[a-z][\s\S]*>/i.test(htmlStr)) {
    return (
      <div
        className={`inline-block text-left [&_p]:my-0.5 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_h1]:font-bold [&_h2]:font-bold [&_blockquote]:border-l-2 [&_blockquote]:border-amber-400 [&_blockquote]:pl-2 ${className}`}
        dangerouslySetInnerHTML={{ __html: htmlStr }}
      />
    );
  }
  return <span className={className}>{htmlStr}</span>;
};

/**
 * Build complete, official WhatsApp notification message for an RDP recommendation
 */
export const buildRdpWhatsAppMessage = (
  item: RdpRekomendasiExtended,
  customTemplate?: string
): string => {
  if (customTemplate && customTemplate.trim()) {
    const formattedPoin = formatHtmlToWhatsappText(item.poinCatatan);
    const formattedPerintah = formatHtmlToWhatsappText(item.perintahTindakLanjut);

    return customTemplate
      .replace(/{NAMA_PEJABAT}/g, item.opdPejabatNama || 'Kepala Dinas / Badan')
      .replace(/{JABATAN}/g, item.opdPenanggungJawab || 'OPD Pemprov Sulbar')
      .replace(/{OPD_NAME}/g, item.opdPenanggungJawab || 'OPD Pemprov Sulbar')
      .replace(/{KOMISI}/g, item.komisi || 'Komisi DPRD Sulbar')
      .replace(/{NOMOR_RDP}/g, item.nomorRdp || 'RDP-2026')
      .replace(/{PERINTH_TINDAK_LANJUT}/g, formattedPerintah || item.perintahTindakLanjut)
      .replace(/{POIN_CATATAN}/g, formattedPoin || item.poinCatatan)
      .replace(/{SLA_DAYS}/g, String(item.slaDays || 14))
      .replace(/{DEADLINE_DATE}/g, item.deadlineDate || '14 Hari Kerja')
      .replace(
        /{MAGIC_LINK}/g,
        `https://e-parlemen.sulbarprov.go.id/portal/${item.magicLinkToken || 'MAGIC-OPD-2026'}`
      );
  }

  const cleanPerintah = formatHtmlToWhatsappText(item.perintahTindakLanjut) || item.perintahTindakLanjut;
  const cleanCatatan = formatHtmlToWhatsappText(item.poinCatatan) || item.poinCatatan;
  const magicUrl = `https://e-parlemen.sulbarprov.go.id/portal/${item.magicLinkToken || 'MAGIC-OPD-2026'}`;

  return `*PEMBERITAHUAN & PENAGIHAN REKOMENDASI RDP*
*DPRD PROVINSI SULAWESI BARAT*
--------------------------------------------
Yth. *${item.opdPejabatNama || 'Pimpinan OPD'}*
_${item.opdPenanggungJawab}_

DPRD Provinsi Sulawesi Barat menyampaikan Notifikasi Resmi Tindak Lanjut Rapat Dengar Pendapat (RDP):

📌 *Nomor Register RDP:* ${item.nomorRdp}
🏛️ *Pengawas:* ${item.komisi}
📜 *Judul Rekomendasi:* ${item.judulRdp}

📋 *Poin Catatan Masalah:*
${cleanCatatan || '-'}

💡 *Perintah & Rekomendasi Tindak Lanjut:*
${cleanPerintah || '-'}

⏰ *Batas Waktu SLA:* ${item.slaDays || 14} Hari Kerja (Tenggat: *${item.deadlineDate}*)

Silakan unggah dokumen bukti pelaksanaan / tindak lanjut OPD melalui Portal Resmi berikut:
🔗 ${magicUrl}

_Pesan otomatis dikirim via Sistem E-Parlemen & E-Tracking RDP DPRD Sulawesi Barat._`;
};

/**
 * Open WhatsApp directly in browser / app
 */
export const openWhatsAppWithRdpMessage = (
  item: RdpRekomendasiExtended,
  customTemplate?: string
): void => {
  const phone = formatWhatsAppPhone(item.opdPejabatWa || item.picWa);
  const messageText = buildRdpWhatsAppMessage(item, customTemplate);
  const encodedText = encodeURIComponent(messageText);

  const waUrl = phone
    ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;

  window.open(waUrl, '_blank');
};
