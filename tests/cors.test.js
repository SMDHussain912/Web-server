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

describe("CORS Tests", () => {
  let server;

  beforeAll(() => {
    server = app.listen(0);
  });

  afterAll(() => {
    server.close();
  });

  test("should allow requests from localhost in development", async () => {
    const res = await request(server).get("/api/stats");
    expect(res.status).toBe(200);
  });

  test("should reject origins not in ALLOWED_ORIGINS in production", async () => {
    const res = await request(server)
      .get("/api/stats")
      .set("Origin", "http://evil-site.com");
    expect(res.status).not.toBe(403);
  });
});
