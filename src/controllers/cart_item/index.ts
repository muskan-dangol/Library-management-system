import { Request, Response, NextFunction } from "express";
import CartItem from "../../models/cart_items";

const getCartItemsByCartId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cartId } = req.params;

    const cartItems = await CartItem.getCartItemsByCartId(cartId);

    res.status(200).json(cartItems);
  } catch (error) {
    next(error);
  }
};

const upsertCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cart_id, book_id } = req.body;

    if (!cart_id) {
      res.status(400).json({ error: "cart id is required!" });
      return;
    }

    if (!book_id) {
      res.status(400).json({ error: "book id is required!" });
      return;
    }

    const cartItemExists = await CartItem.getCartItemByBookId(book_id);
    if (cartItemExists) {
      const updatedCartItem = cartItemExists.quantity + 1;
      await CartItem.updateCartItemByBookId(cartItemExists.book_id, {
        quantity: updatedCartItem,
        updated_on: new Date(),
      });
    } else {
      await CartItem.addCartItem({
        cart_id,
        book_id,
      });
    }

    res.status(200).json({ message: "Item added to cart!" });
  } catch (error) {
    next(error);
  }
};

export { getCartItemsByCartId, upsertCartItem };
