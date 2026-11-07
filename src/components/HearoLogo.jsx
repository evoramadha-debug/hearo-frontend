import React from 'react';
import logoIcon from '../assets/logo-icon.svg';
import logoText from '../assets/logo-text.svg';

export default function HearoLogo({ className = "h-16" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src={logoIcon} 
        alt="Hearo Icon" 
        className="h-full w-auto object-contain drop-shadow-sm" 
      />
      <img 
        src={logoText} 
        alt="Hearo Text" 
        className="h-[75%] w-auto object-contain drop-shadow-sm" 
      />
    </div>
  );
}