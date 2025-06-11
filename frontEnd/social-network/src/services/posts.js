// ===== services/posts.js =====
import api from './api'

export const postsAPI = {
  // Get posts (with pagination)
  getPosts: async ({ page = 1, limit = 10, userId = null } = {}) => {
    const params = new URLSearchParams({ page, limit })
    if (userId) params.append('userId', userId)
    
    const response = await api.get(`/posts?${params}`)
    return response.data
  },

  // Get single post
  getPost: async (postId) => {
    const response = await api.get(`/posts/${postId}`)
    return response.data
  },

  // Create post
  createPost: async (postData) => {
    const response = await api.post('/posts', postData)
    return response.data
  },

  // Update post
  updatePost: async (postId, postData) => {
    const response = await api.put(`/posts/${postId}`, postData)
    return response.data
  },

  // Delete post
  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`)
    return response.data
  },

  // Like/Unlike post
  toggleLike: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`)
    return response.data
  },

  // Share post
  sharePost: async (postId, message = '') => {
    const response = await api.post(`/posts/${postId}/share`, { message })
    return response.data
  },

  // Get post likes
  getPostLikes: async (postId, { page = 1, limit = 20 } = {}) => {
    const response = await api.get(`/posts/${postId}/likes?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get comments
  getComments: async (postId, { page = 1, limit = 20 } = {}) => {
    const response = await api.get(`/posts/${postId}/comments?page=${page}&limit=${limit}`)
    return response.data
  },

  // Add comment
  addComment: async (postId, commentData) => {
    const response = await api.post(`/posts/${postId}/comments`, commentData)
    return response.data
  },

  // Update comment
  updateComment: async (commentId, commentData) => {
    const response = await api.put(`/comments/${commentId}`, commentData)
    return response.data
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`)
    return response.data
  },

  // Like comment
  toggleCommentLike: async (commentId) => {
    const response = await api.post(`/comments/${commentId}/like`)
    return response.data
  },

  // Upload media
  uploadMedia: async (files) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    
    const response = await api.post('/upload/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
}