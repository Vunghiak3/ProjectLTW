const express = require("express");
const router = express.Router();
const roomController = require("./../controllers/room");

router.param("id", roomController.checkRoomsById);

router
  .route("/")
  .get(roomController.getAllRoomsHandler)
  .post(roomController.createRoomHandler);

router
  .route("/:id")
  .get(roomController.getRoomHandler)
  .delete(roomController.deleteRoomHandler)
  .patch(roomController.updateRoomHandler);

module.exports = router;
