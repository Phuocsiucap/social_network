// ===== store/uiStore.js =====
import { create } from 'zustand'

const useUIStore = create((set, get) => ({
  // Theme
  theme: 'light',
  
  // Mobile
  isMobileMenuOpen: false,
  
  // Modals
  modals: {
    createPost: false,
    editProfile: false,
    postDetails: false,
    confirmDialog: false
  },
  
  // Loading states
  globalLoading: false,
  
  // Notifications
  notifications: [],
  
  // Search
  searchQuery: '',
  searchResults: [],
  isSearching: false,

  // Actions
  toggleTheme: () => set(state => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
  
  setTheme: (theme) => set({ theme }),
  
  toggleMobileMenu: () => set(state => ({
    isMobileMenuOpen: !state.isMobileMenuOpen
  })),
  
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  
  openModal: (modalName) => set(state => ({
    modals: { ...state.modals, [modalName]: true }
  })),
  
  closeModal: (modalName) => set(state => ({
    modals: { ...state.modals, [modalName]: false }
  })),
  
  closeAllModals: () => set(state => ({
    modals: Object.keys(state.modals).reduce((acc, key) => {
      acc[key] = false
      return acc
    }, {})
  })),
  
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
  
  addNotification: (notification) => set(state => ({
    notifications: [{
      id: Date.now(),
      timestamp: new Date(),
      ...notification
    }, ...state.notifications]
  })),
  
  removeNotification: (id) => set(state => ({
    notifications: state.notifications.filter(notif => notif.id !== id)
  })),
  
  clearNotifications: () => set({ notifications: [] }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSearchResults: (results) => set({ searchResults: results }),
  
  setSearching: (searching) => set({ isSearching: searching }),
  
  clearSearch: () => set({
    searchQuery: '',
    searchResults: [],
    isSearching: false
  }),

  // Getters
  isDarkMode: () => get().theme === 'dark',
  
  isModalOpen: (modalName) => get().modals[modalName] || false,
  
  getUnreadNotifications: () => {
    const { notifications } = get()
    return notifications.filter(notif => !notif.read)
  }
}));

export default useUIStore;