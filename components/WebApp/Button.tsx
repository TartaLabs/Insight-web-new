import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'sm';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base = 'font-mono uppercase tracking-widest font-bold rounded transition-all duration-200 focus:outline-none flex items-center justify-center gap-2';
const sizes: Record<Size, string> = {
  md: 'py-3 px-4 text-xs',
  sm: 'py-2 px-3 text-[11px]',
};

const variants: Record<Variant, string> = {
  primary: 'bg-tech-blue text-black hover:shadow-[0_0_15px_rgba(0,243,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed',
  secondary: 'bg-white/5 text-white border border-white/15 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed',
  ghost: 'border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed',
  danger: 'bg-red-500 text-white hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}) => (
  <button
    className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    {...rest}
  >
    {children}
  </button>
);
