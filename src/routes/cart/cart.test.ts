import request from "supertest";
import server from "../../index";
import { destroyDb, resetDb } from "../../utils/resetDb";
import User from "../../models/users";

const testUserPayload = {
  email: "test@example.com",
  firstname: "John",
  lastname: "Doe",
  password: "password123",
};

describe("Cart endpoints test", () => {
  let testUserId: string;

  beforeAll(async () => {
    server.listen(0);
    await resetDb();

    const addTestUser = await User.createUser(testUserPayload);
    testUserId = addTestUser[0].id;
  });

  afterAll(async () => {
    await destroyDb();
    server.close();
  });

  describe("Cart - POST /api/cart", () => {
    it("should return 400 when a userId is missing ", async () => {
      const res = await request(server).post("/api/cart").send({
        user_id: "",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "userId is required!" });
    });

    it("should add a cart successfully", async () => {
      const res = await request(server).post("/api/cart").send({
        user_id: testUserId,
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          created_on: expect.any(String),
        }),
      ]);
    });

    it("should not add cart when a cart already exists", async () => {
      const res = await request(server).post("/api/cart").send({
        user_id: testUserId,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "cart already exists!" });
    });
  });

  describe("Cart - GET /api/cart", () => {
    it("should get cart", async () => {
      const res = await request(server).get("/api/cart");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          created_on: expect.any(String),
        }),
      ]);
    });
  });

  describe("Cart - GET /api/cart/:userId", () => {
    it("should return 404 when cart is not found", async () => {
      const nonExistingUserId = "123e4567-e89b-12d3-a456-426614174000";
      const res = await request(server).get(`/api/cart/${nonExistingUserId}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "cart not found!" });
    });

    it("should return cart with userId", async () => {
      const res = await request(server).get(`/api/cart/${testUserId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          created_on: expect.any(String),
        })
      );
    });
  });

  describe("Cart - DELETE /api/cart/:userId", () => {
    it("should return 404 when a cart is not found", async () => {
      const nonExistingUserId = "123e4567-e89b-12d3-a456-426614174000";
      const res = await request(server).delete(
        `/api/cart/${nonExistingUserId}`
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "Cart not found!" });
    });

    it("should delete cart successfully", async () => {
      const res = await request(server).delete(`/api/cart/${testUserId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: "deleted cart successfully!" });
    });
  });
});
