const express = require("express");
const router = express.Router();
const { getAllUser, getOneUser, updateInfoUser, deleteUser, disableOneUser} = require("./controller");
const uploadMiddleware = require('../../middleware/multer');
const {authenticateUser, authorizeRoles} = require("../../middleware/auth")

router.get("/", getAllUser);
router.get("/:id", getOneUser);
router.put("/disable-user/:id", disableOneUser);
router.delete("/:id", authenticateUser ,deleteUser);

router.put("/", uploadMiddleware.single('avatar') , authenticateUser, updateInfoUser);

module.exports = router