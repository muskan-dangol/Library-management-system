import passport from "passport";
import { getHashedPassword } from "../../utils/passwordHelper";
import User from "../../models/users";
import { Request, Response, NextFunction } from "express";
import { UserType } from "../../models/users/types";
import { signAndGetAuthToken } from "./signAndGetAuthToken";

const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  passport.authenticate(
    "signup",
    { session: false },
    async (err: Error, data: boolean, info: { message?: string }) => {
      try {
        const { email, password, firstname, lastname, is_admin } = req.body;

        if (err) {
          return res.status(500).json({ error: err });
        }

        if (!data) {
          return res.status(400).json({
            error: info.message || "Invalid login data",
          });
        }

        if (!(email && firstname && lastname && password)) {
          res.status(400).json({ error: "All fields are required" });
          return;
        }

        if (password.length < 8) {
          return res.status(400).json({
            error: "Password must be at least 8 characters long",
          });
        }

        const hashedPassword = await getHashedPassword(password);

        const [user] = await User.createUser({
          email,
          password: hashedPassword,
          firstname,
          lastname,
          is_admin,
        });

        const authTokenPayload = signAndGetAuthToken(user);

        res.status(201).json({ token: authTokenPayload.token });
      } catch (e) {
        console.error("Signup error:", e);
        next(e);
      }
    }
  )(req, res, next);
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  passport.authenticate(
    "login",
    { session: false },
    async (err: Error, user: UserType, info: { message?: string }) => {
      try {
        if (err) {
          return res.status(500).json({ error: err });
        }
        if (!user) {
          return res.status(400).json({
            error: info.message || "Invalid login data",
          });
        }

        const authTokenPayload = signAndGetAuthToken(user);

        res.status(200).json(authTokenPayload);
      } catch (e) {
        console.error("Login error:", e);
        next(e);
      }
    }
  )(req, res, next);
};

export { signup, login };
