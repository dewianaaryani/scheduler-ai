# BAB 3: METODE PENELITIAN

## 3.1 Jenis Penelitian

Penelitian ini merupakan penelitian terapan (applied research) dengan pendekatan pengembangan sistem (system development) yang menggunakan metodologi **Software Development Life Cycle (SDLC)** dengan pendekatan **Agile Development**. Jenis penelitian ini dipilih karena fokus pada pengembangan solusi praktis untuk mengatasi permasalahan manajemen waktu melalui implementasi teknologi AI.

## 3.2 Metodologi Pengembangan

### 3.2.1 Agile Development Methodology

Penelitian ini mengadopsi metodologi Agile dengan alasan:
- **Iterative development** untuk perbaikan berkelanjutan
- **User feedback integration** sepanjang development cycle
- **Flexible requirements** yang dapat disesuaikan
- **Rapid prototyping** untuk validasi konsep

### 3.2.2 Sprint Planning

Development dibagi menjadi 6 sprint dengan durasi 2 minggu per sprint:

| Sprint | Fokus Pengembangan | Deliverables |
|--------|-------------------|--------------|
| 1 | Project Setup & Authentication | Auth system, database schema |
| 2 | Core Features | User management, goals CRUD |
| 3 | Scheduling System | Calendar integration, scheduling logic |
| 4 | AI Integration | Claude AI integration, recommendations |
| 5 | UI/UX Enhancement | Responsive design, user experience |
| 6 | Testing & Deployment | Quality assurance, production deployment |

## 3.3 Arsitektur Sistem

### 3.3.1 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  Next.js 15 + React + TypeScript + Tailwind CSS        │
└─────────────────────────────────────────────────────────┘
                           ║
┌─────────────────────────────────────────────────────────┐
│                  Application Layer                       │
│     API Routes + Server Actions + Middleware            │
└─────────────────────────────────────────────────────────┘
                           ║
┌─────────────────────────────────────────────────────────┐
│                   Business Logic                        │
│        Services + Hooks + Utilities + Validation       │
└─────────────────────────────────────────────────────────┘
                           ║
┌─────────────────────────────────────────────────────────┐
│                   Data Access Layer                     │
│               Prisma ORM + Database Client              │
└─────────────────────────────────────────────────────────┘
                           ║
┌─────────────────────────────────────────────────────────┐
│                    Database Layer                       │
│                    PostgreSQL                           │
└─────────────────────────────────────────────────────────┘
```

### 3.3.2 Technology Stack

**Frontend Technologies:**
- **Next.js 15**: React framework dengan App Router untuk SSR/SSG
- **TypeScript**: Static typing untuk code safety
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components
- **React Hook Form**: Form management dengan validation

**Backend Technologies:**
- **Next.js API Routes**: RESTful API endpoints
- **NextAuth.js v5**: Authentication dan session management
- **Prisma ORM**: Type-safe database access
- **PostgreSQL**: Relational database

**External Services:**
- **Claude AI API**: Natural language processing dan recommendations
- **Supabase Storage**: File upload dan storage

## 3.4 Database Design

### 3.4.1 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │    Goal     │       │  Schedule   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │──────<│ userId (FK) │       │ id (PK)     │
│ name        │       │ title       │       │ goalId (FK) │──┐
│ email       │       │ description │       │ title       │  │
│ image       │       │ emoji       │       │ description │  │
│ preferences │       │ status      │       │ startDate   │  │
│ createdAt   │       │ createdAt   │       │ endDate     │  │
│ updatedAt   │       │ updatedAt   │       │ status      │  │
└─────────────┘       └─────────────┘       │ notes       │  │
                             ┌──────────────│ emoji       │  │
                             │              │ createdAt   │  │
                             │              │ updatedAt   │  │
                             │              └─────────────┘  │
                             └─────────────────────────────────┘
```

### 3.4.2 Database Schema

**User Table:**
```sql
CREATE TABLE User (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  emailVerified DATETIME,
  image TEXT,
  preferences TEXT, -- JSON field
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME
);
```

**Goal Table:**
```sql
CREATE TABLE Goal (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  emoji TEXT,
  status TEXT DEFAULT 'ACTIVE',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME,
  FOREIGN KEY (userId) REFERENCES User(id)
);
```

**Schedule Table:**
```sql
CREATE TABLE Schedule (
  id TEXT PRIMARY KEY,
  goalId TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  startDate DATETIME NOT NULL,
  endDate DATETIME NOT NULL,
  status TEXT DEFAULT 'PENDING',
  notes TEXT,
  emoji TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME,
  FOREIGN KEY (goalId) REFERENCES Goal(id)
);
```

## 3.5 Implementasi Fitur

### 3.5.1 Authentication System

**Implementation Steps:**
1. **NextAuth.js Configuration**
   ```typescript
   // app/lib/auth.ts
   export const authConfig = {
     providers: [
       GitHub({ clientId, clientSecret }),
       Google({ clientId, clientSecret })
     ],
     callbacks: {
       session: ({ session, token }) => ({
         ...session,
         user: { ...session.user, id: token.sub }
       })
     }
   }
   ```

2. **Protected Routes Middleware**
   ```typescript
   // middleware.ts
   export function middleware(request: NextRequest) {
     return auth(request)
   }
   ```

### 3.5.2 Goal Management System

**CRUD Operations:**
```typescript
// app/lib/goal-service.ts
export class GoalService {
  static async createGoal(data: CreateGoalData) {
    return await prisma.goal.create({ data })
  }
  
  static async getUserGoals(userId: string) {
    return await prisma.goal.findMany({
      where: { userId },
      include: { schedules: true }
    })
  }
}
```

### 3.5.3 AI Integration

**Claude API Integration:**
```typescript
// app/api/ai-chat/route.ts
export async function POST(request: Request) {
  const { message } = await request.json()
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CLAUDE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      messages: [{ role: 'user', content: message }]
    })
  })
  
  return Response.json(await response.json())
}
```

## 3.6 Pengujian Sistem

### 3.6.1 Unit Testing

**Testing Framework:**
- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing
- **Prisma Testing**: Database testing dengan test database

**Test Coverage Areas:**
- API endpoints functionality
- React component rendering
- Database operations
- Authentication flows

### 3.6.2 Integration Testing

**End-to-End Testing:**
- User registration dan login flow
- Goal creation dan management
- Schedule creation dan updates
- AI recommendation functionality

### 3.6.3 Performance Testing

**Metrics yang Diukur:**
- Page load time (target: < 2 detik)
- API response time (target: < 500ms)
- Database query performance
- Mobile responsiveness

## 3.7 Development Tools dan Environment

### 3.7.1 Development Environment

**Local Development:**
```bash
# Development server
npm run dev

# Database operations
npx prisma migrate dev
npx prisma generate
npx prisma studio

# Code quality
npm run lint
npm run type-check
```

**Environment Variables:**
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# AI Service
CLAUDE_API_KEY=""
```

### 3.7.2 Version Control dan Collaboration

**Git Workflow:**
- **Main branch**: Production-ready code
- **Feature branches**: Individual feature development
- **Pull requests**: Code review process
- **Semantic commits**: Conventional commit messages

## 3.8 Deployment Strategy

### 3.8.1 Production Deployment

**Platform:** Vercel (recommended untuk Next.js)
**Database:** Supabase PostgreSQL
**Storage:** Supabase Storage untuk file uploads

**Deployment Pipeline:**
1. Code push ke GitHub repository
2. Automatic build trigger di Vercel
3. Environment variables configuration
4. Database migration execution
5. Production deployment

### 3.8.2 Monitoring dan Analytics

**Performance Monitoring:**
- Vercel Analytics untuk web vitals
- Database query monitoring
- Error tracking dengan Sentry
- User analytics dengan Google Analytics

## 3.9 Quality Assurance

### 3.9.1 Code Quality Standards

**ESLint Configuration:**
```javascript
// eslint.config.mjs
export default [
  {
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      'prefer-const': 'error'
    }
  }
]
```

**TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

### 3.9.2 Security Measures

**Security Implementation:**

#### A. Authentication dan Authorization
```typescript
// app/lib/auth.ts - NextAuth.js Configuration
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub, Google],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id; // Add user ID to session
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`;
    },
  },
});

// app/lib/hooks.ts - User Authentication Guard
import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function requireUser() {
  const session = await auth();
  
  if (!session?.user) {
    return redirect("/");
  }
  
  return session.user;
}
```

#### B. Input Validation dan Sanitization
```typescript
// app/lib/validation.ts - Data Validation Functions
export function truncateString(str: string, maxLength: number): string {
  if (!str) return '';
  return str.length > maxLength ? str.substring(0, maxLength - 3) + '...' : str;
}

export function validateEmoji(emoji: string): string {
  if (!emoji) return '📅';
  const cleanEmoji = emoji.trim();
  return cleanEmoji.length <= 20 ? cleanEmoji : '📅';
}

export const VALIDATION_LIMITS = {
  GOAL_TITLE: 100,
  GOAL_DESCRIPTION: 500,
  SCHEDULE_TITLE: 100,
  SCHEDULE_DESCRIPTION: 500,
  SCHEDULE_NOTES: 500,
  EMOJI: 20,
} as const;

export function validateGoalData(goalData: {
  title: string;
  description: string;
  emoji: string;
  startDate: string | Date;
  endDate: string | Date;
}) {
  return {
    title: truncateString(goalData.title, VALIDATION_LIMITS.GOAL_TITLE),
    description: truncateString(goalData.description, VALIDATION_LIMITS.GOAL_DESCRIPTION),
    emoji: validateEmoji(goalData.emoji),
    startDate: new Date(goalData.startDate),
    endDate: new Date(goalData.endDate),
  };
}
```

#### C. API Route Security
```typescript
// app/api/goals/route.ts - Secure API Implementation
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await requireUser();
    if (!session || !session.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    const userId = session.id;

    // Input validation
    const planData: GoalPlanData = await request.json();
    if (!planData?.dataGoals) {
      return NextResponse.json({ error: "Invalid goal data" }, { status: 400 });
    }

    const { title, description, startDate, endDate, emoji, steps } = planData.dataGoals;
    if (!title || !description || !startDate || !endDate || !emoji || !steps) {
      return NextResponse.json(
        { error: "Missing required goal fields" },
        { status: 400 }
      );
    }

    // Database transaction for consistency
    const result = await prisma.$transaction(async (tx) => {
      const goal = await tx.goal.create({
        data: {
          userId, // User isolation
          title: truncateString(title, VALIDATION_LIMITS.GOAL_TITLE),
          description: truncateString(description, VALIDATION_LIMITS.GOAL_DESCRIPTION),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          emoji: validateEmoji(emoji),
          status: "ACTIVE",
        },
      });
      return goal;
    });

    return NextResponse.json({ message: "Success", data: result });
  } catch (error) {
    console.error("Error saving goal:", error);
    return NextResponse.json(
      { error: "Failed to save goal" },
      { status: 500 }
    );
  }
}
```

#### D. File Upload Security
```typescript
// app/api/upload/image/route.ts - Secure File Upload
export async function POST(request: NextRequest) {
  try {
    // Authentication verification
    const session = await requireUser();
    if (!session?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // File type validation
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // File size validation (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Secure filename generation
    const fileExtension = file.name.split(".").pop();
    const timestamp = Date.now();
    const fileName = `${session.id}_${timestamp}.${fileExtension}`;
    const filePath = `avatars/${fileName}`;

    // Upload with user-specific path
    const { data, error } = await supabaseAdmin.storage
      .from("avatars")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: true,
        metadata: {
          userId: session.id,
          originalName: file.name,
        },
      });

    if (error) {
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, url: data.publicUrl });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

#### E. Environment Variable Protection
```typescript
// Security untuk environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'CLAUDE_API_KEY'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

**Security Features Implemented:**
- **SQL Injection Prevention**: Prisma ORM dengan parameterized queries
- **XSS Protection**: Input sanitization dan validation
- **CSRF Protection**: NextAuth.js built-in protection
- **File Upload Security**: Type validation, size limits, secure paths
- **User Data Isolation**: User ID verification pada setiap request
- **Environment Protection**: Secure environment variable handling

## 3.10 Documentation Strategy

**Technical Documentation:**
- API documentation dengan OpenAPI/Swagger
- Component documentation dengan Storybook
- Database schema documentation
- Deployment guide dan troubleshooting

**User Documentation:**
- User manual dalam bahasa Indonesia
- Video tutorials untuk fitur utama
- FAQ dan troubleshooting guide
- Onboarding guide untuk new users