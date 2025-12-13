import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'sm';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const base =
  'font-mono uppercase tracking-widest font-bold rounded transition-all duration-200 focus:outline-none flex items-center justify-center gap-2';
const sizes: Record<Size, string> = {
  md: 'py-3 px-4 text-xs',
  sm: 'py-2 px-3 text-[11px]',
};

const variants: Record<Variant, string> = {
  primary:
    'bg-tech-blue text-black hover:shadow-[0_0_15px_rgba(0,243,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'bg-white/5 text-white border border-white/15 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed',
  ghost:
    'border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed',
  danger: 'bg-red-500 text-white hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed',
};

const Spinner: React.FC<{ size: Size }> = ({ size }) => (
  <svg
    className={`animate-spin ${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  ...rest
}) => (
  <button
    className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    disabled={disabled || loading}
    {...rest}
  >
    {loading && <Spinner size={size} />}
    {children}
  </button>
);
