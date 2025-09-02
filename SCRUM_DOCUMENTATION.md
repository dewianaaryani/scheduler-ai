# Dokumentasi Scrum - Aplikasi Kalana

## Executive Summary
Aplikasi Kalana merupakan sistem manajemen produktivitas personal berbasis web yang mengintegrasikan kecerdasan artifisial untuk membantu pengguna mencapai tujuan melalui penjadwalan yang terstruktur dan terpersonalisasi. Aplikasi ini dibangun menggunakan teknologi modern dengan fokus pada pengalaman pengguna yang intuitif dan analisis produktivitas yang mendalam. Seluruh desain antarmuka pengguna (UI) dalam aplikasi ini dibuat menggunakan V0 by Vercel untuk memastikan konsistensi visual dan kualitas desain yang optimal.

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

**1. Halaman Login** *(Dibuat dengan V0 by Vercel)*
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

**1. Halaman Kalender** *(Dibuat dengan V0 by Vercel)*
Halaman kalender menampilkan header dengan judul "Kalender" dan toggle untuk beralih antara tampilan mingguan dan bulanan. Dalam tampilan mingguan, tujuh hari ditampilkan dalam kolom dengan slot waktu per jam. Setiap jadwal muncul sebagai card berwarna dengan emoji, judul, dan waktu. Tampilan bulanan menunjukkan overview dengan indikator jumlah jadwal per hari. Tombol tambah jadwal yang melayang di pojok kanan bawah memudahkan akses cepat.

**2. Form Tambah/Edit Jadwal** *(Dibuat dengan V0 by Vercel)*
Form jadwal terbuka dalam modal dengan judul "Tambah Jadwal Baru" atau "Edit Jadwal". Field pertama adalah pemilih emoji dengan grid emoji populer dan search box. Input judul jadwal dengan placeholder "Masukkan judul jadwal". Pemilih tanggal dan waktu dengan format yang familiar. Text area untuk deskripsi opsional. Jika konflik terdeteksi, alert merah muncul dengan saran waktu alternatif. Tombol simpan di bagian bawah dengan loading state saat proses.

**3. Detail Jadwal** *(Dibuat dengan V0 by Vercel)*
Klik pada jadwal membuka popup detail dengan informasi lengkap. Bagian atas menampilkan emoji besar dengan judul jadwal. Status ditampilkan dengan badge berwarna sesuai kondisi. Informasi waktu mulai dan selesai dengan format yang mudah dibaca. Deskripsi jadwal jika tersedia. Tombol aksi untuk mengubah status (Mulai, Selesai, Lewatkan) sesuai konteks. Tombol edit dan hapus dengan konfirmasi.

**4. Sistem Notifikasi** *(Dibuat dengan V0 by Vercel)*
Toast notification muncul di pojok kanan atas untuk feedback aksi. Pesan sukses berwarna hijau saat jadwal berhasil dibuat atau diubah. Pesan error berwarna merah jika terjadi kesalahan. Browser notification muncul 15 menit sebelum jadwal dimulai dengan judul dan emoji jadwal.

### Sprint 3: Fitur Penyesuaian Preferensi Waktu
**Durasi:** 2 minggu (10 hari kerja)  
**PBI:** PBI-012 sampai PBI-015

#### Tujuan Sprint
Membuat sistem personalisasi yang memungkinkan pengguna mengatur preferensi waktu mereka untuk penjadwalan yang lebih optimal dan sesuai dengan rutinitas personal.

#### Tahapan Pelaksanaan

**Tahap 1: Desain Alur Onboarding (Hari 1-2)**
Alur onboarding dirancang dengan lima langkah yang intuitif. Langkah pertama adalah welcome screen yang menjelaskan manfaat personalisasi. Langkah kedua mengumpulkan preferensi waktu tidur. Langkah ketiga untuk jam kerja regular. Langkah keempat menanyakan tipe penjadwalan yang diinginkan. Langkah terakhir adalah review dan konfirmasi. Setiap langkah dilengkapi progress indicator dan opsi untuk skip.

**Tahap 2: Komponen Form Preferensi (Hari 3-4)**
Komponen-komponen form dikembangkan untuk mengumpulkan preferensi pengguna. Time range picker memudahkan pemilihan rentang waktu dengan interval 30 menit. Schedule type selector memberikan pilihan antara jadwal rigid atau flexible dengan penjelasan masing-masing. Weekday selector memungkinkan pengguna memilih hari kerja yang relevan. Preview component menampilkan visualisasi dari preferensi yang dipilih.

**Tahap 3: Model Data dan Penyimpanan (Hari 5-6)**
Struktur data preferensi dirancang dalam format JSON untuk fleksibilitas. Data mencakup jadwal tidur dengan waktu tidur dan bangun, jadwal kerja dengan jam mulai dan selesai beserta hari kerja, tipe penjadwalan, dan busy blocks untuk waktu-waktu yang tidak tersedia. API endpoints dikembangkan untuk mengambil, memperbarui, dan memvalidasi preferensi.

**Tahap 4: Implementasi Busy Blocks (Hari 7-8)**
Sistem busy blocks memungkinkan pengguna menandai waktu-waktu recurring yang tidak tersedia. Interface untuk menambah, mengedit, dan menghapus busy blocks dibuat dengan modal form yang user-friendly. Pola recurrence mendukung harian, mingguan, bulanan, atau hari spesifik. Representasi visual pada kalender menggunakan pola stripe untuk membedakan dengan jadwal regular.

**Tahap 5: Integrasi Settings dan Migrasi (Hari 9-10)**
Halaman settings diperbarui untuk memasukkan section manajemen preferensi. Fitur comparison menampilkan efek before/after dari perubahan preferensi. Opsi bulk reschedule tersedia ketika preferensi berubah signifikan. Tool migrasi dikembangkan untuk existing users yang belum memiliki preferensi. Template cepat disediakan untuk pola umum seperti pekerja 9-5, mahasiswa, atau freelancer.

#### Hasil Sprint

**1. Halaman Onboarding** *(Dibuat dengan V0 by Vercel)*
Halaman onboarding dimulai dengan welcome screen yang menampilkan ilustrasi menarik dan penjelasan singkat tentang personalisasi. Progress bar di bagian atas menunjukkan 5 langkah yang harus dilalui. Setiap langkah memiliki judul yang jelas dan deskripsi yang membantu. Form preferensi waktu tidur menampilkan dua time picker untuk waktu tidur dan bangun dengan validasi minimal 6 jam tidur. Form jam kerja dilengkapi checkbox untuk memilih hari kerja aktif. Halaman review menampilkan rangkuman semua preferensi sebelum disimpan.

**2. Pengaturan Preferensi Waktu** *(Dibuat dengan V0 by Vercel)*
Di halaman settings, terdapat section "Preferensi Waktu" dengan card yang dapat di-expand. Informasi preferensi current ditampilkan dalam format yang mudah dibaca. Tombol "Ubah Preferensi" membuka form edit dengan nilai yang sudah terisi. Preview kalender mingguan menunjukkan visualisasi dari preferensi yang dipilih dengan area tidur berwarna abu-abu gelap dan jam kerja berwarna biru muda.

**3. Manajemen Busy Blocks** *(Dibuat dengan V0 by Vercel)*
Interface busy blocks menampilkan list waktu-waktu yang tidak tersedia dalam format tabel. Tombol "Tambah Busy Block" membuka modal dengan form untuk judul, waktu mulai dan selesai, serta pola pengulangan. Busy blocks yang sudah ada dapat diedit atau dihapus dengan konfirmasi. Pada kalender, busy blocks ditampilkan dengan pola garis diagonal untuk membedakan dari jadwal regular.

**4. Template Preferensi** *(Dibuat dengan V0 by Vercel)*
Tiga template preferensi cepat tersedia: "Pekerja Kantoran" (9-5, Senin-Jumat), "Mahasiswa" (flexible dengan jam kuliah), dan "Freelancer" (fully flexible). Setiap template memiliki ikon dan deskripsi yang menjelaskan untuk siapa template tersebut cocok. Pengguna dapat memilih template sebagai starting point kemudian menyesuaikan sesuai kebutuhan.

### Sprint 4: Fitur Pengelolaan Tujuan
**Durasi:** 2 minggu (10 hari kerja)  
**PBI:** PBI-016 sampai PBI-020

#### Tujuan Sprint
Mengimplementasikan sistem pengelolaan tujuan yang cerdas dengan integrasi AI Claude untuk memecah tujuan besar menjadi jadwal-jadwal yang actionable dan terstruktur.

#### Tahapan Pelaksanaan

**Tahap 1: Integrasi Claude API (Hari 1-3)**
Integrasi dengan Anthropic Claude API dimulai dengan konfigurasi koneksi dan authentication. Service class dikembangkan dengan metode untuk parsing goal dari natural language, generating schedules dari goal, dan suggesting goals berdasarkan history. Prompt engineering dilakukan untuk memastikan output dalam Bahasa Indonesia dengan struktur JSON yang konsisten. Error handling dan retry logic diimplementasikan untuk reliability.

**Tahap 2: Operasi CRUD Tujuan (Hari 4-5)**
API endpoints untuk manajemen tujuan dikembangkan mencakup pembuatan goal dengan AI, listing dengan pagination dan filtering, update detail goal, dan perubahan status dengan cascade effect. Form component dirancang dengan rich text editor untuk deskripsi, date range picker untuk timeline, emoji selector untuk identitas visual, category selection untuk organisasi, dan priority levels.

**Tahap 3: Algoritma Pemecahan Tujuan (Hari 6-7)**
Algoritma untuk generate schedules dari goal dikembangkan dengan langkah-langkah: parsing goal untuk identifikasi tasks, estimasi waktu yang dibutuhkan, pengecekan slot waktu tersedia user, distribusi tasks across timeline, respect terhadap preferensi user, penghindaran konflik dengan jadwal existing, penambahan buffer time, dan pembuatan pola recurring untuk habits.

**Tahap 4: Sistem Rekomendasi (Hari 8-9)**
Sistem rekomendasi goal menggunakan multiple approaches: content-based filtering dari goal sebelumnya, analisis kategori untuk suggest related goals, pola seasonal seperti resolusi tahun baru, popular goals dari community, dan AI-powered suggestions berdasarkan profile. UI rekomendasi menampilkan suggestion cards dengan preview, one-click adoption, customization sebelum save, dan dismissal dengan feedback.

**Tahap 5: Manajemen Status dan Testing (Hari 10)**
Sistem status three-tier diimplementasikan: Active untuk ongoing goals, Completed untuk achieved goals dengan celebration, dan Abandoned untuk stopped goals dengan reason tracking. Cascade logic memastikan perubahan status goal mengupdate semua related schedules. Completion criteria dapat berbasis percentage atau milestone. Animation dan badges ditambahkan untuk completed goals.

#### Hasil Sprint

**1. Halaman Tujuan** *(Dibuat dengan V0 by Vercel)*
Halaman tujuan menampilkan header dengan judul "Tujuan Saya" dan tombol "Buat Tujuan Baru" yang prominent. Grid cards menampilkan semua tujuan dengan emoji, judul, progress bar, dan status badge. Filter tersedia untuk menampilkan tujuan Active, Completed, atau Abandoned. Setiap card dapat diklik untuk melihat detail dan jadwal terkait. Statistik ringkas di bagian atas menunjukkan total tujuan dan completion rate.

**2. Form Pembuatan Tujuan dengan AI** *(Dibuat dengan V0 by Vercel)*
Form tujuan dimulai dengan text area besar untuk input natural language dengan placeholder "Ceritakan tujuan Anda...". Tombol "Analisis dengan AI" memproses input dan menampilkan hasil parsing dalam format terstruktur. Hasil AI menampilkan judul yang disarankan, deskripsi detail, emoji yang sesuai, estimasi durasi, dan breakdown jadwal. Pengguna dapat mengedit hasil AI sebelum menyimpan. Loading animation dengan tips ditampilkan selama proses AI.

**3. Detail Tujuan dan Progress** *(Dibuat dengan V0 by Vercel)*
Halaman detail tujuan menampilkan header dengan emoji besar dan judul tujuan. Progress ring chart menunjukkan persentase completion dengan angka di tengah. Timeline visualisasi menampilkan semua jadwal terkait dengan status masing-masing. Section deskripsi menjelaskan tujuan secara detail. Tombol aksi tersedia untuk edit, update status, atau abandon goal dengan konfirmasi.

**4. Rekomendasi Tujuan** *(Dibuat dengan V0 by Vercel)*
Section rekomendasi muncul di dashboard dan halaman tujuan. Cards rekomendasi menampilkan emoji, judul singkat, dan alasan rekomendasi. Kategori rekomendasi dibedakan dengan label: "Berdasarkan History", "Trending", "Seasonal", atau "Untuk Anda". Hover pada card menampilkan preview detail dan estimasi waktu. Tombol "Adopsi" memungkinkan quick start dengan customization option.

### Sprint 5: Fitur Dasbor, Fitur Informasi Aplikasi, dan Fitur Pengaturan
**Durasi:** 2 minggu (10 hari kerja)  
**PBI:** PBI-021 sampai PBI-030

#### Tujuan Sprint
Melengkapi aplikasi dengan dashboard yang informatif, landing page yang menarik, dan sistem pengaturan yang komprehensif untuk pengalaman pengguna yang lengkap.

#### Tahapan Pelaksanaan

**Tahap 1: Implementasi Dashboard (Hari 1-2)**
Dashboard dirancang dengan layout grid responsive yang menampilkan informasi penting. Header dengan greeting personalized berdasarkan waktu dan nama user. Widget today's schedule menampilkan timeline jadwal hari ini. Widget active goals menunjukkan progress tujuan aktif. Recent activities feed dengan infinite scroll. Quick stats cards menampilkan metrics penting. Single API endpoint dikembangkan untuk mengambil semua data dashboard efficiently.

**Tahap 2: Pengembangan Landing Page (Hari 3-4)**
Landing page dibangun dengan struktur yang engaging. Hero section dengan headline catchy dan call-to-action buttons. Problem statement section yang relatable dengan target audience. Solution presentation highlighting key benefits. Features showcase dengan icons dan descriptions. How it works section dalam format step-by-step. Animations ditambahkan untuk scroll effects dan hover interactions.

**Tahap 3: Struktur Halaman Settings (Hari 5-6)**
Settings page diorganisir dengan tab navigation untuk different sections. Account settings untuk profile information dan avatar. Preferences untuk time preferences dan schedule type. Notifications untuk toggle email dan browser notifications. Privacy untuk data visibility dan account deletion options. About section dengan app version dan legal information. Form validation dan save indicators diimplementasikan untuk setiap section.

**Tahap 4: Sistem Upload Gambar (Hari 7-8)**
Integrasi Supabase Storage untuk avatar upload dikonfigurasi. Upload endpoint dengan image processing untuk resize dan optimization. Validasi format file untuk hanya menerima JPEG dan PNG. Size limit 5MB dengan error handling yang jelas. CDN URL generation untuk fast image delivery. UI dengan drag-and-drop zone, preview, progress indicator, dan crop functionality.

**Tahap 5: Integrasi dan Polish (Hari 9-10)**
Integration testing dilakukan untuk semua features. Performance optimization dengan lazy loading dan code splitting. UI polish dengan loading skeletons dan error boundaries. Breadcrumbs ditambahkan untuk navigation context. Tooltips untuk unclear actions. Mobile responsiveness fine-tuning untuk semua breakpoints.

#### Hasil Sprint

**1. Dashboard** *(Dibuat dengan V0 by Vercel)*
Dashboard menampilkan header dengan sapaan "Selamat Pagi/Siang/Sore/Malam, [Nama]" sesuai waktu. Widget "Jadwal Hari Ini" menampilkan timeline vertikal dengan current time indicator dan jadwal dalam cards dengan emoji dan waktu. Widget "Tujuan Aktif" menunjukkan maksimal 3 tujuan dengan circular progress bars. "Aktivitas Terkini" menampilkan feed dengan ikon untuk different action types. Cards "Statistik Cepat" menampilkan completion rate hari ini, current streak, dan total jadwal minggu ini.

**2. Landing Page** *(Dibuat dengan V0 by Vercel)*
Hero section menampilkan headline besar "Capai Tujuanmu dengan AI Assistant" dengan subtitle yang menjelaskan value proposition. Dua CTA buttons: "Mulai Gratis" dan "Pelajari Lebih Lanjut" dengan warna kontras. Section "Mengapa Kalana?" menjelaskan problem yang diselesaikan dengan ilustrasi. "Fitur Unggulan" menampilkan 6 fitur utama dalam grid dengan ikon dan deskripsi singkat. "Cara Kerja" dijelaskan dalam 4 langkah dengan numbered cards. Footer berisi links penting dan social media.

**3. Halaman Pengaturan** *(Dibuat dengan V0 by Vercel)*
Header halaman menampilkan judul "Pengaturan" dengan navigation tabs di bawahnya. Tab "Akun" menampilkan foto profil dengan tombol "Ganti Foto", form nama lengkap dan email (read-only untuk OAuth users). Tab "Preferensi" menampilkan current time preferences dengan tombol edit. Tab "Notifikasi" berisi toggle switches untuk different notification types. Tab "Privasi" memiliki opsi visibility dan tombol danger zone untuk delete account. Setiap perubahan menampilkan toast notification untuk konfirmasi.

**4. Sistem Upload Avatar** *(Dibuat dengan V0 by Vercel)*
Upload area menampilkan current avatar atau placeholder dengan overlay "Ganti Foto" saat hover. Click membuka modal dengan drag-and-drop zone bertuliskan "Tarik foto ke sini atau klik untuk browse". Preview foto yang diupload dengan tools untuk crop dan rotate. Progress bar muncul selama upload process. Success message dengan new avatar immediately visible. Error messages yang jelas untuk invalid format atau size.

### Sprint 6: Fitur Analisis Produktivitas
**Durasi:** 2 minggu (10 hari kerja)  
**PBI:** PBI-031 sampai PBI-034

#### Tujuan Sprint
Mengimplementasikan sistem analisis produktivitas yang memberikan insights mendalam tentang performa pengguna dengan visualisasi data yang menarik dan actionable recommendations.

#### Tahapan Pelaksanaan

**Tahap 1: Sistem Pengumpulan Metrics (Hari 1-2)**
Framework pengumpulan data dikembangkan untuk track berbagai metrics. Schedule completion rates dihitung per hari, minggu, dan bulan. Time spent pada different goal categories dianalisis. Most productive hours diidentifikasi dari pattern. Streak counters untuk consecutive days dengan high completion. Average duration vs estimated time untuk accuracy tracking. Database views dibuat untuk efficient aggregation dengan background job untuk daily calculation.

**Tahap 2: Implementasi Charts (Hari 3-4)**
Multiple chart types diintegrasikan menggunakan Chart.js. Line chart untuk completion rate trend over time. Bar chart untuk daily schedule distribution. Pie chart untuk time allocation by category. Heatmap untuk productivity by hour and day. Radar chart untuk skill/category balance. Interactive features seperti zoom, pan, tooltips, dan legend toggling. Custom color schemes aligned dengan app design.

**Tahap 3: Pengembangan Insight Generator (Hari 5-6)**
AI-powered system menganalisis productivity patterns untuk generate insights. Achievement insights untuk celebrate milestones. Pattern insights untuk identify best times and days. Suggestion insights untuk improvement areas. Motivational messages untuk maintain momentum. Warning insights untuk declining trends. Messages dipersonalisasi berdasarkan user level dari beginner hingga advanced.

**Tahap 4: UI Halaman Analytics (Hari 7-8)**
Analytics page distruktur dengan clear information hierarchy. Header dengan period selector dan dynamic insights banner. Metrics overview cards dengan comparison to previous period. Chart section dengan tab navigation untuk different visualizations. Detailed statistics table dengan sorting dan filtering. Export options untuk charts dan data. Responsive design untuk all screen sizes.

**Tahap 5: Sistem Report Generation (Hari 9-10)**
Automated report system untuk weekly dan monthly summaries. Report contents include executive summary, charts dan visualizations, detailed breakdowns, recommendations, dan achievements. PDF generation dengan optimized layout dan compression. Email delivery system dengan HTML templates dan unsubscribe management. Scheduling system untuk automated delivery timing.

#### Hasil Sprint

**1. Halaman Analisis Produktivitas** *(Dibuat dengan V0 by Vercel)*
Header halaman menampilkan judul "Analisis Produktivitas" dengan ikon chart. Period selector di kanan atas dengan options: 7 hari, 30 hari, 3 bulan, atau custom range. Dynamic insights banner menampilkan rotating insights dengan icon TrendingUp dan motivational messages. Cards overview menampilkan "Tingkat Penyelesaian" dengan percentage dan arrow indicator, "Produktivitas Terbaik" showing best day/time, "Streak Saat Ini" dengan fire emoji, dan "Total Jam Produktif" minggu ini.

**2. Visualisasi Data** *(Dibuat dengan V0 by Vercel)*
Tab navigation untuk switch antara different chart types: "Trend", "Distribusi", "Kategori", "Heatmap", dan "Perbandingan". Line chart menampilkan completion rate trend dengan smooth curves dan data points. Bar chart showing daily distribution dengan different colors untuk status. Pie chart untuk time allocation dengan percentages pada hover. Heatmap grid menunjukkan productivity intensity dengan gradient colors dari merah (low) ke hijau (high).

**3. Insights dan Rekomendasi** *(Dibuat dengan V0 by Vercel)*
Insights section menampilkan cards dengan different insight types. Achievement card dengan confetti icon: "Luar biasa! Completion rate 95% minggu ini!" Pattern card dengan clock icon: "Kamu paling produktif pukul 09:00-11:00". Suggestion card dengan lightbulb: "Coba kurangi jadwal di hari Senin untuk balance lebih baik". Warning card dengan alert icon jika ada declining trend. Each insight includes actionable recommendation.

**4. Export dan Reports** *(Dibuat dengan V0 by Vercel)*
Export button group di bagian bawah halaman dengan options "Export Chart", "Export Data CSV", dan "Generate PDF Report". Weekly report preview menampilkan thumbnail dengan key metrics summary. Email subscription toggle untuk automated reports dengan frequency selector. Generated PDF includes cover page dengan user name dan period, executive summary dengan key achievements, all charts dengan high resolution, detailed data tables, dan personalized recommendations untuk next period.

## Definition of Done

Setiap PBI dianggap selesai jika memenuhi kriteria berikut:

### Code Quality
- Kode mengikuti style guide yang ditetapkan
- TypeScript types didefinisikan dengan proper
- No any types kecuali absolutely necessary  
- Comments untuk complex logic
- Function dan variable naming descriptive

### Testing
- Unit tests untuk business logic
- Integration tests untuk API endpoints
- Component tests untuk UI critical
- Manual testing pada Chrome, Firefox, Safari
- Mobile testing pada iOS dan Android

### Performance
- Page load time < 3 seconds
- API response time < 500ms
- No memory leaks detected
- Bundle size optimized
- Images properly optimized

### Security
- Input validation implemented
- SQL injection prevention
- XSS protection active
- Authentication properly checked
- Sensitive data encrypted

### Documentation
- API documentation updated
- README updated if needed
- Inline comments untuk complex code
- User guide updated untuk new features
- Change log maintained

### Deployment
- Build succeeds tanpa errors
- Linting passes tanpa warnings
- Database migrations tested

## Skenario Pengujian

### Epic: Infrastruktur

| ID Skenario | Pengujian | Langkah Pengujian | Hasil Diharapkan | Hasil |
|-------------|-----------|-------------------|------------------|-------|
| TEST-INF-001 | Setup Project Next.js | 1. Clone repository<br>2. Jalankan `npm install`<br>3. Jalankan `npm run dev`<br>4. Buka http://localhost:3000 | Aplikasi berjalan tanpa error dengan hot reload aktif | Berhasil |
| TEST-INF-002 | Konfigurasi Database | 1. Setup environment variables<br>2. Jalankan `npx prisma generate`<br>3. Jalankan `npx prisma migrate dev`<br>4. Cek koneksi dengan `npx prisma studio` | Database terhubung dan schema ter-migrasi dengan benar | Berhasil |
| TEST-INF-003 | Setup Komponen UI | 1. Import komponen shadcn/ui<br>2. Render Button component<br>3. Trigger toast notification<br>4. Cek responsive pada mobile view | Komponen ter-render dengan styling yang tepat dan responsive | Berhasil |

### Epic: Fitur Autentikasi

| ID Skenario | Pengujian | Langkah Pengujian | Hasil Diharapkan | Hasil |
|-------------|-----------|-------------------|------------------|-------|
| TEST-AUTH-001 | Login dengan Google | 1. Klik tombol "Login dengan Google"<br>2. Pilih akun Google<br>3. Authorize aplikasi<br>4. Tunggu redirect | User berhasil login dan diarahkan ke dashboard/onboarding | Berhasil |
| TEST-AUTH-002 | Login dengan GitHub | 1. Klik tombol "Login dengan GitHub"<br>2. Login ke GitHub<br>3. Authorize aplikasi<br>4. Tunggu redirect | User berhasil login dan diarahkan ke dashboard/onboarding | Berhasil |
| TEST-AUTH-003 | Proteksi Route | 1. Logout dari aplikasi<br>2. Coba akses /dashboard<br>3. Coba akses /goals<br>4. Coba akses /calendar | User diarahkan ke halaman login untuk semua protected routes | Berhasil |
| TEST-AUTH-004 | Logout | 1. Login ke aplikasi<br>2. Klik menu user<br>3. Klik "Logout"<br>4. Konfirmasi logout | Session terhapus dan user diarahkan ke halaman login | Berhasil |
| TEST-AUTH-005 | Session Persistence | 1. Login ke aplikasi<br>2. Refresh halaman<br>3. Tutup browser dan buka kembali<br>4. Akses aplikasi | Session tetap aktif setelah refresh dan restart browser | Berhasil |

### Epic: Fitur Pengelolaan Jadwal

| ID Skenario | Pengujian | Langkah Pengujian | Hasil Diharapkan | Hasil |
|-------------|-----------|-------------------|------------------|-------|
| TEST-SCH-001 | Buat Jadwal Baru | 1. Navigasi ke halaman calendar<br>2. Klik tombol "Tambah Jadwal"<br>3. Isi form (title, description, waktu)<br>4. Klik "Simpan" | Jadwal tersimpan dan muncul di calendar | Berhasil |
| TEST-SCH-002 | Edit Jadwal | 1. Klik jadwal existing di calendar<br>2. Klik tombol "Edit"<br>3. Ubah informasi jadwal<br>4. Simpan perubahan | Jadwal ter-update dengan data baru | Berhasil |
| TEST-SCH-003 | Hapus Jadwal | 1. Klik jadwal di calendar<br>2. Klik tombol "Hapus"<br>3. Konfirmasi penghapusan<br>4. Cek calendar | Jadwal terhapus dari calendar dan database | Berhasil |
| TEST-SCH-004 | Deteksi Konflik | 1. Buat jadwal jam 09:00-10:00<br>2. Coba buat jadwal lain jam 09:30-10:30<br>3. Lihat pesan warning<br>4. Pilih waktu alternatif | Sistem mendeteksi konflik dan memberikan saran waktu alternatif | Berhasil |
| TEST-SCH-005 | Update Status Jadwal | 1. Klik jadwal yang sedang berjalan<br>2. Klik tombol status<br>3. Pilih "Completed"<br>4. Cek perubahan warna | Status berubah dan warna indikator ter-update | Berhasil |
| TEST-SCH-006 | View Calendar | 1. Buka halaman calendar<br>2. Switch ke view "Week"<br>3. Switch ke view "Month"<br>4. Switch ke view "Day" | Calendar menampilkan jadwal sesuai view yang dipilih | Berhasil |

### Epic: Fitur Penyesuaian Preferensi Waktu

| ID Skenario | Pengujian | Langkah Pengujian | Hasil Diharapkan | Hasil |
|-------------|-----------|-------------------|------------------|-------|
| TEST-PREF-001 | Onboarding Flow | 1. Login sebagai user baru<br>2. Isi nama dan informasi dasar<br>3. Set preferensi waktu tidur<br>4. Set preferensi waktu kerja<br>5. Selesaikan onboarding | Preferensi tersimpan dan user diarahkan ke dashboard | Berhasil |
| TEST-PREF-002 | Update Preferensi | 1. Navigasi ke Settings<br>2. Klik "Edit Preferensi"<br>3. Ubah jam tidur<br>4. Simpan perubahan | Preferensi ter-update dan jadwal menyesuaikan | Berhasil |
| TEST-PREF-003 | Set Busy Blocks | 1. Buka settings preferensi<br>2. Tambah busy block (misal: lunch time)<br>3. Set recurring daily<br>4. Simpan | Busy blocks tersimpan dan terlihat di calendar | Berhasil |
| TEST-PREF-004 | Validasi Waktu | 1. Coba set waktu tidur jam 25:00<br>2. Coba set waktu kerja overlap dengan tidur<br>3. Coba set busy block di luar range 24 jam | Sistem menampilkan error validasi yang sesuai | Berhasil |

### Epic: Fitur Pengelolaan Tujuan

| ID Skenario | Pengujian | Langkah Pengujian | Hasil Diharapkan | Hasil |
|-------------|-----------|-------------------|------------------|-------|
| TEST-GOAL-001 | Buat Goal dengan AI | 1. Navigasi ke halaman AI<br>2. Ketik "Belajar JavaScript selama 2 bulan"<br>3. Klik "Generate"<br>4. Review hasil<br>5. Klik "Simpan" | Goal dan jadwal ter-generate dan tersimpan | Berhasil |
| TEST-GOAL-002 | Validasi Goal | 1. Input goal tanpa tanggal<br>2. Lihat pesan incomplete<br>3. Tambahkan tanggal<br>4. Submit ulang | Sistem meminta informasi yang kurang dan memvalidasi input | Berhasil |
| TEST-GOAL-003 | Edit Goal | 1. Buka detail goal<br>2. Klik "Edit"<br>3. Ubah title dan description<br>4. Simpan | Goal ter-update dengan informasi baru | Berhasil |
| TEST-GOAL-004 | Update Status Goal | 1. Buka goal detail<br>2. Klik dropdown status<br>3. Pilih "Completed"<br>4. Konfirmasi | Status goal berubah dan progress ter-update 100% | Berhasil |
| TEST-GOAL-005 | Generate Schedule AI | 1. Input goal valid<br>2. Tunggu AI generation<br>3. Lihat schedules muncul streaming<br>4. Edit schedule yang tidak sesuai<br>5. Simpan | Jadwal ter-generate secara progresif dan dapat diedit sebelum save | Berhasil |
| TEST-GOAL-006 | Durasi Max 6 Bulan | 1. Input goal dengan durasi 7 bulan<br>2. Lihat pesan error<br>3. Ubah ke 6 bulan<br>4. Submit | Sistem menolak goal >6 bulan dan menerima ≤6 bulan | Berhasil |

### Test Cases Pembuatan Jadwal (Comprehensive)

| ID Skenario | Pengujian | Input Test | Hasil Diharapkan | Hasil |
|-------------|-----------|------------|------------------|-------|
| TEST-SCH-007 | Jadwal Belajar Mobile 3x/Minggu | "Belajar React Native untuk membuat aplikasi mobile. Jadwalkan setiap hari Senin, Rabu, dan Jumat jam 19:00-21:00 selama 2 bulan" | Sistem membuat 24 jadwal (3x/minggu x 8 minggu) pada hari dan jam yang spesifik | Berhasil |
| TEST-SCH-008 | Yoga Pagi Skip Weekend | "Buatkan jadwal yoga pagi setiap hari jam 05:30-06:30, kecuali hari Sabtu dan Minggu. Mulai dari tanggal 15 Januari 2025 sampai 15 Februari 2025" | Jadwal dibuat hanya weekdays (Senin-Jumat) pada jam 05:30-06:30, skip weekend | Berhasil |
| TEST-SCH-009 | TOEFL Multi-Skill Schedule | "Jadwal belajar TOEFL intensif: Listening hari Senin & Kamis (16:00-18:00), Reading hari Selasa & Jumat (16:00-18:00), Writing & Speaking weekend (Sabtu 09:00-12:00, Minggu 14:00-17:00)" | Sistem membuat jadwal berbeda per skill dengan waktu yang berbeda-beda sesuai spesifikasi | Berhasil |
| TEST-SCH-010 | Project Freelance Phases | "Proyek freelance website toko online. Week 1-2: Design (2 jam/hari), Week 3-4: Frontend (3 jam/hari), Week 5-6: Backend (4 jam/hari), Week 7-8: Testing (2 jam/hari). Kerja weekdays setelah jam 20:00" | Jadwal berubah durasi per fase, hanya weekdays, mulai jam 20:00 | Berhasil |
| TEST-SCH-011 | Marathon Progressive Training | "Program latihan marathon 12 minggu. Week 1-4: Easy runs 3x/week 30-45 min, Week 5-8: Add tempo Thursday 45 min + long run Sunday 60-90 min, Week 9-12: Interval Tuesday, tempo Thursday, long run Sunday 90-120 min. Start jam 06:00" | Jadwal intensitas meningkat progresif sesuai minggu training | Berhasil |
| TEST-SCH-012 | Data Science Skip Week | "Kursus data science: Video Senin & Rabu (19:00-20:30), Praktikum Selasa & Kamis (19:00-21:00), Project Sabtu (10:00-13:00), Office hours Jumat (20:00-21:00). Skip minggu ke-4 karena liburan" | Jadwal terbuat untuk 6 minggu dengan skip minggu ke-4 | Berhasil |
| TEST-SCH-013 | Novel Writing Daily Target | "Menulis novel 60.000 kata dalam 2 bulan. Brainstorming minggu 1 (2 jam/hari), Writing sprint setiap hari 21:00-23:00 target 1000 kata/hari, Review weekend pagi 09:00-11:00. Libur tanggal merah" | Jadwal berbeda untuk minggu 1 (planning), daily writing sessions, weekend review, skip holidays | Berhasil |
| TEST-SCH-014 | Mandarin Multi-Activity | "Kursus Mandarin: Vocabulary drill pagi 06:00-06:30 setiap hari, Grammar class Selasa & Kamis 19:30-21:00, Speaking practice Sabtu 14:00-15:30, Movie night Minggu 20:00-22:00" | Sistem membuat 4 tipe aktivitas berbeda dengan jadwal masing-masing | Berhasil |
| TEST-SCH-015 | CPA Exam Delayed Start | "Study CPA exam mulai 2 minggu dari sekarang: FAR Senin & Rabu 18:00-21:00, AUD Selasa & Kamis 18:00-21:00, REG Jumat 18:00-21:00, BEC Sabtu 09:00-12:00, Mock exam Minggu 13:00-17:00. Intensif 2 minggu terakhir 4 jam/hari" | Jadwal dimulai 2 minggu kedepan, intensitas berubah di 2 minggu terakhir | Berhasil |
| TEST-SCH-016 | 30-Day Challenge Rest Days | "30 hari challenge: Day 1-10 Cardio 30 min jam 07:00, Day 11-20 Cardio 30 min + Strength 20 min jam 07:00, Day 21-30 HIIT 20 min + Strength 30 min jam 06:30. Rest setiap hari ke-7" | Jadwal berubah per 10 hari, rest day setiap hari ke-7 (hari 7, 14, 21, 28) | Berhasil |
| TEST-SCH-017 | YouTube 2 Videos/Week | "Jadwal YouTube: Senin Research 19:00-21:00, Selasa Recording 19:00-20:30, Rabu Editing 19:00-22:00, Kamis Thumbnail 19:00-20:00, Jumat Upload 19:00-20:00. Target 2 video/minggu" | Sistem membuat jadwal 5 hari kerja untuk produksi 2 video per minggu | Berhasil |
| TEST-SCH-018 | Meal Prep Weekly + Daily | "Meal prep: Minggu shopping 09:00-10:00 + prep 10:00-13:00, Rabu mid-week prep 19:00-20:00, Daily breakfast 06:00-06:15, lunch pack 07:00-07:15, dinner 18:00-19:00" | Kombinasi jadwal weekly (Minggu & Rabu) dan daily activities | Berhasil |
| TEST-SCH-019 | Podcast Start Next Monday | "Produksi podcast mingguan mulai Senin depan: Senin research 20:00-21:00, Rabu pre-interview 20:00-21:00, Jumat recording 19:00-20:30, Sabtu editing 10:00-13:00, Minggu publishing 10:00-11:00" | Jadwal dimulai Senin depan (bukan hari ini), weekly recurring | Berhasil |
| TEST-SCH-020 | Stock Trading Market Hours | "Trading saham: Weekdays 08:30-09:00 market analysis, 09:00-09:30 paper trading, 15:00-15:30 review. Weekend technical analysis 2 jam, fundamental 2 jam. Skip market holidays" | Jadwal weekdays mengikuti jam pasar, weekend untuk study, skip hari libur bursa | Berhasil |
| TEST-SCH-021 | Morning Routine Complex | "Morning routine: 05:00 wake up, 05:05-05:20 meditation, 05:20-06:00 exercise, 06:00-06:15 shower, 06:15-06:45 breakfast, 06:45-07:00 journaling. Setiap hari kecuali Minggu mulai jam 07:00" | Multiple aktivitas berurutan pagi hari, Minggu schedule berbeda | Berhasil |
| TEST-SCH-022 | Study Group Coordination | "Study group matematika: Senin & Rabu personal study 16:00-18:00, Jumat group session 16:00-19:00, Sabtu tutoring 10:00-12:00. Ujian tanggal 30, intensive review 3 hari sebelumnya 4 jam/hari" | Kombinasi personal dan group study, intensive sebelum ujian | Berhasil |
| TEST-SCH-023 | Side Business Operations | "Bisnis online: Senin-Rabu product sourcing 19:00-20:00, Kamis photography 19:00-21:00, Jumat upload listings 19:00-20:30, Sabtu packing orders 09:00-12:00, Minggu customer service 10:00-11:00" | Jadwal operasional bisnis dengan aktivitas berbeda per hari | Berhasil |
| TEST-SCH-024 | Language Exchange Pattern | "Language exchange: Senin English teaching 19:00-20:00, Selasa Spanish learning 19:00-20:00, alternatif terus selama 3 bulan. Weekend conversation club Sabtu 14:00-16:00" | Jadwal alternating pattern + weekend group activity | Berhasil |
| TEST-SCH-025 | Ramadan Schedule | "Jadwal Ramadan: Sahur 03:30-04:00, Tahajud 04:00-04:30, Subuh 04:45, Kajian online 13:00-14:00, Ngabuburit 17:00-18:00, Buka puasa 18:00-19:00, Tarawih 20:00-21:30. Selama 30 hari" | Jadwal khusus religious dengan multiple waktu spesifik | Berhasil |
| TEST-SCH-026 | Remote Work Timezone | "Remote work untuk client US (WIB ke EST): Daily standup 20:00 WIB (7:00 EST), Core hours 21:00-01:00 WIB, Code review Jumat 23:00 WIB. Include timezone conversion notes" | Jadwal dengan timezone consideration dan notes | Berhasil |
| TEST-SCH-027 | Exam Period Crunch | "Periode ujian 2 minggu: Week 1 Matematika (4 jam/hari), Fisika (3 jam/hari), Kimia (2 jam/hari). Week 2 Biology (4 jam/hari), English (2 jam/hari), revision all subjects (3 jam/hari)" | Jadwal belajar intensif berubah per minggu untuk exam period | Berhasil |
| TEST-SCH-028 | Hybrid Work Pattern | "Kerja hybrid: Senin & Jumat WFH (09:00-17:00), Selasa-Kamis office (08:00-17:00 include commute time 1 jam). Meeting online Senin 10:00, in-person Wednesday 14:00" | Jadwal berbeda untuk WFH dan office days | Berhasil |
| TEST-SCH-029 | Seasonal Business | "Bisnis seasonal (3 bulan): Month 1 preparation & marketing (2 jam/hari), Month 2 production ramp up (4 jam/hari), Month 3 peak season (6 jam/hari + weekend 4 jam)" | Jadwal intensitas meningkat sesuai seasonal demand | Berhasil |
| TEST-SCH-030 | Recovery Program | "Program recovery cedera: Week 1-2 Rest & light stretching 15 min 2x/day, Week 3-4 Physical therapy 30 min/day, Week 5-6 Strength building 45 min alternate days, Week 7-8 Return to normal activity gradual" | Jadwal rehabilitasi progresif dengan careful progression | Berhasil |
| TEST-SCH-031 | Conference Preparation | "Persiapan conference presentation: 4 minggu sebelum - research (2 jam/hari), 3 minggu sebelum - slide creation (3 jam/hari), 2 minggu sebelum - practice (1 jam/hari), 1 minggu sebelum - final polish (30 min/hari)" | Jadwal preparation menurun intensitas mendekati event | Berhasil |
| TEST-SCH-032 | Baby Care Schedule | "Jadwal baby care: Feeding setiap 3 jam (06:00, 09:00, 12:00, 15:00, 18:00, 21:00), Nap time 10:00-11:00 & 14:00-15:30, Bath time 17:00, Bedtime routine 19:30-20:00" | Jadwal recurring dengan interval spesifik untuk childcare | Berhasil |
| TEST-SCH-033 | Garden Maintenance | "Maintenance taman: Daily watering 06:00 & 18:00 (15 min), Weekly weeding Sabtu 07:00-08:00, Bi-weekly fertilizing (minggu ke-1 & 3), Monthly pruning (hari Minggu terakhir)" | Kombinasi daily, weekly, bi-weekly, dan monthly tasks | Berhasil |
| TEST-SCH-034 | Music Practice Varied | "Latihan musik: Scales daily 30 min, Repertoire Senin/Rabu/Jumat 1 jam, Theory Selasa/Kamis 45 min, Band practice Sabtu 14:00-17:00, Performance last Sunday tiap bulan" | Multiple jenis practice dengan frekuensi berbeda | Berhasil |
| TEST-SCH-035 | Deadline-driven Project | "Project dengan deadline 15 Maret: Backward planning - Final review 13-14 Maret, Testing 10-12 Maret, Development 1-9 Maret, Design 25-28 Feb, Requirements 22-24 Feb" | Jadwal backward planning dari deadline | Berhasil |

### Epic: Fitur Dasbor

| ID Skenario | Pengujian | Langkah Pengujian | Hasil Diharapkan | Hasil |
|-------------|-----------|-------------------|------------------|-------|
| TEST-DASH-001 | View Dashboard | 1. Login ke aplikasi<br>2. Akses halaman dashboard<br>3. Cek widget progres<br>4. Cek today's schedule | Dashboard menampilkan semua widget dengan data real-time | Berhasil |
| TEST-DASH-002 | Update Status dari Dashboard | 1. Lihat today's schedule<br>2. Klik checkbox jadwal<br>3. Tandai sebagai complete<br>4. Cek perubahan progress | Status ter-update dan progress widget berubah real-time | Berhasil |
| TEST-DASH-003 | Widget Aktivitas | 1. Complete beberapa jadwal<br>2. Refresh dashboard<br>3. Cek aktivitas terkini<br>4. Scroll untuk load more | Aktivitas ter-display dengan infinite scroll | Berhasil |
| TEST-DASH-004 | Quick Stats | 1. Lihat completion rate<br>2. Lihat total goals<br>3. Lihat streak counter<br>4. Hover untuk detail | Statistik akurat dan tooltips informatif | Berhasil |

### Epic: Fitur Informasi Aplikasi

| ID Skenario | Pengujian | Langkah Pengujian | Hasil Diharapkan | Hasil |
|-------------|-----------|-------------------|------------------|-------|
| TEST-INFO-001 | Landing Page | 1. Akses root URL<br>2. Scroll hero section<br>3. Klik "Get Started"<br>4. Cek responsive mobile | Landing page ter-render dengan animasi smooth | Berhasil |
| TEST-INFO-002 | How It Works | 1. Klik menu "How It Works"<br>2. Lihat step-by-step guide<br>3. Play video tutorial<br>4. Expand FAQ | Semua konten informatif ter-display dengan benar | Berhasil |

### Epic: Fitur Pengaturan

| ID Skenario | Pengujian | Langkah Pengujian | Hasil Diharapkan | Hasil |
|-------------|-----------|-------------------|------------------|-------|
| TEST-SET-001 | Upload Avatar | 1. Buka Settings<br>2. Klik "Change Avatar"<br>3. Pilih file gambar<br>4. Crop dan save | Avatar ter-upload ke Supabase dan ter-display | Berhasil |
| TEST-SET-002 | Update Profile | 1. Buka profile settings<br>2. Edit nama dan bio<br>3. Simpan perubahan<br>4. Refresh halaman | Informasi profile ter-update dan persist | Berhasil |
| TEST-SET-003 | Theme Switch | 1. Buka settings<br>2. Toggle dark mode<br>3. Refresh halaman<br>4. Toggle back to light | Theme berubah dan preference tersimpan | Berhasil |

### Epic: Fitur Analisis Produktivitas

| ID Skenario | Pengujian | Langkah Pengujian | Hasil Diharapkan | Hasil |
|-------------|-----------|-------------------|------------------|-------|
| TEST-ANA-001 | View Analytics | 1. Navigasi ke Analytics<br>2. Lihat grafik completion rate<br>3. Lihat goal progress chart<br>4. Scroll untuk time insights | Semua chart ter-render dengan data akurat | Berhasil |
| TEST-ANA-002 | AI Insights | 1. Buka analytics page<br>2. Lihat insight header<br>3. Complete beberapa jadwal<br>4. Refresh dan lihat perubahan insight | AI menghasilkan insight yang relevan berdasarkan data 7 hari | Berhasil |
| TEST-ANA-003 | Export Report | 1. Buka analytics<br>2. Klik "Export PDF"<br>3. Pilih date range<br>4. Download file | Report PDF ter-generate dengan data dan grafik | Berhasil |
| TEST-ANA-004 | Metrics Tracking | 1. Complete jadwal<br>2. Abandon goal<br>3. Refresh analytics<br>4. Cek perubahan metrics | Metrics ter-update real-time sesuai aktivitas | Berhasil |
- Environment variables documented
- Rollback plan prepared