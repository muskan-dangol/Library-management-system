import db from "../../database/db";
import { book_categoryType } from "./types";

const addBookCategory = async (
  reqPayload: Partial<book_categoryType>
): Promise<book_categoryType[]> => {
  return db("book_category").insert(reqPayload).returning("*");
};

export default { addBookCategory};
