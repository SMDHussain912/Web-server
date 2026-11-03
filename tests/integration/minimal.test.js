const request = require('supertest');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const z = require('zod');

describe('Minimal Auth Tests (No server.js dependency)', () => {
    let app;
    let server;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use(session({
            secret: process.env.SESSION_SECRET || 'test-secret',
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
    });

    afterAll(() => {
        server.close();
        mongoose.connection.close();
    });

    describe('Registration', () => {
        test('should register a new user', async () => {
            const res = await request(server).post('/api/register').send({ email: 'test@example.com', password: 'password123', name: 'Test User' });
            expect(res.status).toBe(201);
        });
    });

    describe('Login', () => {
        test('should login with valid credentials', async () => {
            await request(server).post('/api/register').send({ email: 'test@example.com', password: 'password123', name: 'Test User' });
            const res = await request(server).post('/api/login').send({ email: 'test@example.com', password: 'password123' });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
        
        test('should reject invalid login', async () => {
            const res = await request(server).post('/api/login').send({ email: 'test@example.com', password: 'wrongpassword' });
            expect(res.status).toBe(401);
        });
    });

    describe('Session', () => {
        test('should return 401 for unauthenticated access', async () => {
            const res = await request(server).get('/api/stats');
            expect(res.status).toBe(401);
        });
        
        test('should logout and invalidate session', async () => {
            await request(server).post('/api/login').send({ email: 'test@example.com', password: 'password123' });
            const res = await request(server).get('/api/logout');
            expect(res.status).toBe(200);
            const statsRes = await request(server).get('/api/stats');
            expect(statsRes.status).toBe(401);
        });
    });
});
