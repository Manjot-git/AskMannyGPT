// import express from "express";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import User from "../models/User.js";

// const router = express.Router();

// const createToken = (user) => {
//   return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
// };

// router.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ error: "Email already exists" });

//     const hashed = await bcrypt.hash(password, 10); // hash password
//     const user = new User({ name, email, password: hashed });
//     await user.save();

//     const token = createToken(user);
//     res.json({success: true, token, user: { id: user._id, name: user.name, email: user.email } });
//   } catch (err) {
//     res.status(500).json({ error: "Signup failed" });
//   }
// });

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ error: "Invalid credentials" });

//     const token = createToken(user);
//     res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
//   } catch (err) {
//     res.status(500).json({ error: "Login failed" });
//   }
// });

// export default router;
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

const createToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const user = new User({ name, email, password }); // don't hash here
    await user.save(); // pre("save") hook in model will hash

    const token = createToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "All fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);

    //remove later
    // console.log("Login password:", password);
    // console.log("Stored hash:", user.password);
    // console.log("Password match:", match);

    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = createToken(user);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
