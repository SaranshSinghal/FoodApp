const reviewModel = require("../models/reviewModel");
const planModel = require("../models/planModel");
const express = require("express");
const { protectRoute } = require("./utilFns");

const {
  getElements,
  updateElement,
  getElementById,
} = require("../helpers/factory");

const reviewRouter = express.Router();

const getReviews = getElements(reviewModel);
const updateReview = updateElement(reviewModel);
const getReviewById = getElementById(reviewModel);

const createReview = async function (req, res) {
  try {
    let review = await reviewModel.create(req.body);
    console.log("review", review);
    let planId = review.plan;
    let plan = await planModel.findById(planId);
    plan.reviews.push(review["_id"]);

    if (plan.ratingsAverage) {
      let sum = plan.ratingsAverage * plan.reviews.length;
      let finalAvgRating = (sum + review.rating) / (plan.review.length + 1);
      plan.ratingsAverage = finalAvgRating;
    } else plan.ratingsAverage = review.rating;

    await plan.save();
    res.status(200).json({ message: "review created", review: review });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const deleteReview = async function (req, res) {
  try {
    let review = await reviewModel.findByIdAndDelete(req.body.id);
    console.log("review", review);
    let planId = review.plan;
    let plan = await planModel.findById(planId);
    let indexOfReview = plan.reviews.indexOf(review["_id"]);
    plan.review.splice(indexOfReview, 1);
    await plan.save();
    res.status(200).json({ message: "review deleted", review: review });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

reviewRouter.use(protectRoute);
reviewRouter
  .route("/:id")
  .get(getReviewById)
  .patch(updateReview)
  .delete(deleteReview);

reviewRouter.route("/").get(getReviews).post(createReview);

module.exports = reviewRouter;
