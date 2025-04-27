import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');


  useEffect(() => {
    fetchPost();
    fetchComments();

  }, [id]);

  async function fetchPost() {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Error loading post:', error);
      return;
    }
    setPost(data);
    setLoading(false);
  }

  async function fetchComments() {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error loading comments:', error);
      return;
    }
    setComments(data);
  }

  async function handleUpvote() {
    if (!post) return;
    const { error } = await supabase
      .from('posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', id);
    if (error) {
      console.error('Upvote failed:', error);
      alert('Could not upvote: ' + error.message);
    } else {
  
      setPost({ ...post, upvotes: post.upvotes + 1 });
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this post?')) return;
    const { data, error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    console.log('DELETE →', { data, error });
    if (error) return alert('Delete failed: ' + error.message);
    navigate('/');
  }

  async function handleAddComment() {
    const text = newComment.trim();
    if (!text) return;
    const { error } = await supabase
      .from('comments')
      .insert({ post_id: id, content: text });
    if (error) {
      console.error('Comment failed:', error);
      alert('Could not post comment: ' + error.message);
    } else {
      setNewComment('');
      fetchComments();
    }
  }

  if (loading) return <p style={{ padding: '2rem' }}>Loading…</p>;
  if (!post)   return <p style={{ padding: '2rem' }}>Post not found.</p>;

  return (
    <div className="form-container">
      <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
        Posted {new Date(post.created_at).toLocaleString()}
      </p>
      <h1 style={{ margin: '0.5rem 0' }}>{post.title}</h1>
      {post.content && <p style={{ marginBottom: '1rem' }}>{post.content}</p>}
      {post.image_url && (
        <img
          src={post.image_url}
          alt=""
          style={{ width: '100%', borderRadius: '0.5rem', marginBottom: '1rem' }}
        />
      )}

      <div className="post-actions">
        <button onClick={handleUpvote}>👍 {post.upvotes}</button>
        <button className="edit" onClick={() => navigate(`/edit/${id}`)}>
          Edit
        </button>
        <button className="delete" onClick={handleDelete}>
          Delete
        </button>
      </div>

      <section className="comments" style={{ marginTop: '2rem' }}>
        <h2>Comments</h2>
        {comments.length === 0 && <p>No comments yet.</p>}
        {comments.map(c => (
          <div
            key={c.id}
            style={{
              background: '#f9fafb',
              padding: '0.75rem',
              borderRadius: '0.25rem',
              marginBottom: '0.5rem'
            }}
          >
            <p style={{ margin: 0 }}>{c.content}</p>
            <small style={{ color: '#6b7280' }}>
              {new Date(c.created_at).toLocaleString()}
            </small>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Write a comment…"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem'
            }}
          />
          <button onClick={handleAddComment}>Post</button>
        </div>
      </section>
    </div>
  );
}
