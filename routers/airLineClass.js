const express = require("express");
const router = express.Router();
const StaticData = require("../utils/StaticData");
ClassController = require("./../controllers/airLineClass");
const authController = require("./../controllers/auth");

router
  .route("/")
  .get(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.flightManager
    ),
    ClassController.getAllClass
  )
  .post(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.flightManager
    ),
    ClassController.createClass
  );
router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.flightManager
    ),
    ClassController.updateClass
  )
  .delete(
    authController.protect,
    authController.restricTo(
      StaticData.AUTH.Role.admin,
      StaticData.AUTH.Role.flightManager
    ),
    ClassController.deleteClass
  );
module.exports = router;
