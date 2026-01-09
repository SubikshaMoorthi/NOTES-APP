# Notes App

A lightweight, modern web application for quickly jotting down and managing short notes. Keep track of your thoughts, reminders, and ideas in one clean, intuitive place.

## Features

- **Quick Note Creation** — Add notes with title, content, and custom colors
- **Search & Filter** — Find notes instantly by title or content
- **Pin Important Notes** — Pin your most important notes to the top
- **Color-Coded Notes** — Organize notes visually with custom colors
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile
- **Real-time Sync** — Notes persist in MongoDB
- **Clean UI** — Beautiful gradient background and smooth interactions
- **Delete Notes** — Remove notes with a single click

## Tech Stack

**Frontend:**
- React 19
- Vite (fast build tool)
- Tailwind CSS (responsive styling)
- Axios (API calls)
- Lucide React (icons)

**Backend:**
- Node.js with Express
- MongoDB (database)
- Mongoose (ODM)
- CORS enabled for frontend

## Project Structure

```
NOTES-APP/
├── client/                    # React frontend
│   ├── src/
│   │   ├── App.jsx           # Main component
│   │   ├── App.css           # Tailwind CSS
│   │   ├── index.css         # Global styles
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                    # Express backend
│   ├── server.js             # API server & MongoDB models
│   └── package.json
│
└── README.md                  # This file
```

## Usage

1. **Add a Note:**
   - Type a title and content
   - Select a color (optional)
   - Click "Add Note"

2. **Search Notes:**
   - Use the search bar to filter by title or content

3. **Pin a Note:**
   - Click the star icon to pin important notes to the top

4. **Delete a Note:**
   - Hover over a note and click the trash icon