import React, { useState } from 'react';
import HearoLogo from '../components/HearoLogo';

export default function Login({ onNavigateToRegister }) {
  const [selectedRole, setSelectedRole] = useState('murid');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    {
      id: 'guru',
      title: 'GURU',
      icon: '👨‍🏫',
      bgUnselected: 'bg-[#FFF3E0]',
      textActive: 'text-[#102A43]',
    },
    {
      id: 'murid',
      title: 'MURID',
      icon: '👨‍🎓',
      bgUnselected: 'bg-[#E3F2FD]',
      textActive: 'text-[#007EDA]',
    },
    {
      id: 'orang_tua',
      title: 'ORANG TUA',
      icon: '👨‍👩‍👧',
      bgUnselected: 'bg-[#F3E5F5]',
      textActive: 'text-[#102A43]',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { role: selectedRole, email, password });
  };

  return (
    <div className="min-h-screen bg-[#007EDA] flex flex-col justify-between p-4 md:p-8 text-white font-sans relative overflow-hidden">
      
      {/* ----------------- BUBBLE BACKGROUND FIGMA ----------------- */}
      {/* Bubble Kanan Atas */}
      <div className="absolute top-[-100px] right-[-80px] w-[500px] h-[500px] bg-[#0067B8]/60 rounded-full blur-xl pointer-events-none z-0"></div>
      
      {/* Bubble Kiri Bawah */}
      <div className="absolute bottom-[-150px] left-[-120px] w-[550px] h-[550px] bg-[#0067B8]/50 rounded-full blur-2xl pointer-events-none z-0"></div>

      {/* Bubble Tengah (Aksen Soft Cyan #6DD5FA) */}
      <div className="absolute top-[40%] left-[-180px] w-[400px] h-[400px] bg-[#6DD5FA]/25 rounded-full blur-3xl pointer-events-none z-0"></div>
      {/* ----------------------------------------------------------- */}

      {/* Header / Logo */}
      <div className="flex justify-between items-center max-w-6xl w-full mx-auto z-10">
        <HearoLogo className="h-14" />
        <div className="hidden sm:flex items-center gap-2 text-xs bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white font-medium shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFC72C]"></span>
          Platform Edukasi Inklusif BISINDO & SPOK
        </div>
      </div>

      {/* Main Container Card Login */}
      <div className="max-w-xl w-full mx-auto bg-white/20 backdrop-blur-xl border border-white/30 rounded-[36px] p-8 md:p-10 my-6 shadow-2xl z-10">
        {/* Title Section */}
        <div className="text-center mb-7">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#102A43] mb-2 tracking-tight">
            Selamat Datang di Hearo AI
          </h2>
          <p className="text-xs md:text-sm text-[#F5FAFF] font-medium leading-relaxed">
            Masuk untuk mengakses materi visual & latihan bahasa isyarat
          </p>
        </div>

        {/* Pilih Peran Pengguna */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#102A43] uppercase tracking-wider mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>PILIH PERAN PENGGUNA</span>
          </div>

          <div className="grid grid-cols-3 gap-3.5">
            {roles.map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex flex-col items-center justify-between p-3 rounded-2xl transition-all duration-200 border-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#F5FAFF] border-[#007EDA] shadow-lg scale-102'
                      : 'bg-[#F5FAFF]/90 border-transparent hover:bg-white text-slate-700 opacity-95'
                  }`}
                >
                  <div className={`w-full h-24 rounded-xl flex items-center justify-center text-4xl mb-3 ${role.bgUnselected}`}>
                    {role.icon}
                  </div>
                  <span className={`text-xs font-black tracking-wider ${isSelected ? role.textActive : 'text-slate-800'}`}>
                    {role.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#007EDA]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@hearo.id"
              className="w-full pl-12 pr-4 py-3.5 bg-[#F5FAFF] text-[#102A43] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6DD5FA] text-sm placeholder-slate-400 font-medium shadow-inner"
            />
          </div>

          {/* Label Lupa Password */}
          <div className="flex justify-start text-xs text-[#F5FAFF] font-medium pl-1">
            <a href="#" className="hover:underline">
              Lupa Password?
            </a>
          </div>

          {/* Input Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#007EDA]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="w-full pl-12 pr-12 py-3.5 bg-[#F5FAFF] text-[#102A43] rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#6DD5FA] text-sm placeholder-slate-400 font-medium shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>

          {/* Tombol Log In */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#102A43] hover:bg-[#0067B8] text-white font-bold rounded-full shadow-xl transition duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Log In</span>
              <span className="text-base">→</span>
            </button>
          </div>
        </form>

        {/* Divider Garis Tipis */}
        <div className="border-t border-white/20 my-6"></div>

        {/* Link ke Register */}
        <div className="text-center text-xs text-[#F5FAFF] font-medium flex items-center justify-center gap-1">
          <span>Belum punya akun?</span>
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="font-bold text-[#007EDA] hover:underline flex items-center gap-0.5 cursor-pointer bg-transparent border-0 p-0"
          >
            Daftar
            <svg className="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer text */}
      <div className="text-center text-[11px] text-[#F5FAFF]/80 z-10">
        Hearo AI © 2026 - Media Belajar Aksesibel Inklusif • Didukung Pengenalan BISINDO & SPOK
      </div>
    </div>
  );
}