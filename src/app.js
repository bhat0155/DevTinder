const express = require("express");

const app = express();

// app.use("/user", (req, res)=>{
//     res.send("HAHAHAHA")
// })

app.get("/user", (req, res)=>{
    res.send({Fname:"ekam", Lname:"bhatia"})
})

app.post("/user", (req, res)=>{
    res.send("user updated successfully")
})

app.delete("/user", (req, res)=>{
    res.send("user deleted successfully")
})

app.listen(3000, () => {
  console.log("server running on port 3000");
});
