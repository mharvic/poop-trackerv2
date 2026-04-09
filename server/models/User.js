"use strict";
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  googleId: { 
    type: String, 
    required: false
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  email: {
    type: String
   }, 
  bio: {
    type: String 
  }
});

module.exports = mongoose.model("User", UserSchema);