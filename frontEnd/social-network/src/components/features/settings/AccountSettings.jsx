// 📁 src/components/features/settings/AccountSettings.jsx
// ==========================================

import React from 'react';
import { Mail, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from './../../../hooks';

const AccountSettings = () => {
    // const { logout } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quản lý tài khoản</h3>
        <div className="space-y-3">
          <button className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">Thay đổi email</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          
          <button  className="flex items-center justify-between w-full p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
            <div className="flex items-center space-x-3">
              <LogOut className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-800">Đăng xuất khỏi tất cả thiết bị</span>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;