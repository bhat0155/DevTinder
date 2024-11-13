const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("hi from test");
});

app.use("/hello", (req, res) => {
    res.send("hi from hello");
  });

app.use("/", (req, res) => {
  res.send("hi from homepage2");
});



app.listen(3000, () => {
  console.log("server running on port 3000");
});
