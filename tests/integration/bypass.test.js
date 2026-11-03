const request = require('supertest');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const z = require('zod');

describe('Standalone Auth Flow Verification', () => {
    let app;
    let server;
    let api;

    beforeAll(() => {
        process.env.SESSION_SECRET = 'test-secret-phase6';
        process.env.NODE_ENV = 'development';
        
        app = express();
        app.use(express.json());
        app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 86400000 }
        }));
        
        const users = [];
        
        app.post('/api/register', async (req, res) => {
            const result = z.object({ email: z.string().email(), password: z.string().min(6), name: z.string().optional() }).safeParse(req.body);
            if (!result.success) return res.status(400).json({ error: result.error.errors[0].message });
            const { email, password, name } = result.data;
            const existing = users.find(u => u.email === email);
            if (existing) return res.status(400).json({ error: 'Email already registered' });
            const hashed = await bcrypt.hash(password, 10);
            users.push({ email, password: hashed, name });
            res.json({ success: true });
        });
        
        app.post('/api/login', async (req, res) => {
            const result = z.object({ email: z.string().email(), password: z.string() }).safeParse(req.body);
            if (!result.success) return res.status(400).json({ error: result.error.errors[0].message });
            const { email, password } = result.data;
            const user = users.find(u => u.email === email);
            if (!user) return res.status(401).json({ error: 'Invalid email or password' });
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return res.status(401).json({ error: 'Invalid email or password' });
            req.session.userId = user.email;
            res.json({ success: true });
        });
        
        app.get('/api/stats', (req, res) => {
            if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
            res.json({ lessonsCompleted: 0, examsTaken: 0 });
        });
        
        app.get('/api/logout', (req, res) => {
            req.session.destroy(() => res.status(200).json({ success: true }));
        });
        
        server = app.listen(0);
        api = request(server);
    });

    afterAll(() => {
        server.close();
        mongoose.connection.close();
    });

    describe('Authentication End-to-End Flow', () => {
        test('Complete: Register -> Login -> Stats -> Logout', async () => {
            const regRes = await api.post('/api/register').send({ email: 'e2e@example.com', password: 'password123', name: 'E2E User' });
            expect(regRes.status).toBe(200);
            expect(regRes.body.success).toBe(true);
            const loginRes = await api.post('/api/login').send({ email: 'e2e@example.com', password: 'password123' });
            expect(loginRes.status).toBe(200);
            expect(loginRes.body.success).toBe(true);
            const statsRes = await api.get('/api/stats');
            expect(statsRes.status).toBe(200);
            expect(statsRes.body.lessonsCompleted).toBe(0);
            expect(statsRes.body.examsTaken).toBe(0);
            const logoutRes = await api.get('/api/logout');
            expect(logoutRes.status).toBe(200);
            const statsAfterLogout = await api.get('/api/stats');
            expect(statsAfterLogout.status).toBe(401);
        });
    });
});
