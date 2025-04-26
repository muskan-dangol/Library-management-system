import request from "supertest";
import server from "../../index";
import { destroyDb, resetDb } from "../../utils/resetDb";
import Review from "../../models/reviews";
import User from "../../models/users";
import Book from "../../models/books";
import Reply from "../../models/replies";

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

describe("Reply endpoints test", () => {
  let testUserId: string;
  let testBookId: string;
  let testReviewId: string;
  let testReplyId: string;

  beforeAll(async () => {
    server.listen(0);
    await resetDb();

    const [addTestUser] = await User.createUser(testUserPayload);
    const [addTestBook] = await Book.addNewBook(testBookPayload);

    testUserId = addTestUser.id;
    testBookId = addTestBook.id;

    const [testReview] = await Review.addReview({
      user_id: testUserId,
      book_id: testBookId,
      comment: "This is a good book!",
    });

    testReviewId = testReview.id;

    const [addTestReply] = await Reply.addReply({
      user_id: testUserId,
      review_id: testReviewId,
      comment: "Thank you!",
    });

    testReplyId = addTestReply.id;
  });

  afterAll(async () => {
    await destroyDb();
    server.close();
  });

  describe("Reply - POST /api/replies", () => {
    it("should return 400 when user id is missing", async () => {
      const res = await request(server).post("/api/replies").send({
        user_id: "",
        review_id: testReviewId,
        comment: "Thank you for the feedback!",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "user_id is required!" });
    });

    it("should return 400 when review id is missing", async () => {
      const res = await request(server).post("/api/replies").send({
        user_id: testUserId,
        review_id: "",
        comment: "Thank you for the feedback!",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "review_id is required!" });
    });

    it("should return 400 when comment is empty", async () => {
      const res = await request(server).post("/api/replies").send({
        user_id: testUserId,
        review_id: testReviewId,
        comment: "",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "comment cannot be empty!" });
    });

    it("should add reply successfully", async () => {
      const res = await request(server).post("/api/replies").send({
        user_id: testUserId,
        review_id: testReviewId,
        comment: "Thank you for the feedback!",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveLength(1);
      expect(res.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          review_id: testReviewId,
          comment: expect.any(String),
          created_on: expect.any(String),
        }),
      ]);
    });
  });

  describe("Reply - GET /api/replies/review/:reviewId", () => {
    it("should return replies with review id", async () => {
      const res = await request(server).get(
        `/api/replies/review/${testReviewId}`
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          review_id: testReviewId,
          comment: expect.any(String),
          created_on: expect.any(String),
        }),
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          review_id: testReviewId,
          comment: expect.any(String),
          created_on: expect.any(String),
        }),
      ]);
    });
  });

  describe("Reply - GET /api/replies/:replyId", () => {
    it("should return 404 when reply is not found", async () => {
      const nonExistingReplyId = "cd864221-6f8b-4d4c-8619-7cd26069ae41";
      const res = await request(server).get(
        `/api/replies/${nonExistingReplyId}`
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "reply not found!" });
    });

    it("should return reply by id", async () => {
      const res = await request(server).get(`/api/replies/${testReplyId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: testReplyId,
          user_id: testUserId,
          review_id: testReviewId,
          comment: expect.any(String),
          created_on: expect.any(String),
        })
      );
    });
  });

  describe("Reply - PATCH /api/replies/:replyId", () => {
    it("should return 404 when reply is not found", async () => {
      const nonExistingReplyId = "cd864221-6f8b-4d4c-8619-7cd26069ae41";
      const res = await request(server).get(
        `/api/replies/${nonExistingReplyId}`
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "reply not found!" });
    });

    it("should return 400 when comment is missing", async () => {
      const res = await request(server)
        .patch(`/api/replies/${testReplyId}`)
        .send({
          comment: "",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "comment is required!" });
    });

    it("should update reply", async () => {
      const replyBeforeUpdate = await Reply.getReplyById(testReplyId);
      expect(replyBeforeUpdate?.comment).toEqual("Thank you!");

      const newComment = "Thanks dear!";
      const res = await request(server)
        .patch(`/api/replies/${testReplyId}`)
        .send({
          comment: newComment,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: "reply updated successfully!" });

      const ReplyAfterUpdate = await Reply.getReplyById(testReplyId);
      expect(ReplyAfterUpdate?.comment).toEqual(newComment);
    });
  });

  describe("Reply - DELETE /api/replies/:replyId", () => {
    it("should return 404 when reply is not found ", async () => {
      const nonExistingReplyId = "a6046a25-492f-45ad-a22f-a1178fc7f6a0";
      const res = await request(server).get(
        `/api/replies/${nonExistingReplyId}`
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "reply not found!" });
    });

    it("should delete reply", async () => {
      const replyBeforeDelete = await Reply.getReplyById(testReplyId);
      expect(replyBeforeDelete).toBeDefined();

      const res = await request(server).delete(`/api/replies/${testReplyId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: "reply deleted successfully!" });

      const replyAfterDelete = await Reply.getReplyById(testReplyId);
      expect(replyAfterDelete).not.toBeDefined();
    });
  });
});
