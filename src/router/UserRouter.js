const express = require("express");
const UserRouter = express.Router();
const UserModel = require("../model/UserModel");

UserRouter.post("/update-user-details", async (req, res) => {
  if (Object.keys(req.body).length > 0) {
    const {
      firstName,
      lastName,
      username,
      email,
      phone,
      gender,
      dob,
      address,
      country,
      state,
      city,
      zipcode,
    } = req.body;

    const user = await UserModel.findOne(
      { username: username, email: email },
      { _id: 0, __v: 0, password: 0 }
    );
    if (user) {
      await UserModel.updateOne(
        { username: username, email: email },
        {
          $set: {
            address: address,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phone,
            gender: gender,
            dateOfBirth: dob,
            country: country,
            state: state,
            city: city,
            zipCode: zipcode,
          },
        }
      );

      res.status(200).send(user);
    } else {
      res.status(400).send("User does not exists.");
    }
  } else {
    res.status(400).send("Please send valid user details");
  }
});

UserRouter.post("/get-user-details", async (req, res) => {
  if (Object.keys(req.body).length > 0) {
    const { username, email } = req.body;
    const user = await UserModel.findOne(
      { username: username, email: email },
      { _id: 0, __v: 0, password: 0 }
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
module.exports = UserRouter;
