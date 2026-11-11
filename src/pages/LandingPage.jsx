import React, { useState } from 'react';
import HearoLogo from '../components/HearoLogo';

export default function LandingPage({ onNavigateToLogin, onNavigateToRegister }) {
  const [activeTab, setActiveTab] = useState('SIBI'); // SIBI / BISINDO
  const [activeNav, setActiveNav] = useState('Beranda');
  
  // State untuk Pop-up Modal Karakter
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const numbers = '0123456789'.split('');

  const handleNavClick = (sectionId, navName) => {
    setActiveNav(navName);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fungsi saat tombol huruf / angka diklik
  const handleCharacterClick = (char) => {
    setSelectedCharacter(char);
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
              👤
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
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
                <span>Mulai Belajar</span>
              </button>
              
              <button
                onClick={() => handleNavClick('kamus', 'Kamus')}
                className="px-7 py-3.5 bg-[#0067B8]/70 hover:bg-[#0067B8] backdrop-blur-md text-white font-bold rounded-2xl border border-white/20 text-xs md:text-sm transition flex items-center gap-2.5 cursor-pointer"
              >
                <span className="text-base">🖐</span>
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
            <span>🔠</span>
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
          onClick={() => setSelectedCharacter(null)} // Klik luar modal untuk menutup
        >
          <div 
            className="relative max-w-xs md:max-w-sm w-full animate-scaleUp overflow-hidden rounded-[24px] shadow-2xl border-2 border-white bg-white"
            onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat area dalam diklik
          >
            
            {/* Tombol Close (X) Rapi & Presisi */}
            <button
              onClick={() => setSelectedCharacter(null)}
              className="absolute top-3.5 right-3.5 z-20 w-7 h-7 bg-white/80 hover:bg-white text-slate-700 rounded-full font-extrabold flex items-center justify-center text-xs transition cursor-pointer shadow-md border border-slate-200"
              title="Tutup"
            >
              ✕
            </button>

            {/* Gambar Kartu Figma */}
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

      {/* ================= 4. FITUR UNGGULAN HEARO AI ================= */}
      <section id="fitur" className="py-16 md:py-24 bg-[#EDF4FC]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          
          <div className="inline-block bg-[#D6E6F7] text-[#007EDA] text-[11px] font-extrabold uppercase px-4 py-1.5 rounded-full mb-3 tracking-wider">
            SOLUSI TERPADU
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#102A43] mb-3">
            Fitur Unggulan Hearo AI
          </h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto mb-12 font-medium">
            Dirancang untuk mempercepat pemahaman gramatikal dan bahasa visual tanpa hambatan komunikasi.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            
            <div className="bg-white p-7 rounded-[28px] border border-slate-100 shadow-lg flex flex-col justify-between hover:shadow-xl transition">
              <div>
                <div className="w-12 h-12 bg-[#E3F2FD] text-[#007EDA] rounded-2xl flex items-center justify-center text-xl mb-5">
                  🎓
                </div>
                <h3 className="text-base font-extrabold text-[#102A43] mb-2">Materi Pembelajaran</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Materi komprehensif dalam bentuk PDF, teks, dan video untuk semua level.
                </p>
              </div>
              <a href="#" className="mt-6 text-xs font-bold text-[#007EDA] hover:underline flex items-center gap-1">
                Pelajari Modul →
              </a>
            </div>

            <div className="bg-white p-7 rounded-[28px] border border-slate-100 shadow-lg flex flex-col justify-between hover:shadow-xl transition">
              <div>
                <div className="w-12 h-12 bg-[#E3F2FD] text-[#007EDA] rounded-2xl flex items-center justify-center text-xl mb-5">
                  🔤
                </div>
                <h3 className="text-base font-extrabold text-[#102A43] mb-2">Panduan SPOK</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Penjelasan Subjek, Predikat, Objek, dan Keterangan dengan kartu visual kontras tinggi.
                </p>
              </div>
              <a href="#" className="mt-6 text-xs font-bold text-[#007EDA] hover:underline flex items-center gap-1">
                Buka Panduan →
              </a>
            </div>

            <div className="bg-white p-7 rounded-[28px] border border-slate-100 shadow-lg flex flex-col justify-between hover:shadow-xl transition">
              <div>
                <div className="w-12 h-12 bg-[#E3F2FD] text-[#007EDA] rounded-2xl flex items-center justify-center text-xl mb-5">
                  🪄
                </div>
                <h3 className="text-base font-extrabold text-[#102A43] mb-2">Hearo Refine</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Koreksi AI instan: cek apakah susunan kalimatmu sudah tepat dan dapatkan saran bahasa baku.
                </p>
              </div>
              <a href="#" className="mt-6 text-xs font-bold text-[#007EDA] hover:underline flex items-center gap-1">
                Coba Refine →
              </a>
            </div>

            <div className="bg-white p-7 rounded-[28px] border border-slate-100 shadow-lg flex flex-col justify-between hover:shadow-xl transition">
              <div>
                <div className="w-12 h-12 bg-[#E3F2FD] text-[#007EDA] rounded-2xl flex items-center justify-center text-xl mb-5">
                  🎖️
                </div>
                <h3 className="text-base font-extrabold text-[#102A43] mb-2">Kuis & Level</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Tantangan pilihan ganda dan puzzle susun kata dengan kalkulasi skor otomatis.
                </p>
              </div>
              <a href="#" className="mt-6 text-xs font-bold text-[#007EDA] hover:underline flex items-center gap-1">
                Mulai Kuis →
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 5. APLIKASI HEARO MOBILE & PERAN PENGGUNA ================= */}
      <section id="aplikasi" className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8 space-y-20">
        
        <div className="bg-gradient-to-r from-[#EAF3FD] via-[#F4F8FE] to-[#EAF3FD] rounded-[36px] p-8 md:p-12 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="w-36 md:w-44 h-48 bg-[#007EDA] rounded-3xl p-4 text-white shadow-xl flex flex-col justify-between transform -rotate-3 border-2 border-white">
            <HearoLogo className="h-6" variant="transparent" />
            <div className="text-center">
              <span className="text-3xl">📱</span>
              <p className="text-[10px] font-bold mt-2">Hearo Mobile App</p>
            </div>
            <div className="bg-white/20 p-1.5 rounded-lg text-[9px] text-center font-semibold">
              v1.0 Ready
            </div>
          </div>

          <div className="flex-1 space-y-3 text-left">
            <span className="bg-[#FFC72C] text-[#102A43] text-[10px] font-black uppercase px-3 py-1 rounded-full">
              SEGERA HADIR
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#102A43]">
              Explore Fitur Menarik di Aplikasi HEARO!
            </h3>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium max-w-xl">
              Aplikasi HEARO segera hadir. Komunikasi lebih mudah dengan fitur video-isyarat interaktif dan koreksi ekspresi langsung di genggamanmu.
            </p>
            <button className="px-5 py-2.5 bg-[#102A43] text-white rounded-full text-xs font-bold flex items-center gap-2 cursor-not-allowed opacity-90">
              <span>⏱ Segera Hadir di Play Store</span>
            </button>
          </div>
        </div>

        <div id="tentang" className="text-center">
          <div className="inline-block bg-[#D6E6F7] text-[#007EDA] text-[11px] font-extrabold uppercase px-4 py-1.5 rounded-full mb-3 tracking-wider">
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
                <div className="w-12 h-12 bg-[#E3F2FD] rounded-2xl flex items-center justify-center text-xl mb-4">👨‍🎓</div>
                <h3 className="text-lg font-extrabold text-[#102A43] mb-2">Siswa</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
                  Belajar materi SPOK interaktif, berlatih kamus isyarat SIBI/BISINDO, menyelesaikan kuis, dan melihat riwayat kemajuan belajar secara mandiri.
                </p>
              </div>
              <ul className="text-xs font-bold text-slate-700 space-y-2 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2 text-emerald-600">✓ Akses Materi & Kuis</li>
                <li className="flex items-center gap-2 text-emerald-600">✓ Pantau Skor XP Harian</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#E3F2FD] rounded-2xl flex items-center justify-center text-xl mb-4">👨‍🏫</div>
                <h3 className="text-lg font-extrabold text-[#102A43] mb-2">Guru</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
                  Mengelola materi pembelajaran, menyusun paket kuis serta memantau capaian skor tiap murid secara terpadu.
                </p>
              </div>
              <ul className="text-xs font-bold text-slate-700 space-y-2 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2 text-emerald-600">✓ Unggah Modul</li>
                <li className="flex items-center gap-2 text-emerald-600">✓ Analitik Kelas Lengkap</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#E3F2FD] rounded-2xl flex items-center justify-center text-xl mb-4">👨‍👩‍👧</div>
                <h3 className="text-lg font-extrabold text-[#102A43] mb-2">Orang Tua</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
                  Memantau capaian belajar anak secara transparan di rumah, serta mendampingi latihan komunikasi isyarat sehari-hari.
                </p>
              </div>
              <ul className="text-xs font-bold text-slate-700 space-y-2 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2 text-emerald-600">✓ Pantau Progres Anak</li>
                <li className="flex items-center gap-2 text-emerald-600">✓ Panduan Pendampingan</li>
              </ul>
            </div>

          </div>
        </div>

      </section>

      {/* ================= 6. CARA KERJA HEARO AI ================= */}
      <section className="py-16 md:py-20 bg-[#F4F7FC]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          
          <div className="inline-block bg-[#D6E6F7] text-[#007EDA] text-[11px] font-extrabold uppercase px-4 py-1.5 rounded-full mb-3 tracking-wider">
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
              <span>👤+ Daftar Sekarang</span>
            </button>
          </div>

        </div>
      </section>

      {/* ================= 7. FOOTER NAVY ================= */}
      <footer className="bg-[#102A43] text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-7 space-y-4 text-left">
            <HearoLogo className="inline-flex" variant="card" />
            <p className="text-xs text-slate-300 leading-relaxed max-w-lg font-normal">
              Platform edukasi cerdas & inklusif berbasis kecerdasan artifisial yang memberdayakan teman tunarungu dalam memahami struktur tata bahasa SPOK serta memperdalam kefasihan bahasa isyarat SIBI dan BISINDO secara interaktif.
            </p>
            
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-slate-400 font-bold mr-2">Ikuti Komunitas:</span>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm transition">💬</a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm transition">▶️</a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm transition">💻</a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm transition">❓</a>
            </div>
          </div>

          <div className="md:col-span-5 space-y-3 text-left md:text-right">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              NAVIGASI PEMBELAJARAN
            </h4>
            <ul className="text-xs text-slate-400 space-y-2 font-medium">
              <li><a href="#hero" className="hover:text-white transition">Beranda Utama</a></li>
              <li><a href="#kamus" className="hover:text-white transition">Kamus SIBI & BISINDO</a></li>
              <li><a href="#fitur" className="hover:text-white transition">Fitur AI Visual Tracker</a></li>
              <li><a href="#aplikasi" className="hover:text-white transition">Aplikasi Web & Mobile</a></li>
              <li><a href="#tentang" className="hover:text-white transition">Tentang Misi Hearo</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 gap-3">
          <div>© 2026 Hearo AI. Hak Cipta Dilindungi Undang-Undang.</div>
          <div className="flex gap-4 font-semibold text-slate-300">
            <span>🏋️ Inklusif & Aksesibel</span>
            <span>•</span>
            <span> Bahasa Isyarat Indonesia</span>
          </div>
        </div>
      </footer>

    </div>
  );
}