import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import HearoLogo from '../components/HearoLogo';
import StudentMateriView from '../components/StudentMateriView';
import StudentQuizView from '../components/StudentQuizView';
import StudentRiwayatView from '../components/StudentRiwayatView';
import StudentProfilView from '../components/StudentProfilView';

const sibiAssets = import.meta.glob('../assets/sibi/*.png', {
  eager: true,
  import: 'default',
});

const getSibiImageSrc = (char) => {
  const lower = String(char).toLowerCase();
  return sibiAssets[`../assets/sibi/${lower}.png`] || `/sibi/${lower}.png`;
};

const SIBI_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const SIBI_NUMBERS = '0123456789'.split('');

const SIBI_DESCRIPTIONS = {
  A: 'Kepalkan tangan dengan ibu jari menempel tegak di sisi samping jari telunjuk.',
  B: 'Rapatkan keempat jari lurus ke atas dan lipat ibu jari melintang di depan telapak tangan.',
  C: 'Lengkungkan seluruh jari dan ibu jari membentuk huruf C menghadap ke samping.',
  D: 'Acungkan jari telunjuk lurus ke atas, sementara ujung jari lainnya menyentuh ibu jari membentuk lingkaran.',
  E: 'Tekuk semua ujung jari ke arah telapak tangan dengan ibu jari terlipat di bawah jari-jari.',
  F: 'Temukan ujung jari telunjuk dan ibu jari membentuk lingkaran, sementara tiga jari lainnya lurus ke atas.',
  G: 'Arahkan jari telunjuk dan ibu jari sejajar mendatar ke samping dengan jari lainnya mengepal.',
  H: 'Arahkan jari telunjuk dan jari tengah sejajar mendatar ke samping, jari lainnya mengepal.',
  I: 'Acungkan jari kelingking lurus ke atas, sementara jari lainnya mengepal rapat.',
  J: 'Acungkan jari kelingking seperti huruf I lalu gerakkan melengkung membentuk huruf J di udara.',
  K: 'Acungkan jari telunjuk dan jari tengah membentuk huruf V dengan ibu jari berada di pangkal keduanya.',
  L: 'Acungkan jari telunjuk ke atas dan ibu jari ke samping membentuk sudut siku-siku (huruf L).',
  M: 'Selipkan ibu jari di bawah tiga jari (telunjuk, tengah, manis) yang terlipat ke depan.',
  N: 'Selipkan ibu jari di bawah dua jari (telunjuk dan tengah) yang terlipat ke depan.',
  O: 'Temukan semua ujung jari dengan ujung ibu jari membentuk lingkaran penuh seperti huruf O.',
  P: 'Bentuk posisi seperti huruf K namun arahkan jari telunjuk dan jari tengah menunjuk ke bawah.',
  Q: 'Bentuk posisi seperti huruf G namun arahkan jari telunjuk dan ibu jari menunjuk ke bawah.',
  R: 'Silangkan jari tengah di belakang jari telunjuk dengan kedua jari mengarah lurus ke atas.',
  S: 'Kepalkan tangan erat dengan ibu jari melintang di bagian depan jari-jari yang mengepal.',
  T: 'Selipkan ibu jari di antara jari telunjuk dan jari tengah pada tangan yang mengepal.',
  U: 'Acungkan jari telunjuk dan jari tengah rapat lurus ke atas, sementara jari lainnya mengepal.',
  V: 'Acungkan jari telunjuk dan jari tengah lurus ke atas membentuk huruf V.',
  W: 'Acungkan jari telunjuk, tengah, dan manis lurus ke atas membentuk tiga cabang huruf W.',
  X: 'Acungkan jari telunjuk lalu tekuk ruas tengahnya menyerupai kait.',
  Y: 'Rentangkan ibu jari dan jari kelingking ke luar, sementara tiga jari tengah terlipat ke telapak.',
  Z: 'Acungkan jari telunjuk lalu gerakkan membentuk pola garis zig-zag huruf Z di udara.',
  0: 'Temukan ujung seluruh jari dengan ibu jari membentuk bulatan angka nol.',
  1: 'Acungkan jari telunjuk lurus ke atas dengan telapak menghadap ke depan.',
  2: 'Acungkan jari telunjuk dan jari tengah membentuk huruf V menghadap ke depan.',
  3: 'Acungkan ibu jari, jari telunjuk, dan jari tengah secara bersamaan.',
  4: 'Acungkan keempat jari lurus ke atas dengan ibu jari terlipat ke telapak tangan.',
  5: 'Rentangkan kelima jari terbuka menghadap ke depan.',
  6: 'Temukan ujung jari kelingking dengan ibu jari, sementara tiga jari lainnya lurus ke atas.',
  7: 'Temukan ujung jari manis dengan ibu jari, sementara tiga jari lainnya lurus ke atas.',
  8: 'Temukan ujung jari tengah dengan ibu jari, sementara tiga jari lainnya lurus ke atas.',
  9: 'Temukan ujung jari telunjuk dengan ibu jari, sementara tiga jari lainnya lurus ke atas.',
};

export default function StudentDashboard({ user, onLogout }) {
  const [activeMenu, setActiveMenu] = useState('beranda');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // State interaktif untuk Hearo Refine Studio (Koreksi SPOK)
  const [signInput, setSignInput] = useState('');
  const [refinedResult, setRefinedResult] = useState(null);

  // State interaktif untuk Kamus Bahasa Isyarat
  const [dictionaryType, setDictionaryType] = useState('SIBI'); // 'SIBI' | 'BISINDO'
  const [selectedChar, setSelectedChar] = useState(null);
  const [studentName, setStudentName] = useState(
  user?.name || 'Fauz Mulya Vaifriel'
  );


  const firstName = 'Dimas';

  const menuItems = [
    {
      id: 'beranda',
      label: 'Beranda',
      icon: 'lucide:home',
      headerTitle: 'Beranda',
      subtitle: 'Selamat datang di ruang belajar interaktifmu',
    },
    {
      id: 'kamus',
      label: 'Kamus',
      icon: 'lucide:book-open',
      headerTitle: 'Kamus Bahasa Isyarat',
      subtitle:
        'Eksplorasi ribuan kosakata SIBI dan BISINDO dengan panduan visual...',
    },
    {
      id: 'materi',
      label: 'Materi',
      icon: 'lucide:book-marked',
      headerTitle: 'Materi Belajar',
      subtitle: 'Kurikulum terstruktur tata bahasa SPOK & isyarat',
    },
    {
      id: 'quiz',
      label: 'Quiz',
      icon: 'lucide:file-question',
      headerTitle: 'Latihan & Quiz',
      subtitle: 'Latihan interaktif & evaluasi pemahaman isyarat',
    },
    {
      id: 'riwayat',
      label: 'Riwayat Belajar',
      icon: 'lucide:history',
      headerTitle: 'Riwayat Belajar',
      subtitle: 'Pantau progres materi dan hasil quiz yang telah dikerjakan',
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan & Profil',
      icon: 'lucide:settings',
      headerTitle: 'Pengaturan & Profil',
      subtitle: 'Kelola informasi akun dan preferensi aksesibilitas',
    },
  ];

  const currentMenuObj =
    menuItems.find((item) => item.id === activeMenu) || menuItems[0];

  const allSibiChars = [...SIBI_LETTERS, ...SIBI_NUMBERS];

  const handleNavigateChar = (direction) => {
    if (!selectedChar) return;
    const currentIndex = allSibiChars.indexOf(selectedChar);
    if (currentIndex === -1) return;
    const nextIndex =
      (currentIndex + direction + allSibiChars.length) % allSibiChars.length;
    setSelectedChar(allSibiChars[nextIndex]);
  };

  const learningModules = [
    {
      id: 'kamus',
      badge: '3.200+ Kosakata',
      badgeIcon: 'lucide:book-open',
      badgeColor: 'text-[#007EDA]',
      cardBg: 'bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#EEF4FF]',
      title: 'Kamus Isyarat Visual',
      description:
        'Cari ribuan kosakata BISINDO dan SIBI lengkap dengan video gerak lambat dan sudut pandang 360 derajat.',
      illustration: 'kamus',
    },
    {
      id: 'materi',
      badge: '12 Bab Terstruktur',
      badgeIcon: 'lucide:layers',
      badgeColor: 'text-[#15803D]',
      cardBg: 'bg-gradient-to-br from-[#DCFCE7] via-[#E0F2FE] to-[#F0FDF4]',
      title: 'Materi & Struktur SPOK',
      description:
        'Pelajari pola susunan kalimat bahasa Indonesia baku dari tingkat dasar hingga mahir dengan panduan visual ramah Tuli.',
      illustration: 'materi',
    },
    {
   id: 'quiz',
   label: 'Quiz',
   icon: 'lucide:file-question',
   headerTitle: 'Arena Quiz',
   subtitle:
     'Uji kemampuan bahasa isyarat & struktur SPOK dengan tantangan interaktif',
 },
  ];

  // Fungsi Analisis & Koreksi Kalimat Isyarat -> SPOK Baku
  const handleRefineSentence = () => {
    const rawInput = signInput.trim() || 'ibu pasar pergi';
    if (!signInput.trim()) {
      setSignInput('ibu pasar pergi');
    }

    const normalized = rawInput.toLowerCase().replace(/[.,!?]/g, '').trim();

    if (normalized === 'ibu pasar pergi') {
      setRefinedResult({
        detectedFormat: 'Subjek - Keterangan - Predikat (Non-baku)',
        missingHint: '! Unsur hilang: Keterangan (ke)',
        original: rawInput,
        corrected: 'Ibu pergi ke pasar.',
        tags: [
          { label: 'S: Ibu', color: 'bg-[#007EDA]' },
          { label: 'P: pergi', color: 'bg-[#16A34A]' },
          { label: 'Preposisi: ke', color: 'bg-[#EA580C]' },
          { label: 'K.Tempat: pasar', color: 'bg-[#9333EA]' },
        ],
        words: ['Ibu', 'pergi', 'ke', 'pasar'],
      });
      return;
    }

    const places = [
      'pasar',
      'sekolah',
      'rumah',
      'kantor',
      'toko',
      'perpustakaan',
    ];
    const foundPlace = places.find((p) => normalized.includes(p));
    const tokens = rawInput.split(/\s+/);

    if (foundPlace && tokens.length >= 3) {
      const subject =
        tokens[0].charAt(0).toUpperCase() + tokens[0].slice(1).toLowerCase();
      const verb =
        tokens.find(
          (t) =>
            t.toLowerCase() !== tokens[0].toLowerCase() &&
            t.toLowerCase() !== foundPlace
        ) || 'pergi';
      const cleanVerb = verb.toLowerCase();
      const correctedSentence = `${subject} ${cleanVerb} ke ${foundPlace}.`;

      setRefinedResult({
        detectedFormat: 'Subjek - Keterangan - Predikat (Non-baku)',
        missingHint: '! Unsur hilang: Keterangan (ke)',
        original: rawInput,
        corrected: correctedSentence,
        tags: [
          { label: `S: ${subject}`, color: 'bg-[#007EDA]' },
          { label: `P: ${cleanVerb}`, color: 'bg-[#16A34A]' },
          { label: 'Preposisi: ke', color: 'bg-[#EA580C]' },
          { label: `K.Tempat: ${foundPlace}`, color: 'bg-[#9333EA]' },
        ],
        words: [subject, cleanVerb, 'ke', foundPlace],
      });
      return;
    }

    if (tokens.length === 3) {
      const s =
        tokens[0].charAt(0).toUpperCase() + tokens[0].slice(1).toLowerCase();
      const o = tokens[1].toLowerCase();
      const pRaw = tokens[2].toLowerCase();
      const p = pRaw.startsWith('me') ? pRaw : `mem${pRaw}`;
      const correctedSentence = `${s} ${p} ${o}.`;

      setRefinedResult({
        detectedFormat: 'Subjek - Objek - Predikat (Non-baku)',
        missingHint: '! Perbaikan urutan & imbuhan Predikat',
        original: rawInput,
        corrected: correctedSentence,
        tags: [
          { label: `S: ${s}`, color: 'bg-[#007EDA]' },
          { label: `P: ${p}`, color: 'bg-[#16A34A]' },
          { label: `O: ${o}`, color: 'bg-[#EA580C]' },
        ],
        words: [s, p, o],
      });
      return;
    }

    const capitalizedWords = tokens.map((w, idx) =>
      idx === 0
        ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        : w.toLowerCase()
    );
    const finalSentence = `${capitalizedWords.join(' ')}.`;

    setRefinedResult({
      detectedFormat: 'Susunan Isyarat Dasar (Disesuaikan ke SPOK)',
      missingHint: '! Penyesuaian ejaan & tanda baca baku',
      original: rawInput,
      corrected: finalSentence,
      tags: [
        ...(capitalizedWords[0]
          ? [{ label: `S: ${capitalizedWords[0]}`, color: 'bg-[#007EDA]' }]
          : []),
        ...(capitalizedWords[1]
          ? [{ label: `P: ${capitalizedWords[1]}`, color: 'bg-[#16A34A]' }]
          : []),
        ...(capitalizedWords[2]
          ? [
              {
                label: `O/K: ${capitalizedWords.slice(2).join(' ')}`,
                color: 'bg-[#9333EA]',
              },
            ]
          : []),
      ],
      words: capitalizedWords,
    });
  };

  return (
    <div className="min-h-screen bg-[#EEF4FF] flex font-sans text-[#102A43]">
      {/* ================= 1. COLLAPSIBLE SIDEBAR BIRU (#007EDA) ================= */}
      <aside
        className={`${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } bg-[#007EDA] text-white flex flex-col justify-between transition-all duration-300 shrink-0 sticky top-0 h-screen z-30 shadow-lg`}
      >
        <div className="p-4">
          {/* Logo Area */}
          <div
            className={`flex items-center ${
              isSidebarCollapsed ? 'justify-center py-2' : 'px-2 py-2'
            } mb-6`}
          >
            {isSidebarCollapsed ? (
              <div
                onClick={() => setIsSidebarCollapsed(false)}
                title="Buka Menu"
                className="w-11 h-11 rounded-2xl bg-white/15 hover:bg-white/25 flex items-center justify-center cursor-pointer transition"
              >
                <Icon icon="lucide:ear" className="w-6 h-6 text-[#FCD34D]" />
              </div>
            ) : (
              <HearoLogo variant="transparent" className="h-9" />
            )}
          </div>

          {/* 6 Menu Navigasi */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveMenu(item.id)}
                  title={isSidebarCollapsed ? item.label : ''}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed
                      ? 'justify-center px-0 py-3'
                      : 'gap-3.5 px-4 py-3'
                  } rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#FCD34D] text-[#102A43] shadow-md'
                      : 'text-white/90 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <Icon
                    icon={item.icon}
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? 'text-[#102A43]' : 'text-white'
                    }`}
                  />
                  {!isSidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bagian Bawah: Keluar & Tutup/Buka Menu */}
        <div className="p-4 space-y-2 border-t border-white/15">
          <button
            type="button"
            onClick={onLogout}
            title="Keluar"
            className={`w-full flex items-center ${
              isSidebarCollapsed
                ? 'justify-center px-0 py-2.5'
                : 'gap-3.5 px-4 py-2.5'
            } rounded-xl text-xs font-semibold text-white/90 hover:bg-white/15 hover:text-white transition cursor-pointer`}
          >
            <Icon icon="lucide:log-out" className="w-5 h-5 shrink-0" />
            {!isSidebarCollapsed && <span>Keluar</span>}
          </button>

          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? 'Buka Menu' : 'Tutup Menu'}
            className={`w-full flex items-center ${
              isSidebarCollapsed
                ? 'justify-center px-0 py-2.5'
                : 'justify-between px-4 py-2.5'
            } rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition cursor-pointer`}
          >
            {isSidebarCollapsed ? (
              <Icon icon="lucide:chevrons-right" className="w-4 h-4" />
            ) : (
              <>
                <span className="flex items-center gap-2">
                  <Icon icon="lucide:chevrons-left" className="w-4 h-4" />
                  <span>Tutup Menu</span>
                </span>
                <Icon
                  icon="lucide:chevrons-left"
                  className="w-3.5 h-3.5 opacity-70"
                />
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ================= 2. KONTEN UTAMA KANAN ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-6 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-extrabold text-[#102A43] tracking-tight">
              {currentMenuObj.headerTitle}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentMenuObj.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#FCD34D] text-[#102A43] px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide inline-flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#102A43]"></span>
              <span>MURID</span>
            </div>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#007EDA]/15 border border-[#007EDA]/30 flex items-center justify-center overflow-hidden">
                  <Icon icon="noto:boy-light-skin-tone" className="w-7 h-7" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              </div>
              <span className="text-xs md:text-sm font-bold text-[#102A43] hidden sm:inline">
                {studentName}
              </span>
            </div>
          </div>
        </header>

        {/* Isi Halaman Berdasarkan Menu Aktif */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* ================================================================= */}
          {/* MENU 1: BERANDA                                                   */}
          {/* ================================================================= */}
          {activeMenu === 'beranda' && (
            <>
              {/* -------- SECTION A: BANNER SAPAAN & CAPAIAN MINGGUAN -------- */}
              <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#007EDA]"></div>

                <div className="space-y-3 pl-2">
                  <h2 className="text-2xl md:text-[28px] font-extrabold text-[#102A43] leading-tight">
                    Halo, {firstName}! Siap belajar
                    <br className="hidden sm:inline" /> hari ini?
                  </h2>

                  <div>
                    <span className="inline-flex items-center gap-1.5 bg-[#FCD34D] text-[#102A43] text-xs font-extrabold px-3 py-1 rounded-full">
                      <Icon icon="lucide:award" className="w-3.5 h-3.5" />
                      <span>Dasar</span>
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-slate-600 max-w-md leading-relaxed">
                    Lanjutkan latihan pembentukan kalimat SPOK dan kuasai 5
                    isyarat baru minggu ini.
                  </p>
                </div>

                <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-5 w-full lg:w-[340px] shrink-0 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#102A43]">
                      Capaian Belajar Mingguan
                    </span>
                    <span className="text-sm font-extrabold text-[#007EDA]">
                      45%
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#007EDA] via-[#38BDF8] to-[#FCD34D]"
                      style={{ width: '45%' }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                      <Icon
                        icon="lucide:check-circle-2"
                        className="w-3.5 h-3.5 text-[#007EDA]"
                      />
                      <span>9 dari 20 materi selesai</span>
                    </span>

                    <span className="inline-flex items-center gap-1 bg-[#FEF9C3] border border-[#FDE047] text-[#102A43] text-[11px] font-extrabold px-2.5 py-1 rounded-full">
                      <Icon
                        icon="lucide:zap"
                        className="w-3 h-3 text-amber-500 fill-amber-500"
                      />
                      <span>4 Hari Berturut-turut</span>
                    </span>
                  </div>
                </div>
              </section>

              {/* -------- SECTION B: HEARO REFINE STUDIO (1 KOLOM -> 2 KOLOM HASIL KOREKSI) -------- */}
              <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg md:text-xl font-extrabold text-[#102A43]">
                        Hearo Refine Studio
                      </h3>
                      <span className="inline-flex items-center gap-1 bg-[#E0F2FE] border border-[#BAE6FD] text-[#007EDA] text-[11px] font-bold px-3 py-1 rounded-full">
                        <Icon icon="lucide:sparkles" className="w-3 h-3" />
                        <span>Didukung AI Koreksi SPOK Tunarungu</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Ubah susunan kata isyarat menjadi kalimat bahasa Indonesia
                      yang terstruktur dan baku.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-xs text-slate-500 font-medium">
                      Tingkat Akurasi AI
                    </span>
                    <span className="bg-[#DCFCE7] text-[#15803D] text-xs font-extrabold px-2.5 py-1 rounded-md">
                      98.4% Teruji
                    </span>
                  </div>
                </div>

                <div
                  className={`grid grid-cols-1 ${
                    refinedResult ? 'lg:grid-cols-2' : ''
                  } gap-6 items-stretch`}
                >
                  {/* KOLOM KIRI: CARD INPUT KALIMAT ISYARAT */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#102A43]">
                        <Icon
                          icon="lucide:square-pen"
                          className="w-4 h-4 text-[#007EDA]"
                        />
                        <span>Input Kalimat Isyarat</span>
                      </div>

                      <div className="relative">
                        <textarea
                          rows={4}
                          value={signInput}
                          onChange={(e) => setSignInput(e.target.value)}
                          placeholder="Ketik susunan kata isyarat di sini (cth: ibu pasar pergi)..."
                          className="w-full bg-[#F8FAFC] border border-slate-200/90 rounded-xl p-4 pr-11 text-sm font-medium text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007EDA]/40 focus:bg-white transition resize-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSignInput('');
                            setRefinedResult(null);
                          }}
                          title="Hapus teks & reset"
                          className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
                        >
                          <Icon icon="lucide:x" className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-xl px-4 py-3 flex items-center gap-2.5">
                        <Icon
                          icon="lucide:info"
                          className="w-4 h-4 text-slate-400 shrink-0"
                        />
                        <div className="text-xs leading-relaxed">
                          <span className="text-slate-600 font-medium">
                            Format Isyarat Terdeteksi:{' '}
                          </span>
                          <span className="font-bold text-[#007EDA]">
                            {refinedResult
                              ? refinedResult.detectedFormat
                              : 'Subjek - Keterangan - Predikat (Non-baku)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRefineSentence}
                      className="w-full py-3.5 bg-[#007EDA] hover:bg-[#0066B2] text-white text-sm font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
                    >
                      <Icon icon="lucide:sparkles" className="w-4 h-4" />
                      <span>Perbaiki Kalimat</span>
                    </button>
                  </div>

                  {/* KOLOM KANAN: CARD KUNING HASIL KOREKSI SPOK */}
                  {refinedResult && (
                    <div className="bg-[#FEF9C3] border border-[#FDE047] rounded-2xl shadow-xs p-5 md:p-6 flex flex-col justify-between space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="bg-white border border-emerald-400 text-emerald-600 text-xs font-extrabold px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                          <Icon
                            icon="lucide:check"
                            className="w-3.5 h-3.5 stroke-[2.5]"
                          />
                          <span>Tidak Baku → Baku</span>
                        </span>

                        <span className="bg-[#FDE68A] border border-amber-300/80 text-[#92400E] text-xs font-extrabold px-3.5 py-1 rounded-full">
                          {refinedResult.missingHint}
                        </span>
                      </div>

                      <div className="bg-[#FEFCE8]/90 border border-[#FDE047] rounded-xl p-5 space-y-3">
                        <div className="text-[11px] font-bold tracking-wider uppercase text-slate-500 flex items-center gap-2">
                          <span>INPUT ASLI:</span>
                          <span className="lowercase font-medium line-through text-slate-400 text-xs">
                            {refinedResult.original}
                          </span>
                        </div>

                        <div className="text-2xl md:text-[26px] font-extrabold text-[#102A43] tracking-tight leading-snug">
                          {refinedResult.corrected}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {refinedResult.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className={`${tag.color} text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-2xs`}
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                        {refinedResult.words.map((word, idx) => (
                          <span
                            key={idx}
                            className="bg-white border border-[#FCD34D] text-[#102A43] text-xs font-extrabold px-4 py-2 rounded-lg shadow-2xs"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* -------- SECTION C: JELAJAHI MODUL BELAJAR -------- */}
              <section className="space-y-4 pb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg md:text-xl font-extrabold text-[#102A43]">
                    Jelajahi Modul Belajar
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveMenu('materi')}
                    className="text-xs font-bold text-[#007EDA] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Lihat Semua Kurikulum</span>
                    <Icon icon="lucide:chevron-right" className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {learningModules.map((mod) => (
                    <div
                      key={mod.id}
                      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition"
                    >
                      <div>
                        <div
                          className={`h-44 ${mod.cardBg} rounded-xl relative overflow-hidden p-4 flex flex-col justify-between border border-slate-100`}
                        >
                          <div className="self-start bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full shadow-xs inline-flex items-center gap-1.5">
                            <Icon
                              icon={mod.badgeIcon}
                              className={`w-3.5 h-3.5 ${mod.badgeColor}`}
                            />
                            <span
                              className={`text-[11px] font-extrabold ${mod.badgeColor}`}
                            >
                              {mod.badge}
                            </span>
                          </div>

                          <div className="flex items-center justify-center my-auto">
                            {mod.illustration === 'kamus' && (
                              <div className="flex items-center gap-2 bg-white/80 px-4 py-3 rounded-2xl shadow-xs border border-white">
                                <Icon
                                  icon="noto:open-book"
                                  className="w-12 h-12"
                                />
                                <div className="grid grid-cols-3 gap-1 text-[10px] font-extrabold text-[#007EDA]">
                                  <span className="bg-[#EEF4FF] px-1.5 py-0.5 rounded">
                                    A 🤟
                                  </span>
                                  <span className="bg-[#EEF4FF] px-1.5 py-0.5 rounded">
                                    B ✋
                                  </span>
                                  <span className="bg-[#EEF4FF] px-1.5 py-0.5 rounded">
                                    C 🤏
                                  </span>
                                  <span className="bg-[#FEF9C3] px-1.5 py-0.5 rounded text-[#102A43]">
                                    SIBI
                                  </span>
                                  <span className="bg-[#FEF9C3] px-1.5 py-0.5 rounded text-[#102A43] col-span-2 text-center">
                                    BISINDO
                                  </span>
                                </div>
                              </div>
                            )}

                            {mod.illustration === 'materi' && (
                              <div className="bg-white/90 px-4 py-3 rounded-2xl shadow-xs border border-white flex items-center gap-3">
                                <Icon
                                  icon="noto:woman-teacher-light-skin-tone"
                                  className="w-12 h-12"
                                />
                                <div className="space-y-1">
                                  <div className="flex gap-1">
                                    <span className="px-2 py-0.5 rounded bg-[#007EDA] text-white text-[10px] font-bold">
                                      S
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                                      P
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-[#FCD34D] text-[#102A43] text-[10px] font-bold">
                                      O
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-slate-700 text-white text-[10px] font-bold">
                                      K
                                    </span>
                                  </div>
                                  <p className="text-[10px] font-semibold text-slate-600">
                                    Tata Bahasa Baku
                                  </p>
                                </div>
                              </div>
                            )}

                            {mod.illustration === 'quiz' && (
                              <div className="bg-white/90 px-4 py-3 rounded-2xl shadow-xs border border-white flex items-center gap-3">
                                <Icon
                                  icon="noto:student-light-skin-tone"
                                  className="w-12 h-12"
                                />
                                <div className="text-center">
                                  <Icon
                                    icon="noto:trophy"
                                    className="w-8 h-8 mx-auto"
                                  />
                                  <span className="mt-1 inline-block bg-[#102A43] text-[#FCD34D] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                                    Level 07 • 500 XP
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <h4 className="text-base font-extrabold text-[#102A43] mt-4">
                          {mod.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-2">
                          {mod.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveMenu(mod.id)}
                        className="mt-5 w-full py-3 px-5 bg-[#007EDA] hover:bg-[#0066B2] text-white text-xs font-bold rounded-xl flex items-center justify-between transition cursor-pointer"
                      >
                        <span>Masuk Fitur</span>
                        <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* ================================================================= */}
          {/* MENU 2: KAMUS BAHASA ISYARAT (SIBI AKTIF + BISINDO SEGERA HADIR)  */}
          {/* ================================================================= */}
          {activeMenu === 'kamus' && (
            <div className="space-y-8 pb-6">
              {/* Top Mode Switcher & Info Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 md:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Segmented Toggle SIBI vs BISINDO */}
                <div className="bg-[#EEF4FF] p-1.5 rounded-xl inline-flex items-center gap-1 self-start">
                  <button
                    type="button"
                    onClick={() => setDictionaryType('SIBI')}
                    className={`px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      dictionaryType === 'SIBI'
                        ? 'bg-[#007EDA] text-white shadow-xs'
                        : 'text-[#102A43] hover:bg-white/60'
                    }`}
                  >
                    {dictionaryType === 'SIBI' && (
                      <Icon
                        icon="lucide:check-circle-2"
                        className="w-4 h-4 shrink-0"
                      />
                    )}
                    <span className="leading-tight text-left">
                      SIBI (Standar
                      <br className="hidden sm:inline" /> Sekolah)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDictionaryType('BISINDO');
                      setSelectedChar(null);
                    }}
                    className={`px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      dictionaryType === 'BISINDO'
                        ? 'bg-[#007EDA] text-white shadow-xs'
                        : 'text-[#102A43] hover:bg-white/60'
                    }`}
                  >
                    {dictionaryType === 'BISINDO' && (
                      <Icon
                        icon="lucide:check-circle-2"
                        className="w-4 h-4 shrink-0"
                      />
                    )}
                    <span className="leading-tight text-left">
                      BISINDO (Alami
                      <br className="hidden sm:inline" /> Tuli)
                    </span>
                  </button>
                </div>

                {/* Tips Banner Kanan */}
                <div className="bg-[#EEF4FF] border border-slate-200/60 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs text-slate-600 max-w-md">
                  <Icon
                    icon="lucide:lightbulb"
                    className="w-4 h-4 text-[#007EDA] shrink-0"
                  />
                  <span className="leading-relaxed">
                    SIBI cocok untuk ejaan formal & ujian sekolah; BISINDO
                    digunakan sehari-hari.
                  </span>
                </div>
              </div>

              {/* Center Title & Subtitle */}
              <div className="text-center space-y-2 pt-1">
                <h2 className="text-2xl md:text-[28px] font-extrabold text-[#102A43] tracking-tight">
                  Kamus Bahasa Isyarat
                </h2>
                <p className="text-xs md:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                  Pilih jenis bahasa isyarat, lalu klik huruf atau angka untuk
                  melihat gerakan tangannya secara instan.
                </p>
              </div>

              {/* Grid Karakter SIBI vs Status BISINDO */}
              {dictionaryType === 'SIBI' ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6">
                  {/* Card Header */}
                  <div className="flex items-center gap-2 text-xs md:text-sm font-extrabold text-[#102A43]">
                    <Icon
                      icon="lucide:layout-grid"
                      className="w-4 h-4 text-[#007EDA]"
                    />
                    <span>Pilih Karakter untuk Dipelajari</span>
                  </div>

                  {/* Two-Column Split: Huruf A-Z (Kiri) | Divider | Angka 0-9 (Kanan) */}
                  <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">
                    {/* Grid Huruf A-Z */}
                    <div className="flex-1 grid grid-cols-4 sm:grid-cols-7 gap-3">
                      {SIBI_LETTERS.map((letter) => (
                        <button
                          key={letter}
                          type="button"
                          onClick={() => setSelectedChar(letter)}
                          className={`aspect-square rounded-xl font-extrabold text-sm md:text-base flex items-center justify-center transition-all duration-150 cursor-pointer ${
                            selectedChar === letter
                              ? 'bg-[#007EDA] text-white shadow-md scale-[1.03]'
                              : 'bg-[#EEF4FF] text-[#102A43] hover:bg-[#007EDA] hover:text-white hover:shadow-sm'
                          }`}
                        >
                          {letter}
                        </button>
                      ))}
                    </div>

                    {/* Garis Pemisah Vertikal Biru Muda */}
                    <div className="hidden lg:block w-[3px] bg-[#7CC4FA] rounded-full self-stretch my-1"></div>
                    <div className="block lg:hidden h-[2px] bg-[#7CC4FA] rounded-full w-full"></div>

                    {/* Grid Angka 0-9 */}
                    <div className="lg:w-[290px] xl:w-[320px] shrink-0 grid grid-cols-4 gap-3 content-start">
                      {SIBI_NUMBERS.map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setSelectedChar(num)}
                          className={`aspect-square rounded-xl font-extrabold text-sm md:text-base flex items-center justify-center transition-all duration-150 cursor-pointer ${
                            selectedChar === num
                              ? 'bg-[#007EDA] text-white shadow-md scale-[1.03]'
                              : 'bg-[#EEF4FF] text-[#102A43] hover:bg-[#007EDA] hover:text-white hover:shadow-sm'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* State untuk BISINDO (Belum ada isi / Segera Hadir) */
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#FEF9C3] border border-[#FDE047] text-[#102A43] flex items-center justify-center mx-auto">
                    <Icon icon="lucide:hand-metal" className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="inline-block bg-[#EEF4FF] text-[#007EDA] text-[11px] font-extrabold px-3 py-1 rounded-full">
                      Dalam Pengembangan
                    </span>
                    <h3 className="text-lg font-extrabold text-[#102A43]">
                      Kamus BISINDO (Alami Tuli) Segera Hadir
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                      Saat ini koleksi kosakata visual lengkap tersedia pada
                      bagian <strong>SIBI (Standar Sekolah)</strong>. Konten
                      BISINDO sedang dalam tahap kurasi bersama Juru Bahasa
                      Isyarat.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDictionaryType('SIBI')}
                    className="px-6 py-2.5 bg-[#007EDA] hover:bg-[#0066B2] text-white text-xs font-bold rounded-full transition cursor-pointer"
                  >
                    Buka Kamus SIBI Sekarang
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* MENU 3: MATERI BELAJAR (DINAMIS DARI UPLOAD GURU)                 */}
          {/* ================================================================= */}
          {activeMenu === 'materi' && <StudentMateriView />}

          {/* ================================================================= */}
          {/* MENU 4: ARENA QUIZ                                                */}
          {/* ================================================================= */}
          {activeMenu === 'quiz' && <StudentQuizView />}

          {/* ================================================================= */}
          {/* MENU 5: RIWAYAT BELAJAR                                           */}
          {/* ================================================================= */}
          {activeMenu === 'riwayat' && <StudentRiwayatView />}

          {/* ================================================================= */}
          {/* MENU 6: PENGATURAN & PROFIL                                       */}
          {/* ================================================================= */}
          {activeMenu === 'pengaturan' && (
            <StudentProfilView
              user={{ ...user, name: studentName }}
              onUpdateProfile={(updated) => setStudentName(updated.fullName)}
            />
          )}
        </main>


        {/* Footer Aksesibilitas WCAG */}
        <footer className="bg-[#E5E7EB]/80 border-t-2 border-slate-300/70 py-4 px-6 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Hearo AI dirancang khusus untuk pembelajaran inklusif &amp; ramah Tuli
            berdasarkan pedoman WCAG 2.1 AAA.
          </p>
        </footer>
      </div>


{/* ================= MODAL DETAIL GERAKAN ISYARAT SIBI ================= */}
      {selectedChar && (
        <div
          onClick={() => setSelectedChar(null)}
          className="fixed inset-0 bg-[#102A43]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4"
          >
            {/* Header Modal: Titik Kuning + Judul & Tombol Close */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#FCD34D] shrink-0"></span>
                <h3 className="text-base md:text-lg font-extrabold text-[#102A43]">
                  {isNaN(Number(selectedChar))
                    ? `Huruf ${selectedChar}`
                    : `Angka ${selectedChar}`}{' '}
                  – {dictionaryType}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedChar(null)}
                title="Tutup"
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80 shadow-xs flex items-center justify-center transition cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-4 h-4" />
              </button>
            </div>

            {/* Kotak Ilustrasi Tangan + Badge Tampak Depan */}
            <div className="bg-[#EEF4FF] rounded-2xl p-6 relative flex items-center justify-center min-h-[240px]">
              <img
                src={getSibiImageSrc(selectedChar)}
                alt={`Isyarat ${selectedChar} - ${dictionaryType}`}
                className="max-h-48 w-auto object-contain"
              />

              <span className="absolute bottom-4 left-4 bg-[#475569] text-white text-[11px] font-bold px-3.5 py-1.5 rounded-lg shadow-2xs">
                Tampak Depan
              </span>
            </div>

            {/* Kotak Petunjuk Gerakan Visual */}
            <div className="bg-[#EEF4FF] rounded-2xl p-5 space-y-1.5">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#007EDA]">
                PETUNJUK GERAKAN VISUAL:
              </div>
              <p className="text-xs md:text-sm text-[#102A43] leading-relaxed">
                {SIBI_DESCRIPTIONS[selectedChar] ||
                  'Peragakan posisi jari sesuai standar Sistem Isyarat Bahasa Indonesia (SIBI).'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}