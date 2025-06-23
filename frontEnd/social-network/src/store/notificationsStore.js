// src/store/notificationsStore.js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useNotificationsStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        notifications: [],
        unreadCount: 0,
        settings: {
          enablePush: true,
          enableEmail: true,
          enableInApp: true,
          types: {
            likes: true,
            comments: true,
            follows: true,
            messages: true,
            mentions: true
          }
        },

        // Actions
        setNotifications: (notifications) =>
          set(
            {
              notifications,
              unreadCount: notifications.filter(n => !n.read).length
            },
            false,
            'setNotifications'
          ),

        addNotification: (notification) =>
          set(
            (state) => ({
              notifications: [notification, ...state.notifications],
              unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1
            }),
            false,
            'addNotification'
          ),

        markAsRead: (notificationId) =>
          set(
            (state) => ({
              notifications: state.notifications.map(n =>
                n.id === notificationId ? { ...n, read: true } : n
              ),
              unreadCount: Math.max(0, state.unreadCount - 1)
            }),
            false,
            'markAsRead'
          ),

        markAllAsRead: () =>
          set(
            (state) => ({
              notifications: state.notifications.map(n => ({ ...n, read: true })),
              unreadCount: 0
            }),
            false,
            'markAllAsRead'
          ),

        removeNotification: (notificationId) =>
          set(
            (state) => {
              const notification = state.notifications.find(n => n.id === notificationId);
              const wasUnread = notification && !notification.read;
              
              return {
                notifications: state.notifications.filter(n => n.id !== notificationId),
                unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
              };
            },
            false,
            'removeNotification'
          ),

        updateSettings: (newSettings) =>
          set(
            (state) => ({
              settings: { ...state.settings, ...newSettings }
            }),
            false,
            'updateSettings'
          ),

        clearAll: () =>
          set(
            {
              notifications: [],
              unreadCount: 0
            },
            false,
            'clearAll'
          )
      }),
      {
        name: 'notifications-store',
        partialize: (state) => ({
          notifications: state.notifications,
          settings: state.settings
        })
      }
    ),
    {
      name: 'notifications-store'
    }
  )
);

export default useNotificationsStore;