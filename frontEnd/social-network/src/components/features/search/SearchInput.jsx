import React, { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="relative mb-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-6 py-4 text-lg border-none rounded-3xl bg-white/95 backdrop-blur-lg shadow-lg outline-none transition-all duration-300 focus:shadow-xl focus:bg-white focus:-translate-y-1 focus:ring-4 focus:ring-blue-200/50"
        />
      </div>
    </div>
  );
};

export default SearchInput;