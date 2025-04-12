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

describe("User endpoints test", () => {
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

  describe("User - POST /api/users", () => {
    it("should not add new user when required fields are missing", async () => {
      const res = await request(server).post("/api/users").send({
        email: "test2@gmail.com",
        firstname: "Test2",
        lastname: "testing2",
        password: "",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "All fields are required" });
    });

    it("should not add a new user when the password length is less than 8 characters", async () => {
      const res = await request(server).post("/api/users").send({
        email: "test2@gmail.com",
        firstname: "Test2",
        lastname: "testing2",
        password: "tes",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({
        error: "Password must be at least 8 characters long",
      });
    });

    it("should add a new user successfully", async () => {
      const res = await request(server).post("/api/users").send({
        email: "test2@gmail.com",
        firstname: "Test2",
        lastname: "testing2",
        password: "testing2",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ data: "User created successfully!" });
    });
  });

  describe("User - GET /api/users", () => {
    it("should get all the users", async () => {
      const res = await request(server).get("/api/users");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toEqual([
        expect.objectContaining({
          id: testUserId,
          email: testUserPayload.email,
          firstname: testUserPayload.firstname,
          lastname: testUserPayload.lastname,
          password: expect.any(String),
          is_admin: false,
          created_on: expect.any(String),
        }),
        expect.objectContaining({
          id: expect.any(String),
          email: expect.any(String),
          firstname: expect.any(String),
          lastname: expect.any(String),
          password: expect.any(String),
          is_admin: false,
          created_on: expect.any(String),
        }),
      ]);
    });
  });

  describe("User - GET /api/users/:userId", () => {
    it("should return error with 400 when the user does not exist", async () => {
      const nonExistingUserId = "123e4567-e89b-12d3-a456-426614174000";
      const res = await request(server).get(`/api/users/${nonExistingUserId}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "User not found" });
    });

    it("should get a user by ID", async () => {
      const res = await request(server).get(`/api/users/${testUserId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: testUserId,
          email: testUserPayload.email,
          firstname: testUserPayload.firstname,
          lastname: testUserPayload.lastname,
          is_admin: false,
          created_on: expect.any(String),
        })
      );
    });
  });

  describe("User - PATCH /api/users/:userId", () => {
    it("should not update a user when a user does not exist", async () => {
      const nonExistingUserId = "123e4567-e89b-12d3-a456-426614174000";
      const res = await request(server)
        .get(`/api/users/${nonExistingUserId}`)
        .send({
          firstname: "Muskan",
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "User not found" });
    });

    it("Should update a user successfully when a user exists", async () => {
      const userBeforeUpdate = await User.getUserById(testUserId);
      expect(userBeforeUpdate?.firstname).toEqual(testUserPayload.firstname);

      const newFirstName = "Muskan";
      const res = await request(server).patch(`/api/users/${testUserId}`).send({
        firstname: newFirstName,
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ data: "User updated successfully!" });

      const userAfterUpdate = await User.getUserById(testUserId);
      expect(userAfterUpdate?.firstname).toEqual(newFirstName);
    });
  });

  describe("User - DELETE /api/users/:userId", () => {
    it("should not delete a user when a user does not exist", async () => {
      const nonExistingUserId = "123e4567-e89b-12d3-a456-426614174000";
      const res = await request(server).delete(
        `/api/users/${nonExistingUserId}`
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "User not found" });
    });

    it("should delete a user successfully when a user exists", async () => {
      const res = await request(server).delete(`/api/users/${testUserId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ data: "User deleted successfully!" });
    });
  });
});

