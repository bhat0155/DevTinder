const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const theCurrentUser = req.user;

    res.send(theCurrentUser);

    console.log(_id);
  } catch (err) {
    res.send(err);
  }
});

profileRouter.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  const ALLOWED_UPDATES = ["firstName", "lastName", "gender", "photoURL"];

  try {
    const updatedChanges = Object.keys(req.body).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    const whomToUpdate = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedChanges) {
      throw new Error("Only firstName, lastName, gender can be changed");
    }
    if (!whomToUpdate) {
      res.send("the user does not exist");
    }

    if (whomToUpdate.length == 0) {
      console.log("no updated user");
    }
    res.send("the user is updated");
  } catch (err) {
    res.send(err.message);
  }
});

profileRouter.post("/replace", async (req, res) => {
  const data = {
    ...req.body,
  };
  const replaced = await User.findOneAndReplace(
    { firstName: req.body.firstName },
    data,
    { new: true }
  );
  console.log({ replaced });
  if (!replaced) {
    res.send("the person could not be found");
  }

  try {
    await replaced.save();
    res.send("the person is replaced");
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = profileRouter;
