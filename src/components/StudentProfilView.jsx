import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { apiRequest } from '../services/api';

export default function StudentProfilView({
  user,
  onUpdateProfile,
  connectedParents = [],
}) {
  // State Orang Tua Terhubung
  // State Data Diri
  const [profileData, setProfileData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    kelas: user?.kelas || '',
    nisn: user?.nisn || '',
    joinedAt: user?.created_at
      ? new Date(user.created_at).toLocaleDateString('id-ID')
      : '',
  });

  const [formData, setFormData] = useState({
    fullName: profileData.fullName,
    email: profileData.email,
    phone: profileData.phone,
    kelas: profileData.kelas,
  });

  const [profileFeedback, setProfileFeedback] = useState(null);

  // State Ganti Password
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordFeedback, setPasswordFeedback] = useState(null);

  // Handler Simpan Perubahan Data Diri
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.kelas.trim()
    ) {
      setProfileFeedback({
        type: 'error',
        text: 'Semua kolom bertanda (*) wajib diisi.',
      });
      return;
    }

    try {
      const response = await apiRequest('/profil', {
        method: 'PUT',
        body: {
          nama: formData.fullName.trim(),
          email: formData.email.trim(),
          no_telepon: formData.phone.trim(),
          kelas: formData.kelas.trim(),
        },
      });
      const updated = {
        ...profileData,
        fullName: response.data.nama,
        email: response.data.email,
        phone: response.data.no_telepon,
        kelas: response.data.kelas,
      };
      setProfileData(updated);
      onUpdateProfile?.(updated);
      setProfileFeedback({ type: 'success', text: 'Perubahan data diri berhasil disimpan.' });
    } catch (error) {
      setProfileFeedback({ type: 'error', text: `Profil gagal diperbarui: ${error.message}` });
    }
    setTimeout(() => setProfileFeedback(null), 3500);
  };

  // Handler Ganti Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwordForm;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordFeedback({
        type: 'error',
        text: 'Harap lengkapi seluruh kolom password.',
      });
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 50) {
      setPasswordFeedback({
        type: 'error',
        text: 'Password baru harus terdiri dari 8–50 karakter.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({
        type: 'error',
        text: 'Konfirmasi password baru tidak cocok.',
      });
      return;
    }

    try {
      await apiRequest('/password', {
        method: 'PUT',
        body: {
          current_password: oldPassword,
          new_password: newPassword,
        },
      });
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordFeedback({ type: 'success', text: 'Password akunmu berhasil diperbarui.' });
    } catch (error) {
      setPasswordFeedback({ type: 'error', text: `Password gagal diperbarui: ${error.message}` });
    }
    setTimeout(() => setPasswordFeedback(null), 3500);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header Section */}
      <div className="space-y-1">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#007EDA]">
          AKUN
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#102A43]">
          Profil Saya
        </h2>
        <p className="text-xs md:text-sm text-slate-500">
          Perbarui data diri dan ganti password akunmu.
        </p>
      </div>

      {/* Grid Utama: Kolom Kiri (Kartu Identitas) & Kolom Kanan (3 Kartu Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= KOLOM KIRI: KARTU PROFIL SISWA ================= */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-7 flex flex-col items-center text-center">
          {/* Avatar Bulat Berbingkai Kuning */}
          <div className="w-24 h-24 rounded-full p-1 border-[3px] border-[#FCD34D] bg-[#EEF4FF] flex items-center justify-center overflow-hidden shadow-xs">
            <Icon icon="noto:boy-light-skin-tone" className="w-20 h-20" />
          </div>

          <h3 className="text-base md:text-lg font-extrabold text-[#102A43] mt-4">
            {profileData.fullName}
          </h3>

          <span className="mt-1.5 inline-block bg-[#FEF3C7] text-[#B45309] text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full">
            SISWA
          </span>

          {/* Detail NISN, Kelas, Bergabung */}
          <div className="w-full mt-6 pt-2 border-t border-slate-100 divide-y divide-slate-100 text-xs">
            <div className="py-3.5 flex items-center justify-between">
              <span className="text-slate-400 font-medium">NISN</span>
              <span className="font-extrabold text-[#102A43]">
                {profileData.nisn}
              </span>
            </div>

            <div className="py-3.5 flex items-center justify-between">
              <span className="text-slate-400 font-medium">Kelas</span>
              <span className="font-extrabold text-[#102A43]">
                {profileData.kelas}
              </span>
            </div>

            <div className="py-3.5 flex items-center justify-between">
              <span className="text-slate-400 font-medium">Bergabung</span>
              <span className="font-extrabold text-[#102A43]">
                {profileData.joinedAt}
              </span>
            </div>
          </div>
        </div>

        {/* ================= KOLOM KANAN: ORANG TUA, DATA DIRI, PASSWORD ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* -------- CARD 1: ORANG TUA TERHUBUNG -------- */}
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-7 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#007EDA] flex items-center justify-center shrink-0">
                <Icon icon="lucide:users" className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-extrabold text-[#102A43]">
                  Orang Tua Terhubung
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Orang tua yang bisa melihat nilai dan LKPD-mu
                </p>
              </div>
            </div>

            {connectedParents.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {connectedParents.map((parent) => (
                  <div
                    key={parent.id}
                    className="py-3.5 first:pt-1 last:pb-1 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#007EDA] text-xs font-extrabold flex items-center justify-center shrink-0">
                        {parent.initials || parent.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs md:text-sm font-extrabold text-[#102A43]">
                          {parent.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {[parent.email, parent.phone].filter(Boolean).join(' · ') || 'Akun orang tua terhubung'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500">
                  Belum ada akun orang tua yang terhubung saat ini.
                </p>
              </div>
            )}
          </section>

          {/* -------- CARD 2: DATA DIRI -------- */}
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-7 space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#007EDA] flex items-center justify-center shrink-0">
                <Icon icon="lucide:id-card" className="w-4 h-4" />
              </div>
              <h3 className="text-sm md:text-base font-extrabold text-[#102A43]">
                Data Diri
              </h3>
            </div>

            {profileFeedback && (
              <div
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  profileFeedback.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}
              >
                <Icon
                  icon={
                    profileFeedback.type === 'success'
                      ? 'lucide:check-circle-2'
                      : 'lucide:alert-circle'
                  }
                  className="w-4 h-4 shrink-0"
                />
                <span>{profileFeedback.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#102A43] block">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Icon
                    icon="lucide:user"
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm font-medium text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#007EDA]/30"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#102A43] block">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Icon
                    icon="lucide:mail"
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm font-medium text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#007EDA]/30"
                  />
                </div>
              </div>

              {/* No. Telepon */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#102A43] block">
                  No. Telepon <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Icon
                    icon="lucide:phone"
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm font-medium text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#007EDA]/30"
                  />
                </div>
              </div>

              {/* Kelas */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#102A43] block">
                  Kelas <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Icon
                    icon="lucide:school"
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={formData.kelas}
                    onChange={(e) =>
                      setFormData({ ...formData, kelas: e.target.value })
                    }
                    className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm font-medium text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#007EDA]/30"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#007EDA] hover:bg-[#0066B2] text-white text-xs font-extrabold inline-flex items-center gap-2 shadow-2xs transition cursor-pointer"
              >
                <Icon icon="lucide:save" className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>

          {/* -------- CARD 3: GANTI PASSWORD -------- */}
          <form
            onSubmit={handleChangePassword}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-7 space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#007EDA] flex items-center justify-center shrink-0">
                <Icon icon="lucide:lock-keyhole" className="w-4 h-4" />
              </div>
              <h3 className="text-sm md:text-base font-extrabold text-[#102A43]">
                Ganti Password
              </h3>
            </div>

            {passwordFeedback && (
              <div
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  passwordFeedback.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}
              >
                <Icon
                  icon={
                    passwordFeedback.type === 'success'
                      ? 'lucide:check-circle-2'
                      : 'lucide:alert-circle'
                  }
                  className="w-4 h-4 shrink-0"
                />
                <span>{passwordFeedback.text}</span>
              </div>
            )}

            {/* Password Lama (Full Width) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#102A43] block">
                Password Lama <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Icon
                  icon="lucide:lock"
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type={showPassword.old ? 'text' : 'password'}
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      oldPassword: e.target.value,
                    })
                  }
                  placeholder="Masukkan password lama"
                  className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-10 py-2.5 text-xs md:text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007EDA]/30"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({ ...showPassword, old: !showPassword.old })
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <Icon
                    icon={showPassword.old ? 'lucide:eye-off' : 'lucide:eye'}
                    className="w-4 h-4"
                  />
                </button>
              </div>
            </div>

            {/* Password Baru & Konfirmasi Password Baru (2 Kolom) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#102A43] block">
                  Password Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Icon
                    icon="lucide:key-round"
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="Minimal 8 karakter"
                    className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-10 py-2.5 text-xs md:text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007EDA]/30"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        new: !showPassword.new,
                      })
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <Icon
                      icon={showPassword.new ? 'lucide:eye-off' : 'lucide:eye'}
                      className="w-4 h-4"
                    />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">8-50 karakter.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#102A43] block">
                  Konfirmasi Password Baru{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Icon
                    icon="lucide:key-round"
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Ulangi password baru"
                    className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-10 py-2.5 text-xs md:text-sm text-[#102A43] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007EDA]/30"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        confirm: !showPassword.confirm,
                      })
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <Icon
                      icon={
                        showPassword.confirm ? 'lucide:eye-off' : 'lucide:eye'
                      }
                      className="w-4 h-4"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl border border-[#007EDA] bg-white hover:bg-[#EEF4FF] text-[#007EDA] text-xs font-extrabold inline-flex items-center gap-2 transition cursor-pointer"
              >
                <Icon icon="lucide:rotate-cw" className="w-3.5 h-3.5" />
                <span>Ganti Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}