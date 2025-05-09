const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  // read cookies
  // find token
  // find the user

  try {
    const { token } = req.cookies;
    console.log({token})
    console.log("Cookies:", req.cookies);

    if (!token) {
      throw new Error("the token is not valid from the cookies");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedToken;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("this is from auth middleware " + err.message);
  }
};

module.exports = { userAuth };
