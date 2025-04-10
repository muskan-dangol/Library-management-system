import bcrypt from "bcryptjs";

export const getHashedPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const matchPassword = async (password: string, hashPassword: string) => {
  const match = await bcrypt.compare(password, hashPassword);
  return match;
};
