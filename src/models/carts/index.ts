import db from "../../database/db";
import { CartType } from "./types";

const addCart = (userId: string): Promise<CartType[]> => {
  return db("cart").insert({ user_id: userId }).returning("*");
};

const getActiveCartByUserId = (
  userId: string
): Promise<CartType | undefined> => {
  return db("cart").where({ user_id: userId, enabled: true }).first();
};

export default {
  addCart,
  getActiveCartByUserId,
};
