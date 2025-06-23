// Utility functions for messages
export const messageUtils = {
  // Format timestamp for message display
  formatMessageTime: (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  },

  // Format timestamp for chat list
  formatChatTime: (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diff = now - messageDate;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes < 1 ? 'Now' : `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else if (days < 7) {
      return `${days}d`;
    } else {
      return messageDate.toLocaleDateString();
    }
  },

  // Group messages by date
  groupMessagesByDate: (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages
    }));
  },

  // Check if message is from current user
  isMyMessage: (message, currentUserId) => {
    return message.senderId === currentUserId || message.senderId === 'me';
  },

  // Truncate message text for preview
  truncateMessage: (text, maxLength = 50) => {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.substring(0, maxLength).trim()}...`;
  }
};