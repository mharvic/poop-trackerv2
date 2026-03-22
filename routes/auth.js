"use strict";
const express = require("express");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    
    const { username, password, role } = req.body;

    // hash the password with argon2
    const hashedPassword = await argon2.hash(password);

    //create a new user
    const newUser = new User({ username, password: hashedPassword, role });
    // save the user
    await newUser.save();

    // give a 201 message if it's cool
    res.status(201).json({ message: `New user created! ${username}` });
  } catch (error) {
    // if it goes wrong, log the error to he server
    res.status(500).json({ error: error.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    // get the data from the request username and password
    const { username, password } = req.body;

    // see if the user is in the database
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: `${username} not found` });

    // if they are in the db, verify the password with argon2
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    // Generate JWT to and use to verify user roles
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // if successful... say so :)
    res.status(200).json({ message: `${username} Login Successful`, token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

// Google Routes

router.get('/google', passport.authenticate('google', { scope: ['profile'], session: false }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {

    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.redirect(`/dashboard?token=${token}&role=${req.user.role}`);
  }
);

// Export our router
module.exports = router;