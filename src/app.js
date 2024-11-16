const express = require("express");

const app = express();
// parse postman body
app.use(express.json());

const connectDb=require("./config/database")
const User=require("./models/user")

app.post("/signup", async(req, res)=>{
    const data={
        firstName:"MS",
        lastName:"Dhoni",
        password:"MS@003"
    }
    
   try{
    console.log(req.body)
    const user=req.body;
    const newUser=new User(user)

    await newUser.save();
    res.send("user added successfully")
   }catch(err){
    res.send(err.message)
   }
})

connectDb().then(()=>{
    console.log("database connected")
    app.listen(3000, () => {
        console.log("server running on port 3000");
      });
}).catch((err)=>{
    console.log(err)
})


