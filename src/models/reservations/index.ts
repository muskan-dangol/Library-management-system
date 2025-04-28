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
  return db("reservation").where({ user_id: userId });
};

const getReservationsByBookId = (
  bookId: string
): Promise<ReservationType[]> => {
  return db("reservation").where({ book_id: bookId });
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
