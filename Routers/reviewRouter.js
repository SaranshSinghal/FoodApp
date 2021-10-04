const express = require("express");
const reviewRouter = express.Router();
const protectRoute = require("./authHelper");

const createReview = factory.createElement(ReviewModel);
const getReviews = factory.getElements(ReviewModel);
const deleteReview = factory.deleteElement(ReviewModel);
const updateReview = factory.updateElement(ReviewModel);
const getReviewById = factory.getElementById(ReviewModel);

reviewRouter.use(protectRoute);

reviewRouter.route("/:id")
  .get(getReviewById)
  .patch(updateReview)
  .delete(deleteReview);

reviewRouter.route("/").get(getReviews).post(createReview);

module.exports = reviewRouter;
