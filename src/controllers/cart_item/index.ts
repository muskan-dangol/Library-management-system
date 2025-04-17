import { Request, Response, NextFunction } from "express";
import CartItem from "../../models/cart_items";

const getCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cartItem = await CartItem.getAllCartItems();

    res.status(200).json(cartItem);
  } catch (error) {
    next(error);
  }
};

const getCartItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cartItemId } = req.params;

    const cartItem = await CartItem.getCartItemById(cartItemId);

    if (!cartItem) {
      res.status(404).json({ error: "cart item not found!" });
      return;
    }

    res.status(200).json(cartItem);
  } catch (error) {
    next(error);
  }
};

const getCartItemByBookId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId } = req.params;

    const cartItem = await CartItem.getCartItemByBookId(bookId);

    if (!cartItem) {
      res.status(404).json({ error: "cart item not found!" });
      return;
    }

    res.status(200).json(cartItem);
  } catch (error) {
    next(error);
  }
};

const addCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, book_id } = req.body;

    if (!user_id) {
      res.status(400).json({ error: "signUp before adding items in cart!" });
      return;
    }

    if (!book_id) {
      res.status(400).json({ error: "book not found!" });
      return;
    }

    const cartItemExists = await CartItem.getCartItemByBookId(book_id);
    if (cartItemExists) {
      const updatedCartItem = cartItemExists.quantity + 1;

      await CartItem.updateCartItem(cartItemExists.id, {
        quantity: updatedCartItem,
        updated_on: new Date(),
      });
      res.status(200).json(updatedCartItem);
      return;
    }

    await CartItem.addCartItem({
      user_id,
      book_id,
    });

    res.status(201).json({ message: "Item added to cart!" });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cartItemId } = req.params;

    const payload = req.body;
    const cartItemExists = await CartItem.getCartItemById(cartItemId);

    if (!cartItemExists) {
      res.status(404).json({ error: "cart item not found!" });
      return;
    }

    await CartItem.updateCartItem(cartItemId, payload);

    res.status(200).json({ message: "cart item updated successfully!" });
  } catch (error) {
    next(error);
  }
};

const deleteCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cartItemId } = req.params;

    const cartItemExists = await CartItem.getCartItemById(cartItemId);

    if (!cartItemExists) {
      res.status(404).json({ error: "cart item not found!" });
      return;
    }

    await CartItem.deleteCartItem(cartItemId);

    res.status(200).json({ message: "cart item deleted successfuly!" });
  } catch (error) {
    next(error);
  }
};

export {
  getCartItem,
  getCartItemById,
  getCartItemByBookId,
  addCartItem,
  updateCartItem,
  deleteCartItem,
};
