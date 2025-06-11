// 📁 src/components/features/settings/LanguageSettings.jsx
// ==========================================

import React from 'react';
import { Check } from 'lucide-react';

const LanguageSettings = () => {
  const languages = [
    { code: 'vi', name: 'Tiếng Việt', selected: true },
    { code: 'en', name: 'English', selected: false },
    { code: 'zh', name: '中文', selected: false },
    { code: 'ja', name: '日本語', selected: false }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chọn ngôn ngữ</h3>
        <div className="space-y-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                lang.selected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
              }`}
            >
              <span className="text-sm font-medium">{lang.name}</span>
              {lang.selected && <Check className="w-5 h-5 text-blue-600" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;
