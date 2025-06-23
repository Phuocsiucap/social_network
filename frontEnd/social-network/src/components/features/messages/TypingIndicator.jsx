
// components/features/messages/TypingIndicator.jsx
const TypingIndicator = ({ typingUsers }) => {
  if (!typingUsers || typingUsers.length === 0) return null;

  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-end space-x-3 max-w-xs lg:max-w-md">
        <div className="w-10 h-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-50 blur-sm animate-pulse"></div>
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
              {typingUsers[0].name?.charAt(0).toUpperCase() || '?'}
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-white/90 backdrop-blur-md rounded-3xl rounded-tl-lg shadow-xl border border-white/20">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;