const express = require("express");
const User = require("../models/User.model");

const UsersController = require("../controllers/Users.controller");

const router = express.Router();

router.get("/LoadDetails", UsersController.loadDetails);

module.exports = router;
