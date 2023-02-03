const jwt = require("jsonwebtoken");
const donenv = require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const fetchUser = (req, res, next) => {
  try {
    const authToken = req.header("auth-token");
    const validateToken = jwt.verify(authToken, JWT_SECRET);
    if (!validateToken) {
      return res.status(500).send("provide valid token for authentication");
    }
    req.user = validateToken.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "internal server error" });
  }
};

module.exports = fetchUser;
