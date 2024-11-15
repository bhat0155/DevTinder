const express = require("express");

const app = express();
const { userAuth, adminAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);



app.get("/admin/getInfo", (req, res) => {
  try {
    throw new Error("random error");
    res.send("got admin info which is authenticated");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/admin/deleteInfo", (req, res) => {
  res.send("deleted admin info");
});

app.get("/user", userAuth, (req, res, next) => {
  try {
    throw new Error("hiiiii im error");
    res.send("user info");
  } catch (err) {
    next(err);
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    console.log("last")

    res.send(err.message);
  }
});
app.listen(3000, () => {
  console.log("server running on port 3000");
});
