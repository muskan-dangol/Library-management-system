import { Request, Response, NextFunction } from "express";
import Cart from "../../models/carts";

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await Cart.getCart();

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

const getCartByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.getCartByUserId(userId);

    if (!cart) {
      res.status(404).json({ error: "cart not found!" });
      return;
    }

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

const addCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      res.status(400).json({ error: "userId is required!" });
      return;
    }

    const cartExists = await Cart.getCartByUserId(user_id);

    if (cartExists) {
      res.status(400).json({ error: "cart already exists!" });
      return;
    }

    const cart = await Cart.addCart(user_id);

    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};

const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    
    const cartExists = await Cart.getCartByUserId(userId);

    if (!cartExists) {
      res.status(404).json({ error: "Cart not found!" });
      return;
    }

    await Cart.deleteCart(userId);
    res.status(200).json({ message: "deleted cart successfully!" });
  } catch (error) {}
};

export { getCart, getCartByUserId, addCart, deleteCart };
