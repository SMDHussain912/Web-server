const request = require("supertest");
const app = require("../server.js");

describe("/api/runCode Tests", () => {
  test("should return 503 and never execute code", async () => {
    const res = await request(app)
      .post("/api/runCode")
      .send({ code: "alert('hacked')", language: "javascript" });
    
    // Should return 503 - code execution disabled
    expect(res.status).toBe(503);
    
    // Should not contain execution output
    expect(res.body.error).toBeDefined();
  });

  test("should return 503 for Java code execution", async () => {
    const res = await request(app)
      .post("/api/runCode")
      .send({ code: "public class Main { public static void main(String[] args) { }", language: "java" });
    
    expect(res.status).toBe(503);
  });
});
