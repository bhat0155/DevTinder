const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/connectionRequest", userAuth, (req, res) => {
  const user = req.user;
  res.send(user.firstName + " just sent the connection request");
});

module.exports = requestRouter;
