import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import HearoLogo from '../components/HearoLogo';
import { loginUser } from '../services/api';
import loginIllustration from '../assets/login-illustration.png';

export default function Login({
  onNavigateToRegister,
  onNavigateToLanding,
  onNavigateToForgotPassword,
  onLoginSuccess,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const authData = await loginUser(email.trim(), password);
      onLoginSuccess?.(authData);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#EEF4FF] flex items-center justify-center p-4 sm:p-6 lg:px-10 lg:py-6 font-sans">
      {/* MAIN SPLIT CARD (FIT TO SCREEN + POPUP ELEVATION) */}
      <div className="w-full max-w-[1220px] lg:h-full lg:max-h-[680px] bg-white rounded-[32px] border border-white/80 shadow-[0_28px_70px_-12px_rgba(16,42,67,0.24),0_12px_32px_-8px_rgba(0,114,214,0.16)] overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* ================= KOLOM KIRI: ILUSTRASI & BRANDING ================= */}
        <div className="relative bg-[#0072D6] px-8 py-7 sm:px-12 lg:py-8 flex flex-col justify-between text-white overflow-hidden">
          {/* Dekorasi Lingkaran Halus Background */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#1E86E3]" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-[#1E86E3]" />

          {/* Logo Hearo Kiri Atas */}
          <div className="relative z-10 shrink-0">
            <button
              type="button"
              onClick={onNavigateToLanding}
              title="Kembali ke Beranda"
              className="focus:outline-none hover:opacity-90 transition cursor-pointer inline-flex items-center"
            >
              <HearoLogo variant="transparent" />
            </button>
          </div>

          {/* Ilustrasi Guru, Siswa & Orang Tua (Otomatis menyesuaikan sisa tinggi layar) */}
          <div className="relative z-10 my-4 lg:my-2 flex-1 min-h-0 flex items-center justify-center">
            <img
              src={loginIllustration}
              alt="Ilustrasi Siswa, Guru, dan Orang Tua Belajar Isyarat Hearo"
              className="max-h-[250px] sm:max-h-[290px] xl:max-h-[330px] w-auto max-w-full object-contain select-none"
            />
          </div>

          {/* Teks Ajakan Bawah */}
          <div className="relative z-10 shrink-0 text-center space-y-1.5 max-w-[420px] mx-auto">
            <h2 className="text-xl sm:text-[24px] font-bold leading-snug tracking-tight text-white">
              Halo, Teman! Yuk Belajar Isyarat Bareng Hearo
            </h2>
            <p className="text-xs sm:text-[13px] text-white/90 font-normal leading-relaxed">
              Siswa belajar, guru membimbing, orang tua memantau perkembangan.
            </p>
          </div>
        </div>

        {/* ================= KOLOM KANAN: FORM LOGIN ================= */}
        <div className="bg-white px-8 py-8 sm:px-14 md:px-20 lg:py-8 flex flex-col justify-center">
          <div className="w-full max-w-[420px] mx-auto">
            {/* Heading & Subheading */}
            <div className="text-center space-y-2 mb-6">
              <h1 className="text-2xl sm:text-[30px] font-extrabold text-[#102A43] leading-tight tracking-tight">
                Selamat Datang di
                <br />
                Hearo AI
              </h1>
              <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed">
                Masuk untuk belajar isyarat SIBI, kalimat SPOK, dan kuis seru.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-700"
                >
                  {errorMessage}
                </div>
              )}

              {/* Input Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block text-[13px] font-bold text-[#102A43]"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="lucide:mail" className="w-4 h-4 text-[#007EDA]" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-11 pr-4 py-3 bg-[#EEF4FF] border border-[#DCE7F9] rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#007EDA] focus:ring-2 focus:ring-[#007EDA]/20 transition"
                  />
                </div>
              </div>

              {/* Input Kata Sandi */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-[13px] font-bold text-[#102A43]"
                  >
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => onNavigateToForgotPassword?.(email)}
                    className="text-[13px] font-semibold text-[#007EDA] hover:underline cursor-pointer"
                  >
                    Lupa Kata Sandi?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="lucide:lock" className="w-4 h-4 text-[#007EDA]" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full pl-11 pr-11 py-3 bg-[#EEF4FF] border border-[#DCE7F9] rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#007EDA] focus:ring-2 focus:ring-[#007EDA]/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#102A43] cursor-pointer"
                  >
                    <Icon
                      icon={showPassword ? 'lucide:eye-off' : 'lucide:eye'}
                      className="w-4 h-4"
                    />
                  </button>
                </div>
              </div>

              {/* Tombol Log In */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#FCD34D] hover:bg-[#FBBF24] disabled:opacity-60 text-[#102A43] text-sm font-bold rounded-full shadow-sm flex items-center justify-center gap-2 transition transform active:scale-[0.99] cursor-pointer"
                >
                  <span>{isSubmitting ? 'Memeriksa...' : 'Log In'}</span>
                  <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Footer Link Daftar */}
            <div className="mt-5 text-center text-[13px] text-slate-500 font-medium">
              <span>Belum punya akun? </span>
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="font-bold text-[#007EDA] underline hover:text-[#0066B2] cursor-pointer"
              >
                Daftar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}