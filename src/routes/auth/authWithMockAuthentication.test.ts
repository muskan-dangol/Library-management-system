import request from "supertest";
import passport from "passport";
import app from "../../server";

jest.mock("passport");

describe("Auth endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Login - POST /api/auth/login", () => {
    it("should fail login when passport authentication fails", async () => {
      const errorMessage = "Login failed";
      // Mock passport.authenticate to throw error
      (passport.authenticate as jest.Mock).mockImplementation(
        (strategy, options, callback) => {
          return () => {
            callback(errorMessage);
          };
        }
      );

      const res = await request(app).post("/api/auth/login").send({
        email: "musn@gmail.com",
        password: "muskyyy",
      });

      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toEqual(errorMessage);
    });

    it("should create login successfully and return token", async () => {
      // Mock passport.authenticate to authenticate successfully
      (passport.authenticate as jest.Mock).mockImplementation(
        (strategy, options, callback) => {
          return () => {
            callback(null, true, { message: "Login successful" });
          };
        }
      );

      const res = await request(app).post("/api/auth/login").send({
        email: "musn@gmail.com",
        password: "muskyyy",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject({
        token: expect.any(String),
      });
    });
  });

  describe("Signup - POST /api/auth/singup", () => {});
});
