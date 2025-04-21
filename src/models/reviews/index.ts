import db from "../../database/db";
import { ReviewType } from "./types";

const addReview = (reqPayload: Partial<ReviewType>): Promise<ReviewType[]> => {
  return db("review").insert(reqPayload).returning("*");
};

const getAllReviews = (): Promise<ReviewType[]> => {
  return db("review").select("*");
};

const getReviewById = (reviewId: string): Promise<ReviewType | undefined> => {
  return db("review").where({ id: reviewId }).first();
};

const getReviewsByBookId = (bookId: string): Promise<ReviewType | undefined> => {
  return db("review").where({ book_id: bookId }).first();
};

const getReviewsByUserId = (userId: string): Promise<ReviewType | undefined> => {
  return db("review").where({ user_id: userId }).first();
};

const updateReview = async (
  payload: Partial<ReviewType>,
  reviewId: string
): Promise<void> => {
  await db("review").where({ id: reviewId }).update(payload);
};

const deleteReview = async (reviewId: string): Promise<void> => {
  return db("review").where({ id: reviewId }).delete();
};

export default {
  addReview,
  getAllReviews,
  getReviewById,
  getReviewsByBookId,
  getReviewsByUserId,
  updateReview,
  deleteReview,
};
