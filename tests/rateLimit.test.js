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

describe("Rate Limit Tests", () => {
  let server;

  beforeAll(() => {
    server = app.listen(0);
  });

  afterAll(() => {
    server.close();
  });

  test("should reject login attempts after rate limit exceeded", async () => {
    // Make 6 login attempts (limit is 5 per 15 min)
    for (let i = 0; i < 6; i++) {
      await request(server)
        .post("/api/login")
        .send({ email: "test@example.com", password: "password123" });
    }
    
    const res = await request(server)
      .post("/api/login")
      .send({ email: "test@example.com", password: "password123" });
    
    // Should receive 429 after exceeding limit
    expect(res.status).toBe(429);
  });
});
