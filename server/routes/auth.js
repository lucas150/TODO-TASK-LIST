const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
require("../db/conn");
const User = require("../models/userSchema");

router.get("/", async (req, res) => {
  res.json("hello!there");
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(422)
      .json({ error: "Please provide all required fields" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email already exists" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({ username, email, password: hashedPassword });

    const userRegister = await user.save();

    if (userRegister) {
      res.status(201).json({ message: "Successfully registered" });
    } else {
      res.status(500).json({ error: "Registration failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/login", async (req, res) => {
  res.json("hello!there");
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(422)
        .json({ error: "Please provide email and password" });
    }

    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      const token = await userLogin.generateAuthToken();

      res.cookie("jwtoken", token, {
        // 30 days
        expires: new Date(Date.now() + 2592000000),
        httpOnly: true,
      });

      res.status(200).json({ message: "User login successful" });
    } else {
      res.status(400).json({ error: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
