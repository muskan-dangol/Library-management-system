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
        updated_on: new Date(),
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

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: "Item added to cart!" });
    });
  });

  describe("Cart Item - GET /api/cart-items/:cartId", () => {
    it("should get all the cart items", async () => {
      const res = await request(server).get(`/api/cart-items/${testCartId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([
        expect.objectContaining({
          title: expect.any(String),
          author: expect.any(String),
          release_date: expect.any(String),
          available: expect.any(Number),
          short_description: expect.any(String),
          long_description: expect.any(String),
          image: null,
          cart_id: testCartId,
          quantity: 2,
          book_id: testBookId,
          created_on: expect.any(String),
          updated_on: expect.any(String),
        }),
        expect.objectContaining({
          title: expect.any(String),
          author: expect.any(String),
          release_date: expect.any(String),
          available: expect.any(Number),
          short_description: expect.any(String),
          long_description: expect.any(String),
          image: null,
          cart_id: testCartId,
          quantity: 1,
          book_id: testBookId2,
          created_on: expect.any(String),
          updated_on: null,
        }),
      ]);
    });
  });
});
