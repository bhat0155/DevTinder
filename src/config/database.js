const mongoose = require("mongoose");

const connectDb = async () => {
  mongoose.connect(process.env.DB_CONNECTION);
};

module.exports = connectDb;

// mongodb+srv://EkamSingh:Ekamsingh_003@cluster0.i9nvy.mongodb.net/devTinder
//mongodb+srv://EkamAtlas:<db_password>@cluster0.ws7oqt6.mongodb.net/
