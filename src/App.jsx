import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home       from './pages/Home.jsx';
import CreatePost from './pages/CreatePost.jsx';
import PostPage   from './pages/PostPage.jsx';
import EditPost   from './pages/EditPost.jsx';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Router>
      <header className="navbar">
        <div className="container">
          <div className="navbar-logo">GameHub</div>
          <div className="navbar-search">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/create">Create New Post</Link>
          </div>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/"        element={<Home   search={searchTerm} />} />
          <Route path="/create"  element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </main>
    </Router>
  );
}
