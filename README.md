# Career Navigator

**An AI-assisted career discovery and programming-learning platform.**

Career Navigator brings career-oriented learning into one place. It combines a React frontend with a Node.js/Express API and MongoDB to support course discovery, lesson-based learning, progress tracking, and AI-assisted learning content.

> **Project status:** Active development. The backend includes several learning APIs, while parts of the frontend experience are still being integrated. See [Project status](#project-status) before using this as a production application.

---

## Overview

Career Navigator is being built to help learners explore technical subjects, follow structured courses, and monitor their learning journey. The application is organized as a client/server project:

- **Client:** React single-page application powered by Vite.
- **Server:** Node.js and Express REST API.
- **Database:** MongoDB with Mongoose.
- **AI services:** OpenRouter Chat Completions API for supported content-generation features.

## Features

### Available backend capabilities

- Account registration, login, and session-based authentication.
- Course catalogue and course/lesson retrieval.
- Authenticated lesson-completion and learning-progress endpoints.
- Dashboard statistics and an achievements API.
- Profile updates.
- AI-assisted lesson, syllabus, and quiz generation.
- Notes and bookmarks APIs.
- Health-check endpoint.

### Current limitations

- Notes and bookmarks have backend API support, but dedicated frontend pages and navigation are not yet available.
- The dashboard achievement counter is not yet connected to the achievements API.
- Course detail and lesson viewer frontend flows are still being aligned with the backend response contract.
- Code execution is disabled and the `/api/runCode` endpoint returns HTTP `503`. It must remain disabled until an isolated execution sandbox is implemented.

Feature availability can change as development continues. The limitations above are intentional disclosures, not promises of completed functionality.

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, React Router, Vite |
| UI utilities | lucide-react, react-hot-toast |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | Express Session, bcryptjs |
| Validation | Zod |
| AI integration | OpenRouter API |
| Security middleware | Helmet, express-rate-limit |
| Testing | Jest, Supertest |

## Repository structure

```text
Web-server/
├── client/
│   ├── src/
│   │   ├── components/       Shared UI components
│   │   ├── context/          Application context
│   │   └── pages/            Application pages
│   ├── package.json
│   └── vite.config.js
├── config/                   Application configuration
├── middleware/               Express middleware
├── models/                   Mongoose models
├── routes/                   API route modules
├── services/                 Application services
├── courses/                  Course data
├── server.js                 Express application entry point
├── package.json              Backend dependencies and scripts
└── .env.example              Environment variable template
```

## Getting started

### Prerequisites

Install the following before running the project:

- Node.js (an active LTS release is recommended)
- npm
- MongoDB (local instance or hosted cluster)
- An OpenRouter API key for AI-powered generation

### 1. Clone the repository

```bash
git clone https://github.com/SMDHussain912/Web-server.git
cd Web-server
```

### 2. Install server dependencies

```bash
npm install
```

### 3. Configure environment variables

Create your local environment file:

```bash
cp .env.example .env
```

Configure the values required by your environment:

| Variable | Purpose | Required |
| --- | --- | --- |
| `PORT` | HTTP port for the Express server (defaults to `3000`) | No |
| `NODE_ENV` | Runtime environment | Recommended |
| `SESSION_SECRET` | Secret used to sign session cookies | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes for database-backed features |
| `API_KEY` | OpenRouter API key | Yes for AI generation |
| `ALLOWED_ORIGINS` | Comma-separated allowed browser origins | Optional |

Generate a strong session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Security:** Keep your real `.env` file private. Never commit API keys, database credentials, session secrets, or other private configuration.

### 4. Install client dependencies

```bash
cd client
npm install
cd ..
```

### 5. Start the development servers

Start the backend from the repository root:

```bash
npm run dev
```

In a second terminal, start the Vite client:

```bash
cd client
npm run dev
```

Open the local URL printed by Vite in your terminal. The development client is configured to send API and authentication requests to the backend.

### 6. Build and run the production client

Build the frontend:

```bash
cd client
npm run build
cd ..
```

Then start the server:

```bash
npm start
```

The frontend build is generated in `client/build`. The Express application serves that directory when the production build is present.

## API overview

The following routes are implemented by the application server. Routes marked **Auth required** require a valid signed-in session.

### Authentication and account

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/me` | Get the current signed-in user (**Auth required**) |
| POST | `/login` | Sign in |
| POST | `/register` | Register an account |
| GET | `/logout` | End the current session |

### Learning and progress

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/stats` | Get learning statistics (**Auth required**) |
| GET | `/api/progress` | Get learning progress (**Auth required**) |
| GET | `/api/courses` | List available courses |
| GET | `/api/courses/:courseId` | Get course details and lessons |
| GET | `/api/courses/:courseId/lesson/:lessonNumber` | Get a lesson |
| POST | `/api/courses/:courseId/lesson/:lessonNumber/complete` | Mark a lesson complete (**Auth required**) |
| GET | `/api/my-courses` | Get the signed-in user's courses (**Auth required**) |
| GET | `/api/achievements` | Get achievements (**Auth required**) |

### AI-assisted learning

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/lessons/generate` | Generate lesson content (**Auth required**) |
| POST | `/api/lessons/syllabus` | Generate a course syllabus (**Auth required**) |
| POST | `/api/lessons/quiz` | Generate quiz content (**Auth required**) |

### Notes, bookmarks, and utilities

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/notes` | List notes (**Auth required**) |
| POST | `/api/notes` | Create a note (**Auth required**) |
| GET | `/api/bookmarks` | List bookmarks (**Auth required**) |
| POST | `/api/bookmarks` | Create or update a bookmark (**Auth required**) |
| DELETE | `/api/bookmarks/:itemId` | Delete a bookmark (**Auth required**) |
| GET | `/api/health` | Check API health |
| POST | `/api/runCode` | Disabled; responds with HTTP `503` |

For request schemas and response details, refer to the corresponding route and service implementation in the source code.

## Project status

Career Navigator is a work in progress. The backend and frontend do not yet provide a fully integrated experience for every capability.

Before deploying this project for real users:

1. Complete and verify the course-detail and lesson-viewer flows against the API response shapes.
2. Connect the dashboard achievement display to the achievements API.
3. Build the Notes and Bookmarks frontend experience.
4. Keep code execution disabled until a secure, resource-limited sandbox is available.
5. Review session-cookie settings, CORS/origin configuration, secrets, logging, and production database access.
6. Run the automated tests and a production frontend build in the target environment.

Do not treat the presence of an API endpoint as proof that its corresponding UI workflow is complete.

## Contributing

Contributions, bug reports, and thoughtful suggestions are welcome.

1. Fork the repository.
2. Create a focused branch for your change.
3. Keep changes consistent with the existing client/server architecture and API contracts.
4. Add or update tests where appropriate.
5. Run the relevant tests and frontend build locally.
6. Open a pull request describing the change and the checks you actually ran.

Please include reproduction steps for bug reports and avoid posting secrets, personal data, or production credentials in issues.

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for the complete terms.

## Author

**Shaik Mahammad Hussain**

- GitHub: [@SMDHussain912](https://github.com/SMDHussain912)
- Repository: [Career Navigator](https://github.com/SMDHussain912/Web-server)

---

<p align="center">
  Built to make learning technology and exploring career paths more accessible.
</p>
