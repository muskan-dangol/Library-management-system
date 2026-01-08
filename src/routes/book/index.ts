import express from "express";
import * as bookController from "../../controllers/books";

import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("image"), bookController.addNewBook);
router.get("/", bookController.getAllBooks);
router.post("/search", bookController.getBooksAfterSearchAndFilter);
router.get("/:bookId", bookController.getBookById);
router.patch("/:bookId", bookController.updateBookById);
router.delete("/:bookId", bookController.deleteBookById);
router.get("/category/:categoryId", bookController.getBooksByCategoryId);

export { router };
