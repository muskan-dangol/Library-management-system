import express from "express";

import { router as authRouter } from "./auth";
import { router as userRouter } from "./user";
import { router as bookRouter } from "./book";
import { router as categoryRouter } from "./category";
import { router as cartRouter } from "./cart";
import { router as cartItemRouter } from "./cart_item";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Success",
  });
});

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/books", bookRouter);
router.use("/categories", categoryRouter);
router.use("/cart", cartRouter);
router.use("/cart-item", cartItemRouter);

export default router;
