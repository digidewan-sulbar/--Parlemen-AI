import React, { useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  RemoveFormatting,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Sparkles,
} from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
}

export const RichTextEditor: React.FC<Props> = ({
  value,
  onChange,
  placeholder = 'Ketik isi naskah di sini...',
  minHeight = '280px',
  label,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  // Sync value to contentEditable div
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      const html = editorRef.current.innerHTML;
      onChange(html);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  };

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const handleFormatBlock = (blockTag: string) => {
    executeCommand('formatBlock', blockTag);
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-bold text-slate-200 tracking-wide flex items-center gap-1.5">
          <span>{label}</span>
          <span className="text-[10px] text-emerald-400 font-mono font-normal">
            (Rich Text Word Editor)
          </span>
        </label>
      )}

      <div className="bg-slate-950 border border-slate-700/80 rounded-xl overflow-hidden shadow-2xl focus-within:border-emerald-500 transition-all">
        {/* Ms. Word Style Formatting Toolbar Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex flex-wrap items-center gap-1.5 text-slate-300">
          <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800 shrink-0">
            <Type className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-bold text-slate-200 tracking-wide">
              MS Word Tools
            </span>
          </div>

          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => executeCommand('undo')}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
              title="Urungkan / Undo (Ctrl+Z)"
            >
              <Undo className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('redo')}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
              title="Ulangi / Redo (Ctrl+Y)"
            >
              <Redo className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 mx-0.5 shrink-0" />

          {/* Block / Paragraph Format Selector */}
          <select
            onChange={(e) => handleFormatBlock(e.target.value)}
            defaultValue="p"
            className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-medium shrink-0 cursor-pointer"
            title="Format Paragraf & Judul"
          >
            <option value="p">Paragraf Standar</option>
            <option value="h1">Judul Utama (H1)</option>
            <option value="h2">Sub Judul Bab (H2)</option>
            <option value="h3">Sub Judul Pasal (H3)</option>
            <option value="blockquote">Kutipan / Das Sollen</option>
          </select>

          <div className="h-4 w-[1px] bg-slate-800 mx-0.5 shrink-0" />

          {/* Text Styling: Bold, Italic, Underline, Strikethrough */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => executeCommand('bold')}
              className="p-1.5 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg transition border border-transparent hover:border-slate-700 font-bold"
              title="Tebal / Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              type="button"
              onClick={() => executeCommand('italic')}
              className="p-1.5 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg transition border border-transparent hover:border-slate-700 italic"
              title="Miring / Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              type="button"
              onClick={() => executeCommand('underline')}
              className="p-1.5 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg transition border border-transparent hover:border-slate-700 underline"
              title="Garis Bawah / Underline (Ctrl+U)"
            >
              <Underline className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              type="button"
              onClick={() => executeCommand('strikeThrough')}
              className="p-1.5 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg transition border border-transparent hover:border-slate-700 line-through"
              title="Coret / Strikethrough"
            >
              <Strikethrough className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 mx-0.5 shrink-0" />

          {/* Unordered List & Ordered List */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => executeCommand('insertUnorderedList')}
              className="p-1.5 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg transition border border-transparent hover:border-slate-700 flex items-center gap-1 text-xs"
              title="Daftar Poin / Bullet List"
            >
              <List className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-medium hidden sm:inline text-amber-300">Bullet</span>
            </button>

            <button
              type="button"
              onClick={() => executeCommand('insertOrderedList')}
              className="p-1.5 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg transition border border-transparent hover:border-slate-700 flex items-center gap-1 text-xs"
              title="Daftar Penomoran / Numbered List"
            >
              <ListOrdered className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-medium hidden sm:inline text-amber-300">Nomor</span>
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 mx-0.5 shrink-0" />

          {/* Alignments */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => executeCommand('justifyLeft')}
              className="p-1.5 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg transition border border-transparent hover:border-slate-700"
              title="Rata Kiri"
            >
              <AlignLeft className="w-4 h-4 text-sky-400" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyCenter')}
              className="p-1.5 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg transition border border-transparent hover:border-slate-700"
              title="Rata Tengah"
            >
              <AlignCenter className="w-4 h-4 text-sky-400" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyRight')}
              className="p-1.5 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg transition border border-transparent hover:border-slate-700"
              title="Rata Kanan"
            >
              <AlignRight className="w-4 h-4 text-sky-400" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand('justifyFull')}
              className="p-1.5 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg transition border border-transparent hover:border-slate-700"
              title="Rata Kanan-Kiri (Justify)"
            >
              <AlignJustify className="w-4 h-4 text-sky-400" />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 mx-0.5 shrink-0" />

          {/* Reset / Clear Formatting */}
          <button
            type="button"
            onClick={() => executeCommand('removeFormat')}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition border border-transparent hover:border-slate-700 ml-auto flex items-center gap-1 text-[11px]"
            title="Hapus Semua Format Teks"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Format</span>
          </button>
        </div>

        {/* Spacious Editable Content Workspace */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          style={{ minHeight }}
          data-placeholder={placeholder}
          className="p-4 sm:p-5 text-sm text-slate-100 focus:outline-none font-sans leading-relaxed text-left max-h-[600px] overflow-y-auto whitespace-pre-wrap select-text [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-slate-500 [&:empty]:before:pointer-events-none [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2 [&_h1]:text-xl [&_h1]:font-black [&_h1]:text-amber-400 [&_h1]:my-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-emerald-400 [&_h2]:my-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-sky-400 [&_h3]:my-2 [&_p]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-500 [&_blockquote]:bg-amber-950/20 [&_blockquote]:p-2.5 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_blockquote]:text-slate-200 [&_blockquote]:my-2"
        />

        {/* Footer info bar */}
        <div className="bg-slate-900/60 border-t border-slate-800 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Halaman Kerja Editor Naskah Pokok Pikiran
          </span>
          <span>Sistem E-Legislasi Sulbar 2026</span>
        </div>
      </div>
    </div>
  );
};


