import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import HearoLogo from '../components/HearoLogo';
import { apiRequest } from '../services/api';
import { adaptMaterial } from '../services/adapters';

// ============================================================================
// DATA AWAL (DUMMY STATE UNTUK SIMULASI INTERAKTIF FRONTEND)
// ============================================================================
const INITIAL_QUIZ_RESULTS = [
  {
    id: 1,
    initials: 'BS',
    avatarBg: 'bg-[#007EDA]',
    name: 'Budi Santoso',
    nisn: '00812983',
    kelas: '10-A',
    quizTitle: 'Pola SPOK Dasar',
    subTag: 'SIBI',
    level: 'A1',
    topic: 'Bahasa Indonesia',
    score: 95,
    status: 'LULUS',
    date: 'Hari ini, 14:20',
    note: 'Siswa mampu menyusun pola Subjek-Predikat-Objek-Keterangan dengan sangat baik.',
  },
  {
    id: 2,
    initials: 'SR',
    avatarBg: 'bg-[#007EDA]',
    name: 'Siti Rahma',
    nisn: '00812984',
    kelas: '10-A',
    quizTitle: 'Kosakata BISINDO Rumah',
    subTag: '',
    level: 'A1',
    topic: 'Kosakata Visual',
    score: 80,
    status: 'LULUS',
    date: 'Hari ini, 11:05',
    note: 'Pemahaman isyarat benda di lingkungan rumah sudah tepat dan konsisten.',
  },
  {
    id: 3,
    initials: 'AF',
    avatarBg: 'bg-[#DC2626]',
    name: 'Ahmad Fauzi',
    nisn: '00812988',
    kelas: '10-A',
    quizTitle: 'Objek vs Keterangan',
    subTag: '',
    level: 'B1',
    topic: 'Struktur Kompleks',
    score: 55,
    status: 'REMIDIAL',
    date: 'Hari ini, 09:30',
    note: '',
  },
  {
    id: 4,
    initials: 'DL',
    avatarBg: 'bg-[#475569]',
    name: 'Dewi Lestari',
    nisn: '00812991',
    kelas: '10-B',
    quizTitle: 'Kalimat Majemuk Setara',
    subTag: '',
    level: 'B1',
    topic: 'Konjungsi Koordinatif',
    score: 85,
    status: 'LULUS',
    date: 'Kemarin, 16:15',
    note: 'Penggunaan kata hubung "dan" serta "tetapi" dalam kalimat baku sudah sesuai.',
  },
  {
    id: 5,
    initials: 'RH',
    avatarBg: 'bg-[#DC2626]',
    name: 'Rian Hidayat',
    nisn: '00812995',
    kelas: '10-B',
    quizTitle: 'Konjungsi SIBI',
    subTag: '',
    level: 'A1',
    topic: 'Gerakan Isyarat Kata Hubung',
    score: 60,
    status: 'REMIDIAL',
    date: 'Kemarin, 13:40',
    note: '',
  },
];

const INITIAL_MATERIALS = [
  {
    id: 1,
    title: 'Pengenalan Abjad Jari A-Z & Angka',
    date: '14 Okt 2024',
    timestamp: 1,
    category: 'SIBI & BISINDO Dasar',
  },
  {
    id: 2,
    title: 'Kosakata Kata Kerja Sehari-hari (Makan, Minum, Tidur)',
    date: '18 Okt 2024',
    timestamp: 2,
    category: 'Kosakata Visual',
  },
  {
    id: 3,
    title: 'Penggunaan Kalimat Tanya',
    date: '22 Okt 2024',
    timestamp: 3,
    category: 'Struktur SPOK',
  },
];

const INITIAL_QUIZZES = [
  {
    id: 1,
    title: 'Objek dan keterangan tempat',
    material: 'Materi: Struktur Subjek & Predikat Sehari-hari',
    passingScore: 70,
  },
  {
    id: 2,
    title: 'Kata kerja sebagai predikat',
    material: 'Materi: Latihan Kalimat Tanya (5W1H Visual)',
    passingScore: 75,
  },
  {
    id: 3,
    title: 'Pola SPOK Dasar SIBI',
    material: 'Materi: Pengenalan Kalimat Baku Bahasa Indonesia',
    passingScore: 70,
  },
];

const INITIAL_CONNECTIONS = [
  {
    id: 1,
    initials: 'BP',
    name: 'Budi Pratama',
    nisn: '0084920194',
    kelas: 'Kelas 10-A',
    email: 'budi.pratama@gmail.com',
    parentName: 'Burhan',
    parentEmail: 'burhan.wali@gmail.com',
    status: 'PENDING', // 'PENDING' | 'CONNECTED' | 'UNLINKED'
  },
  {
    id: 2,
    initials: 'FMV',
    name: 'Fauz Mulya Vaifriel',
    nisn: '0102748391',
    kelas: 'Kelas 10-A',
    email: 'Fauzmulya22@gmail.com',
    parentName: 'Arilmulya',
    parentEmail: 'arilmulya.ortu@gmail.com',
    status: 'CONNECTED',
  },
  {
    id: 3,
    initials: 'DA',
    name: 'Dimas Arya',
    nisn: '0083719284',
    kelas: 'Kelas 10-A',
    email: 'dimas.a@gmail.com',
    parentName: '',
    parentEmail: '',
    status: 'UNLINKED',
  },
  {
    id: 4,
    initials: 'AZ',
    name: 'Annisa Zahra',
    nisn: '0089201938',
    kelas: 'Kelas 10-A',
    email: 'annisa.z@gmail.com',
    parentName: 'Hendra Gunawan',
    parentEmail: 'hendra.g@gmail.com',
    status: 'CONNECTED',
  },
];

const HISTORY_TABLE_DATA = [
  {
    id: 1,
    initials: 'BP',
    name: 'Fauz Mulya Vaifriel',
    nisn: '0102748391',
    kelas: '10-A',
    progress: 45,
    avgScore: 45,
    lastQuiz: 'kata kerja sebagai predikat',
  },
  {
    id: 2,
    initials: 'AR',
    name: 'Annisa Rahma',
    nisn: '0084920211',
    kelas: '10-A',
    progress: 92,
    avgScore: 92,
    lastQuiz: 'kata kerja sebagai Predikat',
  },
  {
    id: 3,
    initials: 'DA',
    name: 'Dimas Arya',
    nisn: '0083719284',
    kelas: '10-A',
    progress: 70,
    avgScore: 70,
    lastQuiz: 'Objek dan keterangan tempat',
  },
  {
    id: 4,
    initials: 'BS',
    name: 'Budi Santoso',
    nisn: '00812983',
    kelas: '10-A',
    progress: 99,
    avgScore: 99,
    lastQuiz: 'Pola SPOK Dasar',
  },
];

const CHART_DATA = [
  { kelas: '10-A', nilai: 86, barColor: 'bg-[#007EDA]' },
  { kelas: '11-A', nilai: 74, barColor: 'bg-[#004C8C]' },
  { kelas: '12-A', nilai: 71, barColor: 'bg-[#FCD34D]' },
];

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMBERS = '0123456789'.split('');

const mapTeacherMaterial = (material) => {
  const adapted = adaptMaterial(material);
  const timestamp = material.created_at ? new Date(material.created_at).getTime() : 0;
  return {
    ...adapted,
    category: 'Materi pembelajaran',
    date: adapted.publishedAt,
    timestamp: Number.isNaN(timestamp) ? 0 : timestamp,
  };
};

const mapTeacherQuiz = (quiz) => ({
  id: quiz.id_kuis,
  id_materi: quiz.id_materi,
  title: quiz.judul,
  material: `Materi: ${quiz.materi?.judul || 'Materi pembelajaran'}`,
  passingScore: quiz.skor_lulus,
});

const mapTeacherResult = (result) => {
  const score = Number(result.skor) || 0;
  const passScore = Number(result.kuis?.skor_lulus) || 0;
  const studentName = result.siswa?.nama || 'Siswa';
  return {
    id: result.id_riwayat || result.id,
    studentId: result.siswa?.id_siswa,
    initials: studentName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
    avatarBg: score >= passScore ? 'bg-[#007EDA]' : 'bg-[#DC2626]',
    name: studentName,
    nisn: result.siswa?.nisn || '',
    kelas: result.siswa?.kelas || '',
    quizTitle: result.kuis?.judul || 'Kuis',
    subTag: '',
    level: '',
    topic: '',
    score,
    status: score >= passScore ? 'LULUS' : 'REMIDIAL',
    date: result.tanggal_pengerjaan
      ? new Date(result.tanggal_pengerjaan).toLocaleString('id-ID')
      : '',
    note: '',
  };
};

const mapLinkRequest = (request) => ({
  id: request.id_link_request,
  initials: (request.siswa?.nama || 'Siswa').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
  name: request.siswa?.nama || '',
  nisn: request.siswa?.nisn || '',
  kelas: request.siswa?.kelas ? `Kelas ${request.siswa.kelas}` : '',
  email: '',
  parentName: request.orang_tua?.nama || '',
  parentEmail: request.orang_tua?.email || '',
  status: request.status === 'approved'
    ? 'CONNECTED'
    : request.status === 'pending'
      ? 'PENDING'
      : 'UNLINKED',
});

export default function TeacherDashboard({ user, onLogout }) {
  // State Profil Guru (dapat diperbarui langsung lewat menu Pengaturan & Profil)
  const [teacherProfile, setTeacherProfile] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    nip: user?.nip || '',
    phone: user?.phone || '',
    joinedDate: user?.created_at
      ? new Date(user.created_at).toLocaleDateString('id-ID')
      : '',
  });

  const firstName = teacherProfile.fullName
    .trim()
    .split(' ')[0]
    .toUpperCase();
  const initials =
    teacherProfile.fullName
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || 'DP';

  // State Sidebar & Navigasi
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isSidebarExpanded = sidebarExpanded || isMobileMenuOpen;
  const [activeNav, setActiveNav] = useState('beranda');

  // Toast Notifikasi Global
  const [toastMessage, setToastMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // State Beranda (Hearo Refine Studio & Tabel Hasil Kuis)
  const [signInput, setSignInput] = useState('');
  const [refinedResult, setRefinedResult] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('SEMUA');
  const [selectedSemester, setSelectedSemester] = useState(
    'Semester Ini (Semua Kelas)'
  );
  const [activeStudentModal, setActiveStudentModal] = useState(null);
  const [teacherNoteDraft, setTeacherNoteDraft] = useState('');

  // State Kamus Bahasa Isyarat
  const [signMode, setSignMode] = useState('SIBI'); // 'SIBI' | 'BISINDO'
  const [selectedChar, setSelectedChar] = useState(null);
  const [dictionaryEntries, setDictionaryEntries] = useState([]);

  // State Materi Belajar
  const [materials, setMaterials] = useState([]);
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialSort, setMaterialSort] = useState('terbaru');
  const [materialModal, setMaterialModal] = useState(null); // { mode: 'add' | 'edit', item?: object }
  const [materialForm, setMaterialForm] = useState({ title: '', description: '' });

  // State Arena Kuis
  const [quizzes, setQuizzes] = useState([]);
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [quizForm, setQuizForm] = useState({
    title: '',
    materialId: '',
    passingScore: 75,
    questionPrompt: '',
    correctSentence: '',
  });

  // State Hubungkan (Data Siswa & Orang Tua)
  const [connections, setConnections] = useState([]);
  const [classFilter, setClassFilter] = useState('Semua Kelas');
  const [linkStatusFilter, setLinkStatusFilter] = useState(
    'Semua Status Hubungan'
  );
  const [connectionSearch, setConnectionSearch] = useState('');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [connectModal, setConnectModal] = useState(null); // { mode: 'link' | 'edit' | 'detail', student: object }
  const [parentNameInput, setParentNameInput] = useState('');
  const [parentEmailInput, setParentEmailInput] = useState('');

  // State Pengaturan & Profil (Form Data Diri & Ganti Password)
  const [profileForm, setProfileForm] = useState({ ...teacherProfile });
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

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest('/materi'),
      apiRequest('/kuis'),
      apiRequest('/guru/link-requests'),
      apiRequest('/guru/riwayat-murid'),
      apiRequest('/kamus'),
    ])
      .then(([materialsResponse, quizzesResponse, linksResponse, historyResponse, dictionaryResponse]) => {
        if (!active) return;
        setMaterials((materialsResponse.data || []).map(mapTeacherMaterial));
        setQuizzes((quizzesResponse.data || []).map(mapTeacherQuiz));
        setConnections((linksResponse.data || []).map(mapLinkRequest));
        setQuizResults((historyResponse.data || []).map(mapTeacherResult));
        setDictionaryEntries(dictionaryResponse.data || []);
      })
      .catch((error) => {
        if (active) setApiError(`Gagal memuat data guru: ${error.message}`);
      });

    return () => {
      active = false;
    };
  }, []);

  // Daftar Menu Sidebar (persis sesuai desain expanded sidebar)
  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: 'lucide:home' },
    { id: 'kamus', label: 'Kamus', icon: 'lucide:book-open' },
    { id: 'materi', label: 'Materi', icon: 'lucide:book-marked' },
    { id: 'quiz', label: 'Quiz', icon: 'lucide:help-circle' },
    { id: 'riwayat', label: 'Riwayat Belajar', icon: 'lucide:file-edit' },
    { id: 'hubungkan', label: 'Hubungkan', icon: 'lucide:users' },
    { id: 'profil', label: 'Pengaturan & Profil', icon: 'lucide:settings' },
  ];

  // Judul & Subjudul Top Header dinamis per halaman
  const headerMeta = {
    beranda: {
      title: 'Beranda',
      subtitle: 'Selamat datang di ruang belajar interaktifmu',
    },
    kamus: {
      title: 'Kamus Bahasa Isyarat',
      subtitle:
        'Eksplorasi ribuan kosakata SIBI dan BISINDO dengan panduan visual...',
    },
    materi: {
      title: 'Materi Belajar',
      subtitle:
        'Eksplorasi modul pembelajaran bahasa isyarat BISINDO & struktur SPOK',
    },
    quiz: {
      title: 'Arena Kuis',
      subtitle: 'Buat kuis evaluasi untuk menguji pemahaman murid',
    },
    riwayat: {
      title: 'Riwayat Belajar',
      subtitle:
        'Level, nilai, dan persentase penguasaanmu dari kuis yang sudah dikerjakan.',
    },
    hubungkan: {
      title: 'Data Siswa & Orang Tua',
      subtitle:
        'Direktori Siswa Tuli & Hard-of-Hearing dan Sinkronisasi Akun Wali Murid',
    },
    profil: {
      title: 'Profil Saya',
      subtitle: 'Perbarui data diri, identitas pengajar, dan ganti password akunmu.',
    },
  };

  // ==========================================================================
  // HANDLERS BERANDA
  // ==========================================================================
  const handleRefineSentence = async () => {
    const raw = signInput.trim();
    if (!raw) {
      setApiError('Masukkan kalimat sebelum menjalankan Hearo Refine.');
      return;
    }
    try {
      const response = await apiRequest('/translate', {
        method: 'POST',
        body: { teks: raw },
      });
      setRefinedResult({
        input: response.data.teks_input,
        output: response.data.hasil_translate,
        pattern: 'Hasil simulasi dari layanan backend.',
      });
      setApiError('');
    } catch (error) {
      setApiError(`Hearo Refine gagal: ${error.message}`);
    }
  };

  const filteredResults = quizResults.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.quizTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nisn.includes(searchQuery);
    const matchStatus =
      statusFilter === 'SEMUA' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const cycleStatusFilter = () => {
    if (statusFilter === 'SEMUA') setStatusFilter('LULUS');
    else if (statusFilter === 'LULUS') setStatusFilter('REMIDIAL');
    else setStatusFilter('SEMUA');
  };

  const openStudentModal = (student) => {
    setActiveStudentModal(student);
    setTeacherNoteDraft(student.note || '');
  };

  const handleSaveTeacherNote = (e) => {
    e.preventDefault();
    if (!activeStudentModal) return;
    setQuizResults((prev) =>
      prev.map((row) =>
        row.id === activeStudentModal.id
          ? { ...row, note: teacherNoteDraft }
          : row
      )
    );
    setActiveStudentModal(null);
    showToast(`Catatan guru untuk ${activeStudentModal.name} berhasil disimpan.`);
  };

  // ==========================================================================
  // HANDLERS MATERI BELAJAR
  // ==========================================================================
  const filteredMaterials = materials
    .filter((m) =>
      m.title.toLowerCase().includes(materialSearch.toLowerCase())
    )
    .sort((a, b) =>
      materialSort === 'terbaru'
        ? b.timestamp - a.timestamp
        : a.timestamp - b.timestamp
    );

  const openAddMaterial = () => {
    setMaterialForm({ title: '', description: '' });
    setMaterialModal({ mode: 'add' });
  };

  const openEditMaterial = (item) => {
    setMaterialForm({ title: item.title, description: item.description });
    setMaterialModal({ mode: 'edit', item });
  };

  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    if (!materialForm.title.trim() || !materialForm.description.trim()) return;
    try {
      const isEditing = materialModal?.mode === 'edit' && materialModal.item;
      const response = await apiRequest(
        isEditing ? `/materi/${materialModal.item.id}` : '/materi',
        {
          method: isEditing ? 'PUT' : 'POST',
          body: {
            judul: materialForm.title.trim(),
            deskripsi: materialForm.description.trim(),
          },
        }
      );
      const savedMaterial = mapTeacherMaterial(response.data);
      setMaterials((current) =>
        isEditing
          ? current.map((item) => item.id === savedMaterial.id ? savedMaterial : item)
          : [savedMaterial, ...current]
      );
      showToast(isEditing ? 'Perubahan materi berhasil disimpan.' : 'Materi pembelajaran berhasil ditambahkan.');
      setMaterialModal(null);
    } catch (error) {
      setApiError(`Materi gagal disimpan: ${error.message}`);
    }
  };

  const handleDeleteMaterial = async (id, title) => {
    try {
      await apiRequest(`/materi/${id}`, { method: 'DELETE' });
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      setQuizzes((prev) => prev.filter((quiz) => quiz.id_materi !== id));
      showToast(`Materi "${title}" dihapus.`);
    } catch (error) {
      setApiError(`Materi gagal dihapus: ${error.message}`);
    }
  };

  // ==========================================================================
  // HANDLERS ARENA KUIS
  // ==========================================================================
  const handleAddQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.title.trim() || !quizForm.materialId) {
      setApiError('Pilih materi untuk kuis ini.');
      return;
    }
    const words = quizForm.correctSentence.trim().split(/\s+/).filter(Boolean);
    if (words.length < 2 || !quizForm.questionPrompt.trim()) {
      setApiError('Isi instruksi soal dan jawaban berupa kalimat minimal dua kata.');
      return;
    }
    try {
      const response = await apiRequest('/kuis', {
        method: 'POST',
        body: {
          id_materi: Number(quizForm.materialId),
          judul: quizForm.title.trim(),
          skor_lulus: Number(quizForm.passingScore),
          soal: [{
            instruksi: quizForm.questionPrompt.trim(),
            kalimat_benar: quizForm.correctSentence.trim(),
            kata_soal: words,
          }],
        },
      });
      setQuizzes((current) => [mapTeacherQuiz(response.data), ...current]);
      setQuizForm({
        title: '',
        materialId: materials[0]?.id || '',
        passingScore: 75,
        questionPrompt: '',
        correctSentence: '',
      });
      setShowAddQuizModal(false);
      setApiError('');
      showToast('Kuis evaluasi berhasil ditambahkan.');
    } catch (error) {
      setApiError(`Kuis gagal disimpan: ${error.message}`);
    }
  };

  const handleDeleteQuiz = async (id, title) => {
    try {
      await apiRequest(`/kuis/${id}`, { method: 'DELETE' });
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
      showToast(`Kuis "${title}" telah dihapus.`);
    } catch (error) {
      setApiError(`Kuis gagal dihapus: ${error.message}`);
    }
  };

  const openAddQuiz = () => {
    setQuizForm({
      title: '',
      materialId: materials[0] ? String(materials[0].id) : '',
      passingScore: 75,
      questionPrompt: '',
      correctSentence: '',
    });
    setShowAddQuizModal(true);
  };

  // ==========================================================================
  // HANDLERS HUBUNGKAN (DATA SISWA & ORANG TUA)
  // ==========================================================================
  const filteredConnections = connections.filter((row) => {
    const matchClass =
      classFilter === 'Semua Kelas' || row.kelas === classFilter;
    const matchStatus =
      linkStatusFilter === 'Semua Status Hubungan' ||
      (linkStatusFilter === 'Terhubung' && row.status === 'CONNECTED') ||
      (linkStatusFilter === 'Ingin Terhubung' && row.status === 'PENDING') ||
      (linkStatusFilter === 'Belum Terhubung' && row.status === 'UNLINKED');
    const q = connectionSearch.toLowerCase();
    const matchQuery =
      row.name.toLowerCase().includes(q) ||
      row.nisn.includes(q) ||
      row.parentName.toLowerCase().includes(q);
    return matchClass && matchStatus && matchQuery;
  });

  const studentSummaries = Array.from(
    quizResults.reduce((students, result) => {
      const key = result.studentId || result.name;
      const summary = students.get(key) || {
        id: key,
        initials: result.initials,
        name: result.name,
        nisn: result.nisn,
        kelas: result.kelas,
        scores: [],
        lastQuiz: result.quizTitle,
      };
      summary.scores.push(result.score);
      students.set(key, summary);
      return students;
    }, new Map()).values()
  ).map((student) => {
    const avgScore = Math.round(
      student.scores.reduce((total, score) => total + score, 0) /
        student.scores.length
    );
    return {
      ...student,
      avgScore,
      progress: avgScore,
    };
  });

  const classScores = quizResults.reduce((classes, result) => {
    if (!result.kelas) return classes;
    classes[result.kelas] ||= [];
    classes[result.kelas].push(result.score);
    return classes;
  }, {});
  const classChartData = Object.entries(classScores).map(([kelas, scores], index) => ({
    kelas,
    nilai: Math.round(scores.reduce((total, score) => total + score, 0) / scores.length),
    barColor: ['bg-[#007EDA]', 'bg-[#004C8C]', 'bg-[#FCD34D]'][index % 3],
  }));
  const passRate = quizResults.length
    ? Math.round((quizResults.filter((result) => result.status === 'LULUS').length / quizResults.length) * 100)
    : 0;
  const pendingLinkCount = connections.filter((connection) => connection.status === 'PENDING').length;
  const selectedDictionaryEntry = dictionaryEntries.find(
    (entry) =>
      entry.karakter?.toUpperCase() === selectedChar?.toUpperCase() &&
      entry.jenis_bahasa === signMode
  );

  const handleApproveParent = async (id) => {
    try {
      await apiRequest(`/guru/link-requests/${id}/approve`, { method: 'POST', body: {} });
      setConnections((prev) =>
        prev.map((row) => row.id === id ? { ...row, status: 'CONNECTED' } : row)
      );
      showToast('Permintaan tautan akun orang tua disetujui.');
    } catch (error) {
      setApiError(`Permintaan tautan gagal disetujui: ${error.message}`);
    }
  };

  const handleRejectParent = async (id) => {
    try {
      await apiRequest(`/guru/link-requests/${id}/reject`, { method: 'POST', body: {} });
      setConnections((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, status: 'UNLINKED', parentName: '', parentEmail: '' } : row
        )
      );
      showToast('Permintaan tautan akun orang tua ditolak.');
    } catch (error) {
      setApiError(`Permintaan tautan gagal ditolak: ${error.message}`);
    }
  };

  const openConnectModal = (mode, student) => {
    setConnectModal({ mode, student });
    setParentNameInput(student.parentName || '');
    setParentEmailInput(student.parentEmail || '');
  };

  const handleSaveParentConnection = (e) => {
    e.preventDefault();
    showToast('Orang tua perlu mengajukan tautan dari akunnya; guru dapat menyetujui permintaan yang masuk.');
    setConnectModal(null);
  };

  // ==========================================================================
  // HANDLERS PENGATURAN & PROFIL GURU
  // ==========================================================================
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
      const updatedProfile = {
        ...teacherProfile,
        fullName: response.data.nama,
        email: response.data.email,
        phone: response.data.no_telepon,
      };
      setTeacherProfile(updatedProfile);
      setProfileForm((current) => ({ ...current, ...updatedProfile }));
      showToast('Data profil guru berhasil diperbarui.');
    } catch (error) {
      setApiError(`Profil gagal diperbarui: ${error.message}`);
    }
  };

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
      showToast('Konfirmasi password baru tidak cocok.');
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
      showToast('Password akun guru berhasil diperbarui.');
    } catch (error) {
      setApiError(`Password gagal diperbarui: ${error.message}`);
    }
  };

  const currentHeader = headerMeta[activeNav] || headerMeta.beranda;

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
        {/* Bagian Atas: Logo & Menu Navigasi */}
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
                  setActiveNav('beranda');
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
                  setActiveNav('beranda');
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
        {/* TOP HEADER BAR */}
        <header className="bg-white border-b border-slate-200/80 px-3 sm:px-6 md:px-10 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3 sm:gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Buka menu"
              aria-expanded={isMobileMenuOpen}
              className="md:hidden shrink-0 w-9 h-9 rounded-lg border border-slate-200 text-[#102A43] flex items-center justify-center"
            >
              <Icon icon="lucide:menu" className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#102A43] leading-tight">
                {currentHeader.title}
              </h1>
              <p className="hidden sm:block text-xs text-slate-500 mt-0.5">
                {currentHeader.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Badge Peran Guru */}
            <span className="inline-flex items-center gap-1.5 bg-[#FCD34D] text-[#102A43] text-[11px] font-extrabold px-3.5 py-1.5 rounded-full tracking-wide uppercase shadow-2xs">
              <Icon icon="lucide:graduation-cap" className="w-3.5 h-3.5" />
              <span>GURU</span>
            </span>

            <div className="h-7 w-px bg-slate-200"></div>

            {/* Profil Guru (klik untuk menuju Pengaturan & Profil) */}
            <button
              type="button"
              onClick={() => setActiveNav('profil')}
              className="flex items-center gap-2.5 hover:opacity-85 transition cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-[#007EDA] border-2 border-[#FCD34D] text-white text-xs font-extrabold flex items-center justify-center shadow-2xs">
                {initials}
              </div>
              <span className="hidden sm:inline text-xs md:text-sm font-bold text-[#102A43]">
                {teacherProfile.fullName}
              </span>
            </button>
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="flex-1 min-w-0 max-w-7xl w-full mx-auto px-4 sm:px-5 md:px-10 py-5 sm:py-7 space-y-6">
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
              TAB 1: BERANDA GURU
             ================================================================ */}
          {activeNav === 'beranda' && (
            <>
              {/* Hero Welcome Banner */}
              <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Icon
                    icon="lucide:calendar"
                    className="w-3.5 h-3.5 text-slate-400"
                  />
                  <span>Kamis, 18 Oktober 2026 • Semester Ganjil 2026/2027</span>
                </div>

                <h2 className="text-2xl md:text-[28px] font-extrabold text-[#102A43] mt-2 leading-tight">
                  Selamat datang, {firstName}
                </h2>

                <p className="text-xs md:text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">
                  Pantau capaian gramatika SPOK, distribusi modul visual
                  SIBI/BISINDO, serta status komunikasi orang tua dalam satu
                  ruang kendali.
                </p>
              </section>

              {/* Tiga Kartu Statistik */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#007EDA] flex items-center justify-center">
                      <Icon icon="lucide:users" className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 bg-[#EEF4FF] text-[#007EDA] text-[11px] font-bold px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#007EDA]"></span>
                      <span>Hasil kuis</span>
                    </span>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-[#102A43]">
                      {studentSummaries.length}
                    </div>
                    <div className="text-xs font-bold text-[#102A43] mt-1">
                      Siswa dengan hasil kuis
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#007EDA] rounded-full"
                      style={{ width: `${Math.min(100, studentSummaries.length * 10)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#007EDA] flex items-center justify-center">
                      <Icon icon="lucide:book-open" className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 bg-[#FCD34D] text-[#102A43] text-[11px] font-extrabold px-3 py-1 rounded-full">
                      <Icon icon="lucide:alert-circle" className="w-3.5 h-3.5" />
                      <span>{pendingLinkCount} Permintaan Tautan</span>
                    </span>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-[#102A43]">
                      {materials.length}
                    </div>
                    <div className="text-xs font-bold text-[#102A43] mt-1">
                      Materi Pembelajaran
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#007EDA] rounded-full"
                      style={{ width: `${Math.min(100, materials.length * 10)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#007EDA] flex items-center justify-center">
                      <Icon icon="lucide:file-check" className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 bg-[#EEF4FF] text-[#007EDA] text-[11px] font-bold px-3 py-1 rounded-full">
                      <Icon icon="lucide:trending-up" className="w-3.5 h-3.5" />
                      <span>Tingkat Lulus {passRate}%</span>
                    </span>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-[#102A43]">
                      {quizzes.length}
                    </div>
                    <div className="text-xs font-bold text-[#102A43] mt-1">
                      Kuis Evaluasi
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#007EDA] rounded-full"
                      style={{ width: `${passRate}%` }}
                    ></div>
                  </div>
                </div>
              </section>

              {/* Hearo Refine Studio */}
              <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-7 space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-extrabold text-[#102A43]">
                      Hearo Refine Studio
                    </h3>
                    <span className="inline-flex items-center gap-1.5 bg-[#EEF4FF] border border-sky-200/80 text-[#007EDA] text-[11px] font-bold px-3 py-1 rounded-full">
                      <Icon icon="lucide:sparkles" className="w-3 h-3" />
                      <span>Didukung AI Koreksi SPOK Tunarungu</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Ubah susunan kata isyarat menjadi kalimat bahasa Indonesia
                    yang terstruktur dan baku.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <label className="inline-flex items-center gap-1.5 text-xs font-bold text-[#102A43]">
                    <Icon
                      icon="lucide:pen-square"
                      className="w-4 h-4 text-[#007EDA]"
                    />
                    <span>Input Kalimat Isyarat</span>
                  </label>

                  <div className="relative">
                    <textarea
                      rows={4}
                      value={signInput}
                      onChange={(e) => setSignInput(e.target.value)}
                      placeholder="Contoh: SAYA KEMARIN SEKOLAH PERGI..."
                      className="w-full bg-[#F4F7FB] border border-slate-200/80 focus:border-[#007EDA] focus:bg-white rounded-xl p-4 pr-10 text-xs md:text-sm font-medium text-[#102A43] placeholder-slate-400 focus:outline-none transition resize-none"
                    />
                    {signInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setSignInput('');
                          setRefinedResult(null);
                        }}
                        className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <Icon icon="lucide:x" className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="bg-[#F4F7FB] border border-slate-200/60 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-slate-600">
                    <Icon
                      icon="lucide:languages"
                      className="w-4 h-4 text-[#007EDA] shrink-0"
                    />
                    <span>
                      Format Isyarat Terdeteksi:{' '}
                      <strong className="text-[#007EDA]">
                        Subjek - Keterangan - Predikat (Non-baku)
                      </strong>
                    </span>
                  </div>

                  {refinedResult && (
                    <div className="bg-[#EEF4FF] border border-sky-200 rounded-xl p-4 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#007EDA]">
                        <span>HASIL KALIMAT BAKU (SPOK):</span>
                        <span>{refinedResult.pattern}</span>
                      </div>
                      <p className="text-sm font-extrabold text-[#102A43]">
                        “{refinedResult.output}”
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleRefineSentence}
                    className="w-full bg-[#007EDA] hover:bg-[#0068B8] text-white font-bold text-xs md:text-sm py-3.5 rounded-xl shadow-xs inline-flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Icon icon="lucide:sparkles" className="w-4 h-4" />
                    <span>Perbaiki Kalimat</span>
                  </button>
                </div>
              </section>

              {/* Grafik Rata-rata Nilai & Aksi Cepat */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="lucide:bar-chart-2"
                          className="w-4 h-4 text-[#007EDA]"
                        />
                        <h3 className="text-base font-extrabold text-[#102A43]">
                          Rata-rata Nilai Kuis per Level
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Perbandingan pemahaman sintaksis SPOK antar tingkat
                        kemahiran
                      </p>
                    </div>

                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="bg-[#F4F7FB] border border-slate-200/80 text-xs font-bold text-[#102A43] px-3.5 py-2 rounded-xl focus:outline-none focus:border-[#007EDA] cursor-pointer"
                    >
                      <option>Semester Ini (Semua Kelas)</option>
                      <option>Kelas 10-A</option>
                      <option>Kelas 11-A</option>
                      <option>Kelas 12-A</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-600 pt-1">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-[#007EDA]"></span>
                        <span>Rata-rata Kelas</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3.5 border-t-2 border-dashed border-rose-500"></span>
                        <span>Batas KKM (70)</span>
                      </span>
                    </div>
                    <span className="text-slate-500 font-bold">
                      Maksimal Skor: 100
                    </span>
                  </div>

                  <div className="relative pt-4 pb-2 px-2">
                    <div className="flex items-end gap-4 h-48 relative">
                      <div className="h-full flex flex-col justify-between text-[10px] font-semibold text-slate-400 pr-2 select-none">
                        <span>100</span>
                        <span>80</span>
                        <span>60</span>
                        <span>40</span>
                      </div>

                      <div className="flex-1 h-full border-b border-slate-300 relative flex items-end justify-around px-4">
                        <div
                          className="absolute left-0 right-0 border-t-2 border-dashed border-rose-400 pointer-events-none flex justify-end"
                          style={{ bottom: '50%' }}
                        >
                          <span className="text-[9px] font-extrabold text-rose-500 bg-white px-1.5 -mt-2.5">
                            KKM 70
                          </span>
                        </div>

                        {classChartData.map((bar) => {
                          const heightPercent = Math.max(
                            15,
                            Math.min(100, ((bar.nilai - 30) / 70) * 100)
                          );
                          return (
                            <div
                              key={bar.kelas}
                              className="flex flex-col items-center w-16 md:w-20 z-10"
                            >
                              <span className="text-[11px] font-extrabold text-[#102A43] mb-1.5">
                                {bar.nilai}
                              </span>
                              <div
                                className={`w-full rounded-t-lg ${bar.barColor} transition-all duration-300 shadow-2xs`}
                                style={{ height: `${heightPercent * 1.65}px` }}
                              ></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center pl-8 pr-4 pt-2 justify-around">
                      {classChartData.map((bar) => (
                        <span
                          key={bar.kelas}
                          className="text-[11px] font-extrabold text-[#102A43] w-16 md:w-20 text-center"
                        >
                          {bar.kelas}
                        </span>
                      ))}
                    </div>
                  </div>
                  {classChartData.length === 0 && (
                    <p className="text-center text-xs text-slate-500">
                      Grafik akan tampil setelah siswa menyelesaikan kuis.
                    </p>
                  )}

                  <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
                    <Icon
                      icon="lucide:lightbulb"
                      className="w-4 h-4 text-[#007EDA] shrink-0 mt-0.5"
                    />
                    <p>
                      <strong className="text-[#102A43]">
                        Catatan Diagnostik Guru:
                      </strong>{' '}
                      Siswa di level Mahir memerlukan pendampingan intensif pada
                      materi{' '}
                      <span className="text-[#007EDA] font-semibold">
                        Kalimat Inversi BISINDO ke Bahasa Baku formal.
                      </span>{' '}
                      Rekomendasi modul visual interaktif telah disiapkan.
                    </p>
                  </div>
                </div>

                {/* Aksi Cepat */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="lucide:zap"
                          className="w-4 h-4 text-[#007EDA]"
                        />
                        <h3 className="text-base font-extrabold text-[#102A43]">
                          Aksi Cepat
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Manajemen kelas inklusif ramah Tuli
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav('materi');
                        openAddMaterial();
                      }}
                      className="w-full bg-[#007EDA] hover:bg-[#0068B8] text-white rounded-2xl p-4 text-left flex items-center justify-between gap-3 shadow-xs transition cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon icon="lucide:file-plus-2" className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-extrabold leading-snug">
                            Tambah Materi Baru
                          </div>
                          <p className="text-[11px] text-sky-100 mt-1 leading-relaxed">
                            Unggah materi SPOK SIBI/BISINDO
                          </p>
                        </div>
                      </div>
                      <Icon
                        icon="lucide:arrow-right"
                        className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav('quiz');
                        openAddQuiz();
                      }}
                      className="w-full bg-[#F8FAFC] hover:bg-[#EEF4FF] border border-slate-200/90 text-[#102A43] rounded-2xl p-4 text-left flex items-center justify-between gap-3 transition cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#007EDA] flex items-center justify-center shrink-0 mt-0.5">
                          <Icon icon="lucide:plus-circle" className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-extrabold leading-snug">
                            Buat Kuis Baru
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            Format pilihan ganda & susun kata ramah Tuli
                          </p>
                        </div>
                      </div>
                      <Icon
                        icon="lucide:arrow-right"
                        className="w-4 h-4 text-slate-500 shrink-0 group-hover:translate-x-0.5 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              </section>

              {/* Tabel Hasil Kuis Terbaru */}
              <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="lucide:clipboard-check"
                        className="w-4 h-4 text-[#007EDA]"
                      />
                      <h3 className="text-base font-extrabold text-[#102A43]">
                        Hasil Kuis Terbaru
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Aktivitas pengerjaan kuis siswa 24 jam terakhir
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveNav('riwayat')}
                    className="text-xs font-extrabold text-[#007EDA] hover:text-[#005A9E] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Lihat Semua Hasil</span>
                    <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <Icon
                      icon="lucide:search"
                      className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari nama siswa atau judul kuis..."
                      className="w-full bg-[#F4F7FB] border border-slate-200/80 focus:border-[#007EDA] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-[#102A43] placeholder-slate-400 focus:outline-none transition"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={cycleStatusFilter}
                    className="bg-[#F4F7FB] hover:bg-[#EEF4FF] border border-slate-200/80 text-xs font-bold text-[#102A43] px-4 py-2.5 rounded-xl inline-flex items-center justify-center gap-2 transition cursor-pointer shrink-0"
                  >
                    <Icon
                      icon="lucide:sliders-horizontal"
                      className="w-3.5 h-3.5 text-[#007EDA]"
                    />
                    <span>
                      {statusFilter === 'SEMUA'
                        ? 'Semua Status'
                        : `Status: ${statusFilter}`}
                    </span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
                  <table className="w-full text-left border-collapse min-w-[740px]">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-slate-200/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-4">SISWA</th>
                        <th className="py-3.5 px-4">KUIS & LEVEL</th>
                        <th className="py-3.5 px-4 text-center">SKOR</th>
                        <th className="py-3.5 px-4 text-center">STATUS</th>
                        <th className="py-3.5 px-4">TANGGAL</th>
                        <th className="py-3.5 px-4 text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80 text-xs">
                      {filteredResults.map((row) => {
                        const isLulus = row.status === 'LULUS';
                        return (
                          <tr
                            key={row.id}
                            className="hover:bg-[#F8FAFC] transition"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-9 h-9 rounded-full ${row.avatarBg} text-white text-xs font-extrabold flex items-center justify-center shrink-0`}
                                >
                                  {row.initials}
                                </div>
                                <div>
                                  <div className="font-bold text-[#102A43]">
                                    {row.name}
                                  </div>
                                  <div className="text-[11px] text-slate-400 mt-0.5">
                                    NISN: {row.nisn} • {row.kelas}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-4">
                              <div className="font-bold text-[#102A43]">
                                {row.quizTitle}
                              </div>
                              {row.subTag && (
                                <div className="text-[11px] text-slate-500">
                                  {row.subTag}
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="bg-[#EEF4FF] text-[#007EDA] text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                                  {row.level}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {row.topic}
                                </span>
                              </div>
                            </td>

                            <td className="py-4 px-4 text-center">
                              <span
                                className={`text-sm font-extrabold ${
                                  isLulus ? 'text-[#007EDA]' : 'text-rose-600'
                                }`}
                              >
                                {row.score}
                              </span>
                            </td>

                            <td className="py-4 px-4 text-center">
                              {isLulus ? (
                                <span className="inline-flex items-center gap-1 bg-[#EEF4FF] text-[#007EDA] text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                                  <Icon
                                    icon="lucide:check-circle-2"
                                    className="w-3 h-3"
                                  />
                                  <span>LULUS</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                                  <Icon
                                    icon="lucide:alert-triangle"
                                    className="w-3 h-3"
                                  />
                                  <span>REMIDIAL</span>
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-4 text-[11px] text-slate-500">
                              {row.date}
                            </td>

                            <td className="py-4 px-4 text-right">
                              {isLulus ? (
                                <button
                                  type="button"
                                  onClick={() => openStudentModal(row)}
                                  className="text-xs font-bold text-[#007EDA] hover:underline cursor-pointer"
                                >
                                  Lihat Jawaban
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => openStudentModal(row)}
                                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                                >
                                  <span>Beri Catatan</span>
                                  <Icon icon="lucide:pencil" className="w-3 h-3" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {/* ================================================================
              TAB 2: KAMUS BAHASA ISYARAT
             ================================================================ */}
          {activeNav === 'kamus' && (
            <div className="space-y-6">
              {/* Bar Switcher SIBI / BISINDO & Info */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 md:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                <div className="bg-[#EEF4FF] p-1.5 rounded-2xl inline-flex items-center gap-1 self-start">
                  <button
                    type="button"
                    onClick={() => setSignMode('SIBI')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-2 transition cursor-pointer ${
                      signMode === 'SIBI'
                        ? 'bg-[#0068B8] text-white shadow-xs'
                        : 'text-[#102A43] hover:bg-white/60'
                    }`}
                  >
                    {signMode === 'SIBI' && (
                      <Icon
                        icon="lucide:check-circle-2"
                        className="w-4 h-4 shrink-0"
                      />
                    )}
                    <span className="text-left leading-tight">
                      SIBI (Standar
                      <br className="hidden sm:inline" /> Sekolah)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignMode('BISINDO')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-2 transition cursor-pointer ${
                      signMode === 'BISINDO'
                        ? 'bg-[#0068B8] text-white shadow-xs'
                        : 'text-[#102A43] hover:bg-white/60'
                    }`}
                  >
                    {signMode === 'BISINDO' && (
                      <Icon
                        icon="lucide:check-circle-2"
                        className="w-4 h-4 shrink-0"
                      />
                    )}
                    <span className="text-left leading-tight">
                      BISINDO (Alami
                      <br className="hidden sm:inline" /> Tuli)
                    </span>
                  </button>
                </div>

                <div className="bg-[#EEF4FF] border border-sky-100 rounded-xl px-4 py-3 flex items-center gap-2.5 text-xs text-slate-600 max-w-md">
                  <Icon
                    icon="lucide:lightbulb"
                    className="w-4 h-4 text-[#007EDA] shrink-0"
                  />
                  <span>
                    <strong className="text-[#102A43]">SIBI</strong> cocok untuk
                    ejaan formal &amp; ujian sekolah;{' '}
                    <strong className="text-[#102A43]">BISINDO</strong> digunakan
                    sehari-hari.
                  </span>
                </div>
              </div>

              {/* Judul Tengah Kamus */}
              <div className="text-center max-w-lg mx-auto space-y-1.5 py-1">
                <h2 className="text-2xl font-extrabold text-[#102A43]">
                  Kamus Bahasa Isyarat
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pilih jenis bahasa isyarat, lalu klik huruf atau angka untuk
                  melihat gerakan tangannya secara instan.
                </p>
              </div>

              {/* Grid Kartu Karakter A-Z & 0-9 */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#102A43]">
                  <Icon
                    icon="lucide:layout-grid"
                    className="w-4 h-4 text-[#007EDA]"
                  />
                  <span>Pilih Karakter untuk Dipelajari</span>
                </div>

                <div className="flex flex-col xl:flex-row items-stretch gap-8">
                  {/* Grid Huruf A-Z (7 kolom) */}
                  <div className="flex-1 grid grid-cols-4 sm:grid-cols-7 gap-3">
                    {LETTERS.map((char) => (
                      <button
                        key={char}
                        type="button"
                        onClick={() => setSelectedChar(char)}
                        className="aspect-square bg-[#EEF4FF] hover:bg-[#007EDA] text-[#102A43] hover:text-white rounded-2xl font-extrabold text-sm md:text-base flex items-center justify-center transition shadow-2xs cursor-pointer"
                      >
                        {char}
                      </button>
                    ))}
                  </div>

                  {/* Garis Pemisah Vertikal Biru */}
                  <div className="hidden xl:block w-1 bg-[#7CC4FA] rounded-full"></div>

                  {/* Grid Angka 0-9 (4 kolom) */}
                  <div className="xl:w-[340px] grid grid-cols-4 gap-3 content-start">
                    {NUMBERS.map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSelectedChar(num)}
                        className="aspect-square bg-[#EEF4FF] hover:bg-[#007EDA] text-[#102A43] hover:text-white rounded-2xl font-extrabold text-sm md:text-base flex items-center justify-center transition shadow-2xs cursor-pointer"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 3: MATERI BELAJAR
             ================================================================ */}
          {activeNav === 'materi' && (
            <div className="space-y-5">
              {/* Bar Tombol Atas */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="bg-[#0F233C] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-2xs">
                  Materi Pembelajaran
                </span>

                <button
                  type="button"
                  onClick={openAddMaterial}
                  className="bg-[#FCD34D] hover:bg-[#FBBF24] text-[#102A43] text-xs font-extrabold px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-2xs transition cursor-pointer"
                >
                  <Icon icon="lucide:plus" className="w-4 h-4" />
                  <span>Upload Materi Baru</span>
                </button>
              </div>

              {/* Card Search & Sort */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Icon
                    icon="lucide:search"
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                  />
                  <input
                    type="text"
                    value={materialSearch}
                    onChange={(e) => setMaterialSearch(e.target.value)}
                    placeholder="Cari materi pembelajaran, topik, atau kata kunci..."
                    className="w-full bg-[#F8FAFC] border border-slate-200/90 focus:border-[#007EDA] focus:bg-white rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-[#102A43] placeholder-slate-400 focus:outline-none transition"
                  />
                </div>

                <div className="inline-flex items-center gap-2 bg-[#F8FAFC] border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-600 self-start sm:self-auto">
                  <Icon
                    icon="lucide:list-filter"
                    className="w-3.5 h-3.5 text-slate-400"
                  />
                  <span>Urutkan:</span>
                  <select
                    value={materialSort}
                    onChange={(e) => setMaterialSort(e.target.value)}
                    className="font-extrabold text-[#102A43] bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="terbaru">Terbaru</option>
                    <option value="terlama">Terlama</option>
                  </select>
                </div>
              </div>

              {/* Card Daftar Modul PDF */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-200/80 overflow-hidden">
                {filteredMaterials.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-400 font-medium">
                    Materi pembelajaran tidak ditemukan.
                  </div>
                ) : (
                  filteredMaterials.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 flex items-center justify-between gap-4 hover:bg-[#F8FAFC] transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#007EDA] flex items-center justify-center shrink-0">
                          <Icon icon="lucide:file-text" className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xs md:text-sm font-extrabold text-[#102A43]">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                            <Icon
                              icon="lucide:calendar"
                              className="w-3.5 h-3.5"
                            />
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditMaterial(item)}
                          title="Edit Materi"
                          className="p-2 rounded-lg text-slate-500 hover:text-[#007EDA] hover:bg-[#EEF4FF] transition cursor-pointer"
                        >
                          <Icon icon="lucide:pencil" className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteMaterial(item.id, item.title)
                          }
                          title="Hapus Materi"
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Icon icon="lucide:trash-2" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 4: ARENA KUIS
             ================================================================ */}
          {activeNav === 'quiz' && (
            <div className="space-y-5">
              {/* Subheader & Tombol Tambah Kuis */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-600">
                  {quizzes.length} kuis tersedia
                </span>

                <button
                  type="button"
                  onClick={openAddQuiz}
                  className="bg-[#007EDA] hover:bg-[#0068B8] text-white text-xs font-bold px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Icon icon="lucide:plus" className="w-4 h-4" />
                  <span>Tambah Kuis</span>
                </button>
              </div>

              {/* Daftar Kuis */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-200/80 overflow-hidden">
                {quizzes.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-400 font-medium">
                    Belum ada kuis evaluasi. Klik "+ Tambah Kuis" untuk
                    membuatnya.
                  </div>
                ) : (
                  quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8FAFC] transition"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-[#FEF9C3] border border-[#FDE047] shrink-0 mt-0.5"></div>
                        <div className="space-y-1.5">
                          <h3 className="text-sm font-extrabold text-[#102A43]">
                            {quiz.title}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {quiz.material}
                          </p>
                          <div className="pt-0.5">
                            <span className="inline-flex items-center gap-1.5 bg-[#EEF4FF] text-[#007EDA] text-[11px] font-bold px-3 py-1 rounded-full">
                              <Icon icon="lucide:target" className="w-3.5 h-3.5" />
                              <span>Skor lulus: {quiz.passingScore}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                        className="self-end sm:self-center border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Icon icon="lucide:trash-2" className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 5: RIWAYAT BELAJAR
             ================================================================ */}
          {activeNav === 'riwayat' && (
            <div className="space-y-6">
              {/* 2 Kartu Ringkasan Atas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
                {/* Rata-rata Nilai */}
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
                      76,5
                    </span>
                    <span className="text-sm font-semibold text-slate-400">
                      / 100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Kuis lulus: 1 dari 2 • 2 pengerjaan
                  </p>
                </div>

                {/* Persentase Penguasaan (Donut 75%) */}
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
                        strokeDasharray="75, 100"
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-xs font-extrabold text-[#102A43]">
                      75%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-extrabold text-[#102A43]">
                      Persentase Penguasaan
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Kuis yang pernah lulus dibanding seluruh kuis.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grafik Progres Nilai (Area Chart) */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] text-[#007EDA] flex items-center justify-center shrink-0">
                    <Icon icon="lucide:trending-up" className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#102A43]">
                      Grafik Progres Nilai
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Garis merah putus-putus = rata-rata skor lulus
                    </p>
                  </div>
                </div>

                {/* SVG Line & Area Chart */}
                <div className="pt-2 overflow-x-auto">
                  <div className="min-w-[540px]">
                    <svg viewBox="0 0 640 230" className="w-full h-56">
                      <defs>
                        <linearGradient
                          id="hearoAreaGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#007EDA"
                            stopOpacity="0.45"
                          />
                          <stop
                            offset="100%"
                            stopColor="#007EDA"
                            stopOpacity="0.03"
                          />
                        </linearGradient>
                      </defs>

                      {/* Label Sumbu Y */}
                      <text x="20" y="35" fontSize="11" fill="#94A3B8">
                        100
                      </text>
                      <text x="24" y="72" fontSize="11" fill="#94A3B8">
                        80
                      </text>
                      <text x="24" y="109" fontSize="11" fill="#94A3B8">
                        60
                      </text>
                      <text x="24" y="146" fontSize="11" fill="#94A3B8">
                        40
                      </text>
                      <text x="24" y="183" fontSize="11" fill="#94A3B8">
                        20
                      </text>

                      {/* Area Gradient */}
                      <path
                        d="M 60 132 L 185 45 L 385 88 L 605 33 L 605 190 L 60 190 Z"
                        fill="url(#hearoAreaGrad)"
                      />

                      {/* Garis Merah Putus-putus Skor Lulus (70) */}
                      <line
                        x1="60"
                        y1="88"
                        x2="605"
                        y2="88"
                        stroke="#EF4444"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                      <text
                        x="62"
                        y="102"
                        fontSize="10"
                        fontWeight="700"
                        fill="#EF4444"
                      >
                        Skor lulus (70)
                      </text>

                      {/* Garis Kurva Biru */}
                      <polyline
                        fill="none"
                        stroke="#007EDA"
                        strokeWidth="2.5"
                        points="60,132 185,45 385,88 605,33"
                      />

                      {/* Titik Data & Nilai */}
                      <circle
                        cx="60"
                        cy="132"
                        r="4"
                        fill="#FFFFFF"
                        stroke="#007EDA"
                        strokeWidth="2.5"
                      />
                      <text
                        x="54"
                        y="122"
                        fontSize="10"
                        fontWeight="700"
                        fill="#102A43"
                      >
                        45
                      </text>

                      <circle
                        cx="185"
                        cy="45"
                        r="4"
                        fill="#FFFFFF"
                        stroke="#007EDA"
                        strokeWidth="2.5"
                      />
                      <text
                        x="179"
                        y="35"
                        fontSize="10"
                        fontWeight="700"
                        fill="#102A43"
                      >
                        92
                      </text>

                      <circle
                        cx="385"
                        cy="88"
                        r="4"
                        fill="#FFFFFF"
                        stroke="#007EDA"
                        strokeWidth="2.5"
                      />
                      <text
                        x="379"
                        y="78"
                        fontSize="10"
                        fontWeight="700"
                        fill="#102A43"
                      >
                        70
                      </text>

                      <circle
                        cx="605"
                        cy="33"
                        r="4.5"
                        fill="#FFFFFF"
                        stroke="#EF4444"
                        strokeWidth="2.5"
                      />
                      <text
                        x="598"
                        y="23"
                        fontSize="10"
                        fontWeight="700"
                        fill="#102A43"
                      >
                        99
                      </text>

                      {/* Label Nama Siswa di Bawah */}
                      <text x="50" y="215" fontSize="11" fill="#64748B">
                        Fauz
                      </text>
                      <text x="168" y="215" fontSize="11" fill="#64748B">
                        Annisa
                      </text>
                      <text x="368" y="215" fontSize="11" fill="#64748B">
                        Dimas
                      </text>
                      <text x="592" y="215" fontSize="11" fill="#64748B">
                        Budi
                      </text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Tabel Rincian Progres Siswa */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[680px]">
                    <thead>
                      <tr className="bg-[#EEF4FF]/70 border-b border-slate-200/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                        <th className="py-4 px-5">NAMA SISWA</th>
                        <th className="py-4 px-4">KELAS</th>
                        <th className="py-4 px-4">PERSENTASE CAPAIAN</th>
                        <th className="py-4 px-4 text-center">
                          RATA-RATA SKOR
                        </th>
                        <th className="py-4 px-5">KUIS TERAKHIR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80 text-xs">
                      {studentSummaries.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-[#F8FAFC] transition"
                        >
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#007EDA] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                                {row.initials}
                              </div>
                              <div>
                                <div className="font-bold text-[#102A43]">
                                  {row.name}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  NISN: {row.nisn}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-bold text-[#102A43]">
                            {row.kelas}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#007EDA] rounded-full"
                                  style={{ width: `${row.progress}%` }}
                                ></div>
                              </div>
                              <span className="font-extrabold text-[#007EDA]">
                                {row.progress}%
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-block bg-[#EEF4FF] text-[#007EDA] font-extrabold text-xs px-3 py-1 rounded-lg">
                              {row.avgScore}
                            </span>
                          </td>
                          <td className="py-4 px-5 font-semibold text-[#102A43]">
                            {row.lastQuiz}
                          </td>
                        </tr>
                      ))}
                      {studentSummaries.length === 0 && (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-sm text-slate-500">
                            Belum ada hasil kuis dari siswa.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 6: HUBUNGKAN (DATA SISWA & ORANG TUA)
             ================================================================ */}
          {activeNav === 'hubungkan' && (
            <div className="space-y-5">
              {/* Bar Filter & Pencarian */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#102A43] focus:outline-none focus:border-[#007EDA] cursor-pointer"
                >
                  <option>Kelas 10-A</option>
                  <option>Kelas 10-B</option>
                  <option>Semua Kelas</option>
                </select>

                <select
                  value={linkStatusFilter}
                  onChange={(e) => setLinkStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#102A43] focus:outline-none focus:border-[#007EDA] cursor-pointer"
                >
                  <option>Semua Status Hubungan</option>
                  <option>Terhubung</option>
                  <option>Ingin Terhubung</option>
                  <option>Belum Terhubung</option>
                </select>

                <div className="relative flex-1">
                  <Icon
                    icon="lucide:search"
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                  />
                  <input
                    type="text"
                    value={connectionSearch}
                    onChange={(e) => setConnectionSearch(e.target.value)}
                    placeholder="Cari nama siswa, NISN, atau wali..."
                    className="w-full bg-[#F8FAFC] border border-slate-200 focus:border-[#007EDA] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-[#102A43] placeholder-slate-400 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Tabel Data Siswa & Orang Tua */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[820px]">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-slate-200/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                        <th className="py-4 px-5">NAMA SISWA</th>
                        <th className="py-4 px-4">NISN</th>
                        <th className="py-4 px-4">KELAS</th>
                        <th className="py-4 px-4">EMAIL SISWA</th>
                        <th className="py-4 px-4 text-center">ORANG TUA</th>
                        <th className="py-4 px-5 text-center">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80 text-xs">
                      {filteredConnections.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-[#F8FAFC] transition"
                        >
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#007EDA] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                                {row.initials}
                              </div>
                              <span className="font-bold text-[#102A43]">
                                {row.name}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-slate-500 font-medium">
                            {row.nisn}
                          </td>

                          <td className="py-4 px-4">
                            <span className="inline-block bg-[#EEF4FF] text-[#007EDA] text-[11px] font-bold px-3 py-1 rounded-full">
                              {row.kelas}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-slate-500">
                            {row.email}
                          </td>

                          <td className="py-4 px-4 text-center">
                            {row.status === 'PENDING' && (
                              <div className="inline-flex flex-col items-center bg-[#EEF4FF] border border-[#007EDA] text-[#007EDA] text-[11px] font-bold px-3 py-1 rounded-xl leading-tight">
                                <span>{row.parentName}</span>
                                <span className="text-[10px]">
                                  (Ingin Terhubung)
                                </span>
                              </div>
                            )}

                            {row.status === 'CONNECTED' && (
                              <div className="inline-flex flex-col items-center text-emerald-600 text-[11px] font-bold leading-tight">
                                <span>✓ {row.parentName}</span>
                                <span className="text-[10px]">
                                  (Terhubung ✓)
                                </span>
                              </div>
                            )}

                            {row.status === 'UNLINKED' && (
                              <span className="inline-flex items-center gap-1 text-rose-500 text-[11px] font-bold">
                                <Icon
                                  icon="lucide:alert-triangle"
                                  className="w-3.5 h-3.5"
                                />
                                <span>Belum terhubung</span>
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-5 text-center">
                            {row.status === 'PENDING' && (
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleApproveParent(row.id)}
                                  className="border border-[#007EDA] text-[#007EDA] hover:bg-[#007EDA] hover:text-white text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer"
                                >
                                  Terima
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRejectParent(row.id)}
                                  className="border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer"
                                >
                                  Tolak
                                </button>
                              </div>
                            )}

                            {row.status === 'CONNECTED' && (
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    openConnectModal('detail', row)
                                  }
                                  className="border border-slate-200 text-slate-600 hover:border-[#007EDA] hover:text-[#007EDA] text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer"
                                >
                                  Detail
                                </button>
                              </div>
                            )}

                            {row.status === 'UNLINKED' && (
                              <span className="text-[10px] text-slate-500">
                                Orang tua perlu mengajukan ulang
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Kanan Bawah */}
              <div className="flex justify-end">
                <div className="bg-white border border-slate-200/80 rounded-xl px-3 py-2 inline-flex items-center gap-1.5 text-xs font-bold shadow-2xs">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPageNum((p) => Math.max(1, p - 1))
                    }
                    className="px-2.5 py-1 text-slate-400 hover:text-[#102A43] cursor-pointer"
                  >
                    Sebelumnya
                  </button>
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPageNum(page)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        currentPageNum === page
                          ? 'bg-[#007EDA] text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPageNum((p) => Math.min(3, p + 1))
                    }
                    className="px-2.5 py-1 text-slate-600 hover:text-[#007EDA] cursor-pointer"
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 7: PENGATURAN & PROFIL GURU (DISEMPURNAKAN LENGKAP)
             ================================================================ */}
          {activeNav === 'profil' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Kartu Kiri: Ringkasan Identitas Guru */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-7 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-[#007EDA] border-4 border-[#FCD34D] text-white text-2xl font-extrabold flex items-center justify-center shadow-sm">
                  {initials}
                </div>

                <h3 className="text-base font-extrabold text-[#102A43] mt-4">
                  {teacherProfile.fullName}
                </h3>

                <span className="mt-1.5 inline-flex items-center gap-1.5 bg-[#FCD34D] text-[#102A43] text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
                  <Icon icon="lucide:graduation-cap" className="w-3 h-3" />
                  <span>GURU</span>
                </span>

                <div className="w-full border-t border-slate-200/80 mt-6 pt-5 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400 font-medium">
                      NIP / NUPTK
                    </span>
                    <span className="font-extrabold text-[#102A43]">
                      {teacherProfile.nip}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400 font-medium">
                      Bergabung
                    </span>
                    <span className="font-extrabold text-[#102A43]">
                      {teacherProfile.joinedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Form Data Diri Guru & Form Ganti Password */}
              <div className="lg:col-span-8 space-y-6">
                {/* Form Data Diri & Akademik Guru */}
                <form
                  onSubmit={handleSaveProfile}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-7 space-y-5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] text-[#007EDA] flex items-center justify-center">
                      <Icon icon="lucide:id-card" className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#102A43]">
                        Data Diri &amp; Identitas Pengajar
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Lengkapi biodata guru untuk sinkronisasi kelas dan
                        laporan orang tua
                      </p>
                    </div>
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
                        NIP
                      </label>
                      <div className="relative">
                        <Icon
                          icon="lucide:badge-check"
                          className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                        />
                        <input
                          type="text"
                          readOnly
                          value={profileForm.nip}
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-600"
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

                {/* Form Ganti Password */}
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
                          Password Baru <span className="text-rose-500">*</span>
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
                              setShowPass({ ...showPass, new: !showPass.new })
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

                    <p className="text-[11px] text-slate-400">8-50 karakter.</p>
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
          )}
        </main>
      </div>

      {/* ====================================================================
          MODAL 1: CATATAN GURU PADA HASIL KUIS BERANDA
         ==================================================================== */}
      {activeStudentModal && (
        <div className="fixed inset-0 z-50 bg-[#0F233C]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#007EDA]">
                  EVALUASI HASIL KUIS
                </span>
                <h4 className="text-lg font-extrabold text-[#102A43] mt-0.5">
                  {activeStudentModal.name} ({activeStudentModal.kelas})
                </h4>
                <p className="text-xs text-slate-500">
                  {activeStudentModal.quizTitle} • Skor:{' '}
                  <strong>{activeStudentModal.score}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveStudentModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacherNote} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#102A43] mb-1.5">
                  Catatan &amp; Umpan Balik Guru:
                </label>
                <textarea
                  rows={3}
                  value={teacherNoteDraft}
                  onChange={(e) => setTeacherNoteDraft(e.target.value)}
                  placeholder="Tuliskan catatan pendampingan atau rekomendasi materi..."
                  className="w-full bg-[#F4F7FB] border border-slate-200 focus:border-[#007EDA] rounded-xl p-3 text-xs text-[#102A43] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStudentModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#007EDA] hover:bg-[#0068B8] text-white cursor-pointer"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: PRATINJAU KARAKTER KAMUS ISYARAT
         ==================================================================== */}
      {selectedChar && (
        <div className="fixed inset-0 z-50 bg-[#0F233C]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-[#EEF4FF] text-[#007EDA] text-[10px] font-extrabold px-3 py-1 rounded-full">
                {signMode} • PANDUAN VISUAL
              </span>
              <button
                type="button"
                onClick={() => setSelectedChar(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <div className="w-28 h-28 mx-auto rounded-3xl bg-[#EEF4FF] border-2 border-[#007EDA]/20 flex flex-col items-center justify-center text-[#007EDA]">
              {selectedDictionaryEntry?.media_url ? (
                <img
                  src={selectedDictionaryEntry.media_url}
                  alt={`Isyarat ${selectedChar} ${signMode}`}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <Icon icon="lucide:hand" className="w-10 h-10 mb-1" />
              )}
              <span className="text-2xl font-extrabold text-[#102A43]">
                {selectedChar}
              </span>
            </div>

            <div>
              <h4 className="text-base font-extrabold text-[#102A43]">
                Isyarat Karakter “{selectedChar}”
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {selectedDictionaryEntry?.deskripsi ||
                  <>Belum ada panduan untuk karakter ini. Peragakan posisi jari sesuai standar <strong>{signMode}</strong>.</>}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedChar(null)}
              className="w-full bg-[#007EDA] hover:bg-[#0068B8] text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer"
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 3: UPLOAD / EDIT MATERI BELAJAR
         ==================================================================== */}
      {materialModal && (
        <div className="fixed inset-0 z-50 bg-[#0F233C]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-[#102A43]">
                {materialModal.mode === 'add'
                  ? 'Upload Materi Pembelajaran Baru'
                  : 'Edit Materi Pembelajaran'}
              </h4>
              <button
                type="button"
                onClick={() => setMaterialModal(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#102A43] mb-1">
                  Judul Modul / Materi *
                </label>
                <input
                  type="text"
                  required
                  value={materialForm.title}
                  onChange={(e) =>
                    setMaterialForm({ ...materialForm, title: e.target.value })
                  }
                  placeholder="Contoh: Struktur Kalimat SPOK Tingkat Lanjut"
                  className="w-full bg-[#F4F7FB] border border-slate-200 focus:border-[#007EDA] rounded-xl px-3.5 py-2.5 text-xs text-[#102A43] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102A43] mb-1">
                  Deskripsi Materi *
                </label>
                <textarea
                  required
                  value={materialForm.description}
                  onChange={(e) =>
                    setMaterialForm({ ...materialForm, description: e.target.value })
                  }
                  className="w-full min-h-24 bg-[#F4F7FB] border border-slate-200 focus:border-[#007EDA] rounded-xl px-3.5 py-2.5 text-xs text-[#102A43] focus:outline-none"
                  placeholder="Tulis materi pembelajaran yang akan dibaca murid."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMaterialModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#007EDA] hover:bg-[#0068B8] text-white cursor-pointer"
                >
                  Simpan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 4: TAMBAH KUIS BARU
         ==================================================================== */}
      {showAddQuizModal && (
        <div className="fixed inset-0 z-50 bg-[#0F233C]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-[#102A43]">
                Buat Kuis Evaluasi Baru
              </h4>
              <button
                type="button"
                onClick={() => setShowAddQuizModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuiz} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#102A43] mb-1">
                  Judul Kuis *
                </label>
                <input
                  type="text"
                  required
                  value={quizForm.title}
                  onChange={(e) =>
                    setQuizForm({ ...quizForm, title: e.target.value })
                  }
                  placeholder="Contoh: Penyusunan Kalimat Inversi BISINDO"
                  className="w-full bg-[#F4F7FB] border border-slate-200 focus:border-[#007EDA] rounded-xl px-3.5 py-2.5 text-xs text-[#102A43] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102A43] mb-1">
                  Materi Terkait
                </label>
                <select
                  required
                  value={quizForm.materialId}
                  onChange={(e) =>
                    setQuizForm({ ...quizForm, materialId: e.target.value })
                  }
                  className="w-full bg-[#F4F7FB] border border-slate-200 focus:border-[#007EDA] rounded-xl px-3.5 py-2.5 text-xs text-[#102A43] focus:outline-none"
                >
                  <option value="">Pilih materi</option>
                  {materials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102A43] mb-1">
                  Instruksi Soal *
                </label>
                <textarea
                  required
                  maxLength={255}
                  value={quizForm.questionPrompt}
                  onChange={(e) =>
                    setQuizForm({ ...quizForm, questionPrompt: e.target.value })
                  }
                  placeholder="Susun kata berikut menjadi kalimat yang benar."
                  className="w-full min-h-20 bg-[#F4F7FB] border border-slate-200 focus:border-[#007EDA] rounded-xl px-3.5 py-2.5 text-xs text-[#102A43] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102A43] mb-1">
                  Jawaban Kalimat *
                </label>
                <input
                  type="text"
                  required
                  maxLength={255}
                  value={quizForm.correctSentence}
                  onChange={(e) =>
                    setQuizForm({ ...quizForm, correctSentence: e.target.value })
                  }
                  placeholder="Siswa belajar bahasa Indonesia."
                  className="w-full bg-[#F4F7FB] border border-slate-200 focus:border-[#007EDA] rounded-xl px-3.5 py-2.5 text-xs text-[#102A43] focus:outline-none"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Sistem mengubah kalimat ini menjadi susun-kata interaktif.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102A43] mb-1">
                  Skor Minimal Lulus (KKM)
                </label>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={quizForm.passingScore}
                  onChange={(e) =>
                    setQuizForm({ ...quizForm, passingScore: e.target.value })
                  }
                  className="w-full bg-[#F4F7FB] border border-slate-200 focus:border-[#007EDA] rounded-xl px-3.5 py-2.5 text-xs text-[#102A43] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddQuizModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#007EDA] hover:bg-[#0068B8] text-white cursor-pointer"
                >
                  Simpan Kuis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 5: HUBUNGKAN / EDIT / DETAIL ORANG TUA
         ==================================================================== */}
      {connectModal && (
        <div className="fixed inset-0 z-50 bg-[#0F233C]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#007EDA]">
                  SINKRONISASI AKUN WALI MURID
                </span>
                <h4 className="text-base font-extrabold text-[#102A43] mt-0.5">
                  {connectModal.student.name} ({connectModal.student.kelas})
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setConnectModal(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            {connectModal.mode === 'detail' ? (
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">NISN Siswa</span>
                  <span className="font-bold text-[#102A43]">
                    {connectModal.student.nisn}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email Siswa</span>
                  <span className="font-bold text-[#102A43]">
                    {connectModal.student.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nama Orang Tua / Wali</span>
                  <span className="font-bold text-emerald-600">
                    {connectModal.student.parentName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email Wali</span>
                  <span className="font-bold text-[#102A43]">
                    {connectModal.student.parentEmail || '-'}
                  </span>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSaveParentConnection}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-bold text-[#102A43] mb-1">
                    Nama Orang Tua / Wali *
                  </label>
                  <input
                    type="text"
                    required
                    value={parentNameInput}
                    onChange={(e) => setParentNameInput(e.target.value)}
                    placeholder="Masukkan nama wali murid"
                    className="w-full bg-[#F4F7FB] border border-slate-200 focus:border-[#007EDA] rounded-xl px-3.5 py-2.5 text-xs text-[#102A43] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#102A43] mb-1">
                    Email Orang Tua / Wali
                  </label>
                  <input
                    type="email"
                    value={parentEmailInput}
                    onChange={(e) => setParentEmailInput(e.target.value)}
                    placeholder="contoh: wali.murid@gmail.com"
                    className="w-full bg-[#F4F7FB] border border-slate-200 focus:border-[#007EDA] rounded-xl px-3.5 py-2.5 text-xs text-[#102A43] focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setConnectModal(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#007EDA] hover:bg-[#0068B8] text-white cursor-pointer"
                  >
                    Simpan Tautan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}