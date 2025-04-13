import db from "../../database/db";
import { categoryType } from "./types";

const addNewCategory = (
  reqpayload: Partial<categoryType>
): Promise<categoryType[]> => {
  return db("category").insert(reqpayload).returning("*");
};

const getAllCategory = (): Promise<categoryType[]> => {
  return db("category").select("*");
};

const getCategoryById = (
  categoryId: string
): Promise<categoryType | undefined> => {
  return db("category").where({ id: categoryId }).first();
};

const updateCategory = async (
  categoryId: string,
  reqpayload: Partial<categoryType>
): Promise<void> => {
  await db("category").where({ id: categoryId }).update(reqpayload);
};

const deleteCategory = async (categoryId: string): Promise<void> => {
  await db("category").where({ id: categoryId }).delete();
};

const getCategoryByName = async (
  categoryName: string
): Promise<categoryType | undefined> => {
  return db("category").where({ name: categoryName }).first();
};

export default {
  addNewCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryByName,
};
