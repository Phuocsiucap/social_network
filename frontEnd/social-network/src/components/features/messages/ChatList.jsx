// components/features/messages/ChatList.jsx
import React from 'react';
import { Search, MessageCircle, Users, RefreshCw } from 'lucide-react';
// import { useMessagesStore } from '../../../store';

const ChatList = ({ 
  user, 
  chats = [], 
  searchQuery, 
  setSearchQuery, 
  selectedChat, 
  onChatSelect, 
  formatTime,
  isLoading = false,
  totalUnreadCount = 0,
  onRefresh
}) => {
  // Lấy unread count từ store
  // const { getUnreadCount } = useMessagesStore();

  const handleChatClick = (chat) => {
    onChatSelect(chat);
  };

  const getChatDisplayName = (chat) => {
    if (chat.chatName || chat.title) {
      return chat.chatName || chat.title;
    }
    
    // For direct messages, show the other user's name
    const otherUser = chat.users?.find(u => u?.id !== user?.id);
    return otherUser?.fullName || otherUser?.username || 'Unknown User';
  };

  const getChatAvatar = (chat) => {
    if (chat.avatar) return chat.avatar;
    
    // For direct messages, use other user's avatar
    const otherUser = chat.users?.find(u => u?.id !== user?.id);
    return otherUser?.avatar || null;
  };

  const getUnreadCountForChat = (chat) => {
    // Ưu tiên lấy từ store trước, sau đó mới từ chat object
    // const storeUnreadCount = getUnreadCount(chat.id);
    return  chat.unreadCount || 0;
  };

  const isOnline = (chat) => {
    // For direct messages, check if other user is online
    const otherUser = chat.users?.find(u => u?.id !== user?.id);
    return otherUser?.isOnline || false;
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Messages
            {totalUnreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </span>
            )}
          </h2>
          <button
            onClick={onRefresh}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-pulse">Loading conversations...</div>
          </div>
        ) : chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? 'No conversations found' : 'No conversations yet'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {chats.map((chat) => {
              const displayName = getChatDisplayName(chat);
              const avatar = getChatAvatar(chat);
              const unreadCount = getUnreadCountForChat(chat);
              const isSelected = selectedChat?.id === chat.id;
              const userOnline = isOnline(chat);

              return (
                <div
                  key={chat.id}
                  onClick={() => handleChatClick(chat)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-blue-50 border-r-2 border-blue-500' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="relative">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={displayName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                          {chat.type === 'group' ? (
                            <Users className="w-6 h-6 text-gray-600" />
                          ) : (
                            <span className="text-gray-600 font-medium text-lg">
                              {displayName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Online indicator for direct messages */}
                      {chat.type !== 'group' && userOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium truncate ${
                          unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {displayName}
                        </h3>
                        {chat.latestMessage?.createdAt && (
                          <span className="text-xs text-gray-500 ml-2">
                            {formatTime(chat.latestMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-sm truncate ${
                          unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                        }`}>
                          {chat.latestMessage?.content || 'No messages yet'}
                        </p>
                        {unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center ml-2">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;