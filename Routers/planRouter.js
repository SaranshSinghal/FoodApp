const planModel = require("../models/planModel");
const express = require("express");
const planRouter = express.Router();
const protectRoute = require("./authHelper");
const factory = require("../helpers/factory");

planRouter.use(protectRoute);
planRouter.route("/").get(getPlans).post(createPlan);
planRouter.route("/:id").get(getPlanById).patch(updatePlan).delete(deletePlan);

const createPlan = factory.createElement(planModel);
const getPlans = factory.getElements(planModel);
const updatePlan = factory.updateElement(planModel);
const deletePlan = factory.deleteElement(planModel);
const getPlanById = factory.getElementById(planModel);

module.exports = planRouter;
