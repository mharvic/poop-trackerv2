const express = require("express");
const authorize = require("../middleware/authorize");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/protected", authMiddleware, authorize("admin"), (req, res) => {
  res.status(200).json({ message: "Welcome admin user" });
});

module.exports = router;