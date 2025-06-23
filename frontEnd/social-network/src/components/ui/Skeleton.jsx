import React from 'react';

const variants = {
  circle: 'rounded-full',
  rounded: 'rounded-lg',
  rectangular: 'rounded-none'
};

const Skeleton = ({
  variant = 'rounded',
  width,
  height,
  className = '',
  animate = true
}) => {
  const style = {
    width: width || '100%',
    height: height || '1rem'
  };

  return (
    <div
      className={`
        bg-gray-200 
        ${variants[variant]}
        ${animate ? 'animate-pulse' : ''}
        ${className}
      `}
      style={style}
    />
  );
};

export const SkeletonGroup = ({ children, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {children}
    </div>
  );
};

// Predefined skeleton components
export const AvatarSkeleton = ({ size = 'md' }) => {
  const sizes = {
    sm: '32px',
    md: '40px',
    lg: '48px',
    xl: '64px'
  };

  return (
    <Skeleton
      variant="circle"
      width={sizes[size]}
      height={sizes[size]}
    />
  );
};

export const TextSkeleton = ({ lines = 1, width }) => {
  return (
    <SkeletonGroup>
      {Array(lines).fill(0).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 && width ? width : undefined}
          height="0.8rem"
        />
      ))}
    </SkeletonGroup>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="p-4 bg-white rounded-xl shadow-lg space-y-4">
      <div className="flex items-center space-x-3">
        <AvatarSkeleton />
        <div className="flex-1 space-y-2">
          <Skeleton width="150px" />
          <Skeleton width="100px" />
        </div>
      </div>
      <TextSkeleton lines={3} />
    </div>
  );
};

export default Skeleton;