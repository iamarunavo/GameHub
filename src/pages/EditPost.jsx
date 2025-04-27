import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    content: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Fetch post failed:', error);
        alert('Could not load post: ' + error.message);
        navigate('/');
        return;
      }
      setPost(data);
      setLoading(false);
    })();
  }, [id, navigate]);

  async function handleUpdate() {
    if (!post.title.trim()) return alert('Title is required');
    const { data, error } = await supabase
      .from('posts')
      .update({
        title: post.title,
        content: post.content,
        image_url: post.image_url
      })
      .eq('id', id);
    console.log('UPDATE →', { data, error });
    if (error) return alert('Update failed: ' + error.message);
    navigate(`/post/${id}`);
  }

  if (loading) return <p style={{ padding: '2rem' }}>Loading post…</p>;

  return (
    <div className="form-container">
      <h2>Update Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={post.title}
        onChange={e => setPost({ ...post, title: e.target.value })}
      />
      <textarea
        placeholder="Content (Optional)"
        value={post.content}
        onChange={e => setPost({ ...post, content: e.target.value })}
      />
      <input
        type="text"
        placeholder="Image URL (Optional)"
        value={post.image_url}
        onChange={e => setPost({ ...post, image_url: e.target.value })}
      />
      <button onClick={handleUpdate}>Update Post</button>
    </div>
  );
}
