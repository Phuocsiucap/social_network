// CallList Component
import React from 'react';
import { Phone } from 'lucide-react';
import CallItem from './CallItem';
const CallList = ({ calls, onCallClick, onInfoClick, searchQuery }) => {
  if (calls.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Phone className="h-10 w-10 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có cuộc gọi nào</h3>
        <p className="text-gray-500">
          {searchQuery ? 'Không tìm thấy cuộc gọi phù hợp' : 'Lịch sử cuộc gọi sẽ hiển thị ở đây'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {calls.map((call) => (
        <CallItem
          key={call.id}
          call={call}
          onCallClick={onCallClick}
          onInfoClick={onInfoClick}
        />
      ))}
    </div>
  );
};

export default CallList;