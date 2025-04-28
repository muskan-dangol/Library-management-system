import { Request, Response, NextFunction } from "express";
import Reservation from "../../models/reservations";

const getReservationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reservationId } = req.params;

    const reservation = await Reservation.getReservationById(reservationId);

    if (!reservation) {
      res.status(404).json({ error: "reservation not found!" });
      return;
    }

    res.status(200).json(reservation);
  } catch (error) {
    next(error);
  }
};

const getReservationsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const reservations = await Reservation.getReservationsByUserId(userId);

    res.status(200).json(reservations);
  } catch (error) {
    next(error);
  }
};

const getReservationsByBookId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId } = req.params;

    const reservations = await Reservation.getReservationsByBookId(bookId);

    res.status(200).json(reservations);
  } catch (error) {
    next(error);
  }
};

const addReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id, book_id, cart_id } = req.body;

    if (!(user_id && book_id)) {
      res.status(400).json({ error: "user_id and book_id are required!" });
      return;
    }

    if (!cart_id) {
      res.status(400).json({ error: "cart id is required!" });
    }

    // const 

    const newReservation = await Reservation.addReservation({
      user_id,
      book_id,
      status: "reserved",
    });

    res.status(201).json(newReservation);
  } catch (error) {
    next(error);
  }
};

const updateReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reservationId } = req.params;
    const payload = req.body;

    if (!payload.status) {
      res.status(400).json({ error: "status is required!" });
      return;
    }

    const reservation = await Reservation.getReservationById(reservationId);

    if (!reservation) {
      res.status(404).json({ error: "reservation not found!" });
      return;
    }
    // returned date

    await Reservation.updateReservation(reservationId, payload);

    res.status(200).json({ message: "reservation updated successfully!" });
  } catch (error) {
    next(error);
  }
};

export {
  getReservationById,
  getReservationsByUserId,
  getReservationsByBookId,
  addReservation,
  updateReservation,
};
