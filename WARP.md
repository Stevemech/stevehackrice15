# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repository overview
- Monorepo with a React (TypeScript) frontend and an Express/MongoDB backend.
- Mobile builds are produced from the frontend via Capacitor for Android.
- A lightweight chat assistant (“Steve”) is implemented server-side and surfaced in the frontend on selected routes for authenticated users.

Project layout
- afya-quest-frontend: React app (CRA) with TypeScript, React Router, Leaflet maps, Axios API client, Capacitor for Android builds.
- afya-quest-backend: Express API with Mongoose models, JWT auth, and chat routes using OpenAI.
- Scripts at the repo root assist with starting both services and deploying the frontend.

Quick start (local development)
Prerequisites
- MongoDB running locally (e.g., brew services start mongodb-community on macOS)
- Node.js and npm

Backend
1) Configure environment
   cp afya-quest-backend/.env.example afya-quest-backend/.env
   # Edit .env to set at least: MONGODB_URI, JWT_SECRET, (optionally) PORT, OPENAI_API_KEY/OPENAI_MODEL
2) Install and run
   cd afya-quest-backend
   npm install
   npm run dev            # nodemon (hot reload) on the configured PORT
   # or: npm start        # plain node

Frontend
1) Configure environment (optional for local; required if backend is not on http://localhost:8080)
   cp afya-quest-frontend/.env.example afya-quest-frontend/.env
   # Set REACT_APP_API_URL to match your backend, e.g. http://localhost:5000/api or http://localhost:8080/api
2) Install and run
   cd afya-quest-frontend
   npm install
   npm start              # CRA dev server on port 3000 (or 3001 in start-steve.sh)

Repo-level helpers
- ./start-dev.sh
  Starts MongoDB check, then backend on :5000 and frontend on :3000. Uses npm start in each package.
- ./start-steve.sh
  Starts backend on :8080 and frontend on :3001, checks /api/health. Useful when you want api.ts default (8080) without setting REACT_APP_API_URL.

Common commands
Backend (afya-quest-backend)
- Install: npm install
- Start (prod): npm start
- Start (dev): npm run dev
- Test (Jest): npm test
  - Run a single test by name: npm test -- -t "pattern"
  - Run a single file: npx jest path/to/file.test.js

Frontend (afya-quest-frontend)
- Install: npm install
- Start (dev): npm start
- Test (CRA/Jest): npm test
  - Run a single test by name: npm test -- -t "pattern"
  - Run a single file: npm test -- src/path/to/Component.test.tsx
- Build (web): npm run build
- Android (Capacitor)
  - Prepare/build web + sync native: npm run build:mobile
  - Run on Android emulator/device: npm run android:dev
  - Produce Android build: npm run android:build
  - Open Android project in Android Studio: npm run android:open

Linting
- No explicit lint scripts are defined. CRA applies eslint configuration under the hood during start/build.
- The backend does not define a linter in package.json.

Build and deploy
Frontend (GitHub Pages)
- Set REACT_APP_API_URL to your deployed backend’s /api base (e.g., https://your-service.up.railway.app/api).
- From repo root, run: ./deploy.sh
  - Builds the frontend and deploys to GitHub Pages via gh-pages.
  - The script prints backend deployment options (Railway, Render, Heroku) and required env vars.

Backend (typical production run)
- From afya-quest-backend:
  NODE_ENV=production PORT=8080 npm start
- Ensure the following env vars are set in your host:
  - MONGODB_URI, JWT_SECRET, OPENAI_API_KEY, (optional) OPENAI_MODEL

High-level architecture
Frontend
- Routing and shell: src/App.tsx uses React Router and mounts ChatbotWrapper globally. It redirects unauthenticated users to /login by default.
- Chat assistant gating: src/components/ChatbotWrapper.tsx renders the floating chat button and window only if the user is authenticated and on allowed routes (/video-modules, /interactive-learning, /module-quiz/:id). Auth state is inferred from localStorage (authToken, user) and kept in sync via a custom authChanged event and window storage events.
- API access: src/services/api.ts centralizes Axios with baseURL from REACT_APP_API_URL (defaults to http://localhost:8080/api). It attaches Authorization: Bearer <token> when present and auto-redirects to /login on 401, also clearing auth and dispatching authChanged.
- State/UX: ThemeContext controls light/dark theme via document class toggles; utils (e.g., xpManager) handle game/lives mechanics. Pages/ and components/ compose the main UI and game flows (learning, videos, quizzes, maps, profiles).
- Mobile: Capacitor config (capacitor.config.ts) defines appId/appName and builds from the webDir build output. Android project lives under frontend/android/.

Backend
- Server: Express app in server.js wires CORS, JSON parsing, request logging, and mounts routes under /api/*.
- Data: MongoDB via Mongoose. The User model includes auth fields plus gamification attributes (level, totalPoints, rank, streaks, etc.). Passwords are hashed with bcrypt, with demo-user fallbacks to simplify local login.
- Auth: JWT-based. auth.middleware.js verifies Bearer tokens and attaches userId to the request.
- Routes (major groups):
  - /api/auth: register, login, me, change-password; special handling for the demo user (email demo@afyaquest.com / password demo123) to speed up testing.
  - /api/users, /api/lessons, /api/videos, /api/questions, /api/progress: content and progress endpoints (see README for the public list).
  - /api/chat: server-side AI assistant using OpenAI (requires OPENAI_API_KEY). System prompt establishes “Steve” persona and safety guidance.
- Health check: GET /api/health returns a simple JSON status to verify the backend is up.

Environment and configuration
Backend (.env example in afya-quest-backend/.env.example)
- MONGODB_URI: MongoDB connection string (defaults to mongodb://localhost:27017/afyaquest)
- JWT_SECRET: JWT signing secret
- PORT: server port (README references 5000; server.js defaults to 8080 if not set)
- OPENAI_API_KEY / OPENAI_MODEL: required for chat assistant
- Note: GEMINI_* variables are present in .env.example, but the current chat implementation uses OpenAI (see routes/chat.routes.js).

Frontend (.env example in afya-quest-frontend/.env.example)
- REACT_APP_API_URL: Base URL of the backend API including /api (e.g., http://localhost:8080/api). Set this to match your backend port if you are not using the defaults in start-steve.sh.

Useful defaults for local testing
- Demo credentials (from README):
  - Email: demo@afyaquest.com
  - Password: demo123
- Ports:
  - Backend: 5000 via ./start-dev.sh, or 8080 via ./start-steve.sh (and server.js default)
  - Frontend: 3000 via ./start-dev.sh, or 3001 via ./start-steve.sh

Notes from existing docs
- README.md includes endpoint summaries, tech stack, and development commands that align with the scripts above.
- AI_CHATBOT_README.md describes a Gemini-based setup; however, the active chat integration in routes/chat.routes.js is OpenAI. If you intend to switch providers, update that route accordingly and set the corresponding env vars.

There is no existing WARP.md, CLAUDE.md, Cursor rule file, or GitHub Copilot instruction file in this repository at the time of writing.
