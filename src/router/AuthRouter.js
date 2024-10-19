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
        let obj = await userObj.save();
        if (obj) {
          bcrypt.hash(password, 10, async (err, hash) => {
            const authObj = new UserAuth({
              email: email,
              username: username,
              password: hash,
            });
            try {
              let obj = await authObj.save();
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
    const user = await UserAuth.findOne({ username });

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
  try {
    let result = verifyToken(token);
    res.status(200).send({ status: "Authorized" });
  } catch (error) {
    console.log(error);
    res.status(401).send({ status: "Unauthorized" });
  }
});

AuthRouter.post("/checkEmailToResetPassword", async (req, res) => {
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
        let secResp = {
          secQue1: userObj.secQue1,
          secQue2: userObj.secQue2,
        };
        res.status(200).send(secResp);
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

AuthRouter.post("/checkSecurityAnswers", async (req, res) => {
  // accept  email, security questions & answer
  // validate req
  if (
    Object.keys(req.body).length != 0 &&
    Object.keys(req.body).toString().includes("email") &&
    Object.keys(req.body).toString().includes("secQue1") &&
    Object.keys(req.body).toString().includes("secQue2") &&
    Object.keys(req.body).toString().includes("secQue1Ans") &&
    Object.keys(req.body).toString().includes("secQue2Ans")
  ) {
    const { email, secQue1, secQue2, secQue1Ans, secQue2Ans } = req.body;
    // find user will all details
    let user = await UserAuth.find({
      email: email,
      secQue1: secQue1,
      secQue2: secQue2,
      secQue1Ans: secQue1Ans,
      secQue2Ans: secQue2Ans,
    });

    if (user.length > 0) {
      res.status(200).send("User verfied.");
    } else {
      res.status(400).send("User verification failed.");
    }
  } else {
    res.status(400).send("Please send valid user security details.");
  }
});

AuthRouter.post("/resetPassword", async (req, res) => {
  if (
    Object.keys(req.body).length != 0 &&
    Object.keys(req.body).toString().includes("email") &&
    Object.keys(req.body).toString().includes("password")
  ) {
    const { email, password } = req.body;
    try {
      bcrypt.hash(password, 10, async (err, hash) => {
        let obj = await UserAuth.findOneAndUpdate(
          { email: email },
          { $set: { password: hash } },
          { new: true }
        );
        if (obj) {
          res.status(201).send("Password updated.");
        } else {
          res.status(500).send("Password NOT updated.");
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong.");
    }
  } else {
    res.status(400).send("Please send valid user security details.");
  }
});

module.exports = { AuthRouter };
