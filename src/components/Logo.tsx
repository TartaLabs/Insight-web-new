import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} text-tech-blue`}
    >
      {/* Outer Ring Segments */}
      <path
        d="M50 5 A45 45 0 0 1 95 50"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M95 50 A45 45 0 0 1 50 95"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
        strokeDasharray="5 5"
      />
      <path
        d="M50 95 A45 45 0 0 1 5 50"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M5 50 A45 45 0 0 1 50 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
        strokeDasharray="5 5"
      />

      {/* Inner Iris */}
      <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="4" opacity="0.9" />

      {/* Pupil / Data Core */}
      <circle cx="50" cy="50" r="12" fill="currentColor" />

      {/* Decorative Data Points */}
      <circle cx="85" cy="50" r="3" fill="white" />
      <circle cx="15" cy="50" r="3" fill="white" />
    </svg>
  );
};
