const express = require("express");
const UserRouter = express.Router();
const User = require("../model/UserModel");
const { configDotenv } = require("dotenv");

const cloudinary = require('cloudinary').v2;
configDotenv()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

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
            dateOfBirth: dob,
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
        if (status && status.modifiedCount > 0) {
          setResp(200, 'User details updated.');
        } else {
          setResp(304, 'Failed to update the user details.');
        }
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

UserRouter.post('/upload-profile-pic', (req, res) => {
  if (req.body && Object.keys(req.body).length > 0) {

    const { email, username, image } = req.body;

    let fileName = `${username}-profile-img`
    
    cloudinary.uploader.upload(image, {
      public_id: fileName,
      folder: 'DevSpace/Ecomm/profile'
    }).then(resp => {
      console.log(resp)
    }).catch(error => {
      console.log(error);
    })

    // image upload to cloudinary
    // if uploaded successfully -> mongoDB url update
    // resonse as per status

    res.status(201).send('Uploaded')

  } else {
    res.status(400).send("Please send valid user details");
  }

})


module.exports = UserRouter;
