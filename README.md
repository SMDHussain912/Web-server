> **Project status: Experimental / Pre-UniSphere.** Career Navigator was developed before UniSphere as an independent prototype for testing and understanding career-discovery, structured-learning, course-progress, and AI-assisted content-generation features. It is retained as an experimental learning project and technical reference, not as a production-ready platform or a completed part of UniSphere.

## Project background and relationship to UniSphere

Career Navigator was an earlier project used to explore product ideas and learn how career recommendations, learning journeys, backend APIs, frontend integration, and AI-assisted study workflows could be implemented. The experiments and engineering lessons from this work helped build understanding ahead of UniSphere. UniSphere is a separate, later platform with its own product scope and architecture; Career Navigator is not its production backend or a dependency.

The implementation status below describes the state documented for this repository. A feature listed as implemented still requires current testing before it should be treated as reliable. This repository is experimental and should not be used to process sensitive real-user data without a separate security and production-readiness review.

<p align="center">
  <h1 align="center">Career Navigator</h1>
  <p align="center"><b>An AI-assisted platform for career discovery, structured learning, and programming practice.</b></p>
  <p align="center">
    <a href="https://github.com/SMDHussain912/Web-server/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License"></a>
    <img src="https://img.shields.io/badge/frontend-React_18-61DAFB.svg" alt="React 18">
    <img src="https://img.shields.io/badge/build-Vite-646CFF.svg" alt="Vite">
    <img src="https://img.shields.io/badge/backend-Node.js_%2B_Express-339933.svg" alt="Node.js and Express">
    <img src="https://img.shields.io/badge/database-MongoDB-47A248.svg" alt="MongoDB">
    <img src="https://img.shields.io/badge/AI-OpenRouter-7C3AED.svg" alt="OpenRouter">
  </p>
</p>

> **Development status: Experimental prototype (pre-UniSphere).** Career Navigator has a backend foundation and a React client. Some course/lesson navigation and dashboard integrations are still being repaired and verified. This README distinguishes implemented API capabilities from completed user-facing workflows; the project is not production-ready.

## Table of Contents

- [What is Career Navigator?](#what-is-career-navigator)
- [Vision and Design Goals](#vision-and-design-goals)
- [Features and Implementation Status](#features-and-implementation-status)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Environment Configuration](#environment-configuration)
- [API Overview](#api-overview)
- [Project Structure](#project-structure)
- [Development Roadmap](#development-roadmap)
- [Contributing](#contributing)
- [License](#license)

## What is Career Navigator?

Career Navigator is an AI-assisted career discovery and programming-learning application. It is designed to bring course exploration, structured lessons, learning progress, assessments, and AI-supported study content into one platform.

The project follows a client/server architecture:

- **React client** provides the browser-based learning experience.
- **Express API** handles authentication, course data, progress, and learning services.
- **MongoDB** stores application and learning data through Mongoose.
- **OpenRouter** powers supported AI lesson, syllabus, and quiz generation workflows.

The goal is to make technical learning more structured and help learners connect what they study with the skills they want to develop.

## Vision and Design Goals

1. **Learning paths, not disconnected tutorials** — organize technical topics into courses and lessons.
2. **Progress that belongs to the learner** — keep learning activity associated with authenticated user accounts.
3. **AI as a learning assistant** — generate supporting lesson material, syllabi, and quizzes.
4. **Clear separation of concerns** — keep UI, API routes, services, and database models independently organized.
5. **Honest feature states** — distinguish working backend endpoints from frontend experiences that are still in progress.

## Features and Implementation Status

| Area | Current implementation |
|---|---|
| Authentication | Registration, login, logout, and session-based user authentication |
| Course catalogue | Backend course listing with difficulty, category, and search filters |
| Course details | Course and lesson retrieval API; frontend integration in progress |
| Lesson learning | Lesson retrieval and authenticated completion API; frontend flow requires verification |
| Learning dashboard | Statistics API is implemented; dashboard UI integration is in progress |
| Achievements | Authenticated achievements retrieval API; unlock logic and UI integration are incomplete |
| AI learning tools | Authenticated lesson, syllabus, and quiz generation endpoints |
| Notes | Authenticated backend API; dedicated frontend experience not yet implemented |
| Bookmarks | Authenticated backend API; dedicated frontend experience not yet implemented |
| Code execution | Disabled; endpoint returns HTTP 503 until a secure isolated runner exists |

**Important:** An API endpoint does not automatically mean its complete user interface or end-to-end workflow is finished. Check the current source and test results before relying on a feature.

## Architecture

Career Navigator uses a layered client/server design:

```text
                  Learner
                     |
                     v
          React 18 + React Router
                (Vite client)
                     |
               HTTP / JSON
                     |
                     v
             Node.js + Express
                (REST API)
                     |
          +----------+----------+
          |          |          |
          v          v          v
       Auth       Services    AI tools
      Session   Course/User   OpenRouter
          |          |
          +-----+----+
                |
                v
          MongoDB + Mongoose
```

**Backend responsibilities**

- Express application and API routing
- Session-based authentication and authorization
- Course and lesson retrieval
- User statistics and learning progress
- Notes, bookmarks, and achievements data
- AI-assisted learning content generation

**Frontend responsibilities**

- Authentication screens and protected routes
- Course catalogue and filtering
- Course and lesson presentation
- Dashboard, exams, and profile views

## Technology Stack

| Layer | Technologies |
|---|---|
| Language | JavaScript |
| Frontend | React 18, React Router 6 |
| Frontend tooling | Vite 5 |
| UI utilities | lucide-react, react-hot-toast |
| Backend runtime | Node.js |
| API framework | Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | express-session, bcryptjs |
| Validation | Zod |
| AI integration | OpenRouter Chat Completions API |
| Security middleware | Helmet, express-rate-limit |
| Testing tools | Jest, Supertest |

## Quick Start

### Prerequisites

- Node.js (current LTS recommended)
- npm
- MongoDB (local instance or hosted cluster)
- OpenRouter API key (required for AI generation)

### 1. Clone the repository

```bash
git clone https://github.com/SMDHussain912/Web-server.git
cd Web-server
```

### 2. Install dependencies

Install backend dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
cd ..
```

### 3. Configure environment variables

Create a local environment file:

```bash
cp .env.example .env
```

Configure the following values:

| Variable | Description | Required |
|---|---|---|
| `PORT` | Express server port (default: `3000`) | No |
| `NODE_ENV` | Runtime environment | Recommended |
| `SESSION_SECRET` | Secret used to sign session cookies | Yes |
| `MONGODB_URI` | MongoDB connection string | No; defaults to local MongoDB |
| `API_KEY` | OpenRouter API key | For AI generation |
| `ALLOWED_ORIGINS` | Comma-separated browser origins allowed by the API | Optional |

Generate a strong session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Never commit your real `.env` file, credentials, API keys, or session secrets.

### 4. Run the development servers

Start the backend from the repository root:

```bash
npm run dev
```

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

Open the local development URL printed by Vite. The Vite configuration proxies API and authentication requests to the backend.

### 5. Build the frontend

```bash
cd client
npm run build
```

The production frontend output is configured for `client/build`. Start the backend with:

```bash
cd ..
npm start
```

## API Overview

The following endpoints are defined in the Express application. Routes marked **Authenticated** require a valid user session.

### Authentication and account

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/login` | Sign in |
| POST | `/register` | Create an account |
| GET | `/logout` | End the current session |
| GET | `/api/me` | Get the current user (**Authenticated**) |
| POST | `/api/profile` | Update profile (**Authenticated**) |

### Courses and learning progress

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/courses` | List courses; supports difficulty, category, and search filters |
| GET | `/api/courses/:courseId` | Get a course and its lessons |
| GET | `/api/courses/:courseId/lesson/:lessonNumber` | Get a lesson |
| POST | `/api/courses/:courseId/lesson/:lessonNumber/complete` | Save lesson completion (**Authenticated**) |
| GET | `/api/my-courses` | Get the signed-in user's courses (**Authenticated**) |
| GET | `/api/stats` | Get learning statistics (**Authenticated**) |
| GET | `/api/progress` | Get learning progress (**Authenticated**) |
| GET | `/api/achievements` | Get achievement records (**Authenticated**) |

### AI-assisted learning

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/lessons/generate` | Generate lesson content (**Authenticated**) |
| POST | `/api/lessons/syllabus` | Generate a course syllabus (**Authenticated**) |
| POST | `/api/lessons/quiz` | Generate quiz content (**Authenticated**) |

### Notes, bookmarks, and system

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/notes` | List notes (**Authenticated**) |
| POST | `/api/notes` | Save a note (**Authenticated**) |
| GET | `/api/bookmarks` | List bookmarks (**Authenticated**) |
| POST | `/api/bookmarks` | Add or update a bookmark (**Authenticated**) |
| DELETE | `/api/bookmarks/:itemId` | Remove a bookmark (**Authenticated**) |
| GET | `/api/health` | API health information |
| POST | `/api/runCode` | Disabled; responds with HTTP 503 |

## Project Structure

```text
Web-server/
├── client/
│   ├── src/
│   │   ├── components/       Shared React components
│   │   ├── context/          Authentication context
│   │   └── pages/            Login, dashboard, courses, lessons, exam, profile
│   ├── package.json
│   └── vite.config.js
├── config/                   App and database configuration
├── middleware/               Express middleware
├── models/                   Mongoose models
├── routes/                   Authentication, exam, and API routes
├── services/                 Course, user, and lesson services
├── courses/                  Course seed data
├── server.js                 Express application entry point
├── package.json              Backend dependencies and scripts
└── .env.example              Environment variable template
```

## Development Roadmap

| Phase | Focus | Intended outcome |
|---|---|---|
| 1 | Core platform | Stable authentication, API, and database foundation |
| 2 | Course experience | Reliable catalogue, course detail, and lesson navigation |
| 3 | Learning progress | Explicit lesson completion and persistent user progress |
| 4 | Dashboard | Accurate statistics, achievements, loading, and error states |
| 5 | Study tools | Notes and bookmarks user interface |
| 6 | AI learning | Reliable lesson, syllabus, and quiz generation workflows |
| 7 | Quality and release | Automated tests, responsive UI, security review, and deployment checks |

Roadmap entries describe development goals, not claims that those milestones have already shipped.

## Contributing

Contributions and issue reports are welcome.

1. Fork the repository.
2. Create a focused branch for your change.
3. Keep frontend behavior consistent with the backend API contract.
4. Add or update tests when changing behavior.
5. Run the relevant tests and production build locally.
6. Open a pull request with a clear summary and the checks you actually ran.

For bug reports, include reproduction steps and relevant error output. Do not publish credentials, private user data, or production secrets.

## License

Career Navigator is licensed under the **MIT License**. See [LICENSE](./LICENSE) for the complete license text.

## Author

**Shaik Mahammad Hussain**

- GitHub: [@SMDHussain912](https://github.com/SMDHussain912)
- Project: [Career Navigator](https://github.com/SMDHussain912/Web-server)

---

<p align="center">
  <b>Explore skills. Build knowledge. Navigate your career.</b>
</p>
