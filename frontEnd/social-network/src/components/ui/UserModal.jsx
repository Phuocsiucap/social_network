
import { useEffect, useState } from 'react';
import { X, Phone, Mail, MapPin, Users, MessageCircle, UserPlus, Check, Clock, Ban } from 'lucide-react';
import { friendAPI } from '../../services';  

const UserModal = ({ id, onClose, onUpdateUserStatus, onShowNotification }) => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await friendAPI.getDetailFriendShip(id);
        setData(response);
        setUser(response.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        onShowNotification?.("Lỗi khi lấy thông tin người dùng");
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, onShowNotification]);

  const getInitials = (username) => {
    if (!username) return '';
    return username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (!user) {
    return <div>Đang tải...</div>;
  }

  

  const handleSendFriendRequest = () => {
    onUpdateUserStatus(user.id, 'send_request');
    onShowNotification('✅ Đã gửi lời mời kết bạn', 'success');
    onClose();
  };

  const handleAcceptFriend = () => {
    onUpdateUserStatus(user.id, 'accept_request');
    onShowNotification('🎉 Đã trở thành bạn bè!', 'success');
    onClose();
  };

  const handleDeclineFriend = () => {
    onUpdateUserStatus(user.id, "reject_request");
    onShowNotification('❌ Đã từ chối lời mời kết bạn', 'info');
    onClose();
  };

  const handleCancelRequest = () => {
    onUpdateUserStatus(user.id, "cancel_request");
    onShowNotification('🚫 Đã hủy lời mời kết bạn', 'info');
    onClose();
  };

  const handleSendMessage = () => {
    onShowNotification(`💬 Đang mở cuộc trò chuyện với ${user.username}...`, 'info');
    onClose();
    // Navigate to chat
    setTimeout(() => {
      window.location.href = `#chat/${user.id}`;
    }, 1000);
  };

  const handleViewProfile = () => {
    onShowNotification(`👤 Đang mở trang cá nhân của ${user.username}...`, 'info');
    onClose();
  };

  const renderActionButtons = () => {
    switch (data.status.toLowerCase()) {
      case 'friend':
        return (
          <>
            <button
              onClick={handleSendMessage}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Nhắn tin
            </button>
            <button
              onClick={handleViewProfile}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <Users className="w-5 h-5" />
              Xem trang cá nhân
            </button>
          </>
        );

      case 'pending':
        return (
          <>
            <button
              onClick={handleAcceptFriend}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-all duration-200 hover:shadow-lg"
            >
              <Check className="w-5 h-5" />
              Chấp nhận
            </button>
            <button
              onClick={handleDeclineFriend}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
              Từ chối
            </button>
          </>
        );

      case 'sent':
        return (
          <button
            onClick={handleCancelRequest}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <Ban className="w-5 h-5" />
            Hủy lời mời
          </button>
        );

      default:
        return (
          <>
            <button
              onClick={handleSendFriendRequest}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
            >
              <UserPlus className="w-5 h-5" />
              Gửi lời mời kết bạn
            </button>
            <button
              onClick={handleSendMessage}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Nhắn tin
            </button>
          </>
        );
    }
  };

  const getFriendshipStatusBadge = () => {
    switch (user.friendStatus) {
      case 'friend':
        return (
          <div className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold mt-4">
            <Check className="w-4 h-4" />
            Đã là bạn bè
          </div>
        );
      case 'pending':
        return (
          <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mt-4">
            <Clock className="w-4 h-4" />
            Chờ phản hồi từ bạn
          </div>
        );
      case 'sent':
        return (
          <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mt-4">
            <Clock className="w-4 h-4" />
            Đã gửi lời mời
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials(user.username)}
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">{user.username}</h2>
            <p className="text-blue-100">{user.email}</p>
            {getFriendshipStatusBadge()}
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* User Details */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Số điện thoại</div>
                <div className="font-medium">{user.phone}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-medium">{user.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Vị trí</div>
                <div className="font-medium">{user.location}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <Users className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Bạn chung</div>
                <div className="font-medium">{data.mutualFriends} người</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <MessageCircle className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500">Giới thiệu</div>
                <div className="font-medium">{user.bio}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {renderActionButtons()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;