import db from "../../database/db";
import { BookType } from "./types";

const addNewBook = (reqPayload: Partial<BookType>): Promise<BookType[]> => {
  return db("book").insert(reqPayload).returning("*");
};

const getAllBooks = async (): Promise<BookType[]> => {
  return db("book").select("*");
};

const booksAfterSearchAndFilter = async (
  filterCategories: string[] = [],
  filterAuthors: string[] = [],
  filterReleaseDate: number[] = [],
  sortBy?: string,
  searchKeyword?: string
): Promise<BookType[]> => {
  const query = db("book").select("*");

  if (searchKeyword?.trim()) {
    query.andWhere(function () {
      this.where("title", "ilike", `%${searchKeyword}%`).orWhere(
        "author",
        "ilike",
        `%${searchKeyword}%`
      );
    });
  }

  if (filterCategories && filterCategories.length > 0) {
    const ids = filterCategories.flatMap((id: string) =>
      id.split(",").map((a) => a.trim())
    );
    query
      .join("book_category", "book.id", "book_category.book_id")
      .join("category", "book_category.category_id", "category.id")
      .whereIn("category.id", ids);
  }

  if (filterAuthors.length > 0) {
    const normalizedAuthors = filterAuthors.flatMap((author) =>
      author.split(",").map((a) => a.trim())
    );
    query.whereIn("author", normalizedAuthors);
  }

  if (filterReleaseDate.length === 2) {
    query.whereBetween("release_date", [
      new Date(`${filterReleaseDate[0]}-01-01`),
      new Date(`${filterReleaseDate[1]}-12-31`),
    ]);
  }

  const sortMap: Record<string, { column: string; order: "asc" | "desc" }> = {
    title: { column: "title", order: "asc" },
    "old-additions": { column: "release_date", order: "asc" },
    "new-additions": { column: "release_date", order: "desc" },
    "most-popular": { column: "popularity", order: "desc" },
  };

  const sort = sortMap[sortBy ?? ""];

  if (sort) {
    if (sort.column === "title") {
      query.orderByRaw(`LOWER(??) ${sort.order}`, [sort.column]);
    } else {
      query.orderBy(sort.column, sort.order);
    }
  }

  return query;
};

const getBookById = async (bookId: string): Promise<BookType | undefined> => {
  return db("book").where({ id: bookId }).first();
};

const getBookByTitle = async (title: string): Promise<BookType | undefined> => {
  return db("book").select().where({ title }).first();
};

const updateBook = async (
  bookId: string,
  reqpayload: Partial<BookType>
): Promise<void> => {
  await db("book").where({ id: bookId }).update(reqpayload);
};

const deleteBookById = async (bookId: string): Promise<void> => {
  await db("book").where({ id: bookId }).delete();
};

const getBooksByCategoryId = async (
  categoryId: string
): Promise<BookType[]> => {
  return db("book")
    .select(
      "book.title",
      "book.author",
      "book.release_date",
      "book.available",
      "book.short_description",
      "book.long_description",
      "book.image",
      "book.created_on",
      "category.name",
      "book_category.book_id",
      "book_category.category_id"
    )
    .join("book_category", "book.id", "book_category.book_id")
    .join("category", "book_category.category_id", "category.id")
    .where("category.id", categoryId);
};

export default {
  addNewBook,
  getAllBooks,
  getBookById,
  getBookByTitle,
  booksAfterSearchAndFilter,
  updateBook,
  deleteBookById,
  getBooksByCategoryId,
};
