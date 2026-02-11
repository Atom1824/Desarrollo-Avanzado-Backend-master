import passport from "passport";
import jwt from "passport-jwt";
import { userDBManager } from "../dao/userDBManager.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const UserService = new userDBManager();

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token;
  }
  return token;
};

export const initializePassport = () => {
  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "coderSecret"
      },
      async (jwt_payload, done) => {
        try {
          const user = await UserService.getUserByID(jwt_payload.id);
          if (!user) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
