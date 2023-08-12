const express = require("express")
const router = express.Router()

const {signin,signup, signinAdmin} = require("./controller")

router.post("/signin", signin);
router.post("/signin-admin", signinAdmin);
router.post("/signup", signup);

module.exports = router