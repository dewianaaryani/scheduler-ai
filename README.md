# Scheduler AI - KALANA (Aplikasi Penjadwalan AI)

[![Tests](https://img.shields.io/badge/tests-61%20passing-brightgreen)](tests/)
[![Coverage](https://img.shields.io/badge/coverage-mocked-yellow)](tests/)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

KALANA (Scheduler AI) adalah aplikasi penjadwalan cerdas yang membantu pengguna merencanakan dan mengelola tujuan mereka dengan bantuan AI. Aplikasi ini menggunakan Claude AI dari Anthropic untuk menghasilkan jadwal yang dipersonalisasi berdasarkan preferensi dan ketersediaan pengguna.

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Alur Fitur Goals (Tujuan)](#-alur-fitur-goals-tujuan)
- [Alur Fitur Lainnya](#-alur-fitur-lainnya)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Instalasi & Setup](#-instalasi--setup)
- [Struktur Database](#-struktur-database)
- [API Endpoints](#-api-endpoints)

## 🌟 Fitur Utama

### 1. **Authentication (Autentikasi)**
- OAuth login dengan GitHub dan Google
- Session management menggunakan NextAuth.js v5
- Protected routes dengan redirect otomatis
- Onboarding flow untuk pengguna baru

### 2. **Goals Management (Manajemen Tujuan)**
- Pembuatan tujuan dengan AI assistance
- Progress tracking real-time berdasarkan schedules
- Status management: ACTIVE, COMPLETED, ABANDONED
- Visualisasi progress dengan progress bar
- Detail view dengan tabs (Overview & Settings)
- Edit, update, dan delete goals

### 3. **AI-Powered Goal Generation**
- Input natural language dalam bahasa Indonesia/Inggris
- Streaming response dengan progress updates real-time
- AI ekstraksi: title, description, dates, emoji
- Generasi jadwal otomatis berdasarkan preferensi
- Suggestions berdasarkan riwayat goals
- Deteksi duplikasi goal (5 detik)

### 4. **Calendar System**
- Week view dan Month view
- Navigasi dengan tombol previous/next
- Display schedules per hari
- Add event manual (belum ada drag & drop)
- Status indicator untuk setiap schedule
- Filter berdasarkan tanggal

### 5. **Dashboard**
- Greeting dengan waktu real-time
- Overview stats (active goals, completion rate, schedules)
- Today's schedule dengan timeline view
- Recent activities
- Quick navigation ke fitur utama

### 6. **Analytics**
- Metrics overview dengan key indicators
- Goal analytics dengan completion trends
- Schedule performance tracking
- Time insights analysis
- Productivity trends dengan chart
- Date range filter (7, 30, 90 hari)

### 7. **Settings**
- **Account Settings:**
  - Update nama pengguna
  - Upload & change avatar (Supabase storage)
  - View account info
- **Availability Settings:**
  - Set work hours
  - Set sleep hours
  - Manage busy blocks
  - Toggle flexible/rigid schedule mode

## 🎯 Alur Fitur Goals (Tujuan)

### Pengertian Goals

Goals adalah target atau objektif yang ingin dicapai dalam periode tertentu. Setiap goal memiliki:

- **Title**: Nama tujuan (max 100 karakter)
- **Description**: Deskripsi detail (max 500 karakter)
- **Start & End Date**: Periode pencapaian (max 6 bulan)
- **Emoji**: Ikon visual (support complex emoji hingga 20 karakter)
- **Status**: ACTIVE | COMPLETED | ABANDONED
- **Progress**: Dihitung otomatis dari schedules
- **Schedules**: Jadwal aktivitas terkait

### Flow Pembuatan Goal

#### 1. **Input Natural Language** (`/ai` page)
```
User → Halaman AI → Input tujuan → Submit
```
Contoh input:
- "Saya ingin belajar React dalam 2 bulan"
- "Bantu saya menurunkan berat badan 5kg dalam 3 bulan"

#### 2. **AI Processing dengan Streaming**
```
Input → Claude API → Stream Response → Parse Data
```

Progress updates real-time:
1. "Menghubungi AI..." (0-20%)
2. "Menganalisis tujuan Anda..." (20-40%)
3. "Membuat rencana jadwal..." (40-70%)
4. "Menyesuaikan dengan preferensi..." (70-90%)
5. "Finalisasi..." (90-100%)

AI mengekstrak:
- **Title**: Judul yang singkat dan jelas
- **Description**: Deskripsi lengkap tujuan
- **Dates**: Tanggal mulai dan selesai (auto-calculate dari input)
- **Emoji**: Emoji yang sesuai konteks
- **Schedules**: Aktivitas harian dengan waktu

#### 3. **Preview & Konfirmasi**
```
AI Response → Preview Card → Edit (optional) → Confirm
```

User dapat:
- Review hasil AI generation
- Edit title, description, dates
- Lihat preview schedules
- Confirm atau regenerate

#### 4. **Generate & Save Schedules**
```
Goal Data → Validate → Generate Schedules → Save to DB
```

Proses generasi:
1. **Validasi tanggal**: Ensure valid date range
2. **Check preferences**: Work hours, sleep hours, busy blocks
3. **Distribusi aktivitas**: Spread evenly across days
4. **Set progress percentage**: Progressive dari 0-100%
5. **Avoid conflicts**: Check existing schedules

#### 5. **Success & Redirect**
```
Save Success → Toast Notification → Redirect to Goal Detail
```

### Flow Management Goal

#### **Goals List Page** (`/goals`)
- **Filter tabs**: ACTIVE | COMPLETED | ABANDONED
- **Goal cards** dengan:
  - Emoji & title
  - Description preview
  - Date range
  - Progress bar
  - Link to detail
- **Empty states** dengan CTA
- **Loading skeletons** saat fetch data

#### **Goal Detail Page** (`/goals/[id]`)

**Overview Tab:**
- Goal summary card
- Progress visualization
- Schedules list dengan:
  - Time & title
  - Status badges
  - Update status buttons
- Activities/schedules grouped by date

**Settings Tab:**
- Edit goal information
- Update dates (dengan validasi)
- Change status manually
- Delete goal dengan konfirmasi

#### **Schedule Status Management**
```
Click Status → Update DB → Recalculate Progress → Update UI
```

Status transitions:
- `NONE` → `IN_PROGRESS` → `COMPLETED`
- `NONE` → `MISSED` (auto jika melewati waktu)
- Any → `ABANDONED` (manual)

## 🔄 Alur Fitur Lainnya

### Onboarding Flow (`/on-boarding`)
```
First Login → Check Preferences → Multi-step Form → Save → Dashboard
```

Steps:
1. **Intro**: Welcome screen dengan penjelasan
2. **Schedule Type**: Pilih flexible atau rigid
3. **Daily Routine**: Set work & sleep hours
4. **Busy Blocks**: Mark unavailable times
5. **Weekly Pattern**: Consistent atau varying
6. **Notes**: Additional preferences
7. **Completion**: Save & redirect

### Dashboard Flow (`/dashboard`)
- **Header**: Dynamic greeting berdasarkan waktu
- **Stats Cards**: 
  - Active goals count
  - Overall completion rate
  - Today's schedules count
- **Today's Schedule**: Timeline dengan status updates
- **Quick Actions**: Create goal, view calendar

### Calendar Flow (`/calendar`)
- **View Toggle**: Week | Month
- **Navigation**: Previous/Next buttons
- **Week View**: 
  - 7-day grid
  - Time slots per hour
  - Schedule blocks dengan info
- **Month View**:
  - Calendar grid
  - Daily schedule count
  - Click untuk detail
- **Add Event**: Manual form (no drag-drop yet)

### Analytics Flow (`/analytics`)
- **Date Range Selector**: 7, 30, 90 days
- **Metrics Cards**:
  - Total goals & schedules
  - Completion rates
  - Average daily activities
- **Charts**:
  - Goal completion trends
  - Schedule performance
  - Productivity by day
  - Time distribution

## 🚀 Teknologi yang Digunakan

### Frontend
- **Next.js 15.2.3** - App Router dengan Turbopack
- **TypeScript 5.8.3** - Type safety
- **Tailwind CSS v4** - Styling dengan Poppins font
- **shadcn/ui** - Component library berbasis Radix UI
- **React Hook Form + Zod** - Form handling & validation

### Backend & Database
- **PostgreSQL** - Primary database (Supabase)
- **Prisma ORM 6.5.0** - Database management
- **NextAuth.js v5** - Authentication
- **Anthropic Claude API** - AI integration

### UI Libraries
- **Lucide React** - Icons
- **Recharts** - Data visualization
- **React Day Picker** - Date selection
- **Sonner** - Toast notifications
- **date-fns** - Date utilities

### Services
- **Supabase** - Database & file storage
- **Vercel** - Deployment platform

## 📦 Instalasi & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Anthropic API key
- OAuth apps (GitHub/Google)
- Supabase project

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# AI
ANTHROPIC_API_KEY=""

# Storage
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
```

### Installation
```bash
# Clone repository
git clone [repository-url]
cd scheduler-ai

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed

# Run development
npm run dev
```

## 🗃️ Struktur Database

### Core Tables

**User**
- `id`: CUID primary key
- `name`: Nama pengguna
- `email`: Email unik
- `image`: Avatar URL
- `preferences`: JSON (work hours, sleep hours, etc.)
- Relations: Goals, Schedules, Account, Session

**Goal**
- `id`: UUID primary key
- `userId`: Foreign key to User
- `title`: Nama tujuan
- `description`: Deskripsi
- `startDate` & `endDate`: Periode
- `emoji`: Visual identifier
- `status`: ACTIVE | COMPLETED | ABANDONED
- Relations: Schedules

**Schedule**
- `id`: UUID primary key
- `userId`: Foreign key to User
- `goalId`: Foreign key to Goal (optional)
- `title` & `description`: Info aktivitas
- `startedTime` & `endTime`: Waktu jadwal
- `percentComplete`: Progress percentage
- `emoji`: Visual identifier
- `status`: NONE | IN_PROGRESS | COMPLETED | MISSED | ABANDONED

## 🔌 API Endpoints

### Authentication
- `GET/POST /api/auth/*` - NextAuth handlers

### Goals
- `GET /api/goals/list` - List dengan filter & pagination
- `GET /api/goals/stats` - Statistics
- `GET /api/goals/[id]` - Single goal detail
- `PATCH /api/goals/[id]` - Update goal
- `DELETE /api/goals/[id]` - Delete goal
- `PATCH /api/goals/[id]/settings` - Update settings
- `POST /api/ai/generate-goal` - Create from AI

### Schedules
- `GET /api/schedules` - List schedules
- `PATCH /api/schedules/[id]` - Update schedule
- `GET /api/schedules/[id]/previous` - Previous incomplete
- `GET /api/calendar/schedules` - Calendar view data
- `GET /api/calendar/month` - Month view data

### AI
- `POST /api/ai` - Goal suggestions
- `POST /api/ai/stream` - Streaming goal generation

### Dashboard
- `GET /api/dashboard/combined` - All dashboard data
- `GET /api/dashboard/stats` - Statistics only
- `GET /api/dashboard/today-schedules` - Today's list
- `GET /api/dashboard/header` - Header info

### User & Settings
- `GET /api/user` - User profile
- `PATCH /api/user` - Update profile
- `GET /api/user/availability` - Get preferences
- `POST /api/user/availability` - Update preferences
- `GET /api/user/settings/account-settings` - Account info
- `PATCH /api/user/settings/account-settings` - Update account
- `POST /api/upload/image` - Avatar upload

### Analytics
- `GET /api/analytics?dateRange=30` - Analytics data

## 🚀 Development Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build production
npm run start        # Start production
npm run lint         # Lint code

# Database
npx prisma generate     # Generate client
npx prisma migrate dev  # Run migrations
npx prisma studio       # Database GUI
npx prisma db seed      # Seed data

# Testing
npm test               # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

## 📡 Performance Features

- **API Consolidation**: Combined endpoints reduce requests
- **Debounced Search**: Prevents excessive API calls
- **Loading Skeletons**: Better perceived performance
- **Image Optimization**: Next.js Image component
- **Memoization**: React.memo for expensive computations
- **Stable References**: Prevent unnecessary re-renders

## 🔐 Security

- OAuth-only authentication (no passwords)
- Session validation on all protected routes
- Input validation with Zod schemas
- SQL injection protection via Prisma
- XSS protection (React default)
- CSRF protection via NextAuth
- Environment variables for secrets
- File upload size limits (5MB)

## 🧪 Testing

### Test Suite
- **61+ automated tests**
- Unit tests for core logic
- Integration tests for API
- Custom matchers for Indonesian format
- Mock external dependencies

### Run Tests
```bash
npm test                 # All tests
npm run test:unit        # Unit only
npm run test:integration # Integration only
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## 📝 Notes

- UI menggunakan bahasa Indonesia
- AI responses dalam bahasa Indonesia
- Maximum goal duration: 6 bulan
- Emoji support hingga 20 karakter
- Automatic field truncation dengan "..."
- UTC timezone untuk konsistensi
- Responsive design (mobile-first)

## 🎨 UI/UX Features

- Loading skeletons
- Toast notifications
- Empty states dengan CTA
- Form validation feedback
- Progress indicators
- Status badges
- Responsive design
- Dark mode ready (Tailwind configured)

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License - See `LICENSE` file

## 📞 Support

- Open GitHub issue
- Contact: [your-email@example.com]

---

**KALANA - Scheduler AI** - Mengoptimalkan produktivitas dengan kekuatan AI 🚀