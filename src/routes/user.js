const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connection = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName photoURL age gender about skills ";
const User=require("../models/user")

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

userRouter.get("/feed", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  let limit=parseInt(req.query.limit)||3;
  limit= limit>50?50:limit;
  const page= parseInt(req.query.page) ||1;
  const skip= (page-1)*limit;

  try {
    // getting all the ids which user sent req to or received req from

    const connectionRequests = await connection
      .find({
        $or: [
          {
            fromUserId: loggedInUser._id,
          },
          {
            toUserId: loggedInUser._id,
          },
        ],
      })
      .select("fromUserId toUserId");

      // creating a set to store these ids in an array
      const hideUsers= new Set();

      // looping over connection requests and adding the ids in hide user
      connectionRequests.forEach((item)=>{
        hideUsers.add(item.fromUserId.toString())
        hideUsers.add(item.toUserId.toString())
      })

      // giving all the ids other than the ones present in hideUsers
      const validIds= await User.find({
        $and:[
            {_id : {$nin: Array.from(hideUsers)}},
            {_id: {$ne: loggedInUser._id}}
        ]

      }).select(USER_SAFE_DATA).skip(skip).limit(limit);

      if (!validIds){
        throw new Error("Feed empty")
      }

      res.json({message:`${validIds.length} results`,
        data: validIds})

  } catch (err) {
    req.send(err.message);
  }
});

module.exports = userRouter;
