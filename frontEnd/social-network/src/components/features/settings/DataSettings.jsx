// 📁 src/components/features/settings/DataSettings.jsx
// ==========================================

import React from 'react';
import { Download, Trash2, ChevronRight } from 'lucide-react';

const DataSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dữ liệu của bạn</h3>
        <div className="space-y-3">
          <button className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-gray-600" />
              <div className="text-left">
                <span className="block text-sm font-medium">Tải xuống dữ liệu</span>
                <span className="block text-xs text-gray-500">Tải về một bản sao dữ liệu của bạn</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-red-600 mb-4">Vùng nguy hiểm</h3>
        <div className="space-y-3">
          <button className="flex items-center justify-between w-full p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
            <div className="flex items-center space-x-3">
              <Trash2 className="w-5 h-5 text-red-600" />
              <div className="text-left">
                <span className="block text-sm font-medium text-red-800">Xóa tài khoản</span>
                <span className="block text-xs text-red-600">Xóa vĩnh viễn tài khoán và tất cả dữ liệu</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSettings;