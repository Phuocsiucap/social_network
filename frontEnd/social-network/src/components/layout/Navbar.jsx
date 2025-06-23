import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  MessageCircle, 
  Settings, 
  User, 
  LogOut, 
  Home,
  Menu,
  X,
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react';
import { Button, Avatar, Dropdown } from '../ui';
import { useAuth } from '../../hooks';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications] = useState([
    { id: 1, text: 'Bạn có một tin nhắn mới', unread: true },
    { id: 2, text: 'Ai đó đã thích bài viết của bạn', unread: true },
    { id: 3, text: 'Bạn có một lời mời kết bạn', unread: false }
  ]);
  
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      searchInputRef.current?.blur();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Here you would implement dark mode logic
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  const unreadNotifications = notifications.filter(n => n.unread).length;

  const navItems = [
    { path: '/', icon: Home, label: 'Trang chủ' },
    { path: '/messages', icon: MessageCircle, label: 'Tin nhắn' },
    { path: '/notifications', icon: Bell, label: 'Thông báo', badge: unreadNotifications }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            <div 
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block group-hover:text-blue-600 transition-colors">
                Social Network
              </h1>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm bạn bè, bài viết..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                />
              </div>
            </form>
          </div>

          {/* Navigation & User Menu */}
          <div className="flex items-center space-x-2">
            {/* Navigation Icons - Desktop */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(({ path, icon: Icon, label, badge }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`relative p-2 rounded-lg transition-colors ${
                    location.pathname === path
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title={label}
                >
                  <Icon className="h-5 w-5" />
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title={darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Settings Button */}
            <button
              onClick={() => navigate('/settings')}
              className={`p-2 rounded-lg transition-colors ${
                location.pathname === '/settings'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Cài đặt"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Avatar
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=3b82f6&color=fff`}
                  alt={user?.fullName || 'User'}
                  size="sm"
                />
                <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                  >
                    <User className="h-4 w-4" />
                    <span>Hồ sơ của tôi</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Cài đặt</span>
                  </button>
                  
                  <hr className="my-1" />
                  
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </form>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200 py-3">
            <div className="space-y-1">
              {navItems.map(({ path, icon: Icon, label, badge }) => (
                <button
                  key={path}
                  onClick={() => {
                    navigate(path);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    location.pathname === path
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="relative">
                    <Icon className="h-5 w-5" />
                    {badge > 0 && (
                      <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {badge > 9 ? '9+' : badge}
                      </span>
                    )}
                  </div>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;