# StudyAI - AI-Powered Learning Platform

StudyAI is a full-stack learning platform that utilizes AI to generate personalized study questions, provide real-time feedback, and track performance analytics.

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for MySQL and Redis)
-   [OpenAI API Key](https://platform.openai.com/) (for AI features)

### 1. Setup Environment

#### Backend
```bash
cd backend
cp .env.example .env
```
Update the `.env` file with your database, redis, and AI service credentials.

#### Frontend
```bash
cd frontend
cp .env.example .env.local
```
Update the `NEXT_PUBLIC_API_URL` if necessary (defaults to `http://localhost:5000/api`).

### 2. Start Infrastructure (Docker)
Ensure Docker Desktop is running, then start the database and redis containers:
```bash
docker compose up -d
```

### 3. Initialize Database
Apply the Prisma schema to your local MySQL instance:
```bash
cd backend
npx prisma db push
```

### 4. Run the Applications

#### Start Backend (Development)
```bash
cd backend
npm run dev
```
The API will be available at `http://localhost:5000`.

#### Start Frontend (Development)
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:3000`.

## 📂 Project Structure

-   `backend/`: Node.js + Express API, Prisma models, AI service integrations.
-   `frontend/`: Next.js 14 application with Study, Quiz, Exam, and Analytics modules.
-   `shared/`: Shared TypeScript/Zod types and constants (optional for monorepo setups).

## 🛠️ Tech Stack

-   **Frontend**: Next.js, Zustand, Recharts, Tailwind CSS.
-   **Backend**: Node.js, Express, Prisma (MySQL), Redis.
-   **AI**: OpenAI SDK (GPT-4o/o3-mini).
-   **Infrastructure**: Docker, MySQL, Redis.
