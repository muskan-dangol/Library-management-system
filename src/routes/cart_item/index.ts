import express from "express";
import * as cartItemController from "../../controllers/cart_item";

const router = express.Router();

router.post("/", cartItemController.upsertCartItem);
router.get("/:cartId", cartItemController.getCartItemsByCartId);

export { router };
