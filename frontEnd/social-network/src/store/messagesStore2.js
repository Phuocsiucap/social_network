// // stores/messagesStore.js
// import { create } from 'zustand';

// const messagesStore2 = create((set, get) => ({
//   conversations:  JSON.parse(localStorage.getItem('conversations')) || [],
//   activeConversation: localStorage.getItem('activeConversation') || null,
//   messages: JSON.parse(localStorage.getItem('messages')) ||{}, // { [conversationId]: [...messages] }
//   unreadCounts:JSON.parse(localStorage.getItem('unreadCounts')) || {}, // { [conversationId]: number }

//   // Cập nhật danh sách cuộc trò chuyện
//   setConversations: (conversations) => {
//     localStorage.setItem('conversations', conversations)
//     set({ conversations });
//   },

//   // Đặt cuộc trò chuyện đang hoạt động
//   setActiveConversation: (conversationId) => {
//     localStorage.setItem('activeConversation', conversationId)
//     set({ activeConversation: conversationId });
//   },

//   // Ghi đè toàn bộ messages cho một cuộc trò chuyện
//   setMessages: (conversationId, newMessages) => {
   
//     set((state) => ({
//       messages: {
//         ...state.messages,
//         [conversationId]: newMessages,
//       },
//     }));
//     localStorage.setItem('messages', get().messages);
//   },

//   // Thêm messages vào đầu (prepend)
//   addMessages: (conversationId, moreMessages) => {
//     const current = get().messages[conversationId] || [];
//     set((state) => ({
//       messages: {
//         ...state.messages,
//         [conversationId]: [...moreMessages, ...current],
//       },
//     }));
//   },

//   // Lấy số tin chưa đọc cho 1 cuộc trò chuyện
//   getUnreadCount: (conversationId) => {
//     return get().unreadCounts[conversationId] || 0;
//   },

//   // Tổng số tin chưa đọc
//   getTotalUnreadCount: () => {
//     return Object.values(get().unreadCounts).reduce((sum, count) => sum + count, 0);
//   },

//   // Lấy tin nhắn theo conversationId
//   getMessagesByConversationId: () => {
//     return get().messages[get().activeConversation] || [];
//   },
// }));

// export default messagesStore2;
