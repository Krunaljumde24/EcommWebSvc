const bcrypt = require("bcrypt");
const { Router } = require("express");
const AuthRouter = Router({ strict: true });
const User = require("../model/UserModel.js");

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
      const { name, email, username, password, ConfirmPassword } = req.body;

      // console.log(name+""+email+" "+password+" ");
      const existingUser = await Auth.findOne({ email });
      console.log(existingUser);
      if (existingUser) {
        return res.status(400).send("Email already exists");
      }

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
  } catch (error) {
    res.status(500).send(error.message);
  }
});

AuthRouter.post("/login", async (req, res) => {
  console.log(req.session);

  let respObj = {
    status: false,
    message: "",
    token: "",
  };

  try {
    const { username, password } = req.body;
    const user = await Auth.findOne({ username });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        respObj = {
          status: true,
          message: "Logged in successfully.",
          token: "asdfghjkwertyui2345678xcvbdfrtgh345678fghj",
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
module.exports = { AuthRouter };
