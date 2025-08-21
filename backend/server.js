// // server.js
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Example test API
// app.get("/api/hello", (req, res) => {
//   res.json({ message: "Hello from backend API 🚀" });
// });

// // Contact form API (POST)
// let messages = []; // stores messages in memory

// app.post("/api/contact", (req, res) => {
//   const { name, email, message } = req.body;

//   if (!name || !email || !message) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   const newMessage = { id: messages.length + 1, name, email, message };
//   messages.push(newMessage);

//   res.status(201).json({ success: true, data: newMessage });
// });

// // Get all messages (optional)
// app.get("/api/messages", (req, res) => {
//   res.json(messages);
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // loads .env

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files (index.html, admin.html, assets/*)
app.use(express.static(path.join(__dirname, '..')));

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/contactDB';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});

// Define Contact schema & model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  message: { type: String, default: '' },
  date: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', contactSchema);

// Routes

// POST /api/contact -> save a contact message
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, msg: 'Name and email are required' });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    return res.json({ success: true, msg: 'Message saved' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// GET /api/contacts -> list all messages (admin)
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    return res.json(contacts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// DELETE /api/contact/:id -> delete message by id
app.delete('/api/contact/:id', async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, msg: 'Message not found' });
    return res.json({ success: true, msg: 'Message deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Fallback: send index.html for root requests (optional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
