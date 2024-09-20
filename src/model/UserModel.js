const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: Number,
  gender: String,
  dateOfBirth: Date,
  password: String,
  address: String,
  country: String,
  state: String,
  city: String,
  zipCode: String,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
