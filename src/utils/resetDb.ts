import db from "../database/db";

const resetUsers = async (): Promise<void> => {
  await db("user").del('*')
};

export const resetDb = async()=>{
  await resetUsers()
}

export const destroyDb = async()=>{
  await db.destroy()
}
