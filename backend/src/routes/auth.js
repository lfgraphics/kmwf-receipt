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
  const { userid, name, pas, phoneNo, role } = req.body;
  try {
    const hashedPassword = await argon2.hash(pas);
    const user = new User({ userid, name, phoneNo, pas: hashedPassword, role });
    await user.save();
    res.status(201).json({ heading: "Success", message: "User registered successfully!" });
  } catch (error) {
    res.status(400).json({ heading: "Failure", error: error.message });
  }
});

// Login
router.post("/login", createRateLimiter({ windowMs: 15 * 60 * 1000, max: 3 }), async (req, res) => {
  try {
    const { phoneNo, pas } = req.body;
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
    const refreshToken = jwt.sign({ id: user._id, role: user.role }, REFRESH_SECRET_KEY, { expiresIn: "90d" });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
    });

    const userData = user.toObject();
    delete userData.pas;
    delete userData.__v;

    res.json({ title: "Success", user: userData, role: user.role });
  } catch (error) {
    res.status(400).json({ title: "Error", message: error.message });
  }
});

router.post("/verify-token", createRateLimiter({ windowMs: 5 * 60 * 1000, max: 7 }), async (req, res) => {
  try {
    const token = req.cookies.authToken;
    if (!token) throw new Error("No token provided");

    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, message: "Invalid or expired token" });
  }
});

router.post("/refresh-token", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new Error("No refresh token provided");

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
    const newToken = jwt.sign({ id: decoded.id, role: decoded.role }, SECRET_KEY, { expiresIn: "7d" });

    res.cookie("authToken", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.json({ message: "Token refreshed" });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
});



module.exports = router;
