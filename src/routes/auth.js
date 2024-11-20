const express = require("express");
const { signUp, login, logout } = require("../controllers/authController");
const { userAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/signUp", signUp);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
