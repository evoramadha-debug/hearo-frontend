import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react';

// Data bawaan (contoh saat guru sudah mengunggah materi)
export const INITIAL_MATERI_MODULES = [
  {
    id: 'kalimat-tanya-5w1h',
    title: 'Latihan Kalimat Tanya (5W1H Visual)',
    description:
      'Eksplorasi penggunaan kata tanya apa, siapa, di mana dengan ekspresi wajah dan struktur kalimat tanya baku.',
    author: 'Dimas Prasetyo',
    authorInitials: 'GD',
    publishedAt: 'Diterbitkan 12 November 2026',
    thumbnailType: '5w1h',
    totalPages: 3,
    pdfUrl: null, // Jika diisi URL/Blob PDF dari upload guru, otomatis tampil sebagai PDF viewer
  },
  {
    id: 'spok-keterangan-waktu-tempat',
    title: 'SPOK Lanjutan: Keterangan Waktu & Tempat',
    description:
      'Integrasi kata keterangan (pagi ini, di sekolah) dalam pola SPOK tulisan formal.',
    author: 'Dimas Prasetyo',
    authorInitials: 'DP',
    publishedAt: 'Diterbitkan 10 November 2026',
    thumbnailType: 'spok-diagram',
    totalPages: 2,
    pdfUrl: null,
  },
  {
    id: 'abjad-jari-bisindo',
    title: 'Pengenalan Abjad Jari BISINDO A-Z',
    description:
      'Pelajari artikulasi visual gestur jari dari huruf A hingga Z dengan panduan posisi tangan dua arah.',
    author: 'Ratna, S.Pd',
    authorInitials: 'RS',
    publishedAt: 'Diterbitkan 8 November 2026',
    thumbnailType: 'abjad-bisindo',
    totalPages: 2,
    pdfUrl: null,
  },
  {
    id: 'kata-kerja-dasar',
    title: 'Kata Kerja Dasar: Makan, Minum, Tidur',
    description:
      'Membedakan gerakan tangan searah dan bolak-balik pada kata kerja aktivitas sehari-hari.',
    author: 'Ratna, S.Pd',
    authorInitials: 'RS',
    publishedAt: 'Diterbitkan 5 November 2026',
    thumbnailType: 'kata-kerja',
    totalPages: 2,
    pdfUrl: null,
  },
  {
    id: 'struktur-subjek-predikat',
    title: 'Struktur Subjek & Predikat Sehari-hari',
    description:
      'Pola dasar pembentukan kalimat bahasa Indonesia baku untuk murid (Subjek - Predikat - Objek).',
    author: 'Dimas Prasetyo',
    authorInitials: 'DP',
    publishedAt: 'Diterbitkan 2 November 2026',
    thumbnailType: 'spo-dasar',
    totalPages: 2,
    pdfUrl: null,
  },
  {
    id: 'kosakata-keluarga',
    title: 'Modul Kosakata Anggota Keluarga',
    description:
      'Panduan lengkap kosakata ayah, ibu, adik, kakak dengan ilustrasi arah gerakan isyarat.',
    author: 'Kurnia Tani',
    authorInitials: 'KT',
    publishedAt: 'Diterbitkan 28 Oktober 2026',
    thumbnailType: 'keluarga',
    totalPages: 2,
    pdfUrl: null,
  },
];

const KATA_TANYA_LIST = [
  {
    word: 'Apa',
    category: 'Benda / Kegiatan',
    desc: 'Digunakan untuk menanyakan benda, kegiatan, atau peristiwa.',
    example: '"Apa yang kamu makan?"',
  },
  {
    word: 'Siapa',
    category: 'Orang',
    desc: 'Digunakan untuk menanyakan orang, nama, atau tokoh.',
    example: '"Siapa nama gurumu?"',
  },
  {
    word: 'Di mana',
    category: 'Tempat',
    desc: 'Digunakan untuk menanyakan tempat atau lokasi keberadaan.',
    example: '"Di mana tasmu?"',
  },
  {
    word: 'Kapan',
    category: 'Waktu',
    desc: 'Digunakan untuk menanyakan waktu terjadinya peristiwa.',
    example: '"Kapan kamu berangkat sekolah?"',
  },
  {
    word: 'Mengapa',
    category: 'Alasan / Sebab',
    desc: 'Digunakan untuk menanyakan alasan atau penyebab sesuatu terjadi.',
    example: '"Mengapa adik menangis?"',
  },
  {
    word: 'Bagaimana',
    category: 'Cara / Keadaan',
    desc: 'Digunakan untuk menanyakan cara, proses, atau keadaan/kabar.',
    example: '"Bagaimana kabarmu?"',
  },
];

export default function StudentMateriView({
  materials = INITIAL_MATERI_MODULES,
  liveData = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);

  // State Document/PDF Viewer
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const pageRefs = useRef({});

  // State Interaktif Latihan 1 (Contoh modul 5W1H)
  const [selectedPillWord, setSelectedPillWord] = useState(null);
  const [blankAnswers, setBlankAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
  });

  // State Interaktif Latihan 2 (Contoh modul 5W1H)
  const [activeLeftMatch, setActiveLeftMatch] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState({});

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenModule = (mod) => {
    setSelectedModule(mod);
    setActivePage(1);
    setZoomLevel(100);
    setSelectedPillWord(null);
    setBlankAnswers({ q1: '', q2: '', q3: '' });
    setMatchedPairs({});
    setActiveLeftMatch(null);
  };

  const handleJumpToPage = (pageNum) => {
    setActivePage(pageNum);
    const targetEl = pageRefs.current[pageNum];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFillBlank = (questionKey, expectedAnswer) => {
    if (selectedPillWord) {
      setBlankAnswers((prev) => ({
        ...prev,
        [questionKey]: selectedPillWord,
      }));
      setSelectedPillWord(null);
    } else if (blankAnswers[questionKey]) {
      setBlankAnswers((prev) => ({ ...prev, [questionKey]: '' }));
    } else {
      setBlankAnswers((prev) => ({ ...prev, [questionKey]: expectedAnswer }));
    }
  };

  const handleRightMatchClick = (rightWord) => {
    if (!activeLeftMatch) return;
    setMatchedPairs((prev) => ({
      ...prev,
      [activeLeftMatch]: rightWord,
    }));
    setActiveLeftMatch(null);
  };

  // Filter & Sort Daftar Materi Dinamis
  const filteredModules = materials
    .filter(
      (m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'az') return a.title.localeCompare(b.title);
      if (sortBy === 'za') return b.title.localeCompare(a.title);
      return 0;
    });

  if (selectedModule && liveData) {
    return (
      <article className="space-y-5 pb-8">
        <button
          type="button"
          onClick={() => setSelectedModule(null)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007EDA] hover:underline"
        >
          <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          Kembali ke Daftar Materi
        </button>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#007EDA]">
            {selectedModule.author}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-[#102A43]">
            {selectedModule.title}
          </h2>
          <p className="mt-2 text-xs text-slate-400">{selectedModule.publishedAt}</p>
          <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {selectedModule.description || 'Belum ada deskripsi untuk materi ini.'}
          </p>
        </div>
      </article>
    );
  }

  // =========================================================================
  // VIEW B: HALAMAN DETAIL MATERI + PENAMPIL DOKUMEN / PDF GURU
  // =========================================================================
  if (selectedModule) {
    const totalPages = selectedModule.totalPages || 1;
    const pagesArray = Array.from({ length: totalPages }, (_, idx) => idx + 1);

    return (
      <div className="space-y-5 pb-8">
        {/* Tombol Kembali */}
        <button
          type="button"
          onClick={() => setSelectedModule(null)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007EDA] hover:underline cursor-pointer"
        >
          <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          <span>Kembali ke Daftar Materi</span>
        </button>

        {/* Judul & Info Guru Penerbit */}
        <div className="space-y-3">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#102A43]">
              {selectedModule.title}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              {selectedModule.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#007EDA] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
              {selectedModule.authorInitials || 'GR'}
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#102A43]">
                {selectedModule.author}
              </div>
              <div className="text-[11px] text-slate-400">
                {selectedModule.publishedAt}
              </div>
            </div>
          </div>
        </div>

        {/* ================= DARK PDF / DOCUMENT VIEWER ================= */}
        <div className="rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-[#525659]">
          {/* Viewer Top Toolbar */}
          <div className="bg-[#323639] text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-black/30">
            <div className="flex items-center gap-3 min-w-0">
              {!selectedModule.pdfUrl && (
                <button
                  type="button"
                  onClick={() => setShowThumbnails(!showThumbnails)}
                  title="Tampilkan/Sembunyikan Panel Halaman"
                  className="p-1.5 rounded hover:bg-white/10 transition cursor-pointer"
                >
                  <Icon icon="lucide:menu" className="w-4 h-4" />
                </button>
              )}
              <span className="text-xs font-semibold truncate max-w-[180px] sm:max-w-xs">
                {selectedModule.title}
              </span>
              {!selectedModule.pdfUrl && (
                <span className="bg-black/35 text-white/90 text-[11px] font-bold px-2.5 py-0.5 rounded">
                  {activePage} / {totalPages}
                </span>
              )}
            </div>

            {/* Kontrol Zoom (- 100% +) */}
            {!selectedModule.pdfUrl && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                  title="Perkecil"
                  className="w-7 h-7 rounded hover:bg-white/10 flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  −
                </button>
                <span className="bg-black/40 text-xs font-bold px-2.5 py-1 rounded min-w-[52px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                  title="Perbesar"
                  className="w-7 h-7 rounded hover:bg-white/10 flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            )}

            {/* Kanan: Unduh / Cetak */}
            <div className="hidden sm:flex items-center gap-1.5">
              {selectedModule.pdfUrl ? (
                <a
                  href={selectedModule.pdfUrl}
                  download={`${selectedModule.title}.pdf`}
                  title="Unduh File PDF"
                  className="p-1.5 rounded hover:bg-white/10 transition"
                >
                  <Icon icon="lucide:download" className="w-4 h-4" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => window.print()}
                  title="Unduh / Cetak PDF"
                  className="p-1.5 rounded hover:bg-white/10 transition cursor-pointer"
                >
                  <Icon icon="lucide:download" className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Jika Guru Sudah Upload File PDF Asli -> Tampilkan Langsung di Iframe */}
          {selectedModule.pdfUrl ? (
            <div className="w-full h-[680px] bg-[#525659]">
              <iframe
                src={selectedModule.pdfUrl}
                title={selectedModule.title}
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            /* Jika Menggunakan Data Bawaan -> Tampilkan Pratinjau Dokumen Interaktif */
            <div className="flex h-[680px]">
              {showThumbnails && (
                <div className="w-32 sm:w-40 bg-[#25282B] border-r border-black/30 p-3 overflow-y-auto space-y-4 shrink-0">
                  {pagesArray.map((pageNum) => {
                    const isCurrent = activePage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handleJumpToPage(pageNum)}
                        className="w-full flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
                      >
                        <div
                          className={`w-full aspect-[3/4] bg-white rounded overflow-hidden p-1.5 transition ${
                            isCurrent
                              ? 'ring-2 ring-[#38BDF8] shadow-md'
                              : 'opacity-75 group-hover:opacity-100'
                          }`}
                        >
                          <div className="w-full h-3 bg-[#007EDA] rounded-2xs mb-1.5"></div>
                          <div className="space-y-1">
                            <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-4 bg-[#EEF4FF] rounded"></div>
                            <div className="h-4 bg-[#EEF4FF] rounded"></div>
                          </div>
                        </div>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                            isCurrent
                              ? 'bg-[#007EDA] text-white'
                              : 'text-slate-300'
                          }`}
                        >
                          {pageNum}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">
                <div
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'top center',
                  }}
                  className="max-w-3xl mx-auto space-y-8 transition-transform duration-150"
                >
                  {selectedModule.id === 'kalimat-tanya-5w1h' ? (
                    <>
                      {/* HALAMAN 1 */}
                      <div
                        ref={(el) => (pageRefs.current[1] = el)}
                        onClick={() => setActivePage(1)}
                        className="bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200"
                      >
                        <div className="bg-[#007EDA] text-white px-7 py-5">
                          <h3 className="text-lg md:text-xl font-extrabold">
                            Latihan Kalimat Tanya (5W1H Visual)
                          </h3>
                          <p className="text-xs text-white/85 mt-0.5">
                            Hearo AI - Halaman Materi Murid - Halaman 1
                          </p>
                        </div>

                        <div className="p-7 space-y-5">
                          <h4 className="text-base font-extrabold text-[#102A43]">
                            Bagaimana kita tahu seseorang sedang bertanya?
                          </h4>

                          <div className="bg-[#EEF4FF] border border-slate-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                              <Icon
                                icon="noto:face-with-monocle"
                                className="w-14 h-14"
                              />
                            </div>

                            <div className="flex-1 text-xs md:text-sm text-[#102A43] leading-relaxed">
                              <p className="font-extrabold">
                                Dalam Bahasa Isyarat (BISINDO), pertanyaan tidak
                                hanya memakai tangan!
                              </p>
                              <p className="text-slate-600 mt-1">
                                Ekspresi wajah, gerakan alis, dan posisi kepala
                                adalah{' '}
                                <span className="font-extrabold text-[#007EDA]">
                                  tanda tanya visual
                                </span>{' '}
                                yang sangat penting agar orang mengerti kita
                                bertanya.
                              </p>
                            </div>

                            <div className="w-16 h-16 rounded-2xl bg-[#FCD34D] text-[#102A43] text-3xl font-extrabold flex items-center justify-center shrink-0 shadow-2xs">
                              ?
                            </div>
                          </div>

                          <div className="space-y-3">
                            {[
                              {
                                icon: 'lucide:eye',
                                pill: 'Alis',
                                title: 'Gerakan Alis Mata',
                                desc: 'Alis naik atau sedikit berkerut/turun saat menyampaikan kalimat tanya.',
                              },
                              {
                                icon: 'lucide:smile',
                                pill: 'Ekspresi wajah',
                                title: 'Rasa Ingin Tahu',
                                desc: 'Wajah menunjukkan rasa ingin tahu, mata terbuka jelas menatap lawan bicara.',
                              },
                              {
                                icon: 'lucide:user-round',
                                pill: 'Kepala',
                                title: 'Posisi Kepala',
                                desc: 'Kepala sedikit condong ke depan atau sedikit miring ke samping saat bertanya.',
                              },
                              {
                                icon: 'lucide:help-circle',
                                pill: 'Tanda tanya',
                                title: 'Tanda Baca Tulisan (?)',
                                desc: 'Dalam bentuk tulisan, setiap kalimat tanya selalu diakhiri dengan tanda tanya (?).',
                              },
                            ].map((row, idx) => (
                              <div
                                key={idx}
                                className="bg-[#EEF4FF]/80 border border-slate-200/70 rounded-xl p-3.5 flex items-center gap-4"
                              >
                                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200/80 text-[#007EDA] flex items-center justify-center shrink-0">
                                  <Icon icon={row.icon} className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="bg-[#FCD34D] text-[#102A43] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                                      {row.pill}
                                    </span>
                                    <span className="text-xs font-extrabold text-[#102A43]">
                                      {row.title}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600">
                                    {row.desc}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* HALAMAN 2 */}
                      <div
                        ref={(el) => (pageRefs.current[2] = el)}
                        onClick={() => setActivePage(2)}
                        className="bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200"
                      >
                        <div className="bg-[#007EDA] text-white px-7 py-5">
                          <h3 className="text-lg md:text-xl font-extrabold">
                            Latihan Kalimat Tanya (5W1H Visual)
                          </h3>
                          <p className="text-xs text-white/85 mt-0.5">
                            Hearo AI - Halaman Materi Murid - Halaman 2
                          </p>
                        </div>

                        <div className="p-7 space-y-5">
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-extrabold text-[#102A43]">
                              Kata Tanya 5W1H
                            </h4>
                            <span className="bg-[#EEF4FF] text-[#007EDA] text-[11px] font-extrabold px-3 py-1 rounded-full">
                              6 Kata Tanya Utama
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {KATA_TANYA_LIST.map((item) => (
                              <div
                                key={item.word}
                                className="bg-[#EEF4FF]/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between space-y-3"
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="bg-[#FCD34D] text-[#102A43] text-xs font-extrabold px-3 py-0.5 rounded-full">
                                      {item.word}
                                    </span>
                                    <span className="bg-white text-slate-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200/80">
                                      {item.category}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600 leading-relaxed">
                                    {item.desc}
                                  </p>
                                </div>

                                <div className="bg-white border border-slate-200/70 rounded-lg px-3 py-2">
                                  <div className="text-[10px] text-slate-400 font-semibold">
                                    Contoh Kalimat:
                                  </div>
                                  <div className="text-xs font-extrabold text-[#102A43] mt-0.5">
                                    {item.example}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="bg-[#FEF9C3] border border-[#FDE047] rounded-xl px-4 py-3 flex items-center gap-2.5 text-xs text-[#102A43]">
                            <Icon
                              icon="lucide:lightbulb"
                              className="w-4 h-4 text-amber-600 shrink-0"
                            />
                            <span>
                              <strong>Ingat:</strong> Saat mengucapkan kata
                              tanya dalam isyarat, pastikan pandangan mata
                              tertuju jelas pada teman bicara.
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* HALAMAN 3 */}
                      <div
                        ref={(el) => (pageRefs.current[3] = el)}
                        onClick={() => setActivePage(3)}
                        className="bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200"
                      >
                        <div className="bg-[#007EDA] text-white px-7 py-5">
                          <h3 className="text-lg md:text-xl font-extrabold">
                            Latihan Kalimat Tanya (5W1H Visual)
                          </h3>
                          <p className="text-xs text-white/85 mt-0.5">
                            Hearo AI - Halaman Materi Murid - Halaman 3
                          </p>
                        </div>

                        <div className="p-7 space-y-5">
                          <div className="bg-[#EEF4FF]/70 border border-slate-200/80 rounded-xl p-4 space-y-2.5">
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#007EDA]">
                              CONTOH PENULISAN KALIMAT TANYA:
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="w-5 h-5 rounded bg-red-100 text-red-600 font-extrabold inline-flex items-center justify-center">
                                !
                              </span>
                              <span className="font-bold text-red-600">
                                "Kamu tinggal di mana."
                              </span>
                              <span className="text-slate-400 italic text-[11px]">
                                (Salah: tanpa tanda tanya)
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-400 pl-7">
                              ↓ Perbaiki menjadi:
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-600 font-extrabold inline-flex items-center justify-center">
                                ✓
                              </span>
                              <span className="font-extrabold text-emerald-700">
                                "Kamu tinggal di mana?"
                              </span>
                              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                                Benar
                              </span>
                            </div>

                            <p className="text-[11px] text-[#007EDA] italic text-center pt-1">
                              * Catatan: Kalimat tanya selalu diakhiri dengan
                              tanda tanya (?).
                            </p>
                          </div>

                          {/* Latihan 1 */}
                          <div className="bg-[#EEF4FF]/70 border border-slate-200/80 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-extrabold text-[#102A43]">
                                Latihan 1: Lengkapi dengan kata tanya yang
                                tepat!
                              </h5>
                              <span className="text-[10px] text-slate-400 font-semibold">
                                Klik pilihan kata lalu klik garis kosong
                              </span>
                            </div>

                            <div className="bg-white border border-slate-200/80 rounded-lg p-2.5 flex flex-wrap items-center justify-center gap-2">
                              <span className="text-[11px] text-slate-400 font-semibold mr-1">
                                Pilihan kata:
                              </span>
                              {['Siapa', 'Kapan', 'Di mana', 'Apa'].map(
                                (word) => (
                                  <button
                                    key={word}
                                    type="button"
                                    onClick={() =>
                                      setSelectedPillWord(
                                        selectedPillWord === word ? null : word
                                      )
                                    }
                                    className={`px-3 py-1 rounded-full text-xs font-extrabold transition cursor-pointer ${
                                      selectedPillWord === word
                                        ? 'bg-[#102A43] text-[#FCD34D] ring-2 ring-[#FCD34D]'
                                        : 'bg-[#FCD34D] text-[#102A43] hover:brightness-95'
                                    }`}
                                  >
                                    {word}
                                  </button>
                                )
                              )}
                            </div>

                            <div className="space-y-2">
                              {[
                                {
                                  key: 'q1',
                                  num: 1,
                                  text: 'nama ibumu?',
                                  hint: 'menanyakan orang',
                                  answer: 'Siapa',
                                },
                                {
                                  key: 'q2',
                                  num: 2,
                                  text: 'kamu tidur?',
                                  hint: 'menanyakan waktu',
                                  answer: 'Kapan',
                                },
                                {
                                  key: 'q3',
                                  num: 3,
                                  text: 'rumah nenek?',
                                  hint: 'menanyakan tempat',
                                  answer: 'Di mana',
                                },
                              ].map((q) => {
                                const val = blankAnswers[q.key];
                                const isCorrect = val === q.answer;
                                return (
                                  <div
                                    key={q.key}
                                    className="bg-white border border-slate-200/80 rounded-lg px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2"
                                  >
                                    <div className="flex items-center gap-2.5 text-xs">
                                      <span className="w-5 h-5 rounded-full bg-[#EEF4FF] text-[#007EDA] font-extrabold text-[11px] flex items-center justify-center">
                                        {q.num}
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleFillBlank(q.key, q.answer)
                                        }
                                        className={`min-w-[82px] px-2.5 py-1 rounded border-b-2 text-xs font-extrabold transition cursor-pointer ${
                                          val
                                            ? isCorrect
                                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                                              : 'bg-red-50 border-red-400 text-red-600'
                                            : 'bg-slate-50 border-dashed border-slate-400 text-slate-400 hover:border-[#007EDA]'
                                        }`}
                                      >
                                        {val || '...........'}
                                      </button>

                                      <span className="font-bold text-[#102A43]">
                                        {q.text}
                                      </span>
                                    </div>

                                    <span className="bg-[#EEF4FF] text-slate-500 text-[10px] font-semibold px-2.5 py-1 rounded">
                                      {val
                                        ? isCorrect
                                          ? '✓ Tepat!'
                                          : 'Coba lagi'
                                        : q.hint}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Latihan 2 */}
                          <div className="bg-[#EEF4FF]/70 border border-slate-200/80 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-extrabold text-[#102A43]">
                                Latihan 2: Tarik garis / jodohkan gambar dengan
                                kata tanya yang sesuai!
                              </h5>
                              <span className="text-[10px] text-slate-400 font-semibold">
                                Klik item kiri lalu klik kata tanya kanan
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                              <div className="space-y-2">
                                {[
                                  {
                                    id: 'orang',
                                    label: 'Orang / Tokoh',
                                    icon: 'lucide:user',
                                    expected: 'Siapa',
                                  },
                                  {
                                    id: 'waktu',
                                    label: 'Jam (Waktu)',
                                    icon: 'lucide:clock',
                                    expected: 'Kapan',
                                  },
                                  {
                                    id: 'tempat',
                                    label: 'Lokasi / Tempat',
                                    icon: 'lucide:map-pin',
                                    expected: 'Di mana',
                                  },
                                ].map((leftItem) => {
                                  const matched = matchedPairs[leftItem.id];
                                  const isSelected =
                                    activeLeftMatch === leftItem.id;
                                  return (
                                    <button
                                      key={leftItem.id}
                                      type="button"
                                      onClick={() =>
                                        setActiveLeftMatch(
                                          isSelected ? null : leftItem.id
                                        )
                                      }
                                      className={`w-full bg-white border rounded-lg px-3.5 py-2.5 flex items-center justify-between text-xs font-bold transition cursor-pointer ${
                                        isSelected
                                          ? 'border-[#007EDA] ring-2 ring-[#007EDA]/30'
                                          : 'border-slate-200/80 hover:border-[#007EDA]'
                                      }`}
                                    >
                                      <span className="flex items-center gap-2 text-[#102A43]">
                                        <Icon
                                          icon={leftItem.icon}
                                          className="w-4 h-4 text-[#007EDA]"
                                        />
                                        <span>{leftItem.label}</span>
                                      </span>

                                      <span className="flex items-center gap-1.5">
                                        {matched && (
                                          <span
                                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                              matched === leftItem.expected
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
                                            }`}
                                          >
                                            → {matched}
                                          </span>
                                        )}
                                        <span
                                          className={`w-3 h-3 rounded-full border-2 ${
                                            matched
                                              ? 'bg-[#007EDA] border-[#007EDA]'
                                              : 'border-slate-300'
                                          }`}
                                        ></span>
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="space-y-2">
                                {['Kapan', 'Siapa', 'Di mana'].map(
                                  (rightWord) => (
                                    <button
                                      key={rightWord}
                                      type="button"
                                      onClick={() =>
                                        handleRightMatchClick(rightWord)
                                      }
                                      className={`w-full bg-white border rounded-lg px-3.5 py-2.5 flex items-center gap-3 text-xs font-bold transition cursor-pointer ${
                                        activeLeftMatch
                                          ? 'border-[#FCD34D] hover:bg-[#FEF9C3]/50'
                                          : 'border-slate-200/80'
                                      }`}
                                    >
                                      <span className="w-3 h-3 rounded-full border-2 border-slate-300"></span>
                                      <span className="bg-[#FCD34D] text-[#102A43] font-extrabold px-3 py-0.5 rounded-full">
                                        {rightWord}
                                      </span>
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Template Multi-Halaman untuk Modul Lainnya */
                    pagesArray.map((pageNum) => (
                      <div
                        key={pageNum}
                        ref={(el) => (pageRefs.current[pageNum] = el)}
                        onClick={() => setActivePage(pageNum)}
                        className="bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200"
                      >
                        <div className="bg-[#007EDA] text-white px-7 py-5">
                          <h3 className="text-lg md:text-xl font-extrabold">
                            {selectedModule.title}
                          </h3>
                          <p className="text-xs text-white/85 mt-0.5">
                            Hearo AI - Halaman Materi Murid - Halaman {pageNum}
                          </p>
                        </div>

                        <div className="p-7 space-y-5">
                          {pageNum === 1 ? (
                            <>
                              <h4 className="text-base font-extrabold text-[#102A43]">
                                Konsep Utama & Pemahaman Visual
                              </h4>
                              <div className="bg-[#EEF4FF] border border-slate-200/80 rounded-2xl p-5 space-y-2">
                                <span className="bg-[#FCD34D] text-[#102A43] text-[11px] font-extrabold px-3 py-0.5 rounded-full">
                                  Ringkasan Materi
                                </span>
                                <p className="text-xs md:text-sm text-[#102A43] leading-relaxed pt-1">
                                  {selectedModule.description}
                                </p>
                              </div>
                            </>
                          ) : (
                            <div className="bg-[#FEF9C3] border border-[#FDE047] rounded-xl p-4 text-xs text-[#102A43] space-y-1">
                              <div className="font-extrabold">
                                Catatan Latihan:
                              </div>
                              <p>
                                Gunakan fitur <strong>Hearo Refine Studio</strong>{' '}
                                di menu Beranda untuk menguji susunan kalimatmu
                                secara langsung.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tombol Bawah: Buka / Unduh PDF */}
        <div>
          {selectedModule.pdfUrl ? (
            <a
              href={selectedModule.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#EEF4FF] text-[#007EDA] border border-[#007EDA] text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-2xs transition"
            >
              <Icon icon="lucide:download" className="w-4 h-4" />
              <span>Buka / Unduh PDF</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#EEF4FF] text-[#007EDA] border border-[#007EDA] text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-2xs transition cursor-pointer"
            >
              <Icon icon="lucide:download" className="w-4 h-4" />
              <span>Buka / Unduh PDF</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW A: DAFTAR KARTU MATERI BELAJAR (DINAMIS DARI DATA GURU)
  // =========================================================================
 return (
    <div className="pb-8">
      {/* Pita Biru Muda: Baris Filter & Pencarian */}
      <div className="bg-[#F2F7FD] border-b border-slate-200/60 -mx-6 -mt-6 md:-mx-8 md:-mt-8 px-6 md:px-8 py-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="bg-[#007EDA] text-white text-xs font-extrabold px-5 py-2.5 rounded-full shadow-xs cursor-pointer"
            >
              Semua ({materials.length})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Icon
                icon="lucide:search"
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul materi..."
                className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007EDA]/30"
              />
            </div>

            <div className="relative">
              <Icon
                icon="lucide:list-filter"
                className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200/90 rounded-xl pl-8 pr-8 py-2.5 text-xs font-bold text-[#102A43] appearance-none focus:outline-none focus:ring-2 focus:ring-[#007EDA]/30 cursor-pointer"
              >
                <option value="default">Urutkan: Default</option>
                <option value="az">Urutkan: Judul A - Z</option>
                <option value="za">Urutkan: Judul Z - A</option>
              </select>
              <Icon
                icon="lucide:chevron-down"
                className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Kartu Materi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((mod) => {
          const isBookmarked = bookmarkedIds.includes(mod.id);
          return (
            <div
              key={mod.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                {/* Visual Thumbnail Header */}
                <div className="h-44 bg-[#EEF4FF] border-b border-slate-100 p-3 flex items-center justify-center overflow-hidden">
                  {mod.thumbnailType === '5w1h' && (
                    <div className="w-full h-full bg-white rounded-xl border border-slate-200/80 p-3 flex items-center justify-between gap-2 shadow-2xs">
                      <div className="space-y-1.5 text-left">
                        <span className="text-[9px] font-extrabold text-[#007EDA] block">
                          Hearo AI
                        </span>
                        <div className="text-[11px] font-extrabold text-[#102A43] leading-tight">
                          Visual Question Markers in Sign Language
                        </div>
                        <div className="space-y-0.5 text-[8px] text-slate-500 font-semibold">
                          <div>• Raised Eyebrows</div>
                          <div>• Facial Expression</div>
                          <div>• Head Tilt</div>
                          <div>• Question Punctuation</div>
                        </div>
                      </div>
                      <div className="relative shrink-0 flex flex-col items-center">
                        <span className="self-end bg-[#FCD34D] text-[#102A43] text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center mb-0.5">
                          ?
                        </span>
                        <Icon
                          icon="noto:girl-light-skin-tone"
                          className="w-16 h-16"
                        />
                      </div>
                    </div>
                  )}

                  {mod.thumbnailType === 'spok-diagram' && (
                    <div className="w-full h-full bg-white rounded-xl border border-slate-200/80 p-3 flex flex-col justify-between shadow-2xs">
                      <div className="text-[9px] font-bold text-slate-400 text-center">
                        Hearo AI – Halaman Materi Murid
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 items-center my-auto">
                        <div className="bg-emerald-50 border border-emerald-200 rounded p-1.5 text-[8px] font-bold text-emerald-700 text-center">
                          Predikat
                        </div>
                        <div className="bg-[#E0F2FE] border border-[#7CC4FA] rounded p-1.5 text-[8px] font-bold text-[#007EDA] text-center">
                          Subjek Inti
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded p-1.5 text-[8px] font-bold text-amber-700 text-center">
                          Keterangan Waktu
                        </div>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full w-2/3 mx-auto"></div>
                    </div>
                  )}

                  {mod.thumbnailType === 'abjad-bisindo' && (
                    <div className="w-full h-full bg-gradient-to-r from-[#E0F2FE] to-[#BAE6FD] rounded-xl p-3 flex items-center justify-center gap-3">
                      <Icon
                        icon="noto:raised-hand-with-fingers-splayed-light-skin-tone"
                        className="w-16 h-16"
                      />
                      <Icon
                        icon="noto:victory-hand-light-skin-tone"
                        className="w-14 h-14"
                      />
                    </div>
                  )}

                  {mod.thumbnailType === 'kata-kerja' && (
                    <div className="w-full h-full bg-gradient-to-r from-[#FEF9C3] to-[#E0F2FE] rounded-xl p-3 flex items-center justify-center gap-3">
                      <Icon
                        icon="noto:woman-gesturing-ok-light-skin-tone"
                        className="w-20 h-20"
                      />
                    </div>
                  )}

                  {mod.thumbnailType === 'spo-dasar' && (
                    <div className="w-full h-full bg-white rounded-xl border border-slate-200/80 p-3 flex flex-col justify-between shadow-2xs">
                      <div className="text-[9px] font-extrabold text-[#102A43] text-center">
                        Memahami Struktur Kalimat Dasar S-P-O
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        <div className="bg-[#007EDA] text-white rounded-lg p-1.5 text-center">
                          <div className="text-[8px] opacity-80">SUBJEK</div>
                          <div className="text-[10px] font-extrabold">Ibu</div>
                        </div>
                        <div className="bg-rose-500 text-white rounded-lg p-1.5 text-center">
                          <div className="text-[8px] opacity-80">PREDIKAT</div>
                          <div className="text-[10px] font-extrabold">
                            membaca
                          </div>
                        </div>
                        <div className="bg-emerald-500 text-white rounded-lg p-1.5 text-center">
                          <div className="text-[8px] opacity-80">OBJEK</div>
                          <div className="text-[10px] font-extrabold">
                            buku cerita
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] font-extrabold text-center text-[#007EDA]">
                        Ibu membaca buku cerita
                      </div>
                    </div>
                  )}

                  {mod.thumbnailType === 'keluarga' && (
                    <div className="w-full h-full bg-white rounded-xl border border-slate-200/80 p-2.5 flex flex-col justify-between shadow-2xs">
                      <div className="text-[8px] font-extrabold text-center text-[#102A43] uppercase tracking-wider">
                        KELUARGA DALAM BAHASA ISYARAT
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 my-auto">
                        {[
                          { label: 'FATHER', icon: 'noto:man-light-skin-tone' },
                          {
                            label: 'MOTHER',
                            icon: 'noto:woman-light-skin-tone',
                          },
                          {
                            label: 'BROTHER',
                            icon: 'noto:boy-light-skin-tone',
                          },
                          {
                            label: 'SISTER',
                            icon: 'noto:girl-light-skin-tone',
                          },
                        ].map((fam) => (
                          <div
                            key={fam.label}
                            className="bg-[#EEF4FF] rounded px-2 py-1 flex items-center gap-1.5"
                          >
                            <Icon icon={fam.icon} className="w-5 h-5" />
                            <span className="text-[8px] font-extrabold text-[#102A43]">
                              {fam.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cover Otomatis Jika Guru Upload Materi Baru */}
                  {![
                    '5w1h',
                    'spok-diagram',
                    'abjad-bisindo',
                    'kata-kerja',
                    'spo-dasar',
                    'keluarga',
                  ].includes(mod.thumbnailType) && (
                    <div className="w-full h-full bg-white rounded-xl border border-slate-200/80 p-4 flex flex-col items-center justify-center text-center gap-2">
                      <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] text-[#007EDA] flex items-center justify-center">
                        <Icon icon="lucide:file-text" className="w-6 h-6" />
                      </div>
                      <span className="bg-[#FEF9C3] text-[#102A43] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                        Dokumen PDF Guru
                      </span>
                    </div>
                  )}
                </div>

                {/* Judul & Deskripsi Card */}
                <div className="p-5 pb-3">
                  <h3 className="text-base font-extrabold text-[#102A43] leading-snug">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2">
                    {mod.description}
                  </p>
                </div>
              </div>

              {/* Footer Card: Author, Bookmark, & Tombol Buka -> */}
              <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#007EDA] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                    {mod.authorInitials || 'GR'}
                  </div>
                  <span className="text-xs font-bold text-[#102A43] truncate">
                    {mod.author}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(mod.id)}
                    title="Simpan Materi"
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                      isBookmarked
                        ? 'bg-[#FEF9C3] border-[#FCD34D] text-[#102A43]'
                        : 'bg-white border-slate-200 text-slate-400 hover:text-[#007EDA]'
                    }`}
                  >
                    <Icon icon="lucide:bookmark" className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenModule(mod)}
                    className="bg-[#007EDA] hover:bg-[#0066B2] text-white text-xs font-bold px-4 py-2 rounded-lg inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Buka</span>
                    <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filteredModules.length === 0 && (
        <p className="rounded-xl bg-white px-5 py-8 text-center text-sm text-slate-500">
          Belum ada materi yang diterbitkan.
        </p>
      )}
    </div>
  );
}