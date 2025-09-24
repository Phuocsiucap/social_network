// CallDetailModal Component
const CallDetailModal = ({ call, isOpen, onClose, onCall, onMessage }) => {
  if (!isOpen || !call) return null;

  const typeInfo = getCallTypeInfo(call.type);
  const Icon = typeInfo.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 bg-gradient-to-r ${call.color} rounded-3xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-xl`}>
            {call.avatar}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{call.name}</h2>
          <p className="text-gray-600 font-medium">{call.phone}</p>
          
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${typeInfo.bgColor} mt-4`}>
            <Icon className={`h-5 w-5 ${typeInfo.iconColor}`} />
            <span className={`${typeInfo.textColor} font-medium`}>{typeInfo.label}</span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Thời lượng:</span>
            <span className="font-semibold text-gray-900">{call.duration}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Thời gian:</span>
            <span className="font-semibold text-gray-900">{formatTimeAgo(call.timestamp)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Trạng thái:</span>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${call.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="font-semibold text-gray-900">
                {call.status === 'online' ? 'Đang online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              onCall(call);
              onClose();
            }}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Phone className="h-5 w-5" />
            Gọi lại
          </button>
          <button
            onClick={() => {
              onMessage(call);
              onClose();
            }}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            Nhắn tin
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 text-gray-600 font-medium hover:text-gray-800 transition-colors duration-200"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default CallDetailModal;