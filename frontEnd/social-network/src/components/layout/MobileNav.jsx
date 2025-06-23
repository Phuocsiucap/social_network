import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, MessageCircle, Bell, Search } from 'lucide-react';

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Trang chủ' },
    { path: '/search', icon: Search, label: 'Tìm kiếm' },
    { path: '/messages', icon: MessageCircle, label: 'Tin nhắn' },
    { path: '/notifications', icon: Bell, label: 'Thông báo' },
    { path: '/profile', icon: User, label: 'Hồ sơ' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-5 h-16">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;