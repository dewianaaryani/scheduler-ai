# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack on http://localhost:3000
- `npm run build` - Build for production (includes Prisma client generation)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Database
- `npx prisma generate` - Generate Prisma client types
- `npx prisma migrate dev` - Run database migrations in development
- `npx prisma migrate deploy` - Deploy migrations to production
- `npx prisma db seed` - Seed database with initial data (uses ts-node)
- `npx prisma studio` - Open Prisma Studio for database management

### Testing & Validation
Since there are no automated tests in the codebase:
1. Run `npm run lint` to check for code quality issues
2. Run `npm run build` to ensure production build succeeds
3. Test authentication flow (login/logout/onboarding)
4. Verify database migrations with `npx prisma migrate dev`

## Architecture

### Tech Stack
- **Framework**: Next.js 15.2.3 with App Router and Turbopack
- **Language**: TypeScript 5.8.3 with strict mode enabled
- **Database**: PostgreSQL with Prisma ORM 6.5.0
- **Authentication**: NextAuth.js v5 beta with GitHub/Google OAuth providers
- **UI Components**: Radix UI primitives via shadcn/ui
- **Styling**: Tailwind CSS v4 with custom Poppins font
- **Form Management**: react-hook-form with Zod validation
- **AI Integration**: Anthropic Claude API for intelligent goal and schedule generation
- **Storage**: Supabase for file uploads and user avatars
- **Notifications**: Sonner for toast notifications
- **Date Handling**: date-fns for date manipulation

### Database Schema
Core entities managed by Prisma:
- `User` - Authentication data with JSON preferences field
- `Goal` - User goals with emoji, status enum (ACTIVE/COMPLETED/ABANDONED), progress tracking
- `Schedule` - Time-blocked activities linked to goals, status enum (NONE/IN_PROGRESS/COMPLETED/MISSED)
- Standard NextAuth tables (Account, Session, VerificationToken)

### Project Structure
- `/app` - Next.js App Router pages and layouts
  - `/(logged-in)/(app-layout)` - Protected routes with sidebar layout (dashboard, goals, calendar, ai, settings)
  - `/(logged-in)/onboarding` - User onboarding flow for preference setup
  - `/api` - API route handlers
    - `/ai` - AI goal suggestions endpoint
    - `/ai-chat` - Claude-powered goal generation and parsing
    - `/auth` - NextAuth authentication handlers
    - `/calendar` - Schedule data for calendar views
    - `/dashboard` - Combined dashboard data endpoint
    - `/goals` - Goal CRUD operations and statistics
    - `/schedules` - Schedule management endpoints
    - `/upload` - Image upload to Supabase storage
  - `/components` - Page-specific React components
  - `/hooks` - Custom React hooks (useDashboard, useGoals, useCalendar, useStableCalendarOptions)
  - `/lib` - Core utilities
    - `auth.ts` - NextAuth configuration and session management
    - `db.ts` - Prisma client singleton
    - `debounce.ts` - Debounce utility for search optimization
    - `emoji-list.ts` - Curated emoji list for pickers
    - `goal-service.ts` - Goal-related business logic
    - `schedule-generator.ts` - AI schedule generation logic
    - `types.ts` - TypeScript type definitions
    - `validation.ts` - Database constraint validation utilities
- `/components` - Shared shadcn/ui components
- `/prisma` - Database schema and seed files

### Authentication & Authorization Flow
1. OAuth login via GitHub/Google providers
2. Session creation with user ID
3. Redirect to `/onboarding` if preferences not set
4. Protected routes check session and preferences
5. Redirect to `/dashboard` after successful onboarding
6. All API routes verify session before processing

### Key Implementation Patterns
- **Server Components**: Default for data fetching with Prisma
- **Client Components**: Used for interactivity (forms, modals, calendars)
- **Form Handling**: react-hook-form with Zod schemas for validation
- **Error Handling**: Try-catch blocks with user-friendly toast notifications
- **Loading States**: Skeleton components and loading indicators
- **Data Fetching**: Custom hooks with SWR-like caching patterns
- **Emoji Support**: Complex emoji handling (up to 20 chars for compound emojis)

### Performance Optimizations
- **API Consolidation**: Single `/api/dashboard/combined` endpoint reduces requests
- **Stable References**: `useStableCalendarOptions` prevents re-render loops
- **Debounced Search**: Reduces API calls during typing
- **Memoization**: React.memo and useMemo for expensive computations
- **Image Optimization**: Next.js Image component with proper sizing

### API Routes & Data Flow
#### Dashboard Data
- `/api/dashboard/combined` - Returns today's schedules, active goals, recent activities

#### Goal Management
- `/api/goals/list` - Paginated goals with status filtering
- `/api/goals/stats` - Goal completion statistics
- `/api/goals/[id]` - Individual goal CRUD operations

#### Schedule Management
- `/api/calendar/schedules` - Week/date range schedule data
- `/api/calendar/month` - Month view with daily statistics
- `/api/schedules/[id]` - Individual schedule operations
- `/api/schedules/[id]/status` - Update schedule completion status

#### AI Features
- `/api/ai` - Generate goal suggestions based on user history
- `/api/ai-chat/generate-goal` - Parse natural language into structured goal with schedules

### Data Validation & Constraints
Field limits enforced by validation utilities:
- **Goal**: title (100), description (500), emoji (20)
- **Schedule**: title (100), description (500), notes (500), emoji (20)
- Automatic truncation with "..." for exceeding limits
- Complex emoji support (e.g., 🚴‍♂️, 👨‍💻)

### File Upload Configuration
- **Endpoint**: `/api/upload/image`
- **Storage**: Supabase with service role key
- **Limits**: 5MB max size, images only
- **Path Format**: `avatars/{userId}_{timestamp}.{ext}`
- **Authentication**: Required for all uploads

## Environment Variables

Required for local development (create `.env.local`):

```env
# Database (Supabase or local PostgreSQL)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." # For Prisma migrations

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

## AI Integration Details

### Goal Generation Flow
1. User inputs natural language goal or selects from suggestions
2. `/api/ai-chat/generate-goal` parses input with Claude
3. Extracts: title, description, start/end dates, emoji
4. Generates daily schedules based on user preferences
5. Returns structured data for database storage

### AI Prompt Structure
- System prompts enforce Indonesian language output
- Structured JSON responses for reliable parsing
- Context includes user preferences and existing schedules
- Automatic conflict detection and resolution

### Schedule Generation Logic
- Respects user's sleep and work hours
- Distributes activities across available days
- Considers schedule type preference (rigid vs flexible)
- Generates realistic time blocks (30min - 2hr typically)
- Avoids scheduling during busy blocks

## Common Development Tasks

### Adding New API Endpoints
1. Create route handler in `/app/api/[endpoint]/route.ts`
2. Verify authentication with `auth()` from `@/app/lib/auth`
3. Use Prisma client from `@/app/lib/db`
4. Return `NextResponse.json()` with appropriate status codes
5. Handle errors with try-catch and return error responses

### Creating New UI Components
1. Check existing components in `/components` for reusable elements
2. Use shadcn/ui components as base when possible
3. Follow existing naming conventions (PascalCase for components)
4. Add proper TypeScript types for props
5. Use Tailwind classes for styling

### Modifying Database Schema
1. Update schema in `/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name descriptive-name`
3. Update validation utilities if field limits change
4. Test affected API endpoints and UI components

### Working with AI Features
- AI responses are in Indonesian per user requirement
- Always validate and sanitize AI-generated content
- Implement fallbacks for API failures
- Monitor token usage to control costs
- Cache suggestions when appropriate

## State Management Approach
- **No global state library** - Keep it simple
- **Server state**: Managed by Next.js and Prisma
- **Client state**: Local component state and custom hooks
- **Form state**: react-hook-form for complex forms
- **UI state**: Radix UI for modals, dropdowns, etc.