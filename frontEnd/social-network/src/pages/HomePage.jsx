import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Camera, Image, Video, Smile } from 'lucide-react';
import { Button, Card } from '../components/ui';
import { AppLayout } from '../components/layout';
import { useAuth } from '../hooks';
import { useWebSocketStore } from '../store';
import { useNavigate } from 'react-router-dom';
import MessagesPage
 from './MessagesPage';
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

  // State để theo dõi trạng thái conversation được chọn
  const [hasSelectedConversation, setHasSelectedConversation] = useState(false);

  const handleConversationChange = (hasConversation) => {
    setHasSelectedConversation(hasConversation);
  };

  // Loading state
  if (loading) {
    return (
      <AppLayout hideSearchBar={hasSelectedConversation}>
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
      <AppLayout showSidebar={true}>
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

  return (
    <AppLayout hideSearchBar={hasSelectedConversation} showMobileNav={true&& !hasSelectedConversation}>
      {/* WebSocket Connection Status - Hiển thị trạng thái kết nối */}
      <div className={`fixed top-4 right-4 z-50 rounded-full text-sm font-medium `}>
        {isConnected ? '🟢' : '🟡'}
      </div>
      <MessagesPage onConversationChange={handleConversationChange} />
    </AppLayout>
  );
};

export default HomePage;