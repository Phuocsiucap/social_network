
// 📁 src/components/features/settings/NotificationSettings.jsx
// ==========================================

import React, { useState } from 'react';
import ToggleSwitch from './ToggleSwitch';

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    posts: true,
    comments: true,
    mentions: true,
    messages: true,
    marketing: false
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông báo đẩy</h3>
        <div className="space-y-2">
          <ToggleSwitch
            checked={notifications.posts}
            onChange={() => setNotifications(prev => ({ ...prev, posts: !prev.posts }))}
            label="Bài viết mới"
            description="Nhận thông báo khi có bài viết mới từ người bạn theo dõi"
          />
          <ToggleSwitch
            checked={notifications.comments}
            onChange={() => setNotifications(prev => ({ ...prev, comments: !prev.comments }))}
            label="Bình luận"
            description="Nhận thông báo khi có người bình luận bài viết của bạn"
          />
          <ToggleSwitch
            checked={notifications.mentions}
            onChange={() => setNotifications(prev => ({ ...prev, mentions: !prev.mentions }))}
            label="Nhắc đến"
            description="Nhận thông báo khi có người nhắc đến bạn"
          />
          <ToggleSwitch
            checked={notifications.messages}
            onChange={() => setNotifications(prev => ({ ...prev, messages: !prev.messages }))}
            label="Tin nhắn"
            description="Nhận thông báo tin nhắn mới"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email</h3>
        <div className="space-y-2">
          <ToggleSwitch
            checked={notifications.marketing}
            onChange={() => setNotifications(prev => ({ ...prev, marketing: !prev.marketing }))}
            label="Email marketing"
            description="Nhận email về tính năng mới và cập nhật"
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;