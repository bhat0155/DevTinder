// const express = require("express");
// const requestRouter = express.Router();
// const { userAuth } = require("../middlewares/auth");
// const ConnectionRequest = require("../models/connectionRequest");
// const User = require("../models/user");

// const sendEmail = require("../utils/sendEmail");

// requestRouter.post(
//   "/connectionRequest/:status/:userId",
//   userAuth,
//   async (req, res) => {
//     try {
//       console.log("1")
//       const status = req.params.status;
//       const userId = req.params.userId;
//       const fromUserId = req.user._id;
//       const toUserId = userId;

//       // only interested and ignored statuses must be allowed

//       const statuses = ["interested", "ignored"];
//       if (!statuses.includes(status)) {
//         throw new Error("only interested and ignored statuses are allowed");
//       }

//       // a person cannot resend the request
//       // and the other party cannot resend to user
//       const invalidRequest = await ConnectionRequest.findOne({
//         $or: [
//           { fromUserId, toUserId },
//           { fromUserId: toUserId, toUserId: fromUserId },
//         ],
//       });
//       if (invalidRequest) {
//         throw new Error(
//           "a person cannot resend the request and other party cannot send the request to user"
//         );
//       }

//       // the toUserID must exist in the database
//       const userExist = await User.findById(toUserId);

//       if (!userExist) {
//         throw new Error("sorry the user does not exist in our database");
//       }

//       // creating an instance
//       const connection = new ConnectionRequest({
//         fromUserId,
//         toUserId,
//         status,
//       });

//       console.log("will be logged before save")
//       await connection.save();
//       console.log("Before calling sendEmail");
//       const emailRes = await sendEmail.run();
//       console.log("After calling sendEmail");
//       console.log("Testing the email response");
//       console.log(emailRes);

//       res.json({
//         message: req.user.firstName + ` ${status} ` + userExist.firstName,
//         data: connection,
//       });
//     } catch (err) {
//       res.send(err.message);
//     }
//   }
// );

// requestRouter.post(
//   "/connectionRequest/receive/:status/:requestId",
//   userAuth,
//   async (req, res) => {
//     // validate the status and requestID
//     const { status, requestId } = req.params;
//     // make sure loggedInUser is same person logged in
//     const loggedInUser = req.user;
//     console.log(loggedInUser._id);
//     try {
//       const ALLOWED_STATUS = ["accepted", "rejected"];
//       if (!ALLOWED_STATUS.includes(status)) {
//         throw new Error(
//           "the only 2 allowed statuses are accepted and rejected"
//         );
//       }
//       const validRequest = await ConnectionRequest.findOne({
//         _id: requestId,
//         toUserId: loggedInUser._id,
//         status: "interested",
//       });

//       console.log({ validRequest });

//       if (!validRequest) {
//         throw new Error("connection request not found");
//       }
//       validRequest.status = status;
//       const data = await validRequest.save();

//       res.json({
//         message: loggedInUser.firstName + ` ${status} ` + "the request",
//         data: data,
//       });
//     } catch (err) {
//       res.send(err.message);
//     }
//   }
// );

// module.exports = requestRouter;


requestRouter.post(
  "/connectionRequest/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      console.log("📍 STEP 1: Route hit");

      const status = req.params.status;
      const userId = req.params.userId;
      const fromUserId = req.user._id;
      const toUserId = userId;

      console.log("📍 STEP 2: Extracted route params and user info");

      const statuses = ["interested", "ignored"];
      if (!statuses.includes(status)) {
        console.log("❌ Invalid status");
        throw new Error("only interested and ignored statuses are allowed");
      }

      console.log("📍 STEP 3: Valid status");

      const invalidRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (invalidRequest) {
        console.log("❌ Duplicate request detected");
        throw new Error(
          "a person cannot resend the request and other party cannot send the request to user"
        );
      }

      console.log("📍 STEP 4: No duplicate request");

      const userExist = await User.findById(toUserId);
      if (!userExist) {
        console.log("❌ Target user does not exist");
        throw new Error("sorry the user does not exist in our database");
      }

      console.log("📍 STEP 5: User exists");

      const connection = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      console.log("📍 STEP 6: Saving connection request");
      await connection.save();

      console.log("📍 STEP 7: Calling sendEmail.run()");
      const emailRes = await sendEmail.run();

      console.log("📍 STEP 8: Email sent successfully");
      console.log("📧 Email response:", emailRes);

      res.json({
        message: req.user.firstName + ` ${status} ` + userExist.firstName,
        data: connection,
      });
    } catch (err) {
      console.log("❌ Error in /connectionRequest route:", err.message);
      res.send(err.message);
    }
  }
);
