// hooks/useMessages2.js - Fixed Event Registration
import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery, useQueryClient, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import { messagesAPI } from '../services';
import WebSocketService from '../services/webSocket';

const QUERY_KEYS = {
  conversations: ['conversations'],
  messages: (conversationId) => ['messages', conversationId],
  conversation: (id) => ['conversation', id],
};

const useMessages = () => {
  const queryClient = useQueryClient();
  const [activeConversation, setAcConversation] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const typingTimeoutRef = useRef({});
  const isWebSocketConnectedRef = useRef(false);

  // ✅ 1. Fetch danh sách cuộc trò chuyện
  const {
    data: conversations = [],
    isLoading: conversationsLoading,
    refetch: refetchConversations,
    error: conversationsError
  } = useQuery({
    queryKey: QUERY_KEYS.conversations,
    queryFn: messagesAPI.getChats,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    onSuccess: (data) => {
      console.log('Conversations fetched:', data);
    },
    onError: (error) => {
      console.error('Error fetching conversations:', error);
    }
  });

  // ✅ 2. Sử dụng useInfiniteQuery cho pagination đúng cách
  const {
    data: messagesData,
    isLoading: messagesLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error: messagesError
  } = useInfiniteQuery({
    queryKey: QUERY_KEYS.messages(activeConversation),
    queryFn: ({ pageParam = 1 }) => {
      if (!activeConversation) return { messages: [], hasMore: false, total: 0 };
      return messagesAPI.getMessages(activeConversation, { page: pageParam, limit: 50 });
    },
    enabled: !!activeConversation,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    onSuccess: (data) => {
      console.log('Messages fetched:', data);
    },
    onError: (error) => {
      console.error('Error fetching messages:', error);
    }
  });

  // ✅ 3. Setup WebSocket event listeners - FIXED EVENT NAMES
  useEffect(() => {
   
    const handleNewMessage = (data) => {
      const { message, conversationId } = data;
      // Cập nhật messages cache - thêm vào page đầu tiên
      queryClient.setQueryData(QUERY_KEYS.messages(conversationId), (oldData) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [{ messages: [message], hasMore: false, total: 1 }],
            pageParams: [1]
          };
        }

        const newPages = [...oldData.pages];
        newPages[0] = {
          ...newPages[0],
          messages: [...newPages[0].messages, message],
          total: (newPages[0].total || 0) + 1
        };

        return {
          ...oldData,
          pages: newPages
        };
      });

      // Cập nhật conversation cache
      queryClient.setQueryData(QUERY_KEYS.conversations, (oldConversations) => {
        if (!Array.isArray(oldConversations)) return [];
        return oldConversations.map(conv => 
          conv.id === conversationId 
            ? { 
                ...conv, 
                latestMessage: message, 
                updatedAt: new Date().toISOString(),
                unreadCount: activeConversation === conversationId ? 0 : (conv.unreadCount || 0) + 1
              }
            : conv
        );
      });
    };

    // Handler for message read status
    const handleMessageRead = (data) => {
      const { conversationId, userId, messageId } = data;
      console.log('Message marked as read via WebSocket:', data);

      // Cập nhật unread count
      queryClient.setQueryData(QUERY_KEYS.conversations, (oldConversations) => {
        if (!Array.isArray(oldConversations)) return [];
        return oldConversations.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        );
      });

      // Cập nhật read status cho messages
      queryClient.setQueryData(QUERY_KEYS.messages(conversationId), (oldData) => {
        if (!oldData || !oldData.pages) return oldData;
        
        const newPages = oldData.pages.map(page => ({
          ...page,
          messages: page.messages.map(msg => ({
            ...msg,
            readBy: msg.readBy 
              ? [...msg.readBy, { userId, readAt: new Date().toISOString() }] 
              : [{ userId, readAt: new Date().toISOString() }]
          }))
        }));

        return {
          ...oldData,
          pages: newPages
        };
      });
    };

    // Handler for typing indicator
    const handleUserTyping = (data) => {
      const { conversationId, userId, username, isTyping } = data;
      
      setTypingUsers(prev => {
        const key = `${conversationId}-${userId}`;
        
        if (isTyping) {
          // Clear existing timeout
          if (typingTimeoutRef.current[key]) {
            clearTimeout(typingTimeoutRef.current[key]);
          }
          
          // Set new timeout
          typingTimeoutRef.current[key] = setTimeout(() => {
            setTypingUsers(current => {
              const newState = { ...current };
              delete newState[key];
              return newState;
            });
            delete typingTimeoutRef.current[key];
          }, 3000);
          
          return {
            ...prev,
            [key]: { userId, username, conversationId }
          };
        } else {
          // Clear timeout and remove typing
          if (typingTimeoutRef.current[key]) {
            clearTimeout(typingTimeoutRef.current[key]);
            delete typingTimeoutRef.current[key];
          }
          
          const newState = { ...prev };
          delete newState[key];
          return newState;
        }
      });
    };

    // Handler for conversation updates
    const handleConversationUpdate = (data) => {
      const { conversation } = data;
      console.log('Conversation updated via WebSocket:', conversation);

      queryClient.setQueryData(QUERY_KEYS.conversations, (oldConversations) => {
        if (!Array.isArray(oldConversations)) return [conversation];
        
        const existingIndex = oldConversations.findIndex(conv => conv.id === conversation.id);
        if (existingIndex >= 0) {
          const updated = [...oldConversations];
          updated[existingIndex] = { ...updated[existingIndex], ...conversation };
          return updated;
        } else {
          return [conversation, ...oldConversations];
        }
      });
    };

    
    // ✅ FIXED: Register event listeners with correct event names
    // These should match the messageType values sent from your server
    WebSocketService.on('NEW_MESSAGE', handleNewMessage);          // Server sends: { messageType: 'NEW_MESSAGE', data: {...} }
    WebSocketService.on('MESSAGE_READ', handleMessageRead);        // Server sends: { messageType: 'MESSAGE_READ', data: {...} }
    WebSocketService.on('USER_TYPING', handleUserTyping);          // Server sends: { messageType: 'USER_TYPING', data: {...} }
    WebSocketService.on('CONVERSATION_UPDATED', handleConversationUpdate); // Server sends: { messageType: 'CONVERSATION_UPDATED', data: {...} }
    
    // Cleanup function
    return () => {
      WebSocketService.off('NEW_MESSAGE', handleNewMessage);
      WebSocketService.off('MESSAGE_READ', handleMessageRead);
      WebSocketService.off('USER_TYPING', handleUserTyping);
      WebSocketService.off('CONVERSATION_UPDATED', handleConversationUpdate);
    
      // Clean up typing timeouts
      Object.values(typingTimeoutRef.current).forEach(timeout => {
        clearTimeout(timeout);
      });
      typingTimeoutRef.current = {};
    };
  }, [queryClient, activeConversation]);

  // ✅ 4. Join/Leave conversation
  useEffect(() => {
    if (activeConversation && WebSocketService.isConnected) {
      WebSocketService.joinConversation(activeConversation);
      console.log('Joined conversation:', activeConversation);
      
      return () => {
        WebSocketService.leaveConversation(activeConversation);
        console.log('Left conversation:', activeConversation);
      };
    }
  }, [activeConversation]);


  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      console.log('Loading more messages...');
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const getMessagesByConversationId = useCallback(() => {
    if (!activeConversation || !messagesData) return [];
    
    // Flatten all pages into single array
    const allMessages = messagesData.pages?.reduce((acc, page) => {
      return [...acc, ...(page.messages || [])];
    }, []) || [];
    
    console.log("All messages for conversation:", allMessages);
    return allMessages;
  }, [activeConversation, messagesData]);

  const getUnreadCount = useCallback((conversationId) => {
    if (!Array.isArray(conversations)) return 0;
    const conversation = conversations.find(conv => conv.id === conversationId);
    return conversation?.unreadCount || 0;
  }, [conversations]);

  const getTotalUnreadCount = useCallback(() => {
    if (!Array.isArray(conversations)) return 0;
    return conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
  }, [conversations]);

  // ✅ Send message via WebSocket
  const sendMessage = useCallback(async (messageData) => {
    if (!activeConversation || !WebSocketService.isConnected) {
      throw new Error('No active conversation or WebSocket not connected');
    }
    
    try {
      console.log('Sending message via WebSocket:', messageData);
      return await WebSocketService.sendMessage(
        activeConversation, 
        messageData
      );
      
    } catch (error) {
      console.error('Error sending message via WebSocket:', error);
      throw error;
    }
  }, [activeConversation]);

  // ✅ Mark as read via WebSocket
  const markAsRead = useCallback(async (conversationId, messageId = null) => {
    if (!WebSocketService.isConnected) {
      throw new Error('WebSocket not connected');
    }
    
    try {
      console.log('Marking as read via WebSocket:', { conversationId, messageId });
      return await WebSocketService.markAsRead(conversationId, messageId);
    } catch (error) {
      console.error('Error marking as read via WebSocket:', error);
      throw error;
    }
  }, []);

  // ✅ Send typing indicator
  const sendTyping = useCallback((isTyping = true) => {
    if (!activeConversation || !WebSocketService.isConnected) return;
    
    WebSocketService.sendTyping(activeConversation, isTyping);
  }, [activeConversation]);

  // ✅ Get typing users for current conversation
  const getTypingUsers = useCallback(() => {
    if (!activeConversation) return [];
    
    return Object.values(typingUsers).filter(user => 
      user.conversationId === activeConversation
    );
  }, [activeConversation, typingUsers]);


  const uploadFile = async (data) => {
    const rq = await messagesAPI.uploadFile(data.file, data.chatId);
    console.log(rq);
    return rq.result;
  }
  const setSelectedConversationId = (conversationId) => {
    setAcConversation(conversationId);
  }
  // Get current messages
  const messages = getMessagesByConversationId();

  return {
    // Data
    conversations,
    activeConversation,
    messages,
    
    // Loading states
    loading: conversationsLoading || messagesLoading,
    conversationsLoading,
    messagesLoading,
    isFetchingNextPage,
    hasNextPage,
    
    // Error states
    conversationsError,
    messagesError,
    
    // WebSocket states
    isWebSocketConnected: isWebSocketConnectedRef.current,
    typingUsers: getTypingUsers(),
    
    // Actions
    setSelectedConversationId,
    loadMore,
    sendMessage,
    uploadFile,
    markAsRead,
    sendTyping,
    refetchConversations,
    
    // Getters
    getMessagesByConversationId,
    getUnreadCount,
    getTotalUnreadCount,
    getTypingUsers,
    
    // Legacy states
    isSending: false,
    sendError: null,
  };
};

export default useMessages;