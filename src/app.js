const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("./utils/cronJob")

const app = express();
// parse postman body
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend's URL
    credentials: true, // Allow credentials (cookies)
  })
);

const connectDb = require("./config/database");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter  = require("./routes/payment")

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

connectDb()
  .then(() => {
    console.log("database connected");
    app.listen(3000, () => {
      console.log("Local server running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
