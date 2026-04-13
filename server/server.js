"use strict";

const path = require("path");
const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const csrf = require("csurf");
const rateLimit = require("express-rate-limit"); 
const jwt = require("jsonwebtoken");


const mongoose = require("mongoose");

const app = express();

// middleware
app.use(cookieParser());
app.use(express.json());

app.use(
  helmet({
    hsts: false 
  })
);

const isProduction = process.env.NODE_ENV === "production";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Try again later."
});
app.use("/api/auth/login", loginLimiter);

const csrfProtection = csrf({ cookie: true });

app.use("/api/auth/login", (req, res, next) => next());
app.use((req, res, next) => {
  if (req.path === "/api/auth/login") return next();
  csrfProtection(req, res, next);
});
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected"))
  .catch(err => console.error(" Mongo error:", err));

const publicPath = path.join(__dirname, "../client/public");

// serve static
app.use(express.static(publicPath));

const pageRoutes = require("./routes/pages");
const authRoutes = require("./routes/auth");

app.use("/", pageRoutes);
app.use("/api/auth", authRoutes);

// test
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from server" });
});

// fallback
app.use((req, res) => {
  res.status(404).send("Not found");
});

// ports
const PORT_HTTP = 3000;
const PORT_HTTPS = 3443;

http.createServer(app).listen(PORT_HTTP, () => {
  console.log(`🌐 HTTP running at http://localhost:${PORT_HTTP}`);
});

const certPath = path.join(__dirname, "certs");

if (
  fs.existsSync(path.join(certPath, "private-key.pem")) &&
  fs.existsSync(path.join(certPath, "certificate.pem"))
) {
  const httpsOptions = {
    key: fs.readFileSync(path.join(certPath, "private-key.pem")),
    cert: fs.readFileSync(path.join(certPath, "certificate.pem")),
  };

  https.createServer(httpsOptions, app).listen(PORT_HTTPS, () => {
    console.log(`🔒 HTTPS running at https://localhost:${PORT_HTTPS}`);
  });
} else {
  console.log("⚠️ No HTTPS certs found (3443 won't work)");
}