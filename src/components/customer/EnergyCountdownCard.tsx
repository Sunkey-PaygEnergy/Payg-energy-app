import React from 'react';
import { Zap, Lock, Unlock, Award } from 'lucide-react';
import { AccessStatus } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface EnergyCountdownCardProps {
  access: AccessStatus;
  onTopUpClick: () => void;
}

export const EnergyCountdownCard: React.FC<EnergyCountdownCardProps> = ({
  access,
  onTopUpClick,
}) => {
  const { isActive, isOwned, isSuspended, daysRemaining, paidUntil } = access;

  // Format date
  const expiryDate = new Date(paidUntil * 1000).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getStatusDisplay = () => {
    if (isOwned) {
      return {
        badge: 'Owned' as const,
        glow: 'solar' as const,
        icon: Award,
        iconColor: 'text-solar-400',
        ringColor: 'border-solar-500/50',
        title: 'Owned Forever',
        desc: 'Device fully paid off. Lifetime clean power access.',
      };
    }
    if (isSuspended) {
      return {
        badge: 'Suspended' as const,
        glow: 'none' as const,
        icon: Lock,
        iconColor: 'text-amber-400',
        ringColor: 'border-amber-500/40',
        title: 'Service Paused',
        desc: 'Lease is currently paused by operator without late penalty.',
      };
    }
    if (!isActive || daysRemaining <= 0) {
      return {
        badge: 'locked' as const,
        glow: 'none' as const,
        icon: Lock,
        iconColor: 'text-rose-400',
        ringColor: 'border-rose-500/50',
        title: '0.0 Days',
        desc: 'Access expired. Top-up now to instantly restore power.',
      };
    }
    if (daysRemaining <= 2) {
      return {
        badge: 'warning' as const,
        glow: 'solar' as const,
        icon: Unlock,
        iconColor: 'text-amber-400',
        ringColor: 'border-amber-500/50',
        title: `${daysRemaining} Days`,
        desc: `Expires soon (${expiryDate})`,
      };
    }

    return {
      badge: 'Active' as const,
      glow: 'clean' as const,
      icon: Unlock,
      iconColor: 'text-clean-400',
      ringColor: 'border-clean-500/50',
      title: `${daysRemaining} Days`,
      desc: `Active until ${expiryDate}`,
    };
  };

  const status = getStatusDisplay();
  const StatusIcon = status.icon;

  return (
    <Card glow={status.glow} className="relative overflow-hidden text-center p-6 border-slate-700/80">
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-clean-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Badge Top Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Energy Access Status
        </span>
        <Badge status={status.badge} />
      </div>

      {/* Radial Counter Ring */}
      <div className="my-6 flex flex-col items-center justify-center">
        <div
          className={`h-36 w-36 rounded-full border-4 ${status.ringColor} flex flex-col items-center justify-center bg-slate-900/80 shadow-2xl relative animate-pulse-glow`}
        >
          <StatusIcon className={`h-8 w-8 mb-1 ${status.iconColor}`} />
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {status.title}
          </span>
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            {isOwned ? 'Permanent' : 'Remaining'}
          </span>
        </div>
      </div>

      {/* Description & Expiry Date */}
      <p className="text-xs text-slate-300 mb-5 font-medium">{status.desc}</p>

      {/* Action CTA */}
      {!isOwned && (
        <Button
          variant={daysRemaining <= 2 ? 'solar' : 'primary'}
          size="lg"
          onClick={onTopUpClick}
          className="w-full shadow-xl"
        >
          <Zap className="h-4 w-4 mr-1.5 fill-current" />
          Top-Up Energy Days
        </Button>
      )}
    </Card>
  );
};
