# Career Navigator

Career Navigator is an AI-assisted learning platform for exploring programming courses, studying lessons, tracking progress, and generating learning content.

The project uses a React single-page frontend, an Express/Node.js backend, and MongoDB.

> **Status:** Active development. Some frontend flows are still being completed; see the limitations section below.

## Features

- Browse published courses and filter by search term, difficulty, and category.
- View course and lesson content.
- Track lesson completion for signed-in users.
- View dashboard statistics: completed lessons, exams taken, average score, learning streak, and total score.
- Register, log in, and manage a session.
- Update profile data through the backend API.
- Generate lessons, course syllabi, and quizzes using the AI lesson service.
- Save and retrieve notes and bookmarks through backend APIs.
- Retrieve achievements through an authenticated API.

Code execution is currently disabled and returns HTTP 503 until a secure isolated execution environment is available.

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, React Router 6, Vite |
| UI | lucide-react, react-hot-toast |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | Express Session, bcryptjs |
| Validation | Zod |
| AI integration | OpenRouter Chat Completions API |
| Security | Helmet, express-rate-limit |
| Tests | Jest, Supertest (development dependencies) |

## Repository structure

    Web-server/
    ├── client/
    │   ├── src/
    │   │   ├── components/   Shared React components
    │   │   ├── context/      Authentication context
    │   │   └── pages/        Login, dashboard, courses, lessons, exam, profile
    │   ├── package.json
    │   └── vite.config.js
    ├── config/               Application and database configuration
    ├── middleware/           Backend middleware
    ├── models/               Mongoose models
    ├── routes/               Express route modules
    ├── services/             Course, user, and lesson services
    ├── courses/              Course seed data
    ├── server.js              Express application and API entry point
    ├── package.json           Backend dependencies and scripts
    └── .env.example           Environment variable template

## Requirements

- Node.js (a currently supported LTS release is recommended).
- npm.
- MongoDB, locally or through a hosted connection string.
- An OpenRouter API key for AI generation.

## Setup

### 1. Clone the repository

    git clone https://github.com/SMDHussain912/Web-server.git
    cd Web-server

### 2. Install backend dependencies

    npm install

### 3. Configure environment variables

    cp .env.example .env

Set these values in the local .env file:

| Variable | Purpose | Required |
| --- | --- | --- |
| PORT | Express port; defaults to 3000 | No |
| NODE_ENV | Runtime environment | Recommended |
| SESSION_SECRET | Secret used to sign session cookies | Yes |
| MONGODB_URI | MongoDB connection string | Yes for database use |
| API_KEY | OpenRouter API key | Yes for AI generation |
| ALLOWED_ORIGINS | Comma-separated allowed browser origins | Optional |

Generate a strong session secret:

    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Never commit .env files, credentials, API keys, or session secrets.

### 4. Install frontend dependencies

    cd client
    npm install
    cd ..

### 5. Run in development

Start the backend in one terminal:

    npm run dev

Start the frontend in another terminal:

    cd client
    npm run dev

Vite uses port 3001 and proxies API and authentication requests to the backend at http://localhost:3000.

Open http://localhost:3001 in your browser.

### 6. Build and run the production frontend

    cd client
    npm run build
    cd ..
    npm start

The Vite build is written to client/build. Express serves this build when the directory exists. The backend uses PORT or defaults to 3000.

## API reference

Endpoints marked **Authenticated** require a valid session cookie.

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | /login | Authenticate with email and password |
| POST | /register | Create an account |
| GET | /logout | Destroy the current session |
| GET | /api/me | Return signed-in user information (**Authenticated**) |

### User and progress

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /api/stats | Learning statistics (**Authenticated**) |
| GET | /api/progress | Lesson and exam progress (**Authenticated**) |
| POST | /api/profile | Update profile fields (**Authenticated**) |
| GET | /api/achievements | Retrieve achievements (**Authenticated**) |

### Courses and lessons

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /api/courses | List published courses; supports difficulty, category, and search filters |
| GET | /api/courses/:courseId | Get a course and its lessons |
| GET | /api/courses/:courseId/lesson/:lessonNumber | Get a lesson |
| POST | /api/courses/:courseId/lesson/:lessonNumber/complete | Save lesson completion (**Authenticated**) |
| GET | /api/my-courses | Get courses with user progress (**Authenticated**) |
| POST | /api/courses | Create a course (**Authenticated**) |
| POST | /api/courses/:courseId/lessons | Add a lesson (**Authenticated**) |
| DELETE | /api/courses/:courseId | Delete a course (**Authenticated**) |

### AI lesson tools

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | /api/lessons/generate | Generate a lesson (**Authenticated**) |
| POST | /api/lessons/syllabus | Generate a course syllabus (**Authenticated**) |
| POST | /api/lessons/quiz | Generate a quiz (**Authenticated**) |

### Notes and bookmarks

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /api/notes | List notes; optionally filter by courseId (**Authenticated**) |
| POST | /api/notes | Save a note (**Authenticated**) |
| GET | /api/bookmarks | List bookmarks (**Authenticated**) |
| POST | /api/bookmarks | Add or update a bookmark (**Authenticated**) |
| DELETE | /api/bookmarks/:itemId | Remove a bookmark (**Authenticated**) |

### Health and code execution

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /api/health | API health and version information |
| POST | /api/runCode | Currently disabled; returns HTTP 503 |

## Current status and limitations

- The React frontend currently defines login, dashboard, courses, course detail, lesson, exam, and profile routes.
- Notes and bookmarks have backend API support, but dedicated frontend pages and navigation are not currently present.
- The dashboard currently reads statistics from /api/stats; its achievement counter is not yet connected to the achievements endpoint.
- Course detail and lesson viewer frontend flows are being aligned with the existing course and lesson API contract.
- Code execution is intentionally disabled until a properly isolated sandbox is implemented.
- Jest and Supertest are included as development dependencies. Run the tests locally and inspect their actual output before considering the application verified.

Update this section as the remaining features are implemented and tested.

## Contributing

1. Create a feature or fix branch from main.
2. Keep frontend requests consistent with the API routes and response shapes in server.js.
3. Run relevant tests and the frontend production build.
4. Report what was actually tested and disclose anything that could not be tested.
5. Open a pull request with a concise summary.

## License

ISC License.

## Author

**Shaik Mahammad Hussain**  
GitHub: [@SMDHussain912](https://github.com/SMDHussain912)
