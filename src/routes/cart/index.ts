import express from "express";
import * as cartController from "../../controllers/cart";

const router = express.Router();

router.post("/", cartController.addCart);
router.get("/:userId", cartController.getAllCartsByUserId);
router.get("/active/:userId", cartController.getActiveCartByUserId);
router.patch("/:userId", cartController.updateCart);

export { router };
