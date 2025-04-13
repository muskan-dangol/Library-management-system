import express from "express";
import * as categoryController from "../../controllers/category";

const router = express.Router();

router.post("/", categoryController.addNewCategory);
router.get("/", categoryController.getAllCategory);
router.get("/:categoryId", categoryController.getCategoryById);
router.patch("/:categoryId", categoryController.updateCategory);
router.delete("/:categoryId", categoryController.deleteCategory);

export { router };
