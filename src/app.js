const express = require("express");

const app = express();

const connectDb=require("./config/database")

connectDb().then(()=>{
    console.log("database connected")
    app.listen(3000, () => {
        console.log("server running on port 3000");
      });
}).catch((err)=>{
    console.log(err)
})


