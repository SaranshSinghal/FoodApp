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

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Kindly pass the name"],
    unique: [true, "Plan must be unique"],
    maxlength: [40, "Your plan length is more than 40 characters"],
  },
  duration: { type: Number, required: [true, "You need to provide duration"] },
  price: { type: Number, required: true },
  ratingsAverage: { type: Number },
  discount: {
    type: Number,
    validate: {
      validator: function () {
        return this.discount < this.price;
      },
      message: "Discount must be less than actual price",
    },
  },
  reviews: { type: mongoose.Schema.ObjectId, ref: "reviewModel" },
  planImages: { type: String },
});

const planModel = mongoose.model("planModel", planSchema);
module.exports = planModel;
