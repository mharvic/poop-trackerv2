"use strict";

// validate that the current user is of the correct role to do a thing
const authorize = (role) => {
  return (req, res, next) => {
    // perform validations
    if (req.user && req.user.role === role) {
      next();
      // if it's good, pass to next
    } else {
      // otherwise throw a 403 error
      res.status(403).json({ message: "Access Denied" });
    }
  };
};

module.exports = authorize;