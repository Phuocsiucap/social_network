import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Camera, Settings } from 'lucide-react';
import { Button, Card } from '../components/ui';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, fetchCurrentUser, loading } = useAuth();
  const [error, setError] = useState(null);

  // Sử dụng useEffect để fetch user data
  useEffect(() => {
    const loadUser = async () => {
      if (!user) {
        setError(null);
        try {
          await fetchCurrentUser();
        } catch (err) {
          console.error('Error fetching user:', err);
          setError('Không thể tải thông tin người dùng');
        } finally {
        }
      }
    };

    loadUser();
  }, [user, fetchCurrentUser]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <p>Đang tải...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <p>Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.</p>
        
      </div>
    );
  }

  const mockPosts = [
    {
      id: 1,
      user: { name: 'Nguyễn Văn A', avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=3b82f6&color=fff' },
      content: 'Hôm nay thật đẹp trời! 🌞',
      timestamp: '2 giờ trước',
      likes: 12,
      comments: 3,
      image: null
    },
    {
      id: 2,
      user: { name: 'Trần Thị B', avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=8b5cf6&color=fff' },
      content: 'Vừa hoàn thành dự án mới! Cảm thấy rất hạnh phúc 🎉',
      timestamp: '4 giờ trước',
      likes: 24,
      comments: 7,
      image: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Social Network</h1>
            </div>
            
            <div className="relative group">
                <Button onClick={() => navigate('/settings')} variant="outline" size="sm"
                  className="flex items-center space-x-2 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  <Settings className="h-4 w-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  <span className="hidden sm:inline text-gray-700 group-hover:text-blue-600 transition-colors">
                    Cài đặt
                  </span>
                </Button>
              </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Create Post */}
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=3b82f6&color=fff`}
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Bạn đang nghĩ gì?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button variant="primary" size="sm">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Posts */}
          {mockPosts.map(post => (
            <Card key={post.id} className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{post.user.name}</h3>
                  <p className="text-sm text-gray-500">{post.timestamp}</p>
                </div>
              </div>
              
              <p className="text-gray-800 mb-4">{post.content}</p>
              
              <div className="flex items-center space-x-6 pt-3 border-t border-gray-100">
                <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
                  <Heart className="h-5 w-5" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                  <Share2 className="h-5 w-5" />
                  <span className="text-sm">Chia sẻ</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;