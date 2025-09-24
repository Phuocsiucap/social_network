// 📁 src/utils/constants.js
// ==========================================

// // App Configuration
// export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Social Network';   
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// File Upload Configuration
export const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(',');

// Azure Storage Configuration
export const AZURE_CONFIG = {
  connectionString: import.meta.env.VITE_AZURE_STORAGE_CONNECTION_STRING,
  containerName: import.meta.env.VITE_AZURE_CONTAINER_NAME || 'profile-images',
  cdnEndpoint: import.meta.env.VITE_AZURE_CDN_ENDPOINT
};

// Default User Values
export const DEFAULT_USER_VALUES = {
  username: '',
  email: '',
  avatar: '/placeholder-avatar.png',
  birthday: '',
  gender: '',
  biography: '',
  phone: '',
  location: '',
  website: '',
  occupation: ''
};

// Default Assets
export const DEFAULT_AVATAR = '/placeholder-avatar.png';
export const DEFAULT_COVER = '/images/placeholder-cover.jpg';
export const APP_LOGO = '/images/logo.svg';



// UI Constants
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

export const LANGUAGES = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

// Settings Categories
export const SETTINGS_CATEGORIES = [
  {
    id: 'profile',
    title: 'Hồ sơ',
    icon: 'User',
    description: 'Quản lý thông tin cá nhân'
  },
  {
    id: 'notifications',
    title: 'Thông báo',
    icon: 'Bell',
    description: 'Cài đặt thông báo'
  },
  {
    id: 'privacy',
    title: 'Riêng tư',
    icon: 'Shield',
    description: 'Quyền riêng tư & bảo mật'
  },
  {
    id: 'appearance',
    title: 'Giao diện',
    icon: 'Palette',
    description: 'Chủ đề & hiển thị'
  },
  {
    id: 'language',
    title: 'Ngôn ngữ',
    icon: 'Globe',
    description: 'Ngôn ngữ & khu vực'
  },
  {
    id: 'data',
    title: 'Dữ liệu',
    icon: 'Database',
    description: 'Sao lưu & xuất dữ liệu'
  },
  {
    id: 'account',
    title: 'Tài khoản',
    icon: 'Settings',
    description: 'Cài đặt tài khoản'
  }
];

// Notification Types
export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  MESSAGE: 'message',
  MENTION: 'mention',
  SYSTEM: 'system'
};

// Post Types
export const POST_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  LINK: 'link',
  POLL: 'poll'
};

// Status Constants
export const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away',
  BUSY: 'busy'
};

// Privacy Settings
export const PRIVACY_LEVELS = {
  PUBLIC: 'public',
  FRIENDS: 'friends',
  PRIVATE: 'private'
};

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
  { value: '', label: 'Không muốn tiết lộ' }
];

// Date Formats
export const DATE_FORMATS = {
  FULL: 'dd/MM/yyyy HH:mm',
  DATE_ONLY: 'dd/MM/yyyy',
  TIME_ONLY: 'HH:mm',
  RELATIVE: 'relative', // sử dụng với date-fns
  ISO: 'yyyy-MM-dd'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng',
  UNAUTHORIZED: 'Bạn không có quyền truy cập',
  FORBIDDEN: 'Truy cập bị từ chối',
  NOT_FOUND: 'Không tìm thấy tài nguyên',
  SERVER_ERROR: 'Lỗi máy chủ',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
  FILE_TOO_LARGE: 'File quá lớn',
  INVALID_FILE_TYPE: 'Định dạng file không được hỗ trợ'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Cập nhật hồ sơ thành công',
  POST_CREATED: 'Đăng bài thành công',
  MESSAGE_SENT: 'Gửi tin nhắn thành công',
  FILE_UPLOADED: 'Tải file thành công',
  SETTINGS_SAVED: 'Lưu cài đặt thành công'
};

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  DRAFT_POSTS: 'draft_posts'
};