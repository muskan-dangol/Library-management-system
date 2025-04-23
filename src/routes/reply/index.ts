import express from "express";
import * as replyController from "../../controllers/reply";

const router = express.Router();

router.post("/", replyController.addReply);
router.get("/", replyController.getAllReplies);
router.get("/:reviewId", replyController.getRepliesByReviewId);
router.get("/user/:userId", replyController.getReplyByUserId);
router.patch("/:reviewId", replyController.updateReply);
router.delete("/:reviewId", replyController.deleteReply);

export { router };
