const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  let token = null;

  const authHeader = req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.replace("Bearer ", "");
  } 

  else if (req.query.token) {
    token = req.query.token;
  }

  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.redirect("/login");
  }
};

module.exports = authMiddleware;