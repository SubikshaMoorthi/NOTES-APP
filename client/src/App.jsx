import { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Trash2, Star, Search } from 'lucide-react'
import './App.css'

function App() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState('#FFF9C4')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const API_URL = 'http://localhost:5000/api/notes'

  // Fetch notes
  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_URL)
      setNotes(response.data)
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }

  // Add note
  const addNote = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setLoading(true)
    try {
      const response = await axios.post(API_URL, { title, content, color })
      // refresh list to keep ordering and server timestamps
      await fetchNotes()
      setTitle('')
      setContent('')
      setColor('#FFF9C4')
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

  const togglePin = async (note) => {
    try {
      await axios.patch(`${API_URL}/${note._id}`, { pinned: !note.pinned })
      await fetchNotes()
    } catch (err) {
      console.error('Error toggling pin:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">My Notes</h1>
          <p className="text-gray-600">Keep track of your thoughts and ideas</p>
        </div>

        {/* Header row: search + add form */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6 items-start">
          <div className="flex-1">
            <div className="mb-4">
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </div>
              </div>
            </div>
          </div>
          {/* Add Note Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <form onSubmit={addNote}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <textarea
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              />
            </div>

            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Color:</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="ml-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Plus size={20} />
                {loading ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </form>
        </div>

        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No notes yet. Create one to get started!</p>
            </div>
          ) : (
            // apply search filter and pinned sort (pinned first)
            [...notes]
              .filter(n => ((n.title || '').toLowerCase().includes(search.toLowerCase()) || (n.content || '').toLowerCase().includes(search.toLowerCase())))
              .sort((a, b) => (b.pinned === a.pinned ? new Date(b.createdAt) - new Date(a.createdAt) : (b.pinned ? -1 : 1)))
              .map(note => (
              <div
                key={note._id}
                style={{ backgroundColor: note.color }}
                className="rounded-lg shadow-md p-6 relative group hover:shadow-lg transition-shadow"
              >
                <div className="absolute top-4 left-4 text-yellow-600">
                  <button onClick={() => togglePin(note)} className="opacity-90 hover:opacity-100" aria-label={note.pinned ? 'Unpin note' : 'Pin note'}>
                    <Star size={18} className={note.pinned ? 'text-yellow-500' : 'text-gray-300'} />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 pr-8">{note.title}</h3>
                <p className="text-gray-700 whitespace-pre-wrap text-sm mb-4">{note.content}</p>
                <button
                  onClick={() => deleteNote(note._id)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Delete note"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
        {/* Inline feedback */}
        {message && <div className="mt-4 text-green-600">{message}</div>}
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </div>
    </div>
  )
}

export default App
