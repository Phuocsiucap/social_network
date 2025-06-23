import React, { useState } from 'react';

const sizes = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const statuses = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  busy: 'bg-red-500',
  away: 'bg-yellow-500'
};

const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  status,
  className = '',
  fallback = '/default_avatar.png'
}) => {
  const [error, setError] = useState(false);
  const sizeClasses = sizes[size] || sizes.md;
  const statusColor = statuses[status];
  
  return (
    <div className={`relative inline-block ${sizeClasses} ${className}`}>
      <img
        src={error ? fallback : src}
        alt={alt}
        onError={() => setError(true)}
        className="w-full h-full rounded-full object-cover ring-2 ring-white shadow-sm"
      />
      {status && (
        <span 
          className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${statusColor}`}
        />
      )}
    </div>
  );
};

export default Avatar;