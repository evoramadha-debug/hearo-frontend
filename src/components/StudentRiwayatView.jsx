import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const DEFAULT_HISTORY_ROWS = [
  {
    id: 'hist-1',
    date: '10 Nov 2026',
    quizTitle: 'Objek dan Keterangan Tempat',
    level: 'Menengah',
    score: 85,
    passingScore: 75,
    passed: true,
    reviewItems: [
      {
        number: 1,
        prompt:
          'Manakah unsur yang berperan sebagai Objek dalam kalimat "Adik membaca komik di kamar"?',
        isCorrect: true,
        userAnswer: 'komik',
        correctAnswer: 'komik',
        explanation:
          'Objek adalah sasaran langsung dari kata kerja transitif "membaca", yaitu: komik.',
      },
      {
        number: 2,
        prompt:
          'Preposisi yang tepat untuk melengkapi keterangan tempat pada kalimat "Ibu membeli sayur ... pasar" adalah...',
        isCorrect: true,
        userAnswer: 'di',
        correctAnswer: 'di',
        explanation:
          'Kata depan "di" digunakan untuk menunjukkan lokasi atau tempat berlangsungnya kegiatan.',
      },
      {
        number: 3,
        prompt: 'Susun kata berikut menjadi kalimat berpola S-P-O-K yang benar.',
        isCorrect: false,
        userAnswer: 'Sinta meminjam di perpustakaan buku.',
        correctAnswer: 'Sinta meminjam buku di perpustakaan.',
        explanation:
          'Sinta (S) meminjam (P) buku (O) di perpustakaan (K. Tempat).',
      },
    ],
  },
  {
    id: 'hist-2',
    date: '28 Okt 2026',
    quizTitle: 'Kata Kerja sebagai Predikat',
    level: 'Dasar',
    score: 0,
    passingScore: 70,
    passed: false,
    reviewItems: [
      {
        number: 1,
        prompt:
          'Manakah kata yang berfungsi sebagai predikat dalam kalimat "Kakak menulis surat"?',
        isCorrect: false,
        userAnswer: 'Kakak',
        correctAnswer: 'menulis',
        explanation: 'Predikat adalah kata kerja: menulis.',
      },
      {
        number: 2,
        prompt: 'Bentuk baku dari "Saya beli roti" adalah...',
        isCorrect: false,
        userAnswer: '(tidak dijawab)',
        correctAnswer: 'Saya membeli roti.',
        explanation: 'Kata kerja baku memakai imbuhan me-: membeli.',
      },
      {
        number: 3,
        prompt: 'Susun kata berikut menjadi kalimat yang benar.',
        isCorrect: false,
        userAnswer: '(tidak dijawab)',
        correctAnswer: 'Kakak bermain bola di lapangan.',
        explanation: 'Kakak (S) bermain (P) bola (O) di lapangan (K).',
      },
    ],
  },
];

const DEFAULT_CHART_POINTS = [
  { label: 'Kuis 1', score: 85, passed: true },
  { label: 'Kuis 2', score: 71, passed: true },
  { label: 'Kuis 3', score: 57, passed: false },
  { label: 'Kuis 4', score: 42, passed: false },
  { label: 'Kuis 5', score: 28, passed: false },
  { label: 'Kuis 6', score: 14, passed: false },
  { label: 'Kuis 7', score: 0, passed: false },
];

export default function StudentRiwayatView({
  recentAttempts = [],
  liveData = false,
}) {
  const [levelFilter, setLevelFilter] = useState('Semua Level');
  const [selectedReview, setSelectedReview] = useState(null);

  // Gabungkan riwayat baru (jika siswa baru saja mengerjakan kuis) dengan data riwayat bawaan
  const allRows = liveData
    ? recentAttempts
    : [...recentAttempts, ...DEFAULT_HISTORY_ROWS];

  const filteredRows = allRows.filter((row) =>
    levelFilter === 'Semua Level' ? true : row.level === levelFilter
  );

  // Hitung statistik dinamis jika ada pengerjaan baru, atau tampilkan nilai bawaan desain UI
  const hasNewAttempts = recentAttempts.length > 0;
  const averageScore = allRows.length
    ? Math.round(allRows.reduce((acc, item) => acc + item.score, 0) / allRows.length)
    : 0;
  const totalAttempts = liveData ? allRows.length : 7 + recentAttempts.length;
  const passedQuizCount = liveData
    ? allRows.filter((item) => item.passed).length
    : hasNewAttempts
      ? Math.min(4, 3 + recentAttempts.filter((r) => r.passed).length)
      : 3;
  const masteryPercent = liveData
    ? totalAttempts
      ? Math.round((passedQuizCount / totalAttempts) * 100)
      : 0
    : hasNewAttempts
      ? Math.round((passedQuizCount / 4) * 100)
      : 50;

  // Titik data grafik progres
  const chartData = liveData
    ? recentAttempts.length
      ? recentAttempts.slice(0, 7).reverse().map((attempt, index) => ({
          label: `Kuis ${index + 1}`,
          score: attempt.score,
          passed: attempt.passed,
        }))
      : [
          { label: 'Mulai', score: 0, passed: false },
          { label: 'Belum ada data', score: 0, passed: false },
        ]
    : hasNewAttempts
      ? [
        ...DEFAULT_CHART_POINTS.slice(0, 6),
        {
          label: 'Kuis 7',
          score: recentAttempts[0].score,
          passed: recentAttempts[0].passed,
        },
        ]
      : DEFAULT_CHART_POINTS;

  // Koordinat SVG untuk grafik area
  const svgWidth = 760;
  const svgHeight = 200;
  const padLeft = 42;
  const padRight = 24;
  const padTop = 22;
  const padBottom = 28;
  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  const getX = (index) =>
    padLeft + (index / (chartData.length - 1)) * plotW;
  const getY = (score) =>
    padTop + ((100 - Math.max(0, Math.min(100, score))) / 100) * plotH;

  const linePoints = chartData
    .map((pt, idx) => `${getX(idx)},${getY(pt.score)}`)
    .join(' ');

  const areaPoints = `${getX(0)},${padTop + plotH} ${linePoints} ${getX(
    chartData.length - 1
  )},${padTop + plotH}`;

  const passingLineY = getY(72.5); // Garis merah putus-putus rata-rata skor lulus

  // Kalkulasi SVG Ring untuk Persentase Penguasaan
  const ringRadius = 26;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset =
    ringCircumference - (masteryPercent / 100) * ringCircumference;

  return (
    <div className="space-y-6 pb-8">
      {/* Header Judul Section */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#007EDA]">
          PERKEMBANGAN BELAJAR
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#102A43]">
          Riwayat Belajar
        </h2>
        <p className="text-xs md:text-sm text-slate-500 max-w-xl leading-relaxed">
          Level, nilai, dan persentase penguasaanmu dari kuis yang sudah
          dikerjakan.
        </p>
      </div>

      {/* ================= 1. DUA KARTU RINGKASAN ATAS ================= */}
      <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
        {/* Kartu Kiri: Rata-rata Nilai */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
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
            <span className="text-xs font-bold text-slate-400">/100</span>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Kuis lulus {passedQuizCount} dari 4 • {totalAttempts} pengerjaan
          </div>
        </div>

        {/* Kartu Kanan: Persentase Penguasaan */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex items-center gap-4">
          {/* Circular Progress Ring */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r={ringRadius}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="6"
              />
              <circle
                cx="32"
                cy="32"
                r={ringRadius}
                fill="none"
                stroke="#007EDA"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
              />
            </svg>
            <span className="absolute text-xs font-extrabold text-[#102A43]">
              {masteryPercent}%
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

      {/* ================= 2. GRAFIK PROGRES NILAI ================= */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-7 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#007EDA] flex items-center justify-center shrink-0">
            <Icon icon="lucide:trending-up" className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-extrabold text-[#102A43]">
              Grafik Progres Nilai
            </h3>
            <p className="text-[11px] text-slate-400">
              Garis merah putus-putus = rata-rata skor lulus
            </p>
          </div>
        </div>

        {/* SVG Area Chart */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full min-w-[540px] h-auto select-none"
          >
            <defs>
              <linearGradient
                id="hearoScoreAreaGrad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#007EDA" stopOpacity="0.92" />
                <stop offset="65%" stopColor="#38BDF8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#007EDA" stopOpacity="0.03" />
              </linearGradient>
            </defs>

            {/* Label Vertikal "Skor" */}
            <text
              x="10"
              y={padTop + plotH / 2}
              fill="#64748B"
              fontSize="9"
              fontWeight="700"
              textAnchor="middle"
              transform={`rotate(-90, 10, ${padTop + plotH / 2})`}
            >
              Skor
            </text>

            {/* Grid Horizontal & Label Sumbu Y (100, 80, 60, 40, 20) */}
            {[100, 80, 60, 40, 20].map((val) => {
              const yPos = getY(val);
              return (
                <g key={val}>
                  <line
                    x1={padLeft}
                    y1={yPos}
                    x2={svgWidth - padRight}
                    y2={yPos}
                    stroke="#F1F5F9"
                    strokeWidth="1"
                  />
                  <text
                    x={padLeft - 8}
                    y={yPos + 3}
                    fill="#94A3B8"
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="end"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Area Fill di Bawah Garis */}
            <polygon points={areaPoints} fill="url(#hearoScoreAreaGrad)" />

            {/* Garis Merah Putus-putus Rata-rata Skor Lulus */}
            <line
              x1={padLeft}
              y1={passingLineY}
              x2={svgWidth - padRight}
              y2={passingLineY}
              stroke="#EF4444"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Garis Utama Progres Biru */}
            <polyline
              fill="none"
              stroke="#007EDA"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={linePoints}
            />

            {/* Titik Awal & Akhir + Label Sumbu X (Kuis 1 - Kuis 7) */}
            {chartData.map((pt, idx) => {
              const cx = getX(idx);
              const cy = getY(pt.score);
              const isEndpoint = idx === 0 || idx === chartData.length - 1;

              return (
                <g key={pt.label}>
                  <text
                    x={cx}
                    y={svgHeight - 6}
                    fill="#64748B"
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {pt.label}
                  </text>

                  {isEndpoint && (
                    <>
                      <circle
                        cx={cx}
                        cy={cy}
                        r="4.5"
                        fill={pt.passed ? '#007EDA' : '#FFFFFF'}
                        stroke={pt.passed ? '#FFFFFF' : '#DC2626'}
                        strokeWidth="2"
                      />
                      <text
                        x={cx + (idx === 0 ? 6 : 0)}
                        y={cy - 9}
                        fill="#102A43"
                        fontSize="10"
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        {pt.score}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </section>

      {/* ================= 3. TABEL RIWAYAT NILAI KUIS ================= */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-7 space-y-5">
        {/* Header Tabel & Dropdown Filter Level */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#007EDA] flex items-center justify-center">
              <Icon icon="lucide:align-left" className="w-4 h-4" />
            </div>
            <h3 className="text-sm md:text-base font-extrabold text-[#102A43]">
              Riwayat Nilai Kuis
            </h3>
          </div>

          <div className="relative">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-white border border-slate-200/90 rounded-xl pl-3.5 pr-8 py-2 text-xs font-bold text-[#102A43] appearance-none focus:outline-none focus:ring-2 focus:ring-[#007EDA]/30 cursor-pointer"
            >
              <option value="Semua Level">Semua Level</option>
              <option value="Dasar">Dasar</option>
              <option value="Menengah">Menengah</option>
            </select>
            <Icon
              icon="lucide:chevron-down"
              className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
        </div>

        {/* Tabel Responsif */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">TANGGAL</th>
                <th className="py-3 px-3">KUIS</th>
                <th className="py-3 px-3">LEVEL</th>
                <th className="py-3 px-3 text-center">SKOR</th>
                <th className="py-3 px-3 text-center">SKOR LULUS</th>
                <th className="py-3 px-3 text-center">STATUS</th>
                <th className="py-3 px-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="py-4 px-3 text-slate-500 font-medium whitespace-nowrap">
                    {row.date}
                  </td>

                  <td className="py-4 px-3 font-extrabold text-[#102A43]">
                    {row.quizTitle}
                  </td>

                  <td className="py-4 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full ${
                        row.level === 'Menengah'
                          ? 'bg-[#FEF3C7] text-[#B45309]'
                          : 'bg-[#E0F2FE] text-[#007EDA]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>{row.level}</span>
                    </span>
                  </td>

                  <td
                    className={`py-4 px-3 text-center font-extrabold ${
                      row.passed ? 'text-[#007EDA]' : 'text-red-600'
                    }`}
                  >
                    {row.score}
                  </td>

                  <td className="py-4 px-3 text-center text-slate-600 font-semibold">
                    {row.passingScore}
                  </td>

                  <td className="py-4 px-3 text-center whitespace-nowrap">
                    {row.passed ? (
                      <span className="inline-flex items-center gap-1 bg-[#E0F2FE] text-[#007EDA] text-[11px] font-extrabold px-3 py-1 rounded-full">
                        <Icon icon="lucide:check" className="w-3 h-3" />
                        <span>Lulus</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-[11px] font-extrabold px-3 py-1 rounded-full">
                        <Icon icon="lucide:x-circle" className="w-3 h-3" />
                        <span>Belum Lulus</span>
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedReview(row)}
                      className="text-xs font-extrabold text-[#007EDA] hover:underline cursor-pointer"
                    >
                      Pembahasan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= MODAL PEMBAHASAN RIWAYAT KUIS ================= */}
      {selectedReview && (
        <div
          onClick={() => setSelectedReview(null)}
          className="fixed inset-0 bg-[#102A43]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden"
          >
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#102A43]">
                    Pembahasan: {selectedReview.quizTitle}
                  </h3>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      selectedReview.passed
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    Skor {selectedReview.score}/100
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Dikerjakan pada {selectedReview.date} • Level{' '}
                  {selectedReview.level}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <Icon icon="lucide:x" className="w-4 h-4" />
              </button>
            </div>

            {/* Daftar Review Soal */}
            <div className="p-6 overflow-y-auto space-y-4">
              {selectedReview.reviewItems &&
              selectedReview.reviewItems.length > 0 ? (
                selectedReview.reviewItems.map((item) => (
                  <div
                    key={item.number}
                    className={`rounded-2xl border p-4 space-y-2.5 ${
                      item.isCorrect
                        ? 'border-emerald-200 bg-emerald-50/15'
                        : 'border-red-200 bg-red-50/10'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                          item.isCorrect ? 'bg-emerald-600' : 'bg-red-600'
                        }`}
                      >
                        {item.number}
                      </span>
                      <p className="text-xs md:text-sm font-extrabold text-[#102A43] leading-relaxed">
                        {item.prompt}
                      </p>
                    </div>

                    <div className="pl-8 space-y-1 text-xs">
                      <div>
                        <span className="text-slate-500">Jawabanmu: </span>
                        <span
                          className={`font-extrabold ${
                            item.isCorrect
                              ? 'text-emerald-700'
                              : 'text-red-600'
                          }`}
                        >
                          {item.userAnswer}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Jawaban benar: </span>
                        <span className="font-extrabold text-[#007EDA]">
                          {item.correctAnswer}
                        </span>
                      </div>
                      <div className="mt-2 bg-[#EEF4FF] rounded-xl px-3.5 py-2 text-slate-600 flex items-center gap-2">
                        <Icon
                          icon="lucide:lightbulb"
                          className="w-4 h-4 text-[#007EDA] shrink-0"
                        />
                        <span>{item.explanation}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-6">
                  Detail pembahasan untuk sesi kuis ini telah tersimpan.
                </p>
              )}
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="px-5 py-2 bg-[#007EDA] hover:bg-[#0066B2] text-white text-xs font-extrabold rounded-xl transition cursor-pointer"
              >
                Tutup Pembahasan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}