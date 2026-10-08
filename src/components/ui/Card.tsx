import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: 'none' | 'clean' | 'solar';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  glow = 'none',
  hoverable = false,
  className = '',
  ...props
}) => {
  const glowStyles = {
    none: '',
    clean: 'glow-clean',
    solar: 'glow-solar',
  };

  const hoverStyles = hoverable
    ? 'hover:border-slate-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200'
    : '';

  return (
    <div
      className={`glass-card rounded-2xl p-5 border border-slate-800/80 ${glowStyles[glow]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
