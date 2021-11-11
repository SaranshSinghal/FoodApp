const userModel = require("../models/userModel");
const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../secrets");
const emailSender = require("../helpers/emailSender");
const { bodyChecker } = require("./utilFns");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

// operations for login/signUp
authRouter.use(bodyChecker);
authRouter.route("/signup").post(setCreatedAt, signupUser);
authRouter.route("/login").post(loginUser);
authRouter.route("/forgetPassword").post(forgetPassword);
authRouter.route("/resetPassword").post(resetPassword);

// middleware
function setCreatedAt(req, res, next) {
  let body = req.body;

  if (Object.keys(body).length == 0)
    return res
      .status(400)
      .json({ message: "can't create user when body is empty " });

  req.body.createdAt = new Date().toISOString();
  next();
}

async function signupUser(req, res) {
  //email, user name, password -> req.body
  try {
    let user = await userModel.create(req.body);
    console.log("user", user);
    res.status(200).json({ message: "user created", createdUser: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}

async function loginUser(req, res) {
  // email, password -> userModel ->
  // email??
  // email -> user / get -> password
  try {
    if (req.body.email) {
      let { email, password } = req.body;
      let user = await userModel.findOne({ email });

      if (user) {
        let areEqual = await bcrypt.compare(password, user.password);

        if (areEqual) {
          let token = jwt.sign({ id: user["_id"] }, JWT_KEY);
          res.cookie("jwt", token, { HttpOnly: true });
          return res
            .status(200)
            .json({ user: user, message: "user logged in" });
        } else {
          return res
            .status(401)
            .json({ message: "Email or Password is wrong" }); // password wrong
        }
      } else
        return res.status(401).json({ message: "Email or password is wrong" }); // user not found
    } else return res.status(403).json({ message: "Please enter email" }); // nothing entered
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}

async function forgetPassword(req, res) {
  try {
    let { email } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
      let token = (Math.floor(Math.random() * 10000) + 10000)
        .toString()
        .substring(1);
      await userModel.updateOne({ email }, { token: token });
      // email send to nodemailer -> table tag through
      // service -> gmail
      let newUser = await userModel.findOne({ email });
      await emailSender(token, newUser.email);
      console.log(user);

      if (newUser?.token)
        return res
          .status(200)
          .json({ message: "Email sent with token " + token, user: newUser });
    } else return res.status(404).json({ message: "user not found" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}

async function resetPassword(req, res) {
  try {
    let { token, password, confirmPassword } = req.body;

    // for finding one record
    let user = await userModel.findOne({ token });

    if (user) {
      user.resetHandler(password, confirmPassword);
      console.log(user);
      await user.save();
      let newUser = await userModel.findOne({ email: user.email });

      res
        .status(200)
        .json({ message: "user password changed successfully", user: newUser });
    } else return res.status(404).json({ message: "incorrect token" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = authRouter;
