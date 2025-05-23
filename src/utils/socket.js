const socket = require("socket.io");

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

    socket.on("sendMessage", ({ firstName, userId, targetUser, mssg }) => {
      const roomId = [userId, targetUser].sort().join("_");
      console.log(`${firstName} sent the message ${mssg}`);

      io.to(roomId).emit("MessageReceived", { firstName, mssg });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
