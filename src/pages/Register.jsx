import React, { useState } from 'react';
import HearoLogo from '../components/HearoLogo';

export default function Register({ onNavigateToLogin }) {
  const [selectedRole, setSelectedRole] = useState('guru');
  const [showPassword, setShowPassword] = useState(false);

  const [guruForm, setGuruForm] = useState({ fullName: '', nip: '', phone: '', email: '', password: '', agreeTerms: false });
  const [muridForm, setMuridForm] = useState({ fullName: '', phone: '', nisn: '', kelas: '', email: '', password: '', agreeTerms: false });
  const [orangTuaForm, setOrangTuaForm] = useState({ fullName: '', phone: '', email: '', password: '', agreeTerms: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit Register:', selectedRole);
  };

  return (
    <div className="min-h-screen bg-[#007EDA] flex flex-col justify-between p-4 md:p-8 text-white font-sans relative overflow-hidden">
      
      {/* Background Ornamen */}
      <div className="absolute top-[-100px] left-[-80px] w-[500px] h-[500px] bg-[#0067B8]/60 rounded-full blur-2xl pointer-events-none z-0"></div>
      <div className="absolute bottom-[-150px] right-[-120px] w-[550px] h-[550px] bg-[#0067B8]/50 rounded-full blur-2xl pointer-events-none z-0"></div>

      {/* Header / Logo */}
      <div className="flex justify-between items-center max-w-6xl w-full mx-auto z-10">
        <HearoLogo className="h-14" />
        <div className="hidden sm:flex items-center gap-2 text-xs bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white font-medium shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFC72C]"></span>
          Platform Edukasi Inklusif BISINDO & SPOK
        </div>
      </div>

      {/* Main Container Card */}
      <div className="max-w-2xl w-full mx-auto bg-white/20 backdrop-blur-xl border border-white/30 rounded-[36px] p-6 md:p-9 my-6 shadow-2xl z-10">
        
        {/* Tab Switcher Peran Kapsul Figma */}
        <div className="bg-[#102A43] p-1.5 rounded-full border border-white/20 flex items-center mb-6">
          <button
            type="button"
            onClick={() => setSelectedRole('guru')}
            className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === 'guru'
                ? 'bg-[#102A43] text-white border border-white/40 shadow-md'
                : 'bg-white text-[#102A43] hover:bg-white/90'
            }`}
          >
            <span>👨‍🏫 GURU</span>
            {selectedRole === 'guru' && <span className="w-2 h-2 rounded-full bg-[#FFC72C]"></span>}
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('murid')}
            className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === 'murid'
                ? 'bg-[#102A43] text-white border border-white/40 shadow-md'
                : 'bg-white text-[#102A43] hover:bg-white/90'
            }`}
          >
            <span>👨‍🎓 MURID</span>
            {selectedRole === 'murid' && <span className="w-2 h-2 rounded-full bg-[#FFC72C]"></span>}
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('orang_tua')}
            className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === 'orang_tua'
                ? 'bg-[#102A43] text-white border border-white/40 shadow-md'
                : 'bg-white text-[#102A43] hover:bg-white/90'
            }`}
          >
            <span>👨‍👩‍👧 ORANG TUA</span>
            {selectedRole === 'orang_tua' && <span className="w-2 h-2 rounded-full bg-[#FFC72C]"></span>}
          </button>
        </div>

        {/* Title Dynamic */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1.5 tracking-tight">
            {selectedRole === 'guru' && 'Daftar Akun Guru'}
            {selectedRole === 'murid' && 'Daftar Akun Murid'}
            {selectedRole === 'orang_tua' && 'Daftar Akun Orang Tua'}
          </h2>
          <p className="text-xs md:text-sm text-[#F5FAFF]/90 font-medium leading-relaxed">
            {selectedRole === 'guru' && 'Bergabung untuk mengajar bahasa isyarat & memadukan perkembangan siswa'}
            {selectedRole === 'murid' && 'Mulai belajar bahasa isyarat BISINDO dan struktur kalimat SPOK secara interaktif'}
            {selectedRole === 'orang_tua' && 'Dampingi perkembangan belajar bahasa isyarat & struktur kalimat anak secara berkala'}
          </p>
        </div>

        {/* FORM REGISTER */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ================= FORM GURU ================= */}
          {selectedRole === 'guru' && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1 pl-1">
                  <label className="text-xs font-semibold text-white">Nama Lengkap</label>
                  <span className="text-[10px] text-white/70">Wajib diisi</span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">👤</span>
                  <input
                    type="text"
                    required
                    value={guruForm.fullName}
                    onChange={(e) => setGuruForm({ ...guruForm, fullName: e.target.value })}
                    placeholder="cth. Ibu Siti Rahmawati, S.Pd"
                    className="w-full pl-10 pr-4 py-3 bg-[#F5FAFF] text-[#102A43] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6DD5FA] text-sm placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 pl-1">
                  <label className="text-xs font-semibold text-white">NIP (Nomor Induk Pegawai)</label>
                  <span className="text-[10px] text-white/70">Atau NUPTK</span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">🪪</span>
                  <input
                    type="text"
                    required
                    value={guruForm.nip}
                    onChange={(e) => setGuruForm({ ...guruForm, nip: e.target.value })}
                    placeholder="18 digit NIP resmi atau NUPTK"
                    className="w-full pl-10 pr-4 py-3 bg-[#F5FAFF] text-[#102A43] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6DD5FA] text-sm placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1 pl-1">Nomor Telepon / WhatsApp</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">📞</span>
                  <input
                    type="tel"
                    required
                    value={guruForm.phone}
                    onChange={(e) => setGuruForm({ ...guruForm, phone: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full pl-10 pr-4 py-3 bg-[#F5FAFF] text-[#102A43] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6DD5FA] text-sm placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1 pl-1">Email Resmi</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">✉️</span>
                  <input
                    type="email"
                    required
                    value={guruForm.email}
                    onChange={(e) => setGuruForm({ ...guruForm, email: e.target.value })}
                    placeholder="guru@sekolah.sch.id atau nama@hearo.id"
                    className="w-full pl-10 pr-4 py-3 bg-[#F5FAFF] text-[#102A43] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6DD5FA] text-sm placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1 pl-1">Kata Sandi</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={guruForm.password}
                    onChange={(e) => setGuruForm({ ...guruForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 bg-[#F5FAFF] text-[#102A43] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6DD5FA] text-sm placeholder-slate-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    👁
                  </button>
                </div>
                <p className="text-[10px] text-white/80 mt-1 pl-1">ⓘ Minimal 8, maksimal 50 karakter</p>
              </div>

              <div className="flex items-center gap-2 pt-1 pl-1">
                <input
                  type="checkbox"
                  id="agreeGuru"
                  required
                  checked={guruForm.agreeTerms}
                  onChange={(e) => setGuruForm({ ...guruForm, agreeTerms: e.target.checked })}
                  className="w-4 h-4 rounded text-[#007EDA] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="agreeGuru" className="text-xs text-white/90 font-medium cursor-pointer">
                  Saya menyetujui <a href="#" className="font-bold underline">Ketentuan Layanan</a> & <a href="#" className="font-bold underline">Kebijakan Privasi</a> Hearo AI
                </label>
              </div>
            </div>
          )}

          {/* ================= FORM MURID ================= */}
          {selectedRole === 'murid' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1 pl-1">Nama Lengkap</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">👤</span>
                    <input
                      type="text"
                      required
                      value={muridForm.fullName}
                      onChange={(e) => setMuridForm({ ...muridForm, fullName: e.target.value })}
                      placeholder="cth. Dimas Prasetyo"
                      className="w-full pl-10 pr-4 py-3 bg-[#F5FAFF] text-[#102A43] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6DD5FA] text-sm placeholder-slate-400 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1 pl-1">Nomor Telepon / WhatsApp</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">📞</span>
                    <input
                      type="tel"
                      required
                      value={muridForm.phone}
                      onChange={(e) => setMuridForm({ ...muridForm, phone: e.target.value })}
                      placeholder="cth. 0812-xxxx-xxxx"
                      className="w-full pl-10 pr-4 py-3 bg-[#F5FAFF] text-[#102A43] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6DD5FA] text-sm placeholder-slate-400 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1 pl-1">NISN (Nomor Induk Siswa Nasional)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">🪪</span>
                    <input
                      type="text"
                      required
                      value={muridForm.nisn}
                      onChange={(e) => setMuridForm({ ...muridForm, nisn: e.target.value })}
                      placeholder="10 digit NISN resmi"
                      className="w-full pl-10 pr-4 py-3 bg-[#F5FAFF] text-[#102A43] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6DD5FA] text-sm placeholder-slate-400 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1 pl-1">Kelas</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">🏫</span>
                    <select
                      required
                      value={muridForm.kelas}
                      onChange={(e) => setMuridForm({ ...muridForm, kelas: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-[#F5FAFF] text-[#102A43] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6DD5FA] text-sm font-medium appearance-none cursor-pointer"
                    >
                      <option value="">Pilih Kelas</option>
                      <option value="SD - Kelas 1-3">SD - Kelas 1-3</option>
                      <option value="SD - Kelas 4-6">SD - Kelas 4-6</option>
                      <option value="SMP">SMP</option>
                      <option value="SMA / SMK">SMA / SMK</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1 pl-1">Email Siswa / Akun Belajar</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">✉️</span>
                  <input
                    type="email"
                    required
                    value={muridForm.email}
                    onChange={(e) => setMuridForm({ ...muridForm, email: e.target.value })}
                    placeholder="murid@sekolah.sch.id atau nama@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#F5FAFF] text-[#102A43] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6DD5FA] text-sm placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1 pl-1">Kata Sandi</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={muridForm.password}
                    onChange={(e) => setMuridForm({ ...muridForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 bg-[#F5FAFF] text-[#102A43] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6DD5FA] text-sm placeholder-slate-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    👁
                  </button>
                </div>
                <p className="text-[10px] text-white/80 mt-1 pl-1">ⓘ Minimal 8, maksimal 50 karakter</p>
              </div>

              <div className="flex items-center gap-2 pt-1 pl-1">
                <input
                  type="checkbox"
                  id="agreeMurid"
                  required
                  checked={muridForm.agreeTerms}
                  onChange={(e) => setMuridForm({ ...muridForm, agreeTerms: e.target.checked })}
                  className="w-4 h-4 rounded text-[#007EDA] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="agreeMurid" className="text-xs text-white/90 font-medium cursor-pointer">
                  Saya menyetujui <a href="#" className="font-bold underline">Ketentuan Layanan</a> & <a href="#" className="font-bold underline">Kebijakan Privasi</a> Hearo AI
                </label>
              </div>
            </div>
          )}

          {/* ================= FORM ORANG TUA ================= */}
          {selectedRole === 'orang_tua' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white mb-1 pl-1">Nama Lengkap</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">👤</span>
                  <input
                    type="text"
                    required
                    value={orangTuaForm.fullName}
                    onChange={(e) => setOrangTuaForm({ ...orangTuaForm, fullName: e.target.value })}
                    placeholder="cth. Ayah Hendra Gunawan / Ibu Ratna"
                    className="w-full pl-10 pr-4 py-3 bg-[#F5FAFF] text-[#102A43] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6DD5FA] text-sm placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1 pl-1">Nomor Telepon / WhatsApp</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">📞</span>
                  <input
                    type="tel"
                    required
                    value={orangTuaForm.phone}
                    onChange={(e) => setOrangTuaForm({ ...orangTuaForm, phone: e.target.value })}
                    placeholder="cth. 0812-xxxx-xxxx"
                    className="w-full pl-10 pr-4 py-3 bg-[#F5FAFF] text-[#102A43] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6DD5FA] text-sm placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1 pl-1">Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">✉️</span>
                  <input
                    type="email"
                    required
                    value={orangTuaForm.email}
                    onChange={(e) => setOrangTuaForm({ ...orangTuaForm, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#F5FAFF] text-[#102A43] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6DD5FA] text-sm placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1 pl-1">Kata Sandi</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={orangTuaForm.password}
                    onChange={(e) => setOrangTuaForm({ ...orangTuaForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 bg-[#F5FAFF] text-[#102A43] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6DD5FA] text-sm placeholder-slate-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    👁
                  </button>
                </div>
                <p className="text-[10px] text-white/80 mt-1 pl-1">ⓘ Minimal 8, maksimal 50 karakter</p>
              </div>

              {/* Info Box Kuning Spesifik Orang Tua Figma */}
              <div className="bg-[#FFF9C4] text-[#5D4037] p-3.5 rounded-2xl flex items-start gap-3 border border-[#FFF59D] my-2 shadow-sm">
                <span className="text-xl">👨‍👩‍👧</span>
                <div className="text-xs leading-relaxed font-medium">
                  <span className="font-bold block text-slate-900 mb-0.5">Akun akan dihubungkan dengan data anak oleh guru kelas.</span>
                  Pastikan nama orang tua dan kontak aktif agar verifikasi wali murid di sekolah berlangsung cepat.
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 pl-1">
                <input
                  type="checkbox"
                  id="agreeOrangTua"
                  required
                  checked={orangTuaForm.agreeTerms}
                  onChange={(e) => setOrangTuaForm({ ...orangTuaForm, agreeTerms: e.target.checked })}
                  className="w-4 h-4 rounded text-[#007EDA] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="agreeOrangTua" className="text-xs text-white/90 font-medium cursor-pointer">
                  Saya menyetujui <a href="#" className="font-bold underline">Ketentuan Layanan</a> & <a href="#" className="font-bold underline">Kebijakan Privasi</a> Hearo AI
                </label>
              </div>
            </div>
          )}

          {/* Tombol Submit */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#102A43] hover:bg-[#0067B8] text-white font-bold rounded-full shadow-xl transition duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Daftar Sekarang</span>
              <span className="text-base">→</span>
            </button>
          </div>
        </form>

        {/* Link Kembali ke Login */}
        <div className="text-center mt-5 text-xs text-white/90 font-medium">
          Sudah punya akun?{' '}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-bold text-white hover:underline cursor-pointer bg-transparent border-0 p-0"
          >
            Log In
          </button>
        </div>

      </div>

      {/* Footer Text & Badges Figma */}
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-6xl w-full mx-auto text-[11px] text-white/70 z-10 gap-2 pt-4 border-t border-white/10">
        <div>Hearo AI © 2026 - Media Belajar Aksesibel Inklusif • Didukung Pengenalan BISINDO & SPOK</div>
        <div className="flex gap-4 text-white/80 font-medium">
          <span>♿ Standar WCAG 2.1 AAA (Aksesibilitas Ramah Tuli)</span>
          <span>🤟 Bahasa Isyarat Indonesia (BISINDO)</span>
        </div>
      </div>
    </div>
  );
}