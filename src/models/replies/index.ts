import db from "../../database/db";
import { ReplyType } from "./types";

const addReply = (reqpayload: Partial<ReplyType>): Promise<ReplyType[]> => {
  return db("reply").insert(reqpayload).returning("*");
};

const getAllReplies = (): Promise<ReplyType[]> => {
  return db("reply").select("*");
};

const getReplyByUserId = (userId: string): Promise<ReplyType | undefined> => {
  return db("reply").where({ user_id: userId }).first();
};

const getRepliesByReviewId = (
  reviewId: string
): Promise<ReplyType | undefined> => {
  return db("reply").where({ review_id: reviewId }).first();
};

const updateReply = async (
  reviewId: string,
  reqpayload: Partial<ReplyType>
): Promise<void> => {
  await db("reply").where({ review_id: reviewId }).update(reqpayload);;
};

const deleteReply = async (reviewId: string): Promise<void> => {
  await db("reply").where({ review_id: reviewId }).delete();
};

export default {
  addReply,
  getAllReplies,
  getReplyByUserId,
  getRepliesByReviewId,
  updateReply,
  deleteReply,
};
