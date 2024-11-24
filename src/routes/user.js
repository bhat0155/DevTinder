const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connection = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName photoURL age gender about skills ";
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log({ loggedInUser });

    const validateRequests = await connection
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "data fetched successfully",
      data: validateRequests,
    });
  } catch (err) {
    res.send(err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const validRequest = await connection
      .find({
        $or: [
          {
            toUserId: loggedInUser._id,
          },
          {
            fromUserId: loggedInUser._id,
          },
        ],
        status: "accepted",
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = validRequest.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    if (!validRequest) {
      throw new Error("Connection not found in DB");
    }

    res.json({
      message: `showing all your ${validRequest.length} connections`,
      esb: data,
    });
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = userRouter;
