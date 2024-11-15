const mongoose = require("mongoose");

const connectDb = async () => {
  mongoose.connect(
    "mongodb+srv://EkamSingh:Ekamsingh_003@cluster0.i9nvy.mongodb.net/devTinder"
  );
};

module.exports = connectDb;
