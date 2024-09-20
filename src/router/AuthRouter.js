const bcrypt = require("bcrypt");
const { Router } = require("express");
const AuthRouter = Router({ strict: true });
const User = require("../model/UserModel.js");
const { generateToken, verifyToken } = require("../utils/JwtHelper.js");
const UserAuth = require("../model/UserAuthModel.js");

AuthRouter.get("/Authtest", (req, res) => {
  res.send("test authrouter");
});

AuthRouter.post("/signup", async (req, res) => {
  if (
    Object.keys(req.body).length != 0 &&
    Object.keys(req.body).toString().includes("firstName") &&
    Object.keys(req.body).toString().includes("lastName") &&
    Object.keys(req.body).toString().includes("email") &&
    Object.keys(req.body).toString().includes("username") &&
    Object.keys(req.body).toString().includes("password")
  ) {
    const { firstName, lastName, email, username, password } = req.body;
    const existingUser = await User.findOne({
      email: email,
      username: username,
    });
    if (existingUser) {
      return res.status(400).send("Email already exists");
    } else {
      try {
        const userObj = new User({
          email: email,
          username: username,
          firstName: firstName,
          lastName: lastName,
        });
        console.log(req.body);

        let obj = await userObj.save();
        console.log(obj);
        if (obj) {
          bcrypt.hash(password, 10, async (err, hash) => {
            const authObj = new UserAuth({
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
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  } else {
    res.status(400).send("Please send valid user details.");
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

AuthRouter.post("/checkSecurityQuestions", async (req, res) => {
  // accept & validate email address
  if (
    Object.keys(req.body).length > 0 &&
    Object.keys(req.body).includes("email")
  ) {
    const { email } = req.body;

    // check if user exists in UserAuth collection
    let userObj = await UserAuth.findOne({ email: email });
    if (userObj) {
      // check if security question set or not
      if (userObj.isSecQueSet) {
        res.status(200).send({
          secQue1: userObj.secQue1,
          secQue2: userObj.secQue2,
        });
      } else {
        res
          .status(400)
          .send("Security question are not set, please contact administrator.");
      }
    } else {
      res.status(400).send("User does not exist.");
    }
  } else {
    res.status(400).send("Please send valid user details");
  }
  // if yes send username, email, security questions
  // if no response set user not exists
});

AuthRouter.post("/updatePassword", (req, res) => {
  // accept username, email, security questions answer, password
  // validate req
  // if securituy question are not set then error
  // check if answers are correct or not
  // update the password
});

module.exports = { AuthRouter };
