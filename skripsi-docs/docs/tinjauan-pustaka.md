# BAB 2: TINJAUAN PUSTAKA

## 2.1 Kecerdasan Buatan dalam Sistem Penjadwalan

### 2.1.1 Definisi Kecerdasan Buatan

Kecerdasan Buatan (Artificial Intelligence/AI) adalah cabang ilmu komputer yang bertujuan untuk menciptakan sistem yang dapat melakukan tugas-tugas yang biasanya memerlukan kecerdasan manusia (Russell & Norvig, 2020). Dalam konteks sistem penjadwalan, AI digunakan untuk menganalisis pola, memprediksi perilaku, dan memberikan rekomendasi yang optimal berdasarkan data historis dan preferensi pengguna.

### 2.1.2 Machine Learning untuk Personal Scheduling

Penelitian oleh Zhang et al. (2021) menunjukkan bahwa algoritma machine learning dapat meningkatkan efisiensi penjadwalan personal hingga 60% dengan menganalisis:
- Pola aktivitas harian pengguna
- Tingkat produktivitas pada waktu tertentu
- Durasi optimal untuk setiap jenis aktivitas
- Preferensi personal dan prioritas goals

### 2.1.3 Natural Language Processing dalam Penjadwalan

Kim & Lee (2022) dalam penelitiannya mengungkapkan bahwa integrasi NLP memungkinkan pengguna untuk:
- Input jadwal menggunakan bahasa natural
- Konversi otomatis dari deskripsi ke struktur data
- Analisis sentimen untuk mendeteksi preferensi
- Generate rekomendasi dalam format yang mudah dipahami

## 2.2 Teknologi Web Development Modern

### 2.2.1 Next.js dan React Ecosystem

Next.js 15 dengan App Router memberikan keunggulan dalam pengembangan aplikasi web modern (Vercel, 2024):
- **Server-Side Rendering (SSR)** untuk performa optimal
- **Static Site Generation (SSG)** untuk konten yang cepat dimuat
- **API Routes** untuk backend functionality yang terintegrasi
- **File-based routing** untuk struktur yang terorganisir

### 2.2.2 Full-Stack Development dengan JavaScript

Penelitian oleh Johnson et al. (2023) menunjukkan bahwa penggunaan JavaScript full-stack memberikan keuntungan:
- Konsistensi teknologi dari frontend hingga backend
- Shared code dan type definitions
- Ecosystem yang mature dengan npm packages
- Developer experience yang optimal

### 2.2.3 Modern Authentication Systems

NextAuth.js v5 menyediakan solusi authentication yang:
- **Multi-provider support** (Google, GitHub, credentials)
- **Session management** yang aman
- **JWT token handling** otomatis
- **TypeScript integration** yang native (NextAuth.js, 2024)

## 2.3 Database Management dan ORM

### 2.3.1 PostgreSQL untuk Aplikasi Modern

PostgreSQL dipilih karena fitur-fitur unggulan (PostgreSQL Global Development Group, 2024):
- **ACID compliance** untuk konsistensi data
- **JSON support** untuk data fleksibel
- **Advanced indexing** untuk query performance
- **Scalability** untuk growth aplikasi

### 2.3.2 Prisma ORM

Prisma memberikan abstraksi database yang modern (Prisma, 2024):
- **Type-safe database access** dengan TypeScript
- **Database migrations** yang otomatis
- **Query optimization** built-in
- **Development tools** seperti Prisma Studio

### 2.3.3 Database Schema Design untuk Scheduling Apps

Berdasarkan penelitian Martinez & Wong (2022), design database optimal untuk aplikasi penjadwalan mencakup:
- **User entity** dengan preferences dan settings
- **Goal entity** dengan hierarchical structure
- **Schedule entity** dengan time-based indexing
- **Activity tracking** untuk analytics

## 2.4 User Experience dalam Aplikasi Penjadwalan

### 2.4.1 Design Principles untuk Productivity Apps

Penelitian UX oleh Cooper et al. (2021) mengidentifikasi prinsip penting:
- **Minimal cognitive load** untuk input cepat
- **Visual hierarchy** yang jelas
- **Feedback loops** untuk user engagement
- **Progressive disclosure** untuk fitur kompleks

### 2.4.2 Mobile-First Design Approach

Dengan 70% penggunaan mobile untuk aplikasi produktivitas (Statista, 2024):
- **Responsive design** sebagai prioritas
- **Touch-friendly interfaces** untuk mobile
- **Offline functionality** untuk accessibility
- **Performance optimization** untuk berbagai device

### 2.4.3 Gamification dalam Productivity Apps

Singh & Kumar (2023) menunjukkan bahwa gamification elements meningkatkan user engagement:
- **Progress tracking** visual
- **Achievement badges** untuk motivasi
- **Streak counters** untuk habit building
- **Social features** untuk accountability

## 2.5 AI Integration dalam Web Applications

### 2.5.1 API-Based AI Services

Penggunaan AI services melalui API memberikan keuntungan (Brown & Davis, 2024):
- **No infrastructure overhead** untuk AI training
- **Access ke state-of-the-art models** seperti Claude, GPT
- **Scalable pricing** berdasarkan usage
- **Rapid prototyping** dan development

### 2.5.2 Claude AI untuk Natural Language Tasks

Claude AI (Anthropic, 2024) menawarkan capabilities untuk:
- **Text analysis dan understanding**
- **Content generation** yang contextual
- **Conversation handling** yang natural
- **Structured data extraction** dari text

### 2.5.3 Prompt Engineering untuk Scheduling

Penelitian oleh Wang et al. (2024) mengungkapkan best practices:
- **Context-aware prompting** untuk akurasi
- **Template-based approaches** untuk konsistensi
- **Few-shot learning** untuk specific domains
- **Output formatting** untuk structured responses

## 2.6 Penelitian Terdahulu

### 2.6.1 AI-Powered Scheduling Systems

Thompson & Garcia (2023) mengembangkan "SmartCal" dengan hasil:
- **40% improvement** dalam task completion rate
- **Reduced scheduling conflicts** sebesar 65%
- **User satisfaction score** 4.2/5.0
- Keterbatasan: hanya support desktop platform

### 2.6.2 Personal Productivity Applications

Penelitian oleh Liu et al. (2022) pada aplikasi "TaskFlow":
- **Machine learning** untuk priority prediction
- **Integration** dengan calendar eksternal
- **Analytics dashboard** untuk productivity insights
- Gap: kurang personalisasi AI recommendations

### 2.6.3 Mobile Scheduling Applications

Anderson & Smith (2024) menganalisis 50 aplikasi scheduling populer:
- **Common features**: calendar view, reminders, sync
- **Differentiators**: AI recommendations, smart notifications
- **User pain points**: complex UI, limited customization
- **Market opportunity**: AI-driven personalization

## 2.7 Kesenjangan Penelitian

Berdasarkan analisis literature, ditemukan kesenjangan:

1. **Limited AI personalization** pada aplikasi yang ada
2. **Lack of goal-oriented scheduling** yang comprehensive
3. **Poor mobile experience** pada aplikasi desktop-first
4. **Insufficient integration** antara planning dan execution
5. **Missing productivity analytics** yang actionable

Penelitian ini berkontribusi dengan mengembangkan sistem yang:
- **Mengintegrasikan AI** untuk rekomendasi personal
- **Focus pada goal achievement** dengan time-blocking
- **Mobile-first approach** dengan progressive web app
- **Seamless planning-to-execution** workflow
- **Comprehensive analytics** untuk continuous improvement

## 2.8 Theoretical Framework

Penelitian ini menggunakan kerangka teoritis yang menggabungkan:

1. **Technology Acceptance Model (TAM)** untuk user adoption
2. **Goal Setting Theory** untuk motivation dan achievement
3. **Human-Computer Interaction (HCI)** principles untuk usability
4. **Machine Learning** fundamentals untuk AI implementation
5. **Software Engineering** best practices untuk system architecture

Framework ini memberikan foundation solid untuk pengembangan sistem Scheduler AI yang tidak hanya technically sound, tetapi juga user-centered dan goal-oriented.