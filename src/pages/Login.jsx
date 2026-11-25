import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import HearoLogo from '../components/HearoLogo';
import { loginUser } from '../services/api';

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
    <div className="min-h-screen bg-[#007EDA] flex flex-col justify-between p-4 sm:p-6 md:p-10 font-sans relative overflow-hidden">
      {/* ================= 1. TOP BAR (LOGO TRANSPARAN & BADGE KANAN) ================= */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
        <button
          type="button"
          onClick={onNavigateToLanding}
          title="Kembali ke Beranda"
          className="focus:outline-none hover:opacity-90 transition origin-left scale-100 sm:scale-125 md:scale-150 cursor-pointer"
        >
          <HearoLogo variant="transparent" className="h-12" />
        </button>

        <div className="hidden sm:flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-4 py-1.5 rounded-full text-white text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-[#FCD34D]"></span>
          <span>Platform Edukasi Inklusif BISINDO & SPOK</span>
        </div>
      </div>

      {/* ================= 2. GLASSMORPHISM LOGIN CARD ================= */}
      <div className="w-full max-w-[540px] mx-auto my-6 sm:my-8 bg-white/25 backdrop-blur-md border border-white/40 rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 md:p-10 shadow-2xl z-10">
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
          {errorMessage && (
            <p role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-xs font-semibold text-red-800">
              {errorMessage}
            </p>
          )}


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
                  onClick={() => onNavigateToForgotPassword?.(email)}
                  className="text-xs font-extrabold text-[#102A43] hover:underline cursor-pointer"
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
              disabled={isSubmitting}
              className="w-56 py-3 bg-[#102A43] hover:bg-[#0B1E30] disabled:opacity-60 text-white text-xs font-bold rounded-full shadow-lg flex items-center justify-center gap-2 transition transform active:scale-95"
            >
              <span>{isSubmitting ? 'Memeriksa...' : 'Log In'}</span>
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