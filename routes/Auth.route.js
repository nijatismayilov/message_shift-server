const express = require("express");
const AuthController = require("../controllers/Auth.controller");

const router = express.Router();

router.post("/SignUp", AuthController.signUp);

router.post("/SignIn", AuthController.signIn);

router.post("/RefreshToken", AuthController.refreshToken);

router.delete("/SignOut", AuthController.signOut);

module.exports = router;
