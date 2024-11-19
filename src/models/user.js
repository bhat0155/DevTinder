const mongoose = require("mongoose");
const validator=require("validator");


const userSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      trim:true,
      unique:true,
      validate(value){
        const isValidEmail= validator.isEmail(value);
        if (!isValidEmail){
          throw new Error("Please enter a genuine email address")
        }
      }
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      required: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error(
            "The gender must be either of male, female or others"
          );
        }
      },
    },
    password: {
      type: String,
    },
    skills: {
      type: [],
      default: "this is the default value of the skills",
    },
    photoURL:{
      type: String,
      validate(value){
        const isValidURL= validator.isURL(value);
        if (!isValidURL){
          throw new Error("Please provide a valid URL")
        }
      }

    }
  },
  { timestamps: true }
);

// creating a model, which is basically a class
const User = mongoose.model("User", userSchema);
module.exports = User;
