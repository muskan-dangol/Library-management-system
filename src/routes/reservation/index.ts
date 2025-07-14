import express from "express";
import * as reservationController from "../../controllers/reservation";

const router = express.Router();

router.post("/", reservationController.addReservation);
router.get("/users/:userId", reservationController.getReservationsByUserId);
router.get("/books/:bookId", reservationController.getReservationsByBookId);
router.patch("/:reservationId", reservationController.updateReservation);

export { router };
