require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    session: {
        // Rule 10: Require a strong production SESSION_SECRET - no default fallback
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            // Rule 11: Add HttpOnly flag to prevent JavaScript access to session cookie
            httpOnly: true,
            // Rule 10: Secure flag must be enabled in production; disable in dev for HTTP
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24, // 24 hours
            sameSite: 'lax' // Help prevent CSRF attacks
        }
    },
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/career-navigator'
    },
    ai: {
        apiKey: process.env.API_KEY,
        baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'openai/gpt-4o-mini'
    },
    java: {
        timeout: 5000,
        tempDir: './temp'
    }
};