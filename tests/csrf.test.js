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

describe("CSRF Tests", () => {
  let server;

  beforeAll(() => {
    server = app.listen(0);
  });

  afterAll(() => {
    server.close();
  });

  test("should allow state-changing requests from allowed origins", async () => {
    const res = await request(server)
      .post("/api/bookmarks")
      .send({ type: "course", itemId: "1", title: "Test Course" });
    expect([200, 401]).toContain(res.status);
  });

  test("should reject requests from unauthorized origins", async () => {
    const res = await request(server)
      .post("/api/bookmarks")
      .send({ type: "course", itemId: "1", title: "Test Course" })
      .set("Origin", "http://evil-site.com");
    expect(res.status).not.toBe(200);
  });
});
