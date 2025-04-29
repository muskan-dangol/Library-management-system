import db from "../../database/db";
import { ReservationType } from "./types";

const addReservation = (
  reqPayload: Partial<ReservationType>
): Promise<ReservationType[]> => {
  return db("reservation").insert(reqPayload).returning("*");
};

const getReservationById = (
  reservationId: string
): Promise<ReservationType | undefined> => {
  return db("reservation").where({ id: reservationId }).first();
};

const getReservationsByUserId = (
  userId: string
): Promise<ReservationType[]> => {
  return db("reservation")
    .select(
      "reservation.id",
      "book.title",
      "book.author",
      "book.release_date",
      "book.short_description",
      "book.image",
      "reservation.quantity",
      "reservation.status",
      "reservation.return_date",
      "reservation.start_date",
      "reservation.end_date"
    )
    .innerJoin("book", "reservation.book_id", "book.id")
    .where({ user_id: userId });
};

const getReservationsByBookId = (
  bookId: string
): Promise<ReservationType[]> => {
  return db("reservation")
    .select(
      "reservation.id",
      "book.title",
      "book.author",
      "book.release_date",
      "book.short_description",
      "book.image",
      "reservation.quantity",
      "reservation.status",
      "reservation.user_id",
      "reservation.start_date",
      "reservation.end_date"
    )
    .innerJoin("book", "reservation.book_id", "book.id")
    .where({ book_id: bookId, status: "loaned" });
};

const updateReservation = async (
  reservationId: string,
  payload: Partial<ReservationType>
): Promise<void> => {
  await db("reservation").where({ id: reservationId }).update(payload);
};

export default {
  addReservation,
  getReservationById,
  getReservationsByUserId,
  getReservationsByBookId,
  updateReservation,
};
