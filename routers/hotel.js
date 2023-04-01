const express = require("express");
const router = express.Router();
const hotelController = require("./../controllers/hotel");
const authController = require("./../controllers/auth");
const StaticData = require("./../utils/StaticData");

router.param("id", hotelController.checkHotelById);

router
  .route("/")
  .get(authController.protect, hotelController.getAllHotelsHandler)
  .post(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.hotelManager
    ),
    hotelController.createHotelHandler
  );

router
  .route("/:id")
  .get(authController.protect, hotelController.getHotelHandler)
  .delete(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.hotelManager
    ),
    hotelController.deleteHotelHandler
  )
  .patch(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.hotelManager
    ),
    hotelController.updateHotelHandler
  );

module.exports = router;
