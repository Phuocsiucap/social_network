
// ===== services/users.js =====
import api from './api'

export const usersAPI = {
  // Get user profile
  getUser: async (userId) => {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },

  // Search users
  searchUsers: async (query, { page = 1, limit = 20 } = {}) => {
    const response = await api.get(`/users/search?q=${query}&page=${page}&limit=${limit}`)
    return response.data
  },

  // Get suggested users
  getSuggestedUsers: async ({ limit = 10 } = {}) => {
    const response = await api.get(`/users/suggestions?limit=${limit}`)
    return response.data
  },

  // Follow/Unfollow user
  toggleFollow: async (userId) => {
    const response = await api.post(`/users/${userId}/follow`)
    return response.data
  },

  // Get followers
  getFollowers: async (userId, { page = 1, limit = 20 } = {}) => {
    const response = await api.get(`/users/${userId}/followers?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get following
  getFollowing: async (userId, { page = 1, limit = 20 } = {}) => {
    const response = await api.get(`/users/${userId}/following?page=${page}&limit=${limit}`)
    return response.data
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData)
    return response.data
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  // Upload cover photo
  uploadCover: async (file) => {
    const formData = new FormData()
    formData.append('cover', file)
    
    const response = await api.post('/users/cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
}