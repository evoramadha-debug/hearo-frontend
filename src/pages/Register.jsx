import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import HearoLogo from '../components/HearoLogo';
import { registerUser } from '../services/api';
import registerSiswaIllustration from '../assets/register-siswa.png';
import registerGuruIllustration from '../assets/register-guru.png';
import registerOrangTuaIllustration from '../assets/register-orangtua.png';

const ROLE_CONFIG = {
  siswa: {
    id: 'siswa',
    label: 'Siswa',
    icon: 'lucide:user-check',
    illustration: registerSiswaIllustration,
    illustrationAlt: 'Ilustrasi Siswa Belajar Bahasa Isyarat Hearo',
    leftTitle: 'Daftar Akun Siswa',
    leftSubtitle:
      'Belajar SIBI dan SPOK dengan seru, lalu lihat sendiri capaian belajarmu.',
    formTitle: 'Daftar Akun Siswa',
    formSubtitle: 'Isi data dirimu untuk mulai belajar bahasa isyarat.',
    nameLabel: 'Nama Lengkap',
    namePlaceholder: 'Nama lengkapmu',
    emailPlaceholder: 'nama@email.com',
  },
  guru: {
    id: 'guru',
    label: 'Guru',
    icon: 'lucide:presentation',
    illustration: registerGuruIllustration,
    illustrationAlt: 'Ilustrasi Guru Mendampingi Siswa Hearo',
    leftTitle: 'Daftar Akun Guru',
    leftSubtitle:
      'Buka kamus SIBI kapan saja, lalu pantau capaian dan riwayat belajar siswa.',
    formTitle: 'Daftar Akun Guru',
    formSubtitle: 'Bergabung untuk mendampingi siswa belajar bahasa isyarat.',
    nameLabel: 'Nama Lengkap (dengan gelar)',
    namePlaceholder: 'Contoh: Siti Aminah, S.Pd.',
    emailPlaceholder: 'nama@sekolah.sch.id',
  },
  orang_tua: {
    id: 'orang_tua',
    label: 'Orang Tua',
    icon: 'lucide:users',
    illustration: registerOrangTuaIllustration,
    illustrationAlt: 'Ilustrasi Orang Tua Memantau Anak Hearo',
    leftTitle: 'Daftar Akun Orang Tua',
    leftSubtitle: 'Ikuti capaian belajar bahasa isyarat anak dari rumah.',
    formTitle: 'Daftar Akun Orang Tua',
    formSubtitle:
      'NISN dan nama anak dipakai untuk menghubungkan akun Anda dengan akun anak.',
    nameLabel: 'Nama Lengkap',
    namePlaceholder: 'Nama lengkap Anda',
    emailPlaceholder: 'nama@email.com',
  },
};

export default function Register({
  onNavigateToLogin,
  onNavigateToLanding,
  onRegisterSuccess,
}) {
  const [role, setRole] = useState('siswa');

  // Form states
  const [name, setName] = useState('');
  const [nisn, setNisn] = useState('');
  const [nip, setNip] = useState('');
  const [childNisn, setChildNisn] = useState('');
  const [childName, setChildName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentRole = ROLE_CONFIG[role];

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 8) {
      setErrorMessage('Kata sandi minimal harus 8 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (!agreed) {
      setErrorMessage(
        'Silakan centang persetujuan Ketentuan Layanan dan Kebijakan Privasi.'
      );
      return;
    }

    setIsSubmitting(true);

    const apiRoleMap = {
      siswa: 'MURID',
      guru: 'GURU',
      orang_tua: 'ORANG TUA',
    };

    try {
      const apiRole = apiRoleMap[role];
      const payload = {
        nama: name.trim(),
        email: email.trim(),
        no_telepon: whatsapp.trim(),
        password,
        password_confirmation: confirmPassword,
        ...(role === 'siswa' && { nisn: nisn.trim() }),
        ...(role === 'guru' && { nip: nip.trim() }),
        ...(role === 'orang_tua' && {
          nisn_anak: childNisn.trim(),
          nama_anak: childName.trim(),
        }),
      };

      const result = await registerUser(apiRole, payload);
      onRegisterSuccess?.(result);
    } catch (error) {
      setErrorMessage(error.message || 'Gagal mendaftarkan akun. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseClass =
    'w-full pl-10 pr-3.5 py-2.5 bg-[#F8FAFC] border border-[#DCE7F9] rounded-xl text-xs sm:text-[13px] text-[#102A43] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#007EDA] focus:ring-2 focus:ring-[#007EDA]/20 transition';

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#EEF4FF] flex items-center justify-center p-4 sm:p-6 lg:px-10 lg:py-5 font-sans">
      {/* MAIN SPLIT CARD (FIT TO SCREEN + POPUP ELEVATION) */}
      <div className="w-full max-w-[1220px] lg:h-full lg:max-h-[700px] bg-white rounded-[32px] border border-white/80 shadow-[0_28px_70px_-12px_rgba(16,42,67,0.24),0_12px_32px_-8px_rgba(0,126,218,0.16)] overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* ================= KOLOM KIRI: ILUSTRASI & BRANDING DINAMIS ================= */}
        <div className="relative bg-[#007EDA] px-8 py-7 sm:px-12 lg:py-8 flex flex-col justify-between text-white overflow-hidden">
          {/* Dekorasi Bubble Lingkaran */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#99CEF4]" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-[#99CEF4]" />

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

          {/* Ilustrasi Karakter Dinamis */}
          <div className="relative z-10 my-4 lg:my-2 flex-1 min-h-0 flex items-center justify-center">
            <img
              src={currentRole.illustration}
              alt={currentRole.illustrationAlt}
              className="max-h-[250px] sm:max-h-[300px] xl:max-h-[340px] w-auto max-w-full object-contain select-none transition-all duration-300"
            />
          </div>

          {/* Teks Ajakan Bawah Dinamis */}
          <div className="relative z-10 shrink-0 text-center space-y-1.5 max-w-[430px] mx-auto">
            <h2 className="text-xl sm:text-[26px] font-bold leading-snug tracking-tight text-white">
              {currentRole.leftTitle}
            </h2>
            <p className="text-xs sm:text-[13px] text-white/90 font-normal leading-relaxed">
              {currentRole.leftSubtitle}
            </p>
          </div>
        </div>

        {/* ================= KOLOM KANAN: TAB ROLE & FORM REGISTER ================= */}
        <div className="bg-white px-6 py-7 sm:px-12 md:px-14 lg:py-6 flex flex-col justify-center overflow-y-auto lg:overflow-visible">
          <div className="w-full max-w-[440px] mx-auto">
            {/* Role Switcher Pill Bar */}
            <div className="bg-[#F4F8FF] p-1.5 rounded-full border border-[#E2ECFC] grid grid-cols-3 gap-1 mb-4">
              {Object.values(ROLE_CONFIG).map((item) => {
                const isActive = role === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleRoleChange(item.id)}
                    className={`py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      isActive
                        ? 'bg-[#007EDA] text-white shadow-sm'
                        : 'text-slate-600 hover:text-[#102A43]'
                    }`}
                  >
                    <Icon icon={item.icon} className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Heading & Subheading Dinamis */}
            <div className="text-center space-y-1 mb-4">
              <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#102A43] leading-tight tracking-tight">
                {currentRole.formTitle}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-normal leading-relaxed">
                {currentRole.formSubtitle}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2 text-[11px] font-semibold text-red-700"
                >
                  {errorMessage}
                </div>
              )}

              {/* 1. Nama Lengkap (Semua Role) */}
              <div className="space-y-1">
                <label
                  htmlFor="reg-name"
                  className="block text-[11px] sm:text-xs font-bold text-[#102A43]"
                >
                  {currentRole.nameLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Icon icon="lucide:user" className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={currentRole.namePlaceholder}
                    className={inputBaseClass}
                  />
                </div>
              </div>

              {/* 2. Field Identitas Khusus Per Role */}
              {role === 'siswa' && (
                <div className="space-y-1">
                  <label
                    htmlFor="reg-nisn"
                    className="block text-[11px] sm:text-xs font-bold text-[#102A43]"
                  >
                    NISN
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Icon
                        icon="lucide:id-card"
                        className="w-4 h-4 text-slate-400"
                      />
                    </div>
                    <input
                      id="reg-nisn"
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      required
                      value={nisn}
                      onChange={(e) =>
                        setNisn(e.target.value.replace(/\D/g, ''))
                      }
                      placeholder="10 digit NISN"
                      className={inputBaseClass}
                    />
                  </div>
                </div>
              )}

              {role === 'guru' && (
                <div className="space-y-1">
                  <label
                    htmlFor="reg-nip"
                    className="block text-[11px] sm:text-xs font-bold text-[#102A43]"
                  >
                    NIP / NUPTK
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Icon
                        icon="lucide:id-card"
                        className="w-4 h-4 text-slate-400"
                      />
                    </div>
                    <input
                      id="reg-nip"
                      type="text"
                      inputMode="numeric"
                      required
                      value={nip}
                      onChange={(e) =>
                        setNip(e.target.value.replace(/\D/g, ''))
                      }
                      placeholder="Nomor induk pegawai"
                      className={inputBaseClass}
                    />
                  </div>
                </div>
              )}

              {role === 'orang_tua' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label
                      htmlFor="reg-child-nisn"
                      className="block text-[11px] sm:text-xs font-bold text-[#102A43]"
                    >
                      NISN Anak
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Icon
                          icon="lucide:id-card"
                          className="w-4 h-4 text-slate-400"
                        />
                      </div>
                      <input
                        id="reg-child-nisn"
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        required
                        value={childNisn}
                        onChange={(e) =>
                          setChildNisn(e.target.value.replace(/\D/g, ''))
                        }
                        placeholder="10 digit NISN anak"
                        className={inputBaseClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="reg-child-name"
                      className="block text-[11px] sm:text-xs font-bold text-[#102A43]"
                    >
                      Nama Anak
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Icon
                          icon="lucide:user"
                          className="w-4 h-4 text-slate-400"
                        />
                      </div>
                      <input
                        id="reg-child-name"
                        type="text"
                        required
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder="Nama lengkap anak"
                        className={inputBaseClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Nomor WhatsApp */}
              <div className="space-y-1">
                <label
                  htmlFor="reg-whatsapp"
                  className="block text-[11px] sm:text-xs font-bold text-[#102A43]"
                >
                  Nomor WhatsApp
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Icon
                      icon="lucide:phone"
                      className="w-4 h-4 text-slate-400"
                    />
                  </div>
                  <input
                    id="reg-whatsapp"
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className={inputBaseClass}
                  />
                </div>
              </div>

              {/* 4. Email */}
              <div className="space-y-1">
                <label
                  htmlFor="reg-email"
                  className="block text-[11px] sm:text-xs font-bold text-[#102A43]"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Icon
                      icon="lucide:mail"
                      className="w-4 h-4 text-slate-400"
                    />
                  </div>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={currentRole.emailPlaceholder}
                    className={inputBaseClass}
                  />
                </div>
              </div>

              {/* 5. Kata Sandi & Konfirmasi Kata Sandi (2 Kolom) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label
                    htmlFor="reg-password"
                    className="block text-[11px] sm:text-xs font-bold text-[#102A43]"
                  >
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Icon
                        icon="lucide:lock"
                        className="w-4 h-4 text-slate-400"
                      />
                    </div>
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      className={`${inputBaseClass} pr-9`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword
                          ? 'Sembunyikan kata sandi'
                          : 'Lihat kata sandi'
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[#102A43] cursor-pointer"
                    >
                      <Icon
                        icon={showPassword ? 'lucide:eye-off' : 'lucide:eye'}
                        className="w-4 h-4"
                      />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="reg-confirm-password"
                    className="block text-[11px] sm:text-xs font-bold text-[#102A43]"
                  >
                    Konfirmasi Kata Sandi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Icon
                        icon="lucide:lock"
                        className="w-4 h-4 text-slate-400"
                      />
                    </div>
                    <input
                      id="reg-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi"
                      className={`${inputBaseClass} pr-9`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword
                          ? 'Sembunyikan konfirmasi sandi'
                          : 'Lihat konfirmasi sandi'
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[#102A43] cursor-pointer"
                    >
                      <Icon
                        icon={
                          showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'
                        }
                        className="w-4 h-4"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* 6. Checkbox Ketentuan Layanan */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-[#007EDA] focus:ring-[#007EDA] cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-500 leading-snug">
                    Saya menyetujui{' '}
                    <span className="font-bold text-[#007EDA] hover:underline">
                      Ketentuan Layanan
                    </span>{' '}
                    dan{' '}
                    <span className="font-bold text-[#007EDA] hover:underline">
                      Kebijakan Privasi
                    </span>{' '}
                    Hearo AI.
                  </span>
                </label>
              </div>

              {/* 7. Tombol Daftar Sekarang */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#FCD34D] hover:bg-[#FBBF24] disabled:opacity-60 text-[#102A43] text-xs sm:text-sm font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition transform active:scale-[0.99] cursor-pointer"
                >
                  <span>
                    {isSubmitting ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                  </span>
                  <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Footer Link Log In */}
            <div className="mt-3.5 text-center text-xs text-slate-500 font-medium">
              <span>Sudah punya akun? </span>
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="font-bold text-[#007EDA] hover:underline cursor-pointer"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}