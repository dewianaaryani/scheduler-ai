# Dokumentasi Scrum - Aplikasi Kalana

## Executive Summary
Aplikasi Kalana merupakan sistem manajemen produktivitas personal berbasis web yang mengintegrasikan kecerdasan artifisial untuk membantu pengguna mencapai tujuan melalui penjadwalan yang terstruktur dan terpersonalisasi. Aplikasi ini dibangun menggunakan teknologi modern dengan fokus pada pengalaman pengguna yang intuitif dan analisis produktivitas yang mendalam.

## Product Backlog

### Product Backlog Items (PBI)

| PBI ID | Epic | Backlog Item | Deskripsi | Story Points | Priority |
|--------|------|--------------|-----------|--------------|----------|
| PBI-001 | Infrastruktur | Setup Project Next.js | Melakukan inisialisasi proyek menggunakan Next.js 15.2.3 dengan TypeScript 5.8.3, konfigurasi Turbopack untuk development, setup Tailwind CSS v4 dengan custom Poppins font, dan struktur folder App Router | 5 | Critical |
| PBI-002 | Infrastruktur | Konfigurasi Database | Mengatur koneksi database PostgreSQL di Supabase dengan connection pooling, membuat schema database menggunakan Prisma ORM 6.5.0, setup migration system, dan konfigurasi environment variables untuk development dan production | 8 | Critical |
| PBI-003 | Infrastruktur | Setup Komponen UI | Mengintegrasikan shadcn/ui dengan Radix UI primitives, konfigurasi theme dengan CSS variables, setup toast notification menggunakan Sonner, dan implementasi responsive design system | 5 | Critical |
| PBI-004 | Fitur Autentikasi | Implementasi OAuth | Mengimplementasikan NextAuth.js v5 beta dengan provider Google OAuth 2.0 dan GitHub OAuth, setup callback URLs, konfigurasi session strategy, dan implementasi token refresh mechanism | 8 | Critical |
| PBI-005 | Fitur Autentikasi | Proteksi Route | Membuat middleware untuk route protection, implementasi session checking pada setiap request, redirect logic untuk unauthorized access, dan setup public/private route mapping | 5 | Critical |
| PBI-006 | Fitur Autentikasi | Manajemen Session | Implementasi session storage dengan database adapter, automatic session refresh, logout functionality dengan session cleanup, dan multi-device session management | 5 | High |
| PBI-007 | Fitur Pengelolaan Jadwal | CRUD Jadwal | Membuat API endpoints untuk create, read, update, delete jadwal, implementasi form validation dengan Zod, optimistic updates untuk UX, dan batch operations untuk multiple schedules | 8 | High |
| PBI-008 | Fitur Pengelolaan Jadwal | Validasi Konflik | Implementasi algoritma deteksi konflik waktu dengan interval tree, real-time validation saat input jadwal, suggestion system untuk slot waktu alternatif, dan handling untuk recurring schedules | 13 | High |
| PBI-009 | Fitur Pengelolaan Jadwal | Tampilan Kalender | Integrasi react-big-calendar dengan custom event renderer, implementasi drag-and-drop untuk reschedule, view switcher (week/month/day), dan mobile-responsive calendar layout | 8 | High |
| PBI-010 | Fitur Pengelolaan Jadwal | Status Jadwal | Implementasi state machine untuk status transitions (None → In Progress → Completed/Missed), automatic status update based on time, color coding system, dan status history tracking | 5 | Medium |
| PBI-011 | Fitur Pengelolaan Jadwal | Notifikasi Jadwal | Sistem reminder untuk jadwal mendatang, browser notification API integration, email notification untuk jadwal penting, dan customizable notification preferences | 8 | Medium |
| PBI-012 | Fitur Penyesuaian Preferensi Waktu | Form Preferensi | Multi-step form dengan progress indicator, time picker components untuk sleep/work hours, validation untuk logical time constraints, dan preview sistem preferensi | 5 | High |
| PBI-013 | Fitur Penyesuaian Preferensi Waktu | Onboarding Flow | Welcome screen dengan app introduction, guided tour untuk fitur utama, progressive preference collection, dan completion tracking dengan redirect logic | 8 | High |
| PBI-014 | Fitur Penyesuaian Preferensi Waktu | Update Preferensi | Settings page integration, change history tracking, impact analysis untuk schedule adjustments, dan bulk reschedule option berdasarkan preferensi baru | 5 | Medium |
| PBI-015 | Fitur Penyesuaian Preferensi Waktu | Busy Blocks | Implementasi recurring busy blocks (daily/weekly), visual representation pada calendar, automatic conflict resolution, dan template system untuk common patterns | 8 | Medium |
| PBI-016 | Fitur Pengelolaan Tujuan | Integrasi AI Claude | Setup Anthropic Claude API integration, prompt engineering untuk goal parsing, response validation dan error handling, token usage optimization, dan fallback mechanism | 13 | Critical |
| PBI-017 | Fitur Pengelolaan Tujuan | CRUD Tujuan | RESTful API untuk goal operations, rich text editor untuk descriptions, emoji picker integration, progress tracking system, dan archiving functionality | 8 | High |
| PBI-018 | Fitur Pengelolaan Tujuan | Rekomendasi Tujuan | Machine learning pipeline untuk pattern recognition, collaborative filtering untuk suggestions, category-based recommendations, dan trending goals analysis | 13 | Medium |
| PBI-019 | Fitur Pengelolaan Tujuan | Status Tujuan | Three-state status system (Active/Completed/Abandoned), cascade status update ke schedules, completion criteria definition, dan milestone tracking | 5 | High |
| PBI-020 | Fitur Pengelolaan Tujuan | Goal Breakdown | AI-powered decomposition algorithm, schedule generation dengan time allocation, dependency mapping antar tasks, dan effort estimation | 13 | Critical |
| PBI-021 | Fitur Dasbor | Widget Progres | Real-time progress calculation, circular progress indicators, goal completion trends, dan comparative analytics (week-over-week) | 5 | High |
| PBI-022 | Fitur Dasbor | Aktivitas Terkini | Activity feed dengan infinite scroll, filtering by type/status, quick actions dari dashboard, dan activity grouping by date | 5 | Medium |
| PBI-023 | Fitur Dasbor | Quick Stats | Key metrics display (completion rate, streak, total goals), interactive charts dengan Chart.js, data export functionality, dan customizable metric cards | 8 | Medium |
| PBI-024 | Fitur Dasbor | Today View | Agenda layout untuk current day, time-based sorting, in-progress indicator, dan quick status update buttons | 5 | High |
| PBI-025 | Fitur Informasi Aplikasi | Landing Page | Hero section dengan value proposition, feature showcase dengan animations, testimonial carousel, dan CTA buttons strategically placed | 5 | Medium |
| PBI-026 | Fitur Informasi Aplikasi | How It Works | Step-by-step visual guide, interactive demo mode, video tutorials embedding, dan FAQ accordion component | 5 | Low |
| PBI-027 | Fitur Informasi Aplikasi | Features Section | Detailed feature descriptions, benefit-oriented copywriting, comparison table, dan use case scenarios | 3 | Low |
| PBI-028 | Fitur Pengaturan | Profil Pengguna | Avatar upload dengan crop functionality, personal information form, account linking options, dan privacy settings | 5 | Medium |
| PBI-029 | Fitur Pengaturan | Integrasi Upload | Supabase Storage integration, image optimization pipeline, file type validation, dan CDN configuration | 8 | Medium |
| PBI-030 | Fitur Pengaturan | Preferences Management | Theme selection (light/dark/auto), language preferences, timezone settings, dan data export/import | 5 | Low |
| PBI-031 | Fitur Analisis Produktivitas | Grafik Statistik | Multiple chart types (bar, line, pie), interactive tooltips, zoom and pan functionality, dan responsive chart sizing | 8 | Medium |
| PBI-032 | Fitur Analisis Produktivitas | Insight Generator | AI-powered insight generation, pattern recognition algorithms, personalized recommendations, dan motivational messaging system | 13 | Medium |
| PBI-033 | Fitur Analisis Produktivitas | Tracking Metrics | Comprehensive metrics collection, real-time data aggregation, historical data storage, dan performance optimization | 8 | High |
| PBI-034 | Fitur Analisis Produktivitas | Reports | Weekly/monthly report generation, PDF export functionality, email delivery system, dan custom report builder | 8 | Low |

## Sprint Planning Detail

### Sprint 1: Infrastruktur dan Fitur Autentikasi
**Durasi:** 2 minggu (10 hari kerja)  
**PBI:** PBI-001 sampai PBI-006

#### Tujuan Sprint
Membangun fondasi aplikasi yang kokoh dengan infrastruktur modern dan sistem autentikasi yang aman menggunakan OAuth providers.

#### Tahapan Pelaksanaan

**Tahap 1: Inisialisasi Proyek (Hari 1-2)**
Pembangunan struktur dasar aplikasi dimulai dengan framework Next.js dan TypeScript. Tim menyiapkan konfigurasi sistem styling menggunakan Tailwind CSS dengan font Poppins sebagai identitas visual aplikasi. Struktur folder diorganisir dengan pemisahan yang jelas antara komponen server dan client untuk optimasi performa.

**Tahap 2: Konfigurasi Database (Hari 3-4)**
Database PostgreSQL disiapkan di platform Supabase dengan pertimbangan lokasi server terdekat untuk meminimalkan latensi. Schema database dirancang dengan entitas utama meliputi User untuk data pengguna, Goal untuk tujuan pengguna, Schedule untuk jadwal kegiatan, serta tabel pendukung untuk sistem autentikasi. Sistem migrasi database diimplementasikan untuk memudahkan tracking perubahan schema.

**Tahap 3: Integrasi Komponen UI (Hari 5-6)**
Library komponen UI berbasis Radix UI diintegrasikan untuk memberikan komponen-komponen dasar yang accessible dan customizable. Sistem theming dikonfigurasi dengan CSS variables untuk memudahkan penyesuaian warna, radius, dan spacing. Font Poppins diterapkan sebagai font utama untuk memberikan identitas visual yang konsisten.

**Tahap 4: Implementasi Autentikasi (Hari 7-8)**
Sistem autentikasi dibangun menggunakan NextAuth dengan dukungan login melalui Google dan GitHub. Konfigurasi OAuth dilakukan dengan setup aplikasi di masing-masing provider. Session management diimplementasikan dengan strategi database untuk memastikan persistensi session pengguna. Sistem callback dikonfigurasi untuk menangani data pengguna setelah login berhasil.

**Tahap 5: Proteksi Route dan Finalisasi (Hari 9-10)**
Middleware autentikasi dibuat untuk melindungi halaman-halaman yang memerlukan login. Sistem helper functions dikembangkan untuk memudahkan pengecekan status autentikasi di berbagai komponen. Halaman login dirancang dengan tampilan yang clean dan profesional. Testing menyeluruh dilakukan untuk memastikan flow autentikasi berjalan lancar.

#### Hasil Sprint

**1. Halaman Login**
Halaman login menampilkan logo aplikasi Kalana di bagian atas dengan tagline yang menjelaskan manfaat aplikasi. Terdapat dua tombol login yang prominent dengan ikon Google dan GitHub, masing-masing dengan warna brand yang sesuai. Background halaman menggunakan gradient subtle untuk memberikan kesan modern. Pesan error ditampilkan dengan jelas jika autentikasi gagal.

**2. Struktur Aplikasi**
Aplikasi terorganisir dengan struktur folder yang jelas memisahkan area publik dan area terproteksi. Routing otomatis mengarahkan pengguna yang belum login ke halaman autentikasi. Setelah login berhasil, pengguna langsung diarahkan ke dashboard atau onboarding jika pengguna baru.

**3. Sistem Database**
Database telah terkonfigurasi dengan schema yang mendukung seluruh fitur aplikasi. Tabel User menyimpan informasi pengguna dan preferensi dalam format JSON. Tabel Goal dan Schedule memiliki relasi yang tepat untuk tracking aktivitas. Sistem migrasi memudahkan evolusi schema seiring perkembangan aplikasi.

**4. Infrastruktur Development**
Environment development telah siap dengan hot reload untuk produktivitas tinggi. Type safety memastikan kode bebas dari error runtime. Sistem formatting dan linting menjaga konsistensi kode. Konfigurasi production-ready dengan optimasi performa.

### Sprint 2: Fitur Pengelolaan Jadwal
**Durasi:** 2 minggu (10 hari kerja)  
**PBI:** PBI-007 sampai PBI-011

#### Tujuan Sprint
Mengimplementasikan sistem pengelolaan jadwal yang komprehensif dengan validasi konflik, tampilan kalender interaktif, dan sistem status yang informatif.

#### Tahapan Pelaksanaan

**Tahap 1: Pengembangan Backend Jadwal (Hari 1-2)**
Pengembangan dimulai dengan pembuatan sistem backend untuk mengelola data jadwal. API endpoints dirancang untuk mendukung operasi create, read, update, dan delete jadwal. Sistem validasi diimplementasikan untuk memastikan data jadwal yang diinput valid dan konsisten. Format response distandarisasi untuk memudahkan integrasi dengan frontend.

**Tahap 2: Sistem Deteksi Konflik (Hari 3-4)**
Algoritma deteksi konflik waktu dikembangkan untuk mencegah jadwal yang bertumpang tindih. Sistem ini memeriksa setiap jadwal baru terhadap jadwal existing dalam database. Jika konflik terdeteksi, sistem memberikan saran slot waktu alternatif yang tersedia. Penanganan kasus khusus seperti jadwal sepanjang hari dan perbedaan timezone diimplementasikan.

**Tahap 3: Komponen Kalender (Hari 5-6)**
Komponen kalender interaktif dibangun dengan tampilan mingguan dan bulanan. Setiap jadwal ditampilkan dengan emoji dan warna sesuai statusnya. Fitur drag-and-drop memungkinkan pengguna memindahkan jadwal dengan mudah. Tampilan mobile dioptimasi dengan format agenda list untuk kemudahan navigasi di layar kecil.

**Tahap 4: Form Pengelolaan Jadwal (Hari 7-8)**
Form untuk membuat dan mengedit jadwal dirancang dengan komponen-komponen intuitif. Date dan time picker memudahkan pemilihan waktu dengan interval 15 menit. Emoji picker tersedia untuk memberikan identitas visual pada setiap jadwal. Sistem validasi real-time memberikan feedback langsung saat pengguna mengisi form.

**Tahap 5: Sistem Status dan Notifikasi (Hari 9-10)**
Sistem status jadwal diimplementasikan dengan empat status: None (abu-abu), In Progress (biru), Completed (hijau), dan Missed (merah). Transisi status dapat dilakukan manual oleh pengguna atau otomatis berdasarkan waktu. Notifikasi browser diintegrasikan untuk mengingatkan jadwal mendatang. Toast notification memberikan feedback visual untuk setiap aksi pengguna.

#### Hasil Sprint

**1. Halaman Kalender**
Halaman kalender menampilkan header dengan judul "Kalender" dan toggle untuk beralih antara tampilan mingguan dan bulanan. Dalam tampilan mingguan, tujuh hari ditampilkan dalam kolom dengan slot waktu per jam. Setiap jadwal muncul sebagai card berwarna dengan emoji, judul, dan waktu. Tampilan bulanan menunjukkan overview dengan indikator jumlah jadwal per hari. Tombol tambah jadwal yang melayang di pojok kanan bawah memudahkan akses cepat.

**2. Form Tambah/Edit Jadwal**
Form jadwal terbuka dalam modal dengan judul "Tambah Jadwal Baru" atau "Edit Jadwal". Field pertama adalah pemilih emoji dengan grid emoji populer dan search box. Input judul jadwal dengan placeholder "Masukkan judul jadwal". Pemilih tanggal dan waktu dengan format yang familiar. Text area untuk deskripsi opsional. Jika konflik terdeteksi, alert merah muncul dengan saran waktu alternatif. Tombol simpan di bagian bawah dengan loading state saat proses.

**3. Detail Jadwal**
Klik pada jadwal membuka popup detail dengan informasi lengkap. Bagian atas menampilkan emoji besar dengan judul jadwal. Status ditampilkan dengan badge berwarna sesuai kondisi. Informasi waktu mulai dan selesai dengan format yang mudah dibaca. Deskripsi jadwal jika tersedia. Tombol aksi untuk mengubah status (Mulai, Selesai, Lewatkan) sesuai konteks. Tombol edit dan hapus dengan konfirmasi.

**4. Sistem Notifikasi**
Toast notification muncul di pojok kanan atas untuk feedback aksi. Pesan sukses berwarna hijau saat jadwal berhasil dibuat atau diubah. Pesan error berwarna merah jika terjadi kesalahan. Browser notification muncul 15 menit sebelum jadwal dimulai dengan judul dan emoji jadwal.

### Sprint 3: Fitur Penyesuaian Preferensi Waktu
**Durasi:** 2 minggu (10 hari kerja)  
**Total Story Points:** 26 points  
**PBI:** PBI-012 sampai PBI-015  
**Team Capacity:** 3 developers

#### Tujuan Sprint
Membuat sistem personalisasi yang memungkinkan pengguna mengatur preferensi waktu mereka untuk penjadwalan yang lebih optimal dan sesuai dengan rutinitas personal.

#### User Stories

**US-007: Sebagai Pengguna Baru, saya ingin setup preferensi saat onboarding**
- Acceptance Criteria:
  - Multi-step form yang guided
  - Preview hasil preferensi
  - Skip option tersedia
  - Save ke user profile

**US-008: Sebagai Pengguna, saya ingin mengatur waktu tidur dan kerja**
- Acceptance Criteria:
  - Time range selectors
  - Validation untuk overlap
  - Visual representation
  - Flexible vs rigid options

**US-009: Sebagai Pengguna, saya ingin menandai busy blocks**
- Acceptance Criteria:
  - Recurring patterns support
  - Visual di calendar
  - Quick add/remove
  - Template options

#### Pelaksanaan Detail

**Hari 1-2: Onboarding Flow Design**
Alur onboarding dirancang dengan 5 langkah:
1. Welcome screen dengan penjelasan manfaat personalisasi
2. Sleep schedule preference (waktu tidur dan bangun)
3. Work schedule preference (jam kerja regular)
4. Schedule type preference (rigid vs flexible)
5. Review dan confirmation

Setiap langkah memiliki progress indicator di top. Navigation dengan Next/Back buttons dan ability untuk skip. Data disimpan temporarily di state dan persist ke database pada completion. Redirect logic: new users → onboarding, existing users → dashboard.

**Hari 3-4: Preference Form Components**
Komponen-komponen form dibuat:
- `TimeRangePicker`: untuk select start dan end time dengan 30-minute intervals
- `ScheduleTypeSelector`: radio group untuk rigid/flexible dengan explanations
- `WeekdaySelector`: checkbox group untuk select applicable days
- `PreferencePreview`: visual representation dari preferences

Validation rules diimplementasikan:
- Sleep time minimal 6 jam, maksimal 12 jam
- Work time tidak overlap dengan sleep time
- At least one weekday must be selected

**Hari 5-6: Data Model & Storage**
Preferences disimpan dalam User table sebagai JSON field dengan structure:
```json
{
  "sleepSchedule": {
    "bedTime": "22:00",
    "wakeTime": "06:00"
  },
  "workSchedule": {
    "startTime": "09:00",
    "endTime": "17:00",
    "workDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  },
  "scheduleType": "flexible",
  "busyBlocks": [
    {
      "title": "Lunch Break",
      "startTime": "12:00",
      "endTime": "13:00",
      "recurrence": "daily"
    }
  ]
}
```

API endpoints dibuat:
- `GET /api/preferences` - get current user preferences
- `PUT /api/preferences` - update preferences
- `POST /api/preferences/validate` - validate preferences before save

**Hari 7-8: Busy Blocks Implementation**
Busy blocks system memungkinkan users mark recurring unavailable times. Interface untuk add/edit/delete busy blocks dibuat dengan modal form. Recurrence patterns: daily, weekly, monthly, atau specific days. Visual representation pada calendar dengan striped pattern. Integration dengan schedule validation untuk automatic conflict avoidance.

**Hari 9-10: Settings Integration & Migration**
Settings page diupdate untuk include preference management section. Change comparison showing before/after effects. Bulk reschedule option ketika preferences berubah significantly. Migration tool untuk existing users tanpa preferences. Quick templates untuk common patterns (9-5 worker, student, freelancer).

#### Hasil Sprint
1. **Onboarding Flow Completed:**
   - 5-step guided process
   - Progress tracking
   - Data validation at each step
   - Smooth transition ke dashboard

2. **Preference System:**
   - Sleep schedule configuration
   - Work schedule dengan weekday selection
   - Flexible vs rigid scheduling
   - JSON storage optimized

3. **Busy Blocks Feature:**
   - Recurring patterns supported
   - Visual calendar integration
   - Conflict prevention automatic
   - Template system functional

4. **Settings Management:**
   - Update preferences anytime
   - Impact preview before save
   - Bulk reschedule capability
   - Migration for existing users

### Sprint 4: Fitur Pengelolaan Tujuan
**Durasi:** 2 minggu (10 hari kerja)  
**Total Story Points:** 47 points  
**PBI:** PBI-016 sampai PBI-020  
**Team Capacity:** 3 developers

#### Tujuan Sprint
Mengimplementasikan sistem pengelolaan tujuan yang cerdas dengan integrasi AI Claude untuk memecah tujuan besar menjadi jadwal-jadwal yang actionable dan terstruktur.

#### User Stories

**US-010: Sebagai Pengguna, saya ingin membuat tujuan dengan AI assistance**
- Acceptance Criteria:
  - Natural language input
  - AI parsing dan structuring
  - Preview sebelum save
  - Manual adjustment capability

**US-011: Sebagai Pengguna, saya ingin AI memecah tujuan jadi jadwal**
- Acceptance Criteria:
  - Automatic schedule generation
  - Respect user preferences
  - Avoid conflicts
  - Realistic time allocation

**US-012: Sebagai Pengguna, saya ingin track progress tujuan**
- Acceptance Criteria:
  - Visual progress indicator
  - Milestone tracking
  - Status management
  - Completion celebration

#### Pelaksanaan Detail

**Hari 1-3: Claude API Integration**
Integrasi dengan Anthropic Claude API dimulai dengan setup API key di environment variables. Service class `ClaudeService` dibuat dengan methods:
- `parseGoal(input: string)`: extract goal details dari natural language
- `generateSchedules(goal, preferences)`: break down goal ke schedules
- `suggestGoals(history)`: recommend goals based on user history

Prompt engineering dilakukan dengan careful crafting untuk:
- Bahasa Indonesia output
- Structured JSON response
- Realistic time estimates
- Cultural context awareness

Error handling includes retry logic, fallback responses, dan user-friendly error messages. Token usage tracking untuk cost monitoring.

**Hari 4-5: Goal CRUD Operations**
API endpoints untuk goal management:
- `POST /api/goals/generate` - AI-powered goal creation
- `GET /api/goals/list` - paginated list dengan filtering
- `PUT /api/goals/[id]` - update goal details
- `PATCH /api/goals/[id]/status` - status change dengan cascade

Goal form component dengan:
- Rich text editor untuk description
- Date range picker untuk timeline
- Emoji selector untuk visual identity
- Category selection untuk organization
- Priority levels (High/Medium/Low)

**Hari 6-7: Schedule Generation Algorithm**
Algorithm untuk generate schedules dari goal:
1. Parse goal untuk identify required tasks
2. Estimate time needed untuk each task
3. Check user's available time slots
4. Distribute tasks across timeline
5. Respect preferences (morning person, work hours, etc.)
6. Avoid conflicts dengan existing schedules
7. Add buffer time between tasks
8. Create recurring patterns untuk habits

Generated schedules include:
- Title derived dari goal
- Description dengan specific actions
- Realistic duration (30min - 2hr typically)
- Appropriate emoji
- Link ke parent goal

**Hari 8-9: Recommendation System**
Goal recommendation system menggunakan:
- Content-based filtering dari previous goals
- Category analysis untuk suggest related goals
- Seasonal patterns (New Year resolutions, etc.)
- Popular goals dari community
- AI-powered suggestions based on profile

Recommendation UI dengan:
- Suggestion cards dengan preview
- One-click adoption
- Customization sebelum save
- Dismissal dengan feedback

**Hari 10: Status Management & Testing**
Three-tier status system:
- Active: ongoing goals dengan schedules
- Completed: achieved goals dengan celebration
- Abandoned: stopped goals dengan reason tracking

Cascade logic: ketika goal status changes, all related schedules update accordingly. Completion criteria: percentage-based atau milestone-based. Celebration animation dan achievement badges untuk completed goals.

#### Hasil Sprint
1. **AI Integration Functional:**
   - Claude API connected dan optimized
   - Natural language processing works
   - Structured output reliable
   - Error handling robust

2. **Goal Management System:**
   - CRUD operations complete
   - Rich editing capabilities
   - Category dan priority system
   - Progress tracking accurate

3. **Smart Schedule Generation:**
   - AI breaks down goals effectively
   - Respects user preferences
   - Avoids conflicts automatically
   - Realistic time allocation

4. **Recommendation Engine:**
   - Personalized suggestions
   - Multiple recommendation sources
   - Easy adoption process
   - Learning dari user behavior

### Sprint 5: Fitur Dasbor, Fitur Informasi Aplikasi, dan Fitur Pengaturan
**Durasi:** 2 minggu (10 hari kerja)  
**Total Story Points:** 31 points  
**PBI:** PBI-021 sampai PBI-030  
**Team Capacity:** 3 developers

#### Tujuan Sprint
Melengkapi aplikasi dengan dashboard yang informatif, landing page yang menarik, dan sistem pengaturan yang komprehensif untuk pengalaman pengguna yang lengkap.

#### User Stories

**US-013: Sebagai Pengguna, saya ingin dashboard yang informative**
- Acceptance Criteria:
  - Today's schedule visible
  - Progress indicators clear
  - Quick actions available
  - Responsive layout

**US-014: Sebagai Visitor, saya ingin understand app sebelum signup**
- Acceptance Criteria:
  - Clear value proposition
  - Feature explanations
  - How it works section
  - Call-to-action prominent

**US-015: Sebagai Pengguna, saya ingin customize profile**
- Acceptance Criteria:
  - Photo upload functional
  - Name change capability
  - Preference updates
  - Privacy controls

#### Pelaksanaan Detail

**Hari 1-2: Dashboard Implementation**
Dashboard dibuat dengan grid layout responsive:
- Header dengan greeting dan current date
- Today's Schedule card dengan timeline view
- Active Goals widget dengan progress bars
- Recent Activities feed dengan infinite scroll
- Quick Stats cards (completion rate, streak, total schedules)

Data fetching dioptimasi dengan single endpoint `/api/dashboard/combined` yang return semua data needed dalam satu request. Client-side caching dengan SWR untuk fast navigation. Real-time updates untuk schedule status changes.

Components created:
- `DashboardHeader`: personalized greeting dengan time-based message
- `TodaySchedule`: timeline view dengan current time indicator
- `GoalProgress`: circular progress dengan percentage
- `ActivityFeed`: scrollable list dengan action icons
- `QuickStats`: metric cards dengan trend indicators

**Hari 3-4: Landing Page Development**
Landing page structure:
1. Hero section dengan headline dan CTA
2. Problem statement yang relatable
3. Solution presentation dengan benefits
4. Features showcase dengan icons
5. How it works dalam 4 steps
6. Testimonials (placeholder untuk future)
7. Footer dengan links

Animations menggunakan Framer Motion untuk:
- Fade-in on scroll
- Parallax effects pada hero
- Hover animations pada cards
- Smooth transitions

Copy writing focus pada value proposition:
- "Capai Tujuanmu dengan AI Assistant"
- "Dari Mimpi Besar ke Langkah Nyata"
- "Jadwal Pintar yang Mengerti Kamu"

**Hari 5-6: Settings Page Structure**
Settings page dengan tab navigation:
1. Account Settings: profile info, avatar, email
2. Preferences: time preferences, schedule type
3. Notifications: email/browser notification toggles
4. Privacy: data visibility, account deletion
5. About: app version, terms, privacy policy

Each section dalam collapsible cards untuk organization. Form validation dengan immediate feedback. Save indicators untuk setiap change.

**Hari 7-8: Image Upload System**
Supabase Storage integration untuk avatar upload:
- Bucket creation dengan public access
- Upload endpoint `/api/upload/image`
- Image processing: resize ke 200x200px
- Format validation: only JPEG/PNG
- Size limit: 5MB maximum
- CDN URL generation untuk fast loading

Upload UI dengan:
- Drag-and-drop zone
- Preview sebelum upload
- Progress indicator
- Crop functionality
- Error handling untuk failed uploads

**Hari 9-10: Integration & Polish**
Integration testing untuk semua features. Performance optimization:
- Image lazy loading
- Code splitting untuk landing page
- Memoization untuk expensive calculations
- Database query optimization

Polish items:
- Loading skeletons untuk better UX
- Error boundaries untuk crash prevention
- Breadcrumbs untuk navigation context
- Tooltips untuk unclear actions
- Mobile responsiveness fine-tuning

#### Hasil Sprint
1. **Dashboard Functional:**
   - All widgets working
   - Data real-time updated
   - Mobile responsive
   - Performance optimized

2. **Landing Page Live:**
   - Clear messaging
   - Smooth animations
   - CTA buttons prominent
   - SEO optimized

3. **Settings Complete:**
   - Profile management works
   - Avatar upload functional
   - Preferences updatable
   - Privacy controls active

4. **Upload System:**
   - Supabase Storage integrated
   - Image processing works
   - CDN delivery fast
   - Error handling robust

### Sprint 6: Fitur Analisis Produktivitas
**Durasi:** 2 minggu (10 hari kerja)  
**Total Story Points:** 37 points  
**PBI:** PBI-031 sampai PBI-034  
**Team Capacity:** 3 developers

#### Tujuan Sprint
Mengimplementasikan sistem analisis produktivitas yang memberikan insights mendalam tentang performa pengguna dengan visualisasi data yang menarik dan actionable recommendations.

#### User Stories

**US-016: Sebagai Pengguna, saya ingin melihat statistik produktivitas**
- Acceptance Criteria:
  - Multiple chart types
  - Time range filtering
  - Comparative analysis
  - Export capability

**US-017: Sebagai Pengguna, saya ingin insights tentang patterns**
- Acceptance Criteria:
  - AI-generated insights
  - Trend identification
  - Recommendations
  - Motivational messages

**US-018: Sebagai Pengguna, saya ingin reports berkala**
- Acceptance Criteria:
  - Weekly summaries
  - Monthly reports
  - PDF generation
  - Email delivery

#### Pelaksanaan Detail

**Hari 1-2: Metrics Collection System**
Data collection framework dibuat untuk track:
- Schedule completion rates per day/week/month
- Time spent on different goal categories
- Most productive hours of day
- Streak counters (consecutive days dengan completion)
- Average schedule duration vs actual
- Abandonment rates dan reasons

Database views dibuat untuk efficient aggregation:
```sql
CREATE VIEW daily_productivity AS
SELECT date, user_id, 
  COUNT(*) as total_schedules,
  SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
  AVG(completion_time - start_time) as avg_duration
FROM schedules
GROUP BY date, user_id;
```

Background job untuk calculate dan cache metrics daily.

**Hari 3-4: Chart Implementation**
Chart.js integrated dengan React wrapper untuk multiple visualizations:
- Line chart: completion rate trend over time
- Bar chart: daily schedule distribution
- Pie chart: time allocation by category
- Heatmap: productivity by hour dan day
- Radar chart: skill/category balance

Interactive features:
- Zoom dan pan untuk detailed view
- Tooltips dengan detailed info
- Legend toggling
- Export as image
- Responsive sizing

Custom color schemes aligned dengan app design. Animation on load untuk engaging experience.

**Hari 5-6: Insight Generator Development**
AI-powered insight system menganalisis:
- Productivity patterns (best days/times)
- Completion rate trends
- Category focus shifts
- Streak achievements
- Improvement areas

Insight types generated:
1. Achievement: "Kamu mencapai 90% completion minggu ini!"
2. Pattern: "Kamu paling produktif di pagi hari (08:00-10:00)"
3. Suggestion: "Coba kurangi jadwal di hari Senin"
4. Motivation: "3 hari lagi untuk 30-day streak!"
5. Warning: "Completion rate turun 20% minggu ini"

Messages personalized based on user level:
- Beginner: encouraging dan educational
- Intermediate: challenging dan comparative
- Advanced: detailed dan analytical

**Hari 7-8: Analytics Page UI**
Analytics page structure:
1. Header dengan period selector dan insights banner
2. Metrics overview cards dengan comparisons
3. Chart section dengan tab navigation
4. Detailed statistics table
5. Export dan share options

Components created:
- `MetricsOverview`: card grid dengan key numbers
- `ChartContainer`: wrapper untuk different chart types
- `InsightBanner`: rotating insights dengan animations
- `PeriodSelector`: date range picker dengan presets
- `StatisticsTable`: sortable data table

Filtering options:
- Time range: 7 days, 30 days, 3 months, custom
- Category: filter by goal category
- Status: completed, missed, all
- Comparison: vs previous period

**Hari 9-10: Report Generation**
Report system untuk automated summaries:
- Weekly report: Monday morning summary
- Monthly report: First day of month comprehensive

Report contents:
- Executive summary dengan key metrics
- Charts dan visualizations
- Detailed breakdowns by category
- Recommendations untuk improvement
- Achievements dan milestones

PDF generation menggunakan Puppeteer:
- HTML template dengan styling
- Chart rendering as images
- Page breaks optimization
- File compression

Email delivery system:
- SendGrid integration untuk reliable delivery
- HTML email templates
- Unsubscribe management
- Delivery scheduling

#### Hasil Sprint
1. **Comprehensive Analytics:**
   - Multiple chart types functional
   - Real-time data updates
   - Interactive visualizations
   - Mobile responsive charts

2. **Intelligent Insights:**
   - AI-generated recommendations
   - Pattern recognition working
   - Personalized messages
   - Motivational system active

3. **Tracking System:**
   - Automatic data collection
   - Efficient aggregation
   - Historical data preserved
   - Performance optimized

4. **Report Generation:**
   - PDF reports functional
   - Email delivery working
   - Scheduling system active
   - Template customization

## Definition of Done

Setiap PBI dianggap selesai jika memenuhi kriteria berikut:

### Code Quality
- [ ] Kode mengikuti style guide yang ditetapkan
- [ ] TypeScript types didefinisikan dengan proper
- [ ] No any types kecuali absolutely necessary
- [ ] Comments untuk complex logic
- [ ] Function dan variable naming descriptive

### Testing
- [ ] Unit tests untuk business logic
- [ ] Integration tests untuk API endpoints
- [ ] Component tests untuk UI critical
- [ ] Manual testing pada Chrome, Firefox, Safari
- [ ] Mobile testing pada iOS dan Android

### Performance
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] No memory leaks detected
- [ ] Bundle size optimized
- [ ] Images properly optimized

### Security
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection active
- [ ] Authentication properly checked
- [ ] Sensitive data encrypted

### Documentation
- [ ] API documentation updated
- [ ] README updated if needed
- [ ] Inline comments untuk complex code
- [ ] User guide updated untuk new features
- [ ] Change log maintained

### Deployment
- [ ] Build succeeds tanpa errors
- [ ] Linting passes tanpa warnings
- [ ] Database migrations tested
- [ ] Environment variables documented
- [ ] Rollback plan prepared

## Technical Debt Log

### Current Technical Debt
1. **Test Coverage (High Priority)**
   - Current coverage: ~30%
   - Target coverage: 80%
   - Estimated effort: 3 sprints

2. **Performance Optimization (Medium Priority)**
   - Dashboard load time needs improvement
   - Database queries need indexing
   - Estimated effort: 1 sprint

3. **Code Refactoring (Low Priority)**
   - Some components too large
   - Duplicate code in API handlers
   - Estimated effort: 2 sprints

4. **Documentation (Medium Priority)**
   - API documentation incomplete
   - User guide needs update
   - Estimated effort: 1 sprint

## Risk Registry

### High Risk
1. **Third-party API Dependency**
   - Risk: Claude API downtime
   - Mitigation: Implement fallback logic
   - Owner: Backend team

2. **Data Privacy Compliance**
   - Risk: GDPR/privacy violations
   - Mitigation: Regular audit dan compliance check
   - Owner: Security team

### Medium Risk
1. **Scalability Issues**
   - Risk: Performance degradation with user growth
   - Mitigation: Load testing dan optimization
   - Owner: DevOps team

2. **Browser Compatibility**
   - Risk: Features not working on older browsers
   - Mitigation: Progressive enhancement
   - Owner: Frontend team

### Low Risk
1. **Feature Creep**
   - Risk: Scope expansion beyond capacity
   - Mitigation: Strict backlog management
   - Owner: Product Owner

## Retrospective Insights

### What Went Well
- AI integration exceeded expectations
- Team collaboration sangat baik
- User feedback very positive
- Performance targets achieved

### What Could Be Improved
- Testing should start earlier
- More frequent deployments needed
- Documentation often delayed
- Communication dengan stakeholders

### Action Items
1. Implement TDD untuk next features
2. Setup CI/CD pipeline properly
3. Dedicate time untuk documentation
4. Weekly stakeholder updates

## Future Enhancements (Backlog)

### Next Features to Consider
1. **Mobile Application**
   - React Native implementation
   - Push notifications
   - Offline capability

2. **Team Collaboration**
   - Shared goals
   - Team calendars
   - Progress comparison

3. **Advanced AI Features**
   - Voice input
   - Smart rescheduling
   - Predictive analytics

4. **Integrations**
   - Google Calendar sync
   - Notion integration
   - Slack notifications

5. **Gamification**
   - Achievement system
   - Leaderboards
   - Rewards program