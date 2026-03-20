"use strict";
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const pageRoutes = require("./routes/pages");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// serve static files

app.use(express.static(path.join(__dirname, "public")));

// set up the router
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/", pageRoutes);

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MONGO CONNECTION ERROR: ", error);
    process.exit(1);
  }
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});