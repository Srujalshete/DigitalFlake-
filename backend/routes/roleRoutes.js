const express = require("express");
const router = express.Router();
const roleController = require("../controllers/rolesController");

router.post("/add", roleController.addRole);
router.get("/read", roleController.getRoles);
router.get("/read/:id", roleController.getRoleById);
router.put("/update/:id", roleController.updateRole);
router.delete("/roles/:id", roleController.deleteRole);

module.exports = router;
