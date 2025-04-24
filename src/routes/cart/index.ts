import express from "express";
import * as cartController from "../../controllers/cart";

const router = express.Router();

router.get("/:userId", cartController.getCartByUserId);
router.post("/", cartController.addCart);
router.patch("/:userId", cartController.updateCart);

export { router };
