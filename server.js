const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');
require('dotenv').config();

const config = require('./config/config');
const { initializeDatabase } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const coursesRoutes = require('./routes/courses');
const examRoutes = require('./routes/exam');
const aiRoutes = require('./routes/ai');
const profileRoutes = require('./routes/profile');
const apiRoutes = require('./routes/api');

const app = express();

/* ================= DEBUG MODE ================= */

let DEBUG = false;

function checkJavaInstalled() {
    return new Promise(resolve => {
        exec("javac -version", (err, stdout, stderr) => {
            if (err) {
                console.log("❌ Java is NOT installed.");
                console.log("Install it with:");
                console.log("apt-get install -y openjdk-17");
                resolve(false);
            } else {
                console.log("✅ Java detected:", stderr || stdout);
                resolve(true);
            }
        });
    });
}

async function askDebug() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        let answered = false;
        const timer = setTimeout(() => {
            if (!answered) {
                rl.close();
                resolve(false);
            }
        }, 5000);

        rl.question("Enable debugging? (yes/no): ", answer => {
            answered = true;
            clearTimeout(timer);
            const val = answer.trim().toLowerCase();
            if (val === "yes" || val === "y") {
                resolve(true);
            } else {
                resolve(false);
            }
            rl.close();
        });
    });
}

function log(...msg) {
    if (DEBUG) {
        console.log("[DEBUG]", ...msg);
    }
}

/* ================= MIDDLEWARE ================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session(config.session));

app.set("view engine", "ejs");
app.use(express.static("public"));

// Make session available to all views
app.use((req, res, next) => {
    res.locals.userId = req.session.userId;
    next();
});

/* ================= LOAD COURSES ================= */

const javaCourse = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'courses/java.json'), "utf8")
);

/* ================= ROUTES ================= */

// Public routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/index", (req, res) => {
    res.render("index");
});

// Auth routes
app.use("/", authRoutes);

// Dashboard routes
app.use("/", dashboardRoutes);

// Courses routes
app.use("/", coursesRoutes);

// Exam routes
app.use("/", examRoutes);

// AI routes
app.use("/", aiRoutes);

// Profile routes
app.use("/", profileRoutes);

// API routes
app.use("/api", apiRoutes);

/* ================= CODE EXECUTION ================= */

app.post("/runCode", async (req, res) => {
    try {
        const code = req.body.code;
        const filename = req.body.filename || "Main.java";
        const tempDir = path.join(__dirname, config.java.tempDir);

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        const filePath = path.join(tempDir, filename);
        fs.writeFileSync(filePath, code);

        const className = filename.replace(".java", "");
        const command = `cd ${tempDir} && javac ${filename} && java ${className}`;

        const child = exec(command, { timeout: config.java.timeout }, (error, stdout, stderr) => {
            let output = "";

            if (stderr) {
                output = stderr;
            } else if (stdout) {
                output = stdout;
            } else if (error) {
                output = error.message;
            } else {
                output = "Program ran successfully but produced no output.";
            }

            try {
                fs.unlinkSync(filePath);
                const classFile = path.join(tempDir, `${className}.class`);
                if (fs.existsSync(classFile)) {
                    fs.unlinkSync(classFile);
                }
            } catch (e) { }

            res.json({ output });
        });

    } catch (err) {
        console.log(err);
        res.json({ output: "Execution failed" });
    }
});

/* ================= CODE CHECKING ================= */

app.post("/checkCode", async (req, res) => {
    const { code, output, task } = req.body;

    try {
        const prompt = `
You are a beginner friendly programming teacher.

Task:
${task}

Student Code:
${code}

Program Output:
${output}

Check if the solution solves the task.

Rules:
- respond under 3 sentences
- start with Correct or Incorrect
- ignore formatting mistakes
- focus on logic and output
`;

        const response = await fetch(
            config.ai.baseUrl,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${config.ai.apiKey}`
                },
                body: JSON.stringify({
                    model: config.ai.model,
                    messages: [{ role: "user", content: prompt }]
                })
            }
        );

        const data = await response.json();
        log("AI checkCode response:", data);

        if (!data.choices) {
            return res.json({ feedback: "AI response error" });
        }

        res.json({
            feedback: data.choices[0].message.content
        });

    } catch (err) {
        console.log(err);
        res.json({
            feedback: "AI check failed"
        });
    }
});

app.post("/checkExercise", async (req, res) => {
    const { questions, answers } = req.body;

    try {
        const prompt = `
You are a beginner programming teacher.

Questions:
${JSON.stringify(questions)}

Student Answers:
${JSON.stringify(answers)}

Check if answers show correct understanding.

Rules:
- If mostly correct respond PASSED
- Otherwise explain briefly
- Maximum 3 sentences
`;

        const response = await fetch(
            config.ai.baseUrl,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${config.ai.apiKey}`
                },
                body: JSON.stringify({
                    model: config.ai.model,
                    messages: [{ role: "user", content: prompt }]
                })
            }
        );

        const data = await response.json();
        log("Exercise check response:", data);

        const feedback = data.choices[0].message.content;

        res.json({
            feedback,
            passed: feedback.toLowerCase().includes("passed")
        });

    } catch (err) {
        console.log(err);
        res.json({
            feedback: "Exercise check failed",
            passed: false
        });
    }
});

/* ================= SITEMAP ================= */

app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>https://careernavigator-cq9v.onrender.com/</loc>
            <lastmod>2026-03-04</lastmod>
        </url>
    </urlset>`);
});

/* ================= SERVER START ================= */

const PORT = config.port;

(async () => {
    DEBUG = await askDebug();
    console.log("Debug mode:", DEBUG ? "ON" : "OFF");

    // Initialize MongoDB
    await initializeDatabase(config.mongodb.uri);

    const javaOk = await checkJavaInstalled();

    if (!javaOk) {
        console.log("⚠ Java is not installed. Code execution features will be disabled.");
        console.log("  Install Java JDK 17+ to enable code execution.");
        console.log("  Windows: Download from https://www.oracle.com/java/technologies/downloads/");
        console.log("  Or use: winget install Oracle.JDK.17");
    }

    app.listen(PORT, () => {
        console.log("🚀 Server running on port", PORT);
        console.log("📱 Open http://localhost:" + PORT + " in your browser");
    });
})();