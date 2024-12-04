const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateSignUp } = require("../utils/validate");
const bcrypt = require("bcrypt");

authRouter.post("/login", async (req, res) => {
  // checking if user with email id exist
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid email");
    }

    const token = await user.getJWT();
    res.cookie("token", token);

    const authenticatedPw = await user.comparePassword(password);
    console.log({ authenticatedPw });
    // const authenticatedPw = await bcrypt.compare(password, user.password);
    if (!authenticatedPw) {
      throw new Error("Invalid password");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(401).send(err.message);
  }
});

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUp(req);

    const { firstName, lastName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log({ hashedPassword });

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });


    const savedUser = await newUser.save();

    const token = await savedUser.getJWT();
    res.cookie("token", token);
    res.json({ message: "User successfully saved", data: savedUser });
  } catch (err) {
    res.send(err.message);
  }
});

authRouter.post("/logout", userAuth, (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  const user = req.user;
  console.log(user);
  res.send(`${user.firstName} successfully signed out`);
});

module.exports = authRouter;
