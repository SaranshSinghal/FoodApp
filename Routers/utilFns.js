const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../secrets");

module.exports.protectRoute = function (req, res, next) {
  try {
    let decryptedToken = jwt.verify(req.cookies.jwt, JWT_KEY);

    if (decryptedToken) {
      req.userId = decryptedToken.id;
      next();
    } else res.send("kindly login to access this resource");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports.bodyChecker = function (req, res, next) {
  console.log("reached body checker");
  let isPresent = Object.keys(req.body).length;
  console.log("ispresent", isPresent);
  if (isPresent) next();
  else res.send("kind send details in body ");
};

module.exports.isAuthorized = function (roles) {
  console.log("I will run when the server is started");

  return async function (req, res, next) {
    console.log("Inner function");
    let { userId } = req; // id -> user get, user role

    try {
      let user = await userModel.findById(userId);
      let userisAuthorized = roles.includes(user.role);

      if (userisAuthorized) {
        req.user = user;
        next();
      } else res.status(200).json({ message: "user not authorized" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
};
