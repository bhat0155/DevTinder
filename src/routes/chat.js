const express = require("express");
const chatRouter = express.Router();
const {Chat} = require("../models/chat");
const { userAuth } = require("../middlewares/auth");

chatRouter.get("/chat/:targetUser", userAuth, async (req, res) => {
  // find the chat between 2 users and return it
  try {
    const userId = req.user._id;
    const { targetUser } = req.params;

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUser] },
    }).populate({ path: "messages.senderId", select: "firstName" });
    if (!chat) {
      chat = new Chat({ participants: [userId, targetUser], messages: [] });
    }

    await chat.save();
    res.json(chat);
  } catch (err) {
    console.log("error fetching messages from db", err);
  }
});

module.exports = chatRouter;
