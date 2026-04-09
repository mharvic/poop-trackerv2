"use strict";

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { body, validationResult } = require("express-validator");
const { encryptData, decryptData } = require("../utilities/encryption");

const User = require("../models/User");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5173/api/auth/google/callback"
  }, 
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = new User({
          username: profile.displayName,
          googleId: profile.id,
          role: 'user'
        });
        await user.save();
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
}));

router.get('/google', passport.authenticate('google', { scope: ['profile'], session: false }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const accessToken = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.redirect(`/dashboard?token=${accessToken}&role=${req.user.role}`);
  }
);

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.password) {
        return res.status(400).json({ message: "Please log in with Google." });
    }

    const isMatch = await argon2.verify(user.password, password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // Generate Tokens
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: req.secure,  
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: "Login successful",
      token: accessToken, 
      role: user.role
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

//pulling the user data on the database

router.get("/me", async (req, res) => {
  try {
  
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      email: user.email ? decryptData(user.email) : "", // send empty string or blank if they don't have an email.
      bio: user.bio ? decryptData(user.bio) : "",
      role: user.role
    });

  } catch (error) {
    console.error("Token Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

router.post("/update", [

  body("username")
    .isLength({ min: 3, max: 50 }).withMessage("Name must be between 3 and 50 characters.")
    .escape(),
  
  body("email")
    .isEmail().withMessage("Please enter a valid email address.")
    .normalizeEmail(),
  
  body("bio")
    .optional({ checkFalsy: true })
    .isLength({ max: 500 }).withMessage("Bio cannot exceed 500 characters.")
    .escape()
], async (req, res) => {
  try {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
    }

    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access Denied: No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    const { username, email, bio } = req.body;

    
    const safeEmail = encryptData(email);
    const safeBio = encryptData(bio);

    const updatedUser = await User.findByIdAndUpdate(decoded.id, {
      username: username,
      email: safeEmail,
      bio: safeBio
    }, { new: true });

    res.json({ message: "Profile securely updated!" });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error during update" });
  }
});

module.exports = router;