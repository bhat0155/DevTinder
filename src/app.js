const express = require("express");

const app = express();
// parse postman body
app.use(express.json());

const connectDb = require("./config/database");
const User = require("./models/user");

app.get("/profile", async (req, res) => {
  const theUser = await User.find({ lastName: req.body.lastName });
  console.log({ theUser });
  if (theUser.length === 0) {
    res.status(400).send("The user does not exist");
  }
  try {
    res.send(theUser);
  } catch (err) {
    res.send(err.message);
  }
});

app.post("/signup", async (req, res) => {
  const data = {
    firstName: "MS",
    lastName: "Dhoni",
    password: "MS@003",
  };

  try {
    console.log(req.body);
    const user = req.body;
    const newUser = new User(user);

    await newUser.save();
    res.send("user added successfully");
  } catch (err) {
    res.send(err.message);
  }
});

app.delete("/delete", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.body.id });

    if (!user) {
      res.status(404).send("The user no longer exists");
    }
    res.send("user deleted");
  } catch (err) {
    console.log(err);
  }
});

app.patch("/update", async (req, res) => {
  const whomToUpdate = await User.findByIdAndUpdate(req.body.id, req.body);

  console.log(req.body);
  if (!whomToUpdate) {
    res.send("the user does not exist");
  }

  try {
    await whomToUpdate.save();
    if (whomToUpdate.length == 0) {
      console.log("no updated user");
    }
    res.send("the user is updated");
  } catch (err) {
    res.send(err.message);
  }
});

app.put("/replace", async (req, res) => {
  const data = {
    ...req.body,
  };
  const replaced = await User.findOneAndReplace(
    { firstName: req.body.firstName },
    data,
    { new: true }
  );
  console.log({ replaced });
  if (!replaced) {
    res.send("the person could not be found");
  }

  try {
    await replaced.save();
    res.send("the person is replaced");
  } catch (err) {
    res.send(err.message);
  }
});

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
