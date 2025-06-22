import db from "../../database/db";
import { BookType } from "./types";

const addNewBook = (reqPayload: Partial<BookType>): Promise<BookType[]> => {
  return db("book").insert(reqPayload).returning("*");
};

const getAllBooks = async (): Promise<BookType[]> => {
  return db("book").select("*");
};

const searchBooksByTitleOrAuthor = async (
  searchKeyword: string
): Promise<BookType[]> => {
  const searchTerm = searchKeyword.trim();

  return db("book")
    .select("*")
    .where("title", "like", `%${searchTerm}%`)
    .orWhere("author", "like", `%${searchTerm}%`);
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
  searchBooksByTitleOrAuthor,
  updateBook,
  deleteBookById,
  getBooksByCategoryId,
};
