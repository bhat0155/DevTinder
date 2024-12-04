const validator = require("validator");
// const { all } = require("../routes/auth");

const validateSignUp = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    throw new Error(
      "first name, last name, email and password are mandatory requirements"
    );
  }

  if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("first name should be atleast 4 characters and atleast 50");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Please enter a valid email id");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

const validateProfileEdit = (req, res, next) => {
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "emailId",
    "photoURL",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const validUpdates = Object.keys(req.body).every((key) =>
    ALLOWED_UPDATES.includes(key)
  );
  console.log({validUpdates})
  if (!validUpdates) {
    throw new Error(
      "you are only allowed to modify FirstName, LastName, gender, emailId, photoURL, gender, age, about, skills"
    );
  }
  next();
};

const validatePassword = (req, res, next) => {
    const ALLOWED_UPDATES=["password"]

    const validUpdate=Object.keys(req.body).every((key)=>ALLOWED_UPDATES.includes(key))
    if (!validUpdate){
        throw new Error("You are only allowed to update password here")
    }

  const { password } = req.body;
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
  next()
};

module.exports = { validateSignUp, validateProfileEdit, validatePassword };
