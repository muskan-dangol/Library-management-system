import express from "express";
import * as replyController from "../../controllers/reply";

const router = express.Router();

router.post("/", replyController.addReply);
router.get("/review/:reviewId", replyController.getRepliesByReviewId);
router.get("/:replyId", replyController.getReplyById);
router.patch("/:replyId", replyController.updateReply);
router.delete("/:replyId", replyController.deleteReply);

export { router };
