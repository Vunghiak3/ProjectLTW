const express = require("express");
const router = express.Router();
flightBookingController = require("./../controllers/flightBooking");
const StaticData = require("../utils/StaticData");
const authController = require("./../controllers/auth");

router
  .route("/")
  .get(authController.protect, flightBookingController.getAllBooking)
  .post(authController.protect, flightBookingController.createBooking);

router
  .route("/:id")
  .get(authController.protect, flightBookingController.getBookingById)
  .patch(authController.protect, flightBookingController.updateBooking)
  .delete(authController.protect, flightBookingController.deleteBooking);

module.exports = router;
