// ===== store/messagesStore.js =====
import { create } from 'zustand'

const messagesStore = create((set, get) => ({
  chats: [],
  currentChat: null,
  messages: [],
  error: null,
  onlineUsers: [],

  // Actions
  setChats: (chats) => set({ chats }),
  
  setCurrentChat: (chat) => set({ currentChat: chat }),
  
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set(state => ({
    messages: [...state.messages, message],
    chats: state.chats.map(chat => 
      chat.id === message.chatId 
        ? { 
            ...chat, 
            lastMessage: message,
            updatedAt: new Date().toISOString(),
            unreadCount: chat.id === state.currentChat?.id ? 0 : chat.unreadCount + 1
          }
        : chat
    )
  })),
  
  markAsRead: (chatId) => set(state => ({
    chats: state.chats.map(chat => 
      chat.id === chatId 
        ? { ...chat, unreadCount: 0 }
        : chat
    )
  })),
  
  setOnlineUsers: (users) => set({ onlineUsers }),
  
  setUserOnline: (userId) => set(state => ({
    onlineUsers: [...new Set([...state.onlineUsers, userId])]
  })),
  
  setUserOffline: (userId) => set(state => ({
    onlineUsers: state.onlineUsers.filter(id => id !== userId)
  })),
  

  
  setError: (error) => set({ error }),
  
  clearChats: () => set({
    chats: [],
    currentChat: null,
    messages: [],
    error: null
  }),

  // Getters
  getTotalUnread: () => {
    const { chats } = get()
    return chats.reduce((total, chat) => total + chat.unreadCount, 0)
  },

  isUserOnline: (userId) => {
    const { onlineUsers } = get()
    return onlineUsers.includes(userId)
  }
}))

export default messagesStore