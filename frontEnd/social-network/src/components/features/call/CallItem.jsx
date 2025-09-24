// CallItem Component
import React from 'react';
import { Phone, PhoneCall, PhoneOff, Clock, Info } from 'lucide-react';
import { formatTimeAgo } from './formatTimeAgo';
const getCallTypeInfo = (type) => {
  switch(type) {
    case 'incoming':
      return {
        icon: PhoneCall,
        label: 'Cuộc gọi đến',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        iconColor: 'text-green-600'
      };
    case 'outgoing':
      return {
        icon: Phone,
        label: 'Cuộc gọi đi', 
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        iconColor: 'text-blue-600'
      };
    case 'missed':
      return {
        icon: PhoneOff,
        label: 'Cuộc gọi nhỡ',
        bgColor: 'bg-red-100', 
        textColor: 'text-red-700',
        iconColor: 'text-red-600'
      };
    default:
      return {
        icon: Phone,
        label: 'Cuộc gọi',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        iconColor: 'text-gray-600'
      };
  }
};
const CallItem = ({ call, onCallClick, onInfoClick }) => {
  const typeInfo = getCallTypeInfo(call.type);
  const Icon = typeInfo.icon;

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-5 mb-4 shadow-lg hover:shadow-xl hover:bg-white/80 transition-all duration-300 hover:scale-102 cursor-pointer group">
      <div className="flex items-center">
        {/* Avatar */}
        <div className="relative mr-4">
          <div className={`w-14 h-14 bg-gradient-to-r ${call.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {call.avatar}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-white ${
            call.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
          }`} />
        </div>

        {/* Call Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{call.name}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${typeInfo.bgColor}`}>
              <Icon className={`h-4 w-4 ${typeInfo.iconColor}`} />
              <span className={typeInfo.textColor}>{typeInfo.label}</span>
            </div>
            <span className="font-medium text-gray-800">{call.duration}</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTimeAgo(call.timestamp)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCallClick(call);
            }}
            className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
            title="Gọi lại"
          >
            <Phone className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInfoClick(call);
            }}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
            title="Thông tin"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
    );
};

export default CallItem;