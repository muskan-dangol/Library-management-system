import express from "express";
import * as reservationController from "../../controllers/reservation";

const router = express.Router();

router.post("/", reservationController.addReservation);
router.get("/user/:userId", reservationController.getReservationsByUserId);
router.get("/book/:bookId", reservationController.getReservationsByBookId);
router.patch("/:reservationId", reservationController.updateReservation);

export { router };
