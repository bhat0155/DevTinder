const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  title: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

// creating a model, which is basically a class
const User = mongoose.model("User", userSchema);
module.exports=User;
