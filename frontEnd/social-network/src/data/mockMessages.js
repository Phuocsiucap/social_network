// Mock data for messages
const mockChats = [
  {
    id: 1,
    user: {
      id: 1,
      name: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b45c8c8e?w=50&h=50&fit=crop&crop=face',
      isOnline: true,
      lastSeen: null
    },
    lastMessage: {
      text: 'Hey! How was your day?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      isRead: false,
        
    },
    unreadCount: 2
  },
  {
    id: 2,
    user: {
      id: 2,
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      isOnline: false,
      lastSeen: new Date(Date.now() - 30 * 60 * 1000)
    },
    lastMessage: {
      text: 'Thanks for the help!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      senderId: 'me'
    },
    unreadCount: 0
  },
  {
    id: 3,
    user: {
      id: 3,
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      isOnline: true,
      lastSeen: null
    },
    lastMessage: {
      text: 'See you tomorrow!',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: true,
      senderId: 3
    },
    unreadCount: 0
  },
  {
    id: 4,
    user: {
      id: 4,
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      isOnline: false,
      lastSeen: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },
    lastMessage: {
      text: 'Great work on the project!',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: true,
      senderId: 4
    },
    unreadCount: 0
  }
];

const mockMessages = {
  1: [
    {
      id: 1,
      text: 'Hey! How are you doing?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      senderId: 1,
      isRead: true
    },
    {
      id: 2,
      text: 'I\'m good! Just finished a big project at work.',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      senderId: 'me',
      isRead: true
    },
    {
      id: 3,
      text: 'That\'s awesome! Congratulations 🎉',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      senderId: 1,
      isRead: true
    },
    {
      id: 4,
      text: 'Thanks! Want to grab coffee sometime this week?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      senderId: 'me',
      isRead: true
    },
    {
      id: 5,
      text: 'Hey! How was your day?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      senderId: 1,
      isRead: false
    }
  ]
};

const mockData =() => ({
    chats: mockChats,
    messages: mockMessages
});

export default mockData;