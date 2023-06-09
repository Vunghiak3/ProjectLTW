const express = require("express");
const router = express.Router();
const StaticData = require("../utils/StaticData");
flightController = require("./../controllers/Flight");
const authController = require("./../controllers/auth");
router
  .route("/")
  .get(authController.protect, flightController.getAllFlight)
  .post(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.flightManager
    ),
    flightController.createFlight
  );

router
  .route("/:id")
  .get(authController.protect, flightController.getFlightById)
  .patch(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.flightManager
    ),
    flightController.updateFlight
  )
  .delete(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.flightManager
    ),
    flightController.deleteFlight
  );
router
  .route("/find")
  .get(authController.protect, flightController.getFlightByLocation);

module.exports = router;
