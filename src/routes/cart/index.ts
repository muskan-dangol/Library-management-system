import express from "express";
import * as cartController from "../../controllers/cart";

const router = express.Router();

router.get("/", cartController.getCart);
router.get("/:userId", cartController.getCartByUserId);
router.post("/", cartController.addCart);
router.delete("/:userId", cartController.deleteCart);

export { router };
