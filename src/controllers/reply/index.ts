import { Request, Response, NextFunction } from "express";
import Reply from "../../models/replies";

const getAllReplies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const replies = await Reply.getAllReplies();

    res.status(200).json(replies);
  } catch (error) {
    next(error);
  }
};

const getRepliesByReviewId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reviewId } = req.params;

    const replies = await Reply.getRepliesByReviewId(reviewId);

    if (!replies) {
      res.status(404).json({ error: "replies not found!" });
      return;
    }

    res.status(200).json(replies);
  } catch (error) {
    next(error);
  }
};

const getReplyByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const reply = await Reply.getReplyByUserId(userId);

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
    const { ...payload } = req.body;
    const { user_id, review_id, comment } = payload;

    if (!user_id) {
      res.status(400).json({ error: "sign up before replying!" });
      return;
    }

    if (!review_id) {
      res.status(404).json({ error: "review not found to add reply!" });
      return;
    }

    if (!comment) {
      res.status(400).json({ error: "comment cannot be null!" });
      return;
    }

    const reply = await Reply.addReply(payload);
    res.status(201).json(reply);
  } catch (error) {
    next(error);
  }
};

const updateReply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = req.params;
    const comment = req.body;

    const replyExists = await Reply.getRepliesByReviewId(reviewId);

    if (!replyExists) {
      res.status(404).json({ error: "review not found!" });
      return;
    }

    await Reply.updateReply(reviewId, comment);

    res.status(200).json({ message: "reply updated successfully!" });
  } catch (error) {
    next(error);
  }
};

const deleteReply = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reviewId } = req.params;

    if (!reviewId) {
      res.status(404).json({ error: "review not found!" });
      return;
    }

    await Reply.deleteReply(reviewId);
    res.status(200).json({ message: "reply deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export {
  getAllReplies,
  getRepliesByReviewId,
  getReplyByUserId,
  addReply,
  updateReply,
  deleteReply,
};
