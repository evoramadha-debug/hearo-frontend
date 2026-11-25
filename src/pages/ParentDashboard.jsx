import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import HearoLogo from '../components/HearoLogo';
import { apiRequest } from '../services/api';
import { adaptLearningHistory } from '../services/adapters';

export default function ParentDashboard({ user, onLogout }) {
  const [apiError, setApiError] = useState('');
  const [quizHistory, setQuizHistory] = useState([]);
  const [childRequests, setChildRequests] = useState([]);

  // Data profil awal berasal dari akun yang berhasil masuk.
  const [parentProfile, setParentProfile] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    relation: user?.relation || 'Orang Tua',
    joinedDate: user?.created_at
      ? new Date(user.created_at).toLocaleDateString('id-ID')
      : '',
  });

  // Data Anak / Siswa yang Terhubung
  const [linkedStudent, setLinkedStudent] = useState({
    isConnected: false,
    status: '',
    initials: '',
    name: '',
    nisn: '',
    kelas: '',
    phone: '',
  });

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest('/orang-tua/profil'),
      apiRequest('/orang-tua/anak'),
      apiRequest('/orang-tua/anak/riwayat'),
    ])
      .then(([profileResponse, childrenResponse, historyResponse]) => {
        if (!active) return;
        const profile = profileResponse.data || profileResponse;
        setParentProfile((current) => ({
          ...current,
          fullName: profile.nama || current.fullName,
          email: profile.email || current.email,
          phone: profile.no_telepon || '',
          joinedDate: profile.created_at
            ? new Date(profile.created_at).toLocaleDateString('id-ID')
            : '',
        }));
        setProfileForm((current) => ({
          ...current,
          fullName: profile.nama || current.fullName,
          email: profile.email || current.email,
          phone: profile.no_telepon || '',
        }));
        const requests = childrenResponse.data || [];
        setChildRequests(requests);
        const linkedChild = requests.find((child) => child.status === 'approved');
        const displayedChild = linkedChild || requests.find((child) => child.status === 'pending');
        if (displayedChild) {
          setLinkedStudent({
            isConnected: displayedChild.status === 'approved',
            status: displayedChild.status,
            initials: (displayedChild.nama_anak || 'Siswa')
              .split(' ')
              .slice(0, 3)
              .map((part) => part[0]?.toUpperCase() || '')
              .join(''),
            name: displayedChild.nama_anak || '',
            nisn: displayedChild.nisn || '',
            kelas: displayedChild.kelas || '',
            phone: '',
          });
        }
        setQuizHistory((historyResponse.data || []).map((item) => ({
          ...adaptLearningHistory(item),
          questionReview: '',
          teacherNote: '',
        })));
      })
      .catch((error) => {
        if (active) setApiError(`Gagal memuat data orang tua: ${error.message}`);
      });

    return () => {
      active = false;
    };
  }, []);

  const initials =
    parentProfile.fullName
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || 'AM';

  // State Sidebar & Navigasi (2 menu sesuai desain Orang Tua)
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isSidebarExpanded = sidebarExpanded || isMobileMenuOpen;
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
  const filteredQuizHistory = quizHistory.filter((item) =>
    levelFilter === 'Semua Level' ? true : item.level === levelFilter
  );
  const averageScore = quizHistory.length
    ? Math.round(quizHistory.reduce((total, item) => total + item.score, 0) / quizHistory.length)
    : 0;
  const passedQuizCount = quizHistory.filter((item) => item.passed).length;
  const masteryPercent = quizHistory.length
    ? Math.round((passedQuizCount / quizHistory.length) * 100)
    : 0;

  // Simpan perubahan profil orang tua
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await apiRequest('/profil', {
        method: 'PUT',
        body: {
          nama: profileForm.fullName.trim(),
          email: profileForm.email.trim(),
          no_telepon: profileForm.phone.trim(),
        },
      });
      setParentProfile((current) => ({
        ...current,
        fullName: response.data.nama,
        email: response.data.email,
        phone: response.data.no_telepon,
      }));
      showToast('Data diri orang tua berhasil diperbarui.');
    } catch (error) {
      setApiError(`Profil gagal diperbarui: ${error.message}`);
    }
  };

  // Simpan password baru
  const handleChangePassword = async (e) => {
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
    try {
      await apiRequest('/password', {
        method: 'PUT',
        body: {
          current_password: passwordForm.oldPassword,
          new_password: passwordForm.newPassword,
        },
      });
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      showToast('Password akun berhasil diubah.');
    } catch (error) {
      setApiError(`Password gagal diubah: ${error.message}`);
    }
  };

  // Ajukan permintaan penghubungan siswa
  const handleConnectStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await apiRequest('/orang-tua/anak', {
        method: 'POST',
        body: {
          nisn_siswa: childNisnInput.trim(),
          nama_siswa: childNameInput.trim(),
        },
      });
      const newRequest = response.data;
      const nextRequest = {
        id_link_request: newRequest.id_link_request,
        status: newRequest.status,
        nama_anak: newRequest.nama_anak,
        nisn: newRequest.nisn,
      };
      setChildRequests((current) => [nextRequest, ...current]);
      if (!linkedStudent.isConnected) {
        setLinkedStudent({
          isConnected: false,
          status: 'pending',
          initials: childNameInput.trim().split(' ').map((part) => part[0]?.toUpperCase() || '').join(''),
          name: newRequest.nama_anak,
          nisn: newRequest.nisn,
          kelas: '',
          phone: '',
        });
      }
      setChildNameInput('');
      setChildNisnInput('');
      setShowLinkChildModal(false);
      showToast(response.message);
    } catch (error) {
      setApiError(`Permintaan tautan gagal dikirim: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen min-w-0 bg-[#EEF4FF] text-[#102A43] flex font-['Montserrat',sans-serif] antialiased">
      {/* ====================================================================
          SIDEBAR BIRU KIRI (#007EDA)
         ==================================================================== */}
      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 md:hidden"
        />
      )}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-40 bg-[#007EDA] text-white flex flex-col justify-between shrink-0 transition-all duration-200 ${
          isSidebarExpanded ? 'w-64 px-4' : 'w-[72px] items-center px-2'
        } py-5 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Bagian Atas: Logo & 2 Menu Utama */}
        <div className="space-y-6 w-full">
          <div
            className={`flex items-center ${
              isSidebarExpanded ? 'px-2 justify-start' : 'justify-center'
            }`}
          >
            {isSidebarExpanded ? (
              <button
                type="button"
                onClick={() => {
                  setActiveNav('riwayat');
                  setIsMobileMenuOpen(false);
                }}
                aria-label="Kembali ke Beranda"
                title="Kembali ke Beranda"
                className="cursor-pointer bg-transparent border-0 p-0"
              >
                <HearoLogo variant="transparent" className="h-9" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setActiveNav('riwayat');
                  setIsMobileMenuOpen(false);
                }}
                aria-label="Kembali ke Beranda"
                title="Kembali ke Beranda"
                className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer"
              >
                <HearoLogo variant="icon" className="h-9 w-9" />
              </button>
            )}
          </div>

          <nav className="space-y-2 w-full">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveNav(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  title={item.label}
                  className={`w-full flex items-center ${
                    isSidebarExpanded
                      ? 'px-4 py-3 gap-3.5 justify-start'
                      : 'w-11 h-11 mx-auto justify-center'
                  } rounded-xl transition cursor-pointer ${
                    isActive
                      ? 'bg-[#FCD34D] text-[#102A43] font-bold shadow-xs'
                      : 'text-white/95 hover:bg-white/15 font-medium'
                  }`}
                >
                  <Icon icon={item.icon} className="w-5 h-5 shrink-0" />
                  {isSidebarExpanded && (
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
              isSidebarExpanded
                ? 'px-4 py-2.5 gap-3.5 justify-start'
                : 'w-11 h-11 mx-auto justify-center'
            } rounded-xl text-white/95 hover:bg-white/15 transition cursor-pointer`}
          >
            <Icon icon="lucide:log-out" className="w-5 h-5 shrink-0" />
            {isSidebarExpanded && (
              <span className="text-xs font-semibold">Keluar</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              if (isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
              } else {
                setSidebarExpanded(!sidebarExpanded);
              }
            }}
            title={isSidebarExpanded ? 'Tutup Menu' : 'Perluas Menu'}
            className={`w-full flex items-center ${
              isSidebarExpanded
                ? 'px-4 py-2.5 justify-between bg-white/15 hover:bg-white/20'
                : 'w-11 h-10 mx-auto justify-center bg-white/10 hover:bg-white/20'
            } rounded-xl text-white transition cursor-pointer`}
          >
            {isSidebarExpanded ? (
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
        <header className="md:hidden sticky top-0 z-20 bg-white border-b border-slate-200/80 px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Buka menu"
            aria-expanded={isMobileMenuOpen}
            className="shrink-0 w-9 h-9 rounded-lg border border-slate-200 text-[#102A43] flex items-center justify-center"
          >
            <Icon icon="lucide:menu" className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-extrabold text-[#102A43]">
            {navItems.find((item) => item.id === activeNav)?.label}
          </h1>
        </header>
        <main className="max-w-6xl w-full mx-auto px-4 sm:px-5 md:px-10 py-5 sm:py-8 space-y-6">
          {apiError && (
            <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {apiError}
              <button type="button" className="ml-3 font-bold underline" onClick={() => setApiError('')}>
                Tutup
              </button>
            </p>
          )}
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
                      {averageScore}
                    </span>
                    <span className="text-sm font-semibold text-slate-400">
                      / 100
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Kuis lulus {passedQuizCount} dari {quizHistory.length} • {quizHistory.length} pengerjaan
                  </p>
                </div>

                {/* Kartu 2: Persentase Penguasaan */}
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
                        strokeDasharray={`${masteryPercent}, 100`}
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-xs font-extrabold text-[#102A43]">
                      {masteryPercent}%
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
                      Nilai pengerjaan kuis terbaru yang tercatat
                    </p>
                  </div>
                </div>

                <div className="flex min-h-48 items-end gap-3 overflow-x-auto border-b border-slate-200 px-2 pb-2">
                  {quizHistory.length === 0 ? (
                    <p className="w-full self-center text-center text-xs text-slate-500">
                      Grafik akan tampil setelah siswa menyelesaikan kuis.
                    </p>
                  ) : (
                    quizHistory.slice(0, 7).reverse().map((attempt) => (
                      <div
                        key={attempt.id}
                        className="flex min-w-16 flex-1 flex-col items-center justify-end gap-2"
                      >
                        <span className="text-[11px] font-bold text-[#102A43]">
                          {attempt.score}
                        </span>
                        <div
                          className="w-full rounded-t-lg bg-[#007EDA]"
                          style={{ height: `${Math.max(4, attempt.score)}px`, maxHeight: '160px' }}
                          title={`${attempt.quizTitle}: ${attempt.score}/100`}
                        />
                        <span className="max-w-20 truncate text-[10px] text-slate-500">
                          {attempt.quizTitle}
                        </span>
                      </div>
                    ))
                  )}
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
                      {filteredQuizHistory.length === 0 && (
                        <tr>
                          <td colSpan="7" className="py-8 text-center text-sm text-slate-500">
                            Belum ada riwayat kuis untuk anak yang sudah disetujui guru.
                          </td>
                        </tr>
                      )}
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
                          onClick={() => setShowLinkChildModal(true)}
                          className="border border-slate-200 hover:border-[#007EDA] hover:bg-[#EEF4FF] text-[#007EDA] text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Icon icon="lucide:user-plus" className="w-3.5 h-3.5" />
                          <span>Hubungkan Siswa</span>
                        </button>
                      </div>
                    ) : (
                      <div className="bg-[#F8FAFC] border border-dashed border-slate-300 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs text-slate-500 font-medium">
                          {linkedStudent.status === 'pending'
                            ? `Permintaan untuk ${linkedStudent.name} menunggu persetujuan guru.`
                            : 'Belum ada akun siswa yang terhubung.'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowLinkChildModal(true)}
                          disabled={linkedStudent.status === 'pending'}
                          className="bg-[#007EDA] hover:bg-[#0068B8] text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Icon icon="lucide:user-plus" className="w-3.5 h-3.5" />
                          <span>{linkedStudent.status === 'pending' ? 'Menunggu Persetujuan' : 'Hubungkan Siswa'}</span>
                        </button>
                      </div>
                    )}
                    {childRequests.filter((request) => request.status === 'pending').length > 1 && (
                      <ul className="space-y-2 border-t border-slate-100 pt-3">
                        {childRequests
                          .filter((request) => request.status === 'pending')
                          .slice(1)
                          .map((request) => (
                            <li key={request.id_link_request} className="text-xs text-amber-700">
                              Permintaan untuk {request.nama_anak} menunggu persetujuan guru.
                            </li>
                          ))}
                      </ul>
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
                {selectedReviewModal.questionReview ||
                  'Backend saat ini menyimpan skor dan judul kuis, tetapi belum menyimpan rincian jawaban per soal.'}
              </p>
            </div>

            <div className="bg-[#EEF4FF] border border-sky-200 rounded-xl p-4 space-y-1.5 text-xs">
              <div className="font-extrabold text-[#007EDA] inline-flex items-center gap-1.5">
                <Icon icon="lucide:message-square-text" className="w-3.5 h-3.5" />
                <span>Catatan Guru untuk Orang Tua:</span>
              </div>
              <p className="text-[#102A43] leading-relaxed">
                {selectedReviewModal.teacherNote || 'Belum ada catatan guru untuk hasil ini.'}
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