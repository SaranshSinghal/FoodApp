module.exports.createElement = function (elementModel) {
  return async function (req, res) {
    try {
      let element = req.body;

      if (element) {
        element = await elementModel.create(element);
        res.status(200).json({ element });
      } else res.status(403).json({ message: "Please enter data" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  };
};

// query params, sql injection
// localhost:8080/api/plan?select=name%price&page=1&sort=price&myquery={"price":{"$gt":200}}
module.exports.getElements = function (elementModel) {
  return async function (req, res) {
    try {
      // console.log(req.query);
      // sort fields
      // sort query
      // sort
      // paginate
      let ans = JSON.parse(req.query.myquery);
      console.log("ans", ans);
      let elementsQuery = elementModel.find(ans);
      let sortField = req.query.sort;
      let sortQuery = elementsQuery.sort(`-${sortField}`);
      let params = req.query.select.split("%").join(" ");
      let fileteredQuery = sortQuery.select(`${params} -_id`);
      // pagination
      // skip
      // limit
      let page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || 3;
      let toSkip = (page - 1) * limit;
      let paginatedResultPromise = fileteredQuery.skip(toSkip).limit(limit);
      let result = await paginatedResultPromise;

      res
        .status(200)
        .json({ message: "List of all the Elements", elements: result });
    } catch (err) {
      res
        .status(500)
        .json({ error: err.message, message: "can't get elements" });
    }
  };
};

module.exports.updateElement = function (elementModel) {
  return async function (req, res) {
    let { id } = req.body;

    try {
      let element = await elementModel.findById(id);

      if (element) {
        delete req.body.id;
        for (let key in req.body) element[key] = re.body[key];
        await element.save();
        res.status(200).json({ element });
      } else res.status(404).json({ message: "resource not found" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports.deleteElement = function (elementModel) {
  return async function (req, res) {
    let { id } = req.body;

    try {
      let element = await elementModel.findByIdAndRemove(id, req.body);
      if (!element) res.status(404).json({ message: "resource not found" });
      else res.status(200).json({ element });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports.getElementById = function (elementModel) {
  return async function (req, res) {
    try {
      let id = req.params.id;
      let element = await elementModel.findById(id);
      res.status(200).json({ element });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  };
};
