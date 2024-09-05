const bcrypt = require("bcrypt");
const { Router } = require("express");
const AuthRouter = Router({ strict: true });
const User = require("../model/UserModel.js");

const { generateToken, verifyToken } = require("../utils/JwtHelper.js");

AuthRouter.get("/Authtest", (req, res) => {
  res.send("test authrouter");
});

AuthRouter.post("/signup", async (req, res) => {
  try {
    if (
      Object.keys(req.body).length != 0 &&
      Object.keys(req.body).toString().includes("name") &&
      Object.keys(req.body).toString().includes("email") &&
      Object.keys(req.body).toString().includes("username") &&
      Object.keys(req.body).toString().includes("password")
    ) {
      const { name, email, username, password } = req.body;
      const existingUser = await User.findOne({ email });
      console.log(existingUser);
      if (existingUser) {
        return res.status(400).send("Email already exists");
      } else {
        bcrypt.hash(password, 10, async (err, hash) => {
          const authObj = new User({
            name: name,
            email: email,
            username: username,
            password: hash,
          });

          try {
            let obj = await authObj.save();
            console.log(obj);
            res.status(201).send("User has been created");
          } catch (error) {
            res.status(500).send(error.message);
          }
        });
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

AuthRouter.post("/login", async (req, res) => {
  let respObj = {
    status: false,
    message: "",
    token: "",
  };

  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log(user);

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        // login success - generate token
        respObj = {
          status: true,
          message: "Logged in successfully.",
          token: generateToken(user),
        };
        res.status(200).send(respObj);
      } else {
        respObj = {
          status: false,
          message: "Unauthorized login attempt.",
          token: "",
        };
        res.status(401).send(respObj);
      }
    } else {
      respObj = {
        status: false,
        message: "Please enter valid username password.",
        token: "",
      };
      res.status(400).send(respObj);
    }
  } catch (error) {
    respObj = {
      status: false,
      message: error.message,
      token: "",
    };
    res.status(500).send(respObj);
  }
});

AuthRouter.get("/verifyToken", (req, res) => {
  const token = req.headers.token;
  console.log("token -> ", token);

  try {
    let result = verifyToken(token);
    res.status(200).send({ status: "Authorized" });
  } catch (error) {
    console.log(error);
    res.status(401).send({ status: "Unauthorized" });
  }
});

module.exports = { AuthRouter };
