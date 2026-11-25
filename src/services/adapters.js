export function adaptMaterial(material) {
  const createdAt = material.created_at ? new Date(material.created_at) : null;

  return {
    id: material.id_materi,
    title: material.judul,
    description: material.deskripsi || '',
    author: material.guru?.nama || 'Guru Hearo',
    authorInitials: (material.guru?.nama || 'GH')
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    publishedAt: createdAt && !Number.isNaN(createdAt.getTime())
      ? `Diterbitkan ${createdAt.toLocaleDateString('id-ID')}`
      : 'Materi terbaru',
    thumbnailType: 'spok-diagram',
    totalPages: 1,
  };
}

export function adaptQuiz(quiz) {
  const questions = (quiz.soal || []).map((question) => {
    const words = (question.kata_soal || [])
      .slice()
      .sort((a, b) => (a.urutan_benar ?? 0) - (b.urutan_benar ?? 0))
      .map((word) => word.kata);
    const correctSentence = question.kalimat_benar || words.join(' ');

    return {
      id: question.id_soal,
      type: 'word_order',
      prompt: question.instruksi,
      wordBank: words.length ? [...words].reverse() : correctSentence.split(/\s+/).reverse(),
      correctSentence,
      explanation: `Susunan kalimat yang benar: ${correctSentence}`,
    };
  });

  return {
    id: quiz.id_kuis,
    title: quiz.judul,
    topic: quiz.materi?.judul || 'Materi pembelajaran',
    level: 'Dasar',
    passingScore: quiz.skor_lulus,
    lastScore: null,
    status: 'not_started',
    questions,
  };
}

export function adaptLearningHistory(item) {
  const score = Number(item.skor) || 0;
  const passingScore = Number(item.kuis?.skor_lulus) || 0;
  const timestamp = item.tanggal_pengerjaan || item.created_at;

  return {
    id: item.id_riwayat || item.id,
    quizId: item.id_kuis || item.kuis?.id_kuis,
    date: timestamp
      ? new Date(timestamp).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '',
    quizTitle: item.kuis?.judul || 'Kuis',
    level: 'Dasar',
    score,
    passingScore,
    passed: score >= passingScore,
    status: score >= passingScore ? 'Lulus' : 'Belum Lulus',
    reviewItems: [],
  };
}
