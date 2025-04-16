import db from "../../database/db";
import { CartType } from "./types";

const addCart = (userId: Partial<CartType>): Promise<CartType[]> => {
  return db("cart").insert({ user_id: userId }).returning("*");
};

const getCart = (): Promise<CartType[]> => {
  return db("cart").select("*");
};

const getCartByUserId = (userId: string): Promise<CartType[]> => {
  return db("cart").where({ user_id: userId }).first();
};

const deleteCart = async (userId: string): Promise<void> => {
  await db("cart").where({ user_id: userId }).delete();
};

export default { addCart, getCart, getCartByUserId, deleteCart };
