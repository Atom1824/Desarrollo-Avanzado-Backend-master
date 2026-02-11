import { Router } from "express";
import passport from "passport";
import { isValidPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import { userDBManager } from "../dao/userDBManager.js";
import { CurrentUserDTO } from "../dto/currentUserDTO.js";

const router = Router();
const UserService = new userDBManager();

import { createHash } from "../utils/bcrypt.js";

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  const exists = await UserService.getUserByEmail(email);
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

  await UserService.createUser(newUser);

  res.send({ status: "success", message: "User registered" });
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserService.getUserByEmail(email);
  if (!user || !isValidPassword(password, user)) {
    return res.status(401).send({ error: "Invalid credentials" });
  }

  const token = generateToken(user);

  res
    .cookie("token", token, { httpOnly: true })
    .send({ status: "success" });
});

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    res.send({
      user: CurrentUserDTO.fromModel(req.user)
    });
  }
);

export default router;
