# Career Navigator - AI-Powered Learning Platform

A modern, feature-rich Node.js web application for career recommendations, interactive learning, and AI-powered education. Built with Express.js, EJS templates, Firebase authentication, and AI integration.

## ✨ New Features

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Beautiful frosted glass effect throughout the app
- **Smooth Animations**: Fade-in, slide, and hover effects for better UX
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Font Awesome Icons**: Professional iconography throughout
- **Gradient Backgrounds**: Modern purple-blue gradient theme

### 🤖 AI-Powered Features
- **AI Career Recommendations**: Get personalized career paths based on your skills, interests, and education
- **AI-Generated Exams**: Create custom practice exams on any topic
- **AI Code Checking**: Get instant feedback on your code solutions
- **AI Project Generation**: Generate mini-projects for each lesson

### 📚 Enhanced Learning
- **Interactive Course Roadmap**: Visual progress tracking with locked/unlocked lessons
- **Code Editor**: Built-in Java compiler with run and check functionality
- **Lesson Notes**: Take and save notes while learning
- **Bookmarks**: Save courses and lessons for quick access
- **Achievement System**: Earn badges for milestones (first lesson, 7-day streak, etc.)

### 📊 Progress Tracking
- **Learning Streak**: Track consecutive days of learning
- **Statistics Dashboard**: View lessons completed, exams taken, average scores
- **Exam Results**: Detailed history of all exam performances
- **Profile Page**: Comprehensive overview of your learning journey

### 🔐 Authentication & Security
- **Firebase Authentication**: Secure email/password authentication
- **Session Management**: Express-session for secure user sessions
- **Protected Routes**: Middleware-based route protection

### 🔌 REST API
- **API Endpoints**: Full REST API for mobile app integration
- **JSON Responses**: All data available via API
- **Health Check**: API status monitoring endpoint

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: EJS templates, HTML5, CSS3, JavaScript
- **Authentication**: Firebase Admin SDK
- **Database**: Firebase Firestore
- **AI Integration**: OpenRouter API (GPT-4o-mini)
- **Code Execution**: Java compiler (javac)
- **Icons**: Font Awesome 6.4.0

## 📁 Project Structure

```
Web-server/
├── config/
│   ├── config.js          # Application configuration
│   └── database.js        # Firebase database setup
├── middleware/
│   └── auth.js            # Authentication middleware
├── services/
│   ├── aiService.js       # AI API integration
│   └── userService.js     # User data operations
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── dashboard.js       # Dashboard routes
│   ├── courses.js         # Course management
│   ├── exam.js            # Exam generation & submission
│   ├── ai.js              # AI recommendations
│   ├── profile.js         # User profile
│   └── api.js             # REST API endpoints
├── views/
│   ├── index.ejs          # Landing page
│   ├── login.ejs          # Login/Register
│   ├── dashboard.ejs      # Main dashboard
│   ├── courses.ejs        # Course listing
│   ├── course-roadmap.ejs # Course progress
│   ├── lesson.ejs         # Individual lesson
│   ├── exam.ejs           # Exam interface
│   ├── info.ejs           # Career recommendations
│   ├── profile.ejs        # User profile
│   ├── achievements.ejs   # Achievements page
│   ├── results.ejs        # Exam results
│   ├── notes.ejs          # User notes
│   └── bookmarks.ejs      # Saved bookmarks
├── public/
│   └── js/
│       └── auth.js        # Firebase client auth
├── courses/
│   └── java.json          # Java course content
├── server.js              # Main application entry
├── package.json
├── .env.example           # Environment variables template
└── README.md
```

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Smdgameking/Web-server.git
   cd Web-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your credentials in `.env`:
   - `FIREBASE_KEY`: Your Firebase service account key (JSON)
   - `API_KEY`: Your OpenRouter API key
   - `SESSION_SECRET`: A secure random string

4. **Configure Firebase**
   - Update Firebase config in `public/js/auth.js` with your Firebase project details

5. **Start the server**
   ```bash
   node server.js
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **Java** (JDK 17 or higher) - Required for code execution
- **Firebase Project** - For authentication and database
- **OpenRouter API Key** - For AI features

## 🎯 Features Overview

### For Students
- 📖 **Interactive Lessons**: Learn with hands-on coding exercises
- 🎓 **AI Exams**: Generate and take custom exams on any topic
- 💻 **Code Practice**: Write and run Java code directly in browser
- 📝 **Notes**: Take notes while learning
- 🔖 **Bookmarks**: Save important lessons
- 🏆 **Achievements**: Earn badges and track milestones

### For Career Growth
- 🤖 **AI Recommendations**: Get personalized career paths
- 📊 **Progress Tracking**: Monitor your learning journey
- 🎯 **Skill Assessment**: Test your knowledge with exams
- 📈 **Performance Analytics**: View detailed statistics

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `SESSION_SECRET` | Session encryption key | Yes |
| `FIREBASE_KEY` | Firebase service account JSON | Yes |
| `API_KEY` | OpenRouter API key | Yes |

## 📱 API Endpoints

### Public Endpoints
- `GET /` - Landing page
- `GET /login` - Login page
- `POST /createSession` - Create user session

### Protected Endpoints (Require Authentication)
- `GET /dashboard` - User dashboard
- `GET /courses` - Course listing
- `GET /course/:id` - Course roadmap
- `GET /course/:id/lesson/:num` - Lesson page
- `GET /exam` - Exam page
- `POST /generateExam` - Generate AI exam
- `POST /submitExam` - Submit exam
- `GET /results` - Exam results
- `GET /info` - Career recommendations
- `POST /getRecommendations` - Get AI recommendations
- `GET /profile` - User profile
- `GET /achievements` - User achievements

### REST API (JSON)
- `GET /api/health` - Health check
- `GET /api/courses` - All courses
- `GET /api/stats` - User statistics
- `GET /api/progress` - Learning progress
- `POST /api/recommendations` - Career recommendations
- `GET /api/bookmarks` - User bookmarks
- `POST /api/bookmarks` - Add bookmark
- `DELETE /api/bookmarks/:id` - Remove bookmark
- `GET /api/notes` - User notes
- `POST /api/notes` - Save note

## 🎨 Design Improvements

### Before
- Basic HTML/CSS with inline styles
- Simple gradient backgrounds
- Limited responsiveness
- Basic navigation

### After
- **Modular CSS**: Organized styles with CSS variables
- **Glassmorphism**: Modern frosted glass effects
- **Animations**: Smooth transitions and hover effects
- **Icons**: Font Awesome throughout
- **Mobile-First**: Fully responsive design
- **Accessibility**: Better contrast and readability

## 🔮 Future Enhancements

- [ ] Add more courses (Python, Web Development, Data Science)
- [ ] Implement dark/light mode toggle
- [ ] Add social features (leaderboards, sharing)
- [ ] Certificate generation on course completion
- [ ] Video lessons integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Community forums
- [ ] Live coding sessions
- [ ] Mentor matching system

## 🐛 Known Issues

- Java compiler requires JDK 17+ installed
- Firebase config needs to be updated in production
- AI API rate limits apply

## 📝 License

ISC License

## 👨‍💻 Author

**Shaik Mahammad Hussain**
- Computer Engineering Student
- Interested in Robotics, Machine Learning, and Game Development
- GitHub: [@Smdgameking](https://github.com/Smdgameking)

## 🙏 Acknowledgments

- Firebase for authentication and database
- OpenRouter for AI capabilities
- Font Awesome for icons
- Express.js community

---

**Version 2.0.0** - Complete redesign with modern features and improved UX