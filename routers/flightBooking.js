const express = require("express");
const router = express.Router();
flightBookingController = require("./../controllers/flightBooking");
const StaticData = require("../utils/StaticData");
const authController = require("./../controllers/auth");

router.route("/").get(
  // authController.protect,
  // authController.restricTo(
  //   StaticData.AUTH.Role.admin,
  //   StaticData.AUTH.Role.flightManager
  // ),
  flightBookingController.getAllBooking
);

router
  .route("/:id")
  .get(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.flightManager
    ),
    flightBookingController.getBookingById
  )
  .patch(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.flightManager
    ),
    flightBookingController.updateBooking
  )
  .delete(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.flightManager
    ),
    flightBookingController.deleteBooking
  );
router
  .route("/user/booking")
  .get(authController.protect, flightBookingController.getBookingByUserID)
  .post(authController.protect, flightBookingController.createBooking);
router
  .route("/user/booking/:id")
  .patch(authController.protect, flightBookingController.CancelBooking);
module.exports = router;
