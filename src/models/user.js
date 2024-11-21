const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt=require("bcrypt")

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
      trim: true,
      unique: true,
      validate(value) {
        const isValidEmail = validator.isEmail(value);
        if (!isValidEmail) {
          throw new Error("Please enter a genuine email address");
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,

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
    photoURL: {
      type: String,
      default:
        "https://fastly.picsum.photos/id/4/200/300.jpg?hmac=y6_DgDO4ccUuOHUJcEWirdjxlpPwMcEZo7fz1MpuaWg",
      validate(value) {
        const isValidURL = validator.isURL(value);
        if (!isValidURL) {
          throw new Error("Please provide a valid URL");
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT =  function () {
  const user = this;
  const token =  jwt.sign({ _id: user._id }, "SECRET", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  const user = this;
  console.log({userPWFROMSCHEMA: user.password})
  const authenticatedPw = await bcrypt.compare(password, user.password);
  return authenticatedPw;
};

// creating a model, which is basically a class
const User = mongoose.model("User", userSchema);
module.exports = User;
