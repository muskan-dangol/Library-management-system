import request from "supertest";
import server from "../../index";
import { destroyDb, resetDb } from "../../utils/resetDb";
import Cart from "../../models/carts";
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
  let testCartId: string;
  let testCartItem: CartItemType[];

  beforeAll(async () => {
    server.listen(0);
    await resetDb();

    const [addTestUser] = await User.createUser(testUserPayload);
    const [addTestBook] = await Book.addNewBook(testBookPayload);
    const [addTestBook2] = await Book.addNewBook(testBookPayload2);

    testUserId = addTestUser.id;
    testBookId = addTestBook.id;
    testBookId2 = addTestBook2.id;

    const [addCart] = await Cart.addCart(testUserId);

    testCartId = addCart.id;

    testCartItem = await CartItem.addCartItem({
      cart_id: testCartId,
      book_id: testBookId,
      quantity: 1,
    });
  });

  afterAll(async () => {
    await destroyDb();
    server.close();
  });

  describe("Cart Item - POST /api/cart-items", () => {
    it("should not add item to cart when the user is unregistered", async () => {
      const res = await request(server).post("/api/cart-items").send({
        cart_id: "",
        book_id: testBookId,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "cart id is required!" });
    });

    it("should not add item to cart when the book is missing", async () => {
      const res = await request(server).post("/api/cart-items").send({
        cart_id: testCartId,
        book_id: "",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "book id is required!" });
    });

    it("should update the existing cart item if item already exists in cart", async () => {
      const cartItemsCountBefore =
        await CartItem.getCartItemByBookId(testBookId);
      expect(cartItemsCountBefore?.quantity).toEqual(1);

      const res = await request(server).post("/api/cart-items").send({
        cart_id: testCartId,
        book_id: testBookId,
      });

      expect(res.statusCode).toEqual(200);

      const cartItemsCountAfter =
        await CartItem.getCartItemByBookId(testBookId);
      expect(cartItemsCountAfter?.quantity).toEqual(2);
    });

    it("should add a item to cart", async () => {
      const res = await request(server).post("/api/cart-items").send({
        cart_id: testCartId,
        book_id: testBookId2,
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({ message: "Item added to cart!" });
    });
  });

  describe("Cart Item - GET /api/cart-items", () => {
    it("should get all the cart items", async () => {
      const res = await request(server).get("/api/cart-items");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([
        expect.objectContaining({
          cart_id: testCartId,
          book_id: testBookId,
          quantity: 2,
          created_on: expect.any(String),
          updated_on: expect.any(String),
        }),
        expect.objectContaining({
          cart_id: testCartId,
          book_id: testBookId2,
          quantity: 1,
          created_on: expect.any(String),
          updated_on: null,
        }),
      ]);
    });
  });

  describe("Cart Item - GET /api/cart-items/:bookId", () => {
    it("should return 404 when a book is not found in cart", async () => {
      const nonExistingBookId = "6f6f91a6-dbf9-4b5a-93c3-c09b3b8b798a";
      const res = await request(server).get(
        `/api/cart-items/${nonExistingBookId}`
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "cart item not found!" });
    });

    it("should return cart item with book Id", async () => {
      const res = await request(server).get(`/api/cart-items/${testBookId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          cart_id: testCartId,
          book_id: testBookId,
          quantity: 2,
          created_on: expect.any(String),
          updated_on: expect.any(String),
        })
      );
    });
  });

  describe("Cart Item - PATCH /api/cart-items/:bookId", () => {
    it("should return 404 when cart item does not exist", async () => {
      const nonExistingBookId = "6f6f91a6-dbf9-4b5a-93c3-c09b3b8b798a";
      const res = await request(server)
        .patch(`/api/cart-items/${nonExistingBookId}`)
        .send({
          quantity: 2,
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "cart item not found!" });
    });

    it("should update cart item", async () => {
      const cartItemBeforeUpdate =
        await CartItem.getCartItemByBookId(testBookId);
      expect(cartItemBeforeUpdate?.quantity).toEqual(2);

      const newQuantity = 3;
      const res = await request(server)
        .patch(`/api/cart-items/${testBookId}`)
        .send({ quantity: newQuantity });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: "cart item updated successfully!" });

      const cartItemAfterUpdate =
        await CartItem.getCartItemByBookId(testBookId);
      expect(cartItemAfterUpdate?.quantity).toEqual(newQuantity);
    });
  });

  describe("Cart Item - DELETE /api/cart-items/:bookId", () => {
    it("should return 404 when cart item does not exist", async () => {
      const nonExistingBookId = "6f6f91a6-dbf9-4b5a-93c3-c09b3b8b798a";
      const res = await request(server).delete(
        `/api/cart-items/${nonExistingBookId}`
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "cart item not found!" });
    });

    it("should remove item from cart", async () => {
      const cartItemBeforeDelete =
        await CartItem.getCartItemByBookId(testBookId);
      expect(cartItemBeforeDelete).toBeDefined();

      const res = await request(server).delete(`/api/cart-items/${testBookId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: "cart item deleted successfuly!" });

      const cartItemAfterDelete =
        await CartItem.getCartItemByBookId(testBookId);
      expect(cartItemAfterDelete).not.toBeDefined();
    });
  });
});
