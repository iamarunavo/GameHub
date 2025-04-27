import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';
import { Link } from 'react-router-dom';

export default function Home({ search }) {
  const [posts, setPosts] = useState([]);
  const [sort, setSort]   = useState('created_at');

  useEffect(() => {
    fetchPosts();
  }, [sort, search]);

  async function fetchPosts() {
    let query = supabase.from('posts').select('*');
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    const { data } = await query.order(sort, { ascending: false });
    setPosts(data || []);
  }

  return (
    <>
      <div className="controls">
        <div className="sort-buttons">
          <span>Order by:</span>
          <button
            onClick={() => setSort('created_at')}
            className={sort === 'created_at' ? 'active' : ''}
          >
            Newest
          </button>
          <button
            onClick={() => setSort('upvotes')}
            className={sort === 'upvotes' ? 'active' : ''}
          >
            Most Popular
          </button>
        </div>
      </div>

      {posts.map(post => (
        <Link key={post.id} to={`/post/${post.id}`} className="card">
          <div className="date">
            Posted {new Date(post.created_at).toLocaleString()}
          </div>
          <div className="title">{post.title}</div>
          <div className="upvotes">{post.upvotes} upvotes</div>
        </Link>
      ))}
    </>
  );
}
Home