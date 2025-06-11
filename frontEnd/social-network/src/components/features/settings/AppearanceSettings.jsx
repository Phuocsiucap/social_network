// 📁 src/components/features/settings/AppearanceSettings.jsx
// ==========================================

import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const AppearanceSettings = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chế độ hiển thị</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setDarkMode(false)}
            className={`p-4 border-2 rounded-lg transition-colors ${
              !darkMode ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <span className="block text-sm font-medium">Sáng</span>
          </button>
          
          <button
            onClick={() => setDarkMode(true)}
            className={`p-4 border-2 rounded-lg transition-colors ${
              darkMode ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Moon className="w-8 h-8 mx-auto mb-2 text-gray-700" />
            <span className="block text-sm font-medium">Tối</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;