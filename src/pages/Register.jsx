import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import HearoLogo from '../components/HearoLogo';

export default function Register({
  onNavigateToLogin,
  onNavigateToLanding,
  onRegisterSuccess,
}) {
  const [selectedRole, setSelectedRole] = useState('GURU');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    studentName: '',
    studentNisn: '',
    nip: '',
    nisn: '',
    kelas: '',
    phone: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  const tabs = [
    { id: 'GURU', label: 'GURU', icon: 'lucide:graduation-cap' },
    { id: 'MURID', label: 'MURID', icon: 'lucide:smile' },
    { id: 'ORANG TUA', label: 'ORANG TUA', icon: 'lucide:users' },
  ];

  const headerText = {
    GURU: {
      title: 'Daftar Akun Guru',
      subtitle:
        'Bergabung untuk mengajar bahasa isyarat & memantau perkembangan siswa',
    },
    MURID: {
      title: 'Daftar Akun Murid',
      subtitle:
        'Mulai belajar bahasa isyarat BISINDO dan struktur kalimat SPOK secara interaktif',
    },
    'ORANG TUA': {
      title: 'Daftar Akun Orang Tua',
      subtitle:
        'Dampingi perkembangan belajar bahasa isyarat & struktur kalimat anak secara berkala',
    },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return;
    if (formData.password !== formData.passwordConfirmation) return;
    if (onRegisterSuccess) {
      const {
        passwordConfirmation: _passwordConfirmation,
        ...registrationData
      } = formData;
      onRegisterSuccess({ ...registrationData, role: selectedRole });
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
      <div
        className={`w-full mx-auto my-6 z-10 transition-all duration-200 ${
          selectedRole === 'MURID' ? 'max-w-[620px]' : 'max-w-[500px]'
        }`}
      >
        {/* Pill Selector Role */}
        <div className="max-w-[500px] mx-auto bg-white/20 backdrop-blur-md border border-white/30 p-1.5 rounded-full grid grid-cols-3 gap-2 shadow-sm mb-7">
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
            {headerText[selectedRole].title}
          </h1>
          <p className="text-xs md:text-sm text-white/90 font-normal max-w-md mx-auto leading-relaxed">
            {headerText[selectedRole].subtitle}
          </p>
        </div>

        {/* ================= FORM DINAMIS PER ROLE ================= */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ---------- FORM KHUSUS GURU (5 FIELD VERTIKAL) ---------- */}
          {selectedRole === 'GURU' && (
            <>
              <div>
                <div className="flex justify-between items-center mb-1.5 px-0.5">
                  <label className="text-xs font-bold text-white">
                    Nama Lengkap
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
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="cth. Ibu Siti Rahmawati, S.Pd"
                    className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 px-0.5">
                  <label className="text-xs font-bold text-white">
                    NIP (Nomor Induk Pegawai)
                  </label>
                  <span className="text-[11px] text-white/80 font-medium">
                    Atau NUPTK
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon
                      icon="lucide:file-text"
                      className="w-4 h-4 text-slate-400"
                    />
                  </div>
                  <input
                    type="text"
                    name="nip"
                    value={formData.nip}
                    onChange={handleChange}
                    placeholder="18 digit NIP resmi atau NUPTK"
                    className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 px-0.5">
                  <label className="text-xs font-bold text-white">
                    Nomor Telepon / WhatsApp
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon
                      icon="lucide:phone"
                      className="w-4 h-4 text-slate-400"
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 px-0.5">
                  <label className="text-xs font-bold text-white">
                    Email Resmi
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon
                      icon="lucide:mail"
                      className="w-4 h-4 text-slate-400"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="guru@sekolah.sch.id atau nama@hearo.id"
                    className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm"
                  />
                </div>
              </div>
            </>
          )}

          {/* ---------- FORM KHUSUS MURID (2 KOLOM + 1 KOLOM) ---------- */}
          {selectedRole === 'MURID' && (
            <>
              {/* Baris 1: Nama Lengkap & Nomor Telepon */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5 px-0.5">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Icon
                        icon="lucide:user"
                        className="w-4 h-4 text-slate-400"
                      />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="cth. Dimas Prasetyo"
                      className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1.5 px-0.5">
                    Nomor Telepon / WhatsApp
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Icon
                        icon="lucide:phone"
                        className="w-4 h-4 text-slate-400"
                      />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="cth. 0812-xxxx-xxxx"
                      className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Baris 2: NISN & Kelas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5 px-0.5">
                    NISN (Nomor Induk Siswa Nasional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Icon
                        icon="lucide:contact"
                        className="w-4 h-4 text-slate-400"
                      />
                    </div>
                    <input
                      type="text"
                      name="nisn"
                      value={formData.nisn}
                      onChange={handleChange}
                      placeholder="10 digit NISN resmi"
                      className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1.5 px-0.5">
                    Kelas
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Icon
                        icon="lucide:school"
                        className="w-4 h-4 text-slate-400"
                      />
                    </div>
                    <select
                      name="kelas"
                      required
                      value={formData.kelas}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-10 py-3.5 bg-white rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm ${
                        formData.kelas ? 'text-[#102A43]' : 'text-slate-400'
                      }`}
                    >
                      <option value="" disabled>
                        Pilih Kelas
                      </option>
                      <option value="SDLB - Kelas 1-6">SDLB (Kelas 1 - 6)</option>
                      <option value="SMPLB - Kelas 7">SMPLB - Kelas 7</option>
                      <option value="SMPLB - Kelas 8">SMPLB - Kelas 8</option>
                      <option value="SMPLB - Kelas 9">SMPLB - Kelas 9</option>
                      <option value="SMALB - Kelas 10">SMALB - Kelas 10</option>
                      <option value="SMALB - Kelas 11">SMALB - Kelas 11</option>
                      <option value="SMALB - Kelas 12">SMALB - Kelas 12</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <Icon
                        icon="lucide:chevron-down"
                        className="w-4 h-4 text-slate-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Baris 3: Email Siswa / Akun Belajar */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 px-0.5">
                  Email Siswa / Akun Belajar
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon
                      icon="lucide:mail"
                      className="w-4 h-4 text-slate-400"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="murid@sekolah.sch.id atau nama@email.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm"
                  />
                </div>
              </div>
            </>
          )}

          {/* ---------- FORM KHUSUS ORANG TUA ---------- */}
          {selectedRole === 'ORANG TUA' && (
            <>
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 px-0.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon
                      icon="lucide:user"
                      className="w-4 h-4 text-slate-400"
                    />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="cth. Ayah Hendra Gunawan / Ibu Ratna"
                    className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1.5 px-0.5">
                  Nama Siswa
                </label>
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
                    placeholder="Nama lengkap siswa"
                    className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1.5 px-0.5">
                  NISN Siswa
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon
                      icon="lucide:file-text"
                      className="w-4 h-4 text-slate-400"
                    />
                  </div>
                  <input
                    type="text"
                    name="studentNisn"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    title="NISN harus terdiri dari 10 digit angka"
                    value={formData.studentNisn}
                    onChange={handleChange}
                    placeholder="10 digit NISN siswa"
                    className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1.5 px-0.5">
                  Nomor Telepon / WhatsApp
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon
                      icon="lucide:phone"
                      className="w-4 h-4 text-slate-400"
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="cth. 0812-xxxx-xxxx"
                    className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1.5 px-0.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon
                      icon="lucide:mail"
                      className="w-4 h-4 text-slate-400"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm"
                  />
                </div>
              </div>
            </>
          )}

          {/* ---------- KATA SANDI (SEMUA ROLE SAMA) ---------- */}
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
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-[#102A43]"
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

          <div>
            <label className="block text-xs font-bold text-white mb-1.5 px-0.5">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon icon="lucide:lock" className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
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
                className={`w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FCD34D] shadow-sm ${
                  passwordsDoNotMatch ? 'ring-2 ring-red-400' : ''
                }`}
              />
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

          {/* ---------- BANNER INFO KUNING KHUSUS ORANG TUA ---------- */}
          {selectedRole === 'ORANG TUA' && (
            <div className="bg-[#FEF9C3] border border-[#FDE047] rounded-2xl p-4 flex items-start gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#FCD34D]/40 flex items-center justify-center shrink-0 mt-0.5">
                <Icon
                  icon="lucide:users"
                  className="w-4 h-4 text-[#102A43]"
                />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-extrabold text-[#102A43] leading-snug">
                  Akun akan dihubungkan dengan data anak oleh guru kelas.
                </h4>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  Pastikan nama orang tua dan kontak aktif agar verifikasi wali
                  murid di sekolah berlangsung cepat.
                </p>
              </div>
            </div>
          )}

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
          Hearo AI © 2025 • Media Belajar Aksesibel Inklusif • Didukung
          Pengenalan BISINDO & SPOK
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Icon icon="lucide:accessibility" className="w-3.5 h-3.5" />
            <span>Standar WCAG 2.1 AAA</span>
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <Icon icon="lucide:languages" className="w-3.5 h-3.5" />
            <span>Bahasa Isyarat Indonesia</span>
          </span>
        </div>
      </div>
    </div>
  );
}