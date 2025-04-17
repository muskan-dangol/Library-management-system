import request from "supertest";
import server from "../../index";
import { destroyDb, resetDb } from "../../utils/resetDb";
import Category from "../../models/categories";

const testCategoryPayload = {
  name: "test category",
};

describe("Category endpoints test", () => {
  let testCategoryId: string;

  beforeAll(async () => {
    server.listen(0);
    await resetDb();

    const addedCategory = await Category.addNewCategory(testCategoryPayload);
    testCategoryId = addedCategory[0].id;
  });

  afterAll(async () => {
    await destroyDb();
    server.close();
  });

  describe("Category - POST /api/categories", () => {
    it("Should not add a category when required field is missing", async () => {
      const res = await request(server).post("/api/categories").send({
        name: "",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "category name is required!" });
    });

    it("should not add a category when using a existing category name", async () => {
      const res = await request(server).post("/api/categories").send({
        name: testCategoryPayload.name,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "category name already exists!" });
    });

    it("should add a category", async () => {
      const res = await request(server).post("/api/categories").send({
        name: "test2 category ",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({ message: "New category added successfully!" });
    });
  });

  describe("Category - GET /api/categories", () => {
    it("should get all the category lists", async () => {
      const res = await request(server).get("/api/categories");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toEqual([
        expect.objectContaining({
          id: testCategoryId,
          name: testCategoryPayload.name,
        }),
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        }),
      ]);
    });
  });

  describe("Category - GET /api/categories/:categoryId", () => {
    it("should return error with 404 when the category does not exist", async () => {
      const nonExistingCategoryId = "123e4567-e89b-12d3-a456-426614174000";
      const res = await request(server).get(
        `/api/categories/${nonExistingCategoryId}`
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "category not found!" });
    });

    it("should get a category by ID", async () => {
      const res = await request(server).get(
        `/api/categories/${testCategoryId}`
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: testCategoryId,
          name: testCategoryPayload.name,
        })
      );
    });
  });

  describe("Category - UPDATE /api/categories/:categoryId", () => {
    it("should give 404 when updating non existing category", async () => {
      const nonExistingCategoryId = "123e4567-e89b-12d3-a456-426614174000";
      const res = await request(server)
        .get(`/api/categories/${nonExistingCategoryId}`)
        .send({
          name: "Drama",
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "category not found!" });
    });

    it("should update a category by ID", async () => {
      const categoryBeforeUpdate =
        await Category.getCategoryById(testCategoryId);
      expect(categoryBeforeUpdate?.name).toEqual(testCategoryPayload.name);

      const newCategoryName = "Drama";
      const res = await request(server)
        .patch(`/api/categories/${testCategoryId}`)
        .send({ name: newCategoryName });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: "category updated successfully!" });

      const categoryAfterUpdate =
        await Category.getCategoryById(testCategoryId);
      expect(categoryAfterUpdate?.name).toEqual(newCategoryName);
    });
  });

  describe("Category - DELETE /api/categories/:categoryId", () => {
    it("should give 404 when deleting non existing category", async () => {
      const nonExistingCategoryId = "123e4567-e89b-12d3-a456-426614174000";
      const res = await request(server).delete(
        `/api/categories/${nonExistingCategoryId}`
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "category not found!" });
    });

    it("should delete a category by ID", async () => {
      const categoryBeforeDelete =
        await Category.getCategoryById(testCategoryId);
      expect(categoryBeforeDelete).toBeDefined();

      const res = await request(server).delete(
        `/api/categories/${testCategoryId}`
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: "category deleted successfully!" });

      const categoryAfterDelete =
        await Category.getCategoryById(testCategoryId);
      expect(categoryAfterDelete).not.toBeDefined();
    });
  });
});
