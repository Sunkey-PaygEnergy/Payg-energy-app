import React from 'react';

export interface BadgeProps {
  status: 'Active' | 'unlocked' | 'PendingDeposit' | 'Suspended' | 'Repossessed' | 'Owned' | 'locked' | 'warning';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '', dot = true }) => {
  const getStyles = () => {
    switch (status) {
      case 'Active':
      case 'unlocked':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dotBg: 'bg-emerald-400 animate-pulse',
          label: 'Active & Unlocked',
        };
      case 'Owned':
        return {
          bg: 'bg-solar-500/15 border-solar-500/40 text-solar-300 font-semibold',
          dotBg: 'bg-solar-400',
          label: '100% Owned',
        };
      case 'PendingDeposit':
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          dotBg: 'bg-blue-400',
          label: 'Pending Deposit',
        };
      case 'locked':
      case 'Suspended':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dotBg: 'bg-amber-400',
          label: status === 'locked' ? 'Locked (Top-up)' : 'Suspended',
        };
      case 'Repossessed':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          dotBg: 'bg-rose-400',
          label: 'Repossessed',
        };
      case 'warning':
      default:
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          dotBg: 'bg-amber-400',
          label: status,
        };
    }
  };

  const current = getStyles();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${current.bg} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${current.dotBg}`} />}
      {current.label}
    </span>
  );
};
