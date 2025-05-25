const socket = require("socket.io");
const { Chat } = require("../models/chat");
const { use } = require("react");
const { text } = require("express");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetUser, firstName }) => {
      const roomId = [userId, targetUser].sort().join("_");
      socket.join(roomId);

      console.log(firstName + " joined " + roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUser, mssg }) => {
        const roomId = [userId, targetUser].sort().join("_");
        console.log(`${firstName} sent the message ${mssg}`);

        try {
          // if the chat does not exist, create a new one
          let chatOfUsers = await Chat.findOne({
            participants: { $all: [userId, targetUser] },
          });

          if (!chatOfUsers) {
            chatOfUsers = await new Chat({
              participants: [userId, targetUser],
              messages: [],
            });
          }

          chatOfUsers.messages.push({ senderId: userId, text: mssg });
          await chatOfUsers.save();
        } catch (err) {
          console.log("error saving the messages in db", err);
        }

        io.to(roomId).emit("MessageReceived", { firstName, mssg });
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
