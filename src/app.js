const express = require("express");

const app = express();

const connectDb=require("./config/database")
const User=require("./models/user")

app.post("/signup", async(req, res)=>{
    const data={
        firstName:"Sachin",
        lastName:"Tendulkar",
        password:"Sachin@003"
    }
    
    const user=new User(data)
    await user.save();
    res.send("user added successfully")
})

connectDb().then(()=>{
    console.log("database connected")
    app.listen(3000, () => {
        console.log("server running on port 3000");
      });
}).catch((err)=>{
    console.log(err)
})


