const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();


router.post("/register",async (req, res) => {
  const { name, email, password } = req.body;

  if (await User.findOne({ email })) return res.sendStatus(400);
  const hash = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hash });
  res.sendStatus(200);
 
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) return res.sendStatus(400);
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
  console.log(" Token generated:", token);

});

module.exports = router;