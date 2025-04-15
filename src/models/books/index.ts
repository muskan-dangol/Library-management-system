import db from "../../database/db";
import { BookType } from "./types";

const addNewBook = (reqPayload: Partial<BookType>): Promise<BookType[]> => {
  return db("book").insert(reqPayload).returning("*");
};

const getAllBooks = async (): Promise<BookType[]> => {
  return db("book").select("*");
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

const deleteBookById = async(bookId: string): Promise<void> => {
  await db("book").where({ id: bookId }).delete();
};

const getBookByCategoryId = async (categoryId: string): Promise<BookType[]> => {
  return db("book")
    .select("*")
    .join("book_category", "book.id", "book_category.book_id")
    .join("category", "book_category.category_id", "category.id")
    .where("category.id", categoryId);
};

export default {
  addNewBook,
  getAllBooks,
  getBookById,
  getBookByTitle,
  updateBook,
  deleteBookById,
  getBookByCategoryId,
};
