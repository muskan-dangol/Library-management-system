import passport from "passport";
import { isBefore, isEqual } from 'date-fns';
import { Strategy as localStrategy } from "passport-local";
import { Strategy as JWTstrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import User from "../../models/users";
import { matchPassword } from "../../utils/passwordHelper";


interface JwtPayload {
  exp: number;
  user: { id: string };
}

// Passport middleware to handle user registration
passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        if (!email) {
          return done(null, false, { message: "Email is required!" });
        }
        if (!password) {
          return done(null, false, { message: "Password is required!" });
        }

        const userExists = await User.isEmailExists(email);
        
        if (userExists) {
          return done(null, false, { message: "User exists already!" });
        }
        return done(null, true);
      } catch (error) {
        return done(error, false, { message: "Signup failed" });
      }
    }
  )
);

// Passport middleware to handle User login
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        if (!email) {
          return done(null, false, { message: "Email is required!" });
        }
        if (!password) {
          return done(null, false, { message: "Password is required!" });
        }

        const userRes = await User.getUserByEmail(email);
        if (!userRes) {
          return done(null, false, { message: "User does not exist!" });
        }

        const isPasswordMatch = await matchPassword(password, userRes.password);

        if (!isPasswordMatch) {
          return done(null, false, { message: "Incorrect password!" });
        }

        return done(null, userRes);
      } catch (error) {
        return done(error, false, { message: "login failed" });
      }
    }
  )
);

// This verifies that the token sent by the user is valid
passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET as string,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (token: JwtPayload, done) => {
      try {
        const { exp, user } = token;
        if (isBefore(new Date(exp * 1000), new Date()) || isEqual(new Date(exp * 1000), new Date())) {
          return done(null, false, { message: "Token expired!" });
        }
        if (!user.id) {
          return done(null, false, { message: "Invalid token!" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
