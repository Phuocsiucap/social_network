import React from 'react';

export function PostCard({ post }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <p className="text-sm text-gray-500 mb-2">By {post.author}</p>
      <p>{post.content}</p>
    </div>
  );
}
