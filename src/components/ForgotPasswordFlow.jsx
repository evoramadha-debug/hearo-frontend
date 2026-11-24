import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import HearoLogo from './HearoLogo';

export default function ForgotPasswordFlow({
  initialEmail = '',
  initialRole = 'Murid',
  onBackToLogin,
  onNavigateHome,
}) {
  // Tahapan alur: 'request' | 'email' | 'reset'
  const [step, setStep] = useState('request');

  // State Form Lupa Password (Step 1)
  const [selectedRole, setSelectedRole] = useState(initialRole || 'Murid');
  const [email, setEmail] = useState(initialEmail || '');
  const [emailSentToast, setEmailSentToast] = useState(false);
  const [emailError, setEmailError] = useState('');

  // State Buat Password Baru (Step 3)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [resetError, setResetError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(29 * 60 + 59); // 29:59

  // State Modal Sukses (Step 4)
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Validasi format email
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Ambil nama depan dari email untuk sapaan di email reset
  const displayName = email.includes('@')
    ? email
        .split('@')[0]
        .split('.')[0]
        .replace(/^\w/, (c) => c.toUpperCase())
    : 'Pengguna';

  // Inisial akun terdaftar
  const initials = email.includes('@')
    ? email
        .split('@')[0]
        .split('.')
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('') || 'HA'
    : 'HA';

  // Timer mundur 30 menit saat masuk halaman Buat Password Baru
  useEffect(() => {
    if (step !== 'reset' || showSuccessModal) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, showSuccessModal]);

  const formatTimer = (totalSec) => {
    const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // Evaluasi kriteria kekuatan password
  const passChecks = {
    length: newPassword.length >= 8 && newPassword.length <= 50,
    upperLower: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };

  const passedCount = Object.values(passChecks).filter(Boolean).length;
  const isPasswordMatch =
    newPassword.length > 0 && newPassword === confirmPassword;

  const getStrengthInfo = () => {
    if (newPassword.length === 0) {
      return {
        label: 'Belum diisi',
        color: 'text-slate-400',
        bars: 0,
        barColor: 'bg-slate-200',
      };
    }
    if (passedCount <= 2) {
      return {
        label: 'Lemah',
        color: 'text-rose-600',
        bars: 1,
        barColor: 'bg-rose-500',
      };
    }
    if (passedCount === 3) {
      return {
        label: 'Sedang (Direkomendasikan)',
        color: 'text-[#007EDA]',
        bars: 2,
        barColor: 'bg-[#007EDA]',
      };
    }
    return {
      label: 'Kuat (Sangat Aman)',
      color: 'text-emerald-600',
      bars: 3,
      barColor: 'bg-emerald-500',
    };
  };

  const strength = getStrengthInfo();

  // Handler kirim link reset
  const handleSendLink = (e) => {
    e.preventDefault();
    if (!isValidEmail) {
      setEmailError('Masukkan alamat email terdaftar yang valid terlebih dahulu.');
      return;
    }
    setEmailError('');
    setEmailSentToast(true);
  };

  // Handler simpan password baru
  const handleSaveNewPassword = (e) => {
    e.preventDefault();
    if (!passChecks.length || !passChecks.upperLower || !passChecks.number) {
      setResetError(
        'Password minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, dan angka.'
      );
      return;
    }
    if (!isPasswordMatch) {
      setResetError('Konfirmasi password baru belum cocok.');
      return;
    }
    setResetError('');
    setShowSuccessModal(true);
  };

  // ============================================================================
  // TAMPILAN 2: SIMULASI KOTAK MASUK EMAIL (SESUAI DESAIN GMAIL)
  // ============================================================================
  if (step === 'email') {
    const todayFormatted = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        {/* Bar Simulasi Atas */}
        <div className="bg-[#0F233C] text-white px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5 text-xs md:text-sm">
            <span className="bg-[#FCD34D] text-[#102A43] font-extrabold px-2.5 py-0.5 rounded-full text-[11px]">
              SIMULASI EMAIL
            </span>
            <span className="text-slate-200">
              Pratinjau pesan masuk untuk <strong>{email}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setStep('request')}
            className="text-xs font-bold text-sky-300 hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Icon icon="lucide:arrow-left" className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Lupa Password</span>
          </button>
        </div>

        {/* Konten Email */}
        <div className="flex-1 py-8 px-4 flex items-center justify-center">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Header Biru Email */}
            <div className="bg-gradient-to-r from-[#007EDA] to-[#0068B8] px-6 py-4 flex items-center justify-between text-white">
              <div className="origin-left scale-110">
                <button
                  type="button"
                  onClick={() => onNavigateHome?.()}
                  aria-label="Kembali ke Beranda"
                  className="cursor-pointer"
                >
                  <HearoLogo variant="transparent" className="h-9" />
                </button>
              </div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-sky-100">
                KEAMANAN AKUN
              </span>
            </div>

            {/* Body Email */}
            <div className="p-6 md:p-8 text-center">
              <div className="relative w-14 h-14 rounded-full bg-[#E0F2FE] text-[#007EDA] flex items-center justify-center mx-auto mb-4">
                <Icon icon="lucide:mail-check" className="w-7 h-7" />
                <span className="w-5 h-5 rounded-full bg-[#FCD34D] text-[#102A43] flex items-center justify-center absolute -bottom-0.5 -right-0.5 border-2 border-white">
                  <Icon icon="lucide:shield-check" className="w-3 h-3" />
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-extrabold text-[#102A43]">
                Permintaan Atur Ulang Password
              </h2>
              <p className="text-xs md:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                Halo, <strong className="text-[#102A43]">{displayName}</strong>!
                Kami menerima permintaan untuk mengatur ulang password akun
                Hearo AI kamu. Klik tombol di bawah untuk membuat password baru.
              </p>

              {/* Tabel Ringkasan Akun */}
              <div className="mt-6 bg-[#F0F7FF] border border-sky-100 rounded-xl p-4 text-left space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-bold text-[#102A43]">{email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Peran:</span>
                  <span className="bg-[#0F233C] text-white font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                    {selectedRole}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Diminta pada:</span>
                  <span className="font-semibold text-[#102A43]">
                    {todayFormatted}, 18:36 WIB
                  </span>
                </div>
              </div>

              {/* Tombol Utama Arahkan ke Form Buat Password Baru */}
              <button
                type="button"
                onClick={() => {
                  setSecondsLeft(29 * 60 + 59);
                  setStep('reset');
                }}
                className="mt-6 inline-flex items-center justify-center gap-2 bg-[#0F233C] hover:bg-[#183558] text-white font-bold text-sm px-7 py-3.5 rounded-full shadow-md transition cursor-pointer"
              >
                <span>Atur Ulang Password</span>
                <Icon icon="lucide:arrow-right" className="w-4 h-4" />
              </button>

              {/* Peringatan Masa Berlaku */}
              <div className="mt-6 bg-[#FEF9C3] border border-amber-200 rounded-lg px-4 py-2.5 text-[11px] font-semibold text-amber-900 flex items-center justify-center gap-1.5">
                <Icon icon="lucide:clock" className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Link ini berlaku 30 menit dan hanya bisa dipakai satu kali.
                </span>
              </div>

              {/* Tautan Alternatif */}
              <div className="mt-4 bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-left">
                <p className="text-[11px] text-slate-500 mb-1">
                  Tombol tidak berfungsi? Klik atau salin link ini ke browser:
                </p>
                <button
                  type="button"
                  onClick={() => setStep('reset')}
                  className="text-[11px] text-[#007EDA] hover:underline break-all text-left font-mono cursor-pointer"
                >
                  https://hearo.id/reset-password?token=8f3a8b29c991f8a42b9d0e1c21
                </button>
              </div>

              {/* Catatan Keamanan */}
              <div className="mt-4 bg-slate-50 rounded-lg p-3 text-left flex items-start gap-2.5 text-[11px] text-slate-500">
                <Icon
                  icon="lucide:shield-alert"
                  className="w-4 h-4 text-[#007EDA] shrink-0 mt-0.5"
                />
                <p>
                  <strong className="text-[#102A43]">
                    Bukan kamu yang meminta?
                  </strong>{' '}
                  Abaikan email ini. Password kamu akan tetap aman dan tidak
                  akan berubah.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400 space-y-0.5">
                <p className="font-bold text-slate-500">
                  Hearo AI — Platform Edukasi Inklusif BISINDO & SPOK
                </p>
                <p>Email ini dikirim otomatis, mohon tidak membalas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // TAMPILAN 1 & 3: HALAMAN LUPA PASSWORD & BUAT PASSWORD BARU
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#007EDA] flex flex-col justify-between relative overflow-x-hidden">
      {/* Header Atas (Logo Seragam dengan Halaman Login & Register) */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-5 sm:pt-6 md:pt-8 pb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onNavigateHome?.()}
          title="Kembali ke Beranda"
          aria-label="Kembali ke Beranda"
          className="focus:outline-none hover:opacity-90 transition origin-left scale-100 sm:scale-125 md:scale-150 cursor-pointer pointer-events-auto"
        >
          <div className="pointer-events-none">
            <HearoLogo variant="transparent" className="h-12" />
          </div>
        </button>

        {step === 'request' ? (
          <div className="hidden sm:inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-semibold px-4 py-2 rounded-full">
            <Icon
              icon="lucide:shield-check"
              className="w-4 h-4 text-[#FCD34D]"
            />
            <span>Platform Edukasi Inklusif BISINDO & SPOK</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep('request')}
              className="inline-flex items-center gap-1.5 text-white/90 hover:text-white text-xs font-semibold cursor-pointer"
            >
              <Icon icon="lucide:help-circle" className="w-4 h-4" />
              <span>Bantuan & Panduan</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-white">
              <Icon icon="lucide:user" className="w-4 h-4" />
            </div>
          </div>
        )}
      </header>

      {/* Konten Tengah */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4">
        {/* ---------------- STEP 1: FORM LUPA PASSWORD ---------------- */}
        {step === 'request' && (
          <div className="w-full max-w-md space-y-4">
            {/* Notifikasi Toast "Link Reset Terkirim" */}
            {emailSentToast && (
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-emerald-100 flex items-start gap-3 animate-fadeIn">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Icon icon="lucide:check" className="w-4 h-4 stroke-[3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-extrabold text-[#102A43]">
                      Link Reset Terkirim
                    </h4>
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <Icon icon="lucide:clock" className="w-2.5 h-2.5" />
                      30 Menit
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Link reset sudah dikirim ke email kamu (berlaku 30 menit).
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="mt-2.5 inline-flex items-center gap-1.5 bg-[#007EDA] hover:bg-[#0069B8] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    <Icon icon="lucide:mail-open" className="w-3.5 h-3.5" />
                    <span>Buka Simulasi Email Masuk →</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailSentToast(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  aria-label="Tutup notifikasi"
                >
                  <Icon icon="lucide:x" className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Kartu Utama Lupa Password */}
            <div className="bg-[#CFE5FB] rounded-[28px] p-6 md:p-8 shadow-xl border border-white/40">
              {/* Ikon Amplop + Kunci */}
              <div className="relative w-14 h-14 rounded-full bg-white shadow-xs flex items-center justify-center mx-auto mb-4 text-[#007EDA]">
                <Icon icon="lucide:mail-warning" className="w-7 h-7" />
                <span className="w-5 h-5 rounded-full bg-[#FCD34D] text-[#102A43] flex items-center justify-center absolute -bottom-0.5 -right-0.5 border-2 border-white">
                  <Icon icon="lucide:key-round" className="w-2.5 h-2.5" />
                </span>
              </div>

              <div className="text-center">
                <h1 className="text-2xl font-extrabold text-[#102A43]">
                  Lupa Password?
                </h1>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-xs mx-auto">
                  Masukkan email akunmu, kami akan mengirim link untuk mengatur
                  ulang password.
                </p>
              </div>

              <form onSubmit={handleSendLink} className="mt-6 space-y-5">
                {/* Pilih Peran Akun */}
                <div>
                  <label className="block text-center text-[11px] font-extrabold text-[#102A43] mb-2">
                    Pilih Peran Akun
                  </label>
                  <div className="grid grid-cols-3 gap-1 sm:gap-2 bg-white/70 p-1.5 rounded-2xl">
                    {[
                      { id: 'Guru', icon: 'lucide:user-check' },
                      { id: 'Murid', icon: 'lucide:graduation-cap' },
                      { id: 'Orang Tua', icon: 'lucide:users' },
                    ].map((role) => {
                      const active = selectedRole === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setSelectedRole(role.id)}
                          className={`min-w-0 py-2 px-1 sm:px-2 rounded-xl text-[10px] sm:text-xs font-extrabold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 text-center leading-tight transition cursor-pointer ${
                            active
                              ? 'bg-[#0F233C] text-white shadow-xs'
                              : 'text-[#102A43] hover:bg-white/80'
                          }`}
                        >
                          <Icon icon={role.icon} className="w-3.5 h-3.5" />
                          <span>{role.id}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Input Email Akun Terdaftar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-extrabold text-[#102A43]">
                      Email Akun Terdaftar
                    </label>
                    {isValidEmail && (
                      <span className="text-[11px] font-semibold text-slate-600">
                        Terverifikasi BISINDO
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <Icon
                      icon="lucide:mail"
                      className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      placeholder="nama@hearo.id"
                      className="w-full bg-white border border-white focus:border-[#007EDA] rounded-xl pl-10 pr-10 py-3 text-xs font-semibold text-[#102A43] placeholder-slate-400 focus:outline-none shadow-2xs"
                    />
                    {isValidEmail && (
                      <Icon
                        icon="solar:check-circle-bold"
                        className="w-5 h-5 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2"
                      />
                    )}
                  </div>

                  {emailError && (
                    <p className="text-[11px] font-semibold text-rose-600 mt-1.5">
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Tombol Kirim Link */}
                <button
                  type="submit"
                  className="w-full bg-[#0F233C] hover:bg-[#173356] text-white font-extrabold text-sm py-3.5 rounded-full shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Kirim Link</span>
                  <Icon icon="lucide:send-horizontal" className="w-4 h-4" />
                </button>
              </form>

              {/* Kotak Info Spam */}
              <div className="mt-5 bg-white/55 border border-white/70 rounded-xl p-3.5 flex items-start gap-2.5 text-[11px] text-slate-600 leading-relaxed">
                <Icon
                  icon="lucide:info"
                  className="w-4 h-4 text-[#007EDA] shrink-0 mt-0.5"
                />
                <p>
                  Tidak menerima email? Periksa folder spam atau pastikan email
                  kamu sesuai dengan akun Hearo AI kamu.
                </p>
              </div>

              {/* Kembali ke Log In */}
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() => onBackToLogin?.(email, selectedRole)}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#005A9E] hover:text-[#102A43] transition cursor-pointer"
                >
                  <Icon icon="lucide:arrow-left" className="w-3.5 h-3.5" />
                  <span>Kembali ke Log In</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- STEP 3: FORM BUAT PASSWORD BARU ---------------- */}
        {step === 'reset' && (
          <div className="w-full max-w-lg space-y-4">
            {/* Banner Status Link Terverifikasi */}
            <div className="bg-white rounded-2xl px-4 py-3 shadow-md flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Icon icon="lucide:shield-check" className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#102A43]">
                      Link Terverifikasi
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      • Aktif
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Link aman. Silakan buat password baru untuk akunmu.
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-extrabold px-2.5 py-1 rounded-full shrink-0">
                <Icon icon="lucide:clock" className="w-3 h-3" />
                <span>Sisa {formatTimer(secondsLeft)}</span>
              </div>
            </div>

            {/* Kartu Utama Buat Password Baru */}
            <div className="bg-[#CFE5FB] rounded-[28px] p-6 md:p-8 shadow-xl border border-white/40">
              <div className="relative w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center mx-auto mb-3 text-[#102A43]">
                <Icon icon="lucide:rotate-ccw" className="w-6 h-6" />
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center absolute -bottom-0.5 -right-0.5 border-2 border-white">
                  <Icon icon="lucide:check" className="w-2.5 h-2.5" />
                </span>
              </div>

              <div className="text-center">
                <h1 className="text-xl md:text-2xl font-extrabold text-[#102A43]">
                  Buat Password Baru
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  Password baru harus berbeda dari password lama akun Hearo AI.
                </p>
              </div>

              {/* Kartu Info Akun Terdaftar */}
              <div className="mt-5 bg-white rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#0F233C] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                      AKUN TERDAFTAR
                    </p>
                    <p className="text-xs font-bold text-[#102A43] truncate">
                      {email || 'pengguna@hearo.id'}
                    </p>
                  </div>
                </div>
                <span className="bg-[#0F233C] text-white text-[10px] font-bold px-3 py-1 rounded-full shrink-0">
                  {selectedRole} BISINDO
                </span>
              </div>

              <form onSubmit={handleSaveNewPassword} className="mt-5 space-y-4">
                {/* Input Password Baru */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-extrabold text-[#102A43]">
                      Password Baru
                    </label>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Wajib diisi
                    </span>
                  </div>

                  <div className="relative">
                    <Icon
                      icon="lucide:lock"
                      className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                    />
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (resetError) setResetError('');
                      }}
                      placeholder="Masukkan password baru"
                      className="w-full bg-white border border-white focus:border-[#007EDA] rounded-xl pl-10 pr-10 py-3 text-xs font-bold text-[#102A43] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="text-slate-400 hover:text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      <Icon
                        icon={showNewPass ? 'lucide:eye-off' : 'lucide:eye'}
                        className="w-4 h-4"
                      />
                    </button>
                  </div>

                  {/* Indikator Kekuatan Password */}
                  <div className="mt-3 bg-white/75 rounded-xl p-3 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 font-semibold">
                        Indikator Keamanan:
                      </span>
                      <span className={`font-extrabold ${strength.color}`}>
                        {strength.label}
                      </span>
                    </div>

                    {/* 3 Bar Kekuatan */}
                    <div className="grid grid-cols-3 gap-1.5">
                      {[1, 2, 3].map((idx) => (
                        <div
                          key={idx}
                          className={`h-1.5 rounded-full transition-all ${
                            strength.bars >= idx
                              ? strength.barColor
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Checklist Kriteria */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                      <div
                        className={`flex items-center gap-1.5 ${
                          passChecks.length
                            ? 'text-emerald-700 font-bold'
                            : 'text-slate-500'
                        }`}
                      >
                        <Icon
                          icon="solar:check-circle-bold"
                          className={`w-3.5 h-3.5 ${
                            passChecks.length
                              ? 'text-emerald-500'
                              : 'text-slate-300'
                          }`}
                        />
                        <span>8–50 karakter</span>
                      </div>

                      <div
                        className={`flex items-center gap-1.5 ${
                          passChecks.upperLower
                            ? 'text-emerald-700 font-bold'
                            : 'text-slate-500'
                        }`}
                      >
                        <Icon
                          icon="solar:check-circle-bold"
                          className={`w-3.5 h-3.5 ${
                            passChecks.upperLower
                              ? 'text-emerald-500'
                              : 'text-slate-300'
                          }`}
                        />
                        <span>Huruf besar & kecil</span>
                      </div>

                      <div
                        className={`flex items-center gap-1.5 ${
                          passChecks.number
                            ? 'text-emerald-700 font-bold'
                            : 'text-slate-500'
                        }`}
                      >
                        <Icon
                          icon="solar:check-circle-bold"
                          className={`w-3.5 h-3.5 ${
                            passChecks.number
                              ? 'text-emerald-500'
                              : 'text-slate-300'
                          }`}
                        />
                        <span>Minimal 1 angka</span>
                      </div>

                      <div
                        className={`flex items-center gap-1.5 ${
                          passChecks.special
                            ? 'text-emerald-700 font-bold'
                            : 'text-slate-500'
                        }`}
                      >
                        <Icon
                          icon="solar:check-circle-bold"
                          className={`w-3.5 h-3.5 ${
                            passChecks.special
                              ? 'text-emerald-500'
                              : 'text-slate-300'
                          }`}
                        />
                        <span>Simbol khusus (disarankan)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Konfirmasi Password Baru */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-extrabold text-[#102A43]">
                      Konfirmasi Password Baru
                    </label>
                    {isPasswordMatch && (
                      <span className="text-[11px] font-extrabold text-emerald-700">
                        ✓ Cocok
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <Icon
                      icon="lucide:lock"
                      className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                    />
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (resetError) setResetError('');
                      }}
                      placeholder="Ulangi password baru"
                      className={`w-full bg-white border-2 rounded-xl pl-10 pr-10 py-3 text-xs font-bold text-[#102A43] focus:outline-none ${
                        isPasswordMatch
                          ? 'border-emerald-500'
                          : 'border-white focus:border-[#007EDA]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="text-slate-400 hover:text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      <Icon
                        icon={showConfirmPass ? 'lucide:eye-off' : 'lucide:eye'}
                        className="w-4 h-4"
                      />
                    </button>
                  </div>

                  {isPasswordMatch && (
                    <p className="text-[11px] font-bold text-emerald-700 mt-1.5 flex items-center gap-1">
                      <Icon icon="lucide:check-circle-2" className="w-3.5 h-3.5" />
                      <span>Password cocok dan siap disimpan</span>
                    </p>
                  )}
                </div>

                {resetError && (
                  <p className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                    {resetError}
                  </p>
                )}

                {/* Tombol Simpan Password Baru */}
                <button
                  type="submit"
                  className="w-full bg-[#0F233C] hover:bg-[#173356] text-white font-extrabold text-sm py-3.5 rounded-full shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Icon icon="lucide:save" className="w-4 h-4" />
                  <span>Simpan Password Baru</span>
                </button>
              </form>

              {/* Alert Keamanan Tautan Token */}
              <div className="mt-4 bg-[#FEF9C3] border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-amber-900 leading-relaxed">
                <Icon
                  icon="lucide:clock"
                  className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"
                />
                <p>
                  <strong>Keamanan Tautan Token:</strong> Link hanya bisa
                  dipakai satu kali dan berlaku 30 menit demi melindungi privasi
                  akun pembelajaran isyarat Anda.
                </p>
              </div>

              {/* Kembali ke Log In */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => onBackToLogin?.(email, selectedRole)}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#005A9E] hover:text-[#102A43] transition cursor-pointer"
                >
                  <Icon icon="lucide:arrow-left" className="w-3.5 h-3.5" />
                  <span>Kembali ke Log In</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Bawah */}
      <footer className="py-4 text-center text-[11px] text-sky-100/80">
        Hearo AI © 2026 • Media Belajar Aksesibel Inklusif • Didukung Pengenalan
        BISINDO & SPOK
      </footer>

      {/* ============================================================================
          STEP 4: MODAL SUKSES ("PASSWORD TERSIMPAN")
         ============================================================================ */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-[#0A2540]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-7 text-center shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              aria-label="Tutup modal"
            >
              <Icon icon="lucide:x" className="w-5 h-5" />
            </button>

            {/* Ikon Centang Hijau + Aksen Kuning */}
            <div className="relative w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-5 shadow-md">
              <Icon icon="lucide:check" className="w-8 h-8 stroke-[3]" />
              <span className="absolute -top-2 -left-2 text-[#FCD34D] text-sm font-black">
                ✦
              </span>
              <span className="absolute -bottom-1 -right-2 text-[#FCD34D] text-xs font-black">
                ★
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-[#102A43]">
              Password Tersimpan
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Password baru kamu berhasil disimpan. Silakan masuk kembali
              menggunakan password baru.
            </p>

            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                onBackToLogin?.(email, selectedRole);
              }}
              className="mt-6 w-full bg-[#0F233C] hover:bg-[#173356] text-white font-extrabold text-sm py-3.5 rounded-full shadow-md inline-flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Masuk Sekarang</span>
              <Icon icon="lucide:arrow-right" className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="mt-3 text-xs font-bold text-slate-500 hover:text-[#102A43] cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}