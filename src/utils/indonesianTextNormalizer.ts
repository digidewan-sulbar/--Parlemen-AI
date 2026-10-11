/**
 * Utility: indonesianTextNormalizer.ts
 * Mesin Normalisasi & Bakuisasi Bahasa Indonesia Resmi DPRD Provinsi Sulawesi Barat
 * Mengubah bahasa lisan, kata tidak baku, slang, dialek daerah, dan audio samar/tidak jelas
 * menjadi Bahasa Indonesia Baku (KBBI / PUEBI / EYD Edisi V) sesuai standar Tata Naskah Dinas.
 */

// Kamus kata tidak baku -> kata baku resmi persidangan
const INFORMAL_TO_FORMAL_MAP: Record<string, string> = {
  // Negasi & Pertanyaan
  'nggak': 'tidak',
  'gak': 'tidak',
  'ga': 'tidak',
  'nda': 'tidak',
  'ndak': 'tidak',
  'kagak': 'tidak',
  'ngga': 'tidak',
  'gimana': 'bagaimana',
  'gmn': 'bagaimana',
  'kenapa': 'mengapa',
  'knp': 'mengapa',
  'ngapain': 'mengapa melakukan hal tersebut',

  // Waktu & Keterangan
  'udah': 'sudah',
  'udh': 'sudah',
  'sdh': 'sudah',
  'belom': 'belum',
  'blm': 'belum',
  'kemaren': 'kemarin',
  'entar': 'nanti',
  'ntar': 'nanti',
  'tar': 'nanti',
  'sampe': 'sampai',
  'ampe': 'sampai',
  'smp': 'sampai',
  'cuman': 'hanya',
  'cuma': 'hanya',
  'aja': 'saja',
  'doang': 'saja',
  'banget': 'sangat',
  'bgt': 'sangat',
  'amat': 'sangat',
  'bener': 'benar',
  'beneran': 'sungguh',
  'emang': 'memang',
  'emangnya': 'memangnya',
  'makanya': 'oleh karena itu',
  'makany': 'oleh karena itu',
  'biar': 'agar',
  'supaya': 'agar',
  'kalo': 'apabila',
  'kalau': 'apabila',
  'klo': 'apabila',
  'kl': 'apabila',
  'kayak': 'seperti',
  'kaya': 'seperti',
  'kyk': 'seperti',
  'gitu': 'demikian',
  'gini': 'demikian ini',
  'begini': 'seperti ini',
  'begitu': 'demikian',
  'tau': 'mengetahui',
  'tau-tau': 'tiba-tiba',
  'tiba2': 'tiba-tiba',
  'kira-kira': 'kurang lebih',
  'kira2': 'kurang lebih',

  // Kata Kerja (Verba) Informal
  'bikin': 'membuat',
  'bikinin': 'membuatkan',
  'pake': 'menggunakan',
  'pakai': 'menggunakan',
  'make': 'menggunakan',
  'dapet': 'memperoleh',
  'dapat': 'dapat',
  'dapetin': 'memperoleh',
  'ngasih': 'memberikan',
  'kasih': 'memberikan',
  'ngomong': 'menyampaikan',
  'ngomongin': 'membahas',
  'bilang': 'menyatakan',
  'bilangnya': 'menyatakan bahwa',
  'ngeliat': 'melihat',
  'liat': 'melihat',
  'ngeliatnya': 'memperhatikan bahwa',
  'denger': 'mendengar',
  'dengerin': 'mendengarkan',
  'ngerjain': 'mengerjakan',
  'kerjain': 'mengerjakan',
  'nemu': 'menemukan',
  'nemuin': 'menemukan',
  'ngaruh': 'berpengaruh',
  'nentuin': 'menentukan',
  'tentuin': 'menentukan',
  'ngadain': 'menyelenggarakan',
  'adain': 'menyelenggarakan',
  'ngikut': 'mengikuti',
  'ikutin': 'mengikuti',
  'ngingetin': 'mengingatkan',
  'ingetin': 'mengingatkan',
  'ngatur': 'mengatur',
  'atur': 'mengatur',
  'ngurus': 'mengurus',
  'ngurusin': 'mengelola',
  'nyiapin': 'mempersiapkan',
  'siapin': 'mempersiapkan',
  'nyelesaiin': 'menyelesaikan',
  'selesaiin': 'menyelesaikan',
  'beresin': 'menuntaskan',
  'nyari': 'mencari',
  'ngambil': 'mengambil',
  'ngirim': 'mengirimkan',
  'kirimin': 'mengirimkan',
  'ngecek': 'memeriksa',
  'cekin': 'memeriksa',
  'ngitung': 'menghitung',
  'ngulang': 'mengulang',
  'ngebut': 'mempercepat proses',

  // Kata Sapaan & Kata Ganti
  'temen-temen': 'rekan-rekan anggota',
  'temen': 'rekan',
  'kalian': 'Bapak/Ibu sekalian',
  'gua': 'saya',
  'gue': 'saya',
  'lu': 'Saudara',
  'lo': 'Saudara',
  'elu': 'Saudara',
  'bro': 'rekan sekalian',
  'bos': 'pimpinan',
  'makasih': 'terima kasih',
  'thx': 'terima kasih',

  // Bahasa Gaul / Filler
  'dong': '',
  'deh': '',
  'sih': '',
  'kan': '',
  'tuh': '',
  'nih': '',
  'kok': '',
  'loh': '',
  'lho': '',
  'yah': '',
  'yaudah': 'baiklah',
  'yowis': 'baiklah',
  'oke': 'baik',
  'ok': 'baik',
  'sip': 'baik',
  'mantap': 'sangat baik',

  // Istilah Pemerintahan & Singkatan
  'pemprov': 'Pemerintah Provinsi',
  'pemda': 'Pemerintah Daerah',
  'kadis': 'Kepala Dinas',
  'kaban': 'Kepala Badan',
  'kabag': 'Kepala Bagian',
  'sekda': 'Sekretaris Daerah',
  'sekwan': 'Sekretaris DPRD',
};

// Pola audio samar / tidak jelas / jeda lisan (filler words) yang harus dibersihkan
const AUDIO_GLITCH_PATTERNS = [
  /\[suara\s+tidak\s+terdengar\]/gi,
  /\(suara\s+tidak\s+terdengar\)/gi,
  /\[audio\s+tidak\s+jelas\]/gi,
  /\(audio\s+tidak\s+jelas\)/gi,
  /\[suara\s+tidak\s+jelas\]/gi,
  /\(suara\s+tidak\s+jelas\)/gi,
  /\[suara\s+samar\]/gi,
  /\(suara\s+samar\)/gi,
  /\[rekaman\s+samar\]/gi,
  /\(rekaman\s+samar\)/gi,
  /\[audio\s+terputus\]/gi,
  /\(audio\s+terputus\)/gi,
  /\[tidak\s+terbaca\]/gi,
  /\(tidak\s+terbaca\)/gi,
  /\b(eee+|ee+|ehm|eh|uhm|hmm+|anu|nganu|apa\s+namanya)\b/gi,
  /\b(ckck|ha\?|aduh)\b/gi,
];

// Kapitalisasi akronim resmi DPRD Sulbar
const OFFICIAL_ACRONYMS: Record<string, string> = {
  'dprd': 'DPRD',
  'sulbar': 'Sulawesi Barat',
  'apbd': 'APBD',
  'ranperda': 'Ranperda',
  'perda': 'Perda',
  'rdp': 'RDP',
  'opd': 'OPD',
  'bamus': 'Bamus',
  'banggar': 'Banggar',
  'bapemperda': 'Bapemperda',
  'spbe': 'SPBE',
  'komisi i': 'Komisi I',
  'komisi ii': 'Komisi II',
  'komisi iii': 'Komisi III',
  'komisi iv': 'Komisi IV',
  'mamuju': 'Mamuju',
  'majene': 'Majene',
  'polewali mandar': 'Polewali Mandar',
  'polman': 'Polewali Mandar',
  'mamasa': 'Mamasa',
  'pasangkayu': 'Pasangkayu',
  'mamuju tengah': 'Mamuju Tengah',
  'mateng': 'Mamuju Tengah',
};

export interface NormalizationResult {
  normalizedText: string;
  wordsReplacedCount: number;
  replacedTerms: string[];
}

/**
 * Normalisasi satu kalimat atau paragraf menjadi Bahasa Indonesia Baku
 */
export function normalizeIndonesianText(rawText: string): NormalizationResult {
  if (!rawText || !rawText.trim()) {
    return { normalizedText: '', wordsReplacedCount: 0, replacedTerms: [] };
  }

  let text = rawText;
  let replaceCount = 0;
  const replacedTermsSet = new Set<string>();

  // 1. Bersihkan audio samar & filler words
  for (const pattern of AUDIO_GLITCH_PATTERNS) {
    if (pattern.test(text)) {
      text = text.replace(pattern, ' ');
      replaceCount++;
      replacedTermsSet.add('Pembersihan jeda lisan/audio samar');
    }
  }

  // 2. Bersihkan pengulangan kata gugup/stuttering (contoh: "saya saya" -> "saya", "kita kita" -> "kita")
  text = text.replace(/\b(\w+)\s+\1\b/gi, (match, word) => {
    // Kecualikan reduplikasi alami seperti "rekan-rekan" atau "undang-undang"
    const lower = word.toLowerCase();
    if (['kadang', 'tiba', 'kira', 'sama', 'masing', 'pura', 'alih'].includes(lower)) {
      return `${word}-${word}`;
    }
    replaceCount++;
    replacedTermsSet.add(`Redundansi ucapan "${match}"`);
    return word;
  });

  // 3. Penggantian kata tidak baku menggunakan regex batas kata (\b)
  for (const [informal, formal] of Object.entries(INFORMAL_TO_FORMAL_MAP)) {
    const regex = new RegExp(`\\b${informal}\\b`, 'gi');
    if (regex.test(text)) {
      text = text.replace(regex, (matched) => {
        replaceCount++;
        replacedTermsSet.add(`"${matched}" → "${formal}"`);
        // Pertahankan kapitalisasi jika huruf pertama kapital
        if (matched[0] === matched[0].toUpperCase() && formal.length > 0) {
          return formal.charAt(0).toUpperCase() + formal.slice(1);
        }
        return formal;
      });
    }
  }

  // 4. Perbaiki akronim dan entitas Sulawesi Barat
  for (const [lowerAcronym, officialFormat] of Object.entries(OFFICIAL_ACRONYMS)) {
    const regex = new RegExp(`\\b${lowerAcronym}\\b`, 'gi');
    if (regex.test(text)) {
      text = text.replace(regex, officialFormat);
    }
  }

  // 5. Bersihkan spasi ganda dan tanda baca renggang
  text = text
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/([.,;:!?])([A-Za-z])/g, '$1 $2')
    .trim();

  // 6. Pastikan huruf awal kalimat selalu kapital
  text = text.replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());

  return {
    normalizedText: text,
    wordsReplacedCount: replaceCount,
    replacedTerms: Array.from(replacedTermsSet),
  };
}

/**
 * Normalisasi dokumen transkrip risalah lengkap (bisa mengandung tag pembicara dan HTML <br/> / <p>)
 */
export function normalizeTranscriptDocument(rawHtmlOrText: string): NormalizationResult {
  if (!rawHtmlOrText || !rawHtmlOrText.trim()) {
    return { normalizedText: '', wordsReplacedCount: 0, replacedTerms: [] };
  }

  // Pisahkan berdasarkan baris / tag paragraf / br
  const isHtml = /<[a-z][\s\S]*>/i.test(rawHtmlOrText);
  
  if (isHtml) {
    // Normalisasi teks di dalam node teks HTML tanpa merusak tag
    let totalCount = 0;
    const allReplacedTerms = new Set<string>();

    const processedHtml = rawHtmlOrText.replace(/(>|^)([^<]+)(<|$)/g, (match, prefix, content, suffix) => {
      if (!content.trim()) return match;
      const result = normalizeIndonesianText(content);
      totalCount += result.wordsReplacedCount;
      result.replacedTerms.forEach((t) => allReplacedTerms.add(t));
      return `${prefix}${result.normalizedText}${suffix}`;
    });

    return {
      normalizedText: processedHtml,
      wordsReplacedCount: totalCount,
      replacedTerms: Array.from(allReplacedTerms),
    };
  } else {
    return normalizeIndonesianText(rawHtmlOrText);
  }
}
