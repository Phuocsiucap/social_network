
// 📁 src/components/features/settings/SettingsSidebar.jsx
// ==========================================

import React from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Eye, 
  Globe, 
  Download,
  Lock
} from 'lucide-react';

const SettingsSidebar = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'privacy', label: 'Riêng tư & Bảo mật', icon: Shield },
    { id: 'appearance', label: 'Giao diện', icon: Eye },
    { id: 'language', label: 'Ngôn ngữ', icon: Globe },
    { id: 'data', label: 'Dữ liệu & Lưu trữ', icon: Download },
    { id: 'account', label: 'Tài khoản', icon: Lock },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors border-b border-gray-100 last:border-b-0 ${
              activeSection === section.id
                ? 'bg-blue-50 text-blue-700 border-r-2 border-r-blue-500'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{section.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SettingsSidebar;