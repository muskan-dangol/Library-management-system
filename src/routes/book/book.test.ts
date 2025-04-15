import request from "supertest";
import server from "../../index";
import { destroyDb, resetDb } from "../../utils/resetDb";
import Book from "../../models/books";
import Category from "../../models/categories";

const testBookPayload = {
  title: "test book",
  author: "test author",
  release_date: "2020-12-31T22:00:00.000Z",
  available: 20,
  short_description: "This short description",
  long_description: "This long description",
};

const testCategoryPayload = {
  name: "Fiction",
};

describe("Book endpoints test", () => {
  let testBookId: string;
  let categoryId: string;

  beforeAll(async () => {
    server.listen(0);
    await resetDb();
    const [category] = await Category.addNewCategory(testCategoryPayload);
    const addedBook = await Book.addNewBook(testBookPayload);

    categoryId = category.id;
    testBookId = addedBook[0].id;
  });

  afterAll(async () => {
    await destroyDb();
    server.close();
  });

  describe("Book - POST /api/books", () => {
    it("should not add book when required fields are missing", async () => {
      const res = await request(server).post("/api/books").send({
        title: "Book1",
        author: "Muskan",
        release_date: "2021-01-01",
        available: 20,
        short_description: "This short description",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: "All fields are required!" });
    });

    it("should fail adding a new book to the list when used existing title", async () => {
      const res = await request(server)
        .post("/api/books")
        .send(testBookPayload);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({
        error: "A book with this title already exists!",
      });
    });

    it("should add a new book to the list", async () => {
      const res = await request(server).post("/api/books").send({
        title: "Book3",
        author: "Muskan",
        release_date: "2021-01-01T00:00:00.000Z",
        available: 20,
        short_description: "This short description",
        long_description: "This long description",
        category_id: categoryId,
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({ data: "Book added successfully!" });
    });
  });

  describe("Book - GET /api/books", () => {
    it("should get all the books", async () => {
      const res = await request(server).get("/api/books");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toEqual([
        expect.objectContaining({
          id: testBookId,
          title: testBookPayload.title,
          author: testBookPayload.author,
          release_date: expect.any(String),
          available: testBookPayload.available,
          short_description: testBookPayload.short_description,
          long_description: testBookPayload.long_description,
          image: null,
          created_on: expect.any(String),
        }),
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          author: expect.any(String),
          release_date: expect.any(String),
          available: expect.any(Number),
          short_description: expect.any(String),
          long_description: expect.any(String),
          image: null,
          created_on: expect.any(String),
        }),
      ]);
    });
  });

  describe("Book - GET BookById /api/books/:userId", () => {
    it("should return 404 when book does not exist", async () => {
      const nonExistingBookId = "123e4567-e89b-12d3-a456-426614174000";
      const res = await request(server).get(`/api/books/${nonExistingBookId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: "Book not found!" });
    });

    it("should get a book successfully", async () => {
      const res = await request(server).get(`/api/books/${testBookId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: testBookId,
          title: testBookPayload.title,
          author: testBookPayload.author,
          release_date: expect.any(String),
          available: testBookPayload.available,
          short_description: testBookPayload.short_description,
          long_description: testBookPayload.long_description,
          image: null,
          created_on: expect.any(String),
        })
      );
    });
  });

  describe("Book - PATCH /api/books/:userId", () => {
    it("should fail updating a book when a book does not exist", async () => {
      const nonExistingBookId = "123e4567-e89b-12d3-a456-426614174000";
      const res = await request(server)
        .get(`/api/books/${nonExistingBookId}`)
        .send({
          author: "Muskan Dangol",
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: "Book not found!" });
    });

    it("should update book by ID", async () => {
      const bookBeforeUpdate = await Book.getBookById(testBookId);
      expect(bookBeforeUpdate?.author).toEqual(testBookPayload.author);

      const newAuthor = "Muskan Dangol";
      const res = await request(server).patch(`/api/books/${testBookId}`).send({
        author: newAuthor,
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ data: "Book updated successfully!" });

      const bookAfterUpdate = await Book.getBookById(testBookId);
      expect(bookAfterUpdate?.author).toEqual(newAuthor);
    });
  });

  describe("Book - DELETE /api/books/:userId", () => {
    it("should fail deleting a book when a book does not exist", async () => {
      const nonExistingBookId = "123e4567-e89b-12d3-a456-426614174000";
      const res = await request(server).delete(
        `/api/books/${nonExistingBookId}`
      );

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: "Book not found!" });
    });

    it("should delete a book successfully", async () => {
      const bookBeforeDelete = await Book.getBookById(testBookId);
      expect(bookBeforeDelete).toBeDefined();

      const res = await request(server).delete(`/api/books/${testBookId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ date: "Book deleted successfully!" });

      const bookAfterDelete = await Book.getBookById(testBookId);
      expect(bookAfterDelete).not.toBeDefined();
    });
  });

  describe("Books - GET /api/books/category/:categoryId", () => {
    it("should return 404 when the category does not exist", async () => {
      const nonExistingCategoryId = "123e4567-e89b-12d3-a456-426614174000";
      const res = await request(server).get(
        `/api/books/category/${nonExistingCategoryId}`
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: "Category not found!" });
    });

    it("should return book by category ID", async () => {
      const res = await request(server).get(
        `/api/books/category/${categoryId}`
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          author: expect.any(String),
          release_date: expect.any(String),
          available: expect.any(Number),
          short_description: expect.any(String),
          long_description: expect.any(String),
          image: null,
          created_on: expect.any(String),
          book_id: expect.any(String),
          category_id: categoryId,
          name: testCategoryPayload.name,
        })
      ]);
    });
  });
});
