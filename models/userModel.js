const mongoose = require("mongoose");
const emailValidator = require("email-validator");
let { DB_LINK } = require("../secrets");
const bcrypt = require("bcrypt");

// mongoose -> data -> exact -> data -> that is required to form an entity
// data completness, data validation
// name, email, password, confirmPassword-> min, max, confirmPassword, required, unique
// connnection form
mongoose
  .connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(function () {
    console.log("connected to db");
  })
  .catch(function (err) {
    console.log("err", err);
  });

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Kindly enter your name"] },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      return emailValidator.validate(this.email);
    },
  },
  password: { type: String, minlength: 8, required: true },
  confirmPassword: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function () {
        return this.password === this.confirmPassword;
      },
      message: "Please re-enter your password",
    },
  },
  createdAt: { type: Date },
  token: { type: String },
  validUpto: { Date },
  role: { type: String, enum: ["admin", "ce", "user"], default: "user" },
  bookings: { type: mongoose.Schema.ObjectId, ref: "bookingModel" },
});

// remember order
// middleware / hook
userSchema.pre("save", async function (next) {
  // db confirm password will not be saved
  console.log("Hello");
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); // password convert text
  this.confirmPassword = undefined;
  next();
});

// document method
userSchema.methods.resetHandler = async function (password, confirmPassword) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); // password convert text
  this.confirmPassword = confirmPassword;
  this.token = undefined; // token reuse is not possible
};

const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;
