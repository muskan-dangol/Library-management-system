import express from "express";
import * as userController from "../../controllers/users";

const router = express.Router();

router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.patch("/:userId", userController.updateUser);
router.delete("/:userId", userController.deleteUser);
router.get("/:userId", userController.getUserById);

export { router };
