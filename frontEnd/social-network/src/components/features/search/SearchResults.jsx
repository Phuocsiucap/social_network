import React from 'react';
import UserItem from './UserItem';

const SearchResults = ({ results, onUserClick }) => {
  if (results.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <div className="text-xl text-gray-700 mb-2">
          Không có kết quả nào
        </div>
        <div className="text-gray-500">
          Hãy thử tìm kiếm lại với từ khóa khác
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden">
      {results.map((user, index) => (
        <UserItem
          key={user.id}
          user={user}
          onClick={() => onUserClick(user)}
          isLast={index === results.length - 1}
        />
      ))}
    </div>
  );
};

export default SearchResults;