import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import {  } from '../../../hooks/useWebSocket';
import websocketService from '../../../services/webSocket';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {useWebSocket
    // Listen for new notifications
    const handleNewNotification = (data) => {
      const notification = data.data;
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    websocketService.on('new_notification', handleNewNotification);

    return () => {
      websocketService.off('new_notification', handleNewNotification);
    };
  }, []);

  return (
    <div className="relative">
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  );
};