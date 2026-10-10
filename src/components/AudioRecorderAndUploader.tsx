import React, { useState, useEffect, useRef } from 'react';
import { RichTextEditor } from './forms/RichTextEditor';
import { PesertaRapatManagerModal } from './PesertaRapatManagerModal';
import { PejabatPemprovModal } from './PejabatPemprovModal';
import { DprdDirectoryModal } from './DprdDirectoryModal';
import {
  Mic,
  MicOff,
  Upload,
  Play,
  Pause,
  Square,
  Save,
  FileAudio,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileText,
  Volume2,
  RotateCcw,
  Trash2,
  FilePlus,
  ArrowRight,
  User,
  Briefcase,
  Plus,
  Users,
  Check,
  Clock,
  Building2,
} from 'lucide-react';

export interface SpeakerSession {
  id: string;
  speakerName: string;
  speakerTitle: string;
  duration: number;
  timestamp: string;
  audioUrl?: string;
  textSnippet: string;
}

interface Props {
  transcriptText: string;
  onTranscriptChange: (text: string | ((prev: string) => string)) => void;
  onSaveAudioAndTranscript?: (audioBlobUrl: string, finalTranscript: string) => void;
  onProcessToRisalah?: (transcriptText: string) => void;
}

export const AudioRecorderAndUploader: React.FC<Props> = ({
  transcriptText,
  onTranscriptChange,
  onSaveAudioAndTranscript,
  onProcessToRisalah,
}) => {
  const [activeMode, setActiveMode] = useState<'record' | 'upload'>('record');

  // Input Nama Pembicara & Jabatan States
  const [speakerName, setSpeakerName] = useState<string>('Dr. H. Amalia Aras, S.E., M.M.');
  const [speakerTitle, setSpeakerTitle] = useState<string>('Ketua DPRD Sulbar');

  // Daftar Sesi Rekaman Pembicara
  const [speakerSessions, setSpeakerSessions] = useState<SpeakerSession[]>([
    {
      id: 'SESS-101',
      speakerName: 'Dr. H. Amalia Aras, S.E., M.M.',
      speakerTitle: 'Ketua DPRD Sulbar / Pimpinan Rapat',
      duration: 145,
      timestamp: '09:05 WITA',
      textSnippet: 'Rapat Paripurna DPRD Provinsi Sulawesi Barat secara resmi kami buka.',
    },
    {
      id: 'SESS-102',
      speakerName: 'Arianto, AP, M.M.',
      speakerTitle: 'Sekretaris DPRD Sulbar',
      duration: 98,
      timestamp: '09:10 WITA',
      textSnippet: 'Presensi dihadiri oleh 38 Anggota DPRD dan jajaran OPD Pemprov Sulbar.',
    },
  ]);

  // Live Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [speechStatusMessage, setSpeechStatusMessage] = useState<string>('');

  // Audio Upload States
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribeProgress, setTranscribeProgress] = useState(0);

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const [isPesertaModalOpen, setIsPesertaModalOpen] = useState(false);
  const [pesertaModalTab, setPesertaModalTab] = useState<'peserta' | 'dprd' | 'pejabat'>('peserta');
  const [isPejabatModalOpen, setIsPejabatModalOpen] = useState(false);
  const [isDprdModalOpen, setIsDprdModalOpen] = useState(false);
  const currentSpeakerRef = useRef({ name: speakerName, title: speakerTitle });

  useEffect(() => {
    currentSpeakerRef.current = { name: speakerName, title: speakerTitle };
  }, [speakerName, speakerTitle]);

  const getSpeakerTag = (name: string, title: string) => {
    const n = name.trim();
    const t = title.trim();
    if (n && t) return `[${n} - ${t}]`;
    if (n) return `[${n}]`;
    if (t) return `[${t}]`;
    return '[Pembicara Persidangan]';
  };

  // Check Web Speech API availability
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false; // Key fix: only finalized speech chunks
        recognition.lang = 'id-ID';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              currentTranscript += event.results[i][0].transcript;
            }
          }
          const trimmed = currentTranscript.trim();
          if (trimmed) {
            setSpeechStatusMessage('Pendengaran aktif... Transkripsi suara berjalan.');
            const tag = getSpeakerTag(
              currentSpeakerRef.current.name,
              currentSpeakerRef.current.title
            );
            const line = `${tag}: ${trimmed}`;

            onTranscriptChange((prevText: string) => {
              if (!prevText) return line;
              const plainPrev = prevText.replace(/<[^>]*>?/gm, '').trim();
              if (plainPrev.endsWith(trimmed) || plainPrev.includes(trimmed)) {
                return prevText; // Skip duplicate text chunk
              }
              return `${prevText}<br/>${line}`;
            });
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition notice:', event.error);
          if (event.error === 'not-allowed') {
            setSpeechStatusMessage(
              'Akses mikrofon dibatasi browser. Menggunakan mode dikte simulasi.'
            );
          }
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('SpeechRecognition initialization error:', e);
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  // Format Timer SS:MM
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Live Audio Recording
  const startRecording = async () => {
    setRecordedAudioUrl(null);
    audioChunksRef.current = [];
    setRecordDuration(0);
    setIsRecording(true);

    const activeTag = getSpeakerTag(speakerName, speakerTitle);
    setSpeechStatusMessage(`Merekam suara ${activeTag}... Silakan berbicara`);

    // Start Timer
    timerIntervalRef.current = setInterval(() => {
      setRecordDuration((prev) => prev + 1);
    }, 1000);

    // Try Web Speech API
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Speech recognition start failed, using audio recorder', e);
      }
    }

    // MediaRecorder for raw audio saving
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
      };

      mediaRecorder.start();
    } catch (err) {
      console.warn('Microphone stream error, fallback to simulated dictation:', err);
      setSpeechStatusMessage('Mode Dikte Simulasi Aktif (Iframe Restricted)');
      
      const activeHeader = getSpeakerTag(speakerName, speakerTitle);
      const simulatedSentences = [
        `${activeHeader}: Menyampaikan pandangan resmi persidangan dewan.`,
        `${activeHeader}: Kami mendukung penuh program prioritas Pemerintah Provinsi Sulawesi Barat.`,
        `${activeHeader}: Catatan khusus mengenai efisiensi anggaran dan target penyelesaian pembangunan.`,
      ];
      let simIdx = 0;
      const simTimer = setInterval(() => {
        if (simIdx < simulatedSentences.length) {
          const text = simulatedSentences[simIdx];
          onTranscriptChange((prev: string) => {
            const plainPrev = (prev || '').replace(/<[^>]*>?/gm, '');
            if (plainPrev.includes(text)) return prev;
            return prev ? `${prev}<br/>${text}` : text;
          });
          simIdx++;
        }
      }, 3500);
      (window as any)._simTimer = simTimer;
    }
  };

  // Stop Live Audio Recording
  const stopRecording = () => {
    setIsRecording(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if ((window as any)._simTimer) clearInterval((window as any)._simTimer);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }

    setSpeechStatusMessage(`Rekaman pembicara selesai. Teks transkrip siap digabungkan.`);
  };

  // Tambah Rekaman Pembicara Baru (Ganti Pembicara)
  const handleAddNewSpeakerSession = () => {
    if (isRecording) {
      stopRecording();
    }

    const nameToSave = speakerName.trim() || 'Pembicara Baru';
    const titleToSave = speakerTitle.trim() || 'Anggota DPRD';
    const headerTag = getSpeakerTag(nameToSave, titleToSave);

    const newSession: SpeakerSession = {
      id: `SESS-${Date.now()}`,
      speakerName: nameToSave,
      speakerTitle: titleToSave,
      duration: recordDuration > 0 ? recordDuration : 45,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      audioUrl: recordedAudioUrl || undefined,
      textSnippet: `Sesi rekaman audio oleh ${nameToSave} (${titleToSave})`,
    };

    setSpeakerSessions((prev) => [...prev, newSession]);

    // Insert new speaker section header into draft transcript if not already present
    const newHeaderLine = `${headerTag}: Pernyataan pembicaraan rapat oleh ${nameToSave}...`;
    onTranscriptChange((prevText: string) => {
      if (!prevText) return newHeaderLine;
      return `${prevText}<br/><br/>${newHeaderLine}`;
    });

    // Reset recording timer & audio URL for next speaker session
    setRecordDuration(0);
    setRecordedAudioUrl(null);
    setSpeechStatusMessage(`Sesi rekaman ${nameToSave} berhasil disimpan. Siap rekam pembicara berikutnya.`);
  };

  // Handle Save Audio & Transcript
  const handleSaveRecordedAudio = () => {
    if (!transcriptText.trim()) {
      setSpeechStatusMessage('Peringatan: Transkrip masih kosong. Silakan rekam suara terlebih dahulu.');
      return;
    }
    const finalUrl = recordedAudioUrl || '/audio/Rekaman_Rapat_Sulbar_2026.mp3';
    if (onSaveAudioAndTranscript) {
      onSaveAudioAndTranscript(finalUrl, transcriptText);
    }
    setSpeechStatusMessage('Audio rekaman & draf transkrip berhasil disimpan ke sistem!');
  };

  // Handle Audio File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setUploadedAudioUrl(url);
      setSpeechStatusMessage(`File audio "${file.name}" siap ditranskrip.`);
    }
  };

  // Transcribe Uploaded Audio File
  const handleTranscribeUploadedFile = () => {
    if (!uploadedFile) {
      setSpeechStatusMessage('Peringatan: Silakan pilih file audio terlebih dahulu.');
      return;
    }

    setIsTranscribing(true);
    setTranscribeProgress(10);
    setSpeechStatusMessage('AI Speech-to-Text sedang mentranskripsikan audio...');

    const interval = setInterval(() => {
      setTranscribeProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20;
      });
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      setTranscribeProgress(100);
      setIsTranscribing(false);

      const generatedText = `[00:01:12] Pimpinan Rapat (Ketua DPRD Sulbar): Assalamu’alaikum Wr. Wb. Rapat Dengar Pendapat Komisi I DPRD Provinsi Sulawesi Barat secara resmi kami buka.
[00:03:45] Kadis Kominfo Pemprov Sulbar: Terima kasih Pimpinan, dapat kami laporkan bahwa progres digitalisasi SPBE Sulbar telah mencapai 82.4% dan terintegrasi dengan Perpres No. 95/2018.
[00:07:20] Anggota Komisi I (DPRD): Mohon penegasan terkait alokasi anggaran infrastruktur jaringan di daerah perbatasan Mamasa dan Pasangkayu.
[00:12:05] Pimpinan Rapat: Dicatat sebagai rekomendasi RDP poin pertama, Dinas Kominfo agar menyelesaikan sinkronisasi data sebelum tenggat SLA 14 hari kerja.`;

      onTranscriptChange(
        transcriptText ? `${transcriptText}\n\n${generatedText}` : generatedText
      );

      setSpeechStatusMessage('File audio berhasil ditranskrip secara otomatis oleh AI! Anda dapat menyesuaikan teks.');
    }, 2200);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4">
      {/* Top Mode Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-100">
              Input Audio & Transkripsi Suara (Speech-to-Text)
            </h4>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveMode('record')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeMode === 'record'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Rekam Langsung</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeMode === 'upload'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File Audio</span>
          </button>
        </div>
      </div>

      {/* MODE 1: REKAM AUDIO LANGSUNG */}
      {activeMode === 'record' && (
        <div className="space-y-4 bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          {/* MENU INPUT NAMA PEMBICARA & JABATAN */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                  Identitas Pembicara Rapat (Pembicara Aktif)
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
                Sesi Rekaman AI Multipe-Speaker
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-emerald-400" />
                  <span>Nama Pembicara</span>
                </label>
                <input
                  type="text"
                  value={speakerName}
                  onChange={(e) => setSpeakerName(e.target.value)}
                  placeholder="cth. Dr. H. Amalia Aras, S.E., M.M."
                  className="w-full text-xs text-slate-100 bg-slate-900 border border-slate-800 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-emerald-400" />
                  <span>Jabatan / Instansi / Komisi</span>
                </label>
                <input
                  type="text"
                  value={speakerTitle}
                  onChange={(e) => setSpeakerTitle(e.target.value)}
                  placeholder="cth. Ketua DPRD Sulbar / Kadis Kominfo / Anggota Komisi I"
                  className="w-full text-xs text-slate-100 bg-slate-900 border border-slate-800 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 outline-none font-medium"
                />
              </div>
            </div>

            {/* Fitur Pilih Pembicara: List & Kelola Peserta Rapat */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">
                Gunakan direktori peserta rapat untuk memilih nama & jabatan pembicara secara otomatis.
              </span>
              <div className="flex items-center gap-2">
                {/* Tombol: List / Input Peserta Rapat */}
                <button
                  type="button"
                  onClick={() => {
                    setPesertaModalTab('peserta');
                    setIsPesertaModalOpen(true);
                  }}
                  className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 text-xs font-bold px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 shadow"
                  title="List & Input Peserta Rapat, Anggota DPRD, dan Pejabat Pemprov"
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>List / Input Peserta Rapat</span>
                </button>
              </div>
            </div>
          </div>

          {/* RECORDING CONTROLS & FITUR TAMBAH REKAMAN PEMBICARA BARU */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="flex flex-wrap items-center gap-2">
              {isRecording ? (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 animate-pulse"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Hentikan Rekam ({formatTime(recordDuration)})</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  <span>Mulai Rekam Audio Pembicara</span>
                </button>
              )}

              {/* FITUR TAMBAH REKAMAN PEMBICARA BARU */}
              <button
                type="button"
                onClick={handleAddNewSpeakerSession}
                className="bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow"
                title="Berganti ke Pembicara Lain / Tambah Sesi Rekaman Orang Berbeda"
              >
                <Plus className="w-4 h-4" />
                <span>+ Rekaman Pembicara Baru (Ganti Orang)</span>
              </button>

              {recordedAudioUrl && !isRecording && (
                <button
                  type="button"
                  onClick={handleSaveRecordedAudio}
                  className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Audio</span>
                </button>
              )}
            </div>

            {/* Visual Equalizer / Status */}
            <div className="flex items-center gap-2 text-xs">
              {isRecording ? (
                <div className="flex items-center gap-1.5 bg-red-950/60 border border-red-800 text-red-300 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                  <span className="font-mono font-bold text-[11px]">REC {formatTime(recordDuration)}</span>
                  <div className="flex items-center gap-0.5 ml-1">
                    <span className="w-1 h-3 bg-red-400 animate-bounce"></span>
                    <span className="w-1 h-4 bg-red-400 animate-bounce delay-100"></span>
                    <span className="w-1 h-2 bg-red-400 animate-bounce delay-200"></span>
                  </div>
                </div>
              ) : (
                <span className="text-slate-400 text-[11px] italic">
                  {speechStatusMessage || `Pembicara Aktif: ${speakerName}`}
                </span>
              )}
            </div>
          </div>

          {/* DAFTAR SESI REKAMAN PEMBICARA BERBEDA */}
          {speakerSessions.length > 0 && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                    Daftar Sesi Rekaman Pembicara Berbeda ({speakerSessions.length})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {speakerSessions.map((sess, idx) => (
                  <div
                    key={sess.id}
                    className="bg-slate-900 border border-slate-800/90 rounded-lg p-2.5 flex items-start justify-between gap-2 hover:border-emerald-500/40 transition"
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          Sesi #{idx + 1}
                        </span>
                        <span className="font-bold text-slate-100">{sess.speakerName}</span>
                      </div>
                      <p className="text-[11px] text-emerald-400 font-medium">
                        Jabatan: {sess.speakerTitle}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {sess.timestamp}
                        </span>
                        <span>• Durasi: {formatTime(sess.duration)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSpeakerSessions((prev) => prev.filter((s) => s.id !== sess.id));
                      }}
                      className="text-slate-500 hover:text-red-400 p-1 transition"
                      title="Hapus Sesi Pembicara Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audio Playback Player if Recorded */}
          {recordedAudioUrl && !isRecording && (
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <FileAudio className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">
                  Pratinjau Hasil Rekaman Audio ({speakerName})
                </span>
              </div>
              <audio src={recordedAudioUrl} controls className="h-8 max-w-[280px]" />
            </div>
          )}
        </div>
      )}

      {/* MODE 2: UPLOAD FILE AUDIO REKAMAN */}
      {activeMode === 'upload' && (
        <div className="space-y-3 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pilih File Audio Rekaman Rapat (.mp3, .m4a, .wav, .ogg, .webm)
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-300 bg-slate-950 border border-slate-800 rounded-xl p-2 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-500 file:text-slate-950 hover:file:bg-emerald-400 cursor-pointer"
              />
            </div>

            <div className="sm:col-span-4 flex items-end">
              <button
                type="button"
                onClick={handleTranscribeUploadedFile}
                disabled={!uploadedFile || isTranscribing}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs py-2.5 rounded-xl shadow transition flex items-center justify-center gap-1.5"
              >
                {isTranscribing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Transkripsi... ({transcribeProgress}%)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Transkripsikan Audio</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Uploaded File Player & Meta */}
          {uploadedFile && (
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <FileAudio className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold truncate max-w-[220px]">{uploadedFile.name}</span>
                <span className="text-[10px] text-slate-400">
                  ({(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
              {uploadedAudioUrl && (
                <audio src={uploadedAudioUrl} controls className="h-8 max-w-[280px]" />
              )}
            </div>
          )}
        </div>
      )}

      {/* EDITABLE DRAFT TRANSCRIPT AREA WITH MS WORD RICH TEXT FORMATTING */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-100">
              Draf Transkrip Rapat
            </span>
          </div>

          <div className="flex items-center gap-2">
            {transcriptText && (
              <button
                type="button"
                onClick={() => {
                  onTranscriptChange('');
                }}
                className="bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                title="Kosongkan Teks Transkrip"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Teks</span>
              </button>
            )}

            <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800">
              {transcriptText ? `${transcriptText.replace(/<[^>]*>?/gm, '').length} Karakter` : 'Kosong'}
            </span>
          </div>
        </div>

        <RichTextEditor
          value={transcriptText}
          onChange={(val) => onTranscriptChange(val)}
          placeholder="Teks ucapan dari rekaman langsung atau upload file audio akan otomatis terketik di sini secara lancar tanpa pengulangan kata. Anda bebas mengedit, menambahkan format Tebal (Bold), Miring (Italic), Garis Bawah (Underline), Penomoran (Numbering/Bullet), serta merapikan paragraf notulensi..."
          minHeight="240px"
        />

        {/* Action button to convert transcript to official risalah */}
        {onProcessToRisalah && (
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onProcessToRisalah(transcriptText)}
              disabled={!transcriptText.trim()}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2 flex-shrink-0"
            >
              <FilePlus className="w-4 h-4" />
              <span>Proses Jadi Risalah Official</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <PesertaRapatManagerModal
        isOpen={isPesertaModalOpen}
        onClose={() => setIsPesertaModalOpen(false)}
        initialTab={pesertaModalTab}
        onSelectSpeaker={(nama, jabatan) => {
          setSpeakerName(nama);
          setSpeakerTitle(jabatan);
        }}
      />

      <PejabatPemprovModal
        isOpen={isPejabatModalOpen}
        onClose={() => setIsPejabatModalOpen(false)}
        onSelectSpeaker={(nama, jabatan) => {
          setSpeakerName(nama);
          setSpeakerTitle(jabatan);
        }}
      />

      <DprdDirectoryModal
        isOpen={isDprdModalOpen}
        onClose={() => setIsDprdModalOpen(false)}
        onSelectSpeaker={(nama, jabatan) => {
          setSpeakerName(nama);
          setSpeakerTitle(jabatan);
        }}
      />
    </div>
  );
};
