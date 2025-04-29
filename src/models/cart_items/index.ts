import db from "../../database/db";
import { CartItemType } from "./types";

const addCartItem = (
  reqPayload: Partial<CartItemType>
): Promise<CartItemType[]> => {
  return db("cart_item").insert(reqPayload).returning("*");
};

const getCartItemsByCartId = (cartId: string): Promise<CartItemType[]> => {
  return db("cart_item")
    .select(
      "book.title",
      "book.author",
      "book.release_date",
      "book.available",
      "book.short_description",
      "book.long_description",
      "book.image",
      "cart_item.cart_id",
      "cart_item.quantity",
      "cart_item.book_id",
      "cart_item.created_on",
      "cart_item.updated_on"
    )
    .innerJoin("book", "book.id", "cart_item.book_id")
    .innerJoin("cart", "cart.id", "cart_item.cart_id")
    .where({ cart_id: cartId })
    .andWhere({ enabled: true });
};

const getCartItemByBookId = (
  bookId: string
): Promise<CartItemType | undefined> => {
  return db("cart_item")
    .select(
      "book.title",
      "book.author",
      "book.release_date",
      "book.available",
      "book.short_description",
      "book.long_description",
      "book.image",
      "cart_item.cart_id",
      "cart_item.quantity",
      "cart_item.book_id",
      "cart_item.created_on",
      "cart_item.updated_on"
    )
    .innerJoin("book", "book.id", "cart_item.book_id")
    .where({ book_id: bookId })
    .first();
};

const updateCartItemByBookId = async (
  bookId: string,
  reqPayload: Partial<CartItemType>
): Promise<void> => {
  await db("cart_item").where({ book_id: bookId }).update(reqPayload);
};

export default {
  addCartItem,
  getCartItemsByCartId,
  getCartItemByBookId,
  updateCartItemByBookId,
};
