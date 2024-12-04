const express = require("express");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
// parse postman body
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173", // Frontend's URL
  credentials: true, // Allow credentials (cookies)
}));

const connectDb = require("./config/database");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDb()
  .then(() => {
    console.log("database connected");
    app.listen(3000, () => {
      console.log("server running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
