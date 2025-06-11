// ===== hooks/usePosts.js =====
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { usePostsStore } from '@store/postsStore'
import { postsAPI } from '@services/posts'
import toast from 'react-hot-toast'

export const usePosts = (userId = null) => {
  const queryClient = useQueryClient()
  const { addPost, updatePost, deletePost: removePost, likePost, addComment } = usePostsStore()

  // Infinite query for posts
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['posts', userId],
    queryFn: ({ pageParam = 1 }) => postsAPI.getPosts({ 
      page: pageParam, 
      limit: 10, 
      userId 
    }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined
    },
    onSuccess: (data) => {
      const allPosts = data.pages.flatMap(page => page.posts)
      usePostsStore.getState().setPosts(allPosts)
    }
  })

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: postsAPI.createPost,
    onSuccess: (data) => {
      addPost(data.post)
      queryClient.invalidateQueries(['posts'])
      toast.success('Post created successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create post')
    }
  })

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: ({ postId, ...data }) => postsAPI.updatePost(postId, data),
    onSuccess: (data) => {
      updatePost(data.post.id, data.post)
      queryClient.invalidateQueries(['posts'])
      toast.success('Post updated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update post')
    }
  })

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: postsAPI.deletePost,
    onSuccess: (_, postId) => {
      removePost(postId)
      queryClient.invalidateQueries(['posts'])
      toast.success('Post deleted successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete post')
    }
  })

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: postsAPI.toggleLike,
    onMutate: async (postId) => {
      // Optimistic update
      likePost(postId)
    },
    onError: (error, postId) => {
      // Revert optimistic update
      likePost(postId)
      toast.error(error.response?.data?.message || 'Failed to like post')
    },
    onSettled: () => {
      queryClient.invalidateQueries(['posts'])
    }
  })

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: ({ postId, ...commentData }) => postsAPI.addComment(postId, commentData),
    onSuccess: (data) => {
      addComment(data.comment.postId, data.comment)
      queryClient.invalidateQueries(['posts'])
      queryClient.invalidateQueries(['comments', data.comment.postId])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add comment')
    }
  })

  return {
    // Data
    posts: data?.pages.flatMap(page => page.posts) || [],
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,

    // Actions
    fetchNextPage,
    createPost: createPostMutation.mutate,
    updatePost: updatePostMutation.mutate,
    deletePost: deletePostMutation.mutate,
    likePost: likePostMutation.mutate,
    addComment: addCommentMutation.mutate,

    // Loading states
    isCreatingPost: createPostMutation.isPending,
    isUpdatingPost: updatePostMutation.isPending,
    isDeletingPost: deletePostMutation.isPending,
    isLikingPost: likePostMutation.isPending,
    isAddingComment: addCommentMutation.isPending,
  }
}