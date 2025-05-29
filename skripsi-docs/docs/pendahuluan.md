# BAB 1: PENDAHULUAN

## 1.1 Latar Belakang

Dalam era digital saat ini, manajemen waktu menjadi tantangan utama bagi banyak individu, terutama mahasiswa dan profesional muda. Menurut penelitian oleh American Psychological Association (2020), 75% responden mengalami kesulitan dalam mengatur jadwal harian dan mencapai tujuan yang telah ditetapkan. Ketidakmampuan mengelola waktu secara efektif dapat berdampak pada penurunan produktivitas, tingkat stres yang tinggi, dan pencapaian target yang tidak optimal (Macan et al., 2019).

Perkembangan teknologi kecerdasan buatan (AI) memberikan peluang besar untuk mengatasi permasalahan tersebut. AI dapat menganalisis pola perilaku pengguna, preferensi waktu, dan tingkat produktivitas untuk memberikan rekomendasi jadwal yang personal dan adaptif (Russell & Norvig, 2020). Berbeda dengan aplikasi penjadwalan konvensional yang hanya berfungsi sebagai calendar digital, sistem berbasis AI dapat memberikan saran yang lebih cerdas dan dinamis (Zhang et al., 2021).

Berdasarkan analisis terhadap aplikasi penjadwalan yang ada saat ini seperti Google Calendar, Microsoft Outlook, dan Todoist, ditemukan bahwa sebagian besar aplikasi tersebut masih memerlukan input manual yang intensif dan kurang memberikan rekomendasi otomatis berdasarkan analisis perilaku pengguna (Anderson & Smith, 2023). Penelitian oleh Chen et al. (2021) menunjukkan bahwa integrasi AI dalam sistem penjadwalan dapat meningkatkan produktivitas pengguna hingga 45%.

Proyek Scheduler AI ini dikembangkan sebagai solusi inovatif yang mengintegrasikan teknologi web modern dengan kecerdasan buatan untuk menciptakan sistem penjadwalan yang adaptif dan user-friendly. Sistem ini menggunakan Next.js 15 sebagai framework utama, PostgreSQL sebagai database, dan integrasi dengan API Claude AI untuk memberikan rekomendasi jadwal yang intelligent (Vercel, 2024; Anthropic, 2024).

**Rumusan Masalah:**
1. Bagaimana merancang sistem penjadwalan berbasis AI yang dapat memberikan rekomendasi jadwal personal dan adaptif?
2. Bagaimana mengimplementasikan antarmuka pengguna yang intuitif untuk memudahkan pengelolaan goals dan aktivitas harian?
3. Bagaimana mengintegrasikan teknologi AI dengan sistem manajemen basis data untuk mengoptimalkan penjadwalan pengguna?

## 1.2 Ruang Lingkup

Penelitian ini memiliki batasan-batasan sebagai berikut:

### Batasan Variabel Penelitian:
- Fokus pada pengguna individu (personal scheduling), bukan enterprise atau team scheduling
- Target pengguna adalah mahasiswa dan profesional muda berusia 18-35 tahun
- Sistem dikembangkan untuk platform web dengan responsive design untuk mobile

### Batasan Penggunaan Data:
- Data pengguna terbatas pada preferensi jadwal, goals, dan aktivitas harian
- Tidak mengakses data kalender eksternal secara real-time
- Privacy-focused: data pengguna disimpan secara aman dan tidak dibagikan ke pihak ketiga

### Batasan Metode dan Tools:
- Pengembangan menggunakan Next.js 15 dengan App Router
- Database PostgreSQL dengan Prisma ORM
- AI integration menggunakan Claude AI API
- Authentication menggunakan NextAuth.js v5
- UI framework: Tailwind CSS dengan Radix UI components
- Deployment pada platform web (tidak mencakup native mobile app)

## 1.3 Tujuan Penelitian

Penelitian ini bertujuan untuk:

1. **Mengembangkan sistem penjadwalan berbasis AI** yang dapat menganalisis pola aktivitas pengguna dan memberikan rekomendasi jadwal yang optimal berdasarkan goals dan preferensi individual.

2. **Merancang antarmuka pengguna yang intuitif** dengan implementasi modern web technologies untuk memudahkan pengguna dalam mengelola goals, mengatur jadwal, dan memantau progress aktivitas harian.

3. **Mengimplementasikan sistem manajemen data** yang efisien dengan struktur database yang optimal untuk menyimpan dan mengolah data pengguna, goals, dan schedules secara real-time.

4. **Menciptakan pengalaman pengguna yang personal** melalui fitur onboarding, preferences customization, dan AI-powered scheduling recommendations.

5. **Menganalisis efektivitas sistem** dalam meningkatkan produktivitas pengguna melalui fitur tracking dan analytics yang terintegrasi.

## 1.4 Sistematika Penulisan

Skripsi ini disusun dalam lima bab dengan sistematika sebagai berikut:

**BAB 1 PENDAHULUAN** membahas latar belakang masalah yang mendasari pengembangan sistem Scheduler AI, ruang lingkup penelitian yang mencakup batasan-batasan yang ditetapkan, tujuan penelitian yang ingin dicapai, dan sistematika penulisan skripsi.

**BAB 2 TINJAUAN PUSTAKA** menguraikan landasan teori yang mendukung penelitian, meliputi konsep kecerdasan buatan dalam sistem penjadwalan, teknologi web development modern, database management, user experience design, dan analisis penelitian terdahulu yang relevan dengan topik.

**BAB 3 METODE PENELITIAN** menjelaskan metodologi pengembangan sistem yang digunakan, tools dan teknologi yang dipilih, arsitektur sistem, design database, proses development dengan pendekatan Agile, dan tahapan implementasi dari perencanaan hingga deployment.

**BAB 4 HASIL DAN PEMBAHASAN** menyajikan hasil implementasi sistem Scheduler AI, analisis fitur-fitur yang telah dikembangkan, pengujian fungsionalitas sistem, evaluasi performa, dan pembahasan mengenai kelebihan serta keterbatasan sistem yang telah dibangun.

**BAB 5 PENUTUP** berisi simpulan dari hasil penelitian yang menjawab tujuan penelitian, serta saran untuk pengembangan sistem di masa mendatang dan rekomendasi untuk penelitian lanjutan.