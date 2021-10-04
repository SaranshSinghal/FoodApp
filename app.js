const express = require("express");
const cookieParser = require("cookie-parser");
// server init
const app = express();

// getting webpage from public folder
app.use(express.static("public"));
//
app.use(express.json());
//
app.use(cookieParser());

// defining user and auth routers
const authRouter = require("./Routers/authRouter");
const userRouter = require("./Routers/userRouter");
const planRouter = require("./Routers/planRouter");
const reviewRouter = require("./Routers/reviewRouter");

// defining routes
app.use("/api/plan", planRouter);
app.use("/api/user", userRouter);
// auth router -> verb
app.use("/api/auth", authRouter);
app.use("/api/review", reviewRouter);

// setting the port to use
app.listen(8080, function () {
  console.log("server started at http://localhost:8080");
});
