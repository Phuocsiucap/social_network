// components/features/messages/ChatWindow2.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Phone, 
  Video, 
  MoreVertical, 
  ArrowDown,
  AlertCircle,
  RefreshCw,
  Users,
  X
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { vi } from 'date-fns/locale';
import { MessageBubble, TypingIndicator, DateSeparator, MessageInput } from './index';

const ChatWindow = ({
  conversation,
  messages = [],
  onSendMessage,
  onSendFile,
  onLoadMoreMessages,
  onTyping,
  isLoadingMessages = false,
  isSending = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  typingUsers = [],
  messagesError = null,
  sendError = null,
  onMarkAsRead,
  onRetry,
  onClose,
  user,
  isWebSocketConnected = false
}) => {
  const [messageContent, setMessageContent] = useState('');
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const lastScrollTop = useRef(0);
  const typingTimeoutRef = useRef(null);

  console.log("ChatWindow - conversation:", conversation);
  console.log("ChatWindow - messages:", messages);

  // Auto-scroll to bottom for new messages
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    
    // Auto scroll if user is near bottom and there are new messages
    if (isNearBottom && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setShowScrollToBottom(!isAtBottom);

    // Load more messages when scrolling to top
    if (scrollTop < 100 && scrollTop < lastScrollTop.current && hasNextPage && !isFetchingNextPage) {
      onLoadMoreMessages?.();
    }

    lastScrollTop.current = scrollTop;
  }, [hasNextPage, isFetchingNextPage, onLoadMoreMessages]);

  // Debounced scroll handler
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    let timeoutId;
    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };

    container.addEventListener('scroll', debouncedScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', debouncedScroll);
      clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  // Handle typing indicator
  const handleTypingStart = useCallback(() => {
    if (!isTyping && isWebSocketConnected) {
      setIsTyping(true);
      onTyping?.(true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping?.(false);
    }, 3000);
  }, [isTyping, onTyping, isWebSocketConnected]);

  const handleTypingStop = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (isTyping) {
      setIsTyping(false);
      onTyping?.(false);
    }
  }, [isTyping, onTyping]);

  // Handle message input change
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setMessageContent(value);
    
    // Start typing indicator when user types
    if (value.trim() && !isTyping) {
      handleTypingStart();
    } else if (!value.trim() && isTyping) {
      handleTypingStop();
    }
  }, [isTyping, handleTypingStart, handleTypingStop]);

  // Determine message type based on content or file
  const determineMessageType = (content, file = null) => {
    if (file) {
      const fileType = file.type.toLowerCase();
      if (fileType.startsWith('image/')) return 'image';
      if (fileType.startsWith('video/')) return 'video';
      if (fileType.startsWith('audio/')) return 'audio';
      return 'file';
    }
    return 'text';
  };

  // Handle send message
  const handleSendMessage = useCallback((content) => {
    if (!content?.trim() || isSending || !isWebSocketConnected) return;
    
    // Stop typing indicator
    handleTypingStop();
    
    // Send message via WebSocket
    onSendMessage?.({
      content: content.trim(),
      type: determineMessageType(content),
      conversationId: conversation?.id,
      timestamp: new Date().toISOString()
    });
    setMessageContent('');
  }, [isSending, onSendMessage, isWebSocketConnected, handleTypingStop, conversation?.id]);

  // Handle send file
  const handleSendFile = useCallback(async (file) => {
    if (!file || isSending || !isWebSocketConnected) return;

    try {
      // Stop typing indicator
      handleTypingStop();

      const messageType = determineMessageType(null, file);
      
      // Create file message data
      const fileMessageData = {
        type: messageType,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        conversationId: conversation?.id,
        timestamp: new Date().toISOString(),
        file: file // File object to be uploaded
      };

      // Send file via WebSocket or upload handler
      await onSendFile?.(fileMessageData);
      
    } catch (error) {
      console.error('Error sending file:', error);
    }
  }, [isSending, onSendFile, isWebSocketConnected, handleTypingStop, conversation?.id]);

  // Handle message input submit
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    handleSendMessage(messageContent);
  }, [messageContent, handleSendMessage]);

  // Handle key press
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(messageContent);
    }
  }, [messageContent, handleSendMessage]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Get conversation display info
  const conversationInfo = useMemo(() => {
    if (!conversation) return { name: '', avatar: null, isOnline: false };

    if (conversation.type === 'group') {
      return {
        name: conversation.chatName || conversation.title || 'Group Chat',
        avatar: conversation.avatar,
        isOnline: false,
        participantCount: conversation.users?.length || 0
      };
    }

    // Direct message - tìm user khác trong conversation
    const otherUser = conversation.users?.find(u => u?.id !== user?.id);
    return {
      name: otherUser?.username || otherUser?.fullName || otherUser?.email || 'Unknown User',
      avatar: otherUser?.avatar,
      isOnline: otherUser?.status === 'online' || false
    };
  }, [conversation, user?.id]);

  // Group messages by date - Sort messages by date (oldest first)
  const messageGroups = useMemo(() => {
    if (!messages.length) return [];

    // Sort messages by date (oldest first)
    const sortedMessages = [...messages].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    const groups = {};
    sortedMessages.forEach(message => {
      if (!message?.createdAt) return;
      
      const date = new Date(message.createdAt);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: dateKey,
          messages: []
        };
      }
      groups[dateKey].messages.push(message);
    });
    
    return Object.values(groups).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [messages]);

  // Handle retry message
  const handleRetry = useCallback((message) => {
    onRetry?.(message);
  }, [onRetry]);

  // Mark as read when conversation changes or messages arrive
  useEffect(() => {
    if (conversation?.id && onMarkAsRead && messages.length > 0) {
      const timer = setTimeout(() => {
        onMarkAsRead(conversation.id);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [conversation?.id, messages.length, onMarkAsRead]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Empty state
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
          <p>Choose a conversation from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <ChatHeader 
        conversationInfo={conversationInfo}
        conversation={conversation}
        typingUsers={typingUsers}
        isWebSocketConnected={isWebSocketConnected}
        onClose={onClose}
      />

      {/* Messages Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Load more indicator */}
        {hasNextPage && (
          <LoadMoreIndicator 
            onLoadMore={onLoadMoreMessages}
            isLoading={isFetchingNextPage}
          />
        )}

        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="h-full overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{ 
            paddingTop: hasNextPage ? '80px' : '16px',
            maxHeight: '100%'
          }}
        >
          <MessagesContent
            isLoadingMessages={isLoadingMessages}
            messagesError={messagesError}
            sendError={sendError}
            messageGroups={messageGroups}
            conversation={conversation}
            user={user}
            onRetry={handleRetry}
            typingUsers={typingUsers}
            isWebSocketConnected={isWebSocketConnected}
          />
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollToBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-20 right-6 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-10"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0">
        <MessageInput
          value={messageContent}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onKeyPress={handleKeyPress}
          onSendFile={handleSendFile}
          disabled={isSending || !isWebSocketConnected}
          placeholder={
            !isWebSocketConnected 
              ? "Connecting..." 
              : "Type a message..."
          }
          isConnected={isWebSocketConnected}
        />
      </div>
    </div>
  );
};

// Header component
const ChatHeader = React.memo(({ 
  conversationInfo, 
  conversation, 
  typingUsers, 
  isWebSocketConnected,
  onClose 
}) => (
  <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="relative">
          {conversationInfo.avatar ? (
            <img
              src={conversationInfo.avatar}
              alt={conversationInfo.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              {conversation?.type === 'group' ? (
                <Users className="w-5 h-5 text-gray-600" />
              ) : (
                <span className="text-gray-600 font-medium">
                  {conversationInfo.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          )}
          {conversation?.type !== 'group' && conversationInfo.isOnline && isWebSocketConnected && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>

        {/* Info */}
        <div>
          <h3 className="font-semibold text-gray-900">{conversationInfo.name}</h3>
          <p className="text-sm text-gray-500">
            {conversation?.type === 'group' 
              ? `${conversationInfo.participantCount} members`
              : isWebSocketConnected 
                ? (conversationInfo.isOnline ? 'Online' : 'Offline')
                : 'Connecting...'
            }
            {typingUsers.length > 0 && isWebSocketConnected && (
              <span className="text-blue-500 ml-2">
                {typingUsers.length === 1 
                  ? `${typingUsers[0].name} is typing...`
                  : `${typingUsers.length} people are typing...`
                }
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={!isWebSocketConnected}
        >
          <Phone className={`w-5 h-5 ${isWebSocketConnected ? 'text-gray-600' : 'text-gray-400'}`} />
        </button>
        <button 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={!isWebSocketConnected}
        >
          <Video className={`w-5 h-5 ${isWebSocketConnected ? 'text-gray-600' : 'text-gray-400'}`} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  </div>
));

// Load more indicator component
const LoadMoreIndicator = React.memo(({ onLoadMore, isLoading }) => (
  <div className="absolute top-0 left-0 right-0 z-10 p-4 text-center">
    <button
      onClick={onLoadMore}
      disabled={isLoading}
      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        'Load more messages'
      )}
    </button>
  </div>
));

// Messages content component
const MessagesContent = React.memo(({ 
  isLoadingMessages, 
  messagesError, 
  sendError,
  messageGroups, 
  conversation, 
  user, 
  onRetry,
  typingUsers,
  isWebSocketConnected
}) => {
  // Loading State
  if (isLoadingMessages && messageGroups.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  // Error State
  if (messagesError) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="text-center text-red-500">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>Error loading messages</p>
          <p className="text-sm text-gray-500 mt-1">{messagesError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No messages state
  if (messageGroups.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No messages yet</h3>
          <p>Start the conversation by sending a message</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Messages grouped by date */}
      {messageGroups.map((group) => (
        <div key={group.date}>
          <DateSeparator date={group.date} />
          
          {group.messages.map((message, index) => {
            const prevMessage = index > 0 ? group.messages[index - 1] : null;
            const isOwn = message.sender?.id === user?.id;
            const showAvatar = !isOwn && (!prevMessage || prevMessage.sender?.id !== message.sender?.id);
            const showSenderName = !isOwn && conversation?.type === 'group' && showAvatar;

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={isOwn}
                showAvatar={showAvatar}
                showSenderName={showSenderName}
                user={user}
                onRetry={onRetry}
              />
            );
          })}
        </div>
      ))}

      {/* Typing Indicator */}
      {isWebSocketConnected && typingUsers.length > 0 && (
        <TypingIndicator typingUsers={typingUsers} />
      )}

      {/* Connection Error */}
      {!isWebSocketConnected && (
        <div className="flex justify-center">
          <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-600 text-sm">
            Connection lost. Trying to reconnect...
          </div>
        </div>
      )}

      {/* Send Error */}
      {sendError && (
        <div className="flex justify-center">
          <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            Failed to send message: {sendError.message}
          </div>
        </div>
      )}
    </div>
  );
});

// Set display names for debugging
ChatHeader.displayName = 'ChatHeader';
LoadMoreIndicator.displayName = 'LoadMoreIndicator';
MessagesContent.displayName = 'MessagesContent';

export default ChatWindow;