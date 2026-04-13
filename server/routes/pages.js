"use strict";
const express = require("express");
const path = require("path");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const basePath = path.join(__dirname, "../../client/public/pages");

router.get("/", (req, res) => {
  res.sendFile(path.join(basePath, "index.html"));
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(basePath, "register.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(basePath, "login.html"));
});

router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(basePath, "dashboard.html"));
});

router.get("/admin-dashboard", (req, res) => {
  res.sendFile(path.join(basePath, "admin-dashboard.html"));
});

//test!!
router.get("/dashboard", authMiddleware, async (req, res) => {
  console.log("STEP 1: Dashboard route hit");

  try {
    res.send("Dashboard is working"); 
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;