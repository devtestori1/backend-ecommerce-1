const express = require("express");
const router = express.Router();
const { getAllUser, getOneUser, updateInfoUser, deleteUser} = require("./controller");
const uploadMiddleware = require('../../middleware/multer');


router.get("/", getAllUser);
router.get("/:id", getOneUser);
router.delete("/:id", deleteUser);

router.put("/", uploadMiddleware.single('avatar') ,updateInfoUser);

module.exports = router