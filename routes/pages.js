"use strict";
const express = require("express");
const path = require("path");
const router = express.Router();

// Home Page
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/index.html"));
});

// Register Page
router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/register.html"));
});

// Login Page
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/login.html"));
});

// Dashboard Page
router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/dashboard.html"));
});

// Admin Dashboard Page
router.get("/admin-dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/admin-dashboard.html"));
});

module.exports = router;