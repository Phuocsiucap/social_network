
// ===== services/users.js =====
import api from './api'

const usersAPI = {
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

  
}

export default usersAPI;