const express = require("express");
const router = express.Router();
const roomController = require("./../controllers/room");
const authController = require("./../controllers/auth");
const StaticData = require("./../utils/StaticData");

router.param("id", roomController.checkRoomsById);

router
  .route("/")
  .get(authController.protect, roomController.getAllRoomsHandler)
  .post(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.hotelManager
    ),
    roomController.createRoomHandler
  );

router
  .route("/search")
  .get(authController.protect, roomController.findRoomsHandler);

router
  .route("/:id")
  .get(authController.protect, roomController.getRoomHandler)
  .delete(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.hotelManager
    ),
    roomController.deleteRoomHandler
  )
  .patch(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.hotelManager
    ),
    roomController.updateRoomHandler
  );

module.exports = router;
