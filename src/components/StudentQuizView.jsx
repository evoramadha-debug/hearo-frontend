import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

export const INITIAL_QUIZZES = [
  {
    id: 'objek-keterangan-tempat',
    level: 'Menengah',
    title: 'Objek dan Keterangan Tempat',
    topic: 'Objek dan Keterangan Tempat',
    passingScore: 75,
    lastScore: 85,
    status: 'passed', // 'not_started' | 'passed' | 'failed'
    questions: [
      {
        id: 'okt-1',
        type: 'multiple_choice',
        prompt:
          'Manakah unsur yang berperan sebagai Objek dalam kalimat "Adik membaca komik di kamar"?',
        options: [
          { key: 'A', text: 'Adik' },
          { key: 'B', text: 'membaca' },
          { key: 'C', text: 'komik' },
          { key: 'D', text: 'di kamar' },
        ],
        correctAnswer: 'C',
        correctLabel: 'komik',
        explanation:
          'Objek adalah sasaran langsung dari kata kerja transitif "membaca", yaitu: komik.',
      },
      {
        id: 'okt-2',
        type: 'multiple_choice',
        prompt:
          'Preposisi yang tepat untuk melengkapi keterangan tempat pada kalimat "Ibu membeli sayur ... pasar" adalah...',
        options: [
          { key: 'A', text: 'pada' },
          { key: 'B', text: 'di' },
          { key: 'C', text: 'untuk' },
          { key: 'D', text: 'oleh' },
        ],
        correctAnswer: 'B',
        correctLabel: 'di',
        explanation:
          'Kata depan "di" digunakan untuk menunjukkan lokasi atau tempat berlangsungnya kegiatan.',
      },
      {
        id: 'okt-3',
        type: 'word_order',
        prompt: 'Susun kata berikut menjadi kalimat berpola S-P-O-K yang benar.',
        wordBank: ['buku', 'perpustakaan', 'Sinta', 'di', 'meminjam'],
        correctSentence: 'Sinta meminjam buku di perpustakaan.',
        explanation:
          'Sinta (S) meminjam (P) buku (O) di perpustakaan (K. Tempat).',
      },
    ],
  },
  {
    id: 'kata-kerja-predikat',
    level: 'Dasar',
    title: 'Kata Kerja sebagai Predikat',
    topic: 'Kata Kerja sebagai Predikat',
    passingScore: 70,
    lastScore: null,
    status: 'not_started',
    questions: [
      {
        id: 'kkp-1',
        type: 'multiple_choice',
        prompt:
          'Manakah kata yang berfungsi sebagai predikat dalam kalimat "Kakak menulis surat"?',
        options: [
          { key: 'A', text: 'Kakak' },
          { key: 'B', text: 'Kakak menulis' },
          { key: 'C', text: 'menulis' },
          { key: 'D', text: 'surat' },
        ],
        correctAnswer: 'C',
        correctLabel: 'menulis',
        explanation: 'Predikat adalah kata kerja: menulis.',
      },
      {
        id: 'kkp-2',
        type: 'multiple_choice',
        prompt: 'Bentuk baku dari "Saya beli roti" adalah...',
        options: [
          { key: 'A', text: 'Saya dibeli roti.' },
          { key: 'B', text: 'Saya membeli roti.' },
          { key: 'C', text: 'Saya belikan roti.' },
          { key: 'D', text: 'Roti membeli saya.' },
        ],
        correctAnswer: 'B',
        correctLabel: 'Saya membeli roti.',
        explanation: 'Kata kerja baku memakai imbuhan me-: membeli.',
      },
      {
        id: 'kkp-3',
        type: 'word_order',
        prompt: 'Susun kata berikut menjadi kalimat yang benar.',
        wordBank: ['lapangan', 'Kakak', 'di', 'bermain', 'bola'],
        correctSentence: 'Kakak bermain bola di lapangan.',
        explanation: 'Kakak (S) bermain (P) bola (O) di lapangan (K).',
      },
    ],
  },
];

export default function StudentQuizView({
  initialQuizzes = INITIAL_QUIZZES,
  onComplete,
}) {
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [searchQuery, setSearchQuery] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [isSavingResult, setIsSavingResult] = useState(false);

  // Mode tampilan: 'list' | 'taking' | 'result'
  const [viewMode, setViewMode] = useState('list');
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  // Jawaban user per soal: { [questionId]: 'A' | ['Kakak', 'bermain', ...] }
  const [userAnswers, setUserAnswers] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [latestResult, setLatestResult] = useState(null);

  useEffect(() => {
    setQuizzes(initialQuizzes);
  }, [initialQuizzes]);

  const activeQuiz = quizzes.find((q) => q.id === activeQuizId) || null;

  // Mulai / Ulangi Kuis
  const handleStartQuiz = (quiz) => {
    setActiveQuizId(quiz.id);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setShowConfirmModal(false);
    setLatestResult(null);
    setViewMode('taking');
  };

  // Pilih jawaban Pilihan Ganda
  const handleSelectOption = (questionId, optionKey) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  // Tambah kata ke susunan (Susun Kata)
  const handleAddWordChip = (questionId, word, indexInBank) => {
    const currentList = Array.isArray(userAnswers[questionId])
      ? userAnswers[questionId]
      : [];
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: [...currentList, { word, bankIdx: indexInBank }],
    }));
  };

  // Hapus kata dari susunan (Susun Kata)
  const handleRemoveWordChip = (questionId, removeIdx) => {
    const currentList = Array.isArray(userAnswers[questionId])
      ? userAnswers[questionId]
      : [];
    const updated = currentList.filter((_, idx) => idx !== removeIdx);
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: updated,
    }));
  };

  // Hitung berapa soal yang sudah dijawab
  const getAnsweredCount = (quiz) => {
    if (!quiz) return 0;
    return quiz.questions.filter((q) => {
      const ans = userAnswers[q.id];
      if (q.type === 'word_order') {
        return Array.isArray(ans) && ans.length > 0;
      }
      return Boolean(ans);
    }).length;
  };

  // Klik tombol Kumpulkan Jawaban
  const handleAttemptSubmit = () => {
    if (!activeQuiz) return;
    const answeredCount = getAnsweredCount(activeQuiz);
    const unansweredCount = activeQuiz.questions.length - answeredCount;

    if (unansweredCount > 0) {
      setShowConfirmModal(true);
    } else {
      finalizeSubmission();
    }
  };

  // Hitung Skor & Tampilkan Pembahasan
  const finalizeSubmission = async () => {
    if (!activeQuiz) return;
    setShowConfirmModal(false);

    let correctCount = 0;
    const reviewItems = activeQuiz.questions.map((q, idx) => {
      const rawAns = userAnswers[q.id];
      let isCorrect = false;
      let formattedUserAnswer = '(tidak dijawab)';

      if (q.type === 'multiple_choice') {
        if (rawAns) {
          const pickedOpt = q.options.find((o) => o.key === rawAns);
          formattedUserAnswer = pickedOpt ? pickedOpt.text : rawAns;
          isCorrect = rawAns === q.correctAnswer;
        }
      } else if (q.type === 'word_order') {
        if (Array.isArray(rawAns) && rawAns.length > 0) {
          const joined = rawAns.map((item) => item.word).join(' ') + '.';
          formattedUserAnswer = joined;
          isCorrect =
            joined.toLowerCase().replace(/\./g, '').trim() ===
            q.correctSentence.toLowerCase().replace(/\./g, '').trim();
        }
      }

      if (isCorrect) correctCount += 1;

      return {
        number: idx + 1,
        prompt: q.prompt,
        isCorrect,
        userAnswer: formattedUserAnswer,
        correctAnswer: q.correctLabel || q.correctSentence,
        explanation: q.explanation,
      };
    });

    const total = activeQuiz.questions.length;
    const score = Math.round((correctCount / total) * 100);
    const passed = score >= activeQuiz.passingScore;

    setIsSavingResult(true);
    setSubmissionError('');
    try {
      await onComplete?.({ quizId: activeQuiz.id, score });
    } catch (error) {
      setSubmissionError(error.message);
    } finally {
      setIsSavingResult(false);
    }

    // Simpan skor terakhir ke daftar kuis
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === activeQuiz.id
          ? {
              ...q,
              lastScore: score,
              status: passed ? 'passed' : 'attempted',
            }
          : q
      )
    );

    setLatestResult({
      quizTitle: activeQuiz.title,
      passingScore: activeQuiz.passingScore,
      score,
      passed,
      correctCount,
      wrongCount: total - correctCount,
      reviewItems,
    });

    setViewMode('result');
  };

  // =========================================================================
  // VIEW 3: HALAMAN HASIL & PEMBAHASAN KUIS
  // =========================================================================
  if (viewMode === 'result' && latestResult && activeQuiz) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        {submissionError && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <p>Hasil kuis belum tersimpan: {submissionError}</p>
            <button
              type="button"
              disabled={isSavingResult}
              onClick={async () => {
                setIsSavingResult(true);
                setSubmissionError('');
                try {
                  await onComplete?.({ quizId: activeQuiz.id, score: latestResult.score });
                } catch (error) {
                  setSubmissionError(error.message);
                } finally {
                  setIsSavingResult(false);
                }
              }}
              className="mt-2 font-bold underline disabled:opacity-60"
            >
              {isSavingResult ? 'Menyimpan...' : 'Coba simpan lagi'}
            </button>
          </div>
        )}
        {/* Kartu Ringkasan Skor Atas */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6">
          {/* Lingkaran Skor */}
          <div className="relative w-24 h-24 rounded-full border-[6px] border-slate-200 flex flex-col items-center justify-center shrink-0">
            <span
              className={`absolute -top-1.5 w-3 h-3 rounded-full ${
                latestResult.passed ? 'bg-emerald-500' : 'bg-red-600'
              }`}
            ></span>
            <span
              className={`text-3xl font-extrabold leading-none ${
                latestResult.passed ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {latestResult.score}
            </span>
            <span className="text-[11px] font-bold text-slate-400 mt-1">
              /100
            </span>
          </div>

          {/* Detail Kelulusan */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="text-xs font-semibold text-slate-500">
              {latestResult.quizTitle}
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Icon
                icon={
                  latestResult.passed
                    ? 'lucide:check-circle-2'
                    : 'lucide:x-circle'
                }
                className={`w-5 h-5 ${
                  latestResult.passed ? 'text-emerald-600' : 'text-red-600'
                }`}
              />
              <h2
                className={`text-lg md:text-xl font-extrabold uppercase tracking-wide ${
                  latestResult.passed ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {latestResult.passed ? 'LULUS' : 'BELUM LULUS'}
              </h2>
            </div>

            <p className="text-xs text-slate-500">
              Skor lulus: {latestResult.passingScore}.{' '}
              {latestResult.passed
                ? 'Selamat, kamu berhasil memahami materi dengan baik!'
                : 'Pelajari lagi materinya dan coba kembali.'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
              <span className="bg-[#E0F2FE] text-[#007EDA] text-xs font-extrabold px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
                <Icon icon="lucide:check" className="w-3.5 h-3.5" />
                <span>Benar {latestResult.correctCount}</span>
              </span>
              <span className="bg-red-50 text-red-600 text-xs font-extrabold px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
                <Icon icon="lucide:x" className="w-3.5 h-3.5" />
                <span>Salah {latestResult.wrongCount}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Kartu Pembahasan */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#007EDA] flex items-center justify-center">
              <Icon icon="lucide:lightbulb" className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-[#102A43]">
              Pembahasan
            </h3>
          </div>

          <div className="space-y-4">
            {latestResult.reviewItems.map((item) => (
              <div
                key={item.number}
                className={`rounded-2xl border p-5 space-y-3 ${
                  item.isCorrect
                    ? 'border-emerald-200 bg-emerald-50/15'
                    : 'border-red-200 bg-red-50/10'
                }`}
              >
                {/* Nomor & Pertanyaan */}
                <div className="flex items-start gap-3">
                  <span
                    className={`w-6 h-6 rounded-full text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                      item.isCorrect ? 'bg-emerald-600' : 'bg-red-600'
                    }`}
                  >
                    {item.number}
                  </span>
                  <h4 className="text-xs md:text-sm font-extrabold text-[#102A43] leading-relaxed">
                    {item.prompt}
                  </h4>
                </div>

                {/* Jawabanmu & Jawaban Benar */}
                <div className="pl-9 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon={
                        item.isCorrect
                          ? 'lucide:check-circle-2'
                          : 'lucide:x-circle'
                      }
                      className={`w-4 h-4 shrink-0 ${
                        item.isCorrect ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    />
                    <span className="text-slate-500 font-medium">
                      Jawabanmu:{' '}
                    </span>
                    <span
                      className={`font-extrabold ${
                        item.isCorrect ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {item.userAnswer}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Icon
                      icon="lucide:check-circle-2"
                      className="w-4 h-4 text-[#007EDA] shrink-0"
                    />
                    <span className="text-slate-500 font-medium">
                      Jawaban benar:{' '}
                    </span>
                    <span className="font-extrabold text-[#007EDA]">
                      {item.correctAnswer}
                    </span>
                  </div>

                  {/* Kotak Penjelasan */}
                  <div className="mt-2.5 bg-[#EEF4FF]/80 border border-slate-200/60 rounded-xl px-4 py-2.5 flex items-center gap-2 text-slate-600">
                    <Icon
                      icon="lucide:lightbulb"
                      className="w-4 h-4 text-[#007EDA] shrink-0"
                    />
                    <span>{item.explanation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tombol Navigasi Bawah */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setViewMode('list');
              setActiveQuizId(null);
            }}
            className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#102A43] text-xs font-extrabold inline-flex items-center gap-2 transition cursor-pointer"
          >
            <Icon icon="lucide:list" className="w-4 h-4" />
            <span>Kembali ke Daftar Kuis</span>
          </button>

          <button
            type="button"
            onClick={() => handleStartQuiz(activeQuiz)}
            className="px-5 py-3 rounded-xl bg-[#007EDA] hover:bg-[#0066B2] text-white text-xs font-extrabold inline-flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Icon icon="lucide:rotate-ccw" className="w-4 h-4" />
            <span>Kerjakan Lagi</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: HALAMAN PENGERJAAN SOAL KUIS
  // =========================================================================
  if (viewMode === 'taking' && activeQuiz) {
    const totalQuestions = activeQuiz.questions.length;
    const currentQ = activeQuiz.questions[currentQuestionIdx];
    const answeredCount = getAnsweredCount(activeQuiz);
    const unansweredCount = totalQuestions - answeredCount;
    const progressPercent = Math.round(
      ((currentQuestionIdx + 1) / totalQuestions) * 100
    );

    const arrangedChips = Array.isArray(userAnswers[currentQ.id])
      ? userAnswers[currentQ.id]
      : [];

    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        {/* Card Header Progres & Navigasi Nomor Soal */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#007EDA]">
                {activeQuiz.topic}
              </div>
              <h2 className="text-lg md:text-xl font-extrabold text-[#102A43] mt-0.5">
                {activeQuiz.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full inline-flex items-center gap-1.5 ${
                  activeQuiz.level === 'Menengah'
                    ? 'bg-[#FEF3C7] text-[#B45309]'
                    : 'bg-[#E0F2FE] text-[#007EDA]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                <span>{activeQuiz.level}</span>
              </span>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                Skor lulus <strong>{activeQuiz.passingScore}</strong>
              </span>
            </div>
          </div>

          {/* Info Soal & Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">
                Soal {currentQuestionIdx + 1} dari {totalQuestions}
              </span>
              <span className="font-extrabold text-[#007EDA]">
                {answeredCount} terjawab
              </span>
            </div>

            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#007EDA] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Kotak Nomor Soal (1, 2, 3) */}
          <div className="flex items-center gap-2 pt-1">
            {activeQuiz.questions.map((qItem, idx) => {
              const isCurrent = idx === currentQuestionIdx;
              const isAnswered =
                qItem.type === 'word_order'
                  ? Array.isArray(userAnswers[qItem.id]) &&
                    userAnswers[qItem.id].length > 0
                  : Boolean(userAnswers[qItem.id]);

              return (
                <button
                  key={qItem.id}
                  type="button"
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`w-9 h-9 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                    isCurrent
                      ? 'bg-[#007EDA] text-white shadow-xs'
                      : isAnswered
                      ? 'bg-[#E0F2FE] text-[#007EDA] border border-[#7CC4FA]'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-[#007EDA]'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Pertanyaan */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-5">
          {/* Badge Tipe Soal */}
          <div>
            <span className="inline-flex items-center gap-1.5 bg-[#EEF4FF] text-[#007EDA] text-xs font-extrabold px-3.5 py-1 rounded-full">
              <Icon
                icon={
                  currentQ.type === 'multiple_choice'
                    ? 'lucide:disc'
                    : 'lucide:arrow-left-right'
                }
                className="w-3.5 h-3.5"
              />
              <span>
                {currentQ.type === 'multiple_choice'
                  ? 'Pilihan Ganda'
                  : 'Susun Kata'}
              </span>
            </span>
          </div>

          {/* Teks Pertanyaan */}
          <h3 className="text-base md:text-lg font-extrabold text-[#102A43] leading-snug">
            {currentQ.prompt}
          </h3>

          {/* Tipe A: Pilihan Ganda (A, B, C, D) */}
          {currentQ.type === 'multiple_choice' && (
            <div className="space-y-3 pt-1">
              {currentQ.options.map((opt) => {
                const isSelected = userAnswers[currentQ.id] === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, opt.key)}
                    className={`w-full rounded-xl p-3.5 flex items-center justify-between text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-2 border-[#007EDA] bg-[#EEF4FF]/35 shadow-2xs'
                        : 'border border-slate-200/90 bg-white hover:border-[#007EDA]/50 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`w-8 h-8 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 transition ${
                          isSelected
                            ? 'bg-[#007EDA] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span className="text-xs md:text-sm font-semibold text-[#102A43]">
                        {opt.text}
                      </span>
                    </div>

                    {isSelected && (
                      <Icon
                        icon="lucide:check-circle-2"
                        className="w-5 h-5 text-[#007EDA] shrink-0"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Tipe B: Susun Kata Interaktif */}
          {currentQ.type === 'word_order' && (
            <div className="space-y-4 pt-1">
              {/* Kotak Hasil Susunan Kalimat */}
              <div className="min-h-[68px] bg-[#F8FAFC] border-2 border-dashed border-slate-300 rounded-xl p-3.5 flex flex-wrap items-center gap-2">
                {arrangedChips.length === 0 ? (
                  <span className="text-xs text-slate-400">
                    Klik potongan kata di bawah secara berurutan untuk menyusun
                    kalimat...
                  </span>
                ) : (
                  arrangedChips.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleRemoveWordChip(currentQ.id, idx)}
                      title="Klik untuk menghapus kata ini"
                      className="bg-[#007EDA] text-white text-xs font-extrabold px-3.5 py-2 rounded-lg shadow-2xs hover:bg-red-500 transition cursor-pointer"
                    >
                      {chip.word}
                    </button>
                  ))
                )}
              </div>

              {/* Pilihan Kata Acak */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {currentQ.wordBank.map((word, bankIdx) => {
                    const isUsed = arrangedChips.some(
                      (c) => c.bankIdx === bankIdx
                    );
                    return (
                      <button
                        key={bankIdx}
                        type="button"
                        disabled={isUsed}
                        onClick={() =>
                          handleAddWordChip(currentQ.id, word, bankIdx)
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition ${
                          isUsed
                            ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                            : 'bg-white border-slate-200 text-[#102A43] hover:border-[#007EDA] hover:bg-[#EEF4FF] cursor-pointer shadow-2xs'
                        }`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>

                {arrangedChips.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setUserAnswers((prev) => ({
                        ...prev,
                        [currentQ.id]: [],
                      }))
                    }
                    className="text-xs font-bold text-slate-500 hover:text-red-600 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Icon icon="lucide:rotate-ccw" className="w-3.5 h-3.5" />
                    <span>Reset Susunan</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Baris Tombol Navigasi Bawah */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            disabled={currentQuestionIdx === 0}
            onClick={() =>
              setCurrentQuestionIdx((idx) => Math.max(0, idx - 1))
            }
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 transition ${
              currentQuestionIdx === 0
                ? 'bg-slate-200/70 text-slate-400 cursor-not-allowed'
                : 'bg-white border border-slate-200 text-[#102A43] hover:bg-slate-50 cursor-pointer'
            }`}
          >
            <Icon icon="lucide:chevron-left" className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          <div className="flex items-center gap-3">
            {currentQuestionIdx < totalQuestions - 1 && (
              <button
                type="button"
                onClick={() =>
                  setCurrentQuestionIdx((idx) =>
                    Math.min(totalQuestions - 1, idx + 1)
                  )
                }
                className="px-5 py-2.5 rounded-xl bg-[#007EDA] hover:bg-[#0066B2] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <span>Berikutnya</span>
                <Icon icon="lucide:chevron-right" className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleAttemptSubmit}
              className="px-5 py-2.5 rounded-xl bg-[#EAB308] hover:bg-[#CA8A04] text-[#102A43] text-xs font-extrabold inline-flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Icon icon="lucide:send-horizontal" className="w-4 h-4" />
              <span>Kumpulkan Jawaban</span>
            </button>
          </div>
        </div>

        {/* ================= MODAL KONFIRMASI BELUM DIJAWAB ================= */}
        {showConfirmModal && (
          <div
            onClick={() => setShowConfirmModal(false)}
            className="fixed inset-0 bg-[#102A43]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-sm w-full p-7 text-center shadow-2xl space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-[#FCD34D] text-[#102A43] flex items-center justify-center mx-auto">
                <Icon icon="lucide:alert-triangle" className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-[#102A43]">
                  Masih ada {unansweredCount} soal belum dijawab.
                </h4>
                <p className="text-xs text-slate-500">
                  Tetap kumpulkan jawaban?
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#102A43] text-xs font-extrabold transition cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={finalizeSubmission}
                  className="flex-1 py-2.5 rounded-xl bg-[#007EDA] hover:bg-[#0066B2] text-white text-xs font-extrabold transition cursor-pointer"
                >
                  Kumpulkan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: DAFTAR KUIS (UJI PEMAHAMAN)
  // =========================================================================
  const filteredQuizzes = quizzes.filter(
    (q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Header Judul Section */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#007EDA]">
          UJI PEMAHAMAN
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#102A43]">
          Kuis
        </h2>
        <p className="text-xs md:text-sm text-slate-500 max-w-xl leading-relaxed">
          Kerjakan kuis pilihan ganda dan susun kata. Skor dihitung otomatis;
          kamu lulus jika nilai ≥ skor lulus.
        </p>
      </div>

      {/* Search Bar Full Width */}
      <div className="relative">
        <Icon
          icon="lucide:search"
          className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari judul kuis..."
          className="w-full bg-white border border-slate-200/90 rounded-2xl pl-11 pr-4 py-3.5 text-xs md:text-sm text-[#102A43] placeholder-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#007EDA]/30"
        />
      </div>

      {/* Grid Kartu Kuis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => {
          const isPassed = quiz.status === 'passed';
          const hasAttempted = quiz.lastScore !== null;

          return (
            <div
              key={quiz.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-5 hover:shadow-md transition"
            >
              <div className="space-y-4">
                {/* Top Badges: Level Kiri & Status Kanan */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[11px] font-extrabold px-3 py-1 rounded-full inline-flex items-center gap-1.5 ${
                      quiz.level === 'Menengah'
                        ? 'bg-[#FEF3C7] text-[#B45309]'
                        : 'bg-[#E0F2FE] text-[#007EDA]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>{quiz.level}</span>
                  </span>

                  {isPassed ? (
                    <span className="bg-[#E0F2FE] text-[#007EDA] text-[11px] font-extrabold px-3 py-1 rounded-full inline-flex items-center gap-1">
                      <Icon
                        icon="lucide:check-circle-2"
                        className="w-3.5 h-3.5"
                      />
                      <span>Lulus</span>
                    </span>
                  ) : (
                    <span className="text-slate-600 text-[11px] font-bold inline-flex items-center gap-1.5">
                      <Icon
                        icon="lucide:file-text"
                        className="w-3.5 h-3.5 text-slate-400"
                      />
                      <span>Belum dikerjakan</span>
                    </span>
                  )}
                </div>
                {filteredQuizzes.length === 0 && (
                  <p className="rounded-xl bg-white px-5 py-8 text-center text-sm text-slate-500">
                    Belum ada kuis yang tersedia.
                  </p>
                )}

                {/* Judul & Topik Materi */}
                <div>
                  <h3 className="text-base font-extrabold text-[#102A43]">
                    {quiz.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <Icon icon="lucide:book-open" className="w-3.5 h-3.5" />
                    <span>{quiz.topic}</span>
                  </div>
                </div>

                {/* Kotak Statistik: Soal | Skor lulus | Nilai terakhir */}
                <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl py-3.5 px-2 grid grid-cols-3 divide-x divide-slate-200/70 text-center">
                  <div>
                    <div className="text-sm font-extrabold text-[#102A43]">
                      {quiz.questions.length}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Soal
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-extrabold text-[#102A43]">
                      {quiz.passingScore}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Skor lulus
                    </div>
                  </div>

                  <div>
                    <div
                      className={`text-sm font-extrabold ${
                        isPassed
                          ? 'text-[#007EDA]'
                          : hasAttempted
                          ? 'text-[#102A43]'
                          : 'text-slate-400'
                      }`}
                    >
                      {hasAttempted ? quiz.lastScore : '-'}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Nilai terakhir
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi Bawah */}
              {hasAttempted ? (
                <button
                  type="button"
                  onClick={() => handleStartQuiz(quiz)}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#007EDA] bg-white hover:bg-[#EEF4FF] text-[#007EDA] text-xs font-extrabold inline-flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Icon icon="lucide:rotate-ccw" className="w-3.5 h-3.5" />
                  <span>Kerjakan Lagi</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStartQuiz(quiz)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#007EDA] hover:bg-[#0066B2] text-white text-xs font-extrabold inline-flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer"
                >
                  <Icon
                    icon="lucide:play"
                    className="w-3.5 h-3.5 fill-current"
                  />
                  <span>Mulai Kuis</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}