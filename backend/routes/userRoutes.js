const express = require("express");
const userController = require("../controllers/userControllers");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/role", userController.getRoles);
router.get("/data", userController.getUsers);
router.get("/data/:id", userController.getUserById);
router.post("/create-user", upload.single("profile_image"), userController.createUser);
router.put("/update-user/:id", upload.single("profile_image"), userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

module.exports = router;
