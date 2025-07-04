const express = require('express');
const cors = require('cors');
const connectDB = require('./DB/dbConnection');
const User = require('./DB/user');

const app = express();
const port = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Register
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).send("Username already exists");

    const newUser = new User({ username, password });
    await newUser.save();

    res.send("User registered");
  } catch (err) {
    console.error(err);
    res.status(500).send("Registration error");
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
