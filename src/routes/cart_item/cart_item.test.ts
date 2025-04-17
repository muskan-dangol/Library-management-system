import request from "supertest";
import server from "../../index";
import { destroyDb, resetDb } from "../../utils/resetDb";
import CartItem from "../../models/cart_items";
import User from "../../models/users";
import Book from "../../models/books";
import { CartItemType } from "../../models/cart_items/types";

const testUserPayload = {
  email: "testCartItem@example.com",
  firstname: "cart",
  lastname: "Item",
  password: "password123",
};

const testBookPayload = {
  title: "test cart item",
  author: "test cart item",
  release_date: "2020-12-31T22:00:00.000Z",
  available: 20,
  short_description: "This short description",
  long_description: "This long description",
};

const testBookPayload2 = {
  title: "test cart item 2",
  author: "test cart item2",
  release_date: "2020-12-31T22:00:00.000Z",
  available: 20,
  short_description: "This short description",
  long_description: "This long description",
};

describe("Cart Item endpoints test", () => {
  let testUserId: string;
  let testBookId: string;
  let testBookId2: string;
  let testCartItemId: string;
  let testCartItem: CartItemType;

  beforeAll(async () => {
    server.listen(0);
    await resetDb();

    const [addTestUser] = await User.createUser(testUserPayload);
    const [addTestBook] = await Book.addNewBook(testBookPayload);
    const [addTestBook2] = await Book.addNewBook(testBookPayload2);

    testUserId = addTestUser.id;
    testBookId = addTestBook.id;
    testBookId2 = addTestBook2.id;

    [testCartItem] = await CartItem.addCartItem({
      user_id: testUserId,
      book_id: testBookId,
      quantity: 1,
    });

    testCartItemId = testCartItem.id;
  });

  afterAll(async () => {
    await destroyDb();
    server.close();
  });

  describe("Cart Item - POST /api/cart-item", () => {
    it("should not add item to cart when the user is unregistered", async () => {
      const res = await request(server).post("/api/cart-item").send({
        user_id: "",
        book_id: testBookId,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({
        error: "signUp before adding items in cart!",
      });
    });

    it("should not add item to cart when the book is missing", async () => {
      const res = await request(server).post("/api/cart-item").send({
        user_id: testUserId,
        book_id: "",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "book not found!" });
    });

    it("should update the existing cart item if item already exists in cart", async () => {
      const res = await request(server).post("/api/cart-item").send({
        user_id: testUserId,
        book_id: testBookId,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(2);
    });

    it("should add a item to cart", async () => {
      const res = await request(server).post("/api/cart-item").send({
        user_id: testUserId,
        book_id: testBookId2,
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({ message: "Item added to cart!" });
    });
  });

  describe("Cart Item - GET /api/cart-item", () => {
    it("should get all the cart items", async () => {
      const res = await request(server).get("/api/cart-item");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([
        expect.objectContaining({
          id: testCartItemId,
          user_id: testUserId,
          book_id: testBookId,
          quantity: 2,
          created_on: expect.any(String),
          updated_on: expect.any(String),
        }),
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          book_id: testBookId2,
          quantity: 1,
          created_on: expect.any(String),
          updated_on: null,
        }),
      ]);
    });
  });

  describe("Cart Item - GET /api/cart-item/:cartItemId", () => {
    it("should return 404 when a cart item is not found", async () => {
      const nonExistingCartItemId = "6f6f91a6-dbf9-4b5a-93c3-c09b3b8b798a";
      const res = await request(server).get(
        `/api/cart-item/${nonExistingCartItemId}`
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "cart item not found!" });
    });

    it("should return cart item", async () => {
      const res = await request(server).get(`/api/cart-item/${testCartItemId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: testCartItemId,
          user_id: testUserId,
          book_id: testBookId,
          quantity: 2,
          created_on: expect.any(String),
          updated_on: expect.any(String),
        })
      );
    });
  });

  describe("Cart Item - GET /api/cart-item/book/:bookId", () => {
    it("should return 404 when a book is not found in cart", async () => {
      const nonExistingCartItemId = "6f6f91a6-dbf9-4b5a-93c3-c09b3b8b798a";
      const res = await request(server).get(
        `/api/cart-item/book/${nonExistingCartItemId}`
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "cart item not found!" });
    });

    it("should return cart item with book Id", async () => {
      const res = await request(server).get(
        `/api/cart-item/book/${testBookId}`
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: testCartItemId,
          user_id: testUserId,
          book_id: testBookId,
          quantity: 2,
          created_on: expect.any(String),
          updated_on: expect.any(String),
        })
      );
    });
  });

  describe("Cart Item - PATCH /api/cart-item/:cartItemId", () => {
    it("should return 404 when cart item does not exist", async () => {
      const nonExistingCartItemId = "6f6f91a6-dbf9-4b5a-93c3-c09b3b8b798a";
      const res = await request(server)
        .get(`/api/cart-item/${nonExistingCartItemId}`)
        .send({
          quantity: 2,
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "cart item not found!" });
    });

    it("should update cart item", async () => {
      const cartItemBeforeUpdate =
        await CartItem.getCartItemById(testCartItemId);
      expect(cartItemBeforeUpdate?.quantity).toEqual(2);

      const newQuantity = 3;
      const res = await request(server)
        .patch(`/api/cart-item/${testCartItemId}`)
        .send({ quantity: newQuantity });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: "cart item updated successfully!" });

      const cartItemAfterUpdate =
        await CartItem.getCartItemById(testCartItemId);
      expect(cartItemAfterUpdate?.quantity).toEqual(newQuantity);
    });
  });

  describe("Cart Item - DELETE /api/cart-item/:cartItemId", () => {
    it("should return 404 when cart item does not exist", async () => {
      const nonExistingCartItemId = "6f6f91a6-dbf9-4b5a-93c3-c09b3b8b798a";
      const res = await request(server).delete(
        `/api/cart-item/${nonExistingCartItemId}`
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "cart item not found!" });
    });

    it("should remove item from cart", async () => {
      const cartItemBeforeDelete =
        await CartItem.getCartItemById(testCartItemId);
      expect(cartItemBeforeDelete).toBeDefined();

      const res = await request(server).delete(
        `/api/cart-item/${testCartItemId}`
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: "cart item deleted successfuly!" });

      const cartItemAfterDelete =
        await CartItem.getCartItemById(testCartItemId);
      expect(cartItemAfterDelete).not.toBeDefined();
    });
  });
});
