const bookingModel = require("../models/bookingModel");
const userModel = require("../models/userModel");
const express = require("express");
const { protectRoute } = require("./utilFns");

const {
  getElements,
  getElementById,
  updateElement,
} = require("../helpers/factory");

const RazorPay = require("razorpay");
let { KEY_ID, KEY_SECRET } = require("../secrets");

var razorpay = new RazorPay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET,
});

const bookingRouter = express.Router();

const getBookings = getElements(bookingModel);
// create -> booking model me change as well as userModel -> change user
// delete -> booking model me change as well as userModel -> change user
const updateBooking = updateElement(bookingModel);
const getBookingById = getElementById(bookingModel);

// create booking
const initiateBooking = async function (req, res) {
  try {
    let booking = await bookingModel.create(req.body);
    let bookingId = booking["_id"];
    let userId = req.body.user;
    let user = await userModel.findById(userId);
    user.bookings.push(bookingId);
    await user.save();
    const payment_capture = 1;
    const amount = 500;
    const currency = "INR";

    const options = {
      amount,
      currency,
      receipt: `rs_${bookingId}`,
      payment_capture,
    };

    const response = await razorpay.orders.create(options);
    console.log(response);

    res.status(200).json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
      booking: booking,
      message: "booking created",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// verify payment
async function verifyPayment(req, res) {
  const secret = KEY_SECRET;
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    res.status(200).json({ message: "OK" });
  } else res.status(403).json({ message: "Invalid" });
}

// deletebooking
const deletebooking = async function (req, res) {
  try {
    let booking = await bookingModel.findByIdAndDelete(req.body.id);
    console.log("booking", booking);
    let userId = booking.user;
    let user = await userModel.findById(userId);
    let idxOfbooking = user.bookings.indexOf(booking["_id"]);
    user.booking.splice(idxOfbooking, 1);
    await user.save();
    res.status(200).json({ message: "booking deleted", booking: booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

bookingRouter.use(protectRoute);
bookingRouter.route("/verification").post(verifyPayment);
bookingRouter
  .route("/:id")
  .get(getBookingById)
  .patch(updateBooking)
  .delete(deletebooking);
bookingRouter.route("/").get(getBookings).post(initiateBooking);

module.exports = bookingRouter;
