const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
require('dotenv').config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

// Register
router.post("/register", async (req, res) => {
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
router.post("/login", async (req, res) => {
  try {
    const { userid, pas } = req.body;
    const user = await User.findOne({ userid });
    if (!user) throw new Error("User not found");

    const isMatch = await argon2.verify(user.pas, pas);
    if (!isMatch) throw new Error("Invalid password");

    const userData = user.toObject();
    delete userData.pas;
    delete userData.__v;

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "7d" });
    if (!user.verified) {
      res.status(402).json({ title: "Error", message: "User is not verified yet\nContact admin for user verification" })
    }
    res.json({ title: "Success", token, user: userData, role: userData.role });
  } catch (error) {
    res.status(400).json({ title: "Error", message: error.message });
  }
});

module.exports = router;
