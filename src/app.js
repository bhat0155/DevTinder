const express = require("express");

const app = express();

app.use(
  "/user",
 [ (req, res, next) => {
    console.log("1st request handler");
    next();

    // res.send("response 1");
  },
  (req, res, next) => {
    console.log("2nd request handler");
    // res.send("response 2");
    next()
  }],
  (req, res, next)=>{
    console.log("3rd request handler");
    // res.send("response 3");
    next()
  }
);

app.listen(3000, () => {
  console.log("server running on port 3000");
});
