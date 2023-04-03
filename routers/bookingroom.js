const express = require("express");
const router = express.Router();
const authController = require("./../controllers/auth");
const bookingroomController = require("./../controllers/bookingrooms");
const StaticData = require("./../utils/StaticData");

router.param("id", bookingroomController.checkHotelById);

router
  .route("/")
  .get(authController.protect, bookingroomController.getAllBookingRoomsHandler)
  .post(authController.protect, bookingroomController.createBookingRoomHandler);

router
  .route("/:id")
  .delete(
    authController.protect,
    bookingroomController.deleteBookingRoomHandler
  )
  .patch(authController.protect, bookingroomController.updateBookingRoomHandler)
  .get(authController.protect, bookingroomController.getBookRoomHandler);

module.exports = router;
