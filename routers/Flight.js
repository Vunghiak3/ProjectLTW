const express = require("express");
const router = express.Router();
const StaticData = require("../utils/StaticData");
flightController = require("./../controllers/Flight");

router
  .route("/:dateOfDepartment/:fromLocation/:toLocation")
  .get(flightController.getFlights);

module.exports = router;
