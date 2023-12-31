const express = require("express");
const router = express.Router();

//Define Routes
router.use("/meals", require("./meals"));
router.use("/auth", require("./auth"));
router.use("/users", require("./users"));

module.exports = router;
