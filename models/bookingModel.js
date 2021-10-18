const mongoose = require("mongoose");
let { DB_LINK } = require("../secrets");

mongoose
  .connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(function () {
    console.log("connected to db");
  })
  .catch(function (err) {
    console.log("err", err);
  });

const bookingSchema = new mongoose.Schema({
  bookedAt: { type: Date, default: Date.now },
  proceAtThatTime: { type: Number, required: true },
  user: {
    type: [mongoose.Schema.ObjectId],
    ref: "userModel",
    required: [true, "Booking must belong to a user"],
  },
  plan: {
    type: [mongoose.Schema.ObjectId],
    ref: "planModel",
    required: [true, "Booking must belong to a plan "],
  },
  status: {
    type: String,
    enum: ["pending", "failed", "sucess"],
    required: true,
    default: "pending",
  },
});

const bookingModel = mongoose.model("bookingModel", bookingSchema);
module.exports = bookingModel;
