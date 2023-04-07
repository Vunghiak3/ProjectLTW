const express = require("express");
const router = express.Router();
const authController = require("./../controllers/auth");
const bookingroomController = require("./../controllers/bookingrooms");
const StaticData = require("./../utils/StaticData");

router.param("id", bookingroomController.checkRoomById);

router
  .route("/")
  .get(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.hotelManager
    ),
    bookingroomController.getAllBookingRoomsHandler
  );

router
  .route("/userid/all")
  .get(
    authController.protect,
    bookingroomController.getAllBookingRoomsOfUserLoginHandler
  );

router
  .route("/room")
  .post(authController.protect, bookingroomController.bookRoomHandler);

router
  .route("/room/:id")
  .patch(authController.protect, bookingroomController.cancelRoomHandler);

router
  .route("/:id")
  .delete(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.hotelManager
    ),
    bookingroomController.deleteBookingRoomHandler
  )
  .patch(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.hotelManager
    ),
    bookingroomController.updateBookingRoomHandler
  )
  .get(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.hotelManager
    ),
    bookingroomController.getBookRoomHandler
  );

module.exports = router;
