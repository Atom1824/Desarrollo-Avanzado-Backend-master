import { Router } from "express";
import passport from "passport";
import { UserModel } from "../models/user.model.js";
import { isValidPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

const router = Router();

import { createHash } from "../utils/bcrypt.js";

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  const exists = await UserModel.findOne({ email });
  if (exists) {
    return res.status(400).send({ error: "User already exists" });
  }

  const newUser = {
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
    role: "user"
  };

  await UserModel.create(newUser);

  res.send({ status: "success", message: "User registered" });
});


// 🔐 LOGIN → genera JWT y lo guarda en cookie
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user || !isValidPassword(password, user)) {
    return res.status(401).send({ error: "Invalid credentials" });
  }

  const token = generateToken(user);

  res
    .cookie("token", token, { httpOnly: true })
    .send({ status: "success" });
});

// 🟢 CURRENT → DEVUELVE USUARIO AUTENTICADO
router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    res.send({
      user: {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        role: req.user.role
      }
    });
  }
);

export default router;
