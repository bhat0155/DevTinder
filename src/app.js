const express = require("express");

const app = express();
// parse postman body
app.use(express.json());

const connectDb = require("./config/database");
const User = require("./models/user");

app.get("/profile", async (req, res) => {
   let fName=req.body.firstName;
   const theUser=await User.find({lastName:req.body.lastName})
   console.log({theUser})
    if (theUser.length===0){
        res.status(400).send("The user does not exist")
    }
   try{
    res.send(theUser)
   }
   catch(err){
    res.send(err.message)
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
