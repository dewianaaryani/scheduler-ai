# Dokumentasi Fitur Scheduler AI

## 📋 Daftar Isi
1. [Login & Pendaftaran](#1-login--pendaftaran)
2. [Halaman Utama (Dashboard)](#2-halaman-utama-dashboard)
3. [Kelola Target/Goal](#3-kelola-targetgoal)
4. [Jadwal Kegiatan](#4-jadwal-kegiatan)
5. [Kalender](#5-kalender)
6. [Asisten AI](#6-asisten-ai)
7. [Pengaturan Akun](#7-pengaturan-akun)
8. [Notifikasi](#8-notifikasi)
9. [Upload Gambar](#9-upload-gambar)
10. [Product Backlog](#10-product-backlog)

---

## 1. Login & Pendaftaran

### 🔐 Cara Masuk ke Aplikasi

#### Yang Sudah Ada:
- **Login pakai GitHub** - Tinggal klik tombol, langsung masuk pakai akun GitHub
- **Login pakai Google** - Sama, tinggal klik tombol Google
- **Otomatis aman** - Pakai sistem keamanan OAuth yang sudah teruji

#### Alur Login:
1. Buka halaman login
2. Pilih mau login pakai GitHub atau Google
3. Klik tombol yang dipilih
4. Diarahkan ke halaman GitHub/Google untuk konfirmasi
5. Kalau baru pertama kali, akan diarahkan ke halaman pengaturan awal
6. Kalau sudah pernah, langsung masuk ke dashboard

### 🎯 Pengaturan Awal (Onboarding)
**Untuk pengguna baru, wajib isi ini dulu:**

#### Step 1 - Data Diri:
- Upload foto profil (opsional)
- Isi nama lengkap
- Pilih zona waktu

#### Step 2 - Jam Tidur & Kerja:
- Atur jam tidur (misal: 22:00 - 06:00)
- Atur jam kerja (misal: 09:00 - 17:00)
- Sistem tidak akan kasih jadwal di jam-jam ini

#### Step 3 - Preferensi Jadwal:
- **Jadwal Ketat** - Harus ikuti jadwal yang sudah dibuat
- **Jadwal Fleksibel** - Boleh geser-geser sesuai kebutuhan
- Durasi fokus (berapa lama sekali belajar/kerja)
- Durasi istirahat (berapa lama istirahat)

---

## 2. Halaman Utama (Dashboard)

### 📊 Apa yang Ditampilkan

#### Ringkasan Hari Ini:
- **Total Kegiatan** - Ada berapa jadwal hari ini
- **Sudah Selesai** - Berapa yang sudah dikerjakan
- **Persentase** - Sudah berapa persen selesai
- **Sisa Waktu** - Masih ada waktu berapa jam lagi

#### Jadwal Hari Ini:
- Daftar kegiatan dari pagi sampai malam
- Jam berapa mulai dan selesai
- Status tiap kegiatan:
  - ⚪ Belum mulai
  - 🔵 Sedang dikerjakan
  - ✅ Sudah selesai
  - ❌ Terlewat
- Tombol untuk update status
- Bisa klik untuk lihat detail

#### Target yang Sedang Berjalan:
- Maksimal 5 target yang ditampilkan
- Ada bar progres (sudah berapa persen)
- Icon/emoji yang dipilih untuk target
- Tanggal deadline

#### Aktivitas Terakhir:
- 5 kegiatan terakhir yang dilakukan
- Kapan waktunya (misal: 2 jam yang lalu)
- Apa yang dilakukan (buat goal baru, update jadwal, dll)

---

## 3. Kelola Target/Goal

### 🎯 Fitur Lengkap Target

#### Buat Target Baru:
- **Pakai AI** - Cukup tulis keinginan, AI yang buatkan detail
- **Manual** - Isi sendiri semua detail
- Pilih emoji/icon (bisa emoji gabungan seperti 🏃‍♂️)
- Tentukan tanggal mulai & selesai
- Tulis deskripsi (maksimal 500 huruf)
- Otomatis dibuatkan jadwal harian

#### Lihat Semua Target:
- Tampil 10 target per halaman
- Bisa filter:
  - Yang masih jalan
  - Yang sudah selesai
  - Yang dibatalkan
- Bisa urutkan berdasarkan tanggal atau progres
- Ada fitur pencarian

#### Edit Target:
- Ubah judul, deskripsi, tanggal
- Update progres manual
- Ganti status (aktif/selesai/batal)
- Reschedule kalau mau geser tanggal

#### Hapus Target:
- Soft delete - Cuma ganti status jadi "dibatalkan"
- Hard delete - Hapus permanen dari database
- Ada konfirmasi dulu sebelum hapus

#### Statistik Target:
- Total berapa target yang dibuat
- Berapa persen tingkat keberhasilan
- Rata-rata waktu penyelesaian
- Streak (berapa hari berturut-turut mencapai target)

---

## 4. Jadwal Kegiatan

### 📅 Atur Jadwal Harian

#### Jadwal Otomatis dari AI:
- AI buatkan jadwal berdasarkan target
- Hormati jam tidur & jam kerja
- Bagi rata kegiatan dalam seminggu
- Deteksi kalau ada jadwal yang bentrok

#### Buat Jadwal Manual:
- Drag & drop di kalender
- Pilih jam mulai & selesai dengan detail
- Bisa buat jadwal berulang (misal tiap hari Senin)
- Atur pengingat khusus

#### Status Jadwal:
- **Belum Mulai** - Waktunya belum tiba
- **Sedang Berjalan** - Lagi dikerjakan
- **Selesai** - Sudah dikerjakan
- **Terlewat** - Tidak dikerjakan

#### Update Jadwal:
- Tombol cepat untuk ganti status
- Geser jadwal dengan drag & drop
- Operasi massal (pilih banyak jadwal sekaligus)
- Tambah catatan (maksimal 500 huruf)

---

## 5. Kalender

### 📆 Tampilan Kalender

#### Mode Tampilan:

**1. Tampilan Minggu (Default):**
- Lihat 7 hari sekaligus
- Kotak-kotak per jam
- Warna berbeda untuk tiap status
- Bisa langsung tambah jadwal dengan klik

**2. Tampilan Bulan:**
- Lihat 30/31 hari sekaligus
- Ada angka kecil yang tunjukkan berapa kegiatan
- Warna lebih gelap = lebih banyak kegiatan
- Navigasi bulan sebelum/sesudah

**3. Tampilan Hari:**
- Detail per jam dalam sehari
- Bisa lihat kalau ada jadwal yang bentrok
- Peringatan kalau ada konflik waktu
- Presisi sampai menit

#### Fitur Interaktif:
- **Drag & Drop** - Geser jadwal ke waktu lain
- **Klik Sekali** - Lihat detail
- **Klik Dua Kali** - Edit langsung
- **Klik Kanan** - Menu pilihan

#### Filter Kalender:
- Filter berdasarkan goal tertentu
- Filter berdasarkan status
- Filter rentang tanggal
- Filter durasi kegiatan

---

## 6. Asisten AI

### 🤖 Fitur Kecerdasan Buatan

#### Buat Goal dari Kalimat Biasa:
- **Contoh Input**: "Aku mau belajar bahasa Inggris 30 menit setiap hari"
- **AI akan buat**:
  - Judul goal yang bagus
  - Deskripsi lengkap
  - Jadwal harian otomatis
  - Emoji yang cocok

#### Saran Goal:
- Berdasarkan riwayat goal sebelumnya
- Topik yang sedang tren
- Rekomendasi personal
- Jalur pengembangan skill

#### Optimasi Jadwal:
- Atur ulang jadwal supaya lebih efisien
- Pertimbangkan tingkat energi (pagi untuk yang berat, sore untuk yang ringan)
- Sisipkan waktu istirahat otomatis
- Prioritaskan berdasarkan deadline

#### Cara Kerja AI:
1. User ketik keinginan dalam bahasa sehari-hari
2. AI proses dan pahami maksudnya
3. Buat struktur goal dan jadwal
4. Validasi tidak bentrok dengan jadwal lain
5. Tampilkan hasil untuk di-review user

---

## 7. Pengaturan Akun

### ⚙️ Semua Pengaturan

#### Profil:
- Ganti foto profil
- Ubah nama tampilan
- Tulis bio/deskripsi diri
- Info kontak

#### Preferensi Waktu:
- Ubah jam tidur
- Ubah jam kerja
- Pilih zona waktu
- Atur hari libur

#### Preferensi Jadwal:
- Durasi default untuk kegiatan baru
- Jeda antar kegiatan
- Pengaturan pengingat
- Aturan jadwal otomatis

#### Notifikasi:
- Notifikasi email (on/off)
- Push notification (on/off)
- Frekuensi pengingat
- Jam tenang (tidak ada notifikasi)

#### Pengaturan AI:
- Bahasa yang digunakan AI
- Seberapa sering kasih saran
- Level otomasi
- Preferensi pembelajaran

---

## 8. Notifikasi

### 🔔 Sistem Pemberitahuan

#### Notifikasi Sukses (Hijau):
- Goal berhasil dibuat
- Jadwal berhasil diupdate
- Profil berhasil disimpan
- Upload berhasil

#### Notifikasi Error (Merah):
- Ada yang salah diisi
- Gagal simpan ke database
- Tidak punya akses
- Kuota habis

#### Notifikasi Info (Biru):
- Pengingat jadwal
- Tips & trik
- Update sistem
- Fitur baru

#### Notifikasi Peringatan (Kuning):
- Ada jadwal bentrok
- Deadline sudah dekat
- Terlalu banyak jadwal
- Ada data yang kurang

---

## 9. Upload Gambar

### 📁 Sistem Upload File

#### Yang Bisa Diupload:
- Foto profil/avatar
- Maksimal 5MB per file
- Format: JPG, PNG, GIF, WebP
- Otomatis dikecilkan kalau terlalu besar

#### Keamanan:
- Harus login dulu
- Cek tipe file
- Batasi ukuran file
- Scan virus otomatis

#### Penyimpanan:
- Pakai Supabase storage
- CDN untuk akses cepat
- Backup otomatis
- Bisa diakses dari mana saja

---

## 10. Product Backlog

### 📝 Tabel Product Backlog

#### 🔴 Priority 1 - URGENT (Harus segera dikerjakan)

| ID | Kategori | User Story | Estimasi | Status | Sprint |
|----|----------|------------|----------|--------|--------|
| P1-01 | Bug Fix | Sebagai user, saya ingin jadwal tidak bentrok agar aktivitas berjalan lancar | 3 hari | ⏳ Todo | Sprint 1 |
| P1-02 | Bug Fix | Sebagai user, saya ingin session tidak timeout cepat agar tidak login berulang | 2 hari | ⏳ Todo | Sprint 1 |
| P1-03 | Bug Fix | Sebagai user, saya ingin upload gambar > 3MB berhasil | 2 hari | ⏳ Todo | Sprint 1 |
| P1-04 | Bug Fix | Sebagai user, saya ingin kalender update real-time setelah edit | 3 hari | ⏳ Todo | Sprint 1 |
| P1-05 | Bug Fix | Sebagai user, saya ingin progress bar akurat untuk goal multi-minggu | 2 hari | ⏳ Todo | Sprint 1 |
| P1-06 | Performance | Sebagai user, saya ingin dashboard load < 3 detik | 3 hari | ⏳ Todo | Sprint 1 |
| P1-07 | Stabilitas | Sebagai user, saya ingin error handling yang baik saat API timeout | 2 hari | ⏳ Todo | Sprint 1 |
| P1-08 | Fitur | Sebagai user, saya ingin tombol logout yang jelas | 1 hari | ⏳ Todo | Sprint 1 |
| P1-09 | Fitur | Sebagai user, saya ingin konfirmasi sebelum hapus permanen | 1 hari | ⏳ Todo | Sprint 1 |
| P1-10 | Fitur | Sebagai user, saya ingin bisa undo aksi delete | 2 hari | ⏳ Todo | Sprint 1 |
| P1-11 | Fitur | Sebagai user, saya ingin validasi form yang ketat agar data valid | 2 hari | ⏳ Todo | Sprint 1 |
| P1-12 | Fitur | Sebagai user, saya ingin recovery password jika lupa | 3 hari | ⏳ Todo | Sprint 1 |

#### 🟡 Priority 2 - HIGH (Penting untuk UX)

| ID | Kategori | User Story | Estimasi | Status | Sprint |
|----|----------|------------|----------|--------|--------|
| P2-01 | Dashboard | Sebagai user, saya ingin widget cuaca untuk planning outdoor | 3 hari | ⏳ Todo | Sprint 2 |
| P2-02 | Dashboard | Sebagai user, saya ingin motivational quotes harian | 2 hari | ⏳ Todo | Sprint 2 |
| P2-03 | Dashboard | Sebagai user, saya ingin achievement badges untuk motivasi | 5 hari | ⏳ Todo | Sprint 3 |
| P2-04 | Dashboard | Sebagai user, saya ingin mini calendar di dashboard | 2 hari | ⏳ Todo | Sprint 2 |
| P2-05 | Dashboard | Sebagai user, saya ingin quick add button untuk goal/schedule | 2 hari | ⏳ Todo | Sprint 2 |
| P2-06 | Dashboard | Sebagai user, saya ingin layout dashboard yang customizable | 5 hari | ⏳ Todo | Sprint 4 |
| P2-07 | Dashboard | Sebagai user, saya ingin dark mode untuk nyaman di malam hari | 3 hari | ⏳ Todo | Sprint 2 |
| P2-08 | Goal | Sebagai user, saya ingin sub-goals untuk tracking milestone | 5 hari | ⏳ Todo | Sprint 3 |
| P2-09 | Goal | Sebagai user, saya ingin template library untuk goal umum | 3 hari | ⏳ Todo | Sprint 3 |
| P2-10 | Goal | Sebagai user, saya ingin share goal dengan teman | 4 hari | ⏳ Todo | Sprint 4 |
| P2-11 | Goal | Sebagai user, saya ingin attach file ke goal | 3 hari | ⏳ Todo | Sprint 3 |
| P2-12 | Goal | Sebagai user, saya ingin categories/tags untuk organisasi | 2 hari | ⏳ Todo | Sprint 3 |
| P2-13 | Goal | Sebagai user, saya ingin recurring goals untuk kebiasaan | 4 hari | ⏳ Todo | Sprint 4 |
| P2-14 | Goal | Sebagai user, saya ingin goal dependencies untuk project kompleks | 5 hari | ⏳ Todo | Sprint 5 |
| P2-15 | Calendar | Sebagai user, saya ingin print calendar view | 2 hari | ⏳ Todo | Sprint 4 |
| P2-16 | Calendar | Sebagai user, saya ingin export ke Google Calendar | 4 hari | ⏳ Todo | Sprint 4 |
| P2-17 | Calendar | Sebagai user, saya ingin import dari calendar lain | 4 hari | ⏳ Todo | Sprint 4 |
| P2-18 | Calendar | Sebagai user, saya ingin color coding berdasarkan goal | 2 hari | ⏳ Todo | Sprint 4 |
| P2-19 | Calendar | Sebagai user, saya ingin multi-day event support | 3 hari | ⏳ Todo | Sprint 5 |
| P2-20 | Calendar | Sebagai user, saya ingin calendar sharing dengan tim | 4 hari | ⏳ Todo | Sprint 5 |
| P2-21 | Kolaborasi | Sebagai user, saya ingin invite friends ke platform | 3 hari | ⏳ Todo | Sprint 5 |
| P2-22 | Kolaborasi | Sebagai user, saya ingin shared goals dengan tim | 5 hari | ⏳ Todo | Sprint 5 |
| P2-23 | Kolaborasi | Sebagai user, saya ingin comment on goals untuk diskusi | 3 hari | ⏳ Todo | Sprint 6 |
| P2-24 | Kolaborasi | Sebagai user, saya ingin accountability partner | 4 hari | ⏳ Todo | Sprint 6 |

#### 🟢 Priority 3 - MEDIUM (Nice to have)

| ID | Kategori | User Story | Estimasi | Status | Sprint |
|----|----------|------------|----------|--------|--------|
| P3-01 | Analytics | Sebagai user, saya ingin weekly/monthly reports | 5 hari | ⏳ Todo | Sprint 5 |
| P3-02 | Analytics | Sebagai user, saya ingin productivity score | 3 hari | ⏳ Todo | Sprint 5 |
| P3-03 | Analytics | Sebagai user, saya ingin time tracking analysis | 4 hari | ⏳ Todo | Sprint 5 |
| P3-04 | Analytics | Sebagai user, saya ingin goal completion patterns | 3 hari | ⏳ Todo | Sprint 5 |
| P3-05 | Analytics | Sebagai user, saya ingin export reports (PDF/Excel) | 3 hari | ⏳ Todo | Sprint 5 |
| P3-06 | Gamification | Sebagai user, saya ingin points system untuk motivasi | 4 hari | ⏳ Todo | Sprint 6 |
| P3-07 | Gamification | Sebagai user, saya ingin level & XP progression | 4 hari | ⏳ Todo | Sprint 6 |
| P3-08 | Gamification | Sebagai user, saya ingin leaderboard untuk kompetisi | 3 hari | ⏳ Todo | Sprint 6 |
| P3-09 | Gamification | Sebagai user, saya ingin daily challenges | 3 hari | ⏳ Todo | Sprint 6 |
| P3-10 | Gamification | Sebagai user, saya ingin streak rewards | 2 hari | ⏳ Todo | Sprint 6 |
| P3-11 | Mobile | Sebagai user, saya ingin PWA untuk mobile access | 5 hari | ⏳ Todo | Sprint 6 |
| P3-12 | Mobile | Sebagai user, saya ingin offline mode | 5 hari | ⏳ Todo | Sprint 6 |
| P3-13 | Mobile | Sebagai user, saya ingin push notifications | 3 hari | ⏳ Todo | Sprint 6 |
| P3-14 | AI | Sebagai user, saya ingin voice input untuk goal | 4 hari | ⏳ Todo | Future |
| P3-15 | AI | Sebagai user, saya ingin AI coach/mentor | 8 hari | ⏳ Todo | Future |
| P3-16 | AI | Sebagai user, saya ingin predictive scheduling | 5 hari | ⏳ Todo | Future |
| P3-17 | AI | Sebagai user, saya ingin smart reminders | 3 hari | ⏳ Todo | Future |

#### 🔵 Priority 4 - LOW (Future considerations)

| ID | Kategori | User Story | Estimasi | Status | Sprint |
|----|----------|------------|----------|--------|--------|
| P4-01 | Integrasi | Sebagai user, saya ingin Spotify integration untuk fokus | 5 hari | ⏳ Todo | Future |
| P4-02 | Integrasi | Sebagai user, saya ingin Notion integration | 5 hari | ⏳ Todo | Future |
| P4-03 | Integrasi | Sebagai user, saya ingin Slack notifications | 3 hari | ⏳ Todo | Future |
| P4-04 | Monetisasi | Sebagai owner, saya ingin premium features | 8 hari | ⏳ Todo | Future |
| P4-05 | Monetisasi | Sebagai owner, saya ingin subscription tiers | 5 hari | ⏳ Todo | Future |
| P4-06 | Monetisasi | Sebagai owner, saya ingin team/enterprise plans | 8 hari | ⏳ Todo | Future |
| P4-07 | Advanced | Sebagai user, saya ingin Pomodoro timer | 3 hari | ⏳ Todo | Future |
| P4-08 | Advanced | Sebagai user, saya ingin community forum | 10 hari | ⏳ Todo | Future |
| P4-09 | Accessibility | Sebagai user, saya ingin multi-language support | 10 hari | ⏳ Todo | Future |
| P4-10 | Accessibility | Sebagai user, saya ingin keyboard shortcuts | 3 hari | ⏳ Todo | Future |

### 📊 Technical Debt Backlog

| ID | Kategori | Technical Story | Estimasi | Impact | Status |
|----|----------|----------------|----------|--------|--------|
| TD-01 | Backend | Implement Redis caching layer | 5 hari | High | ⏳ Todo |
| TD-02 | Backend | Database indexing optimization | 3 hari | High | ⏳ Todo |
| TD-03 | Backend | API rate limiting implementation | 2 hari | Medium | ⏳ Todo |
| TD-04 | Backend | WebSocket for real-time updates | 5 hari | Medium | ⏳ Todo |
| TD-05 | Frontend | Migrate to React 19 when stable | 8 hari | Low | ⏳ Todo |
| TD-06 | Frontend | Implement React Query/TanStack | 5 hari | Medium | ⏳ Todo |
| TD-07 | Testing | E2E testing with Playwright | 8 hari | High | ⏳ Todo |
| TD-08 | Testing | Unit test coverage > 80% | 10 hari | High | ⏳ Todo |
| TD-09 | DevOps | CI/CD pipeline setup | 5 hari | High | ⏳ Todo |
| TD-10 | Security | GDPR compliance implementation | 8 hari | High | ⏳ Todo |
| TD-11 | Security | Data encryption at rest | 3 hari | High | ⏳ Todo |
| TD-12 | DevOps | Automated backup system | 3 hari | High | ⏳ Todo |

### 🎯 Sprint Detail

## Sprint 1: Stabilisasi & Bug Fixing
**Durasi**: 2 Minggu (Minggu 1-2)

### 📅 Sprint Planning
| Aspek | Detail |
|-------|--------|
| **Sprint Goal** | Memperbaiki semua bug kritis dan menambah fitur dasar yang hilang |
| **Velocity Target** | 25 story points |
| **Team Capacity** | 4 developers × 10 hari = 40 hari kerja |
| **Sprint Backlog** | P1-01 sampai P1-12 (semua Priority 1) |

### 🏃 Sprint Execution
| Minggu | Focus Area | Tasks | PIC |
|--------|------------|-------|-----|
| **Minggu 1** | Bug Fixes | P1-01 (Conflict detection), P1-02 (Session timeout), P1-03 (Upload fix), P1-04 (Real-time update) | Dev Team |
| **Minggu 1** | Performance | P1-06 (Dashboard loading), P1-07 (Error handling) | Senior Dev |
| **Minggu 2** | Bug Fixes | P1-05 (Progress bar accuracy) | Dev Team |
| **Minggu 2** | Features | P1-08 (Logout button), P1-09 (Delete confirmation), P1-10 (Undo), P1-11 (Validation), P1-12 (Recovery) | Full Team |

### 🔍 Sprint Review
| Kriteria | Target | Actual | Status |
|----------|--------|--------|--------|
| Stories Completed | 12 | TBD | ⏳ |
| Bug Fixed | 7 | TBD | ⏳ |
| Features Added | 5 | TBD | ⏳ |
| User Satisfaction | >4.0 | TBD | ⏳ |

### 💭 Sprint Retrospective
| Kategori | Items |
|----------|-------|
| **What Went Well** | - TBD setelah sprint selesai |
| **What Could Be Improved** | - TBD setelah sprint selesai |
| **Action Items** | - TBD setelah sprint selesai |

---

## Sprint 2: Dashboard & UX Enhancement
**Durasi**: 2 Minggu (Minggu 3-4)

### 📅 Sprint Planning
| Aspek | Detail |
|-------|--------|
| **Sprint Goal** | Meningkatkan user experience dengan dark mode dan dashboard enhancements |
| **Velocity Target** | 20 story points |
| **Team Capacity** | 4 developers × 10 hari = 40 hari kerja |
| **Sprint Backlog** | P2-01, P2-02, P2-04, P2-05, P2-07 |

### 🏃 Sprint Execution
| Minggu | Focus Area | Tasks | PIC |
|--------|------------|-------|-----|
| **Minggu 3** | Dark Mode | P2-07 (Dark mode implementation) | Frontend Team |
| **Minggu 3** | Widgets | P2-01 (Weather widget), P2-02 (Quotes) | UI Team |
| **Minggu 4** | Dashboard | P2-04 (Mini calendar), P2-05 (Quick add) | Full Team |
| **Minggu 4** | Testing | Integration testing & bug fixes | QA Team |

### 🔍 Sprint Review
| Kriteria | Target | Actual | Status |
|----------|--------|--------|--------|
| Features Delivered | 5 | TBD | ⏳ |
| UI Improvements | 3 | TBD | ⏳ |
| Performance Impact | <5% slower | TBD | ⏳ |
| User Feedback Score | >4.2 | TBD | ⏳ |

### 💭 Sprint Retrospective
| Kategori | Items |
|----------|-------|
| **What Went Well** | - TBD |
| **What Could Be Improved** | - TBD |
| **Action Items** | - TBD |

---

## Sprint 3: Goal Enhancement
**Durasi**: 2 Minggu (Minggu 5-6)

### 📅 Sprint Planning
| Aspek | Detail |
|-------|--------|
| **Sprint Goal** | Memperkaya fitur goal management dengan sub-goals dan templates |
| **Velocity Target** | 22 story points |
| **Team Capacity** | 4 developers × 10 hari = 40 hari kerja |
| **Sprint Backlog** | P2-03, P2-08, P2-09, P2-11, P2-12 |

### 🏃 Sprint Execution
| Minggu | Focus Area | Tasks | PIC |
|--------|------------|-------|-----|
| **Minggu 5** | Sub-goals | P2-08 (Milestone tracking) | Backend Team |
| **Minggu 5** | Templates | P2-09 (Goal templates) | Full Stack |
| **Minggu 6** | Features | P2-11 (File attachments), P2-12 (Tags) | Dev Team |
| **Minggu 6** | Gamification | P2-03 (Achievement badges) | Frontend Team |

### 🔍 Sprint Review
| Kriteria | Target | Actual | Status |
|----------|--------|--------|--------|
| Goal Features | 5 | TBD | ⏳ |
| Template Library | 10+ templates | TBD | ⏳ |
| Badge Types | 5+ badges | TBD | ⏳ |
| User Engagement | +15% | TBD | ⏳ |

### 💭 Sprint Retrospective
| Kategori | Items |
|----------|-------|
| **What Went Well** | - TBD |
| **What Could Be Improved** | - TBD |
| **Action Items** | - TBD |

---

## Sprint 4: Calendar Power Features
**Durasi**: 2 Minggu (Minggu 7-8)

### 📅 Sprint Planning
| Aspek | Detail |
|-------|--------|
| **Sprint Goal** | Integrasi kalender eksternal dan fitur sharing |
| **Velocity Target** | 25 story points |
| **Team Capacity** | 4 developers × 10 hari = 40 hari kerja |
| **Sprint Backlog** | P2-06, P2-10, P2-13, P2-15, P2-16, P2-17, P2-18 |

### 🏃 Sprint Execution
| Minggu | Focus Area | Tasks | PIC |
|--------|------------|-------|-----|
| **Minggu 7** | Integration | P2-16 (Google Calendar export), P2-17 (Import) | Integration Team |
| **Minggu 7** | Sharing | P2-10 (Goal sharing) | Backend Team |
| **Minggu 8** | UI/UX | P2-06 (Custom layout), P2-18 (Color coding) | Frontend Team |
| **Minggu 8** | Features | P2-13 (Recurring goals), P2-15 (Print view) | Full Team |

### 🔍 Sprint Review
| Kriteria | Target | Actual | Status |
|----------|--------|--------|--------|
| Integrations | 2 | TBD | ⏳ |
| Sharing Features | 1 | TBD | ⏳ |
| UI Improvements | 3 | TBD | ⏳ |
| API Performance | <1s response | TBD | ⏳ |

### 💭 Sprint Retrospective
| Kategori | Items |
|----------|-------|
| **What Went Well** | - TBD |
| **What Could Be Improved** | - TBD |
| **Action Items** | - TBD |

---

## Sprint 5: Analytics & Collaboration MVP
**Durasi**: 2 Minggu (Minggu 9-10)

### 📅 Sprint Planning
| Aspek | Detail |
|-------|--------|
| **Sprint Goal** | Implementasi basic analytics dan fitur kolaborasi awal |
| **Velocity Target** | 28 story points |
| **Team Capacity** | 4 developers × 10 hari = 40 hari kerja |
| **Sprint Backlog** | P2-14, P2-19, P2-20, P2-21, P2-22, P3-01 sampai P3-05 |

### 🏃 Sprint Execution
| Minggu | Focus Area | Tasks | PIC |
|--------|------------|-------|-----|
| **Minggu 9** | Analytics | P3-01 (Reports), P3-02 (Score), P3-03 (Time tracking) | Analytics Team |
| **Minggu 9** | Analytics | P3-04 (Patterns), P3-05 (Export) | Backend Team |
| **Minggu 10** | Collaboration | P2-21 (Invite), P2-22 (Shared goals) | Full Team |
| **Minggu 10** | Calendar | P2-19 (Multi-day), P2-20 (Sharing), P2-14 (Dependencies) | Dev Team |

### 🔍 Sprint Review
| Kriteria | Target | Actual | Status |
|----------|--------|--------|--------|
| Analytics Features | 5 | TBD | ⏳ |
| Reports Generated | 3 types | TBD | ⏳ |
| Collaboration Features | 2 | TBD | ⏳ |
| Data Accuracy | >95% | TBD | ⏳ |

### 💭 Sprint Retrospective
| Kategori | Items |
|----------|-------|
| **What Went Well** | - TBD |
| **What Could Be Improved** | - TBD |
| **Action Items** | - TBD |

---

## Sprint 6: Mobile & Gamification
**Durasi**: 2 Minggu (Minggu 11-12)

### 📅 Sprint Planning
| Aspek | Detail |
|-------|--------|
| **Sprint Goal** | PWA implementation dan gamification untuk engagement |
| **Velocity Target** | 30 story points |
| **Team Capacity** | 4 developers × 10 hari = 40 hari kerja |
| **Sprint Backlog** | P2-23, P2-24, P3-06 sampai P3-13 |

### 🏃 Sprint Execution
| Minggu | Focus Area | Tasks | PIC |
|--------|------------|-------|-----|
| **Minggu 11** | Mobile | P3-11 (PWA), P3-12 (Offline), P3-13 (Push notif) | Mobile Team |
| **Minggu 11** | Gamification | P3-06 (Points), P3-07 (Level/XP) | Game Team |
| **Minggu 12** | Gamification | P3-08 (Leaderboard), P3-09 (Challenges), P3-10 (Streaks) | Game Team |
| **Minggu 12** | Collaboration | P2-23 (Comments), P2-24 (Accountability) | Backend Team |

### 🔍 Sprint Review
| Kriteria | Target | Actual | Status |
|----------|--------|--------|--------|
| PWA Score | >90 | TBD | ⏳ |
| Offline Features | 3 | TBD | ⏳ |
| Gamification Elements | 5 | TBD | ⏳ |
| User Retention | +20% | TBD | ⏳ |

### 💭 Sprint Retrospective
| Kategori | Items |
|----------|-------|
| **What Went Well** | - TBD |
| **What Could Be Improved** | - TBD |
| **Action Items** | - TBD |

---

### 📈 Success Metrics

#### User Engagement
- Daily Active Users (DAU) target: 1000
- Weekly retention rate > 60%
- Average session duration > 5 minutes
- Goals created per user > 3

#### Performance
- Page load time < 2 seconds
- API response time < 500ms
- Uptime > 99.9%
- Error rate < 0.1%

#### Business
- User satisfaction score > 4.5/5
- Conversion rate free to paid > 5%
- Churn rate < 10% monthly
- Support ticket resolution < 24 hours

---

## 🔄 Changelog

### Version 1.0.0 (Current)
- ✅ Basic authentication
- ✅ Goal CRUD
- ✅ Schedule management
- ✅ Calendar views
- ✅ AI integration
- ✅ Dashboard

### Version 1.1.0 (Planned)
- 🔄 Bug fixes Priority 1
- 🔄 Dark mode
- 🔄 Performance improvements

### Version 1.2.0 (Future)
- 📋 Analytics dashboard
- 📋 Mobile PWA
- 📋 Team features

---

*Dokumen ini diupdate terakhir: Januari 2025*
*Untuk request fitur baru, hubungi tim development*