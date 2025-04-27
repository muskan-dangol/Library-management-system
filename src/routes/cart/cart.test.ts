import request from "supertest";
import server from "../../index";
import { destroyDb, resetDb } from "../../utils/resetDb";
import User from "../../models/users";
import Cart from "../../models/carts";

const testUserPayload = {
  email: "test@example.com",
  firstname: "John",
  lastname: "Doe",
  password: "password123",
};

const testUserPayload2 = {
  email: "testing@example.com",
  firstname: "Johns",
  lastname: "Does",
  password: "password123",
};

describe.only("Cart endpoints test", () => {
  let testUserId: string;
  let testUserId2: string;

  beforeAll(async () => {
    server.listen(0);
    await resetDb();

    const [addTestUser] = await User.createUser(testUserPayload);
    const [addTestUser2] = await User.createUser(testUserPayload2);
    testUserId = addTestUser.id;
    testUserId2 = addTestUser2.id;

    const [cart] = await Cart.addCart(testUserId2);
    await Cart.updateCart(testUserId2, { enabled: false });
  });

  afterAll(async () => {
    await destroyDb();
    server.close();
  });

  describe("Cart - POST /api/carts", () => {
    it("should return 400 when a userId is missing ", async () => {
      const res = await request(server).post("/api/carts").send({
        user_id: "",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "userId is required!" });
    });

    it("should add a cart successfully", async () => {
      const res = await request(server).post("/api/carts").send({
        user_id: testUserId,
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          enabled: true,
          created_on: expect.any(String),
        }),
      ]);
    });

    it("should not add cart when a cart already exists", async () => {
      const res = await request(server).post("/api/carts").send({
        user_id: testUserId,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "cart already exists!" });
    });
  });

  describe("Cart - GET /api/carts/:userId", () => {
    it("should return 404 when cart is not found", async () => {
      const nonExistingUserId = "0a3b4c71-776a-4687-ac55-58d04702ec02";
      const res = await request(server).get(`/api/carts/${nonExistingUserId}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "cart not found!" });
    });

    it("should return cart with userId", async () => {
      const res = await request(server).get(`/api/carts/${testUserId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          enabled: expect.any(Boolean),
          created_on: expect.any(String),
        }),
      ]);
    });
  });

  describe("Cart - GET /api/carts/active/:userId", () => {
    it("should return 404 when no active cart is found", async () => {
      const res = await request(server).get(`/api/carts/active/${testUserId2}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "no active cart found!" });
    });

    it("should return active cart", async () => {
      const res = await request(server).get(`/api/carts/active/${testUserId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          enabled: true,
          created_on: expect.any(String),
        })
      );
    });
  });

  describe("Cart - PATCH /api/carts/:userId", () => {
    it("should return 400 when new value is missing", async () => {
      const res = await request(server).patch(`/api/carts/${testUserId}`).send({
        enabled: "",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "payload is required" });
    });

    it("should return 404 when a cart is not found", async () => {
      const nonExistingUserId = "123e4567-e89b-12d3-a456-426614174000";
      const res = await request(server)
        .patch(`/api/carts/${nonExistingUserId}`)
        .send({
          enabled: false,
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "cart not found!" });
    });

    it("should update cart successfully", async () => {
      const cartItemBeforeUpdate = await Cart.getActiveCartByUserId(testUserId);
      expect(cartItemBeforeUpdate?.enabled).toEqual(true);

      const res = await request(server).patch(`/api/carts/${testUserId}`).send({
        enabled: false,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: "updated cart successfully!" });

      const [cartItemAfterUpdate] = await Cart.getAllCartsByUserId(testUserId);
      expect(cartItemAfterUpdate?.enabled).toEqual(false);
    });
  });
});
