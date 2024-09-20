const jwt = require("jsonwebtoken");

const SECRET_KEY = "AaaruPagalHai";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "10m",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

module.exports = { generateToken, verifyToken };
