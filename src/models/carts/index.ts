import db from "../../database/db";
import { CartType } from "./types";

const addCart = (user_id: string): Promise<CartType[]> => {
  return db("cart").insert({ user_id }).returning("*");
};

const getCartByUserId = (userId: string): Promise<CartType | undefined> => {
  return db("cart").where({ user_id: userId }).first();
};

const updateCart = async (
  userId: string,
  payload: Partial<CartType[]>
): Promise<void> => {
  await db("cart").where({ user_id: userId }).update(payload);
};

export default { addCart, getCartByUserId, updateCart };
