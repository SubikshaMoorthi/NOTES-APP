const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB (This creates a DB named 'notes-db' automatically)
mongoose.connect('mongodb://127.0.0.1:27017/notes-db')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ Connection error', err));

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  color: { type: String, default: '#FFF9C4' },
  pinned: { type: Boolean, default: false },
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

// Health check
app.get('/', (req, res) => res.send({ status: 'ok' }));

// API Routes with basic logging and error handling
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error('GET /api/notes error:', err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    console.log('POST /api/notes body:', req.body);
    const { title, content, color } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const newNote = new Note({ title, content, color });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    console.error('POST /api/notes error:', err);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Note.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('DELETE /api/notes/:id error:', err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Update note (partial)
app.patch('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await Note.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: 'Note not found' });
    res.json(updated);
  } catch (err) {
    console.error('PATCH /api/notes/:id error:', err);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));