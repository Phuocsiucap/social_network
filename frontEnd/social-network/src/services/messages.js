import api from './api';

const messagesAPI = {
  // Lấy danh sách cuộc trò chuyện
  getChats: async ({ page = 1, limit = 20 } = {}) => {
    try {
      const response = await api.get('/api/chats');
      console.log("getChats response:", response.data);
      
      // Đảm bảo luôn return array
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.data)) {
        return data.data;
      } else if (data && Array.isArray(data.result)) {
        return data.result;
      } else if (data && Array.isArray(data.conversations)) {
        return data.conversations;
      } else {
        console.warn('API response is not an array:', data);
        return [];
      }
    } catch (error) {
      console.error('Error in getChats:', error);
      throw error;
    }
  },

  // Tạo hoặc lấy một cuộc trò chuyện
  getOrCreateChat: async (userId) => {
    const response = await api.post('/api/chats', { userId });
    return response.data;
  },

  // Lấy danh sách tin nhắn
  getMessages: async (chatId, { page = 1, limit = 50 } = {}) => {
    const response = await api.get(`/api/chats/${chatId}/messages?page=${page}&limit=${limit}`);
    console.log(response);
    return {
      messages: response.data.result.data || [],
      hasMore: response.data.result.hasMore || false,
      total: response.data.result.total || 0
    };
  },

  // Gửi tin nhắn
  sendMessage: async (chatId, messageData) => {
    const response = await api.post(`/api/chats/${chatId}/messages`, messageData);
    return response.data;
  },

  // Đánh dấu đã đọc
  markAsRead: async (chatId) => {
    const response = await api.put(`/api/chats/${chatId}/read`);
    return response.data;
  },

  // Xoá tin nhắn
  deleteMessage: async (messageId) => {
    const response = await api.delete(`/api/messages/${messageId}`);
    return response.data;
  },

  // Tìm kiếm tin nhắn
  searchMessages: async (query, chatId = null) => {
    const params = new URLSearchParams({ q: query });
    if (chatId) params.append('chatId', chatId);
    const response = await api.get(`/api/messages/search?${params.toString()}`);
    return response.data;
  }
};

export default messagesAPI;