const request = require("supertest");
const app = require("../server.js");
const mongoose = require("mongoose");

const TEST_DB = "mongodb://localhost:27017/career-navigator-test";

beforeAll(async () => {
  await mongoose.connect(TEST_DB);
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Authentication Tests", () => {
  let server;
  let api;

  beforeAll(() => {
    server = app.listen(0);
    api = request.agent(server);
  });

  afterAll(() => {
    server.close();
  });

  test("should register a new user with valid input", async () => {
    const res = await api.post("/api/register").send({ email: "test@example.com", password: "password123", name: "Test User" });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test("should reject registration with short password", async () => {
    const res = await api.post("/api/register").send({ email: "test@example.com", password: "short" });
    expect(res.status).toBe(400);
  });

  test("should reject registration with invalid email", async () => {
    const res = await api.post("/api/register").send({ email: "not-an-email", password: "password123" });
    expect(res.status).toBe(400);
  });

  test("should reject duplicate registration", async () => {
    await api.post("/api/register").send({ email: "dup@example.com", password: "password123" });
    const res = await api.post("/api/register").send({ email: "dup@example.com", password: "password123" });
    expect(res.status).toBe(400);
  });

  test("should login with valid credentials", async () => {
    const res = await api.post("/api/login").send({ email: "test@example.com", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("should reject invalid login credentials", async () => {
    const res = await api.post("/api/login").send({ email: "test@example.com", password: "wrongpassword" });
    expect(res.status).toBe(401);
  });

  test("should return 401 for unauthenticated access to /api/stats", async () => {
    const res = await api.get("/api/stats");
    expect(res.status).toBe(401);
  });

  test("should logout and invalidate session", async () => {
    await api.post("/api/login").send({ email: "test@example.com", password: "password123" });
    const res = await api.get("/api/logout");
    expect(res.status).toBe(200);
    const statsRes = await api.get("/api/stats");
    expect(statsRes.status).toBe(401);
  });

  test("should regenerate session after login", async () => {
    await api.post("/api/login").send({ email: "test@example.com", password: "password123" });
    const res = await api.post("/api/login").send({ email: "test@example.com", password: "password123" });
    expect(res.status).toBe(200);
    const statsRes = await api.get("/api/stats");
    expect(statsRes.status).toBe(200);
  });
});
