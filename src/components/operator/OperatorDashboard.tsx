'use client';

import React, { useState } from 'react';
import { FleetStatsCards, FleetStats } from './FleetStatsCards';
import { Button } from '../ui/Button';
import { PlusCircle, RefreshCw, Layers, ShieldAlert, TrendingUp, Sliders } from 'lucide-react';
import { Lease, Device } from '@/types';

interface OperatorDashboardProps {
  operatorAddress: string;
  initialDevices?: Device[];
  initialLeases?: Lease[];
  onOpenOnboardModal?: () => void;
  onOpenCreateLeaseModal?: () => void;
  onOpenPlanManagerModal?: () => void;
}

export const OperatorDashboard: React.FC<OperatorDashboardProps> = ({
  operatorAddress,
  initialDevices = [],
  initialLeases = [],
  onOpenOnboardModal,
  onOpenCreateLeaseModal,
  onOpenPlanManagerModal,
}) => {
  const [activeTab, setActiveTab] = useState<'fleet' | 'risk' | 'analytics' | 'plans'>('fleet');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock initial fleet summary data for demonstration
  const stats: FleetStats = {
    totalDevices: 148,
    activeUnlocked: 114,
    lockedOverdue: 12,
    fullyOwned: 22,
    totalCollectedUsdc: 48920,
    monthlyRevenueUsdc: 9450,
    energyGeneratedMwh: 142.8,
    co2OffsetTonnes: 98.4,
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-solar-400">
              Solar Operator Console
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Fleet Operations & Leases
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Operator: {operatorAddress.slice(0, 10)}...{operatorAddress.slice(-8)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Sync
          </Button>
          {onOpenPlanManagerModal && (
            <Button
              variant="secondary"
              onClick={onOpenPlanManagerModal}
              className="text-xs"
            >
              <Sliders className="w-3.5 h-3.5 mr-1.5" />
              Plans
            </Button>
          )}
          {onOpenOnboardModal && (
            <Button
              variant="secondary"
              onClick={onOpenOnboardModal}
              className="text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              New Device
            </Button>
          )}
          {onOpenCreateLeaseModal && (
            <Button
              variant="primary"
              onClick={onOpenCreateLeaseModal}
              className="text-xs bg-solar-500 hover:bg-solar-400 text-slate-950 font-bold"
            >
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              Create Lease
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <FleetStatsCards stats={stats} />

      {/* Subtab Navigation */}
      <div className="flex border-b border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('fleet')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'fleet'
              ? 'border-solar-400 text-solar-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          Fleet Devices ({stats.totalDevices})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('risk')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'risk'
              ? 'border-rose-400 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Overdue Risk & Repossession ({stats.lockedOverdue})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'analytics'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Repayment Curves & Cashflow
        </button>
      </div>

      {/* Tab Content Placeholder (Populated as child components are committed) */}
      <div id="operator-tab-content">
        {activeTab === 'fleet' && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-xs text-slate-400">
            Fleet devices table rendered below.
          </div>
        )}
        {activeTab === 'risk' && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-xs text-slate-400">
            Overdue aging analysis and repossession monitor.
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-xs text-slate-400">
            Repayment curves and cashflow forecasting.
          </div>
        )}
      </div>
    </div>
  );
};
