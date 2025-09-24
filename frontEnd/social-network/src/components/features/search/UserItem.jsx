import React from 'react';


const UserItem = ({ user, query, onClick, isLast }) => {
  
  const highlightQuery = (text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getInitials = (username) => {
    return username.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div
        onClick={onClick}
        className={`flex items-center p-5 cursor-pointer transition-all duration-300 hover:translate-x-2 ${
            !isLast ? "border-b border-gray-100" : ""
        } ${
            user.friendStatus === "friend"
            ? "bg-green-100 hover:bg-green-100"
            : user.friendStatus === "sent"
            ? "bg-blue-100 hover:bg-blue-100"
            : user.friendStatus === "pending"
            ? "bg-yellow-100 hover:bg-yellow-100"
            : "bg-gray-100 hover:bg-gray-100"
        }`}
        >
      {/* Avatar */}
      <div className="relative flex-shrink-0 mr-4">
        <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold">
              {getInitials(user.username)}
            </div>
          )}
        </div>
        {user.isOnline && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 mb-1 truncate">
          {highlightQuery(user.username, query)}
        </div>
        <div className="text-gray-600 text-sm mb-1 truncate">
          {highlightQuery(user.email, query)}
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <span>
            {user.status === "ON" ? "🟢 Đang hoạt động" : "⚫ Không hoạt động"}
          </span>
          <span>•</span>
          <span>📍 {user.location}</span>
        </div>

      </div>
    </div>
  );
};

export default UserItem;