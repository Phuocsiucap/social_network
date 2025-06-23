// src/store/messagesStore.js
import { create } from 'zustand';

const messagesStore = create((set, get) => ({
  // Sta
  conversations:  [],
  activeConversation:  null,
  messages:  {}, // { conversationId: [messages] }
  typingUsers: {}, // { conversationId: [userIds] } - không persist vì realtime
  onlineUsers: new Set(), // không persist vì realtime
  unreadCounts:  {}, // { conversationId: count }
  lastSeen:  {}, // { conversationId: timestamp }

  // Getters - hàm tiện lợi
  getConversationMessages: (conversationId) => {
    const state = get();
    return state.messages[conversationId] || [];
  },

  getUnreadCount: (conversationId) => {
    const state = get();
    return state.unreadCounts[conversationId] || 0;
  },

  getTotalUnreadCount: () => {
    const state = get();
    return Object.values(state.unreadCounts).reduce((sum, count) => sum + count, 0);
  },

  getTypingUsers: (conversationId) => {
    const state = get();
    return state.typingUsers[conversationId] || [];
  },

  isUserOnline: (userId) => {
    const state = get();
    return state.onlineUsers.has(userId);
  },

  // Actions
  setConversations: (conversations) => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
    set({ conversations });
  },

  setActiveConversation: (conversationId) => {
    localStorage.setItem('activeConversation', conversationId || '');
    set({ activeConversation: conversationId });
    
    // Tự động mark as read khi chuyển conversation
    if (conversationId) {
      get().markConversationAsRead(conversationId);
    }
  },

  addMessage: (message) => {
    const state = get();
    const conversationId = message.conversationId;
    const currentMessages = state.messages[conversationId] || [];
    
    // Check if message already exists
    const exists = currentMessages.find(m => m.id === message.id);
    if (exists) return;

    // Add message to beginning (newest first)
    const newMessages = [message, ...currentMessages];
    const updatedMessagesObj = {
      ...state.messages,
      [conversationId]: newMessages
    };

    // Increment unread count if not current conversation
    let newUnreadCounts = state.unreadCounts;
    if (conversationId !== state.activeConversation && message.senderId !== get().getCurrentUserId?.()) {
      newUnreadCounts = {
        ...state.unreadCounts,
        [conversationId]: (state.unreadCounts[conversationId] || 0) + 1
      };
      localStorage.setItem('unreadCounts', JSON.stringify(newUnreadCounts));
    }

    localStorage.setItem('messages', JSON.stringify(updatedMessagesObj));
    set({
      messages: updatedMessagesObj,
      unreadCounts: newUnreadCounts
    });
  },

  addOptimisticMessage: (message) => {
    const state = get();
    const conversationId = message.conversationId;
    const currentMessages = state.messages[conversationId] || [];
    
    const newMessages = [{ ...message, isOptimistic: true }, ...currentMessages];
    const updatedMessagesObj = {
      ...state.messages,
      [conversationId]: newMessages
    };

    // Không lưu localStorage cho optimistic message
    set({ messages: updatedMessagesObj });
  },

  updateMessage: (messageId, updates) => {
    const state = get();
    const newMessages = { ...state.messages };
    let updated = false;
    
    Object.keys(newMessages).forEach(conversationId => {
      newMessages[conversationId] = newMessages[conversationId].map(msg => {
        if (msg.id === messageId) {
          updated = true;
          return { ...msg, ...updates };
        }
        return msg;
      });
    });

    if (updated) {
      localStorage.setItem('messages', JSON.stringify(newMessages));
      set({ messages: newMessages });
    }
  },

  deleteMessage: (messageId) => {
    const state = get();
    const newMessages = { ...state.messages };
    
    Object.keys(newMessages).forEach(conversationId => {
      newMessages[conversationId] = newMessages[conversationId].filter(
        msg => msg.id !== messageId
      );
    });

    localStorage.setItem('messages', JSON.stringify(newMessages));
    set({ messages: newMessages });
  },

  setMessages: (conversationId, messages) => {
    const state = get();
    const updatedMessagesObj = {
      ...state.messages,
      [conversationId]: messages
    };
    
    localStorage.setItem('messages', JSON.stringify(updatedMessagesObj));
    set({ messages: updatedMessagesObj });
  },

  // Typing users (realtime only - không persist)
  updateTypingUsers: (conversationId, userId, isTyping) => {
    const state = get();
    const currentTyping = state.typingUsers[conversationId] || [];
    let newTyping;

    if (isTyping) {
      newTyping = currentTyping.includes(userId)
        ? currentTyping
        : [...currentTyping, userId];
    } else {
      newTyping = currentTyping.filter(id => id !== userId);
    }

    set({
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: newTyping
      }
    });
  },

  // Online users (realtime only - không persist)
  setOnlineUsers: (users) => {
    set({ onlineUsers: new Set(users) });
  },

  addOnlineUser: (userId) => {
    const state = get();
    const newOnlineUsers = new Set(state.onlineUsers);
    newOnlineUsers.add(userId);
    set({ onlineUsers: newOnlineUsers });
  },

  removeOnlineUser: (userId) => {
    const state = get();
    const newOnlineUsers = new Set(state.onlineUsers);
    newOnlineUsers.delete(userId);
    set({ onlineUsers: newOnlineUsers });
  },

  markConversationAsRead: (conversationId) => {
    const state = get();
    const newUnreadCounts = {
      ...state.unreadCounts,
      [conversationId]: 0
    };
    const newLastSeen = {
      ...state.lastSeen,
      [conversationId]: Date.now()
    };

    localStorage.setItem('unreadCounts', JSON.stringify(newUnreadCounts));
    localStorage.setItem('lastSeen', JSON.stringify(newLastSeen));
    
    set({
      unreadCounts: newUnreadCounts,
      lastSeen: newLastSeen
    });
  },

  incrementUnreadCount: (conversationId) => {
    const state = get();
    const newUnreadCounts = {
      ...state.unreadCounts,
      [conversationId]: (state.unreadCounts[conversationId] || 0) + 1
    };

    localStorage.setItem('unreadCounts', JSON.stringify(newUnreadCounts));
    set({ unreadCounts: newUnreadCounts });
  },

  clearConversation: (conversationId) => {
    const state = get();
    
    // Remove from messages
    const newMessages = { ...state.messages };
    delete newMessages[conversationId];
    
    // Remove from unread counts
    const newUnreadCounts = { ...state.unreadCounts };
    delete newUnreadCounts[conversationId];

    // Remove from last seen
    const newLastSeen = { ...state.lastSeen };
    delete newLastSeen[conversationId];

    // Remove from typing users (runtime only)
    const newTypingUsers = { ...state.typingUsers };
    delete newTypingUsers[conversationId];

    // Update localStorage
    localStorage.setItem('messages', JSON.stringify(newMessages));
    localStorage.setItem('unreadCounts', JSON.stringify(newUnreadCounts));
    localStorage.setItem('lastSeen', JSON.stringify(newLastSeen));

    set({
      messages: newMessages,
      unreadCounts: newUnreadCounts,
      lastSeen: newLastSeen,
      typingUsers: newTypingUsers
    });
  },

  // Reset toàn bộ store
  reset: () => {
    localStorage.removeItem('conversations');
    localStorage.removeItem('activeConversation');
    localStorage.removeItem('messages');
    localStorage.removeItem('unreadCounts');
    localStorage.removeItem('lastSeen');
    
    set({
      conversations: [],
      activeConversation: null,
      messages: {},
      typingUsers: {},
      onlineUsers: new Set(),
      unreadCounts: {},
      lastSeen: {}
    });
  },

  // Helper để lấy current user ID (cần import authStore hoặc truyền vào)
  getCurrentUserId: () => {
    // Bạn có thể import authStore ở đây hoặc truyền vào từ component
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.id;
  }
}));

export default messagesStore;