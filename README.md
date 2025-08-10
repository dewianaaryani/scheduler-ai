# Scheduler AI

[![Tests](https://img.shields.io/badge/tests-61%20passing-brightgreen)](tests/)
[![Coverage](https://img.shields.io/badge/coverage-mocked-yellow)](tests/)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Sebuah aplikasi web cerdas untuk manajemen waktu dan produktivitas yang menggunakan AI untuk membantu pengguna membuat jadwal yang optimal dan mencapai tujuan mereka.

## 📋 Deskripsi Proyek

Scheduler AI adalah platform manajemen produktivitas yang mengintegrasikan teknologi AI untuk membantu pengguna:
- Membuat dan mengelola tujuan (goals) dengan sistem pelacakan progress
- Generate jadwal harian secara otomatis menggunakan AI
- Memantau produktivitas dengan analytics dan insights
- Mengelola kalender dengan view mingguan dan bulanan
- Tracking kebiasaan dan pencapaian dengan visualisasi data

## 🚀 Teknologi Stack

### Frontend
- **Next.js 15.2.3** - Framework React dengan App Router dan Turbopack
- **TypeScript 5.8.3** - Type-safe development
- **Tailwind CSS v4** - Styling modern dengan custom font Poppins
- **Radix UI** - Komponen UI primitives melalui shadcn/ui
- **React Hook Form + Zod** - Form management dan validasi

### Backend
- **PostgreSQL** - Database utama
- **Prisma ORM 6.5.0** - Database management dan type generation
- **NextAuth.js v5 beta** - Autentikasi dengan GitHub/Google OAuth
- **Anthropic Claude API** - AI integration untuk goal generation

### UI/UX Libraries
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **React Day Picker** - Calendar components
- **Sonner** - Toast notifications
- **date-fns** - Date manipulation utilities

### Storage & Services
- **Supabase** - File upload dan user avatars
- **Axios** - HTTP client untuk API calls

### Testing
- **Jest 29.7** - Testing framework dengan Next.js integration
- **Testing Library** - React component testing utilities
- **61+ Tests** - Comprehensive unit dan integration tests
- **Custom Matchers** - Indonesian language dan CSV validation

## 🏗️ Struktur Database

### Entitas Utama
- **User** - Data pengguna dengan preferences dalam format JSON
- **Goal** - Tujuan pengguna dengan status (ACTIVE/COMPLETED/ABANDONED) dan progress tracking
- **Schedule** - Jadwal aktivitas yang terhubung dengan goals, dengan status (NONE/IN_PROGRESS/COMPLETED/MISSED)
- **Account, Session, VerificationToken** - Standard NextAuth tables

## 📁 Struktur Proyek

```
scheduler-ai/
├── app/                          # Next.js App Router
│   ├── (logged-in)/             # Protected routes
│   │   ├── (app-layout)/        # Layout dengan sidebar
│   │   │   ├── dashboard/       # Halaman utama dashboard
│   │   │   ├── goals/           # Management tujuan
│   │   │   ├── calendar/        # View kalender
│   │   │   ├── ai/             # AI features
│   │   │   ├── analytics/       # Analytics dan insights
│   │   │   └── settings/        # Pengaturan user
│   │   └── on-boarding/         # Flow onboarding
│   ├── api/                     # API Routes
│   │   ├── ai/                  # AI endpoints
│   │   ├── goals/               # Goal CRUD operations
│   │   ├── schedules/           # Schedule management
│   │   ├── calendar/            # Calendar data
│   │   ├── dashboard/           # Dashboard combined data
│   │   └── upload/              # File upload
│   ├── components/              # React components
│   ├── hooks/                   # Custom React hooks
│   └── lib/                     # Utilities dan services
├── components/                   # shadcn/ui components
├── prisma/                      # Database schema
└── public/                      # Static assets
```

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ dan npm/yarn
- PostgreSQL database (local atau cloud)
- Account untuk OAuth providers (GitHub/Google)
- Anthropic API key untuk AI features
- Supabase account untuk file storage

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd scheduler-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
Buat file `.env.local`:
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# AI
ANTHROPIC_API_KEY=""

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
```

4. **Setup database**
```bash
npx prisma migrate dev
npx prisma db seed
```

5. **Start development server**
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

6. **Run tests (optional)**
```bash
npm test          # Run all tests
npm run test:watch  # Run tests in watch mode
```

## 🔧 Available Scripts

### Development
- `npm run dev` - Start development server dengan Turbopack
- `npm run build` - Build production (includes Prisma generate)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

### Database
- `npx prisma generate` - Generate Prisma client types
- `npx prisma migrate dev` - Run database migrations
- `npx prisma db seed` - Seed database dengan data awal
- `npx prisma studio` - Open database browser

## 🤖 Fitur AI Integration

### Goal Generation
- Input natural language untuk membuat tujuan
- AI parsing menggunakan Claude API
- Auto-generate jadwal harian berdasarkan user preferences
- Conflict detection dan resolution
- Output dalam Bahasa Indonesia

### Schedule Generation
- Respects user sleep dan work hours
- Distribusi aktivitas across available days
- Flexible vs rigid scheduling options
- Realistic time blocks (30min - 2hr)
- Hindari bentrok dengan existing schedules

## 🔐 Authentication Flow

1. OAuth login via GitHub/Google
2. Session creation dengan user ID
3. Redirect ke `/on-boarding` jika preferences belum di-set
4. Protected routes check session dan preferences
5. Redirect ke `/dashboard` setelah onboarding selesai

## 📊 Key Features

### Dashboard
- Today's schedule dengan real-time updates
- Goal progress tracking
- Quick stats dan metrics overview
- Recent activities summary

### Goal Management
- CRUD operations untuk goals
- Status tracking (Active/Completed/Abandoned)
- Progress visualization dengan charts
- Emoji support untuk personalisasi

### Calendar System
- Weekly dan monthly views
- Drag & drop schedule editing
- Time block management
- Schedule status updates (In Progress/Completed/Missed)

### Analytics
- Productivity trends analysis
- Goal completion statistics
- Time insight dan usage patterns
- Performance metrics

## 🎨 Design System

- **Color Scheme**: Modern dark/light theme support
- **Typography**: Poppins font untuk readability
- **Components**: Consistent Radix UI components
- **Icons**: Lucide React icon library
- **Responsive**: Mobile-first responsive design

## 🔄 Data Flow

### API Architecture
- RESTful API design dengan Next.js route handlers
- Consolidated endpoints untuk performance (`/api/dashboard/combined`)
- Authentication middleware pada semua protected routes
- Error handling dengan user-friendly messages

### State Management
- Server state via Next.js dan Prisma
- Client state dengan React hooks
- Form state via react-hook-form
- UI state via Radix UI components

## 📈 Performance Optimizations

- API request consolidation
- Stable references untuk prevent re-renders
- Debounced search untuk reduce API calls
- Image optimization dengan Next.js Image
- Memoization untuk expensive computations

## 🛡️ Security

- NextAuth.js untuk secure authentication
- CSRF protection
- Input validation dengan Zod schemas
- SQL injection prevention via Prisma
- Environment variable security
- File upload restrictions

## 🧪 Testing & Validation

### Automated Testing
Proyek ini memiliki comprehensive test suite dengan 61+ automated tests:

```bash
# Run all tests
npm test                    # Semua tests (61 tests, ~0.6s)

# Run specific test categories  
npm run test:unit          # Unit tests (47 tests)
npm run test:integration   # Integration tests (14 tests)

# Advanced testing
npm run test:coverage      # Tests dengan coverage report
npm run test:watch         # Watch mode untuk development
npm run test:all          # Sequential run semua kategori
```

### Test Coverage
- **Unit Tests**: CSV parser, streaming service, goal form logic
- **Integration Tests**: API streaming, error handling, data validation
- **Custom Matchers**: Indonesian date format, CSV validation, date ranges
- **Mock Strategy**: Complete mocking untuk external dependencies

### Manual Testing
1. `npm run lint` - Code quality checks
2. `npm run build` - Production build verification  
3. Test authentication flow (login/logout/onboarding)
4. Verify database migrations dengan `npx prisma migrate dev`

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

## 📞 Support

Untuk pertanyaan atau bantuan:
- Open GitHub issue
- Contact: [your-email@example.com]

---

**Scheduler AI** - Mengoptimalkan produktivitas dengan kekuatan AI 🚀