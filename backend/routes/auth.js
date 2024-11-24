const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();
const SECRET_KEY = "your_secret_key";

// Register
router.post("/register", async (req, res) => {
  try {
    const { userid, name, pas } = req.body;
    const user = new User({ userid, name, pas });
    await user.save();
    res
      .status(201)
      .json({ heading: "Success", message: "User registered successfully!" });
  } catch (error) {
    res.status(400).json({ heading: "Faliour", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { userid, pas } = req.body;
    const user = await User.findOne({ userid });
    if (!user) throw new Error("User not found");
    const isMatch = await user.comparePassword(pas);
    if (!isMatch) throw new Error("Invalid password");
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "7d" });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
