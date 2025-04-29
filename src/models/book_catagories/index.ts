import db from "../../database/db";
import { BookCategoryType } from "./types";

const addBookCategory = async (
  reqPayload: Partial<BookCategoryType>
): Promise<BookCategoryType[]> => {
  return db("book_category").insert(reqPayload).returning("*");
};

export default { addBookCategory};
