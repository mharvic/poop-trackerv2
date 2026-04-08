"use strict";
const express = require("express");
const path = require("path");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const basePath = path.join(__dirname, "../../client/public/pages");

const User = require("../models/User");

router.get("/", (req, res) => {
  res.sendFile(path.join(basePath, "index.html"));
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(basePath, "register.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(basePath, "login.html"));
});

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.render("dashboard", {
      user: user
    });

  } catch (err) {
    return res.redirect("/login");
  }
});

router.get("/admin-dashboard", (req, res) => {
  res.sendFile(path.join(basePath, "admin-dashboard.html"));
});

module.exports = router;