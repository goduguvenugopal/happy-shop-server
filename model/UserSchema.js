const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  googleId: String,
  displayName: String,
  email: String,
  image: String,
});


const User = mongoose.model("User", userSchema)

module.exports = User