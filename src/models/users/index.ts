import db from "../../database/db";
import { UserType } from "./types";

const createUser = (reqPayload: Partial<UserType>): Promise<UserType[]> => {
  return db("user")
    .insert(reqPayload)
    .returning("*")
    .onConflict("email")
    .ignore();
};

const getAllUsers = async (): Promise<UserType[]> => {
  return db("user").select("*");
};

const updateUser = async(id: string, reqPayload: Partial<UserType>): Promise<void> => {
  await db("user").where({ id: id }).update(reqPayload);
};

const deleteUser = async(userId: string): Promise<void> => {
  await db("user").where({ id: userId }).delete();
};

const getUserById = (id: string): Promise<Omit<UserType, 'password'> | undefined> => {
  return db("user")
    .select("id", "email", "firstname", "lastname", "is_admin", "created_on")
    .where({ id })
    .first();
};

const getUserByEmail = (email: string): Promise<UserType> => {
  return db("user").select().where({ email }).first();
};

const isEmailExists = async (email: string): Promise<boolean> => {
  const data = await getUserByEmail(email);
  return !!data
};

export default {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
  getUserByEmail,
  isEmailExists,
};
