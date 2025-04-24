import { Request, Response, NextFunction } from "express";
import CartItem from "../../models/cart_items";

const getAllCartItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cartItem = await CartItem.getAllCartItems();

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

      await CartItem.updateCartItem(cartItemExists.book_id, {
        quantity: updatedCartItem,
        updated_on: new Date(),
      });
      res.status(200).json(updatedCartItem);
      return;
    }

    await CartItem.addCartItem({
      cart_id,
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
    const { bookId } = req.params;
    const payload = req.body;
    
    const cartItemExists = await CartItem.getCartItemByBookId(bookId);

    if (!cartItemExists) {
      res.status(404).json({ error: "cart item not found!" });
      return;
    }

    await CartItem.updateCartItem(bookId, payload);

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
    const { bookId } = req.params;

    const cartItemExists = await CartItem.getCartItemByBookId(bookId);

    if (!cartItemExists) {
      res.status(404).json({ error: "cart item not found!" });
      return;
    }

    await CartItem.deleteCartItem(bookId);

    res.status(200).json({ message: "cart item deleted successfuly!" });
  } catch (error) {
    next(error);
  }
};

export {
  getAllCartItems,
  getCartItemByBookId,
  addCartItem,
  updateCartItem,
  deleteCartItem,
};
