import { Request, Response, NextFunction } from "express";
import Review from "../../models/reviews";
import User from "../../models/users";
import Book from "../../models/books";

const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviews = await Review.getAllReviews();

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

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

    if (!reviews) {
      res.status(404).json({ error: "review not found!" });
      return;
    }

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

    if (!reviews) {
      res.status(404).json({ error: "reviews not found!" });
      return;
    }

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

const addReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ...payload } = req.body;
    const { user_id, book_id, comment, rating } = payload;

    const user = await User.getUserById(user_id);
    const book = await Book.getBookById(book_id);
    if (!(user_id && user)) {
      res.status(400).json({ error: "signUp before adding review" });
      return;
    }

    if (!(book_id && book)) {
      res.status(404).json({ error: "book not found!" });
      return;
    }

    if (!comment && !rating) {
      res.status(400).json({ error: "missing review!" });
      return;
    }

    const reviewExists = await Review.getReviewsByUserId(user_id);

    if (reviewExists && (reviewExists.book_id === book_id)) {
      const existingReviewId = reviewExists.id;
      await Review.updateReview(payload, existingReviewId);

      res.status(200).json({message: "updated existing review!"});
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
    const { ...payload } = req.body;
    const { reviewId } = req.params;

    const { comment, rating } = payload;
    
    if (!comment && !rating) {
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
  getAllReviews,
  getReviewById,
  getReviewsByUserId,
  getReviewsByBookId,
  addReview,
  updateReview,
  deleteReview,
};
