import db from "../../database/db";
import { CartItemType } from "./types";

const addCartItem = (
  reqPayload: Partial<CartItemType>
): Promise<CartItemType[]> => {
  return db("cart_item").insert(reqPayload).returning("*");
};

const getAllCartItems = (): Promise<CartItemType[]> => {
  return db("cart_item").select("*");
};

const getCartItemByBookId = (
  bookId: string
): Promise<CartItemType | undefined> => {
  return db("cart_item").where({ book_id: bookId }).first();
};

const updateCartItem = async (
  bookId: string,
  reqPayload: Partial<CartItemType>
): Promise<void> => {
  await db("cart_item").where({ book_id: bookId }).update(reqPayload);
};

const deleteCartItem = async (bookId: string): Promise<void> => {
  await db("cart_item").where({ book_id: bookId }).delete();
};

export default {
  addCartItem,
  getAllCartItems,
  getCartItemByBookId,
  updateCartItem,
  deleteCartItem,
};
