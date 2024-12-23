const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
const { verifyToken } = require("../middleware/verifyToken");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

 
router.get("/protected-route", verifyToken, (req, res) => {
  res
    .status(200)
    .json({ message: "Access granted to protected route", user: req.user });
});

module.exports = router;
