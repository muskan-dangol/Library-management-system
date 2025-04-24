import express from "express";
import * as cartItemController from "../../controllers/cart_item";

const router = express.Router();

router.post("/", cartItemController.addCartItem);
router.get("/", cartItemController.getAllCartItems);
router.get("/:bookId", cartItemController.getCartItemByBookId);
router.patch("/:bookId", cartItemController.updateCartItem);
router.delete("/:bookId", cartItemController.deleteCartItem);

export { router };
