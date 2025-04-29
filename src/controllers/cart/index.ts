import { Request, Response, NextFunction } from "express";
import Cart from "../../models/carts";

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
      return;
    }

    res.status(200).json(activeCart);
  } catch (error) {
    next(error);
  }
};

export { getActiveCartByUserId };
