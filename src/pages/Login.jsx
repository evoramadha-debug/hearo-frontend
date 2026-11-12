import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import HearoLogo from '../components/HearoLogo';

export default function Login({
  onNavigateToRegister,
  onNavigateToLanding,
  onLoginSuccess,
}) {
  const [selectedRole, setSelectedRole] = useState('GURU');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    {
      id: 'GURU',
      label: 'GURU',
      bgBox: 'bg-[#F5EFE6]',
      icon: 'noto:woman-teacher-light-skin-tone',
    },
    {
      id: 'MURID',
      label: 'MURID',
      bgBox: 'bg-[#EEF4FF]',
      icon: 'noto:student-light-skin-tone',
    },
    {
      id: 'ORANG TUA',
      label: 'ORANG TUA',
      bgBox: 'bg-[#F3E8FF]',
      icon: 'noto:family-man-woman-girl',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLoginSuccess) {
      onLoginSuccess({ email, role: selectedRole });
    }
  };

  return (
    <div className="min-h-screen bg-[#007EDA] flex flex-col justify-between p-6 md:p-10 font-sans relative overflow-hidden">
      {/* ================= 1. TOP BAR (LOGO TRANSPARAN & BADGE KANAN) ================= */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
        <button
          type="button"
          onClick={onNavigateToLanding}
          title="Kembali ke Beranda"
          className="focus:outline-none hover:opacity-90 transition origin-left scale-125 md:scale-150 cursor-pointer"
        >
          <HearoLogo variant="transparent" className="h-12" />
        </button>

        <div className="hidden sm:flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-4 py-1.5 rounded-full text-white text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-[#FCD34D]"></span>
          <span>Platform Edukasi Inklusif BISINDO & SPOK</span>
        </div>
      </div>

      {/* ================= 2. GLASSMORPHISM LOGIN CARD ================= */}
      <div className="w-full max-w-[540px] mx-auto my-8 bg-white/25 backdrop-blur-md border border-white/40 rounded-[32px] p-7 md:p-10 shadow-2xl z-10">
        {/* Judul & Subjudul */}
        <div className="text-center space-y-1.5 mb-7">
          <h1 className="text-2xl md:text-[28px] font-extrabold text-[#102A43] tracking-tight">
            Selamat Datang di Hearo AI
          </h1>
          <p className="text-xs md:text-sm text-white/95 font-medium">
            Masuk untuk mengakses materi visual & latihan bahasa isyarat
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Header Pilihan Role + Badge Role Terpilih */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-[#102A43] text-[11px] font-extrabold uppercase tracking-wider">
                <Icon icon="lucide:user-check" className="w-3.5 h-3.5" />
                <span>PILIH PERAN PENGGUNA</span>
              </div>

              {/* Badge Dinamis Role Terpilih */}
              <div className="bg-white/20 border border-white/30 px-3 py-1 rounded-full text-[10px] font-medium text-white">
                Role Terpilih:{' '}
                <span className="font-extrabold uppercase">{selectedRole}</span>
              </div>
            </div>

            {/* Grid 3 Kartu Role */}
            <div className="grid grid-cols-3 gap-3.5">
              {roles.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    type="button"
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`relative bg-white rounded-2xl p-3 flex flex-col items-center justify-between transition-all duration-200 ${
                      isSelected
                        ? 'ring-[3px] ring-[#007EDA] shadow-lg scale-[1.02]'
                        : 'border border-transparent opacity-95 hover:opacity-100 hover:shadow-md'
                    }`}
                  >
                    {/* Ikon Centang Biru di Pojok Kanan Atas saat Terpilih */}
                    {isSelected && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#007EDA] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white">
                        <Icon
                          icon="lucide:check"
                          className="w-3.5 h-3.5 stroke-[3]"
                        />
                      </span>
                    )}

                    {/* Kotak Ilustrasi Karakter */}
                    <div
                      className={`w-full aspect-square ${role.bgBox} rounded-xl flex items-center justify-center p-2 mb-2.5`}
                    >
                      <Icon
                        icon={role.icon}
                        className="w-12 h-12 md:w-14 md:h-14"
                      />
                    </div>

                    {/* Label Role */}
                    <span
                      className={`text-[11px] font-extrabold tracking-wide uppercase ${
                        isSelected ? 'text-[#007EDA]' : 'text-[#102A43]'
                      }`}
                    >
                      {role.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon icon="lucide:user" className="w-4 h-4 text-[#007EDA]" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@hearo.id"
              className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#102A43]/30 shadow-sm"
            />
          </div>

          {/* Label Lupa Password & Input Password */}
          <div className="space-y-1.5">
            <div className="flex justify-start">
              <button
                type="button"
                className="text-[11px] font-bold text-[#102A43] hover:underline"
              >
                Lupa Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon icon="lucide:lock" className="w-4 h-4 text-[#007EDA]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="w-full pl-11 pr-11 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#102A43]/30 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-[#102A43]"
              >
                <Icon
                  icon={showPassword ? 'lucide:eye-off' : 'lucide:eye'}
                  className="w-4 h-4"
                />
              </button>
            </div>
          </div>

          {/* Tombol Log In */}
          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              className="w-56 py-3 bg-[#102A43] hover:bg-[#0B1E30] text-white text-xs font-bold rounded-full shadow-lg flex items-center justify-center gap-2 transition transform active:scale-95"
            >
              <span>Log In</span>
              <Icon icon="lucide:arrow-right" className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Link Daftar di Bagian Bawah Card */}
        <div className="mt-8 pt-2 text-center text-xs text-[#102A43] font-medium flex items-center justify-center gap-1">
          <span>Belum punya akun?</span>
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="font-extrabold text-[#007EDA] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Daftar</span>
            <Icon
              icon="lucide:external-link"
              className="w-3.5 h-3.5 text-[#007EDA]"
            />
          </button>
        </div>
      </div>

      {/* ================= 3. FOOTER COPYRIGHT ================= */}
      <div className="text-center text-[11px] text-white/85 font-medium z-10">
        Hearo AI © 2025 • Media Belajar Aksesibel Inklusif • Didukung Pengenalan
        BISINDO & SPOK
      </div>
    </div>
  );
}