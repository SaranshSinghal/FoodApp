const planModel = require("../models/planModel");
const express = require("express");
const { protectRoute, bodyChecker, isAuthorized } = require("./utilFns");

const {
  createElement,
  getElements,
  updateElement,
  deleteElement,
  getElementById,
} = require("../helpers/factory");

const planRouter = express.Router();

const createPlan = createElement(planModel);
const getPlans = getElements(planModel);
const updatePlan = updateElement(planModel);
const deletePlan = deleteElement(planModel);
const getPlanById = getElementById(planModel);

planRouter.use(protectRoute);
planRouter.route("/top3plans").get(getTop3Plans); // sortByRating
planRouter
  .route("/:id")
  .get(getPlanById)
  .patch(bodyChecker, isAuthorized(["admin", "ce"]), updatePlan)
  .delete(bodyChecker, isAuthorized(["admin"]), deletePlan);
planRouter
  .route("/")
  .post(bodyChecker, isAuthorized(["admin"]), createPlan)
  .get(protectRoute, isAuthorized(["admin", "ce"]), getPlans);

async function getTop3Plans(req, res) {
  try {
    console.log("hello");

    let plans = await planModel.find()
      .sort("-ratingsAverage")
      .populate({ path: "reviews", select: "review" });

    console.log(plans);
    res.status(200).json({ plans: plans });
  } catch (err) {
    console.log(err);
    res.status(200).json({ message: err.message });
  }
}

module.exports = planRouter;
