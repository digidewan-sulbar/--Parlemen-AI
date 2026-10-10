import React, { useState } from 'react';
import {
  Sparkles,
  X,
  FileText,
  Mic,
  Upload,
  Send,
  Building,
  UserCheck,
  Megaphone,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  RisalahItem,
  RdpRecommendationItem,
  ExecutiveSummaryItem,
  PressReleaseItem,
  ProtocolBriefingSheetItem,
} from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApplyAiResult: (data: {
    risalah?: RisalahItem;
    rekomendasiRdp?: RdpRecommendationItem[];
    executiveSummary?: ExecutiveSummaryItem;
    pressRelease?: PressReleaseItem;
    protocolBriefing?: ProtocolBriefingSheetItem;
  }) => void;
}

export const AiStudioDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  onApplyAiResult,
}) => {
  const [activeModuleTab, setActiveModuleTab] = useState<'all' | 'mod1' | 'mod2' | 'mod3' | 'mod4'>('all');

  // Input states
  const [jenisRapat, setJenisRapat] = useState<string>('Rapat Dengar Pendapat (RDP)');
  const [judulRapat, setJudulRapat] = useState<string>(
    'RDP Komisi III mengenai Perbaikan Infrastruktur Jalan Poros Mamuju - Kalukku pasca Banjir'
  );
  const [hariTanggalWaktu, setHariTanggalWaktu] = useState<string>(
    'Kamis, 30 Juli 2026 | 10.00 WITA'
  );
  const [pimpinanRapat, setPimpinanRapat] = useState<string>(
    'Wakil Ketua II / Ketua Komisi III DPRD Prov. Sulawesi Barat'
  );
  const [anggotaHadir, setAnggotaHadir] = useState<string>(
    '12 Anggota Komisi III DPRD Sulbar & Kepala Dinas PUPR Pemprov Sulbar'
  );
  const [transcriptText, setTranscriptText] = useState<string>(
    `Pimpinan Rapat (Ketua Komisi III): Rapat Dengar Pendapat hari ini kita fokuskan pada penanganan darurat tanah longsor dan kerusakan jalan di Kilometer 42 Poros Kalukku - Mamasa. Akses transportasi masyarakat terputus sejak awal pekan lalu.\n\nKadis PUPR Sulbar: Kami dari Dinas PUPR telah menerjunkan 2 unit excavator ke lokasi. Namun, kendala utama adalah pengalokasian anggaran tanggap darurat yang memerlukan persetujuan Bapperida dan Surat Keputusan Gubernur.\n\nAnggota Komisi III: Masyarakat sangat terisolir dan harga barang pokok di Kalukku melambung. Dinas PUPR harus menetapkan tenggat waktu pembersihan material jalan paling lambat 7 hari kerja, dan Diskominfo memastikan jaringan komunikasi darurat terpasang.`
  );

  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        setAudioBase64(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (presetType: 'paripurna' | 'rdp-pupr' | 'rdp-beasiswa') => {
    if (presetType === 'paripurna') {
      setJenisRapat('Rapat Paripurna');
      setJudulRapat('Rapat Paripurna Penyerahan Ranperda Kakao & Sawit Berkelanjutan Sulbar');
      setHariTanggalWaktu('Senin, 28 Juli 2026 | 09:30 WITA');
      setPimpinanRapat('Ketua DPRD Provinsi Sulawesi Barat');
      setAnggotaHadir('38 Anggota DPRD Sulbar & Forkopimda Pemprov Sulbar');
      setTranscriptText(
        `Ketua DPRD Sulbar: Rapat Paripurna penyerahan Ranperda Inisiatif DPRD tentang Perlindungan Komoditas Kakao dan Kelapa Sawit resmi dibuka.\n\nBapemperda: Komoditas kakao dan sawit adalah mata pencaharian utama warga di 6 Kabupaten Sulbar. Ranperda ini menjamin stabilitas harga TBS dan benih tersertifikasi.\n\nSekda Sulbar: Pemprov Sulbar mendukung penuh Ranperda ini untuk diselaraskan dengan program Dinas Pertanian dan Perkebunan.`
      );
    } else if (presetType === 'rdp-pupr') {
      setJenisRapat('Rapat Dengar Pendapat (RDP)');
      setJudulRapat('RDP Komisi III mengenai Evaluasi Perbaikan Jalan Poros Kalukku - Mamasa');
      setHariTanggalWaktu('Kamis, 30 Juli 2026 | 10:00 WITA');
      setPimpinanRapat('Ketua Komisi III DPRD Prov. Sulawesi Barat');
      setAnggotaHadir('Komisi III DPRD & Dinas PUPR Pemprov Sulbar');
      setTranscriptText(
        `Ketua Komisi III: Kerusakan jalan di km 42 memutus distribusi hasil tani kakao. Dinas PUPR wajib menuntaskan pengerjaan dalam 7 hari kerja.\n\nKadis PUPR: Kami siap mengerahkan alat berat tambahan dan berkoordinasi dengan Bapperida untuk pergeseran anggaran.`
      );
    } else if (presetType === 'rdp-beasiswa') {
      setJenisRapat('Rapat Dengar Pendapat (RDP)');
      setJudulRapat('RDP Komisi IV mengenai Keterlambatan Beasiswa Sulbar Cerdas 2026');
      setHariTanggalWaktu('Rabu, 29 Juli 2026 | 13:30 WITA');
      setPimpinanRapat('Ketua Komisi IV DPRD Prov. Sulawesi Barat');
      setAnggotaHadir('Komisi IV DPRD & Dinas Pendidikan dan Kebudayaan Sulbar');
      setTranscriptText(
        `Ketua Komisi IV: Terdapat 1.200 mahasiswa yang menantikan pencairan Beasiswa Sulbar Cerdas. Verifikasi rekening di Dinas Pendidikan terkesan sangat lambat.\n\nKadis Pendidikan Sulbar: Verifikasi berkas 800 mahasiswa telah selesai, sisanya 400 mahasiswa terkendala berkas administrasi. Kami berjanji merampungkan SK SK pencairan sebelum 10 Agustus 2026.`
      );
    }
  };

  const handleRunAiEngine = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai/process-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jenisRapat,
          judulRapat,
          hariTanggalWaktu,
          pimpinanRapat,
          anggotaHadir,
          transcriptText,
          audioBase64,
          audioMimeType: 'audio/mp3',
        }),
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || 'Terjadi kesalahan pada AI Server.');
      }

      const data = resData.data;

      // Transform raw response to frontend structured state
      const risalahObj: RisalahItem | undefined = data.risalah
        ? {
            id: `RSL-${Date.now()}`,
            nomorRisalah: `Risalah/${jenisRapat.substring(0, 3).toUpperCase()}/${Math.floor(10 + Math.random() * 89)}/2026`,
            judulRapat: data.risalah.judulRapat || judulRapat,
            jenisRapat: (data.risalah.jenisRapat as any) || jenisRapat,
            hariTanggalWaktu: data.risalah.hariTanggalWaktu || hariTanggalWaktu,
            pimpinanRapat: data.risalah.pimpinanRapat || pimpinanRapat,
            anggotaHadir: data.risalah.anggotaHadir || anggotaHadir,
            transkripPembicara: data.risalah.transkripPembicara || [],
            resumePoinUtama: data.risalah.resumePoinUtama || [],
            kesimpulanKeputusan: data.risalah.kesimpulanKeputusan || [],
            createdDate: new Date().toISOString().split('T')[0],
          }
        : undefined;

      const rdpArray: RdpRecommendationItem[] | undefined = data.rekomendasiRdp
        ? data.rekomendasiRdp.map((item: any, idx: number) => ({
            id: `RDP-REC-${Date.now()}-${idx}`,
            nomorRdp: `RDP-REC/${Math.floor(100 + Math.random() * 900)}/2026`,
            judulRdp: judulRapat,
            komisi: jenisRapat.includes('Komisi IV')
              ? 'Komisi IV'
              : jenisRapat.includes('Komisi III')
              ? 'Komisi III'
              : jenisRapat.includes('Komisi II')
              ? 'Komisi II'
              : 'Komisi I',
            opdPenanggungJawab: item.opdPenanggungJawab || 'Dinas Pemprov Sulbar',
            poinCatatan: item.poinCatatan || 'Catatan RDP',
            perintahTindakLanjut: item.perintahTindakLanjut || 'Tindak lanjuti segera.',
            status: 'Belum Diproses',
            tenggatWaktu: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          }))
        : undefined;

      const execSummaryObj: ExecutiveSummaryItem | undefined = data.executiveSummary
        ? {
            id: `EXS-${Date.now()}`,
            judulDokumen: `Executive Summary: ${judulRapat}`,
            tanggalRapat: hariTanggalWaktu,
            paragraf1HighlightKeputusan: data.executiveSummary.paragraf1HighlightKeputusan,
            paragraf2IsuKrusial: data.executiveSummary.paragraf2IsuKrusial,
            paragraf3RekomendasiLangkahPimpinan: data.executiveSummary.paragraf3RekomendasiLangkahPimpinan,
          }
        : undefined;

      const pressReleaseObj: PressReleaseItem | undefined = data.humasProtocol
        ? {
            id: `PR-${Date.now()}`,
            judulBerita: data.humasProtocol.pressReleaseTitle || `Rilis Berita Resmi: ${judulRapat}`,
            tanggalRilis: new Date().toISOString().split('T')[0],
            kategori: jenisRapat,
            jumlahKata: data.humasProtocol.pressReleaseWordCount || 350,
            kontenBerita: data.humasProtocol.pressReleaseContent || 'Konten berita humas.',
            status: 'Draf AI',
          }
        : undefined;

      const protocolSheetObj: ProtocolBriefingSheetItem | undefined = data.humasProtocol?.protocolBriefing
        ? {
            id: `PBS-${Date.now()}`,
            namaAcara: judulRapat,
            tanggalWaktu: hariTanggalWaktu,
            pimpinanHadir: pimpinanRapat,
            ringkasanAgenda: data.humasProtocol.protocolBriefing.ringkasanAgenda || 'Briefing Acara',
            rundown: data.humasProtocol.protocolBriefing.rundown || [],
            seatingArrangement: data.humasProtocol.protocolBriefing.seatingArrangement || 'Meja Utama Pimpinan',
            penanggungJawab: data.humasProtocol.protocolBriefing.penanggungJawab || 'Kasubbag Protokol DPRD Sulbar',
            poinPentingPimpinan: data.humasProtocol.protocolBriefing.poinPentingPimpinan || [],
          }
        : undefined;

      onApplyAiResult({
        risalah: risalahObj,
        rekomendasiRdp: rdpArray,
        executiveSummary: execSummaryObj,
        pressRelease: pressReleaseObj,
        protocolBriefing: protocolSheetObj,
      });

      alert('Seluruh Modul AI E-Parlemen Sulbar (1-4) Berhasil Diproses & Diintegrasikan!');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memproses AI Engine');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex justify-end transition-all">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-2xl h-full flex flex-col justify-between text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-xl shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Core AI Engine E-Parlemen Sulbar
              </h3>
              <p className="text-xs text-slate-400">
                Pemrosesan Terintegrasi Modul 1-4 (SPBE Perpres 95/2018)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1 scrollbar-thin">
          {/* Quick Presets */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
              Gunakan Draf Rapat Contoh (1-Click Preset)
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleApplyPreset('paripurna')}
                className="bg-slate-900 hover:bg-emerald-950 text-slate-200 border border-slate-800 hover:border-emerald-700 px-2.5 py-1.5 rounded-lg text-[11px] transition"
              >
                Paripurna Ranperda Kakao
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('rdp-pupr')}
                className="bg-slate-900 hover:bg-emerald-950 text-slate-200 border border-slate-800 hover:border-emerald-700 px-2.5 py-1.5 rounded-lg text-[11px] transition"
              >
                RDP Komisi III (PUPR Jalan)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('rdp-beasiswa')}
                className="bg-slate-900 hover:bg-emerald-950 text-slate-200 border border-slate-800 hover:border-emerald-700 px-2.5 py-1.5 rounded-lg text-[11px] transition"
              >
                RDP Komisi IV (Beasiswa)
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Jenis Rapat</label>
                <select
                  value={jenisRapat}
                  onChange={(e) => setJenisRapat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  <optgroup label="Rapat Paripurna & Musyawarah">
                    <option value="Rapat Paripurna">Rapat Paripurna</option>
                    <option value="Rapat Bamus">Rapat Bamus (Badan Musyawarah)</option>
                    <option value="Rapat Dengar Pendapat (RDP)">Rapat Dengar Pendapat (RDP)</option>
                  </optgroup>
                  <optgroup label="Alat Kelengkapan Dewan (AKD)">
                    <option value="Rapat Banggar">Rapat Banggar (Badan Anggaran)</option>
                    <option value="Rapat BK">Rapat BK (Badan Kehormatan)</option>
                    <option value="Rapat Bapemperda">Rapat Bapemperda</option>
                  </optgroup>
                  <optgroup label="Rapat Komisi DPRD Sulbar">
                    <option value="Rapat Komisi I">Rapat Komisi I</option>
                    <option value="Rapat Komisi II">Rapat Komisi II</option>
                    <option value="Rapat Komisi III">Rapat Komisi III</option>
                    <option value="Rapat Komisi IV">Rapat Komisi IV</option>
                    <option value="Rapat Komisi">Rapat Komisi (Gabungan / Umum)</option>
                  </optgroup>
                  <optgroup label="Pimpinan & Sekretariat">
                    <option value="Rapat Pimpinan">Rapat Pimpinan</option>
                    <option value="Rapat Pimpinan di Perluas">Rapat Pimpinan di Perluas</option>
                    <option value="Rapat Sekretariat DPRD">Rapat Sekretariat DPRD</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Hari / Tanggal / Waktu</label>
                <input
                  type="text"
                  value={hariTanggalWaktu}
                  onChange={(e) => setHariTanggalWaktu(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Judul Rapat</label>
              <input
                type="text"
                value={judulRapat}
                onChange={(e) => setJudulRapat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Pimpinan Rapat</label>
                <input
                  type="text"
                  value={pimpinanRapat}
                  onChange={(e) => setPimpinanRapat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Anggota DPRD & Undangan Hadir</label>
                <input
                  type="text"
                  value={anggotaHadir}
                  onChange={(e) => setAnggotaHadir(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* File Upload .mp3 / .m4a */}
            <div className="bg-slate-950 border border-dashed border-slate-800 hover:border-emerald-500 p-4 rounded-xl text-center transition">
              <Mic className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <label className="cursor-pointer">
                <span className="text-slate-300 font-semibold block">
                  {audioFileName ? `File Terpilih: ${audioFileName}` : 'Unggah File Audio Rekaman (.mp3 / .m4a)'}
                </span>
                <span className="text-[10px] text-slate-500">
                  Engine Speech-to-Text AI akan mentranskripkan secara otomatis
                </span>
                <input
                  type="file"
                  accept="audio/mp3,audio/m4a,audio/wav"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                Draf Teks Transkrip Kasar
              </label>
              <textarea
                rows={6}
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
                placeholder="Masukkan transkrip percakapan rapat..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-[11px] leading-relaxed"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-950/80 border border-red-800 text-red-300 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer Button */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Powered by Gemini 3.6 Flash</span>
          <button
            onClick={handleRunAiEngine}
            disabled={isLoading}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Memproses 4 Modul AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Jalankan & Sinkronkan Modul 1-4</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
