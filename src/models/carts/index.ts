import db from "../../database/db";
import { CartType } from "./types";

const addCart = (user_id: string): Promise<CartType[]> => {
  return db("cart").insert({ user_id }).returning("*");
};

const getAllCartsByUserId = (userId: string): Promise<CartType[]> => {
  return db("cart").where({ user_id: userId });
};

const getActiveCartByUserId = (
  userId: string
): Promise<CartType | undefined> => {
  return db("cart").where({ user_id: userId, enabled: true }).first();
};

const updateCart = async (
  userId: string,
  payload: Partial<CartType>
): Promise<void> => {
  await db("cart").where({ user_id: userId }).update(payload);
};

export default {
  addCart,
  getAllCartsByUserId,
  getActiveCartByUserId,
  updateCart,
};
