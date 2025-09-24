// MessagesPage.jsx - Mobile responsive with conditional rendering
import React, { useState, useCallback, useMemo } from 'react';
import { ChatList } from '../components/features/messages';
import ChatWindow from '../components/features/messages/ChatWindow';
import { formatDistanceToNow } from 'date-fns';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { useAuth, useMessages } from '../hooks';
import { useWebSocketStore } from '../store';

const MessagesPage = ({ onConversationChange }) => {
  const { user } = useAuth();
  const {
    conversations,
    messages,
    activeConversation,
    loading,
    conversationsLoading,
    messagesLoading,
    isFetchingNextPage,
    hasNextPage,
    typingUsers,
    setSelectedConversationId,
    loadMore,
    sendMessage,
    uploadFile,
    markAsRead,
    sendTyping,
    getTotalUnreadCount,
    refetchConversations,
  } = useMessages();

  // Chỉ đọc trạng thái WebSocket, không kết nối
  const isConnected = useWebSocketStore(state => state.isConnected);
  const isWebSocketConnected = isConnected;
  const [searchQuery, setSearchQuery] = useState('');

  // Filter chats based on search query - memoized
  const filteredChats = useMemo(() => {
    if (!Array.isArray(conversations) || conversations.length === 0) return [];
    
    return conversations.filter(chat => {
      if (!chat) return false;
      const searchLower = searchQuery.toLowerCase();
      const otherUser = chat.users?.find(u => u?.id !== user?.id);
      return (
        otherUser?.username?.toLowerCase().includes(searchLower) ||
        otherUser?.fullName?.toLowerCase().includes(searchLower) ||
        chat.chatName?.toLowerCase().includes(searchLower) ||
        chat.title?.toLowerCase().includes(searchLower) ||
        chat.latestMessage?.content?.toLowerCase().includes(searchLower)
      );
    });
  }, [conversations, searchQuery, user?.id]);

  // Format time for chat list - memoized
  const formatTime = useCallback((date) => {
    if (!date) return '';
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }, []);

  // Handle refresh - memoized
  const handleRefresh = useCallback(() => {
    console.log('Refreshing conversations...');
    refetchConversations();
  }, [refetchConversations]);

  // Get selected conversation
  const selectedConversation = useMemo(() => {
    if (!Array.isArray(conversations)) return null;
    const conversation = conversations.find(conv => conv.id === activeConversation) || null;
    // Thông báo cho parent component khi conversation thay đổi
    onConversationChange?.(!!conversation);
    return conversation;
  }, [conversations, activeConversation, onConversationChange]);

  // Handle conversation selection
  const handleConversationSelect = useCallback(async (chat) => {
    console.log('Selected chat:', chat);
   
    if (chat?.id !== activeConversation) {
      setSelectedConversationId(chat.id);
      // Đánh dấu đã đọc khi mở chat (via WebSocket)
      if (chat.unreadCount > 0) {
        try {
          await markAsRead(chat.id);
        } catch (error) {
          console.error('Error marking as read:', error);
        }
      }
    }
  }, [setSelectedConversationId, activeConversation, markAsRead]);

  // Handle send message (via WebSocket)
  const handleSendMessage = useCallback(async (messageData) => {
    try {
      await sendMessage(messageData);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [sendMessage]);

  const handleSendFile = useCallback(async (messageData) => {
    try {
      const rp = await uploadFile(messageData);
      console.log("rp:", rp);
      return rp;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [uploadFile]);

  // Handle load more messages
  const handleLoadMoreMessages = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      loadMore();
    }
  }, [hasNextPage, isFetchingNextPage, loadMore]);

  // Handle mark as read (via WebSocket)
  const handleMarkAsRead = useCallback(async (conversationId) => {
    try {
      await markAsRead(conversationId);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }, [markAsRead]);

  // Handle typing indicator (via WebSocket)
  const handleTyping = useCallback((isTyping) => {
    sendTyping(isTyping);
  }, [sendTyping]);

  // Clear conversation selection
  const clearConversationSelectionHandler = useCallback(() => {
    setSelectedConversationId(null);
    onConversationChange?.(false);
  }, [setSelectedConversationId, onConversationChange]);

  // Early returns for loading and error states
  if (!user) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-100">
        <div className="text-gray-600">Please log in to view messages</div>
      </div>
    );
  }

  if (conversationsLoading && (!Array.isArray(conversations) || conversations.length === 0)) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading conversations...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex w-full h-full bg-gray-100">
        {/* Connection Status Indicator */}
        <div className={`fixed top-4 right-4 z-50 px-3 py-1 rounded-full text-sm font-medium ${
          isWebSocketConnected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isWebSocketConnected ? '🟢' : '🔴'}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Chat List - Full width on mobile when no conversation selected, fixed width on desktop */}
          <div className={`${
            selectedConversation 
              ? 'hidden md:flex md:w-80' // Ẩn trên mobile khi có conversation được chọn, width cố định trên desktop
              : 'flex w-full md:w-80' // Full width trên mobile, width cố định trên desktop khi chưa chọn conversation
          }`}>
            <ChatList
              user={user}
              chats={filteredChats}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedChat={selectedConversation}
              onChatSelect={handleConversationSelect}
              formatTime={formatTime}
              isLoading={conversationsLoading}
              totalUnreadCount={getTotalUnreadCount()}
              onRefresh={handleRefresh}
              isWebSocketConnected={isWebSocketConnected}
            />
          </div>
          
          {/* Chat Window - Only show when conversation is selected */}
          {selectedConversation && (
            <div className="flex-1">
              <ChatWindow 
                conversation={selectedConversation}
                messages={messages}
                onSendMessage={handleSendMessage}
                onSendFile= {handleSendFile}
                onLoadMoreMessages={handleLoadMoreMessages}
                onTyping={handleTyping}
                isLoadingMessages={messagesLoading}
                isSending={false} // WebSocket handles this differently
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                typingUsers={typingUsers}
                messagesError={null}
                sendError={null}
                onMarkAsRead={handleMarkAsRead}
                onClose={clearConversationSelectionHandler}
                user={user}
                isWebSocketConnected={isWebSocketConnected}
              />
            </div>
          )}

          {/* Placeholder when no conversation selected on desktop */}
          {!selectedConversation && (
            <div className="hidden md:flex flex-1 items-center justify-center bg-white">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-sm">Choose a chat from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(MessagesPage);