// components/features/messages/MessageBubble.jsx
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Check, CheckCheck, AlertCircle, RotateCcw, Download, Eye, File, Image, Video, Music } from 'lucide-react';

const MessageBubble = ({ 
  message, 
  isOwn, 
  showAvatar, 
  showSenderName, 
  showTimestamp = true, // Mặc định hiển thị timestamp
  isConsecutive = false, // Mặc định không liên tiếp
  user, 
  onRetry 
}) => {
  const formatTime = (dateStr) => {
    return format(new Date(dateStr), 'HH:mm', { locale: vi });
  };

  const getDeliveryIcon = () => {
    if (message.status === 'sending') return null;
    if (message.status === 'failed') return <AlertCircle className="w-3 h-3 text-red-500" />;
    if (message.isRead) return <CheckCheck className="w-3 h-3 text-blue-500" />;
    if (message.delivered) return <CheckCheck className="w-3 h-3 text-gray-400" />;
    return <Check className="w-3 h-3 text-gray-400" />;
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (fileType?.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (fileType?.startsWith('audio/')) return <Music className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        );

      case 'image':
        return (
          <div className="space-y-2">
            <div className="relative group">
              <img
                src={message.fileUrl || message.content}
                alt={message.fileName || 'Image'}
                className="max-w-xs max-h-64 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(message.fileUrl || message.content, '_blank')}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
            {message.fileName && (
              <p className="text-xs text-gray-500">{message.fileName}</p>
            )}
          </div>
        );

      case 'file':
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg max-w-xs">
            <div className="flex-shrink-0 text-gray-500">
              {getFileIcon(message.fileType)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {message.fileName || 'Unknown file'}
              </p>
              <p className="text-xs text-gray-500">
                {message.fileSize ? formatFileSize(message.fileSize) : 'Unknown size'}
              </p>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => window.open(message.fileUrl || message.content, '_blank')}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                title="Xem file"
              >
                <Eye className="w-4 h-4 text-gray-500" />
              </button>
              <a
                href={message.fileUrl || message.content}
                download={message.fileName}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                title="Tải xuống"
              >
                <Download className="w-4 h-4 text-gray-500" />
              </a>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-2">
            <video
              controls
              className="max-w-xs max-h-64 rounded-lg"
              preload="metadata"
            >
              <source src={message.fileUrl || message.content} type={message.fileType} />
              Your browser does not support the video tag.
            </video>
            {message.fileName && (
              <p className="text-xs text-gray-500">{message.fileName}</p>
            )}
          </div>
        );

      case 'audio':
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg max-w-xs">
            <div className="flex-shrink-0 text-gray-500">
              <Music className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <audio controls className="w-full">
                <source src={message.fileUrl || message.content} type={message.fileType} />
                Your browser does not support the audio element.
              </audio>
              {message.fileName && (
                <p className="text-xs text-gray-500 mt-1">{message.fileName}</p>
              )}
            </div>
          </div>
        );

      default:
        return (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        );
    }
  };

  return (
    <div className={`flex items-end space-x-2 mb-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar for others */}
      {!isOwn && (
        <div className="w-8 h-8 flex-shrink-0">
          {showAvatar && (
            <img
              src={message.sender?.avatar || '/images/placeholder-avatar.png'}
              alt={message.sender?.username || 'User'}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
        </div>
      )}

      {/* Message Content */}
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : 'order-2'}`}>
        {/* Sender Name (for group chats) */}
        {showSenderName && (
          <p className="text-xs text-gray-600 mb-1 px-3">
            {message.sender?.username || 'Unknown User'}
          </p>
        )}

        {/* Message Bubble */}
        <div className="relative group">
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-blue-500 text-white rounded-br-md'
                : 'bg-gray-100 text-gray-900 rounded-bl-md'
            } ${message.status === 'failed' ? 'border border-red-300' : ''}`}
          >
            {renderMessageContent()}
          </div>

          {/* Time and Status */}
          <div className={`flex items-center space-x-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-500">
              {formatTime(message.createdAt)}
            </span>
            
            {/* Delivery Status (only for own messages) */}
            {isOwn && (
              <div className="flex items-center space-x-1">
                {getDeliveryIcon()}
                {message.status === 'failed' && (
                  <button
                    onClick={() => onRetry?.(message)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    title="Thử lại"
                  >
                    <RotateCcw className="w-3 h-3 text-gray-500" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;