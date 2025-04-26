import { Request, Response, NextFunction } from "express";
import Reply from "../../models/replies";

const getRepliesByReviewId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reviewId } = req.params;

    const replies = await Reply.getRepliesByReviewId(reviewId);

    res.status(200).json(replies);
  } catch (error) {
    next(error);
  }
};

const getReplyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { replyId } = req.params;

    const reply = await Reply.getReplyById(replyId);

    if (!reply) {
      res.status(404).json({ error: "reply not found!" });
      return;
    }

    res.status(200).json(reply);
  } catch (error) {
    next(error);
  }
};

const addReply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, review_id, comment } = req.body;

    if (!user_id) {
      res.status(400).json({ error: "user_id is required!" });
      return;
    }

    if (!review_id) {
      res.status(400).json({ error: "review_id is required!" });
      return;
    }

    if (!comment) {
      res.status(400).json({ error: "comment cannot be empty!" });
      return;
    }

    const reply = await Reply.addReply({
      user_id: user_id,
      review_id: review_id,
      comment: comment,
    });
    res.status(201).json(reply);
  } catch (error) {
    next(error);
  }
};

const updateReply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { replyId } = req.params;
    const reqpayload = req.body;

    const replyExists = await Reply.getReplyById(replyId);

    if (!replyExists) {
      res.status(404).json({ error: "reply not found!" });
      return;
    }

    if (!reqpayload.comment) {
      res.status(400).json({ error: "comment is required!" });
      return;
    }

    await Reply.updateReply(replyId, reqpayload);

    res.status(200).json({ message: "reply updated successfully!" });
  } catch (error) {
    next(error);
  }
};

const deleteReply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { replyId } = req.params;

    const reply = await Reply.getReplyById(replyId);

    if (!reply) {
      res.status(404).json({ error: "reply not found!" });
      return;
    }

    await Reply.deleteReply(replyId);
    res.status(200).json({ message: "reply deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export {
  getRepliesByReviewId,
  getReplyById,
  addReply,
  updateReply,
  deleteReply,
};
