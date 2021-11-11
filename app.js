const express = require("express");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

// defining user and auth routers
const authRouter = require("./Routers/authRouter");
const userRouter = require("./Routers/userRouter");
const planRouter = require("./Routers/planRouter");
const reviewRouter = require("./Routers/reviewRouter");
const bookingRouter = require("./Routers/bookingRouter");

// server init
const app = express();

// getting webpage from public folder
app.use(express.static("public"));
app.use(
  rateLimit({
    max: 100,
    windowMs: 15 * 60 * 1000,
    message:
      "Too many accounts created from this IP, please try again after an hour",
  })
);
app.use(hpp({ whiteList: ["select", "page", "sort", "myquery"] }));
app.use(helmet());
app.use(express.json());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());

// defining routes
app.use("/api/plan", planRouter);
app.use("/api/user", userRouter);
// auth router -> verb
app.use("/api/auth", authRouter);
app.use("/api/review", reviewRouter);
app.use("/api/booking", bookingRouter);
// 404 page
app.use(function (req, res) {
  res.status(404).sendFile(path.join(__dirname, "404.html"));
});

// setting the port to use
app.listen(8080, function () {
  console.log("server started at http://localhost:8080");
});
