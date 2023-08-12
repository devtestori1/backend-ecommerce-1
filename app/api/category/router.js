const express = require("express");
const {
  getAllCategory,
  createCategory,
  getOneCategory,
  updateCategory,
  deleteCategory,
} = require("./controller");
const {
  authenticateUser,
  authorizeRoles,
} = require("../../middleware/auth");
const router = express.Router();

router.get("/", getAllCategory);
router.get("/:id", getOneCategory);
router.put("/:id", authenticateUser, authorizeRoles("admin"), updateCategory);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteCategory);
router.post("/", authenticateUser, authorizeRoles("admin"), createCategory);

module.exports = router;