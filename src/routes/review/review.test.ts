import request from "supertest";
import server from "../../index";
import { destroyDb, resetDb } from "../../utils/resetDb";
import Review from "../../models/reviews";
import User from "../../models/users";
import Book from "../../models/books";

const testUserPayload = {
  email: "testCartItem@example.com",
  firstname: "cart",
  lastname: "Item",
  password: "password123",
};
const testUserPayload2 = {
  email: "testCartIte2@example.com",
  firstname: "cart2",
  lastname: "Item2",
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

const testBookPayload3 = {
  title: "test cart item 2",
  author: "test cart item2",
  release_date: "2020-12-31T22:00:00.000Z",
  available: 20,
  short_description: "This short description",
  long_description: "This long description",
};

describe("Review endpoints test", () => {
  let testUserId: string;
  let testUserId2: string;
  let testBookId: string;
  let testBookId2: string;
  let testBookId3: string;
  let testReviewId: string;

  beforeAll(async () => {
    server.listen(0);
    await resetDb();

    const [addTestUser] = await User.createUser(testUserPayload);
    const [addTestUser2] = await User.createUser(testUserPayload2);
    const [addTestBook] = await Book.addNewBook(testBookPayload);
    const [addTestBook2] = await Book.addNewBook(testBookPayload2);
    const [addTestBook3] = await Book.addNewBook(testBookPayload3);

    testUserId = addTestUser.id;
    testUserId2 = addTestUser2.id;
    testBookId = addTestBook.id;
    testBookId2 = addTestBook2.id;
    testBookId3 = addTestBook3.id;

    const [testReview] = await Review.addReview({
      user_id: testUserId,
      book_id: testBookId,
      comment: "This is a good book!",
    });

    testReviewId = testReview.id;
  });

  afterAll(async () => {
    await destroyDb();
    server.close();
  });

  describe("Review - POST /api/reviews", () => {
    it("should return 400 when user id is missing", async () => {
      const res = await request(server).post("/api/reviews").send({
        user_id: "",
        book_id: testBookId,
        comment: "This is a good book!",
        rating: "",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "user_id is required!" });
    });

    it("should return 400 when the book id is missing", async () => {
      const res = await request(server).post("/api/reviews").send({
        user_id: testUserId,
        book_id: "",
        comment: "This is a good book!",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "book_id is required!" });
    });

    it("should return 400 when review value is missing", async () => {
      const res = await request(server).post("/api/reviews").send({
        user_id: testUserId,
        book_id: testBookId2,
        comment: "",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "missing review!" });
    });

    it("should add review", async () => {
      const res = await request(server).post("/api/reviews").send({
        user_id: testUserId,
        book_id: testBookId2,
        rating: 4,
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          book_id: testBookId2,
          comment: null,
          rating: 4,
          created_on: expect.any(String),
        }),
      ]);
    });
  });

  describe("Review - GET /api/reviews/:reviewId", () => {
    it("should return 404 when review is not found", async () => {
      const nonExistingReviewId = "6f6f91a6-dbf9-4b5a-93c3-c09b3b8b798a";
      const res = await request(server).get(
        `/api/reviews/${nonExistingReviewId}`
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "review not found!" });
    });

    it("should return review by review Id", async () => {
      const res = await request(server).get(`/api/reviews/${testReviewId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          book_id: testBookId,
          comment: "This is a good book!",
          rating: 4,
          created_on: expect.any(String),
        })
      );
    });
  });

  describe("Review - GET /api/reviews/book/:bookId", () => {
    it("should return 404 when a review is not found by book Id", async () => {
      const res = await request(server).get(`/api/reviews/book/${testBookId3}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "review not found!" });
    });

    it("should return review with book Id", async () => {
      const res = await request(server).get(`/api/reviews/book/${testBookId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          book_id: testBookId,
          comment: "This is a good book!",
          rating: 4,
          created_on: expect.any(String),
        }),
      ]);
    });
  });

  describe("Review - GET /api/reviews/user/:userId", () => {
    it("should return 404 when a review is not found by user Id", async () => {
      const res = await request(server).get(`/api/reviews/user/${testUserId2}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "reviews not found!" });
    });

    it("should return review with user Id", async () => {
      const res = await request(server).get(`/api/reviews/user/${testUserId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          book_id: testBookId,
          comment: "This is a good book!",
          rating: 4,
          created_on: expect.any(String),
        })
      ]);
    });
  });

  describe("Review - PATCH /api/reviews/:reviewId", () => {
    it("should return 400 when new review value is missing", async () => {
      const res = await request(server)
        .patch(`/api/reviews/${testReviewId}`)
        .send({
          user_id: testUserId,
          book_id: testBookId,
          comment: "",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "missing review!" });
    });

    it("should return 404 when review is not found", async () => {
      const nonExistingReviewId = "6f6f91a6-dbf9-4b5a-93c3-c09b3b8b798a";
      const res = await request(server).get(
        `/api/reviews/${nonExistingReviewId}`
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "review not found!" });
    });

    it("should update review successfully", async () => {
      const reviewBeforeUpdating = await Review.getReviewById(testReviewId);
      expect(reviewBeforeUpdating?.comment).toEqual("This is a good book!");

      const newComment = "Must read!";
      const res = await request(server)
        .patch(`/api/reviews/${testReviewId}`)
        .send({
          comment: newComment,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: "review updated successfully!" });

      const reviewAfterUpdating = await Review.getReviewById(testReviewId);
      expect(reviewAfterUpdating?.comment).toEqual(newComment);
    });
  });

  describe("Review - DELETE /api/reviews/:reviewId", () => {
    it("should return 404 when review is not found", async () => {
      const nonExistingReviewId = "6f6f91a6-dbf9-4b5a-93c3-c09b3b8b798a";
      const res = await request(server).get(
        `/api/reviews/${nonExistingReviewId}`
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "review not found!" });
    });

    it("should delete review successfully", async () => {
      const reviewBeforeDelete = await Review.getReviewById(testReviewId);
      expect(reviewBeforeDelete).toBeDefined();

      const res = await request(server).delete(`/api/reviews/${testReviewId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: "review deleted successfully!" });

      const reviewAfterDelete = await Review.getReviewById(testReviewId);
      expect(reviewAfterDelete).not.toBeDefined();
    });
  });
});
