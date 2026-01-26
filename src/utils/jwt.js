import jwt from "jsonwebtoken";

const PRIVATE_KEY = "coderSecret"; // usa .env si quieres

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

export const verifyToken = (token) =>
  jwt.verify(token, PRIVATE_KEY);
