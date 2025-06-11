// 📁 src/components/features/settings/PrivacySettings.jsx
// ==========================================

import React, { useState } from 'react';
import { Lock, Smartphone, ChevronRight } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';

const PrivacySettings = () => {
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowTagging: true
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quyền riêng tư</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hiển thị hồ sơ
            </label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="public">Công khai</option>
              <option value="friends">Chỉ bạn bè</option>
              <option value="private">Riêng tư</option>
            </select>
          </div>

          <ToggleSwitch
            checked={privacy.showEmail}
            onChange={() => setPrivacy(prev => ({ ...prev, showEmail: !prev.showEmail }))}
            label="Hiển thị email"
            description="Cho phép người khác xem địa chỉ email của bạn"
          />
          
          <ToggleSwitch
            checked={privacy.showPhone}
            onChange={() => setPrivacy(prev => ({ ...prev, showPhone: !prev.showPhone }))}
            label="Hiển thị số điện thoại"
            description="Cho phép người khác xem số điện thoại của bạn"
          />
          
          <ToggleSwitch
            checked={privacy.allowTagging}
            onChange={() => setPrivacy(prev => ({ ...prev, allowTagging: !prev.allowTagging }))}
            label="Cho phép gắn thẻ"
            description="Cho phép người khác gắn thẻ bạn trong bài viết"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bảo mật</h3>
        <div className="space-y-3">
          <button className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">Đổi mật khẩu</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          
          <button className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">Xác thực 2 bước</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;