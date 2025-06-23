// components/features/messages/MessageInput.jsx
import { Send, Paperclip, Smile, X, Image as ImageIcon, File, Camera } from 'lucide-react';
import { useRef, useState } from 'react';

const MessageInput = ({ 
  value, 
  onChange, 
  onSubmit, 
  onKeyPress,
  onSendFile,
  disabled = false,
  placeholder = "Nhập tin nhắn...",
  onEmoji
}) => {
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Send files first if any
    if (selectedFiles.length > 0) {
      for (const file of selectedFiles) {
        await onSendFile?.(file);
      }
      setSelectedFiles([]);
    }
    
    // Then send text message if any
    if (value.trim()) {
      onSubmit(e);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFilePreview = (file) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      {/* File Preview Area */}
      {selectedFiles.length > 0 && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                {file.type.startsWith('image/') ? (
                  <div className="relative">
                    <img
                      src={getFilePreview(file)}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-white rounded-lg border">
                    <File className="w-4 h-4 text-gray-500" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate max-w-20">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
        {/* Action Buttons */}
        <div className="flex space-x-1">
          {/* File Upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Đính kèm tệp"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Image Upload */}
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
            title="Chọn ảnh"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Message Input */}
        <div 
          className={`flex-1 relative ${dragOver ? 'bg-blue-50 border-blue-300' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <textarea
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPress}
            placeholder={placeholder}
            className="w-full px-4 py-2 pr-10 bg-gray-100 border-0 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none max-h-32 transition-all placeholder-gray-500"
            rows={1}
            disabled={disabled}
            style={{ minHeight: '40px' }}
          />
          
          {/* Emoji Button */}
          {onEmoji && (
            <button
              type="button"
              onClick={onEmoji}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-yellow-500 rounded-full transition-colors"
              title="Biểu tượng cảm xúc"
            >
              <Smile className="w-4 h-4" />
            </button>
          )}

          {/* Drag overlay */}
          {dragOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90 rounded-3xl border-2 border-dashed border-blue-300">
              <p className="text-blue-600 text-sm font-medium">Thả file vào đây</p>
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!value.trim() && selectedFiles.length === 0) || disabled}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          title="Gửi tin nhắn"
        >
          {disabled ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        onChange={handleImageSelect}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default MessageInput;