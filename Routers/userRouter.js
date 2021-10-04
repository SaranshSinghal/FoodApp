const userModel = require("../models/userModel");
const express = require("express");
const userRouter = express.Router();
const protectRoute = require("./authHelper");
const factory = require("../helpers/factory");

// operations at /:id
userRouter
  .route("/:id")
  .get(protectRoute, authorizeUser(["admin", "manager"]), getUserById)
  .patch(updateUser)
  .delete(protectRoute, authorizeUser(["admin"]), deleteUser);

// operations at /
userRouter
  .route("/")
  .get(protectRoute, authorizeUser(["admin"]), getUsers)
  .post(protectRoute, authorizeUser(["admin"]), createUser);

const createUser = factory.createElement(userModel);
const getUsers = factory.getElements(userModel);
const updateUser = factory.updateElement(userModel);
const deleteUser = factory.deleteElement(userModel);
const getUserById = factory.getElementById(userModel);

function authorizeUser(rolesArr) {
  return async function (req, res, next) {
    let uid = req.uid;
    let { role } = await userModel.findById(uid);
    let isAuthorized = rolesArr.includes(role);
    if (isAuthorized) next();
    else
      res
        .status(403)
        .json({ message: "You are not authorized. Contact Admin!" });
  };
}

module.exports = userRouter;
