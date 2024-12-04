const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEdit, validatePassword } = require("../utils/validate");
const bcrypt=require("bcrypt")

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const theCurrentUser = req.user;

    res.send(theCurrentUser);

    // console.log(_id);
  } catch (err) {
    res.status(401).send(`error in profile: ${err}`);
  }
});

profileRouter.patch(
  "/profile/edit",
  validateProfileEdit,
  userAuth,
  async (req, res) => {
    try {
      // loop through the keys and update the new values
      const user = req.user;
      console.log({ user });
      Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
      await user.save();
      // res.json({data:user});

    res.json({
      message: `${user.firstName}, your profile updated successfuly`,
      data: user,
    });
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

profileRouter.patch(
  "/profile/password",
  userAuth,
  validatePassword,
  async (req, res) => {
    try {
      const user = req.user;
    //   user.password = req.body.password;
    const hashedPw= await bcrypt.hash(req.body.password, 10)
    user.password=hashedPw;

      await user.save();
      console.log({userPw: user})
      res.send(`Password updated for ${user.firstName}`)
    } catch (err) {
      res.send(err.message);
    }
  }
);

module.exports = profileRouter;
