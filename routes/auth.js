let express = require("express");
let router = express.Router();
const donenv = require("dotenv").config();
let User = require("../models/User");

const { body, validationResult } = require("express-validator");

const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const fetchUser = require("../middleware/fetchUser");

// route for signup user
router.post(
  "/signup",
  // code for credetacial validation using express validator middleware
  [
    body("email", "please enter valid email address").isEmail(),
    body("name", "please enter valid name").isLength({ min: 3 }),
    body("password", "password must be alteast 5 charecter long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // express validator error handler
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(500)
          .json({ err: `user already exist with ${user.email} email address` });
      }

      // here we use bcrypt npm package for password hashing
      const salt = await bcryptjs.genSalt(10);
      const securePassword = await bcryptjs.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });

      // here we use jsonwebtoken npm package for securing client serve connection
      const data = {
        user: {
          id: user._id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.status(200).send({ authToken: authToken });
    } catch (err) {
      res.send(err.message);
    }
  }
);

// route for login user user
router.post(
  "/login",
  // code for credetacial validation using express validator middleware
  [
    body("email", "please enter valid email address").isEmail(),
    body("password", "please fill the password").exists(),
  ],
  async (req, res) => {
    // express validator error handler
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let { email, password } = req.body;
      let user = await User.findOne({ email: email });
      let success = false;
      if (!user) {
        return res.status(400).json({ err: "User not found!" });
      }

      // here we compare password using bcrypt npm package because we use bcypt for signup also

      const checkPassword = await bcryptjs.compare(password, user.password);
      if (!checkPassword) {
        return res.status(400).json({ err: "please enter valid password!" });
      }

      // here we use jsonwebtoken npm package for securing client serve connection
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.send({ authToken: authToken });
    } catch (err) {
      res.send(err.message);
    }
  }
);

router.post("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await User.findById(userId).select("-password");
    if (!userData) {
      res.status(401).send({ error: "internal server error" });
    }
    res.status(200).send(userData);
  } catch (err) {
    res.status(401).send({ error: "internal server error" });
  }
});

module.exports = router;
