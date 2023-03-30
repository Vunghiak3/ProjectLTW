const express = require("express");
const router = express.Router();
const hotelController = require("./../controllers/hotel");

router.param("id", hotelController.checkHotelById);

router
  .route("/")
  .get(hotelController.getAllHotelsHandler)
  .post(hotelController.createHotelHandler);

router
  .route("/:id")
  .get(hotelController.getHotelHandler)
  .delete(hotelController.deleteHotelHandler)
  .patch(hotelController.updateHotelHandler);

module.exports = router;
