const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Required for file paths

const app = express();
app.use(express.json());
app.use(cors());

// 1. DATABASE CONNECTION
// Switched from localhost to process.env.MONGO_URI for deployment
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notes-db';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ Connection error', err));

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  color: { type: String, default: '#FFF9C4' },
  pinned: { type: Boolean, default: false },
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

// 2. API ROUTES
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const { title, content, color } = req.body;
    const newNote = new Note({ title, content, color });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

app.patch('/api/notes/:id', async (req, res) => {
  try {
    const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// 3. SERVING THE FRONTEND (SINGLE URL LOGIC)
// This tells Express to serve your built React files from the client folder
app.use(express.static(path.join(__dirname, '../client/dist')));

// This handles the "Back" button and navigation by routing all non-API requests to React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));