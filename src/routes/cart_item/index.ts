import express from "express";
import * as cartItemController from "../../controllers/cart_item";

const router = express.Router();

router.post("/", cartItemController.addCartItem);
router.get("/", cartItemController.getCartItem);
router.get("/book/:bookId", cartItemController.getCartItemByBookId);
router.get("/:cartItemId", cartItemController.getCartItemById);
router.patch("/:cartItemId", cartItemController.updateCartItem);
router.delete("/:cartItemId", cartItemController.deleteCartItem);

export { router };
