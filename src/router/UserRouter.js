const express = require("express");
const UserRouter = express.Router();
const User = require("../model/UserModel");

UserRouter.post("/get-user-details", async (req, res) => {
  if (Object.keys(req.body).length > 0) {
    const { username } = req.body;
    const user = await User.findOne(
      { username: username },
      { _id: 0, __v: 0 }
    );
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(400).send("User does not exists.");
    }
  } else {
    res.status(400).send("Please send valid user details");
  }
});

UserRouter.post("/update-user-details", async (req, res) => {

  let resp = { status: undefined, message: undefined };

  let setResp = (sts, msg) => {
    resp.status = sts;
    resp.message = msg;
  }

  if (Object.keys(req.body).length > 0) {

    const {
      uName,
      email,
      fName,
      lName,
      phone,
      dob,
      gender,
      address,
      country,
      state,
      city,
      zipcode
    } = req.body;
    try {
      const user = await User.findOne(
        { username: uName, email: email },
        { _id: 0, __v: 0 }
      );
      if (user && Object.keys(user).length > 0) {
        const status = await User.updateOne({ username: user.username, email: user.email }, {
          $set: {
            address: address,
            city: city,
            country: country,
            // dateOfBirth: new Date()
            email: email,
            firstName: fName,
            gender: gender,
            lastName: lName,
            phoneNumber: phone,
            state: state,
            username: uName,
            zipCode: zipcode
          }
        });
        setResp(200, user);
      } else {
        setResp(400, "User does not exists.");
      }
    } catch (error) {
      setResp(500, "Failed with mongodb execution");
    }
  } else {
    setResp(400, "Please send valid user details");
  }
  res.status(resp.status).send(resp.message);
})
module.exports = UserRouter;
