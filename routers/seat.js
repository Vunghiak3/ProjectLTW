const express = require("express");
const router = express.Router();
const StaticData = require("../utils/StaticData");
seatController = require("./../controllers/seat");
const authController = require("./../controllers/auth");
router
  .route("/")
  .get(authController.protect, seatController.getAllSeats)
  .post(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.flightManager
    ),
    seatController.createSeat
  );
router
  .route("/:id")
  .get(authController.protect, seatController.getSeatById)
  .delete(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.flightManager
    ),
    seatController.deleteBySeatId
  )
  .patch(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.flightManager
    ),
    seatController.updateSeat
  );
module.exports = router;
