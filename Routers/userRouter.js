const userModel = require("../models/userModel");
const express = require("express");
const { protectRoute, bodyChecker, isAuthorized } = require("./utilFns");

const {
  createElement,
  getElements,
  updateElement,
  deleteElement,
  getElementById,
} = require("../helpers/factory");

const userRouter = express.Router();

const createUser = createElement(userModel);
const getUsers = getElements(userModel);
const updateUser = updateElement(userModel);
const deleteUser = deleteElement(userModel);
const getUserById = getElementById(userModel);

userRouter.use(protectRoute);

// operations at /:id
userRouter
  .route("/:id")
  .get(getUserById)
  .patch(bodyChecker, isAuthorized(["admin", "ce"]), updateUser)
  .delete(bodyChecker, isAuthorized(["admin"]), deleteUser);

// operations at /
userRouter
  .route("/")
  .get(bodyChecker, isAuthorized(["admin", "ce"]), getUsers)
  .post(bodyChecker, isAuthorized(["admin"]), createUser);

module.exports = userRouter;
