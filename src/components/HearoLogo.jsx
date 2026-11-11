import React from 'react';
import logoIcon from '../assets/logo-icon.svg';
import logoText from '../assets/logo-text.svg';

export default function HearoLogo({ variant = 'card', className = '' }) {
  // Mode 1: Kartu Biru ber-shadow (Untuk Navbar Landing Page)
  if (variant === 'card') {
    return (
      <div className={`bg-[#007EDA] px-3 py-1 rounded-2xl shadow-md flex items-center gap-3 border border-white/20 select-none ${className}`}>
        <img src={logoIcon} alt="Hearo Icon" className="h-12 md:h-14 w-auto" />
        <img src={logoText} alt="Hearo Text" className="h-11 md:h-12 w-auto brightness-200" />
      </div>
    );
  }

  // Mode 2: Transparan tanpa background (Untuk halaman Login/Register)
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <img src={logoIcon} alt="Hearo Icon" className="h-9 md:h-10 w-auto" />
      <img src={logoText} alt="Hearo Text" className="h-6 md:h-7 w-auto brightness-200" />
    </div>
  );
}