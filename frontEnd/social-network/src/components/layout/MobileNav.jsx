import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, Users, Phone, Settings } from 'lucide-react';

const MobileNav = ({ hideSearchBar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: MessageCircle, label: 'Chat' },
    { path: '/friends', icon: Users, label: 'Bạn bè' },
    { path: '/calls', icon: Phone, label: 'Cuộc gọi' },
    { path: '/settings', icon: Settings, label: 'Cài đặt' },
  ];

  return (
    
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-4 h-16">
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