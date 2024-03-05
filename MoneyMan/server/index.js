const path = require("node:path")
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

mongoose.connect("mongodb+srv://womp:Womp@cluster0.3znw9ak.mongodb.net/niggam_alala", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  currency: Number
});
const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("build"));

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Brukernavn fins allerede' });
    }

    const newUser = new User({
      username: username,
      email: email,
      password: password,
      currency: 500,
    });
    await newUser.save();

    res.status(201).json({ message: 'Bruker opprettet' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Kunne ikke lage bruker' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ error: 'Feil brukernavn eller passord' });
    }

    res.status(200).json({ message: 'Du er logget inn' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/currency", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.query.username });
    if (!user) {
      return res.status(404).json({ error: 'Bruker ikke funnet' });
    }
    res.status(200).json({ currency: user.currency });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, 'username');
    if (!users) {
      return res.status(404).json({ error: 'No users found' });
    }
    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/transfer', async (req, res) => {
  const { sender, recipient, amount } = req.body;

  try {
    const senderUser = await User.findOne({ username: sender });
    const recipientUser = await User.findOne({ username: recipient });
    if (!senderUser || !recipientUser) {
      return res.status(404).json({ error: 'Sender or recipient not found' });
    }
    if (senderUser.currency < amount) {
      return res.status(400).json({ error: 'Sender does not have enough currency for the transfer' });
    }
    senderUser.currency -= amount;
    recipientUser.currency += amount;
    await senderUser.save();
    await recipientUser.save();

    res.status(200).json({ message: 'Currency transfer successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve("./build/index.html"));
});

//  "proxy": "http://localhost:8080" 