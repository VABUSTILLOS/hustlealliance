'use client';

import Link from 'next/link';
import clsx from 'clsx';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function NeonButton({
  children,
  onClick,
  href,
  variant = 'primary',
  className,
  type = 'button',
  disabled = false,
}: NeonButtonProps) {
  const base =
    'relative inline-flex items-center justify-center px-6 py-3 rounded-lg font-heading font-bold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const primary =
    'bg-accent hover:bg-accent-glow hover:scale-105';

  const secondary =
    'bg-transparent border border-accent text-accent hover:text-foreground hover:bg-accent/10';

  const breathing =
    'before:absolute before:inset-0 before:rounded-lg before:transition-all before:duration-500';

  const styles = clsx(
    base,
    variant === 'primary' ? primary : secondary,
    breathing,
    className
  );

  const styleAttr =
    variant === 'primary'
      ? { animation: 'cta-pulse 2s infinite' }
      : { animation: 'pulse-glow 2s infinite', boxShadow: '0 0 15px rgba(255, 59, 48, 0.4)' };

  if (href) {
    return (
      <Link href={href} className={styles} style={styleAttr}>
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={styles}
      style={styleAttr}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
