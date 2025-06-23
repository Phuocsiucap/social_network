// src/store/useWebSocketStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useWebSocketStore = create(
  devtools((set, get) => ({
    // Connection state only
    isConnected: false,
    connectionState: 'DISCONNECTED',
    reconnectAttempts: 0,

    // Only notifications (messages are handled by useMessagesStore)
    notifications: [],

    // Connection actions
    setConnected: (connected) =>
      set({ isConnected: connected }, false, 'setConnected'),

    setConnectionState: (state) =>
      set({ connectionState: state }, false, 'setConnectionState'),

    setReconnectAttempts: (attempts) =>
      set({ reconnectAttempts: attempts }, false, 'setReconnectAttempts'),

    // Notification actions
    addNotification: (notification) =>
      set(
        (state) => ({
          notifications: [notification, ...state.notifications]
        }),
        false,
        'addNotification'
      ),

    removeNotification: (notificationId) =>
      set(
        (state) => ({
          notifications: state.notifications.filter(n => n.id !== notificationId)
        }),
        false,
        'removeNotification'
      ),

    clearNotifications: () =>
      set({ notifications: [] }, false, 'clearNotifications'),

    markNotificationAsRead: (notificationId) =>
      set(
        (state) => ({
          notifications: state.notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        }),
        false,
        'markNotificationAsRead'
      ),

    reset: () =>
      set(
        {
          isConnected: false,
          connectionState: 'DISCONNECTED',
          reconnectAttempts: 0,
          notifications: []
        },
        false,
        'reset'
      )
  }),
  {
    name: 'websocket-store'
  })
);

export default useWebSocketStore;