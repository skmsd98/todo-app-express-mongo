const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_DB_URI);
  console.log("database connected successfully");
};

module.exports = connectDB;
