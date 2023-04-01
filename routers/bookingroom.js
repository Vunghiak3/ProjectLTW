const express = require("express");
const router = express.Router();
const authController = require("./../controllers/auth");
const bookingroomController = require("./../controllers/bookingrooms");
const StaticData = require("./../utils/StaticData");

router
  .route("/")
  .get(authController.protect, bookingroomController.getAllBookingRooms)
  .post(authController.protect, bookingroomController.createBookingRoom);

// router
//   .route("/search")
//   .get(authController.protect, bookingroomController.findRoom);

module.exports = router;
