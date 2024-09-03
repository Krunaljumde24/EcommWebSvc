const jwt = require("jsonwebtoken");

const SECRET_KEY = "AaaruPagalHai";

const generateToken = (user) => {
  return jwt.sign({ id: 1, email: "krunnaljumde24" }, SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "2m",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

module.exports = { generateToken, verifyToken };
