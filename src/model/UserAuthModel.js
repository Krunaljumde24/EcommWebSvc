const mongoose = require("mongoose");
const UserAuthSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: String,
  isSecQueSet: Boolean,
  secQue1: String,
  secQue1Ans: String,
  secQue2: String,
  secQue2Ans: String,
});

const UserAuth = mongoose.model("UserAuth", UserAuthSchema);

module.exports = UserAuth;
