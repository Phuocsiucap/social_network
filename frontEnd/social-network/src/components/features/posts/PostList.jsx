import React, { useEffect, useState } from 'react';
import { PostItem } from './PostCard';

export function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Giả lập fetch posts từ API
    const fetchPosts = async () => {
      const fakePosts = [
        { id: 1, author: 'Alice', content: 'Hello world!' },
        { id: 2, author: 'Bob', content: 'This is a test post.' },
      ];
      setPosts(fakePosts);
    };
    fetchPosts();
  }, []);

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}
