const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../secrets");
// ahead -> protect the route

function protectRoute(req, res, next) {
  // console.log(req.cookies);
  try {
    if (req.cookies.jwt) {
      let decryptedToken = jwt.verify(req.cookies.jwt, JWT_KEY);

      if (decryptedToken) {
        req.uid = decryptedToken.id;
        next();
      }
    } else res.status(401).json({ message: "You are not allowed." });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
}

module.exports = protectRoute;
