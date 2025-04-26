import { Request, Response, NextFunction } from "express";
import Review from "../../models/reviews";

const getReviewById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.getReviewById(reviewId);

    if (!review) {
      res.status(404).json({ error: "review not found!" });
      return;
    }

    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};

const getReviewsByBookId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId } = req.params;

    const reviews = await Review.getReviewsByBookId(bookId);

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

const getReviewsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.getReviewsByUserId(userId);

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

const addReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, book_id, comment, rating } = req.body;

    if (!user_id) {
      res.status(400).json({ error: "user_id is required!" });
      return;
    }

    if (!book_id) {
      res.status(400).json({ error: "book_id is required!" });
      return;
    }

    if (!comment && !rating) {
      res.status(400).json({ error: "missing review!" });
      return;
    }

    const review = await Review.addReview({
      user_id,
      book_id,
      comment,
      rating,
    });
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const { reviewId } = req.params;

    if (!(payload.comment && payload.rating)) {
      res.status(400).json({ error: "missing review!" });
      return;
    }

    const reviewExists = await Review.getReviewById(reviewId);

    if (!reviewExists) {
      res.status(404).json({ error: "review not found!" });
      return;
    }

    await Review.updateReview(payload, reviewId);
    res.status(200).json({ message: "review updated successfully!" });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.getReviewById(reviewId);

    if (!review) {
      res.status(404).json({ error: "review not found!" });
      return;
    }

    await Review.deleteReview(reviewId);
    res.status(200).json({ message: "review deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export {
  getReviewById,
  getReviewsByUserId,
  getReviewsByBookId,
  addReview,
  updateReview,
  deleteReview,
};
