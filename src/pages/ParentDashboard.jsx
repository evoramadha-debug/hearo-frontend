import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import HearoLogo from '../components/HearoLogo';

const INITIAL_QUIZ_HISTORY = [
  {
    id: 1,
    date: '10 Nov 2026',
    quizTitle: 'Objek dan Keterangan Tempat',
    level: 'Menengah',
    score: 85,
    passingScore: 75,
    status: 'Lulus',
    questionReview:
      'Susunan kalimat "Ibu membeli sayur di pasar" sudah tepat menempatkan Objek (sayur) dan Keterangan Tempat (di pasar).',
    teacherNote:
      'Ananda sudah sangat baik membedakan objek langsung dan keterangan tempat dalam struktur SPOK.',
  },
  {
    id: 2,
    date: '28 Okt 2026',
    quizTitle: 'Kata Kerja sebagai Predikat',
    level: 'Dasar',
    score: 0,
    passingScore: 70,
    status: 'Belum Lulus',
    questionReview:
      'Latihan belum diselesaikan karena sesi terputus sebelum soal dikirimkan.',
    teacherNote:
      'Mohon pendampingan orang tua di rumah untuk mengulang kuis dasar kata kerja sehari-hari (makan, minum, membaca).',
  },
];

export default function ParentDashboard({ user, onLogout }) {
  // Data Profil Orang Tua (default Aril Mulya sesuai desain UI)
  const [parentProfile, setParentProfile] = useState({
    fullName: user?.fullName || user?.name || 'Aril Mulya',
    email: user?.email || 'Mulyaaril23@gmail.com',
    phone: user?.phone || '083820397383',
    relation: user?.relation || 'Ayah',
    city: user?.city || 'Bandar Lampung',
    joinedDate: '12 Nov 2026',
  });

  // Data Anak / Siswa yang Terhubung
  const [linkedStudent, setLinkedStudent] = useState({
    isConnected: true,
    initials: 'FMV',
    name: user?.studentName || 'Fauz Mulya Vaifriel',
    nisn: '0102748391',
    kelas: 'Kelas 10-A',
    phone: '083890731710',
  });

  const initials =
    parentProfile.fullName
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || 'AM';

  // State Sidebar & Navigasi (2 menu sesuai desain Orang Tua)
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeNav, setActiveNav] = useState('riwayat'); // 'riwayat' | 'profil'

  // State Filter Riwayat Nilai Kuis
  const [levelFilter, setLevelFilter] = useState('Semua Level');
  const [selectedReviewModal, setSelectedReviewModal] = useState(null);

  // State Form Profil & Ganti Password
  const [profileForm, setProfileForm] = useState({ ...parentProfile });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  // State Modal Hubungkan Ulang Siswa
  const [showLinkChildModal, setShowLinkChildModal] = useState(false);
  const [childNisnInput, setChildNisnInput] = useState('');
  const [childNameInput, setChildNameInput] = useState('');

  // Toast Notifikasi
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const navItems = [
    { id: 'riwayat', label: 'Riwayat Belajar', icon: 'lucide:file-edit' },
    { id: 'profil', label: 'Pengaturan & Profil', icon: 'lucide:settings' },
  ];

  // Filter tabel riwayat nilai kuis berdasarkan level
  const filteredQuizHistory = INITIAL_QUIZ_HISTORY.filter((item) =>
    levelFilter === 'Semua Level' ? true : item.level === levelFilter
  );

  // Simpan perubahan profil orang tua
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setParentProfile({ ...profileForm });
    showToast('Data diri orang tua berhasil diperbarui.');
  };

  // Simpan password baru
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (
      passwordForm.newPassword.length < 8 ||
      passwordForm.newPassword.length > 50
    ) {
      showToast('Password baru harus terdiri dari 8–50 karakter.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Konfirmasi password baru tidak sesuai.');
      return;
    }
    setPasswordForm({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    showToast('Password akun berhasil diubah.');
  };

  // Putuskan tautan siswa
  const handleDisconnectStudent = () => {
    setLinkedStudent((prev) => ({ ...prev, isConnected: false }));
    showToast(`Tautan pemantauan dengan ${linkedStudent.name} diputuskan.`);
  };

  // Hubungkan kembali siswa
  const handleConnectStudent = (e) => {
    e.preventDefault();
    if (!childNameInput.trim()) return;
    const childInitials = childNameInput
      .trim()
      .split(' ')
      .slice(0, 3)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('');

    setLinkedStudent({
      isConnected: true,
      initials: childInitials || 'SW',
      name: childNameInput.trim(),
      nisn: childNisnInput.trim() || '0102748391',
      kelas: 'Kelas 10-A',
      phone: '083890731710',
    });
    setChildNameInput('');
    setChildNisnInput('');
    setShowLinkChildModal(false);
    showToast('Akun siswa berhasil dihubungkan kembali.');
  };

  return (
    <div className="min-h-screen bg-[#EEF4FF] text-[#102A43] flex font-['Montserrat',sans-serif] antialiased">
      {/* ====================================================================
          SIDEBAR BIRU KIRI (#007EDA)
         ==================================================================== */}
      <aside
        className={`bg-[#007EDA] text-white flex flex-col justify-between shrink-0 transition-all duration-200 sticky top-0 h-screen z-30 ${
          sidebarExpanded ? 'w-64 px-4' : 'w-[72px] items-center px-2'
        } py-5`}
      >
        {/* Bagian Atas: Logo & 2 Menu Utama */}
        <div className="space-y-6 w-full">
          <div
            className={`flex items-center ${
              sidebarExpanded ? 'px-2 justify-start' : 'justify-center'
            }`}
          >
            {sidebarExpanded ? (
              <HearoLogo variant="transparent" className="h-9" />
            ) : (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                <HearoLogo variant="icon" className="h-9 w-9" />
              </div>
            )}
          </div>

          <nav className="space-y-2 w-full">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  title={item.label}
                  className={`w-full flex items-center ${
                    sidebarExpanded
                      ? 'px-4 py-3 gap-3.5 justify-start'
                      : 'w-11 h-11 mx-auto justify-center'
                  } rounded-xl transition cursor-pointer ${
                    isActive
                      ? 'bg-[#FCD34D] text-[#102A43] font-bold shadow-xs'
                      : 'text-white/95 hover:bg-white/15 font-medium'
                  }`}
                >
                  <Icon icon={item.icon} className="w-5 h-5 shrink-0" />
                  {sidebarExpanded && (
                    <span className="text-xs truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bagian Bawah: Keluar & Tutup/Perluas Menu */}
        <div className="space-y-3 w-full pt-4 border-t border-white/15">
          <button
            type="button"
            onClick={() => onLogout?.()}
            title="Keluar"
            className={`w-full flex items-center ${
              sidebarExpanded
                ? 'px-4 py-2.5 gap-3.5 justify-start'
                : 'w-11 h-11 mx-auto justify-center'
            } rounded-xl text-white/95 hover:bg-white/15 transition cursor-pointer`}
          >
            <Icon icon="lucide:log-out" className="w-5 h-5 shrink-0" />
            {sidebarExpanded && (
              <span className="text-xs font-semibold">Keluar</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            title={sidebarExpanded ? 'Tutup Menu' : 'Perluas Menu'}
            className={`w-full flex items-center ${
              sidebarExpanded
                ? 'px-4 py-2.5 justify-between bg-white/15 hover:bg-white/20'
                : 'w-11 h-10 mx-auto justify-center bg-white/10 hover:bg-white/20'
            } rounded-xl text-white transition cursor-pointer`}
          >
            {sidebarExpanded ? (
              <>
                <span className="inline-flex items-center gap-2 text-xs font-bold">
                  <Icon icon="lucide:chevrons-left" className="w-4 h-4" />
                  <span>Tutup Menu</span>
                </span>
                <Icon
                  icon="lucide:chevrons-left"
                  className="w-4 h-4 opacity-75"
                />
              </>
            ) : (
              <Icon icon="lucide:chevrons-right" className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>

      {/* ====================================================================
          AREA KONTEN UTAMA KANAN
         ==================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 max-w-6xl w-full mx-auto px-5 md:px-10 py-8 space-y-6">
          {/* Toast Notifikasi */}
          {toastMessage && (
            <div className="bg-[#0F233C] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon
                  icon="lucide:check-circle-2"
                  className="w-4 h-4 text-[#FCD34D]"
                />
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage('')}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================================================================
              TAB 1: RIWAYAT BELAJAR ANAK
             ================================================================ */}
          {activeNav === 'riwayat' && (
            <div className="space-y-6">
              {/* Header Halaman */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-[28px] font-extrabold text-[#102A43] leading-tight">
                    Riwayat Belajar
                  </h1>
                  <p className="text-xs md:text-sm text-slate-500 mt-1">
                    nilai, dan persentase penguasaan dari kuis yang sudah
                    dikerjakan{' '}
                    {linkedStudent.isConnected ? (
                      <strong className="text-[#007EDA]">
                        {linkedStudent.name}
                      </strong>
                    ) : (
                      'anak'
                    )}
                    .
                  </p>
                </div>

                {/* Indikator Siswa Dipantau */}
                {linkedStudent.isConnected && (
                  <button
                    type="button"
                    onClick={() => setActiveNav('profil')}
                    className="bg-white border border-slate-200/80 rounded-full px-3.5 py-1.5 inline-flex items-center gap-2.5 shadow-2xs hover:border-[#007EDA] transition cursor-pointer"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#007EDA] text-white text-[10px] font-extrabold flex items-center justify-center">
                      {linkedStudent.initials}
                    </span>
                    <span className="text-xs font-bold text-[#102A43]">
                      {linkedStudent.name}
                    </span>
                    <span className="bg-[#EEF4FF] text-[#007EDA] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {linkedStudent.kelas}
                    </span>
                  </button>
                )}
              </div>

              {/* 2 Kartu Ringkasan Tengah (Rata-rata Nilai & Persentase Penguasaan) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
                {/* Kartu 1: Rata-rata Nilai */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      Rata-rata Nilai
                    </span>
                    <Icon
                      icon="lucide:bar-chart-2"
                      className="w-4 h-4 text-[#007EDA]"
                    />
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#102A43]">
                      42,5
                    </span>
                    <span className="text-sm font-semibold text-slate-400">
                      / 100
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Kuis lulus 1 dari 2 • 2 pengerjaan
                  </p>
                </div>

                {/* Kartu 2: Persentase Penguasaan (Donut 50%) */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex items-center gap-5">
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.8"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#007EDA]"
                        strokeDasharray="50, 100"
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-xs font-extrabold text-[#102A43]">
                      50%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-xs font-extrabold text-[#102A43]">
                      Persentase Penguasaan
                    </h2>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Kuis yang pernah lulus dibanding seluruh kuis.
                    </p>
                  </div>
                </div>
              </div>

              {/* Kartu Grafik Progres Nilai */}
              <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-7 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] text-[#007EDA] flex items-center justify-center shrink-0">
                    <Icon icon="lucide:trending-up" className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-[#102A43]">
                      Grafik Progres Nilai
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Garis merah putus-putus = rata-rata skor lulus
                    </p>
                  </div>
                </div>

                {/* SVG Area Chart Quis 1 (85) -> Quis 2 (0) */}
                <div className="pt-2 overflow-x-auto">
                  <div className="min-w-[540px]">
                    <svg viewBox="0 0 680 245" className="w-full h-60">
                      <defs>
                        <linearGradient
                          id="parentScoreArea"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#007EDA"
                            stopOpacity="0.55"
                          />
                          <stop
                            offset="100%"
                            stopColor="#007EDA"
                            stopOpacity="0.02"
                          />
                        </linearGradient>
                      </defs>

                      {/* Garis Grid Horizontal */}
                      <line
                        x1="75"
                        y1="30"
                        x2="635"
                        y2="30"
                        stroke="#F1F5F9"
                        strokeWidth="1"
                      />
                      <line
                        x1="75"
                        y1="66"
                        x2="635"
                        y2="66"
                        stroke="#F1F5F9"
                        strokeWidth="1"
                      />
                      <line
                        x1="75"
                        y1="102"
                        x2="635"
                        y2="102"
                        stroke="#F1F5F9"
                        strokeWidth="1"
                      />
                      <line
                        x1="75"
                        y1="138"
                        x2="635"
                        y2="138"
                        stroke="#F1F5F9"
                        strokeWidth="1"
                      />
                      <line
                        x1="75"
                        y1="174"
                        x2="635"
                        y2="174"
                        stroke="#F1F5F9"
                        strokeWidth="1"
                      />

                      {/* Label Sumbu Y */}
                      <text x="42" y="34" fontSize="11" fill="#94A3B8">
                        100
                      </text>
                      <text x="48" y="70" fontSize="11" fill="#94A3B8">
                        80
                      </text>
                      <text x="48" y="106" fontSize="11" fill="#94A3B8">
                        60
                      </text>
                      <text x="48" y="142" fontSize="11" fill="#94A3B8">
                        40
                      </text>
                      <text x="48" y="178" fontSize="11" fill="#94A3B8">
                        20
                      </text>

                      {/* Area Fill Biru */}
                      <path
                        d="M 75 48 L 635 202 L 635 202 L 75 202 Z"
                        fill="url(#parentScoreArea)"
                      />

                      {/* Garis Merah Putus-putus Skor Lulus (71) */}
                      <line
                        x1="75"
                        y1="82"
                        x2="635"
                        y2="82"
                        stroke="#EF4444"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                      <text
                        x="72"
                        y="96"
                        fontSize="10"
                        fontWeight="700"
                        fill="#475569"
                      >
                        Skor lulus (71)
                      </text>

                      {/* Garis Kurva Biru Utama */}
                      <line
                        x1="75"
                        y1="48"
                        x2="635"
                        y2="202"
                        stroke="#007EDA"
                        strokeWidth="3"
                      />

                      {/* Titik Quis 1 (Skor 85) */}
                      <circle
                        cx="75"
                        cy="48"
                        r="4.5"
                        fill="#007EDA"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                      <text
                        x="76"
                        y="39"
                        fontSize="10"
                        fontWeight="700"
                        fill="#102A43"
                      >
                        85
                      </text>

                      {/* Titik Quis 2 (Skor 0) */}
                      <circle
                        cx="635"
                        cy="202"
                        r="4.5"
                        fill="#FFFFFF"
                        stroke="#EF4444"
                        strokeWidth="2.5"
                      />
                      <text
                        x="633"
                        y="191"
                        fontSize="10"
                        fontWeight="700"
                        fill="#102A43"
                      >
                        0
                      </text>

                      {/* Label Sumbu X */}
                      <text x="72" y="228" fontSize="11" fill="#64748B">
                        Quis 1
                      </text>
                      <text x="615" y="228" fontSize="11" fill="#64748B">
                        Quis 2
                      </text>
                    </svg>
                  </div>
                </div>
              </section>

              {/* Kartu Tabel Riwayat Nilai Kuis */}
              <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#EEF4FF] text-[#007EDA] flex items-center justify-center">
                      <Icon icon="lucide:align-left" className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-extrabold text-[#102A43]">
                      Riwayat Nilai Kuis
                    </h2>
                  </div>

                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-[#102A43] focus:outline-none focus:border-[#007EDA] cursor-pointer"
                  >
                    <option>Semua Level</option>
                    <option>Dasar</option>
                    <option>Menengah</option>
                    <option>Mahir</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[740px]">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-y border-slate-200/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        <th className="py-3.5 px-6">TANGGAL</th>
                        <th className="py-3.5 px-4">KUIS</th>
                        <th className="py-3.5 px-4 text-center">LEVEL</th>
                        <th className="py-3.5 px-4 text-center">SKOR</th>
                        <th className="py-3.5 px-4 text-center">SKOR LULUS</th>
                        <th className="py-3.5 px-4 text-center">STATUS</th>
                        <th className="py-3.5 px-6 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80 text-xs">
                      {filteredQuizHistory.map((row) => {
                        const isPassed = row.status === 'Lulus';
                        return (
                          <tr
                            key={row.id}
                            className="hover:bg-[#F8FAFC] transition"
                          >
                            <td className="py-4 px-6 text-slate-500 font-medium">
                              {row.date}
                            </td>

                            <td className="py-4 px-4 font-extrabold text-[#102A43]">
                              {row.quizTitle}
                            </td>

                            <td className="py-4 px-4 text-center">
                              {row.level === 'Menengah' ? (
                                <span className="inline-flex items-center gap-1.5 bg-[#FEF9C3] text-amber-700 text-[11px] font-bold px-3 py-1 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                  <span>{row.level}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 bg-[#EEF4FF] text-[#007EDA] text-[11px] font-bold px-3 py-1 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#007EDA]"></span>
                                  <span>{row.level}</span>
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-4 text-center font-extrabold text-[#007EDA]">
                              {row.score}
                            </td>

                            <td className="py-4 px-4 text-center text-slate-500 font-semibold">
                              {row.passingScore}
                            </td>

                            <td className="py-4 px-4 text-center">
                              {isPassed ? (
                                <span className="inline-flex items-center gap-1 bg-[#EEF4FF] text-[#007EDA] text-[11px] font-bold px-3 py-1 rounded-full">
                                  <Icon
                                    icon="lucide:check"
                                    className="w-3 h-3"
                                  />
                                  <span>Lulus</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 text-[11px] font-bold px-3 py-1 rounded-full">
                                  <Icon
                                    icon="lucide:x-circle"
                                    className="w-3 h-3"
                                  />
                                  <span>Belum Lulus</span>
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-6 text-right">
                              <button
                                type="button"
                                onClick={() => setSelectedReviewModal(row)}
                                className="text-xs font-bold text-[#007EDA] hover:underline cursor-pointer"
                              >
                                Pembahasan
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* ================================================================
              TAB 2: PENGATURAN & PROFIL ORANG TUA
             ================================================================ */}
          {activeNav === 'profil' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-[28px] font-extrabold text-[#102A43] leading-tight">
                  Profil Saya
                </h1>
                <p className="text-xs md:text-sm text-slate-500 mt-1">
                  Perbarui data diri, informasi pendampingan anak, dan ganti
                  password akunmu.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Kartu Kiri: Ringkasan Akun Orang Tua */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-7 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-[#007EDA] border-4 border-[#FCD34D] text-white text-2xl font-extrabold flex items-center justify-center shadow-sm">
                    {initials}
                  </div>

                  <h2 className="text-base font-extrabold text-[#102A43] mt-4">
                    {parentProfile.fullName}
                  </h2>

                  <span className="mt-1.5 inline-flex items-center gap-1.5 bg-[#FCD34D] text-[#102A43] text-[10px] font-extrabold px-3.5 py-1 rounded-full tracking-wide">
                    <span>Orang Tua</span>
                  </span>

                  <div className="w-full border-t border-slate-200/80 mt-6 pt-5 space-y-3 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-400 font-medium">
                        Status Wali
                      </span>
                      <span className="font-extrabold text-[#102A43]">
                        {parentProfile.relation}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-400 font-medium">
                        Domisili
                      </span>
                      <span className="font-extrabold text-[#102A43]">
                        {parentProfile.city}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-400 font-medium">
                        Bergabung
                      </span>
                      <span className="font-extrabold text-[#102A43]">
                        {parentProfile.joinedDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: 3 Kartu (Siswa Terhubung, Data Diri, Ganti Password) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Kartu 1: Siswa / Anak Terhubung */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] text-[#007EDA] flex items-center justify-center shrink-0">
                        <Icon icon="lucide:users" className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-[#102A43]">
                          Siswa Terhubung
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Akun anak yang dipantau perkembangan belajar dan nilai
                          kuisnya
                        </p>
                      </div>
                    </div>

                    {linkedStudent.isConnected ? (
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-full bg-[#007EDA] border-2 border-[#FCD34D] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                            {linkedStudent.initials}
                          </div>
                          <div>
                            <div className="text-xs md:text-sm font-extrabold text-[#102A43]">
                              {linkedStudent.name}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {linkedStudent.kelas} • NISN:{' '}
                              {linkedStudent.nisn} • {linkedStudent.phone}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleDisconnectStudent}
                          className="border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-[#007EDA] hover:text-rose-600 text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Icon icon="lucide:link-2-off" className="w-3.5 h-3.5" />
                          <span>Putuskan</span>
                        </button>
                      </div>
                    ) : (
                      <div className="bg-[#F8FAFC] border border-dashed border-slate-300 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs text-slate-500 font-medium">
                          Belum ada akun siswa yang terhubung.
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowLinkChildModal(true)}
                          className="bg-[#007EDA] hover:bg-[#0068B8] text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Icon icon="lucide:user-plus" className="w-3.5 h-3.5" />
                          <span>Hubungkan Siswa</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Kartu 2: Data Diri Orang Tua */}
                  <form
                    onSubmit={handleSaveProfile}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-7 space-y-5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] text-[#007EDA] flex items-center justify-center">
                        <Icon icon="lucide:id-card" className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-extrabold text-[#102A43]">
                        Data Diri
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#102A43] mb-1.5">
                          Nama Lengkap <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Icon
                            icon="lucide:user"
                            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                          />
                          <input
                            type="text"
                            required
                            value={profileForm.fullName}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                fullName: e.target.value,
                              })
                            }
                            className="w-full bg-white border border-slate-200 focus:border-[#007EDA] rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-[#102A43] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#102A43] mb-1.5">
                          Email <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Icon
                            icon="lucide:mail"
                            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                          />
                          <input
                            type="email"
                            required
                            value={profileForm.email}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                email: e.target.value,
                              })
                            }
                            className="w-full bg-white border border-slate-200 focus:border-[#007EDA] rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-[#102A43] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#102A43] mb-1.5">
                          No. Telepon <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Icon
                            icon="lucide:phone"
                            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                          />
                          <input
                            type="tel"
                            required
                            value={profileForm.phone}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                phone: e.target.value,
                              })
                            }
                            className="w-full bg-white border border-slate-200 focus:border-[#007EDA] rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-[#102A43] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#102A43] mb-1.5">
                          Hubungan dengan Siswa{' '}
                          <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Icon
                            icon="lucide:heart-handshake"
                            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                          />
                          <select
                            value={profileForm.relation}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                relation: e.target.value,
                              })
                            }
                            className="w-full bg-white border border-slate-200 focus:border-[#007EDA] rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-[#102A43] focus:outline-none cursor-pointer"
                          >
                            <option value="Ayah">Ayah</option>
                            <option value="Ibu">Ibu</option>
                            <option value="Wali Murid">Wali Murid</option>
                          </select>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-[#102A43] mb-1.5">
                          Kota / Domisili
                        </label>
                        <div className="relative">
                          <Icon
                            icon="lucide:map-pin"
                            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                          />
                          <input
                            type="text"
                            value={profileForm.city}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                city: e.target.value,
                              })
                            }
                            placeholder="Contoh: Bandar Lampung"
                            className="w-full bg-white border border-slate-200 focus:border-[#007EDA] rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-[#102A43] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="bg-[#007EDA] hover:bg-[#0068B8] text-white text-xs font-bold px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-xs transition cursor-pointer"
                      >
                        <Icon icon="lucide:save" className="w-4 h-4" />
                        <span>Simpan Perubahan</span>
                      </button>
                    </div>
                  </form>

                  {/* Kartu 3: Ganti Password */}
                  <form
                    onSubmit={handleChangePassword}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-7 space-y-5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] text-[#007EDA] flex items-center justify-center">
                        <Icon icon="lucide:lock" className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-extrabold text-[#102A43]">
                        Ganti Password
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#102A43] mb-1.5">
                          Password Lama <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Icon
                            icon="lucide:lock"
                            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                          />
                          <input
                            type={showPass.old ? 'text' : 'password'}
                            required
                            value={passwordForm.oldPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                oldPassword: e.target.value,
                              })
                            }
                            className="w-full bg-white border border-slate-200 focus:border-[#007EDA] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#102A43] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPass({ ...showPass, old: !showPass.old })
                            }
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <Icon
                              icon={
                                showPass.old ? 'lucide:eye-off' : 'lucide:eye'
                              }
                              className="w-4 h-4"
                            />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#102A43] mb-1.5">
                            Password Baru{' '}
                            <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Icon
                              icon="lucide:lock"
                              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                            />
                            <input
                              type={showPass.new ? 'text' : 'password'}
                              required
                              value={passwordForm.newPassword}
                              onChange={(e) =>
                                setPasswordForm({
                                  ...passwordForm,
                                  newPassword: e.target.value,
                                })
                              }
                              className="w-full bg-white border border-slate-200 focus:border-[#007EDA] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#102A43] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPass({
                                  ...showPass,
                                  new: !showPass.new,
                                })
                              }
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              <Icon
                                icon={
                                  showPass.new ? 'lucide:eye-off' : 'lucide:eye'
                                }
                                className="w-4 h-4"
                              />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#102A43] mb-1.5">
                            Konfirmasi Password Baru{' '}
                            <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Icon
                              icon="lucide:lock"
                              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                            />
                            <input
                              type={showPass.confirm ? 'text' : 'password'}
                              required
                              value={passwordForm.confirmPassword}
                              onChange={(e) =>
                                setPasswordForm({
                                  ...passwordForm,
                                  confirmPassword: e.target.value,
                                })
                              }
                              className="w-full bg-white border border-slate-200 focus:border-[#007EDA] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#102A43] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPass({
                                  ...showPass,
                                  confirm: !showPass.confirm,
                                })
                              }
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              <Icon
                                icon={
                                  showPass.confirm
                                    ? 'lucide:eye-off'
                                    : 'lucide:eye'
                                }
                                className="w-4 h-4"
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400">
                        8-50 karakter.
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="border border-[#007EDA] text-[#007EDA] hover:bg-[#EEF4FF] text-xs font-bold px-5 py-2.5 rounded-xl inline-flex items-center gap-2 transition cursor-pointer"
                      >
                        <Icon icon="lucide:refresh-cw" className="w-3.5 h-3.5" />
                        <span>Ganti Password</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ====================================================================
          MODAL 1: PEMBAHASAN KUIS & CATATAN GURU
         ==================================================================== */}
      {selectedReviewModal && (
        <div className="fixed inset-0 z-50 bg-[#0F233C]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#007EDA]">
                  PEMBAHASAN HASIL KUIS ANAK
                </span>
                <h3 className="text-base font-extrabold text-[#102A43] mt-0.5">
                  {selectedReviewModal.quizTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedReviewModal.date} • Level{' '}
                  <strong>{selectedReviewModal.level}</strong> • Skor:{' '}
                  <strong className="text-[#007EDA]">
                    {selectedReviewModal.score}
                  </strong>{' '}
                  (KKM {selectedReviewModal.passingScore})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReviewModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-4 space-y-2 text-xs">
              <div className="font-extrabold text-[#102A43]">
                Evaluasi Pengerjaan:
              </div>
              <p className="text-slate-600 leading-relaxed">
                {selectedReviewModal.questionReview}
              </p>
            </div>

            <div className="bg-[#EEF4FF] border border-sky-200 rounded-xl p-4 space-y-1.5 text-xs">
              <div className="font-extrabold text-[#007EDA] inline-flex items-center gap-1.5">
                <Icon icon="lucide:message-square-text" className="w-3.5 h-3.5" />
                <span>Catatan Guru untuk Orang Tua:</span>
              </div>
              <p className="text-[#102A43] leading-relaxed">
                {selectedReviewModal.teacherNote}
              </p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setSelectedReviewModal(null)}
                className="bg-[#007EDA] hover:bg-[#0068B8] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: HUBUNGKAN ULANG AKUN SISWA
         ==================================================================== */}
      {showLinkChildModal && (
        <div className="fixed inset-0 z-50 bg-[#0F233C]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#102A43]">
                Hubungkan Akun Siswa
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkChildModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConnectStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#102A43] mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  value={childNameInput}
                  onChange={(e) => setChildNameInput(e.target.value)}
                  placeholder="Contoh: Fauz Mulya Vaifriel"
                  className="w-full bg-[#F4F7FB] border border-slate-200 focus:border-[#007EDA] rounded-xl px-3.5 py-2.5 text-xs text-[#102A43] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102A43] mb-1">
                  NISN Siswa
                </label>
                <input
                  type="text"
                  value={childNisnInput}
                  onChange={(e) => setChildNisnInput(e.target.value)}
                  placeholder="Masukkan NISN siswa"
                  className="w-full bg-[#F4F7FB] border border-slate-200 focus:border-[#007EDA] rounded-xl px-3.5 py-2.5 text-xs text-[#102A43] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkChildModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#007EDA] hover:bg-[#0068B8] text-white cursor-pointer"
                >
                  Hubungkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}