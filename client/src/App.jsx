import { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Trash2, Search, Edit } from 'lucide-react'
import './App.css'

function App() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState('#E6E6FA')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedNote, setSelectedNote] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [editingNote, setEditingNote] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editColor, setEditColor] = useState('#E6E6FA')

  const API_URL = 'http://localhost:5000/api/notes'

  // Fetch notes
  const fetchNotes = async () => {
    try {
      console.log('Fetching notes from:', API_URL)
      const response = await axios.get(API_URL)
      console.log('API Response:', response.data)
      setNotes(response.data)
    } catch (error) {
      console.error('Error fetching notes:', error)
      console.error('Error details:', error.response?.data || error.message)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line
    fetchNotes()
  }, [])

  // Add note
  const addNote = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setLoading(true)
    try {
      await axios.post(API_URL, { title, content, color })
      // refresh list to keep ordering and server timestamps
      await fetchNotes()
      setTitle('')
      setContent('')
      setColor('#E6E6FA')
      setViewMode('grid')
    } catch (error) {
      console.error('Error adding note:', error)
    }
    setLoading(false)
  }

  // Delete note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      await fetchNotes()
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  // Update note
  const updateNote = async (e) => {
    e.preventDefault()
    if (!editTitle.trim() || !editContent.trim()) return

    try {
      await axios.patch(`${API_URL}/${editingNote._id}`, { title: editTitle, content: editContent, color: editColor })
      await fetchNotes()
      setEditingNote(null)
      setEditTitle('')
      setEditContent('')
      setEditColor('#E6E6FA')
      setViewMode('grid')
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  if (viewMode === 'note') {
    return (
      <div className="min-h-screen bg-gray-800 text-gray-100 p-6">
        <button onClick={() => { setViewMode('grid'); setSelectedNote(null); }} className="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2">
          ← Back to Notes
        </button>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-100">{selectedNote.title}</h1>
          <p className="text-gray-300 text-lg leading-relaxed">{selectedNote.content}</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'edit') {
    return (
      <div className="min-h-screen bg-gray-800 text-gray-100 p-6">
        <button onClick={() => { setViewMode('grid'); setEditingNote(null); setEditTitle(''); setEditContent(''); setEditColor('#E6E6FA'); }} className="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2">
          ← Back to Notes
        </button>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-100">Edit Note</h2>
          <form onSubmit={updateNote}>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Note title..."
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
                />
              </div>
              <div>
                <textarea
                  placeholder="Note content..."
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-64 resize-none text-gray-100 placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-sm font-medium text-gray-300">Color:</span>
              <input
                type="color"
                value={editColor}
                onChange={(e) => setEditColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-600"
              />
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (viewMode === 'create') {
    return (
      <div className="min-h-screen bg-gray-800 text-gray-100 p-6">
        <button onClick={() => { setViewMode('grid'); setTitle(''); setContent(''); setColor('#E6E6FA'); }} className="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2">
          ← Back to Notes
        </button>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-100">Create New Note</h2>
          <form onSubmit={addNote}>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Note title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
                />
              </div>
              <div>
                <textarea
                  placeholder="Note content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-64 resize-none text-gray-100 placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-sm font-medium text-gray-300">Color:</span>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-600"
              />
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-xl font-semibold"
              >
                {loading ? 'Creating...' : 'Create Note'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100">
      {/* Main Content */}
      <div className="p-6">
        {/* Top Search Bar and Add Button */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative max-w-md">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
          </div>
          <button
            onClick={() => setViewMode('create')}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            aria-label="Add new note"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Notes Bento Grid */}
        <div className="bento-grid">
          {notes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-gray-300 text-xl font-medium">No notes yet. Add your first note!</p>
            </div>
          ) : (
            // apply search filter and sort by date (newest first)
            [...notes]
              .filter(n => ((n.title || '').toLowerCase().includes(search.toLowerCase()) || (n.content || '').toLowerCase().includes(search.toLowerCase())))
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((note, index) => {
                return (
                  <div
                    key={note._id}
                    style={{ backgroundColor: note.color }}
                    className="bento-item page-curl group relative transform transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-3xl overflow-hidden cursor-pointer"
                    onClick={() => { setSelectedNote(note); setViewMode('note'); }}
                  >
                    {/* Content */}
                    <div className="p-4 h-full flex flex-col">
                      <h3 className="text-lg font-bold text-black mb-2 pt-1 line-clamp-2 leading-tight text-left">{note.title}</h3>
                      <div className="flex justify-end mt-auto gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingNote(note);
                            setEditTitle(note.title);
                            setEditContent(note.content);
                            setEditColor(note.color);
                            setViewMode('edit');
                          }}
                          className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded-full hover:bg-blue-50"
                          aria-label="Edit note"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note._id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                          aria-label="Delete note"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  )
}

export default App
