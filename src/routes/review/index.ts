import express from "express";
import * as reviewController from "../../controllers/review";

const router = express.Router();

router.post("/", reviewController.addReview);
router.get("/:reviewId", reviewController.getReviewById);
router.get("/book/:bookId", reviewController.getReviewsByBookId);
router.get("/user/:userId", reviewController.getReviewsByUserId);
router.patch("/:reviewId", reviewController.updateReview);
router.delete("/:reviewId", reviewController.deleteReview);

export { router };
