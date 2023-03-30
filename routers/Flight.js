const express = require("express");
const router = express.Router();
const StaticData = require("../utils/StaticData");
flightController = require("./../controllers/Flight");

router.route("/find").get(flightController.getFlightByLocation);

module.exports = router;
