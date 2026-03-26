---
description: Steps to run the StudyAI project for the first time
---

# Running StudyAI

Follow these steps to get the full-stack project up and running in your local environment.

### 1. Prerequisites
- [ ] Ensure **Docker Desktop** is running.
- [ ] Make sure you have **Node.js** (v18+) installed.

### 2. Start Backend Infrastructure
// turbo
1. Start the database and redis containers:
```bash
docker compose up -d
```

### 3. Setup Backend Environment
1. Change into the backend directory:
```bash
cd backend
```
// turbo
2. Install dependencies:
```bash
npm install
```
// turbo
3. Apply the database schema:
```bash
npx prisma db push
```
// turbo
4. Start the backend development server:
```bash
npm run dev
```

### 4. Setup Frontend Environment
1. In a **new terminal tab**, change into the frontend directory:
```bash
cd frontend
```
// turbo
2. Install dependencies:
```bash
npm install
```
// turbo
3. Start the frontend development server:
```bash
npm run dev
```

### 5. Access the Platform
- Open your browser to [http://localhost:3000](http://localhost:3000).
- You can now register and start using StudyAI!
