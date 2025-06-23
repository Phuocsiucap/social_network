import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Camera, Image, Video, Smile } from 'lucide-react';
import { Button, Card } from '../components/ui';
import { AppLayout } from '../components/layout';
import { useAuth } from '../hooks';
import { useWebSocketStore } from '../store';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const isConnected = useWebSocketStore(state => state.isConnected); // ✅

  const navigate = useNavigate();
  const { user, fetchCurrentUser, loading } = useAuth();
  const [error, setError] = useState(null);
  const [postContent, setPostContent] = useState('');

  console.log("homepage isConnected: ", isConnected);
  // Chỉ fetch user data, không cần kết nối WebSocket
  useEffect(() => {
    const loadUser = async () => {
      if (!user) {
        setError(null);
        try {
          await fetchCurrentUser();
        } catch (err) {
          console.error('Error fetching user:', err);
          setError('Không thể tải thông tin người dùng');
        }
      }
    };

    loadUser();
  }, [user, fetchCurrentUser]);

  // Loading state
  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64 text-gray-600">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Đang tải...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <p className="text-lg font-medium">{error}</p>
            </div>
            <Button onClick={() => window.location.reload()} variant="primary">
              Thử lại
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout showSidebar={false}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.
            </p>
            <Button onClick={() => navigate('/login')} variant="primary">
              Đăng nhập
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const mockPosts = [
    {
      id: 1,
      user: { 
        name: 'Nguyễn Văn A', 
        avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=3b82f6&color=fff',
        isOnline: true
      },
      content: 'Hôm nay thật đẹp trời! Mọi người có kế hoạch gì thú vị không? 🌞',
      timestamp: '2 giờ trước',
      likes: 12,
      comments: 3,
      shares: 1,
      image: null,
      isLiked: false
    },
    // ... other mock posts
  ];

  const handleCreatePost = () => {
    if (postContent.trim()) {
      console.log('Creating post:', postContent);
      setPostContent('');
    }
  };

  return (
    <AppLayout>
      {/* WebSocket Connection Status - Hiển thị trạng thái kết nối */}
      <div className={`fixed top-4 right-4 z-50 px-3 py-1 rounded-full text-sm font-medium ${
        isConnected 
          ? 'bg-green-100 text-green-800' 
          : 'bg-yellow-100 text-yellow-800'
      }`}>
        {isConnected ? '🟢 Đã kết nối' : '🟡 Đang kết nối...'}
      </div>

      <div className="w-full max-w-full px-2 sm:px-4 lg:px-6">
        <div className="space-y-2 sm:space-y-6">
          {/* Create Post Card */}
          <Card className="w-full p-2 sm:p-4 lg:p-6">
            <div className="flex items-start space-x-3">
              <img
                src={user.avatar || 'https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff'}
                alt="Avatar"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Bạn đang nghĩ gì?"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                  rows="3"
                />
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <button className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                      <Video className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium hidden sm:inline">Video</span>
                    </button>
                    <button className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-yellow-500 transition-colors">
                      <Smile className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium hidden sm:inline">Cảm xúc</span>
                    </button>
                  </div>
                  
                  <Button 
                    onClick={handleCreatePost}
                    variant="primary" 
                    size="sm"
                    disabled={!postContent.trim()}
                    className="px-4 sm:px-6 text-sm"
                  >
                    Đăng
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Stories Section */}
          <Card className="w-full p-3 sm:p-4 lg:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Tin nổi bật</h3>
            <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex-shrink-0">
                <button className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300">
                  <Camera className="h-4 w-4 sm:h-6 sm:w-6 text-gray-500" />
                </button>
                <p className="text-xs text-center mt-2 text-gray-600">Thêm tin</p>
              </div>
              
              {[1, 2, 3, 4, 5].map((story) => (
                <div key={story} className="flex-shrink-0">
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-blue-500 p-0.5">
                    <img
                      src={`https://ui-avatars.com/api/?name=Story${story}&background=random&color=fff`}
                      alt={`Story ${story}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-center mt-2 text-gray-600">Người {story}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-4 sm:space-y-6">
            {mockPosts.map(post => (
              <Card key={post.id} className="w-full overflow-hidden">
                <div className="p-2 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="relative flex-shrink-0">
                        <img
                          src={post.user.avatar}
                          alt={post.user.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                        />
                        {post.user.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm sm:text-base text-gray-900 hover:text-blue-600 cursor-pointer truncate">
                          {post.user.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">{post.timestamp}</p>
                      </div>
                    </div>
                    
                    <button className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 text-gray-500 flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mb-3 sm:mb-4">
                    <p className="text-sm sm:text-base text-gray-800 whitespace-pre-line break-words">{post.content}</p>
                  </div>
                </div>

                {/* Post Actions - Simplified */}
                <div className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
                  <div className="flex items-center justify-around">
                    <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-gray-50 transition-colors">
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium">Thích</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-gray-50 transition-colors">
                      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium">Bình luận</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-gray-500 hover:text-green-500 hover:bg-gray-50 transition-colors">
                      <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm font-medium">Chia sẻ</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center py-6 sm:py-8">
            <Button variant="outline" size="lg" className="px-6 sm:px-8">
              Xem thêm bài viết
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default HomePage;