import request from "supertest";
import server from "../../index";
import { destroyDb, resetDb } from "../../utils/resetDb";

describe("Auth endpoints test", () => {
  beforeAll(async()=>{
    server.listen(0)
    await resetDb()
  })

  afterAll(async() => {
    await destroyDb()
    server.close()
  });

  describe("Signup - POST /api/auth/singup", () => {
    it("should fail signup when passport is missing", async () => {
      const res = await request(server).post("/api/auth/signup").send({
        email: "musn@gmail.com",
        password: "",
      })

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual("Missing credentials");
    });

    it("should fail signup when email is missing", async () => {
      const res = await request(server).post("/api/auth/signup").send({
        email: "",
        password: "musn@gmail.com",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual("Missing credentials");
    });

    it("should fail singup with short password", async () => {
      const res = await request(server).post("/api/auth/signup").send({
        email: "muskan@gmail.com",
        password: "muskyyy",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual(
        "Password must be at least 8 characters long"
      );
    });

    it("should create singup successfully with valid password", async () => {
      const res = await request(server).post("/api/auth/signup").send({
        email: "muskan@gmail.com",
        password: "muskyyy123",
      });

      expect(res.statusCode).toEqual(201);
    });

    it("should fail signup when used existing email", async () => {
      const res = await request(server).post("/api/auth/signup").send({
        email: "muskan@gmail.com",
        password: "muskyyy123",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual("User exists already!");
    });
  });

  describe("Login - POST /api/auth/login", () => {
    it("should fail login when email is not found", async () => {
      const response = await request(server).post("/api/auth/login").send({
        email: "muska@gmail.com",
        password: "muskyyy123",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toEqual("User does not exist!");
    });

    it("should fail login when password does not match", async () => {
      const response = await request(server).post("/api/auth/login").send({
        email: "muskan@gmail.com",
        password: "muskyyy12",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toEqual("Incorrect password!");
    });

    it("should login successfully", async () => {
      const response = await request(server).post("/api/auth/login").send({
        email: "muskan@gmail.com",
        password: "muskyyy123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ token: expect.any(String) });
    });
  });
});
