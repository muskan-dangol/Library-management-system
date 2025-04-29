import express from "express";
import * as cartController from "../../controllers/cart";

const router = express.Router();

router.get("/:userId", cartController.getActiveCartByUserId);

export { router };
