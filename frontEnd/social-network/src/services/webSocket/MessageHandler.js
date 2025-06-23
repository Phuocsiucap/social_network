class MessageHandler {
    constructor(connection) {
        this.connection = connection;
    }

    // Gửi tin nhắn với type và data - FIXED VERSION
    send(messageType, data = {}) {
        const message = {
            messageType: messageType,  // Backend đọc field này
            timestamp: new Date().toISOString(),
            ...data  // Spread data ra ngoài thay vì nest
        };
        return this.connection.send(message);
    }

    // Gửi tin nhắn chat
    sendMessage(conversationId, content, message_Type = 'text') {
        return this.send('CHAT', {  // Dùng 'CHAT' để match với ChatMessageHandler
            chatId: conversationId,  // Backend expect 'chatId'
            content: content,
            message_Type: message_Type  // Này là loại message (text/image/file)
        });
    }

    // Gửi media message
    sendMediaMessage(conversationId, fileUrl, messageType = 'image') {
        return this.send('MEDIA', {  // Match với ChatMessageHandler
            chatId: conversationId,
            fileUrl: fileUrl,
            messageType: messageType
        });
    }

    // Join conversation room
    joinConversation(conversationId) {
        return this.send('CHAT_JOIN', {  // Thêm prefix để phân biệt
            chatId: conversationId
        });
    }

    // Leave conversation room  
    leaveConversation(conversationId) {
        return this.send('CHAT_LEAVE', {
            chatId: conversationId
        });
    }

    // Đánh dấu tin nhắn đã đọc
    markAsRead(conversationId, messageId) {  // Fixed typo: mardAsRead -> markAsRead
        return this.send('CHAT_READ', {
            chatId: conversationId,
            messageId: messageId
        });
    }

    // Typing indicator
    sendTyping(conversationId, isTyping = true) {
        return this.send('CHAT_TYPING', {
            chatId: conversationId,
            isTyping: isTyping
        });
    }

    // Post interactions - Thêm các method cho post
    likePost(postId) {
        return this.send('POST_LIKE', {
            postId: postId
        });
    }

    commentPost(postId, content) {
        return this.send('POST_COMMENT', {
            postId: postId,
            content: content
        });
    }

    sharePost(postId) {
        return this.send('POST_SHARE', {
            postId: postId
        });
    }

    // Friend requests
    sendFriendRequest(targetUserId) {
        return this.send('FRIEND_REQUEST', {
            targetUserId: targetUserId
        });
    }

    acceptFriendRequest(targetUserId) {
        return this.send('FRIEND_ACCEPT', {
            targetUserId: targetUserId
        });
    }

    rejectFriendRequest(targetUserId) {
        return this.send('FRIEND_REJECT', {
            targetUserId: targetUserId
        });
    }
}

// Usage example:
// const messageHandler = new MessageHandler(websocketConnection);
// messageHandler.sendMessage('chat123', 'Hello world!');
// messageHandler.joinConversation('chat123');
// messageHandler.likePost('post456');

export default MessageHandler;