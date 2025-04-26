import db from "../../database/db";
import { ReplyType } from "./types";

const addReply = (reqpayload: Partial<ReplyType>): Promise<ReplyType[]> => {
  return db("reply").insert(reqpayload).returning("*");
};

const getReplyById = (replyId: string): Promise<ReplyType | undefined> => {
  return db("reply").where({ id: replyId }).first();
};

const getRepliesByReviewId = (reviewId: string): Promise<ReplyType[]> => {
  return db("reply").where({ review_id: reviewId });
};

const updateReply = async (
  replyId: string,
  reqpayload: Partial<ReplyType>
): Promise<void> => {
  await db("reply").where({ id: replyId }).update(reqpayload);
};

const deleteReply = async (replyId: string): Promise<void> => {
  await db("reply").where({ id: replyId }).delete();
};

export default {
  addReply,
  getReplyById,
  getRepliesByReviewId,
  updateReply,
  deleteReply,
};
