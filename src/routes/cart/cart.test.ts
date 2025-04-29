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

describe("Cart endpoints test", () => {
  let testUserId: string;

  beforeAll(async () => {
    server.listen(0);
    await resetDb();

    const [addTestUser] = await User.createUser(testUserPayload);
    testUserId = addTestUser.id;

    await Cart.addCart(testUserId);
  });

  afterAll(async () => {
    await destroyDb();
    server.close();
  });

  describe("Cart - GET /api/carts/:userId", () => {
    it("should return 404 when no active cart is found", async () => {
      const nonExistingUserId = "f079cdec-70ba-4068-a7e0-0bce11819c17";
      const res = await request(server).get(`/api/carts/${nonExistingUserId}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "no active cart found!" });
    });

    it("should return active cart", async () => {
      const res = await request(server).get(`/api/carts/${testUserId}`);

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
});
