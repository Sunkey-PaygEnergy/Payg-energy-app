'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Zap, Sun, DollarSign, AlertTriangle, ShieldCheck, BatteryCharging } from 'lucide-react';

export interface FleetStats {
  totalDevices: number;
  activeUnlocked: number;
  lockedOverdue: number;
  fullyOwned: number;
  totalCollectedUsdc: number;
  monthlyRevenueUsdc: number;
  energyGeneratedMwh: number;
  co2OffsetTonnes: number;
}

interface FleetStatsCardsProps {
  stats: FleetStats;
}

export const FleetStatsCards: React.FC<FleetStatsCardsProps> = ({ stats }) => {
  const activeRate = stats.totalDevices > 0
    ? Math.round(((stats.activeUnlocked + stats.fullyOwned) / stats.totalDevices) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Active Power Delivery */}
      <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-slate-900/90 to-emerald-950/20">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Active Deployed Fleet</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {stats.activeUnlocked + stats.fullyOwned} <span className="text-xs font-normal text-slate-500">/ {stats.totalDevices}</span>
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
              <span>{activeRate}% Online & Energized</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sun className="w-5 h-5" />
          </div>
        </div>
      </Card>

      {/* Repayments Collected */}
      <Card className="relative overflow-hidden border-solar-500/20 bg-gradient-to-br from-slate-900/90 to-amber-950/20">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Cumulative Repayments</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              ${stats.totalCollectedUsdc.toLocaleString()} <span className="text-xs font-normal text-slate-500">USDC</span>
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-amber-400">
              <DollarSign className="w-3.5 h-3.5" />
              <span>+${stats.monthlyRevenueUsdc.toLocaleString()} this month</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <BatteryCharging className="w-5 h-5" />
          </div>
        </div>
      </Card>

      {/* Credit & Overdue Risk */}
      <Card className="relative overflow-hidden border-rose-500/20 bg-gradient-to-br from-slate-900/90 to-rose-950/20">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Overdue / Locked Risk</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-1">
              {stats.lockedOverdue} <span className="text-xs font-normal text-slate-500">systems</span>
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-rose-300">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Awaiting top-up / grace</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </Card>

      {/* Full Ownership & ESG Impact */}
      <Card className="relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-slate-900/90 to-blue-950/20">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Owned & Clean Impact</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {stats.fullyOwned} <span className="text-xs font-normal text-slate-500">Graduated</span>
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-blue-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{stats.co2OffsetTonnes}t CO2 avoided ({stats.energyGeneratedMwh} MWh)</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </Card>
    </div>
  );
};
