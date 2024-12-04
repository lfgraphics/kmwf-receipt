const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const createRateLimiter = require('../middleware/rateLimiter')
require('dotenv').config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

// Register
router.post("/signup", createRateLimiter({ windowMs: 15 * 60 * 1000, max: 3 }), async (req, res) => {
  const { name, pas, phoneNo, } = req.body;
  try {
    const hashedPassword = await argon2.hash(pas);
    const user = new User({ name, phoneNo, pas: hashedPassword, role:"user" });
    await user.save();
    res.status(201).json({ heading: "Success", message: "User registered successfully!" });
  } catch (error) {
    console.error(error)
    res.status(400).json({ heading: "Failure", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { phoneNo, pas, isWeb } = req.body;
    const user = await User.findOne({ phoneNo });
    if (!user) throw new Error("User not found");

    const isMatch = await argon2.verify(user.pas, pas);
    if (!isMatch) throw new Error("Invalid password");

    if (!user.verified) {
      return res.status(402).json({
        title: "Error",
        message: "User is not verified yet\nContact admin for user verification",
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "7d" });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && req.secure, // Only use `secure` in production
      sameSite: process.env.NODE_ENV === "production" ? 'None' : 'Lax', // Use 'Lax' for local development
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userData = user.toObject();
    delete userData.pas;
    delete userData.__v;
    delete userData.createdAt;

    res.json({ title: "Success", user: userData, role: user.role, ...(!isWeb && { token }) });
  } catch (error) {
    console.error(error)
    res.status(400).json({ title: "Error", message: error.message });
  }
});

router.post("/verify-token", createRateLimiter({ windowMs: 5 * 60 * 1000, max: 7 }), async (req, res) => {
  try {
    console.log(req.cookies)
    const token = (req.headers.authorization && req.headers.authorization.split(" ")[1]) || req.cookies.token;
    if (!token) throw new Error("No token provided");

    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, message: "Invalid or expired token" });
    console.log(error)
  }
});

module.exports = router;
