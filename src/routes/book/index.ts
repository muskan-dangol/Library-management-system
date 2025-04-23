import express from "express";
import * as bookController from "../../controllers/books";

const router = express.Router();

router.post("/", bookController.addNewBook);
router.get("/", bookController.getAllBooks);
router.get("/:bookId", bookController.getBookById);
router.patch("/:bookId", bookController.updateBookById);
router.delete("/:bookId", bookController.deleteBookById);
router.get("/category/:categoryId", bookController.getBooksByCategoryId);

export { router };
