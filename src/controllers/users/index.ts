import { Request, Response, NextFunction } from "express";
import User from "../../models/users";
import Cart from "../../models/carts";
import { getHashedPassword } from "../../utils/passwordHelper";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const user = await User.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, firstname, lastname, password } = req.body;

    if (!(email && firstname && lastname && password)) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const userExists = await User.isEmailExists(email);

    if (userExists) {
      res.status(400).json({ error: "user already exists!" });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        error: "Password must be at least 8 characters long",
      });
      return;
    }

    const hashedPassword = await getHashedPassword(password);

    const [newUser] = await User.createUser({
      email,
      firstname,
      lastname,
      password: hashedPassword,
    });
    await Cart.addCart(newUser.id);

    res.status(200).json({ data: "User created successfully!" });
  } catch (error) {
    console.error("create new user error:", error);
    next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const payload = req.body;

    const userExists = await User.getUserById(userId);
    if (!userExists) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await User.updateUser(userId, payload);

    res.status(200).json({ data: "User updated successfully!" });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const userExists = await User.getUserById(userId);
    if (!userExists) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await User.deleteUser(userId);

    res.status(200).json({ data: "User deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
