import React, { useRef } from 'react';
import { RisalahItem } from '../types';
import { X, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';
import { triggerDirectPdfDownload } from '../utils/risalahPdf';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  risalah: RisalahItem | null;
}

export const RisalahPdfModal: React.FC<Props> = ({ isOpen, onClose, risalah }) => {
  const printContentRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !risalah) return null;

  const logoUrl =
    'https://upload.wikimedia.org/wikipedia/commons/6/63/Logo_DPRD_Sulawesi_Barat.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original';

  const handlePrintPdf = () => {
    triggerDirectPdfDownload(risalah);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl text-slate-100 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                Pratinjau Dokumen Risalah Rapat (Format Kop Resmi Cetak)
              </h3>
              <p className="text-xs text-slate-400">
                Dokumen Tata Naskah DPRD Provinsi Sulawesi Barat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPdf}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Unduh PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content - Fully Scrollable Paper Preview View */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-950/80 flex justify-center flex-1">
          <div
            ref={printContentRef}
            className="bg-white text-black p-8 sm:p-12 rounded-lg shadow-2xl max-w-[800px] w-full font-serif leading-relaxed text-sm select-text my-auto border border-gray-300"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            {/* Kop Surat Header */}
            <div className="header-kop relative border-b-2 border-black pb-2 mb-[2px]">
              <div className="flex items-center justify-center gap-4">
                <img
                  src={logoUrl}
                  alt="Logo DPRD Sulawesi Barat"
                  className="w-20 h-auto object-contain flex-shrink-0"
                  crossOrigin="anonymous"
                />
                <div className="kop-text text-center">
                  <h2 className="text-base font-bold uppercase tracking-wider text-black m-0">
                    DEWAN PERWAKILAN RAKYAT DAERAH
                  </h2>
                  <h1 className="text-xl font-bold uppercase tracking-widest text-black my-0.5">
                    PROVINSI SULAWESI BARAT
                  </h1>
                  <p className="text-[10px] text-gray-800 my-0">
                    Jalan Abdul Malik Pattana Endeng, Rangas, Simboro, Kabupaten Mamuju, Sulawesi Barat 91512
                  </p>
                  <p className="text-[10px] text-gray-800 my-0">
                    Laman: dprd.sulbarprov.go.id | Pos-el: sekretariat@dprd.sulbarprov.go.id
                  </p>
                </div>
              </div>
            </div>
            <div className="border-b border-black mb-5"></div>

            {/* Document Title */}
            <div className="doc-title text-center mb-6">
              <h3 className="text-base font-bold uppercase text-black underline mb-1">
                RISALAH PERSIDANGAN RAPAT RESMI
              </h3>
              <p className="text-xs font-mono font-semibold text-gray-900 my-0">
                NOMOR: {risalah.nomorRisalah}
              </p>
            </div>

            {/* General Info Table */}
            <table className="info-table w-full border-collapse mb-5 text-xs">
              <tbody>
                <tr>
                  <td className="w-1/3 font-bold py-1">Agenda / Judul Rapat</td>
                  <td className="w-4 py-1">:</td>
                  <td className="py-1 font-semibold">{risalah.judulRapat}</td>
                </tr>
                <tr>
                  <td className="font-bold py-1">Jenis Persidangan</td>
                  <td className="py-1">:</td>
                  <td className="py-1">{risalah.jenisRapat}</td>
                </tr>
                <tr>
                  <td className="font-bold py-1">Hari, Tanggal & Waktu</td>
                  <td className="py-1">:</td>
                  <td className="py-1">{risalah.hariTanggalWaktu}</td>
                </tr>
                <tr>
                  <td className="font-bold py-1">Pimpinan Rapat</td>
                  <td className="py-1">:</td>
                  <td className="py-1 font-semibold">{risalah.pimpinanRapat}</td>
                </tr>
                <tr>
                  <td className="font-bold py-1">Kehadiran Anggota & Undangan</td>
                  <td className="py-1">:</td>
                  <td className="py-1">{risalah.anggotaHadir}</td>
                </tr>
                {risalah.namaNotulis && (
                  <tr>
                    <td className="font-bold py-1">Notulis / Pembuat Risalah</td>
                    <td className="py-1">:</td>
                    <td className="py-1">{risalah.namaNotulis} {risalah.nipNotulis ? `(NIP. ${risalah.nipNotulis})` : ''}</td>
                  </tr>
                )}
              </tbody>
            </table>

            <hr className="border-gray-400 my-4" />

            {/* Section I: Resume Poin Utama */}
            <div className="section-box mb-5">
              <h4 className="section-title text-xs font-bold uppercase border-b border-black pb-1 mb-2">
                I. RESUME POIN-POIN UTAMA PEMBAHASAN RAPAT
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                {risalah.resumePoinUtama.map((pt, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span dangerouslySetInnerHTML={{ __html: pt }} />
                  </li>
                ))}
              </ol>
            </div>

            {/* Section II: Kesimpulan Keputusan */}
            <div className="section-box mb-5">
              <h4 className="section-title text-xs font-bold uppercase border-b border-black pb-1 mb-2">
                II. KESIMPULAN DAN KEPUTUSAN RESMI RAPAT
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-xs font-semibold">
                {risalah.kesimpulanKeputusan.map((ks, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span dangerouslySetInnerHTML={{ __html: ks }} />
                  </li>
                ))}
              </ol>
            </div>

            {/* Section III: Transkrip Teks Pembicaraan */}
            {risalah.transkripPembicara && risalah.transkripPembicara.length > 0 && (
              <div className="section-box mb-6">
                <h4 className="section-title text-xs font-bold uppercase border-b border-black pb-1 mb-2">
                  III. CATATAN PETIKAN TRANSKRIP PEMBICARA DEWAN
                </h4>
                <div className="space-y-2 text-xs">
                  {risalah.transkripPembicara.map((t, idx) => (
                    <div key={idx} className="transcript-item pl-2 border-l-2 border-gray-400">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="underline">{t.pembicara}</span>
                        <span className="font-mono text-gray-600">{t.timestamp}</span>
                      </div>
                      <div
                        className="italic text-gray-800 my-0.5 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: t.pernyataan }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tanda Tangan Section */}
            <div className="ttd-section mt-10 flex justify-between text-xs pt-4 border-t border-gray-300">
              <div className="ttd-box text-center w-5/12">
                <p className="m-0 font-semibold">Pembuat Risalah Persidangan,</p>
                <p className="m-0 font-bold">Notulis / Sekretariat DPRD</p>
                <div className="ttd-space h-16"></div>
                <p className="m-0 font-bold underline">{risalah.namaNotulis || 'Arianto, AP, M.M.'}</p>
                <p className="m-0 text-[10px] text-gray-700">
                  {risalah.nipNotulis ? `NIP. ${risalah.nipNotulis}` : 'NIP. 19720412 199803 1 004'}
                </p>
              </div>

              <div className="ttd-box text-center w-5/12">
                <p className="m-0 font-semibold">Mamuju, {risalah.createdDate}</p>
                <p className="m-0 font-bold">Pimpinan Rapat Persidangan,</p>
                <div className="ttd-space h-16"></div>
                <p className="m-0 font-bold underline">{risalah.pimpinanRapat}</p>
                <p className="m-0 text-[10px] text-gray-700">DPRD Provinsi Sulawesi Barat</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
