# Career Navigator - Setup Guide

This guide will help you set up the Career Navigator application with MongoDB.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Java** (JDK 17 or higher) - [Download here](https://www.oracle.com/java/technologies/downloads/) (Required for code execution)
- **Git** - [Download here](https://git-scm.com/downloads/)

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Smdgameking/Web-server.git
cd Web-server
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express.js
- Mongoose (MongoDB)
- EJS (templating)
- bcryptjs (password hashing)
- And other dependencies

### 3. Set Up MongoDB

#### Option A: Local MongoDB Installation

1. **Install MongoDB Community Edition**
   - Download from: https://www.mongodb.com/try/download/community
   - Follow the installation wizard
   - MongoDB will run as a service on `mongodb://localhost:27017`

2. **Verify MongoDB is Running**
   ```bash
   # Windows
   mongod --version
   
   # Check if MongoDB service is running
   net start | findstr MongoDB
   ```

#### Option B: MongoDB Atlas (Cloud - Free Tier)

1. **Create Account**
   - Go to: https://www.mongodb.com/atlas/database
   - Sign up for free

2. **Create a Cluster**
   - Choose FREE tier (M0)
   - Select a cloud provider (AWS/Azure/GCP)
   - Choose a region close to you
   - Click "Create Cluster"

3. **Set Up Database Access**
   - Go to "Database Access" in the left menu
   - Click "Add New Database User"
   - Create username and password (save these!)
   - Grant "Read and write to any database" permission

4. **Set Up Network Access**
   - Go to "Network Access" in the left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address

5. **Get Connection String**
   - Go to "Database" in the left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (it looks like):
   ```
   mongodb+srv://username:password@cluster0.mongodb.net/career-navigator?retryWrites=true&w=majority
   ```

### 4. Configure Environment Variables

1. **Create `.env` file** in the root directory:
   ```bash
   # Copy the example file
   cp .env.example .env
   ```

2. **Edit `.env` file** with your settings:

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Session Secret (generate a random string)
   SESSION_SECRET=your-super-secret-key-here-make-it-long-and-random
   
   # MongoDB Configuration
   # For local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/career-navigator
   
   # For MongoDB Atlas (cloud):
   # MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/career-navigator?retryWrites=true&w=majority
   
   # AI API Configuration (OpenRouter)
   API_KEY=your-openrouter-api-key-here
   ```

3. **Get OpenRouter API Key** (for AI features):
   - Go to: https://openrouter.ai/
   - Sign up for an account
   - Go to "Keys" section
   - Create a new API key
   - Copy and paste it in the `.env` file

### 5. Start the Application

```bash
node server.js
```

You should see:
```
✅ MongoDB connected successfully
✅ Java detected: javac 17.0.1
🚀 Server running on port 3000
```

### 6. Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## 📁 Project Structure Explained

```
Web-server/
├── config/
│   ├── config.js          # App configuration (reads from .env)
│   └── database.js        # MongoDB connection setup
├── models/                # MongoDB Schemas
│   ├── User.js           # User accounts
│   ├── LessonProgress.js # Learning progress
│   ├── ExamResult.js     # Exam scores
│   ├── Achievement.js    # Badges & achievements
│   ├── Bookmark.js       # Saved items
│   └── Note.js           # User notes
├── middleware/
│   └── auth.js           # Authentication middleware
├── services/
│   ├── aiService.js      # AI API integration
│   └── userService.js    # Database operations
├── routes/
│   ├── auth.js           # Login/Register routes
│   ├── dashboard.js      # Dashboard
│   ├── courses.js        # Course management
│   ├── exam.js           # Exams
│   ├── ai.js             # AI recommendations
│   ├── profile.js        # User profile
│   └── api.js            # REST API
├── views/                # EJS templates (frontend)
├── public/               # Static files (CSS, JS, images)
├── courses/              # Course content (JSON)
├── server.js             # Main application file
├── package.json          # Dependencies
├── .env                  # Your configuration (NOT in git)
└── .env.example          # Example configuration
```

## 🔧 Configuration Details

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `SESSION_SECRET` | Secret for session encryption | `random-string-here` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/career-navigator` |
| `API_KEY` | OpenRouter API key for AI features | `sk-or-...` |

### MongoDB Collections

The application creates these collections automatically:
- `users` - User accounts
- `lessonprogresses` - Learning progress
- `examresults` - Exam scores
- `achievements` - User achievements
- `bookmarks` - Saved bookmarks
- `notes` - User notes

## 🎯 First Steps After Setup

1. **Create an Account**
   - Go to http://localhost:3000/login
   - Click "Register" tab
   - Enter email, password, and name
   - Click "Register"

2. **Explore the Dashboard**
   - View your stats (all start at 0)
   - Click on "AI Courses" to see available courses
   - Click on "AI Career Recommendations" to get career suggestions

3. **Start Learning**
   - Go to "AI Courses"
   - Click "Start" on Java course
   - Complete lessons and track progress

4. **Take an Exam**
   - Go to "Practice & Exams"
   - Enter a topic (e.g., "Java Variables")
   - AI generates 20 questions
   - Submit and see your score

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error: `MongoDB connection error`**
```bash
# Check if MongoDB is running
# Windows:
net start | findstr MongoDB

# Start MongoDB if not running
net start MongoDB
```

**Error: `ECONNREFUSED`**
- MongoDB is not running
- Start MongoDB service
- Or check your MongoDB Atlas connection string

### Port Already in Use

**Error: `Port 3000 is already in use`**
```bash
# Change port in .env file
PORT=3001
```

### Java Not Found

**Error: `Java is NOT installed`**
- Install JDK 17 or higher
- Add Java to your system PATH
- Restart terminal

### AI Features Not Working

**Error: `AI response error`**
- Check your OpenRouter API key in `.env`
- Verify you have credits in your OpenRouter account
- Check internet connection

## 📊 Database Management

### View Data in MongoDB Compass

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Select `career-navigator` database
4. Browse collections

### Backup Database

```bash
# Export all data
mongodump --db career-navigator --out ./backup

# Restore data
mongorestore --db career-navigator ./backup/career-navigator
```

### Reset Database

```bash
# Connect to MongoDB
mongosh

# Switch to database
use career-navigator

# Drop all collections
db.dropDatabase()

# Exit
exit
```

## 🔐 Security Notes

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use strong SESSION_SECRET** - Generate a random long string
3. **Change default credentials** - If using MongoDB Atlas
4. **Enable authentication** - For production MongoDB
5. **Use HTTPS** - In production environment

## 🚢 Deployment

### Deploy to Render.com

1. **Push code to GitHub**
2. **Create account on Render.com**
3. **Create new Web Service**
   - Connect your GitHub repo
   - Set build command: `npm install`
   - Set start command: `node server.js`
4. **Add Environment Variables**
   - Add all variables from `.env`
   - Use MongoDB Atlas for database
5. **Deploy**

### Deploy to Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create career-navigator

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set SESSION_SECRET=your-secret
heroku config:set API_KEY=your-api-key

# Deploy
git push heroku main
```

## 📚 Additional Resources

- **Express.js Docs**: https://expressjs.com/
- **Mongoose Docs**: https://mongoosejs.com/
- **MongoDB Docs**: https://docs.mongodb.com/
- **OpenRouter API**: https://openrouter.ai/docs
- **EJS Templates**: https://ejs.co/

## 💡 Tips

1. **Enable Debug Mode**: When starting the server, answer "yes" to enable debugging
2. **Check Logs**: Console logs show detailed information about errors
3. **Test API**: Use Postman or Thunder Client to test API endpoints
4. **MongoDB Compass**: Use it to visually explore your database

## 🆘 Getting Help

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running
4. Check that all dependencies are installed

---

**Version 2.0.0** - MongoDB Edition