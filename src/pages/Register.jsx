import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import HearoLogo from '../components/HearoLogo';

// Daftar email simulasi yang dianggap sudah terdaftar di sistem
const DEFAULT_REGISTERED_EMAILS = [
  'dimas.prasetyo@hearo.id',
  'guru@hearo.id',
  'siti.rahmawati@hearo.id',
  'orangtua@hearo.id',
];

const STORAGE_KEY = 'hearo_registered_emails';

export default function Register({
  onNavigateToLogin,
  onNavigateToLanding,
  onRegisterSuccess,
}) {
  const [selectedRole, setSelectedRole] = useState('GURU');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  // State pop-up hasil pendaftaran: null | { type: 'success' | 'duplicate', email: string, role: string, studentName?: string }
  const [modalStatus, setModalStatus] = useState(null);

  const tabs = [
    { id: 'GURU', label: 'GURU', icon: 'lucide:graduation-cap' },
    { id: 'MURID', label: 'MURID', icon: 'lucide:smile' },
    { id: 'ORANG TUA', label: 'ORANG TUA', icon: 'lucide:users' },
  ];

  const roleConfig = {
    GURU: {
      title: 'Daftar Akun Guru',
      subtitle:
        'Bergabung untuk mengajar bahasa isyarat & memantau perkembangan siswa',
      emailLabel: 'Email Guru',
      emailPlaceholder: 'guru@sekolah.sch.id atau nama@hearo.id',
      roleDisplay: 'Guru',
    },
    MURID: {
      title: 'Daftar Akun Murid',
      subtitle:
        'Mulai belajar bahasa isyarat BISINDO dan struktur kalimat SPOK secara interaktif',
      emailLabel: 'Email Murid',
      emailPlaceholder: 'murid@sekolah.sch.id atau nama@email.com',
      roleDisplay: 'Murid',
    },
    'ORANG TUA': {
      title: 'Daftar Akun Orang Tua',
      subtitle:
        'Dampingi perkembangan belajar bahasa isyarat & struktur kalimat anak secara berkala',
      emailLabel: 'Email Orang Tua / Wali',
      emailPlaceholder: 'orangtua@email.com atau nama@email.com',
      roleDisplay: 'Orang Tua',
    },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Mengambil daftar seluruh email yang sudah terdaftar (bawaan + localStorage)
  const getRegisteredEmails = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.from(
        new Set([
          ...DEFAULT_REGISTERED_EMAILS,
          ...saved.map((item) => item.toLowerCase()),
        ])
      );
    } catch {
      return DEFAULT_REGISTERED_EMAILS;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return;
    if (formData.password !== formData.passwordConfirmation) return;

    const normalizedEmail = formData.email.trim().toLowerCase();
    const existingEmails = getRegisteredEmails();

    // Cek apakah email sudah pernah digunakan
    if (existingEmails.includes(normalizedEmail)) {
      setModalStatus({
        type: 'duplicate',
        email: normalizedEmail,
        role: roleConfig[selectedRole].roleDisplay,
      });
      return;
    }

    // Simpan email baru ke localStorage agar terdeteksi jika didaftarkan ulang
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...saved, normalizedEmail])
      );
    } catch {
      // Abaikan jika storage penuh/diblokir
    }

    setModalStatus({
      type: 'success',
      email: normalizedEmail,
      role: roleConfig[selectedRole].roleDisplay,
      studentName:
        selectedRole === 'ORANG TUA' ? formData.studentName.trim() : '',
    });
  };

  const handleProceedAfterSuccess = () => {
    const registeredPayload = {
      email: modalStatus?.email || formData.email.trim(),
      role: selectedRole,
      ...(selectedRole === 'ORANG TUA' && {
        studentName: formData.studentName.trim(),
      }),
    };
    setModalStatus(null);

    if (onRegisterSuccess) {
      onRegisterSuccess(registeredPayload);
    } else if (onNavigateToLogin) {
      onNavigateToLogin();
    }
  };

  const passwordsDoNotMatch =
    formData.passwordConfirmation !== '' &&
    formData.password !== formData.passwordConfirmation;

  return (
    <div className="min-h-screen bg-[#007EDA] flex flex-col justify-between p-6 md:p-10 font-sans relative overflow-hidden">
      {/* ================= 1. TOP BAR ================= */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center relative z-20">
        <button
          type="button"
          onClick={() => {
            if (onNavigateToLanding) onNavigateToLanding();
          }}
          title="Kembali ke Beranda"
          className="focus:outline-none hover:opacity-90 transition origin-left scale-125 md:scale-150 cursor-pointer pointer-events-auto"
        >
          <div className="pointer-events-none">
            <HearoLogo variant="transparent" className="h-12" />
          </div>
        </button>

        <div className="hidden sm:flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-4 py-1.5 rounded-full text-white text-xs font-medium">
          <Icon icon="lucide:sparkles" className="w-3.5 h-3.5 text-[#FCD34D]" />
          <span>Platform Edukasi Inklusif BISINDO & SPOK</span>
        </div>
      </div>

      {/* ================= 2. FORM REGISTER CONTAINER ================= */}
      <div className="w-full max-w-[500px] mx-auto my-6 z-10">
        {/* Pill Selector Role */}
        <div className="bg-white/20 backdrop-blur-md border border-white/30 p-1.5 rounded-full grid grid-cols-3 gap-2 shadow-sm mb-7">
          {tabs.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`py-2.5 px-3 rounded-full text-[11px] font-extrabold tracking-wide uppercase flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#102A43] text-white shadow-md'
                    : 'bg-white text-[#102A43] hover:bg-[#EEF4FF]'
                }`}
              >
                <Icon
                  icon={role.icon}
                  className={`w-4 h-4 shrink-0 ${
                    isSelected ? 'text-[#FCD34D]' : 'text-[#102A43]'
                  }`}
                />
                <span className="truncate">{role.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FCD34D] shrink-0"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Judul & Subjudul Dinamis */}
        <div className="text-center space-y-1.5 mb-7">
          <h1 className="text-2xl md:text-[30px] font-extrabold text-white tracking-tight">
            {roleConfig[selectedRole].title}
          </h1>
          <p className="text-xs md:text-sm text-white/90 font-normal max-w-md mx-auto leading-relaxed">
            {roleConfig[selectedRole].subtitle}
          </p>
        </div>

        {/* ================= FORM RINGKAS ================= */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field Khusus Orang Tua: Nama Anak */}
          {selectedRole === 'ORANG TUA' && (
            <div>
              <div className="flex justify-between items-center mb-1.5 px-0.5">
                <label className="text-xs font-bold text-white">
                  Nama Anak
                </label>
                <span className="text-[11px] text-white/80 font-medium">
                  Wajib diisi
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Icon
                    icon="lucide:contact"
                    className="w-4 h-4 text-slate-400"
                  />
                </div>
                <input
                  type="text"
                  name="studentName"
                  required
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="cth. Dimas Prasetyo"
                  className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm"
                />
              </div>
            </div>
          )}

          {/* 1. Email */}
          <div>
            <div className="flex justify-between items-center mb-1.5 px-0.5">
              <label className="text-xs font-bold text-white">
                {roleConfig[selectedRole].emailLabel}
              </label>
              <span className="text-[11px] text-white/80 font-medium">
                Wajib diisi
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon icon="lucide:mail" className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={roleConfig[selectedRole].emailPlaceholder}
                className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm"
              />
            </div>
          </div>

          {/* 2. Kata Sandi */}
          <div>
            <label className="block text-xs font-bold text-white mb-1.5 px-0.5">
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon icon="lucide:lock" className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                minLength={8}
                maxLength={50}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-11 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-[#102A43] cursor-pointer"
                aria-label="Tampilkan atau sembunyikan kata sandi"
              >
                <Icon
                  icon={showPassword ? 'lucide:eye-off' : 'lucide:eye'}
                  className="w-4 h-4"
                />
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-white/85">
              <Icon icon="lucide:info" className="w-3.5 h-3.5 shrink-0" />
              <span>Minimal 8, maksimal 50 karakter</span>
            </div>
          </div>

          {/* 3. Konfirmasi Kata Sandi */}
          <div>
            <label className="block text-xs font-bold text-white mb-1.5 px-0.5">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon icon="lucide:lock" className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="passwordConfirmation"
                required
                minLength={8}
                maxLength={50}
                value={formData.passwordConfirmation}
                onChange={handleChange}
                placeholder="Ulangi kata sandi"
                aria-invalid={passwordsDoNotMatch}
                aria-describedby={
                  passwordsDoNotMatch ? 'password-mismatch' : undefined
                }
                className={`w-full pl-11 pr-11 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm ${
                  passwordsDoNotMatch ? 'ring-2 ring-red-400' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-[#102A43] cursor-pointer"
                aria-label="Tampilkan atau sembunyikan konfirmasi kata sandi"
              >
                <Icon
                  icon={showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'}
                  className="w-4 h-4"
                />
              </button>
            </div>
            {passwordsDoNotMatch && (
              <p
                id="password-mismatch"
                className="mt-1.5 text-[11px] font-medium text-red-100"
                role="alert"
              >
                Kata sandi tidak sama.
              </p>
            )}
          </div>

          {/* Catatan Pengisian Biodata di Pengaturan Profil */}
          <div className="bg-white/15 border border-white/25 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-[11px] text-white/95">
            <Icon
              icon="lucide:user-cog"
              className="w-4 h-4 text-[#FCD34D] shrink-0"
            />
            <span>
              Pengisian data diri lengkap (NIP/NISN, nama, kelas & kontak)
              dilakukan di menu <strong>Pengaturan Profil</strong> setelah
              masuk.
            </span>
          </div>

          {/* Checkbox Syarat & Ketentuan */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              id="terms"
              type="checkbox"
              required
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 rounded border-white text-[#102A43] focus:ring-0 cursor-pointer accent-[#102A43]"
            />
            <label
              htmlFor="terms"
              className="text-xs text-white/90 select-none cursor-pointer"
            >
              Saya menyetujui{' '}
              <a
                href="#terms"
                className="font-bold underline hover:text-[#FCD34D]"
              >
                Ketentuan Layanan
              </a>{' '}
              &{' '}
              <a
                href="#privacy"
                className="font-bold underline hover:text-[#FCD34D]"
              >
                Kebijakan Privasi
              </a>{' '}
              Hearo AI
            </label>
          </div>

          {/* Tombol Daftar Sekarang */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#102A43] hover:bg-[#0B1E30] text-white text-sm font-bold rounded-full shadow-lg flex items-center justify-center gap-2 transition transform active:scale-[0.99] cursor-pointer"
            >
              <span>Daftar Sekarang</span>
              <Icon icon="lucide:arrow-right" className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Link Sudah Punya Akun? Log In */}
        <div className="mt-6 text-center text-xs text-white/90 font-medium">
          Sudah punya akun?{' '}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-extrabold text-white underline hover:text-[#FCD34D] cursor-pointer"
          >
            Log In
          </button>
        </div>
      </div>

      {/* ================= 3. FOOTER COPYRIGHT & STANDAR AKSESIBILITAS ================= */}
      <div className="w-full max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-white/85 font-medium gap-3 z-10">
        <div>
          Hearo AI © 2026 • Media Belajar Aksesibel Inklusif • Didukung
          Pengenalan BISINDO & SPOK
        </div>
        <div className="flex items-center gap-3">

          <span className="inline-flex items-center gap-1">
            <Icon icon="lucide:languages" className="w-3.5 h-3.5" />
            <span>Bahasa Isyarat Indonesia</span>
          </span>
        </div>
      </div>

      {/* ================= 4. POP-UP STATUS PENDAFTARAN ================= */}
      {modalStatus && (
        <div className="fixed inset-0 z-50 bg-[#0A2540]/55 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-7 text-center shadow-2xl relative animate-fadeIn">
            <button
              type="button"
              onClick={() => setModalStatus(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              aria-label="Tutup pop-up"
            >
              <Icon icon="lucide:x" className="w-5 h-5" />
            </button>

            {modalStatus.type === 'success' ? (
              <>
                {/* Ikon Sukses */}
                <div className="relative w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-5 shadow-md">
                  <Icon icon="lucide:check" className="w-8 h-8 stroke-[3]" />
                  <span className="absolute -top-2 -left-2 text-[#FCD34D] text-sm font-black">
                    ✦
                  </span>
                  <span className="absolute -bottom-1 -right-2 text-[#FCD34D] text-xs font-black">
                    ★
                  </span>
                </div>

                <span className="inline-block bg-emerald-50 text-emerald-700 text-[11px] font-extrabold px-3 py-1 rounded-full mb-2">
                  Akun {modalStatus.role} Terdaftar
                </span>

                <h2 className="text-2xl font-extrabold text-[#102A43]">
                  Akun Berhasil Terdaftar
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Email{' '}
                  <strong className="text-[#102A43]">
                    {modalStatus.email}
                  </strong>
                  {modalStatus.studentName ? (
                    <>
                      {' '}
                      untuk pendampingan anak{' '}
                      <strong className="text-[#102A43]">
                        {modalStatus.studentName}
                      </strong>
                    </>
                  ) : null}{' '}
                  berhasil didaftarkan. Silakan masuk dan lengkapi data profilmu
                  di menu <strong>Pengaturan Profil</strong>.
                </p>

                <button
                  type="button"
                  onClick={handleProceedAfterSuccess}
                  className="mt-6 w-full bg-[#102A43] hover:bg-[#0B1E30] text-white font-extrabold text-sm py-3.5 rounded-full shadow-md inline-flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Masuk Sekarang</span>
                  <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setModalStatus(null)}
                  className="mt-3 text-xs font-bold text-slate-500 hover:text-[#102A43] cursor-pointer"
                >
                  Tutup
                </button>
              </>
            ) : (
              <>
                {/* Ikon Gagal / Email Duplikat */}
                <div className="relative w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto mb-5 shadow-md">
                  <Icon
                    icon="lucide:alert-circle"
                    className="w-8 h-8 stroke-[2.5]"
                  />
                </div>

                <span className="inline-block bg-rose-50 text-rose-700 text-[11px] font-extrabold px-3 py-1 rounded-full mb-2">
                  Email Sudah Digunakan
                </span>

                <h2 className="text-2xl font-extrabold text-[#102A43]">
                  Akun Gagal Terdaftar
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Email{' '}
                  <strong className="text-[#102A43]">
                    {modalStatus.email}
                  </strong>{' '}
                  sudah pernah terdaftar sebelumnya. Silakan gunakan alamat
                  email lain atau langsung masuk menggunakan akun tersebut.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setModalStatus(null);
                    if (onNavigateToLogin) onNavigateToLogin();
                  }}
                  className="mt-6 w-full bg-[#102A43] hover:bg-[#0B1E30] text-white font-extrabold text-sm py-3.5 rounded-full shadow-md inline-flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Log In dengan Akun Ini</span>
                  <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setModalStatus(null);
                    setFormData((prev) => ({ ...prev, email: '' }));
                  }}
                  className="mt-3 text-xs font-bold text-slate-500 hover:text-[#102A43] cursor-pointer"
                >
                  Gunakan Email Lain
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}