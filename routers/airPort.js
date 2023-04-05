const express = require("express");
const router = express.Router();
const StaticData = require("../utils/StaticData");
airPortController = require("./../controllers/airPort");
const authController = require("./../controllers/auth");

router
  .route("/")
  .get(authController.protect, airPortController.getAllAirPort)
  .post(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.flightManager
    ),
    airPortController.createAirPort
  );
router
  .route("/:id")
  .get(authController.protect, airPortController.getAirPortById)
  .patch(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.flightManager
    ),
    airPortController.updateAirPort
  )
  .delete(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.flightManager
    ),
    airPortController.deleteAirPort
  );
module.exports = router;
