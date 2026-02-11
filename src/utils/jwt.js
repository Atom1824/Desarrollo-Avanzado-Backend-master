import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.JWT_SECRET;

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email
    },
    PRIVATE_KEY,
    { expiresIn: "1h" }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, PRIVATE_KEY);
};
