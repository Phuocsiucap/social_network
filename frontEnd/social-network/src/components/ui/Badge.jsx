import React from 'react';

const variants = {
  primary: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-gray-100 text-gray-800'
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-sm'
};

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  dot = false
}) => {
  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}>
      {dot && (
        <span className={`
          w-1.5 h-1.5 mr-1.5 rounded-full
          ${variant === 'primary' ? 'bg-blue-600' : ''}
          ${variant === 'success' ? 'bg-green-600' : ''}
          ${variant === 'warning' ? 'bg-yellow-600' : ''}
          ${variant === 'danger' ? 'bg-red-600' : ''}
          ${variant === 'info' ? 'bg-gray-600' : ''}
        `} />
      )}
      {children}
    </span>
  );
};

export default Badge;