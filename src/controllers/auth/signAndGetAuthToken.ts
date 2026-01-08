import jwt from "jsonwebtoken";
import { format } from "date-fns";
import { UserType } from "../../models/users/types";

export const signAndGetAuthToken = (user: UserType) => {
  const token = jwt.sign(
    {
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.is_admin,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    },
    process.env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: "12h",
    }
  );

  const authTokenPayload = {
    last_logged_in: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    token: token,
  };
  return authTokenPayload;
};
