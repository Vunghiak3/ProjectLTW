const express = require("express");
const router = express.Router();
const StaticData = require("../utils/StaticData");
flightController = require("./../controllers/Flight");

router
  .route("/")
  .get(flightController.getAllFlight)
  .post(flightController.createFlight);

router
  .route("/:id")
  .patch(flightController.updateFlight)
  .delete(flightController.deleteFlight);
router.route("/find").get(flightController.getFlightByLocation);

module.exports = router;
