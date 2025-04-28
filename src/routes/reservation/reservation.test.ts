import request from "supertest";
import server from "../../index";
import { destroyDb, resetDb } from "../../utils/resetDb";
import User from "../../models/users";
import Book from "../../models/books";
import Reservation from "../../models/reservations";

const testUserPayload = {
  email: "reservation@example.com",
  firstname: "reservation",
  lastname: "Item",
  password: "password123",
};

const testBookPayload = {
  title: "reservation",
  author: "reservation item",
  release_date: "2020-12-31T22:00:00.000Z",
  available: 20,
  short_description: "This short description",
  long_description: "This long description",
};

const testBookPayload2 = {
  title: "reservation2",
  author: "reservation2 item",
  release_date: "2020-12-31T22:00:00.000Z",
  available: 20,
  short_description: "This short description",
  long_description: "This long description",
};

describe.only("Reservation endpoints test", () => {
  let testUserId: string;
  let testBookId: string;
  let testBookId2: string;
  let testReservationId: string;

  beforeAll(async () => {
    server.listen(0);
    await resetDb();

    const [addTestUser] = await User.createUser(testUserPayload);
    const [addTestBook] = await Book.addNewBook(testBookPayload);
    const [addTestBook2] = await Book.addNewBook(testBookPayload2);

    testUserId = addTestUser.id;
    testBookId = addTestBook.id;
    testBookId2 = addTestBook2.id;

    const testReservationPayload = {
      user_id: testUserId,
      book_id: testBookId2,
      status: "reserved",
    };

    const [addTestReservation] = await Reservation.addReservation(
      testReservationPayload
    );
    testReservationId = addTestReservation.id;
  });

  afterAll(async () => {
    await destroyDb();
    server.close();
  });

  describe("Reservation - POST /api/reservations", () => {
    it("should return 400 when a user id or book id is missing", async () => {
      const res1 = await request(server).post("/api/reservations").send({
        user_id: "",
        book_id: testBookId,
        status: "reserved",
      });

      expect(res1.statusCode).toEqual(400);
      expect(res1.body).toEqual({ error: "user_id and book_id are required!" });

      const res = await request(server).post("/api/reservations").send({
        user_id: testUserId,
        book_id: "",
        status: "reserved",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "user_id and book_id are required!" });
    });

    it("should add a new reservation", async () => {
      const res = await request(server).post("/api/reservations").send({
        user_id: testUserId,
        book_id: testBookId,
        status: "reserved",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          book_id: testBookId,
          start_date: expect.any(String),
          end_date: expect.any(String),
          status: "reserved",
        }),
      ]);
    });
  });

  describe("Reservation - GET /api/reservations/:reservationId", () => {
    it("should return 404 when reservation is not found", async () => {
      const nonExistingReservationId = "e5825dd5-62e2-479b-a8ab-7bf131aedc2c";

      const res = await request(server).get(
        `/api/reservations/${nonExistingReservationId}`
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "reservation not found!" });
    });

    it("should return reservation by Id", async () => {
      const res = await request(server).get(
        `/api/reservations/${testReservationId}`
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          book_id: testBookId2,
          start_date: expect.any(String),
          end_date: expect.any(String),
          status: "reserved",
        })
      );
    });
  });

  describe("Reservation - GET /api/reservations/user/:userId", () => {
    it("should return reservations made by user", async () => {
      const res = await request(server).get(
        `/api/reservations/user/${testUserId}`
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          book_id: testBookId2,
          start_date: expect.any(String),
          end_date: expect.any(String),
          status: "reserved",
        }),
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          book_id: testBookId,
          start_date: expect.any(String),
          end_date: expect.any(String),
          status: "reserved",
        }),
      ]);
    });
  });

  describe("Reservation - GET /api/reservations/book/:bookId", () => {
    it("should return books reserved by bookId", async () => {
      const res = await request(server).get(
        `/api/reservations/book/${testBookId}`
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          user_id: testUserId,
          book_id: testBookId,
          start_date: expect.any(String),
          end_date: expect.any(String),
          status: "reserved",
        }),
      ]);
    });
  });

  describe("Reservation - PATCH /api/reservations/:reservationId", () => {
    it("should return 400 when status value is missing", async () => {
      const res = await request(server)
        .patch(`/api/reservations/${testReservationId}`)
        .send({
          status: "",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "status is required!" });
    });

    it("should return 404 when reservation is not found", async () => {
      const nonExistingReservationId = "e5825dd5-62e2-479b-a8ab-7bf131aedc2c";
      const res = await request(server)
        .patch(`/api/reservations/${nonExistingReservationId}`)
        .send({
          status: "returned",
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "reservation not found!" });
    });

    it("should update reservation status", async () => {
      const res = await request(server)
        .patch(`/api/reservations/${testReservationId}`)
        .send({
          status: "returned",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        message: "reservation updated successfully!",
      });
    });
  });
});
