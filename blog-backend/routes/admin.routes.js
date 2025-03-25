const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { checkRole } = require("../middlewares/role.middleware");


router.patch("/update-role", verifyToken, checkRole(["Admin"]), adminController.updateUserRole);

module.exports = router;
router.get("/admin-only", verifyToken, checkRole(["Admin"]), (req, res) => {
    res.json({ message: "Bienvenue Admin !" });
  });
