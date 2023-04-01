const express = require("express");
const userController = require("./../controllers/user");
const authController = require("./../controllers/auth");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.param("id", userController.checkId);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

module.exports = router;
