import { create } from 'zustand'

export const usePostsStore = create((set, get) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  hasMore: true,
  page: 1,
  error: null,

  // Actions
  setPosts: (posts) => set({ posts }),
  
  addPost: (post) => set(state => ({ 
    posts: [post, ...state.posts] 
  })),
  
  updatePost: (postId, updates) => set(state => ({
    posts: state.posts.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    )
  })),
  
  deletePost: (postId) => set(state => ({
    posts: state.posts.filter(post => post.id !== postId)
  })),
  
  setCurrentPost: (post) => set({ currentPost: post }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  loadMorePosts: (newPosts) => set(state => ({
    posts: [...state.posts, ...newPosts],
    page: state.page + 1,
    hasMore: newPosts.length > 0
  })),
  
  clearPosts: () => set({
    posts: [],
    currentPost: null,
    page: 1,
    hasMore: true,
    error: null
  }),

  // Post interactions
  likePost: (postId) => set(state => ({
    posts: state.posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked 
              ? post.likes - 1 
              : post.likes + 1,
            isLiked: !post.isLiked 
          }
        : post
    )
  })),

  sharePost: (postId) => set(state => ({
    posts: state.posts.map(post => 
      post.id === postId 
        ? { ...post, shares: post.shares + 1 }
        : post
    )
  })),

  addComment: (postId, comment) => set(state => ({
    posts: state.posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            comments: post.comments + 1,
            lastComments: [comment, ...(post.lastComments || [])].slice(0, 3)
          }
        : post
    )
  }))
}))