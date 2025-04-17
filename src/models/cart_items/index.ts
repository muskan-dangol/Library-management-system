import db from "../../database/db";
import { categoryType } from "../categories/types";
import { CartItemType } from "./types";

const addCartItem = (
  reqPayload: Partial<CartItemType>
): Promise<CartItemType[]> => {
  return db("cart_item").insert(reqPayload).returning("*");
};

const getAllCartItems = (): Promise<CartItemType[]> => {
  return db("cart_item").select("*");
};

const getCartItemById = (
  cartItemId: string
): Promise<CartItemType | undefined> => {
  return db("cart_item").where({ id: cartItemId }).first();
};

const getCartItemByBookId = (
  bookId: string
): Promise<CartItemType | undefined> => {
  return db("cart_item").where({ book_id: bookId }).first();
};

const updateCartItem = async (
  cartItemId: string,
  reqPayload: Partial<CartItemType>
): Promise<void> => {
  await db("cart_item").where({ id: cartItemId }).update(reqPayload);
};

const deleteCartItem = async (cartItemId: string): Promise<void> => {
  await db("cart_item").where({ id: cartItemId }).delete();
};

export default {
  addCartItem,
  getAllCartItems,
  getCartItemById,
  getCartItemByBookId,
  updateCartItem,
  deleteCartItem,
};
