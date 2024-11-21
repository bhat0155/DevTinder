const express = require("express");

const cookieParser = require("cookie-parser");

const app = express();
// parse postman body
app.use(express.json());
app.use(cookieParser());

const connectDb = require("./config/database");
const User = require("./models/user");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

// app.post("/login", async (req, res) => {
//   // checking if user with email id exist
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email: email });
//     if (!user) {
//       throw new Error("Invalid email");
//     }

//     const token = await user.getJWT();
//     res.cookie("token", token);

//     const authenticatedPw= await user.comparePassword(password)
//     // const authenticatedPw = await bcrypt.compare(password, user.password);
//     if (!authenticatedPw) {
//       throw new Error("Invalid password");
//     } else {
//       res.send("login successfull");
//     }
//   } catch (err) {
//     res.send(err.message);
//   }
// });

// app.get("/profile", userAuth, async (req, res) => {
//   try {
//     const theCurrentUser = req.user;

//     res.send(theCurrentUser);

//     console.log(_id);
//   } catch (err) {
//     res.send(err);
//   }
// });

// app.post("/connectionRequest", userAuth, (req, res)=>{
//     const user=req.user;
//     res.send(user.firstName+" just sent the connection request")
// })

// app.post("/signup", async (req, res) => {
//   try {
//     validateSignUp(req);

//     const { firstName, lastName, email, password } = req.body;

//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log({ hashedPassword });

//     const newUser = new User({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();
//     res.send("user added successfully");
//   } catch (err) {
//     res.send(err.message);
//   }
// });

// app.delete("/delete", async (req, res) => {
//   try {
//     const user = await User.findOneAndDelete({ _id: req.body.id });

//     if (!user) {
//       res.status(404).send("The user no longer exists");
//     }
//     res.send("user deleted");
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.patch("/update/:id", async (req, res) => {
//   const { id } = req.params;
//   const ALLOWED_UPDATES = ["firstName", "lastName", "gender", "photoURL"];

//   try {
//     const updatedChanges = Object.keys(req.body).every((key) =>
//       ALLOWED_UPDATES.includes(key)
//     );

//     const whomToUpdate = await User.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updatedChanges) {
//       throw new Error("Only firstName, lastName, gender can be changed");
//     }
//     if (!whomToUpdate) {
//       res.send("the user does not exist");
//     }

//     if (whomToUpdate.length == 0) {
//       console.log("no updated user");
//     }
//     res.send("the user is updated");
//   } catch (err) {
//     res.send(err.message);
//   }
// });

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
