// src/store/authStore.js
import { create } from 'zustand';

// Optional: Kiểu user
// type User = {
//   id: string,
//   fullName: string,
//   email: string,
//   avatar: string,
//   createdAt: string,
//   updatedAt: string,
// };

const authStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,

  // Lưu user và token
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },

  // Hàm tiện lợi
  getToken: () => get().token,

  // Xoá sạch khi logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));

export default authStore;
