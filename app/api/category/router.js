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
router.put("/:id", authenticateUser, updateCategory);
router.delete("/:id", authenticateUser, deleteCategory);
router.post("/", authenticateUser, createCategory);

module.exports = router;