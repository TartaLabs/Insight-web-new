import React from 'react';

export interface GameButtonProps {
  onClick?: () => void;
  disabled?: boolean;
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
  children,
  className = '',
  variant = 'primary',
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      relative px-6 py-2 font-mono font-bold text-xs tracking-wider uppercase transition-all duration-200
      ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105 active:scale-95'}
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
    {children}
  </button>
);

