import db from "../database/db";

const resetUsers = async (): Promise<void> => {
  await db("user").del("*");
};

const resetBooks = async (): Promise<void> => {
  await db("book").del("*");
};

const reserCategories = async (): Promise<void> => {
  await db("category").del("*");
};

const resetCart = async (): Promise<void> => {
  await db("cart").del("*");
};

export const resetDb = async () => {
  await resetUsers();
  await resetBooks();
  await reserCategories();
  await resetCart();
};

export const destroyDb = async () => {
  await db.destroy();
};
