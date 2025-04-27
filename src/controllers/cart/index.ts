import { Request, Response, NextFunction } from "express";
import Cart from "../../models/carts";

const getAllCartsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const carts = await Cart.getAllCartsByUserId(userId);

    if (carts.length === 0) {
      res.status(404).json({ error: "cart not found!" });
      return;
    }

    res.status(200).json(carts);
  } catch (error) {
    next(error);
  }
};

const getActiveCartByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const activeCart = await Cart.getActiveCartByUserId(userId);

    if (!activeCart) {
      res.status(404).json({ error: "no active cart found!" });
    }

    res.status(200).json(activeCart);
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

    const activeCartExists = await Cart.getActiveCartByUserId(user_id);

    if (activeCartExists) {
      res.status(400).json({ error: "cart already exists!" });
      return;
    }

    const cart = await Cart.addCart(user_id);

    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};

const updateCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const payload = req.body;

    if (payload.enabled === "") {
      res.status(400).json({ error: "payload is required" });
      return;
    }

    const cartExists = await Cart.getActiveCartByUserId(userId);

    if (!cartExists) {
      res.status(404).json({ error: "cart not found!" });
      return;
    }

    await Cart.updateCart(userId, payload);
    res.status(200).json({ message: "updated cart successfully!" });
  } catch (error) {}
};

export { getAllCartsByUserId, getActiveCartByUserId, addCart, updateCart };
