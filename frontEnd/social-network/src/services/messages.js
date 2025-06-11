// ===== services/messages.js =====
import api from './api'

export const messagesAPI = {
  // Get chats
  getChats: async ({ page = 1, limit = 20 } = {}) => {
    const response = await api.get(`/chats?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get or create chat
  getOrCreateChat: async (userId) => {
    const response = await api.post('/chats', { userId })
    return response.data
  },

  // Get messages
  getMessages: async (chatId, { page = 1, limit = 50 } = {}) => {
    const response = await api.get(`/chats/${chatId}/messages?page=${page}&limit=${limit}`)
    return response.data
  },

  // Send message
  sendMessage: async (chatId, messageData) => {
    const response = await api.post(`/chats/${chatId}/messages`, messageData)
    return response.data
  },

  // Mark messages as read
  markAsRead: async (chatId) => {
    const response = await api.put(`/chats/${chatId}/read`)
    return response.data
  },

  // Delete message
  deleteMessage: async (messageId) => {
    const response = await api.delete(`/messages/${messageId}`)
    return response.data
  },

  // Search messages
  searchMessages: async (query, chatId = null) => {
    const params = new URLSearchParams({ q: query })
    if (chatId) params.append('chatId', chatId)
    
    const response = await api.get(`/messages/search?${params}`)
    return response.data
  }
}