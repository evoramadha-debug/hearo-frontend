import React, { useState } from 'react';
import HearoLogo from '../components/HearoLogo';
import { Icon } from '@iconify/react';
import logoIcon from '../assets/logo-icon.svg';

export default function LandingPage({ onNavigateToLogin, onNavigateToRegister }) {
  const [activeTab, setActiveTab] = useState('SIBI'); // SIBI / BISINDO
  const [activeNav, setActiveNav] = useState('Beranda');
  
  // State untuk Pop-up Modal Karakter Kamus
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // State untuk Pop-up Modal Proteksi Fitur (Meminta Login/Daftar)
  const [authRequiredFeature, setAuthRequiredFeature] = useState(null);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const numbers = '0123456789'.split('');

  const handleNavClick = (sectionId, navName) => {
    setActiveNav(navName);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fungsi saat tombol huruf / angka kamus diklik
  const handleCharacterClick = (char) => {
    setSelectedCharacter(char);
  };

  // Fungsi saat link fitur diklik: Auto-Scroll ke Atas & Tampilkan Pop-up Notifikasi Auth
  const handleProtectedFeatureClick = (e, featureName) => {
    e.preventDefault(); // Mencegah link pindah halaman / jump instant
    
    // 1. Auto scroll smooth ke paling atas
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // 2. Set state nama fitur yang diklik untuk memicu pop-up
    setAuthRequiredFeature(featureName);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-[#102A43] font-sans antialiased relative">
      
      {/* ================= 1. NAVBAR FIXED ================= */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex justify-between items-center">
          
          <div className="flex items-center cursor-pointer" onClick={() => handleNavClick('hero', 'Beranda')}>
            <HearoLogo variant="card" />
          </div>

          <nav className="hidden md:flex items-center bg-[#F0F4F8] p-1.5 rounded-full border border-slate-200/60 shadow-inner">
            {['Beranda', 'Kamus', 'Fitur', 'Aplikasi', 'Tentang'].map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item.toLowerCase(), item)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeNav === item
                    ? 'bg-white text-[#007EDA] shadow-md scale-102'
                    : 'text-slate-600 hover:text-[#007EDA]'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onNavigateToLogin}
              className="px-5 py-2.5 rounded-full border-2 border-[#007EDA] text-[#007EDA] hover:bg-[#007EDA]/10 text-xs font-bold transition cursor-pointer"
            >
              Masuk
            </button>
            <button
              onClick={onNavigateToRegister}
              className="px-5 py-2.5 rounded-full bg-[#007EDA] hover:bg-[#0067B8] text-white text-xs font-bold transition shadow-md cursor-pointer"
            >
              Daftar
            </button>
            <div className="w-8 h-8 rounded-full bg-[#007EDA] text-white flex items-center justify-center text-sm font-bold shadow-sm">
              <Icon icon="lucide:user" className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* ================= 2. HERO BANNER SECTION ================= */}
      <section id="hero" className="bg-[#007EDA] text-white py-12 md:py-20 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#0067B8]/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-[#6DD5FA]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-[11px] font-extrabold tracking-wider text-white">
              <span className="w-4 h-4 rounded-full border border-white/80 flex items-center justify-center text-[9px]">✓</span>
              <span>JEMBATAN KOMUNIKASI TANPA BATAS.</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.2] text-white">
              Belajar Bahasa Indonesia dengan Mudah untuk Teman Tunarungu
            </h1>

            <p className="text-sm md:text-base text-white/90 leading-relaxed font-normal max-w-xl">
              Pelajari struktur kalimat SPOK, kerjakan kuis, dan kenali bahasa isyarat SIBI & BISINDO dalam satu website.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onNavigateToRegister}
                className="px-7 py-3.5 bg-[#FFC72C] hover:bg-yellow-400 text-[#102A43] font-black rounded-2xl shadow-lg text-xs md:text-sm transition flex items-center gap-2.5 cursor-pointer"
              >
                <Icon icon="solar:play-circle-bold" className="w-5 h-5 text-[#102A43]" />
                <span>Mulai Belajar</span>
              </button>
              
              <button
                onClick={() => handleNavClick('kamus', 'Kamus')}
                className="px-7 py-3.5 bg-[#0067B8]/70 hover:bg-[#0067B8] backdrop-blur-md text-white font-bold rounded-2xl border border-white/20 text-xs md:text-sm transition flex items-center gap-2.5 cursor-pointer"
              >
                <Icon icon="fluent-emoji-flat:raised-hand" className="w-5 h-5" />
                <span>Buka Kamus</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <img 
              src="/src/assets/hero-tablet-mockup.jpeg" 
              alt="Hearo Tablet Mockup" 
              className="w-full max-w-lg h-auto drop-shadow-2xl hover:scale-105 transition duration-300 rounded-[28px]"
            />
          </div>

        </div>
      </section>

      {/* ================= 3. KAMUS BAHASA ISYARAT ================= */}
      <section id="kamus" className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#102A43] mb-3">
          Kamus Bahasa Isyarat
        </h2>
        <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto mb-8 font-medium">
          Pilih jenis bahasa isyarat, lalu klik huruf atau angka untuk melihat gerakan tangannya secara instan.
        </p>

        {/* Tab SIBI / BISINDO */}
        <div className="inline-flex bg-[#E8EEF5] p-1.5 rounded-2xl mb-10 border border-slate-200">
          <button
            onClick={() => setActiveTab('SIBI')}
            className={`px-8 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'SIBI'
                ? 'bg-[#007EDA] text-white shadow-md'
                : 'text-slate-600 hover:text-[#007EDA]'
            }`}
          >
            SIBI
          </button>
          <button
            onClick={() => setActiveTab('BISINDO')}
            className={`px-8 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'BISINDO'
                ? 'bg-[#007EDA] text-white shadow-md'
                : 'text-slate-600 hover:text-[#007EDA]'
            }`}
          >
            BISINDO
          </button>
        </div>

        {/* Grid Karakter Box */}
        <div className="bg-white rounded-[32px] p-6 md:p-10 border border-slate-100 shadow-xl text-left max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-[#102A43] mb-6">
            <Icon icon="fluent-emoji-flat:input-latin-uppercase" className="w-5 h-5" />
            <span>Pilih Karakter untuk Dipelajari ({activeTab})</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Abjad A-Z */}
            <div className="lg:col-span-7 grid grid-cols-4 sm:grid-cols-7 gap-3">
              {alphabet.map((item) => (
                <button
                  key={item}
                  onClick={() => handleCharacterClick(item)}
                  className="h-12 bg-[#F0F5FA] hover:bg-[#007EDA] hover:text-white text-[#102A43] rounded-2xl font-extrabold text-sm flex items-center justify-center transition border border-slate-100 cursor-pointer shadow-sm hover:scale-105"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="hidden lg:block w-px bg-slate-200 h-full mx-auto"></div>

            {/* Angka 0-9 */}
            <div className="lg:col-span-4 grid grid-cols-4 gap-3">
              {numbers.map((num) => (
                <button
                  key={num}
                  onClick={() => handleCharacterClick(num)}
                  className="h-12 bg-[#F0F5FA] hover:bg-[#007EDA] hover:text-white text-[#102A43] rounded-2xl font-extrabold text-sm flex items-center justify-center transition border border-slate-100 cursor-pointer shadow-sm hover:scale-105"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= POP-UP MODAL KAMUS ISYARAT FIGMA ================= */}
      {selectedCharacter && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setSelectedCharacter(null)}
        >
          <div 
            className="relative max-w-xs md:max-w-sm w-full animate-scaleUp overflow-hidden rounded-[24px] shadow-2xl border-2 border-white bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCharacter(null)}
              className="absolute top-3.5 right-3.5 z-20 w-7 h-7 bg-white/80 hover:bg-white text-slate-700 rounded-full font-extrabold flex items-center justify-center text-xs transition cursor-pointer shadow-md border border-slate-200"
              title="Tutup"
            >
              ✕
            </button>

            <img
              src={`/src/assets/${activeTab.toLowerCase()}/${selectedCharacter.toLowerCase()}.png`}
              alt={`Kartu Isyarat ${selectedCharacter}`}
              className="w-full h-auto block object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/320x440?text=Gambar+${selectedCharacter}+Belum+Tersedia`;
              }}
            />
          </div>
        </div>
      )}

      {/* ================= POP-UP MODAL PERINTAH REGISTRASI / LOGIN ================= */}
      {authRequiredFeature && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setAuthRequiredFeature(null)}
        >
          <div 
            className="relative max-w-md w-full bg-white rounded-[32px] p-8 text-center shadow-2xl border border-slate-100 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Close */}
            <button
              onClick={() => setAuthRequiredFeature(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold flex items-center justify-center text-xs transition cursor-pointer"
            >
              ✕
            </button>

            {/* Icon Lock / Key */}
            <div className="w-16 h-16 bg-[#EAF3FD] text-[#007EDA] rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Icon icon="solar:lock-keyhole-minimalistic-bold-duotone" className="w-9 h-9" />
            </div>

            <h3 className="text-xl font-extrabold text-[#102A43] mb-2">
              Akses Fitur Terkunci!
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
              Untuk membuka menu <strong className="text-[#007EDA]">"{authRequiredFeature}"</strong> dan mulai mengakses modul pembelajaran interaktif, silakan lakukan pendaftaran atau masuk ke akun HEARO AI kamu.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  setAuthRequiredFeature(null);
                  onNavigateToLogin();
                }}
                className="w-full py-3 bg-[#F0F5FA] hover:bg-slate-200 text-[#007EDA] font-extrabold rounded-2xl text-xs transition cursor-pointer border border-slate-200"
              >
                Masuk ke Akun
              </button>
              
              <button
                onClick={() => {
                  setAuthRequiredFeature(null);
                  onNavigateToRegister();
                }}
                className="w-full py-3 bg-[#007EDA] hover:bg-[#0067B8] text-white font-extrabold rounded-2xl text-xs transition cursor-pointer shadow-md"
              >
                Daftar Akun Baru
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. FITUR UNGGULAN HEARO AI ================= */}
      <section id="fitur" className="py-16 md:py-24 bg-[#EFF5FC]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          
          <div className="inline-block bg-[#DCEBFA] text-[#007EDA] text-[11px] font-extrabold uppercase px-4 py-1.5 rounded-full mb-4 tracking-wider">
            SOLUSI TERPADU
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#102A43] mb-3">
            Fitur Unggulan Hearo AI
          </h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto mb-12 font-medium">
            Dirancang untuk mempercepat pemahaman gramatikal dan bahasa visual tanpa hambatan komunikasi.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition duration-200">
              <div>
                <div className="w-14 h-14 bg-[#EAF3FD] rounded-2xl flex items-center justify-center mb-6">
                  <Icon icon="lucide:graduation-cap" className="w-7 h-7 text-[#007EDA]" />
                </div>
                <h3 className="text-lg font-extrabold text-[#102A43] mb-3">Materi Pembelajaran</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Materi komprehensif dalam berbentuk PDF, teks, dan video untuk semua level
                </p>
              </div>
              <a 
                href="#" 
                onClick={(e) => handleProtectedFeatureClick(e, 'Materi Pembelajaran')}
                className="mt-8 text-xs font-bold text-[#007EDA] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>Pelajari Modul</span>
                <Icon icon="solar:arrow-right-linear" className="w-4 h-4" />
              </a>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition duration-200">
              <div>
                <div className="w-14 h-14 bg-[#EAF3FD] rounded-2xl flex items-center justify-center mb-6">
                  <Icon icon="lucide:variable" className="w-7 h-7 text-[#007EDA]" />
                </div>
                <h3 className="text-lg font-extrabold text-[#102A43] mb-3">Panduan SPOK</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Penjelasan Subjek, Predikat, Objek, dan Keterangan dengan kartu visual kontras tinggi serta contoh perbaikan kalimat.
                </p>
              </div>
              <a 
                href="#" 
                onClick={(e) => handleProtectedFeatureClick(e, 'Panduan SPOK')}
                className="mt-8 text-xs font-bold text-[#007EDA] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>Buka Panduan</span>
                <Icon icon="solar:arrow-right-linear" className="w-4 h-4" />
              </a>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition duration-200">
              <div>
                <div className="w-14 h-14 bg-[#EAF3FD] rounded-2xl flex items-center justify-center mb-6">
                  <Icon icon="lucide:wand-2" className="w-7 h-7 text-[#007EDA]" />
                </div>
                <h3 className="text-lg font-extrabold text-[#102A43] mb-3">Hearo Refine</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Koreksi AI instan: cek apakah susunan kalimatmu sudah tepat dan dapatkan saran struktur bahasa baku secara otomatis.
                </p>
              </div>
              <a 
                href="#" 
                onClick={(e) => handleProtectedFeatureClick(e, 'Hearo Refine')}
                className="mt-8 text-xs font-bold text-[#007EDA] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>Coba Refine</span>
                <Icon icon="solar:arrow-right-linear" className="w-4 h-4" />
              </a>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition duration-200">
              <div>
                <div className="w-14 h-14 bg-[#EAF3FD] rounded-2xl flex items-center justify-center mb-6">
                  <Icon icon="lucide:medal" className="w-7 h-7 text-[#007EDA]" />
                </div>
                <h3 className="text-lg font-extrabold text-[#102A43] mb-3">Kuis & Level</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Tantangan pilihan ganda dan puzzle susun kata dengan kalkulasi skor otomatis. Raih poin dan naik level setiap lulus.
                </p>
              </div>
              <a 
                href="#" 
                onClick={(e) => handleProtectedFeatureClick(e, 'Kuis & Level')}
                className="mt-8 text-xs font-bold text-[#007EDA] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>Mulai Kuis</span>
                <Icon icon="solar:arrow-right-linear" className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 5. APLIKASI HEARO MOBILE & PERAN PENGGUNA ================= */}
      <section id="aplikasi" className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8 space-y-20">
        
       {/* Banner Aplikasi Mobile Presisi Figma */}
        <div className="relative bg-[#EFF5FC] rounded-[36px] p-8 md:p-12 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm overflow-hidden">
          
     {/* Visual Mockup Handphone Figma */}
          <div className="relative w-44 md:w-48 h-64 md:h-72 bg-[#007EDA] rounded-[32px] p-4 text-white shadow-2xl flex flex-col justify-between transform -rotate-6 border-[6px] border-[#102A43] shrink-0 overflow-hidden">
            
            {/* Notch HP Atas (Dark Navy) */}
            <div className="w-14 h-2.5 bg-[#102A43] rounded-full mx-auto mb-2 shrink-0"></div>
            
            {/* Isi Layar HP */}
            <div className="flex flex-col items-center justify-center my-auto space-y-3">
              
              {/* Kotak App Icon (Memanggil logo-icon.svg langsung) */}
              <div className="w-20 h-20 bg-[#0067B8] rounded-2xl flex items-center justify-center p-3 shadow-lg border border-white/20">
                <img 
                  src={logoIcon} 
                  alt="Hearo Icon" 
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Tulisan Hearo Hanya 1 di Bawah Logo */}
              <span className="text-2xl font-black tracking-wide text-white drop-shadow-md">
                Hearo
              </span>
            </div>

            {/* Bottom Bar HP */}
            <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mt-auto shrink-0"></div>
          </div>

          {/* 2. Konten Teks Tengah */}
          <div className="flex-1 space-y-4 text-left z-10 md:pl-4">
            <span className="inline-block bg-[#FFC72C] text-[#102A43] text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
              SEGERA HADIR
            </span>
            
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#102A43] leading-tight">
              Explore Fitur Menarik di Aplikasi HEARO!
            </h3>
            
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium max-w-lg">
              Aplikasi HEARO segera hadir. Komunikasi lebih mudah dengan fitur video-isyarat interaktif dan koreksi ekspresi langsung di genggamanmu.
            </p>
            
            <button className="px-6 py-3 bg-[#243B53] text-white rounded-full text-xs font-bold flex items-center gap-2 cursor-not-allowed shadow-md hover:bg-[#102A43] transition">
              <Icon icon="lucide:timer" className="w-4 h-4 text-slate-300" />
              <span>Segera Hadir di Play Store</span>
            </button>
          </div>

          {/* 3. Aksen Garis Gelombang Biru Figma (Sebelah Kanan) */}
          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none">
            <svg width="180" height="80" viewBox="0 0 180 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 40C35 15 65 65 95 40C125 15 155 65 175 40" stroke="#90C2E7" strokeWidth="6" strokeLinecap="round"/>
              <path d="M5 60C35 35 65 85 95 60C125 35 155 85 175 60" stroke="#B9DCF5" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>

        </div>
        {/* Peran Pengguna Header */}
        <div id="tentang" className="text-center">
          <div className="inline-block bg-[#E3F2FD] text-[#007EDA] text-[11px] font-extrabold uppercase px-4 py-1.5 rounded-full mb-3 tracking-wider">
            PERAN PENGGUNA
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#102A43] mb-3">
            Dirancang Khusus untuk Siapa?
          </h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto mb-12 font-medium">
            Ekosistem inklusif yang menghubungkan proses belajar mandiri siswa dengan bimbingan guru dan pantauan keluarga.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-[#EAF3FD] rounded-2xl flex items-center justify-center mb-6">
                  <Icon icon="lucide:smile" className="w-7 h-7 text-[#007EDA]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#102A43] mb-3">Siswa</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-8">
                  Belajar materi SPOK interaktif, berlatih kamus isyarat SIBI/BISINDO, menyelesaikan kuis, dan melihat riwayat kemajuan belajar secara mandiri.
                </p>
              </div>
              <ul className="text-xs font-bold text-[#007EDA] space-y-2.5 border-t border-slate-100 pt-5">
                <li className="flex items-center gap-2">
                  <Icon icon="lucide:check-circle-2" className="w-4 h-4 text-[#007EDA]" />
                  <span>Akses Materi & Kuis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="lucide:check-circle-2" className="w-4 h-4 text-[#007EDA]" />
                  <span>Pantau Skor XP Harian</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-[#EAF3FD] rounded-2xl flex items-center justify-center mb-6">
                  <Icon icon="lucide:book-open" className="w-7 h-7 text-[#007EDA]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#102A43] mb-3">Guru</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-8">
                  Mengelola materi pembelajaran, menyusun paket kuis serta memantau capaian skor tiap murid secara terpadu.
                </p>
              </div>
              <ul className="text-xs font-bold text-[#007EDA] space-y-2.5 border-t border-slate-100 pt-5">
                <li className="flex items-center gap-2">
                  <Icon icon="lucide:check-circle-2" className="w-4 h-4 text-[#007EDA]" />
                  <span>Unggah Modul</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="lucide:check-circle-2" className="w-4 h-4 text-[#007EDA]" />
                  <span>Analitik Kelas Lengkap</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-[#EAF3FD] rounded-2xl flex items-center justify-center mb-6">
                  <Icon icon="lucide:users" className="w-7 h-7 text-[#007EDA]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#102A43] mb-3">Orang Tua</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-8">
                  Memantau capaian belajar anak secara transparan di rumah, serta mendampingi latihan komunikasi isyarat sehari-hari.
                </p>
              </div>
              <ul className="text-xs font-bold text-[#007EDA] space-y-2.5 border-t border-slate-100 pt-5">
                <li className="flex items-center gap-2">
                  <Icon icon="lucide:check-circle-2" className="w-4 h-4 text-[#007EDA]" />
                  <span>Pantau Progres Anak</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="lucide:check-circle-2" className="w-4 h-4 text-[#007EDA]" />
                  <span>Panduan Pendampingan</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </section>

      {/* ================= 6. CARA KERJA HEARO AI ================= */}
      <section className="py-16 md:py-20 bg-[#F4F7FC]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          
          <div className="inline-block bg-[#E3F2FD] text-[#007EDA] text-[11px] font-extrabold uppercase px-4 py-1.5 rounded-full mb-3 tracking-wider">
            ALUR SEDERHANA
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#102A43] mb-3">
            Cara Kerja Hearo AI
          </h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto mb-12 font-medium">
            Tiga langkah mudah untuk memulai perjalanan pembelajaran bahasa yang terstruktur dan inklusif.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-md">
              <div className="w-10 h-10 bg-[#007EDA] text-white font-black rounded-xl flex items-center justify-center mb-5 text-base">
                1
              </div>
              <h3 className="text-base font-extrabold text-[#102A43] mb-2">Daftar Akun Sesuai Peran</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Pilih registrasi sebagai Siswa, Guru, atau Orang Tua untuk mendapatkan tampilan antarmuka dan hak akses fitur yang relevan.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-md">
              <div className="w-10 h-10 bg-[#007EDA] text-white font-black rounded-xl flex items-center justify-center mb-5 text-base">
                2
              </div>
              <h3 className="text-base font-extrabold text-[#102A43] mb-2">Pelajari Materi & Panduan SPOK</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Akses pustaka video bahasa isyarat SIBI/BISINDO, pahami tata kalimat SPOK, dan gunakan Hearo Refine untuk koreksi instan.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-md">
              <div className="w-10 h-10 bg-[#007EDA] text-white font-black rounded-xl flex items-center justify-center mb-5 text-base">
                3
              </div>
              <h3 className="text-base font-extrabold text-[#102A43] mb-2">Kerjakan Kuis & Pantau Perkembangan</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Selesaikan latihan interaktif, dapatkan umpan balik visual real-time, dan pantau kenaikan level serta riwayat pencapaianmu.
              </p>
            </div>

          </div>

          <div className="mt-16 bg-[#FFC72C] text-[#102A43] rounded-[36px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-left">
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider block">
                👋 MULAI SEKARANG TANPA BIAYA
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold">
                Siap Mulai Belajar?
              </h3>
              <p className="text-xs md:text-sm font-medium leading-relaxed max-w-xl text-[#102A43]/90">
                Bergabunglah dengan ribuan teman tunarungu, guru SLB, dan keluarga di seluruh Indonesia untuk pembelajaran bahasa yang inklusif dan menyenangkan.
              </p>
            </div>
            
            <button
              onClick={onNavigateToRegister}
              className="px-8 py-4 bg-[#007EDA] hover:bg-[#0067B8] text-white font-extrabold rounded-2xl shadow-xl text-sm transition flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Icon icon="lucide:user-plus" className="w-5 h-5" />
              <span>Daftar Sekarang</span>
            </button>
          </div>

        </div>
      </section>

   {/* ================= 7. FOOTER NAVY PRESISI FIGMA ================= */}
      <footer className="bg-[#102A43] text-white py-14 border-t border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Sisi Kiri: Logo, Deskripsi Rata Tengah, & Sosial Media */}
          <div className="md:col-span-7 flex flex-col items-center md:items-center text-center space-y-5">
            
            {/* Logo Hearo Transparent (Ikon Telinga + Teks Tanpa Background Card) */}
            <HearoLogo className="h-9" variant="transparent" />

            {/* Deskripsi Misi Hearo */}
            <p className="text-xs md:text-sm text-[#9FB3C8] leading-relaxed max-w-lg font-normal">
              Platform edukasi cerdas & inklusif berbasis kecerdasan artifisial yang memberdayakan teman tunarungu dalam memahami struktur tata bahasa SPOK serta memperdalam kefasihan bahasa isyarat SIBI dan BISINDO secara interaktif.
            </p>
            
            {/* Ikuti Komunitas & Icon Boxes */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <span className="text-xs text-[#9FB3C8] font-semibold mr-1">
                Ikuti Komunitas:
              </span>
              
              {/* Box Ikon 1: Message */}
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition border border-white/10 text-white">
                <Icon icon="lucide:message-square" className="w-5 h-5 text-white" />
              </a>

              {/* Box Ikon 2: YouTube Garis Putih (Bukan Merah) */}
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition border border-white/10 text-white">
                <Icon icon="lucide:youtube" className="w-5 h-5 text-white" />
              </a>

              {/* Box Ikon 3: Code */}
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition border border-white/10 text-white">
                <Icon icon="lucide:code-2" className="w-5 h-5 text-white" />
              </a>

              {/* Box Ikon 4: Help */}
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition border border-white/10 text-white">
                <Icon icon="lucide:help-circle" className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          
       {/* Sisi Kanan: Navigasi Pembelajaran Rata Tengah */}
          <div className="md:col-span-5 space-y-4 text-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              NAVIGASI PEMBELAJARAN
            </h4>
            <ul className="text-xs md:text-sm text-[#9FB3C8] space-y-3 font-normal">
              <li><a href="#hero" className="hover:text-white transition">Beranda Utama</a></li>
              <li><a href="#kamus" className="hover:text-white transition">Kamus SIBI & BISINDO</a></li>
              <li><a href="#fitur" className="hover:text-white transition">Fitur AI Visual Tracker</a></li>
              <li><a href="#aplikasi" className="hover:text-white transition">Aplikasi Web & Mobile</a></li>
              <li><a href="#tentang" className="hover:text-white transition">Tentang Misi Hearo</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Line Copyright & Accessibility */}
        <div className="max-w-7xl mx-auto px-4 md:px-10 mt-14 pt-9 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-[11px] md:text-xs text-[#9FB3C8] gap-4">
          <div>© 2026 Hearo AI. Hak Cipta Dilindungi Undang-Undang.</div>
          <div className="flex items-center gap-2 font-medium text-white">
            <Icon icon="lucide:accessibility" className="w-4 h-4 text-[#FFC72C]" />
            <span>Inklusif & Aksesibel</span>
            <span className="mx-1.5">•</span>
            <span>Bahasa Isyarat Indonesia</span>
          </div>
        </div>
      </footer>

    </div>
  );
}