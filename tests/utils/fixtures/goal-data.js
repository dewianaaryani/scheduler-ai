/**
 * Test Fixtures for Goal Data
 * Provides consistent test data for goal creation and validation tests
 */

export const validGoalInputs = {
  programming: {
    initialValue: 'Saya ingin belajar JavaScript selama 4 minggu',
    expectedTitle: 'Belajar JavaScript',
    expectedDuration: 28, // days
    expectedEmoji: '🚀'
  },
  
  language: {
    initialValue: 'Belajar bahasa Inggris untuk TOEFL dalam 3 bulan',
    expectedTitle: 'Belajar Bahasa Inggris TOEFL',
    expectedDuration: 90,
    expectedEmoji: '📚'
  },
  
  fitness: {
    initialValue: 'Menurunkan berat badan 10kg dalam 6 bulan',
    expectedTitle: 'Program Penurunan Berat Badan',
    expectedDuration: 180,
    expectedEmoji: '💪'
  },
  
  skill: {
    initialValue: 'Belajar desain grafis dengan Photoshop selama 2 bulan',
    expectedTitle: 'Belajar Desain Grafis',
    expectedDuration: 60,
    expectedEmoji: '🎨'
  },
  
  quran: {
    initialValue: 'Hafal Quran 5 juz dalam 5 bulan',
    expectedTitle: 'Hafal Al-Quran 5 Juz',
    expectedDuration: 150,
    expectedEmoji: '📖'
  }
};

export const invalidGoalInputs = {
  tooLong: {
    initialValue: 'Belajar programming untuk menjadi expert dalam 12 bulan',
    expectedError: 'Durasi maksimal adalah 6 bulan'
  },
  
  tooVague: {
    initialValue: 'Belajar',
    expectedError: 'Mohon berikan deskripsi yang lebih detail'
  },
  
  pastDate: {
    initialValue: 'Belajar JavaScript mulai kemarin',
    expectedError: 'Tanggal mulai harus minimal besok'
  },
  
  endBeforeStart: {
    initialValue: 'Belajar JavaScript selesai kemarin mulai besok',
    expectedError: 'Tanggal selesai harus setelah tanggal mulai'
  }
};

export const csvResponses = {
  complete: `complete,"Belajar JavaScript","Mempelajari JavaScript dari dasar hingga mahir","2025-08-11","2025-09-11","🚀","Tujuan Anda sudah lengkap dan siap dijalankan",""`,
  
  incomplete: `incomplete,"Belajar Programming","Mempelajari bahasa pemrograman",null,null,"💻","Mohon tentukan bahasa pemrograman dan durasi belajar","language;dates"`,
  
  withSpecialChars: `complete,"React & Vue.js","Framework JavaScript: React, Vue, dan tools modern","2025-08-11","2025-09-11","⚛️","Siap memulai pembelajaran framework!",""`,
  
  longDuration: `complete,"Master Programming","Program pembelajaran komprehensif","2025-08-11","2026-03-11","🎯","Durasi terlalu panjang, maksimal 6 bulan",""`
};

export const mockScheduleData = {
  sevenDays: [
    {
      day: 1,
      date: '2025-08-11',
      startTime: '09:00',
      endTime: '11:00',
      title: 'Hari 1 - Senin',
      description: 'Senin - Perencanaan minggu 1: Review progress minggu lalu, set target minggu ini. Mulai dengan konsep dasar, buat roadmap pembelajaran untuk 7 hari ke depan.',
      emoji: '🚀',
      percent: 14
    },
    {
      day: 2,
      date: '2025-08-12',
      startTime: '09:00',
      endTime: '11:00',
      title: 'Hari 2 - Selasa',
      description: 'Selasa - Deep learning: Fokus pada satu topik utama hari ini. Pelajari teori mendalam, tonton 2-3 video tutorial, buat catatan komprehensif untuk referensi.',
      emoji: '📚',
      percent: 28
    },
    {
      day: 3,
      date: '2025-08-13',
      startTime: '09:00',
      endTime: '10:30',
      title: 'Hari 3 - Rabu',
      description: 'Rabu - Praktik: Implementasikan konsep yang dipelajari kemarin. Buat mini project atau selesaikan 5 latihan soal. Dokumentasikan kode dan pembelajaran.',
      emoji: '💻',
      percent: 42
    },
    {
      day: 4,
      date: '2025-08-14',
      startTime: '09:00',
      endTime: '11:00',
      title: 'Hari 4 - Kamis',
      description: 'Kamis - Eksplorasi: Pelajari topik terkait atau advanced features. Baca dokumentasi resmi, eksperimen dengan edge cases. Progress saat ini: 57%.',
      emoji: '🔍',
      percent: 57
    },
    {
      day: 5,
      date: '2025-08-15',
      startTime: '09:00',
      endTime: '10:00',
      title: 'Hari 5 - Jumat',
      description: 'Jumat - Kolaborasi: Share progress di forum/community. Minta feedback, bantu yang lain, atau ikuti online workshop. Network dengan learner lain.',
      emoji: '🤝',
      percent: 71
    },
    {
      day: 6,
      date: '2025-08-16',
      startTime: '10:00',
      endTime: '11:00',
      title: 'Hari 6 - Sabtu',
      description: 'Sabtu - Project day: Dedikasikan waktu untuk project yang lebih besar. Gabungkan semua pembelajaran minggu ini dalam satu implementasi nyata.',
      emoji: '🛠️',
      percent: 85
    },
    {
      day: 7,
      date: '2025-08-17',
      startTime: '10:00',
      endTime: '11:30',
      title: 'Hari 7 - Minggu',
      description: 'Minggu - Review & refleksi: Evaluasi pencapaian minggu 1. Apa yang berhasil? Apa yang perlu diperbaiki? Siapkan materi untuk minggu depan.',
      emoji: '✅',
      percent: 100
    }
  ],
  
  quranHafalan: [
    {
      day: 1,
      date: '2025-08-11',
      startTime: '09:00',
      endTime: '11:00',
      title: 'Hari 1 - Senin',
      description: 'Awal minggu 1: Mulai dengan muroja\'ah hafalan minggu lalu (15 menit), dilanjutkan hafalan baru. Target: Juz 1 halaman 1, minimal 5 ayat baru. Gunakan metode talaqqi.',
      emoji: '📖',
      percent: 14
    },
    {
      day: 2,
      date: '2025-08-12',
      startTime: '09:00',
      endTime: '11:00',
      title: 'Hari 2 - Selasa',
      description: 'Lanjutkan hafalan Juz 1 halaman 1. Pagi: Muroja\'ah ayat kemarin (10x), tambah 5-7 ayat baru. Sore: Gabungkan hafalan 2 hari terakhir, baca dalam shalat.',
      emoji: '📖',
      percent: 28
    }
  ]
};

export const mockUserData = {
  newUser: {
    id: 'user-new-123',
    name: 'New User',
    email: 'newuser@example.com',
    preferences: null,
    goals: []
  },
  
  existingUser: {
    id: 'user-existing-456',
    name: 'Existing User',
    email: 'existing@example.com',
    preferences: {
      wakeTime: '06:00',
      sleepTime: '22:00',
      scheduleType: 'flexible',
      busyBlocks: []
    },
    goals: [
      {
        id: 'goal-1',
        title: 'Learn Python',
        description: 'Basic Python programming',
        status: 'ACTIVE'
      },
      {
        id: 'goal-2',
        title: 'Read Books',
        description: 'Read 10 books this year',
        status: 'COMPLETED'
      }
    ]
  }
};

export const mockApiResponses = {
  streamingSuccess: {
    statusUpdates: [
      { type: 'status', message: 'Memproses tujuan Anda...' },
      { type: 'status', message: 'Menghubungi AI...' },
      { type: 'progress', message: 'Menganalisis input...', progress: 25 },
      { type: 'progress', message: 'Membuat jadwal...', progress: 75 }
    ],
    completion: {
      type: 'complete',
      data: {
        title: 'Belajar JavaScript',
        description: 'Mempelajari JavaScript dari dasar',
        startDate: '2025-08-11',
        endDate: '2025-09-11',
        message: 'Tujuan berhasil dibuat!',
        dataGoals: {
          title: 'Belajar JavaScript',
          description: 'Mempelajari JavaScript dari dasar',
          emoji: '🚀',
          schedules: mockScheduleData.sevenDays
        }
      }
    }
  },
  
  streamingError: {
    statusUpdates: [
      { type: 'status', message: 'Memproses tujuan Anda...' },
      { type: 'status', message: 'Menghubungi AI...' }
    ],
    error: {
      type: 'error',
      error: 'Gagal memproses dengan AI'
    }
  },
  
  incompleteGoal: {
    statusUpdates: [
      { type: 'status', message: 'Memproses tujuan Anda...' }
    ],
    completion: {
      type: 'complete',
      data: {
        title: 'Belajar Programming',
        description: null,
        startDate: null,
        endDate: null,
        message: 'Mohon lengkapi informasi tanggal dan bahasa pemrograman',
        dataGoals: null
      }
    }
  }
};

export const validationRules = {
  title: {
    maxLength: 100,
    required: true
  },
  description: {
    maxLength: 500,
    required: true
  },
  emoji: {
    maxLength: 20,
    required: true
  },
  dateRange: {
    minDuration: 1, // days
    maxDuration: 180, // 6 months
    mustStartTomorrow: true
  }
};

// Helper functions for test data generation
export function generateGoalWithDuration(days) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1); // Tomorrow
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days - 1);
  
  return {
    title: `Test Goal ${days} days`,
    description: `A test goal that lasts ${days} days`,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    emoji: '🎯'
  };
}

export function generateSchedulesForGoal(goalData, totalDays = 7) {
  const schedules = [];
  const startDate = new Date(goalData.startDate);
  
  for (let day = 1; day <= totalDays; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day - 1);
    
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const dayName = currentDate.toLocaleDateString('id-ID', { weekday: 'long' });
    
    schedules.push({
      day,
      date: currentDate.toISOString().split('T')[0],
      startTime: isWeekend ? '10:00' : '09:00',
      endTime: isWeekend ? '11:00' : '11:00',
      title: `Hari ${day} - ${dayName}`,
      description: `Aktivitas pembelajaran hari ${day}`,
      emoji: goalData.emoji,
      percent: Math.round((day / totalDays) * 100)
    });
  }
  
  return schedules;
}

export function createMockStreamResponse(responseType = 'success') {
  switch (responseType) {
    case 'success':
      return mockApiResponses.streamingSuccess;
    case 'error':
      return mockApiResponses.streamingError;
    case 'incomplete':
      return mockApiResponses.incompleteGoal;
    default:
      return mockApiResponses.streamingSuccess;
  }
}