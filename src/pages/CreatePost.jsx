import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';

export default function CreatePost() {
  const [title, setTitle]     = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  async function handleCreate() {
    if (!title.trim()) {
      return alert('Title is required');
    }
    await supabase.from('posts').insert({
      title,
      content,
      image_url: imageUrl,
      upvotes: 0,
    });
    navigate('/');
  }

  return (
    <div className="form-container">
      <h2>Create New Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content (Optional)"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <input
        type="text"
        placeholder="Image URL (Optional)"
        value={imageUrl}
        onChange={e => setImageUrl(e.target.value)}
      />
      <button onClick={handleCreate}>Create Post</button>
    </div>
  );
}
