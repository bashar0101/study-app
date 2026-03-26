# CLAUDE.md — StudyAI Platform

## Project Overview

**StudyAI** is a full-stack AI-powered learning platform where students register, choose study modes (free study, quiz, exam), receive AI-generated questions, get instant answer evaluation, and track their performance through analytics dashboards.

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | Next.js 14+ (App Router, JavaScript) |
| Backend API  | Node.js + Express.js (JavaScript)   |
| Database     | MySQL (primary) + Redis (cache/sessions) |
| ORM          | Prisma                              |
| AI Provider  | Anthropic Claude API (claude-sonnet-4-20250514) |
| Auth         | JWT (access + refresh tokens) + email verification |
| Email        | Nodemailer (SMTP) or Resend         |
| Validation   | Zod (shared schemas frontend + backend) |
| Styling      | Tailwind CSS                        |
| State Mgmt   | Zustand (frontend)                  |
| Charts       | Recharts                            |
| Testing      | Jest + React Testing Library        |
| Deployment   | Docker + docker-compose             |

---

## Why MySql (Not NoSQL)

MySql is the correct choice for this project because:

1. **Relational data dominates**: Users → Subjects → Sessions → Questions → Answers form strict relational chains. A student's exam session references both the user and the subject, each answer references a question and a session. These are classic foreign-key relationships.
2. **Analytics queries**: Tracking performance over time, calculating averages, filtering by subject/date range, and aggregating scores are SQL's strength. Queries like "average score per subject in the last 30 days" are trivial in SQL but painful in NoSQL.
3. **JSON for flexibility**: Question content, AI prompts, and evaluation rubrics can vary in structure. MySql's `json` column type gives NoSQL-like flexibility for these fields while keeping everything else relational.
4. **ACID transactions**: When submitting an exam, we must atomically save all answers, update the session score, and record analytics. MySql guarantees this; most NoSQL databases do not.
5. **Prisma ORM**: Prisma has first-class MySql support with migrations, type-safe queries, and excellent DX.

Redis is used alongside MySql for:
- Caching AI-generated questions to avoid redundant API calls
- Storing email verification tokens (auto-expire with TTL)
- Rate limiting API endpoints
- Session blacklisting for JWT revocation

---

## Project Structure

```
EduApp/
├── CLAUDE.md
├── docker-compose.yml
├── .env.example
├── .gitignore
│
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── index.js                  # Express app entry point
│   │   ├── config/
│   │   │   ├── env.js                # Environment variable validation (Zod)
│   │   │   ├── database.js           # Prisma client singleton
│   │   │   └── redis.js              # Redis client setup
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT verification middleware
│   │   │   ├── rateLimiter.js        # Rate limiting with Redis
│   │   │   ├── validate.js           # Zod request validation middleware
│   │   │   └── errorHandler.js       # Global error handling
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.routes.js
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── auth.service.js
│   │   │   │   └── auth.validation.js
│   │   │   │
│   │   │   ├── user/
│   │   │   │   ├── user.routes.js
│   │   │   │   ├── user.controller.js
│   │   │   │   ├── user.service.js
│   │   │   │   └── user.validation.js
│   │   │   │
│   │   │   ├── study/
│   │   │   │   ├── study.routes.js
│   │   │   │   ├── study.controller.js
│   │   │   │   ├── study.service.js
│   │   │   │   └── study.validation.js
│   │   │   │
│   │   │   ├── quiz/
│   │   │   │   ├── quiz.routes.js
│   │   │   │   ├── quiz.controller.js
│   │   │   │   ├── quiz.service.js
│   │   │   │   └── quiz.validation.js
│   │   │   │
│   │   │   ├── exam/
│   │   │   │   ├── exam.routes.js
│   │   │   │   ├── exam.controller.js
│   │   │   │   ├── exam.service.js
│   │   │   │   └── exam.validation.js
│   │   │   │
│   │   │   └── analytics/
│   │   │       ├── analytics.routes.js
│   │   │       ├── analytics.controller.js
│   │   │       ├── analytics.service.js
│   │   │       └── analytics.validation.js
│   │   │
│   │   ├── services/
│   │   │   ├── ai.service.js          # Claude API integration
│   │   │   ├── email.service.js       # Email sending service
│   │   │   └── token.service.js       # JWT + refresh token logic
│   │   │
│   │   └── utils/
│   │       ├── apiError.js            # Custom error class
│   │       ├── asyncHandler.js        # Async route wrapper
│   │       └── constants.js           # App-wide constants
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js                    # Seed subjects and sample data
│   │   └── migrations/
│   │
│   └── tests/
│       ├── auth.test.js
│       ├── quiz.test.js
│       └── exam.test.js
│
├── frontend/
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── jsconfig.json
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js
│   │   │   ├── page.js                # Landing page
│   │   │   ├── globals.css
│   │   │   │
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.js
│   │   │   │   ├── register/page.js
│   │   │   │   ├── verify-email/page.js
│   │   │   │   └── forgot-password/page.js
│   │   │   │
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.js          # Sidebar + topbar layout
│   │   │   │   ├── dashboard/page.js  # Home dashboard
│   │   │   │   ├── study/page.js      # Free study mode
│   │   │   │   ├── quiz/page.js       # Quiz selection
│   │   │   │   ├── quiz/[id]/page.js  # Active quiz session
│   │   │   │   ├── exam/page.js       # Exam selection
│   │   │   │   ├── exam/[id]/page.js  # Active exam session
│   │   │   │   ├── results/[id]/page.js # Session results
│   │   │   │   ├── analytics/page.js  # Analytics dashboard
│   │   │   │   ├── history/page.js    # Session history
│   │   │   │   └── profile/page.js    # Profile settings
│   │   │   │
│   │   │   └── api/                   # Next.js API routes (BFF proxy if needed)
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                    # Reusable base components
│   │   │   │   ├── Button.js
│   │   │   │   ├── Input.js
│   │   │   │   ├── Card.js
│   │   │   │   ├── Modal.js
│   │   │   │   ├── Spinner.js
│   │   │   │   ├── Badge.js
│   │   │   │   ├── ProgressBar.js
│   │   │   │   └── Toast.js
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.js
│   │   │   │   ├── RegisterForm.js
│   │   │   │   └── ProtectedRoute.js
│   │   │   │
│   │   │   ├── study/
│   │   │   │   ├── SubjectSelector.js
│   │   │   │   ├── DifficultySelector.js
│   │   │   │   ├── QuestionCard.js
│   │   │   │   ├── AnswerInput.js
│   │   │   │   ├── AIFeedback.js
│   │   │   │   └── StudyTimer.js
│   │   │   │
│   │   │   ├── quiz/
│   │   │   │   ├── QuizConfig.js
│   │   │   │   ├── QuizQuestion.js
│   │   │   │   ├── QuizProgress.js
│   │   │   │   └── QuizResults.js
│   │   │   │
│   │   │   ├── exam/
│   │   │   │   ├── ExamConfig.js
│   │   │   │   ├── ExamQuestion.js
│   │   │   │   ├── ExamTimer.js
│   │   │   │   ├── ExamNavigation.js
│   │   │   │   └── ExamResults.js
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   ├── ScoreChart.js
│   │   │   │   ├── SubjectBreakdown.js
│   │   │   │   ├── StreakTracker.js
│   │   │   │   ├── WeakAreasCard.js
│   │   │   │   └── ProgressTimeline.js
│   │   │   │
│   │   │   └── layout/
│   │   │       ├── Sidebar.js
│   │   │       ├── Topbar.js
│   │   │       └── MobileNav.js
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useStudySession.js
│   │   │   ├── useQuiz.js
│   │   │   ├── useExam.js
│   │   │   ├── useAnalytics.js
│   │   │   └── useTimer.js
│   │   │
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── studyStore.js
│   │   │   └── uiStore.js
│   │   │
│   │   ├── lib/
│   │   │   ├── api.js                 # Axios instance with interceptors
│   │   │   ├── validators.js          # Shared Zod schemas
│   │   │   └── utils.js               # Helper functions
│   │   │
│   │   └── constants/
│   │       ├── subjects.js
│   │       └── routes.js
│   │
│   └── public/
│       └── assets/
│
└── shared/
    └── schemas/                       # Shared Zod validation schemas
        ├── auth.schema.js
        ├── study.schema.js
        ├── quiz.schema.js
        └── exam.schema.js
```

---

## Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id                String    @id @default(cuid())
  email             String    @unique
  passwordHash      String
  name              String
  avatarUrl         String?
  isEmailVerified   Boolean   @default(false)
  verificationToken String?
  resetToken        String?
  resetTokenExpiry  DateTime?
  refreshToken      String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  sessions          StudySession[]
  analytics         UserAnalytics[]

  @@map("users")
}

model Subject {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  icon        String?  // emoji or icon name
  parentId    String?
  parent      Subject? @relation("SubjectTree", fields: [parentId], references: [id])
  children    Subject[] @relation("SubjectTree")
  topics      Topic[]
  createdAt   DateTime @default(now())

  @@map("subjects")
}

model Topic {
  id          String   @id @default(cuid())
  name        String
  slug        String
  subjectId   String
  subject     Subject  @relation(fields: [subjectId], references: [id])
  createdAt   DateTime @default(now())

  questions   Question[]

  @@unique([subjectId, slug])
  @@map("topics")
}

model StudySession {
  id           String        @id @default(cuid())
  userId       String
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  mode         SessionMode   // STUDY, QUIZ, EXAM
  status       SessionStatus @default(IN_PROGRESS)
  subjectId    String?
  subjectName  String        // denormalized for quick reads
  topicName    String?
  difficulty   Difficulty    @default(MEDIUM)
  totalQuestions Int         @default(0)
  correctAnswers Int         @default(0)
  score        Float?        // percentage score (0-100)
  timeLimitMin Int?          // exam time limit in minutes
  startedAt    DateTime      @default(now())
  completedAt  DateTime?
  createdAt    DateTime      @default(now())

  questions    Question[]

  @@index([userId, mode])
  @@index([userId, createdAt])
  @@map("study_sessions")
}

model Question {
  id              String      @id @default(cuid())
  sessionId       String
  session         StudySession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  topicId         String?
  topic           Topic?      @relation(fields: [topicId], references: [id])
  questionNumber  Int
  type            QuestionType // MCQ, TRUE_FALSE, SHORT_ANSWER, ESSAY
  difficulty      Difficulty
  questionText    String
  options         Json?       // for MCQ: ["option1", "option2", "option3", "option4"]
  correctAnswer   String      // the correct answer text
  explanation     String?     // AI-generated explanation
  userAnswer      String?
  isCorrect       Boolean?
  aiEvaluation    Json?       // { score: 0-100, feedback: "...", strengths: [], improvements: [] }
  answeredAt      DateTime?
  timeSpentSec    Int?        // seconds spent on this question
  createdAt       DateTime    @default(now())

  @@index([sessionId, questionNumber])
  @@map("questions")
}

model UserAnalytics {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  date            DateTime @db.Date
  subjectName     String
  mode            SessionMode
  sessionsCount   Int      @default(0)
  questionsCount  Int      @default(0)
  correctCount    Int      @default(0)
  avgScore        Float    @default(0)
  avgTimePerQ     Float?   // average seconds per question
  streak          Int      @default(0) // consecutive days studied
  createdAt       DateTime @default(now())

  @@unique([userId, date, subjectName, mode])
  @@index([userId, date])
  @@map("user_analytics")
}

enum SessionMode {
  STUDY
  QUIZ
  EXAM
}

enum SessionStatus {
  IN_PROGRESS
  COMPLETED
  ABANDONED
}

enum QuestionType {
  MCQ
  TRUE_FALSE
  SHORT_ANSWER
  ESSAY
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}
```

---

## API Endpoints

### Auth (`/api/auth`)
```
POST   /api/auth/register          - Create account (sends verification email)
POST   /api/auth/verify-email      - Verify email with token
POST   /api/auth/login             - Login (returns access + refresh tokens)
POST   /api/auth/refresh           - Refresh access token
POST   /api/auth/logout            - Logout (blacklist refresh token)
POST   /api/auth/forgot-password   - Send password reset email
POST   /api/auth/reset-password    - Reset password with token
```

### User (`/api/users`)
```
GET    /api/users/me               - Get current user profile
PATCH  /api/users/me               - Update profile
PATCH  /api/users/me/password      - Change password
DELETE /api/users/me               - Delete account (soft delete)
```

### Subjects (`/api/subjects`)
```
GET    /api/subjects               - List all subjects with topics
GET    /api/subjects/:slug         - Get subject with topics
```

### Study (`/api/study`)
```
POST   /api/study/start            - Start study session (AI generates first question)
POST   /api/study/:sessionId/next  - Get next question from AI
POST   /api/study/:sessionId/answer - Submit answer (AI evaluates)
POST   /api/study/:sessionId/end   - End study session
```

### Quiz (`/api/quiz`)
```
POST   /api/quiz/start             - Start quiz (AI generates all questions at once)
POST   /api/quiz/:sessionId/answer - Submit single answer
POST   /api/quiz/:sessionId/submit - Submit entire quiz for scoring
GET    /api/quiz/:sessionId/results - Get quiz results with explanations
```

### Exam (`/api/exam`)
```
POST   /api/exam/start             - Start timed exam (AI generates questions)
GET    /api/exam/:sessionId        - Get exam state (questions, time remaining)
POST   /api/exam/:sessionId/answer - Submit single answer
POST   /api/exam/:sessionId/submit - Submit exam (auto-submit on time expiry)
GET    /api/exam/:sessionId/results - Get detailed exam results
```

### Analytics (`/api/analytics`)
```
GET    /api/analytics/overview     - Overall stats (total sessions, avg score, streak)
GET    /api/analytics/subjects     - Per-subject breakdown
GET    /api/analytics/progress     - Score progression over time
GET    /api/analytics/weak-areas   - Topics with lowest scores
GET    /api/analytics/history      - Paginated session history
GET    /api/analytics/daily        - Daily activity heatmap data
```

---

## AI Integration (Claude API)

### Service: `ai.service.js`

The AI service is the core engine. It handles three operations:

#### 1. Generate Questions
```
Input:  subject, topic, difficulty, questionType, count, previousQuestions (to avoid repeats)
Output: Array of { questionText, options (if MCQ), correctAnswer, explanation }
```

System prompt pattern:
```
You are an expert academic question generator. Generate {count} {difficulty} {questionType}
questions about {topic} in {subject}.

Rules:
- Questions must be clear, unambiguous, and educationally valuable
- For MCQ: exactly 4 options, one correct, three plausible distractors
- Include a brief explanation for the correct answer
- Do NOT repeat these previous questions: {previousQuestions}
- Respond ONLY in valid JSON format

Output format:
[{
  "questionText": "...",
  "options": ["A", "B", "C", "D"],    // MCQ only
  "correctAnswer": "...",
  "explanation": "..."
}]
```

#### 2. Evaluate Answers (Short Answer / Essay)
```
Input:  questionText, correctAnswer, userAnswer, questionType
Output: { score: 0-100, feedback, strengths: [], improvements: [] }
```

System prompt pattern:
```
You are a fair and constructive academic evaluator.

Question: {questionText}
Reference answer: {correctAnswer}
Student's answer: {userAnswer}

Evaluate the student's answer. Be encouraging but honest.
For short answers: check factual correctness and completeness.
For essays: evaluate thesis clarity, argument strength, evidence use, and coherence.

Respond ONLY in valid JSON:
{
  "score": 0-100,
  "isCorrect": true/false,
  "feedback": "...",
  "strengths": ["...", "..."],
  "improvements": ["...", "..."]
}
```

#### 3. Generate Study Hints
```
Input:  questionText, subject, topic
Output: progressive hints (hint 1 = vague, hint 2 = medium, hint 3 = almost the answer)
```

### AI Service Architecture Rules
- Always set `max_tokens` appropriately (1024 for questions, 512 for evaluation)
- Always parse JSON responses with try/catch and fallback
- Cache generated questions in Redis for 1 hour (key: `questions:{subject}:{topic}:{difficulty}:{hash}`)
- Implement retry logic with exponential backoff (3 attempts max)
- Log all AI requests with latency for monitoring
- Use streaming for study mode (better UX for real-time feedback)
- Never expose raw AI errors to the client — map to user-friendly messages

---

## Authentication Flow

### Registration
1. User submits email + password + name
2. Backend validates input (Zod), checks email uniqueness
3. Hash password with bcrypt (12 rounds)
4. Create user with `isEmailVerified: false`
5. Generate a random verification token, store in Redis with 24h TTL
6. Send verification email with link: `{FRONTEND_URL}/verify-email?token={token}`
7. Return `201` with message "Check your email"

### Email Verification
1. User clicks link, frontend calls `POST /api/auth/verify-email` with token
2. Backend looks up token in Redis
3. If valid: set `isEmailVerified: true`, delete token from Redis
4. If invalid/expired: return `400`

### Login
1. User submits email + password
2. Validate credentials, check `isEmailVerified === true`
3. Generate access token (JWT, 15 minutes expiry, contains `userId` and `email`)
4. Generate refresh token (JWT, 7 days expiry, stored in DB + httpOnly cookie)
5. Return both tokens

### Token Refresh
1. Client sends refresh token (from httpOnly cookie)
2. Backend verifies JWT signature, checks token exists in DB
3. Generate new access token + new refresh token (rotate)
4. Invalidate old refresh token in DB

### JWT Structure
```javascript
// Access Token payload
{
  userId: "cuid...",
  email: "student@example.com",
  type: "access",
  iat: 1234567890,
  exp: 1234568790  // 15 min
}

// Refresh Token payload
{
  userId: "cuid...",
  type: "refresh",
  iat: 1234567890,
  exp: 1235172690  // 7 days
}
```

### Security Requirements
- Access token: 15-minute expiry, sent in `Authorization: Bearer` header
- Refresh token: 7-day expiry, stored in httpOnly secure cookie + DB
- Refresh token rotation: issue new refresh token on every refresh
- Password hashing: bcrypt with 12 salt rounds
- Rate limiting: 5 login attempts per 15 minutes per IP
- CORS: whitelist only the frontend origin

---

## Mode Specifications

### Study Mode (Free Study)
- **Goal**: Open-ended learning, no score pressure
- **Flow**: User picks subject → topic → difficulty → starts studying
- **Questions**: Generated one at a time by AI
- **Feedback**: Instant AI evaluation after each answer
- **Hints**: User can request up to 3 progressive hints per question
- **Navigation**: Next question / skip / end session
- **No timer**: User goes at their own pace
- **Partial analytics**: Track questions attempted and accuracy, but no formal score

### Quiz Mode
- **Goal**: Quick knowledge check, moderate pressure
- **Flow**: User picks subject → topic → difficulty → number of questions (5/10/15/20)
- **Questions**: All generated at once, mix of MCQ + True/False + Short Answer
- **Feedback**: Shown after quiz completion (not during)
- **Timer**: Optional soft timer (shows elapsed time, no auto-submit)
- **Scoring**: Percentage score calculated at end
- **Review**: After submission, user can review each question with correct answer + explanation

### Exam Mode
- **Goal**: Simulated exam conditions, high pressure
- **Flow**: User picks subject → multiple topics → difficulty → question count → time limit
- **Questions**: All generated at once, can include all question types including essay
- **Feedback**: Only shown after submission
- **Timer**: Hard timer — auto-submits when time expires
- **Navigation**: Question navigator sidebar (answered/unanswered/flagged)
- **Flagging**: User can flag questions for review
- **No going back**: Once answered, cannot change (configurable)
- **Scoring**: Detailed breakdown per question with AI evaluation for essays

---

## Analytics Dashboard Specifications

The analytics page should display:

1. **Overview Cards**: Total sessions, total questions answered, overall average score, current streak (consecutive days)
2. **Score Progression Chart**: Line chart showing average score over time (last 30 days), grouped by mode
3. **Subject Breakdown**: Bar chart or radar chart showing performance per subject
4. **Weak Areas**: List of topics where score < 60%, sorted by weakness
5. **Activity Heatmap**: GitHub-style contribution heatmap showing study activity per day
6. **Recent Sessions Table**: Last 10 sessions with mode, subject, score, date, link to results
7. **Time Analytics**: Average time per question by subject and difficulty
8. **Improvement Suggestions**: AI-generated tips based on weak areas (generated on-demand, cached)

---

## Environment Variables

```env
# Backend
NODE_ENV=development
PORT=5000
DATABASE_URL=mysql://user:password@localhost:5432/studyai
REDIS_URL=redis://localhost:6379

# JWT
JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# AI
ANTHROPIC_API_KEY=sk-ant-...
AI_MODEL=claude-sonnet-4-20250514
AI_MAX_RETRIES=3

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=StudyAI <noreply@studyai.com>

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Redis
REDIS_TOKEN_PREFIX=studyai:
```

---

## Implementation Order

Follow this sequence for a clean, incremental build:

### Phase 1 — Foundation
1. Initialize monorepo structure (`backend/`, `frontend/`, `shared/`)
2. Set up Express server with middleware (cors, helmet, morgan, rate limiter)
3. Set up Prisma with MySql, create schema, run migrations
4. Set up Redis connection
5. Create global error handler and async wrapper utility
6. Create Zod validation middleware

### Phase 2 — Authentication
7. Build auth module (register, login, verify email, refresh token, logout)
8. Build JWT service (sign, verify, refresh rotation)
9. Build email service (verification, password reset)
10. Build auth middleware (protect routes, extract user)
11. Build frontend auth pages (register, login, verify-email)
12. Build frontend auth state management (Zustand store, API interceptors)
13. Build ProtectedRoute component

### Phase 3 — Core Study Features
14. Build AI service (question generation, answer evaluation, hints)
15. Seed subjects and topics in database
16. Build study module (start, next question, answer, end)
17. Build study mode frontend (subject/topic selector, question card, answer input, feedback display)
18. Build quiz module (start, answer, submit, results)
19. Build quiz mode frontend (config, question display, progress bar, results page)
20. Build exam module (start, answer, submit with timer, results)
21. Build exam mode frontend (config, question navigator, timer, flagging, results)

### Phase 4 — Analytics & Polish
22. Build analytics aggregation service (daily cron job or on-session-complete)
23. Build analytics endpoints
24. Build analytics dashboard frontend (charts, heatmap, weak areas)
25. Build session history page
26. Build profile page (update name, change password)
27. Build landing page

### Phase 5 — Production Readiness
28. Add comprehensive error boundaries in frontend
29. Add loading states and skeleton loaders everywhere
30. Add toast notifications for all actions
31. Write Docker + docker-compose config
32. Write seed script with sample subjects/topics
33. Performance optimization (React.memo, lazy loading, API response caching)
34. Accessibility audit (keyboard nav, ARIA labels, focus management)
35. Mobile responsiveness pass

---

## Coding Standards & Conventions

### General
- JavaScript only (no TypeScript) — use JSDoc comments for complex function signatures
- ESM imports in frontend, CommonJS in backend (or ESM if configured)
- Use `async/await` everywhere — never raw Promises with `.then()`
- No `var` — use `const` by default, `let` only when reassignment is needed
- Destructure objects and arrays wherever it improves readability

### Backend
- Module pattern: each feature gets `routes.js`, `controller.js`, `service.js`, `validation.js`
- Controllers: thin — parse request, call service, send response
- Services: all business logic lives here. Services call other services, never controllers
- Validation: Zod schemas in `*.validation.js`, applied via middleware
- Errors: throw `ApiError` (custom class) — global error handler catches and formats
- Database: always use Prisma — never raw SQL unless for complex analytics queries
- Naming: `camelCase` for variables/functions, `PascalCase` for classes, `SCREAMING_SNAKE` for constants

### Frontend
- Functional components only — no class components
- Hooks for all logic — custom hooks in `/hooks` directory
- Zustand for global state — keep stores small and focused
- API calls: centralized in `lib/api.js` with Axios interceptors for auth
- Error handling: try/catch in hooks, display via toast notifications
- Components: presentational components in `ui/`, feature components in feature folders
- File naming: `PascalCase` for components, `camelCase` for hooks/utils

### AI Prompts
- All AI prompts must request JSON-only responses
- Always include "Respond ONLY in valid JSON" in the system prompt
- Parse responses with `JSON.parse()` inside try/catch
- If parsing fails: retry once, then return a user-friendly error
- Store prompt templates as constants, not inline strings
- Log prompt + response for debugging (redact in production)

### Git
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- Feature branches: `feature/auth-module`, `feature/quiz-mode`
- PR per feature, squash merge to main

---

## Security Checklist

- [ ] Passwords hashed with bcrypt (12 rounds)
- [ ] JWT secrets are strong (32+ characters)
- [ ] Access tokens are short-lived (15 min)
- [ ] Refresh token rotation on every use
- [ ] HttpOnly + Secure + SameSite cookies for refresh token
- [ ] Rate limiting on auth endpoints (5 attempts / 15 min)
- [ ] Rate limiting on AI endpoints (30 requests / min per user)
- [ ] Input validation on every endpoint (Zod)
- [ ] SQL injection prevented (Prisma parameterized queries)
- [ ] XSS prevented (React auto-escapes, no dangerouslySetInnerHTML)
- [ ] CORS restricted to frontend origin only
- [ ] Helmet.js for security headers
- [ ] No sensitive data in JWT payload (no password, no full user object)
- [ ] Environment variables never committed (.env in .gitignore)
- [ ] API key for Claude stored server-side only — never exposed to client

---

## Error Handling Pattern

### Backend
```javascript
// apiError.js
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// errorHandler.js middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    errors: err.errors || [],
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};
```

### Frontend
```javascript
// api.js interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Try refresh, if fails -> redirect to login
    }
    const message = error.response?.data?.message || "Something went wrong";
    toast.error(message);
    return Promise.reject(error);
  }
);
```

---

## Performance Guidelines

- **AI requests**: Cache question sets in Redis (1h TTL), keyed by subject+topic+difficulty+hash
- **Database**: Add indexes on frequently queried columns (already in schema)
- **Frontend**: Use `React.memo` for QuestionCard and similar repeated components
- **Images**: Use Next.js `Image` component with optimization
- **Code splitting**: Use `next/dynamic` for heavy pages (analytics charts)
- **API**: Paginate all list endpoints (default 20, max 100)
- **Debounce**: Search inputs debounced at 300ms
- **Skeleton loaders**: Show content placeholders while data loads (never blank screens)