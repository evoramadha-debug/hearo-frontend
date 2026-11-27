import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import HearoLogo from '../components/HearoLogo';

// Otomatis memuat seluruh gambar kamus dari src/assets/sibi/
const sibiModules = import.meta.glob(
  '../assets/sibi/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP,SVG}',
  { eager: true, import: 'default' }
);

const SIBI_IMAGE_MAP = Object.entries(sibiModules).reduce((acc, [path, url]) => {
  const filename = path.split('/').pop() || '';
  const stem = filename.replace(/\.[^/.]+$/, '').trim().toUpperCase();
  acc[stem] = url;

  // Dukungan jika nama file memakai awalan seperti HURUF_A, HURUF-A, ANGKA_0, SIBI_B, dll.
  const cleaned = stem.replace(/^(HURUF|ANGKA|SIBI)[-_ ]+/i, '');
  if (cleaned) {
    acc[cleaned] = url;
  }
  return acc;
}, {});

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const SIBI_DETAILS = {
  A: {
    view: 'Tampak Depan',
    instruction:
      'Kepalkan keempat jari rapat ke telapak tangan dengan ibu jari menempel tegak di sisi luar jari telunjuk.',
  },
  B: {
    view: 'Tampak Depan',
    instruction:
      'Rapatkan keempat jari lurus ke atas dan lipat ibu jari melintang di depan telapak tangan.',
  },
  C: {
    view: 'Tampak Depan',
    instruction:
      'Lengkungkan ibu jari dan keempat jari lainnya membentuk setengah lingkaran seperti huruf C.',
  },
  D: {
    view: 'Tampak Depan',
    instruction:
      'Acungkan jari telunjuk lurus ke atas, sementara ibu jari menyentuh ujung jari tengah, manis, dan kelingking membentuk lingkaran.',
  },
  E: {
    view: 'Tampak Depan',
    instruction:
      'Tekuk keempat jari ke arah telapak tangan dan lipat ibu jari di bawah ujung jari-jari tersebut.',
  },
  F: {
    view: 'Tampak Depan',
    instruction:
      'Temukan ujung ibu jari dan jari telunjuk membentuk lingkaran, lalu rentangkan jari tengah, manis, dan kelingking lurus ke atas.',
  },
  G: {
    view: 'Tampak Samping',
    instruction:
      'Arahkan jari telunjuk dan ibu jari sejajar secara horizontal ke samping, sementara jari lainnya mengepal.',
  },
  H: {
    view: 'Tampak Samping',
    instruction:
      'Rentangkan jari telunjuk dan jari tengah rapat secara horizontal ke samping, dengan jari manis dan kelingking terlipat.',
  },
  I: {
    view: 'Tampak Depan',
    instruction:
      'Acungkan jari kelingking lurus ke atas, sedangkan jari lainnya mengepal rapat dan ibu jari menahan di depan.',
  },
  J: {
    view: 'Tampak Depan',
    instruction:
      'Mulai dari posisi huruf I (kelingking tegak), lalu gerakkan kelingking melengkung ke bawah membentuk kait huruf J.',
  },
  K: {
    view: 'Tampak Depan',
    instruction:
      'Acungkan jari telunjuk dan jari tengah membentuk huruf V, lalu tempelkan ujung ibu jari di pangkal jari tengah.',
  },
  L: {
    view: 'Tampak Depan',
    instruction:
      'Rentangkan jari telunjuk lurus ke atas dan ibu jari lurus ke samping membentuk sudut siku-siku seperti huruf L.',
  },
  M: {
    view: 'Tampak Depan',
    instruction:
      'Selipkan ibu jari di bawah tiga jari (telunjuk, tengah, dan manis) yang ditekuk ke depan telapak tangan.',
  },
  N: {
    view: 'Tampak Depan',
    instruction:
      'Selipkan ibu jari di bawah dua jari (telunjuk dan tengah) yang ditekuk ke depan telapak tangan.',
  },
  O: {
    view: 'Tampak Depan',
    instruction:
      'Pertemukan ujung ibu jari dengan ujung keempat jari lainnya membentuk bulatan menyerupai huruf O.',
  },
  P: {
    view: 'Tampak Samping',
    instruction:
      'Bentuk posisi jari seperti huruf K, namun arahkan pergelangan tangan menunduk sehingga jari telunjuk mengarah ke bawah.',
  },
  Q: {
    view: 'Tampak Samping',
    instruction:
      'Bentuk posisi jari seperti huruf G, lalu arahkan ibu jari dan jari telunjuk menunjuk lurus ke bawah.',
  },
  R: {
    view: 'Tampak Depan',
    instruction:
      'Acungkan jari telunjuk dan jari tengah lurus ke atas dengan posisi jari tengah menyilang di belakang jari telunjuk.',
  },
  S: {
    view: 'Tampak Depan',
    instruction:
      'Kepalkan seluruh jari dengan erat dan letakkan ibu jari melintang di bagian depan jari-jari yang mengepal.',
  },
  T: {
    view: 'Tampak Depan',
    instruction:
      'Kepalkan jari-jari tangan dan selipkan ujung ibu jari di antara jari telunjuk dan jari tengah.',
  },
  U: {
    view: 'Tampak Depan',
    instruction:
      'Acungkan jari telunjuk dan jari tengah lurus serta rapat ke atas, sementara jari lainnya terlipat.',
  },
  V: {
    view: 'Tampak Depan',
    instruction:
      'Acungkan jari telunjuk dan jari tengah lurus ke atas sambil direnggangkan membentuk huruf V.',
  },
  W: {
    view: 'Tampak Depan',
    instruction:
      'Acungkan jari telunjuk, tengah, dan manis lurus ke atas dengan renggang membentuk huruf W, sementara ibu jari menahan kelingking.',
  },
  X: {
    view: 'Tampak Samping',
    instruction:
      'Kepalkan tangan lalu angkat jari telunjuk dalam posisi tertekuk setengah menyerupai kait.',
  },
  Y: {
    view: 'Tampak Depan',
    instruction:
      'Rentangkan ibu jari dan jari kelingking ke luar, sementara jari telunjuk, tengah, dan manis terlipat ke telapak tangan.',
  },
  Z: {
    view: 'Tampak Depan',
    instruction:
      'Acungkan jari telunjuk lurus lalu gerakkan di udara mengikuti pola garis zig-zag huruf Z.',
  },
  0: {
    view: 'Tampak Depan',
    instruction:
      'Temukan seluruh ujung jari dengan ibu jari membentuk lingkaran bulat seperti angka 0.',
  },
  1: {
    view: 'Tampak Depan',
    instruction:
      'Acungkan satu jari telunjuk lurus ke atas, sementara jari lainnya mengepal rapat di telapak tangan.',
  },
  2: {
    view: 'Tampak Depan',
    instruction:
      'Acungkan jari telunjuk dan jari tengah lurus ke atas membentuk huruf V, dengan jari lainnya terlipat.',
  },
  3: {
    view: 'Tampak Depan',
    instruction:
      'Rentangkan ibu jari, jari telunjuk, dan jari tengah lurus ke atas, sementara jari manis dan kelingking terlipat.',
  },
  4: {
    view: 'Tampak Depan',
    instruction:
      'Rentangkan keempat jari (telunjuk, tengah, manis, kelingking) lurus ke atas dan lipat ibu jari ke telapak tangan.',
  },
  5: {
    view: 'Tampak Depan',
    instruction:
      'Buka dan rentangkan kelima jari tangan secara terbuka menghadap ke depan.',
  },
  6: {
    view: 'Tampak Depan',
    instruction:
      'Sentuhkan ujung ibu jari dengan ujung jari kelingking, lalu rentangkan ketiga jari lainnya lurus ke atas.',
  },
  7: {
    view: 'Tampak Depan',
    instruction:
      'Sentuhkan ujung ibu jari dengan ujung jari manis, sementara jari telunjuk, tengah, dan kelingking lurus ke atas.',
  },
  8: {
    view: 'Tampak Depan',
    instruction:
      'Sentuhkan ujung ibu jari dengan ujung jari tengah, sementara jari telunjuk, manis, dan kelingking lurus ke atas.',
  },
  9: {
    view: 'Tampak Depan',
    instruction:
      'Sentuhkan ujung ibu jari dengan ujung jari telunjuk membentuk lingkaran, lalu rentangkan ketiga jari lainnya lurus ke atas.',
  },
};

const NAV_ITEMS = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'kamus', label: 'Kamus' },
  { id: 'fitur', label: 'Fitur' },
  { id: 'aplikasi', label: 'Aplikasi' },
  { id: 'tentang', label: 'Tentang' },
];

const FEATURES = [
  {
    icon: 'lucide:graduation-cap',
    title: 'Materi Pembelajaran',
    description:
      'Materi SIBI dan SPOK dalam bentuk PDF, teks, dan video yang mudah dipahami.',
    cta: 'Pelajari Materi',
    action: 'login',
  },
  {
    icon: 'lucide:sliders-horizontal',
    title: 'Kamus SIBI',
    description:
      'Lihat gerakan tangan huruf A–Z dan angka 0–9 dalam SIBI lewat gambar yang jelas.',
    cta: 'Buka Kamus',
    action: 'kamus',
  },
  {
    icon: 'lucide:wand-2',
    title: 'Hearo Refine',
    description:
      'Tulis kalimatmu, lalu AI mengecek susunan SPOK-nya dan memberi saran perbaikan.',
    cta: 'Coba Refine',
    action: 'login',
  },
  {
    icon: 'lucide:award',
    title: 'Kuis & Level',
    description:
      'Kerjakan kuis pilihan ganda dan susun kata, lalu naik level setiap kali lulus.',
    cta: 'Mulai Kuis',
    action: 'login',
  },
];

const ROLES = [
  {
    title: 'Siswa',
    borderColor: 'border-t-[#007EDA]',
    iconBg: 'bg-[#007EDA] text-white',
    icon: 'lucide:smile',
    description:
      'Belajar materi SIBI dan SPOK, membuka kamus SIBI, mengerjakan kuis, dan melihat riwayat belajar sendiri.',
    points: ['Akses Materi, Kamus & Kuis', 'Pantau Riwayat Capaian'],
  },
  {
    title: 'Guru',
    borderColor: 'border-t-[#FCD34D]',
    iconBg: 'bg-[#FCD34D] text-[#102A43]',
    icon: 'lucide:book-open',
    description:
      'Membuka kamus SIBI dan memantau capaian serta riwayat belajar setiap siswa.',
    points: ['Akses Kamus SIBI', 'Pantau Capaian Siswa'],
  },
  {
    title: 'Orang Tua',
    borderColor: 'border-t-[#004A8F]',
    iconBg: 'bg-[#004A8F] text-white',
    icon: 'lucide:users',
    description:
      'Memantau capaian dan riwayat belajar anak dari rumah.',
    points: ['Pantau Capaian Anak', 'Lihat Riwayat Belajar'],
  },
];

const STEPS = [
  {
    number: '1',
    title: 'Daftar Akun Sesuai Peran',
    description:
      'Pilih registrasi sebagai Siswa, Guru, atau Orang Tua untuk mendapatkan tampilan antarmuka dan hak akses fitur yang relevan.',
  },
  {
    number: '2',
    title: 'Pelajari Materi & Kamus SIBI',
    description:
      'Pelajari materi SIBI dan SPOK, buka kamus SIBI, lalu cek kalimatmu dengan Hearo Refine.',
  },
  {
    number: '3',
    title: 'Kerjakan Kuis & Pantau Capaian',
    description:
      'Kerjakan kuis, dan lihat riwayat capaianmu. Guru dan orang tua juga bisa ikut memantau.',
  },
];

export default function LandingPage({
  onNavigateToLogin,
  onNavigateToRegister,
  currentUser,
  onNavigateToDashboard,
}) {
  const [activeNav, setActiveNav] = useState('beranda');
  const [selectedItem, setSelectedItem] = useState(null); // { type: 'Huruf' | 'Angka', value: 'A' | '0' }
  const [heroPreviewChar, setHeroPreviewChar] = useState('A');

  const selectedDetail = useMemo(() => {
    if (!selectedItem) return null;
    const info = SIBI_DETAILS[selectedItem.value] || {
      view: 'Tampak Depan',
      instruction: `Peragakan gerakan tangan untuk ${selectedItem.type.toLowerCase()} ${selectedItem.value} sesuai standar SIBI.`,
    };
    return {
      ...selectedItem,
      ...info,
      image: SIBI_IMAGE_MAP[selectedItem.value] || null,
    };
  }, [selectedItem]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveNav(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrimaryAction = () => {
    if (currentUser && onNavigateToDashboard) {
      onNavigateToDashboard();
    } else {
      onNavigateToLogin?.();
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#102A43] font-sans selection:bg-[#FCD34D] selection:text-[#102A43]">
      {/* ================= 1. NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => scrollToSection('beranda')}
            className="focus:outline-none hover:opacity-90 transition cursor-pointer shrink-0"
          >
            <HearoLogo />
          </button>

          {/* Center Pill Navigation */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden md:flex items-center bg-[#F8FAFC] border border-slate-200/80 rounded-full p-1.5 gap-1"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-[13px] transition cursor-pointer ${
                    isActive
                      ? 'bg-[#EEF4FF] text-[#007EDA] font-bold'
                      : 'text-slate-600 hover:text-[#007EDA] font-medium'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Auth Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {currentUser ? (
              <button
                type="button"
                onClick={onNavigateToDashboard}
                className="px-5 py-2.5 rounded-xl bg-[#007EDA] hover:bg-[#0068B8] text-white text-xs sm:text-sm font-bold transition cursor-pointer"
              >
                Ke Dashboard
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="px-4 sm:px-5 py-2 rounded-xl border border-[#007EDA]/40 text-[#007EDA] hover:bg-[#EEF4FF] text-xs sm:text-[13px] font-bold transition cursor-pointer"
                >
                  Masuk
                </button>
                <button
                  type="button"
                  onClick={onNavigateToRegister}
                  className="px-4 sm:px-5 py-2 rounded-xl bg-[#007EDA] hover:bg-[#0068B8] text-white text-xs sm:text-[13px] font-bold shadow-xs transition cursor-pointer"
                >
                  Daftar
                </button>
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  title="Masuk ke Akun"
                  aria-label="Masuk ke Akun"
                  className="w-9 h-9 rounded-full bg-[#007EDA] hover:bg-[#0068B8] text-white flex items-center justify-center transition cursor-pointer"
                >
                  <Icon icon="lucide:user" className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ================= 2. HERO SECTION ================= */}
      <section
        id="beranda"
        className="relative bg-gradient-to-br from-[#007EDA] via-[#0684E0] to-[#1290EA] text-white overflow-hidden"
      >
        {/* Decorative Subtle Circles */}
        <div className="pointer-events-none absolute -top-24 right-1/3 w-96 h-96 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-white/5" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-white">
              <Icon icon="lucide:compass" className="w-3.5 h-3.5 text-[#FCD34D]" />
              <span>JEMBATAN KOMUNIKASI TANPA BATAS.</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold leading-[1.2] tracking-tight text-white">
              Belajar Sistem Bahasa Isyarat Bahasa Indonesia dengan Mudah untuk
              Teman Tunarungu
            </h1>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl font-normal">
              Pelajari struktur kalimat SPOK, kerjakan kuis, dan kenali bahasa
              isyarat SIBI dalam satu website.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="px-6 py-3.5 rounded-xl bg-[#FCD34D] hover:bg-[#FBBF24] text-[#102A43] text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-sm transition transform active:scale-[0.99] cursor-pointer"
              >
                <Icon icon="lucide:play-circle" className="w-4 h-4" />
                <span>Mulai Belajar</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('kamus')}
                className="px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition cursor-pointer"
              >
                <Icon icon="lucide:hand" className="w-4 h-4" />
                <span>Buka Kamus</span>
              </button>
            </div>
          </div>

          {/* Hero Right Interactive SIBI Tablet Preview */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[430px] bg-white rounded-[24px] p-3.5 shadow-[0_24px_60px_rgba(7,37,68,0.28)] border border-white/60 text-[#102A43]">
              {/* Top Dark Status Bar */}
              <div className="bg-[#0B2239] text-white rounded-xl px-3.5 py-2 flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[10px] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#FCD34D] animate-pulse" />
                  <span>Deteksi Gerakan: Aktif</span>
                </div>
                <span className="text-[9px] font-extrabold tracking-wider uppercase bg-white/15 px-2 py-0.5 rounded-md">
                  SIBI
                </span>
              </div>

              {/* Mini Grid of A-Z Sign Cards */}
              <div className="bg-[#EEF4FF] rounded-2xl p-2.5 grid grid-cols-9 gap-1.5">
                {LETTERS.map((char) => {
                  const thumb = SIBI_IMAGE_MAP[char];
                  const isHighlighted = heroPreviewChar === char;
                  return (
                    <button
                      key={char}
                      type="button"
                      onMouseEnter={() => setHeroPreviewChar(char)}
                      onClick={() =>
                        setSelectedItem({ type: 'Huruf', value: char })
                      }
                      title={`Lihat Huruf ${char}`}
                      className={`rounded-lg p-1 flex flex-col items-center justify-center transition cursor-pointer ${
                        isHighlighted
                          ? 'bg-[#FCD34D] ring-2 ring-[#007EDA]'
                          : 'bg-white hover:bg-[#FCD34D]/70'
                      }`}
                    >
                      <div className="w-5 h-5 flex items-center justify-center overflow-hidden">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={`Isyarat ${char}`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Icon
                            icon="lucide:hand"
                            className="w-3.5 h-3.5 text-[#007EDA]"
                          />
                        )}
                      </div>
                      <span className="text-[8px] font-extrabold text-[#102A43] leading-none mt-0.5">
                        {char}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Dark Info Bar */}
              <div className="mt-3 bg-[#0B2239] text-white rounded-xl px-3.5 py-2 flex items-center justify-between">
                <div>
                  <p className="text-[8px] uppercase tracking-wider text-slate-400">
                    Kamus Isyarat
                  </p>
                  <p className="text-[11px] font-bold">A–Z & 0–9</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedItem({ type: 'Huruf', value: heroPreviewChar })
                  }
                  className="px-3 py-1 rounded-full bg-white text-[#102A43] text-[10px] font-extrabold hover:bg-[#FCD34D] transition cursor-pointer"
                >
                  Huruf {heroPreviewChar}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. KAMUS BAHASA ISYARAT ================= */}
      <section id="kamus" className="bg-[#EEF4FF] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Section Header */}
          <div className="text-center space-y-2 mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight">
              Kamus Bahasa Isyarat
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Klik huruf atau angka untuk melihat gerakan tangannya dalam SIBI.
            </p>
          </div>

          {/* 2-Column Dictionary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Huruf A-Z Card */}
            <div className="lg:col-span-7 bg-white rounded-[24px] p-6 sm:p-8 shadow-xs border border-[#DCE7F9]">
              <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#102A43] mb-6">
                <Icon
                  icon="lucide:layout-grid"
                  className="w-4 h-4 text-[#007EDA]"
                />
                <span>Huruf A–Z</span>
              </div>

              <div className="grid grid-cols-7 gap-2.5 sm:gap-3.5">
                {LETTERS.map((letter) => (
                  <button
                    key={letter}
                    type="button"
                    onClick={() =>
                      setSelectedItem({ type: 'Huruf', value: letter })
                    }
                    className={`aspect-square rounded-2xl bg-[#FCD34D] hover:bg-[#FBBF24] active:scale-95 text-[#102A43] font-extrabold text-sm sm:text-lg flex items-center justify-center shadow-2xs transition cursor-pointer ${
                      letter === 'V' ? 'col-start-2' : ''
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            {/* Angka 0-9 Card */}
            <div className="lg:col-span-5 bg-white rounded-[24px] p-6 sm:p-8 shadow-xs border border-[#DCE7F9]">
              <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#102A43] mb-6">
                <Icon
                  icon="lucide:layout-grid"
                  className="w-4 h-4 text-[#007EDA]"
                />
                <span>Angka 0–9</span>
              </div>

              <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
                {NUMBERS.map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() =>
                      setSelectedItem({ type: 'Angka', value: num })
                    }
                    className={`aspect-square rounded-2xl bg-[#FCD34D] hover:bg-[#FBBF24] active:scale-95 text-[#102A43] font-extrabold text-sm sm:text-lg flex items-center justify-center shadow-2xs transition cursor-pointer ${
                      num === '8' ? 'col-start-2' : ''
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. FITUR UNGGULAN HEARO AI ================= */}
      <section id="fitur" className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-2.5 mb-12">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#FCD34D] text-[#102A43] text-[10px] font-extrabold uppercase tracking-wider">
              SOLUSI TERPADU
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight">
              Fitur Unggulan Hearo AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Fitur yang membantu teman tunarungu belajar SIBI dan menyusun
              kalimat SPOK dengan mudah.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="bg-white rounded-[22px] p-6 border border-slate-200/80 hover:border-[#007EDA]/40 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#007EDA] text-white flex items-center justify-center mb-5 shadow-xs">
                    <Icon icon={feat.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#102A43] mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    feat.action === 'kamus'
                      ? scrollToSection('kamus')
                      : handlePrimaryAction()
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007EDA] hover:text-[#005BA6] transition cursor-pointer"
                >
                  <span>{feat.cta}</span>
                  <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 5. BANNER APLIKASI MOBILE ================= */}
      <section id="aplikasi" className="bg-[#F8FAFC] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="relative bg-gradient-to-r from-[#0068B8] to-[#007EDA] rounded-[28px] p-7 sm:p-11 text-white overflow-hidden shadow-lg flex flex-col md:flex-row items-center gap-7 sm:gap-10">
            {/* Decorative Wave */}
            <svg
              aria-hidden="true"
              viewBox="0 0 320 120"
              className="pointer-events-none hidden lg:block absolute right-6 bottom-4 w-72 h-28 text-white/10"
              fill="none"
            >
              <path
                d="M10 70 C 70 120, 140 20, 210 70 C 250 98, 285 60, 310 50"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M20 95 C 85 135, 155 45, 225 90 C 260 112, 290 82, 315 72"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>

            {/* Phone Frame Preview */}
            <div className="w-28 sm:w-32 h-44 sm:h-48 rounded-[22px] bg-[#0F263E] border-[4px] border-[#1E3B5A] flex flex-col items-center justify-center gap-2.5 shadow-xl shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-[#007EDA] flex items-center justify-center shadow-md">
                <HearoLogo variant="icon" className="[&_svg]:w-8 [&_svg]:h-8 [&_img]:w-8 [&_img]:h-8" />
              </div>
              <span className="text-sm font-extrabold tracking-tight text-white">
                Hearo
              </span>
            </div>

            {/* Banner Copy */}
            <div className="relative z-10 space-y-3 text-center md:text-left max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-[#FCD34D] text-[#102A43] text-[10px] font-extrabold uppercase tracking-wider">
                SUDAH TERSEDIA
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-white leading-snug">
                Jelajahi Fitur Menarik di Aplikasi Hearo!
              </h2>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                Aplikasi Hearo sudah bisa diunduh. Komunikasi lebih mudah dengan
                fitur video isyarat interaktif dan koreksi ekspresi langsung di
                genggamanmu.
              </p>
              <div className="pt-1">
                <a
                  href="#aplikasi"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePrimaryAction();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#EEF4FF] text-[#007EDA] text-xs sm:text-sm font-bold shadow-sm transition cursor-pointer"
                >
                  <Icon icon="lucide:download" className="w-4 h-4" />
                  <span>Unduh di Sini</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. PERAN PENGGUNA ================= */}
      <section id="tentang" className="bg-[#EEF4FF] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-2.5 mb-12">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#007EDA] text-white text-[10px] font-extrabold uppercase tracking-wider">
              PERAN PENGGUNA
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight">
              Dirancang Khusus untuk Siapa?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Siswa belajar dengan Hearo, guru dan orang tua ikut memantau
              capaiannya.
            </p>
          </div>

          {/* 3 Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROLES.map((item) => (
              <div
                key={item.title}
                className={`bg-white rounded-[24px] p-7 border border-[#DCE7F9] border-t-[5px] ${item.borderColor} shadow-xs flex flex-col justify-between`}
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center mb-5`}
                  >
                    <Icon icon={item.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#102A43] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed mb-5">
                    {item.description}
                  </p>
                </div>

                <ul className="space-y-2 pt-2">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2 text-xs font-bold text-[#007EDA]"
                    >
                      <Icon
                        icon="lucide:check-circle-2"
                        className="w-4 h-4 shrink-0"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 7. CARA KERJA & CTA BANNER ================= */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-16">
          {/* Cara Kerja Header */}
          <div>
            <div className="text-center max-w-xl mx-auto space-y-2.5 mb-12">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#FCD34D] text-[#102A43] text-[10px] font-extrabold uppercase tracking-wider">
                ALUR SEDERHANA
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight">
                Cara Kerja Hearo AI
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Tiga langkah mudah untuk memulai perjalanan pembelajaran bahasa
                yang terstruktur dan inklusif.
              </p>
            </div>

            {/* 3 Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className="bg-white rounded-[22px] p-7 border border-slate-200/80 shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FCD34D] text-[#102A43] font-extrabold text-sm flex items-center justify-center mb-5">
                    {step.number}
                  </div>
                  <h3 className="text-base font-extrabold text-[#102A43] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Yellow CTA Card */}
          <div className="bg-[#FCD34D] rounded-[28px] p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#102A43]">
                <Icon icon="lucide:ear" className="w-4 h-4" />
                <span>MULAI SEKARANG TANPA BIAYA</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] tracking-tight">
                Siap Mulai Belajar?
              </h2>
              <p className="text-xs sm:text-sm text-[#102A43]/85 leading-relaxed">
                Bergabunglah dengan ribuan teman tunarungu, guru SLB, dan
                keluarga di seluruh Indonesia untuk pembelajaran bahasa yang
                inklusif dan menyenangkan.
              </p>
            </div>

            <button
              type="button"
              onClick={onNavigateToRegister}
              className="px-7 py-3.5 rounded-xl bg-[#007EDA] hover:bg-[#0068B8] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-sm transition transform active:scale-[0.99] shrink-0 cursor-pointer"
            >
              <Icon icon="lucide:user-plus" className="w-4 h-4" />
              <span>Daftar Sekarang</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= 8. FOOTER ================= */}
      <footer className="bg-[#0058A3] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/15">
            {/* Brand Column */}
            <div className="md:col-span-6 space-y-3">
              <h3 className="text-xl font-extrabold tracking-tight text-white">
                Hearo
              </h3>
              <p className="text-xs sm:text-[13px] text-white/85 leading-relaxed max-w-sm">
                Tempat belajar bahasa isyarat SIBI dan menyusun kalimat SPOK
                dengan mudah dan seru untuk teman tunarungu.
              </p>
              <p className="pt-2 text-xs text-white/80">
                Ikuti Kami:{' '}
                <a href="#beranda" className="hover:underline font-medium">
                  Instagram
                </a>{' '}
                ·{' '}
                <a href="#beranda" className="hover:underline font-medium">
                  YouTube
                </a>{' '}
                ·{' '}
                <a href="#beranda" className="hover:underline font-medium">
                  WhatsApp
                </a>
              </p>
            </div>

            {/* Navigasi Column */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#FCD34D]">
                NAVIGASI
              </h4>
              <ul className="space-y-2 text-xs sm:text-[13px] text-white/90">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('beranda')}
                    className="hover:underline cursor-pointer"
                  >
                    Beranda
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('kamus')}
                    className="hover:underline cursor-pointer"
                  >
                    Kamus SIBI
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('fitur')}
                    className="hover:underline cursor-pointer"
                  >
                    Fitur
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('aplikasi')}
                    className="hover:underline cursor-pointer"
                  >
                    Aplikasi Mobile
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('tentang')}
                    className="hover:underline cursor-pointer"
                  >
                    Tentang Hearo
                  </button>
                </li>
              </ul>
            </div>

            {/* Bantuan Column */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#FCD34D]">
                BANTUAN
              </h4>
              <ul className="space-y-2 text-xs sm:text-[13px] text-white/90">
                <li>
                  <a href="#tentang" className="hover:underline">
                    Hubungi Kami
                  </a>
                </li>
                <li>
                  <a href="#tentang" className="hover:underline">
                    Ketentuan Layanan
                  </a>
                </li>
                <li>
                  <a href="#tentang" className="hover:underline">
                    Kebijakan Privasi
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Row */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/80">
            <p>© 2026 Hearo AI. Hak Cipta Dilindungi Undang-Undang.</p>
            <p>Inklusif & Aksesibel · Sistem Isyarat Bahasa Indonesia (SIBI)</p>
          </div>
        </div>
      </footer>

      {/* ================= 9. POPUP MODAL KAMUS SIBI ================= */}
      {selectedDetail && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sibi-modal-title"
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-50 bg-[#102A43]/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[440px] bg-white rounded-[28px] p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FCD34D] shrink-0" />
                <h3
                  id="sibi-modal-title"
                  className="text-xl font-extrabold text-[#102A43]"
                >
                  {selectedDetail.type} {selectedDetail.value} – SIBI
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Tutup modal"
                className="w-9 h-9 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#102A43] flex items-center justify-center transition cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Hand Sign Card */}
            <div className="relative bg-[#EEF4FF] rounded-2xl p-6 min-h-[250px] flex items-center justify-center mb-4">
              {selectedDetail.image ? (
                <img
                  src={selectedDetail.image}
                  alt={`Gerakan SIBI ${selectedDetail.type} ${selectedDetail.value}`}
                  className="max-h-[205px] w-auto object-contain select-none"
                />
              ) : (
                <div className="text-center text-slate-400 space-y-2">
                  <Icon
                    icon="lucide:hand"
                    className="w-16 h-16 mx-auto text-[#007EDA]/50"
                  />
                  <p className="text-xs font-medium">
                    Gambar {selectedDetail.value} belum ditemukan di{' '}
                    <code>src/assets/sibi/</code>
                  </p>
                </div>
              )}

              {/* Bottom-left View Angle Pill */}
              <span className="absolute bottom-3.5 left-3.5 px-3.5 py-1.5 rounded-full bg-[#475569] text-white text-xs font-bold shadow-xs">
                {selectedDetail.view}
              </span>
            </div>

            {/* Visual Movement Instruction Box */}
            <div className="bg-[#EEF4FF] rounded-2xl p-4 space-y-1.5">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-[#007EDA]">
                PETUNJUK GERAKAN VISUAL:
              </p>
              <p className="text-xs sm:text-sm text-[#102A43] leading-relaxed">
                {selectedDetail.instruction}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}