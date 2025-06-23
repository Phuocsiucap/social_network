import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  User, 
  MessageCircle, 
  Bell, 
  Search, 
  Settings,
  Users,
  Bookmark,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../hooks';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const mainNavItems = [
    { path: '/', icon: Home, label: 'Trang chủ' },
    { path: '/profile', icon: User, label: 'Hồ sơ' },
    { path: '/messages', icon: MessageCircle, label: 'Tin nhắn' },
    { path: '/notifications', icon: Bell, label: 'Thông báo' },
    { path: '/search', icon: Search, label: 'Tìm kiếm' },
    { path: '/friends', icon: Users, label: 'Bạn bè' },
  ];

  const secondaryNavItems = [
    { path: '/bookmarks', icon: Bookmark, label: 'Đã lưu' },
    { path: '/trending', icon: TrendingUp, label: 'Xu hướng' },
    { path: '/events', icon: Calendar, label: 'Sự kiện' },
    { path: '/settings', icon: Settings, label: 'Cài đặt' },
  ];

  const NavItem = ({ path, icon: Icon, label, onClick }) => {
    const isActive = location.pathname === path;
    
    return (
      <button
        onClick={onClick || (() => navigate(path))}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
          isActive
            ? 'bg-blue-100 text-blue-600 shadow-sm'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
        <span className="font-medium">{label}</span>
      </button>
    );
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* User Profile Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=3b82f6&color=fff`}
              alt={user?.fullName}
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {user?.fullName || 'Người dùng'}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="w-full mt-3 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Xem hồ sơ
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
            Chính
          </h4>
          {mainNavItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </nav>

        {/* Secondary Navigation */}
        <nav className="space-y-1">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
            Khác
          </h4>
          {secondaryNavItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Thống kê</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bài viết</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bạn bè</span>
              <span className="font-medium">234</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Theo dõi</span>
              <span className="font-medium">156</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            © 2024 Social Network
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;