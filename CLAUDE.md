# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database
- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate dev` - Run migrations in development
- `npx prisma db seed` - Seed database with initial data
- `npx prisma studio` - Open Prisma Studio database browser

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript with strict mode
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (beta) with GitHub/Google providers
- **UI**: Tailwind CSS with Radix UI components (shadcn/ui)
- **Styling**: Custom Poppins font, light theme with Sonner toasts
- **AI Integration**: Anthropic Claude API for intelligent goal generation
- **Storage**: Supabase for file uploads and avatars

### Database Schema
Core entities:
- `User` - Authentication and preferences (JSON field)
- `Goal` - User goals with emoji, status (ACTIVE/COMPLETED/ABANDONED)
- `Schedule` - Time-blocked activities linked to goals, with completion tracking
- Standard NextAuth tables (Account, Session, VerificationToken)

### Project Structure
- `/app` - Next.js App Router structure
  - `/(logged-in)/(app-layout)` - Protected routes with sidebar layout
  - `/onboarding` - User onboarding flow
  - `/api` - API routes for data operations
  - `/components` - Page-specific components
  - `/lib` - Core utilities (auth, database, types)
- `/components` - Shared UI components (shadcn/ui)
- `/prisma` - Database schema and seed file

### Authentication Flow
- Users must complete onboarding (preferences setup) after initial auth
- Protected routes redirect to `/onboarding` if preferences not set
- Session includes user ID, redirects to `/dashboard` after login
- App layout checks preferences and redirects appropriately

### Key Patterns
- Server components for data fetching with Prisma
- Form handling with react-hook-form and Zod validation
- Status enums for goals and schedules with badge components
- Sidebar navigation with breadcrumb system
- Emoji picker integration for goals and schedules

### Performance Optimizations
- **API Route Consolidation**: Combined dashboard data into single `/api/dashboard/combined` endpoint
- **Custom Hooks**: `useDashboard`, `useGoals`, `useCalendar` for clean data fetching
- **Stable Calendar Options**: `useStableCalendarOptions` to prevent infinite re-renders
- **Debounced Search**: Utility function in `/app/lib/debounce.ts` to reduce API calls
- **Optimized useEffect Dependencies**: Proper dependency arrays to prevent unnecessary re-renders

### API Routes Structure
- `/api/dashboard/combined` - All dashboard data in one request
- `/api/goals/list` - Paginated goals with filtering
- `/api/goals/stats` - Goal statistics and progress calculation
- `/api/calendar/schedules` - Week/date range schedule data
- `/api/calendar/month` - Month view with daily statistics
- `/api/ai` - AI goal suggestions based on user history
- `/api/ai-chat/generate-goal` - AI-generated goal creation with validation
- `/api/schedules/*` - CRUD operations for schedule management
- `/api/upload/image` - Avatar upload with Supabase storage

### Data Validation
- **Validation utilities** in `/app/lib/validation.ts` for database constraint enforcement
- **Field limits**: Goal title (100), description (500), emoji (20 chars)
- **Schedule limits**: Title (100), description (500), notes (500), emoji (20 chars)
- **Automatic truncation** with "..." for fields exceeding limits
- **Emoji validation** supporting complex emojis like 🚴‍♂️

### Database Schema Updates
- **Emoji fields** increased from 3 to 20 characters to support complex emojis
- **Validation functions** prevent database constraint violations
- **Error handling** with detailed error messages for debugging

### File Upload System
- **Image upload API** at `/api/upload/image` with proper authentication
- **Supabase Storage** integration with service role key to bypass RLS policies
- **File validation** for type (images only) and size (5MB limit)
- **User-specific paths** with format `avatars/{userId}_{timestamp}.{ext}`
- **Progress indicators** and error handling in UI components

## Environment Variables

Required environment variables for local development:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth.js sessions
- `NEXTAUTH_URL` - Application URL (e.g., http://localhost:3000)
- `GITHUB_CLIENT_ID` - GitHub OAuth app client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth app client secret
- `GOOGLE_CLIENT_ID` - Google OAuth app client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth app client secret
- `ANTHROPIC_API_KEY` - Anthropic API key for AI features
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key for storage

## Common Development Patterns

### Testing Changes
Since there are no automated tests, manually verify:
1. Run `npm run lint` to check for code quality issues
2. Run `npm run build` to ensure production build succeeds
3. Test authentication flow (login/logout/onboarding)
4. Verify database migrations with `npx prisma migrate dev`
5. Check responsive design on different screen sizes

### Working with AI Features
- AI endpoints use Anthropic's Claude API with structured prompts
- Responses are validated and parsed as JSON
- Error handling includes fallbacks for API failures
- Goal suggestions are based on user's historical data

### State Management
- No global state management library (Redux/Zustand)
- Server components fetch data directly with Prisma
- Client components use custom hooks with SWR-like patterns
- Form state managed by react-hook-form with Zod schemas