import React from 'react';

// Komponen Khusus Ikon Telinga HEARO AI (Tanpa Teks)
export default function HearoIcon({ className = "w-10 h-10" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Telinga Putih */}
      <path 
        d="M50 15C30.67 15 15 30.67 15 50C15 65.5 25.1 78.6 39.2 83.2C42 84.1 44.2 81.7 44.2 78.8V75.5C44.2 73.8 43.1 72.3 41.6 71.5C32.8 66.8 27 57.6 27 47C27 34.3 37.3 24 50 24C62.7 24 73 34.3 73 47C73 54.8 69.1 61.7 63.1 65.8C61.6 66.8 60.8 68.5 60.8 70.3V78.8C60.8 81.7 63 84.1 65.8 83.2C79.9 78.6 90 65.5 90 50C90 30.67 74.33 15 50 15Z" 
        fill="white"
      />
      {/* Hati Emas/Kuning */}
      <path 
        d="M50 42C46.5 37.5 39.5 38.5 37 43C34 48.5 40 56 50 62C60 56 66 48.5 63 43C60.5 38.5 53.5 37.5 50 42Z" 
        fill="#FFC72C"
      />
      {/* Gelombang Isyarat / Audio (Kuning) */}
      <path 
        d="M78 40C80.5 44 80.5 50 78 54" 
        stroke="#FFC72C" 
        strokeWidth="5" 
        strokeLinecap="round"
      />
      <path 
        d="M85 34C89 41 89 53 85 60" 
        stroke="#FFC72C" 
        strokeWidth="5" 
        strokeLinecap="round"
      />
    </svg>
  );
}