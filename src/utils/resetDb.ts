import db from "../database/db";

const resetUsers = async (): Promise<void> => {
  await db("user").del("*");
};

const resetBooks = async (): Promise<void> => {
  await db("book").del("*");
};

export const resetDb = async () => {
  await resetUsers();
  await resetBooks();
};

export const destroyDb = async () => {
  await db.destroy();
};
