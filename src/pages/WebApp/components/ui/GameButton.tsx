import React from 'react';

export interface GameButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'accent' | 'ghost' | 'default';
}

/**
 * GameFi 风格的按钮组件
 * 带有切角效果和发光悬停效果
 */
export const GameButton: React.FC<GameButtonProps> = ({
  onClick,
  disabled,
  loading = false,
  children,
  className = '',
  variant = 'primary',
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        relative px-6 py-2 font-mono font-bold text-xs tracking-wider uppercase transition-all duration-200
        ${isDisabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105 active:scale-95'}
        ${
          variant === 'primary'
            ? 'bg-tech-blue text-black hover:shadow-[0_0_15px_rgba(0,243,255,0.6)]'
            : variant === 'accent'
              ? 'bg-neon-purple text-white hover:shadow-[0_0_15px_rgba(188,19,254,0.6)]'
              : variant === 'ghost'
                ? 'bg-transparent border border-white/20 text-gray-400 hover:text-white hover:bg-white/10'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
        }
        ${className}
      `}
      style={{
        clipPath:
          'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
      }}
    >
      <span className={`flex items-center justify-center gap-2 ${loading ? 'opacity-0' : ''}`}>
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
    </button>
  );
};
