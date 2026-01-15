import { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Trash2, Search, Edit, ArrowLeft } from 'lucide-react'
import './App.css'

function App() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState('#E6E6FA')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedNote, setSelectedNote] = useState(null)
  const [editingNote, setEditingNote] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editColor, setEditColor] = useState('#E6E6FA')

  const API_URL = 'http://localhost:5000/api/notes'

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_URL)
      setNotes(response.data)
    } catch (error) { console.error('Error fetching notes:', error) }
  }

  useEffect(() => { fetchNotes() }, [])

  const addNote = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      await axios.post(API_URL, { title, content, color })
      await fetchNotes()
      setTitle(''); setContent(''); setViewMode('grid')
    } catch (error) { console.error(error) }
    setLoading(false)
  }

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      await fetchNotes()
    } catch (error) { console.error(error) }
  }

  const updateNote = async (e) => {
    e.preventDefault()
    try {
      await axios.patch(`${API_URL}/${editingNote._id}`, { title: editTitle, content: editContent, color: editColor })
      await fetchNotes()
      setEditingNote(null); setViewMode('grid')
    } catch (error) { console.error(error) }
  }

  // --- VIEW: Full Note Content (TITLE REMOVED) ---
  if (viewMode === 'note' && selectedNote) {
    return (
      <div className="main-container">
        <div className="view-container">
          <button className="back-btn-modern" onClick={() => setViewMode('grid')}>
            <ArrowLeft size={18} /> Back
          </button>
          <div className="full-note-content">
            {/* Title is hidden here, only showing the body text */}
            <p className="note-body-display">{selectedNote.content}</p>
          </div>
        </div>
      </div>
    )
  }

  // --- VIEW: Create/Edit Form ---
  if (viewMode === 'create' || viewMode === 'edit') {
    const isEdit = viewMode === 'edit';
    return (
      <div className="form-overlay">
        <div className="form-card">
          <h2>{isEdit ? 'Update Your Thoughts' : 'Write a New Page'}</h2>
          <input className="form-input" value={isEdit ? editTitle : title} onChange={(e) => isEdit ? setEditTitle(e.target.value) : setTitle(e.target.value)} placeholder="Chapter title..." />
          <textarea className="form-textarea" value={isEdit ? editContent : content} onChange={(e) => isEdit ? setEditContent(e.target.value) : setContent(e.target.value)} placeholder="Pour your thoughts here..." />
          <div className="color-picker-row">
            <span className="label">Page Color:</span>
            <input type="color" value={isEdit ? editColor : color} onChange={(e) => isEdit ? setEditColor(e.target.value) : setColor(e.target.value)} className="color-input" />
          </div>
          <div className="form-actions-aligned">
            <button className="cancel-btn" onClick={() => setViewMode('grid')}>Cancel</button>
            <button className="submit-btn" onClick={isEdit ? updateNote : addNote}>
              {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Add to Book')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --- VIEW: Grid Dashboard (TITLE SHOWN HERE) ---
  return (
    <div className="main-container">
      <main className="content-area">
        <div className="top-nav">
          <div className="search-bar-aligned">
            <Search className="search-icon" size={18} />
            <input placeholder="Search through your pages..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setViewMode('create')} className="add-btn-circular">
            <Plus size={24} />
          </button>
        </div>

        <h1 className="dashboard-title">My Book</h1>

        <div className="bento-grid">
          {notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase())).map((note) => (
            <div key={note._id} className="bento-item page-curl" style={{ backgroundColor: note.color }} onClick={() => { setSelectedNote(note); setViewMode('note'); }}>
              <h3 className="note-title-white">{note.title}</h3>
              <div className="action-row">
                <button className="icon-btn-blur" onClick={(e) => { e.stopPropagation(); setEditingNote(note); setEditTitle(note.title); setEditContent(note.content); setEditColor(note.color); setViewMode('edit'); }}><Edit size={14} /></button>
                <button className="icon-btn-blur delete-hover" onClick={(e) => { e.stopPropagation(); deleteNote(note._id); }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
export default App;