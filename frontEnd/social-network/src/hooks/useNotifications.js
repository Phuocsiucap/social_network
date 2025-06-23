// // src/hooks/useNotifications.js
// import { useCallback } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useNotificationsStore } from '../store';
// import { notificationsAPI } from '../services';

// export const useNotifications = () => {
//   const queryClient = useQueryClient();
//   const {
//     notifications,
//     unreadCount,
//     addNotification,
//     markAsRead,
//     markAllAsRead,
//     removeNotification
//   } = useNotificationsStore();

//   // Fetch notifications
//   const {
//     data: notificationsList,
//     isLoading,
//     error,
//     refetch
//   } = useQuery({
//     queryKey: ['notifications'],
//     queryFn: notificationsAPI.getNotifications,
//     staleTime: 30 * 1000, // 30 seconds
//   });

//   // Mark notification as read mutation
//   const markAsReadMutation = useMutation({
//     mutationFn: notificationsAPI.markAsRead,
//     onSuccess: (_, notificationId) => {
//       markAsRead(notificationId);
//       queryClient.invalidateQueries(['notifications']);
//     }
//   });

//   // Mark all as read mutation
//   const markAllAsReadMutation = useMutation({
//     mutationFn: notificationsAPI.markAllAsRead,
//     onSuccess: () => {
//       markAllAsRead();
//       queryClient.invalidateQueries(['notifications']);
//     }
//   });

//   // Delete notification mutation
//   const deleteNotificationMutation = useMutation({
//     mutationFn: notificationsAPI.deleteNotification,
//     onSuccess: (_, notificationId) => {
//       removeNotification(notificationId);
//       queryClient.invalidateQueries(['notifications']);
//     }
//   });

//   const handleMarkAsRead = useCallback((notificationId) => {
//     markAsReadMutation.mutate(notificationId);
//   }, [markAsReadMutation]);

//   const handleMarkAllAsRead = useCallback(() => {
//     markAllAsReadMutation.mutate();
//   }, [markAllAsReadMutation]);

//   const handleDeleteNotification = useCallback((notificationId) => {
//     deleteNotificationMutation.mutate(notificationId);
//   }, [deleteNotificationMutation]);

//   return {
//     notifications: notificationsList || notifications,
//     unreadCount,
//     isLoading,
//     error,
//     refetch,
//     markAsRead: handleMarkAsRead,
//     markAllAsRead: handleMarkAllAsRead,
//     deleteNotification: handleDeleteNotification,
//     addNotification
//   };
// };