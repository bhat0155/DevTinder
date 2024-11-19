const express = require("express");
const { validateSignUp } = require("./utils/validateSignUp");
const bcrypt=require("bcrypt")

const app = express();
// parse postman body
app.use(express.json());

const connectDb = require("./config/database");
const User = require("./models/user");
const { ReturnDocument } = require("mongodb");

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
  try {
    validateSignUp(req);

    const { firstName, lastName, email, password } = req.body;

  const hashedPassword= await bcrypt.hash(password, 10)
  console.log({hashedPassword})

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

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

app.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const ALLOWED_UPDATES = ["firstName", "lastName", "gender", "photoURL"];

  try {
    const updatedChanges = Object.keys(req.body).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    const whomToUpdate = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedChanges) {
      throw new Error("Only firstName, lastName, gender can be changed");
    }
    if (!whomToUpdate) {
      res.send("the user does not exist");
    }

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
