const planModel = require("../models/planModel");
const express = require("express");
const planRouter = express.Router();
const protectRoute = require("./authHelper");

planRouter.route("/").get(getPlans).post(createPlan);
planRouter.route("/:id").get(getPlanById).patch(updatePlan).delete(deleteAllPlans);

// query params, sql injection
// localhost:8080/api/plan?select=name%price&page=1&sort=price&myquery={"price":{"$gt":200}}
async function getPlans(req, res) {
  try {
    // console.log(req.query);
    // sort fields
    // sort query
    // sort
    // paginate
    let ans = JSON.parse(req.query.myquery);
    console.log("ans", ans);
    let plansQuery = planModel.find(ans);
    let sortField = req.query.sort;
    let sortQuery = plansQuery.sort(`-${sortField}`);
    let params = req.query.select.split("%").join(" ");
    let filteredQuery = sortQuery.select(`${params} -_id`);
    // pagination
    // skip
    // limit
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 3;
    let toSkip = (page - 1) * limit;
    let paginatedResultPromise = filteredQuery.skip(toSkip).limit(limit);
    let result = await paginatedResultPromise;
    res.status(200).json({ message: "List of all the plans", plans: result });
  } catch (err) {
    res.status(500).json({ error: err.message, message: "can't get plans" });
  }
}

async function createPlan(req, res) {
  try {
    let plan = req.body;
    if (plan) {
      plan = await planModel.create(plan);
      res.status(200).json({ plan });
    } else res.status(404).json({ message: "Please enter data" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error!" });
  }
}

async function updatePlan(req, res) {
  try {
    await planModel.updateOne({ name }, req.body);
    let plan = await planModel.findOne({ name });
    res.status(200).json({ plan });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error!" });
  }
}

async function deleteAllPlans(req, res) {
  plan = {};
  res.status(200).json(plan);
}

async function getPlanById(req, res) {
  try {
    let id = req.params.id;
    let plan = await planModel.getElementById(id);
    res.status(200).json({ plan });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error!" });
  }
}

module.exports = planRouter;
