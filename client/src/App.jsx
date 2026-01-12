import { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Trash2, Search, Edit, BookOpen, ArrowLeft } from 'lucide-react'
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

  // --- VIEWS ---

  if (viewMode === 'note' && selectedNote) {
    return (
      <div className="view-container">
        <button className="back-btn" onClick={() => setViewMode('grid')}>
          <ArrowLeft size={20} /> Back to Notes
        </button>
        <div className="full-note">
          <h1 style={{ color: selectedNote.color }}>{selectedNote.title}</h1>
          <p>{selectedNote.content}</p>
        </div>
      </div>
    )
  }

  if (viewMode === 'create' || viewMode === 'edit') {
    const isEdit = viewMode === 'edit';
    return (
      <div className="form-overlay">
        <div className="form-card">
          <h2>{isEdit ? 'Edit Page' : 'Write a New Page'}</h2>
          <input className="form-input" value={isEdit ? editTitle : title} onChange={(e) => isEdit ? setEditTitle(e.target.value) : setTitle(e.target.value)} placeholder="Title..." />
          <textarea className="form-textarea" value={isEdit ? editContent : content} onChange={(e) => isEdit ? setEditContent(e.target.value) : setContent(e.target.value)} placeholder="Content..." />
          <div className="color-picker">
            <span>Color:</span>
            <input type="color" value={isEdit ? editColor : color} onChange={(e) => isEdit ? setEditColor(e.target.value) : setColor(e.target.value)} />
          </div>
          <div className="form-actions">
            <button onClick={() => setViewMode('grid')}>Cancel</button>
            <button className="submit-btn" onClick={isEdit ? () => {} : addNote}>{loading ? 'Saving...' : 'Add'}</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="main-container">
      <aside className="sidebar">
        <div className="sidebar-logo"><BookOpen size={28} /></div>
        <button onClick={() => setViewMode('create')} className="sidebar-add-btn"><Plus size={24} /></button>
      </aside>

      <main className="content-area">
        <div className="top-bar">
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <h1 className="section-title">Workstation</h1>

        <div className="bento-grid">
          {notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase())).map((note) => (
            <div key={note._id} className="bento-item page-curl" style={{ backgroundColor: note.color }} onClick={() => { setSelectedNote(note); setViewMode('note'); }}>
              <h3 className="note-title">{note.title}</h3>
              <div className="action-buttons">
                <button className="icon-btn" onClick={(e) => { e.stopPropagation(); setEditingNote(note); setEditTitle(note.title); setEditContent(note.content); setEditColor(note.color); setViewMode('edit'); }}><Edit size={14} /></button>
                <button className="icon-btn delete" onClick={(e) => { e.stopPropagation(); deleteNote(note._id); }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
export default App;