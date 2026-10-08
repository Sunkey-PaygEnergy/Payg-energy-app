'use client';

import React, { useState } from 'react';
import { FleetStatsCards, FleetStats } from './FleetStatsCards';
import { DeviceTable, DeviceTableRowData } from './DeviceTable';
import { Button } from '../ui/Button';
import { PlusCircle, RefreshCw, Layers, ShieldAlert, TrendingUp, Sliders } from 'lucide-react';
import { Lease, Device } from '@/types';

const mockFleetData: DeviceTableRowData[] = [
  {
    id: 'LSE-001',
    deviceId: 'DEV-SH100-8812',
    operator: 'GBV76O4Q4V...SKOL',
    customer: 'GA6M6Q3H62FSLG4YUSW23V6B3H6V32D4W6U6M3',
    customerPhone: '+254 712 345 678',
    planId: 'plan_standard_50w',
    status: 'Active',
    totalPaid: '145.00',
    totalCashPrice: '250.00',
    paidUntil: Math.floor(Date.now() / 1000) + 86400 * 18,
    depositPaid: true,
    modelName: 'Sinoware SunHome-Base 100',
    hardwareType: 'iot_connected',
    batteryVoltageMv: 12640,
  },
  {
    id: 'LSE-002',
    deviceId: 'DEV-VIC-4921',
    operator: 'GBV76O4Q4V...SKOL',
    customer: 'GDM7B22W5G67K2N89UJK4N2M8KL23M90KJ2819',
    customerPhone: '+256 772 984 112',
    planId: 'plan_pro_200w',
    status: 'Active',
    totalPaid: '280.00',
    totalCashPrice: '450.00',
    paidUntil: Math.floor(Date.now() / 1000) + 86400 * 5,
    depositPaid: true,
    modelName: 'Victron SHS200 Smart',
    hardwareType: 'iot_connected',
    batteryVoltageMv: 25400,
  },
  {
    id: 'LSE-003',
    deviceId: 'DEV-BBOX-0044',
    operator: 'GBV76O4Q4V...SKOL',
    customer: 'GCLK4M9283JD8274HDN8374HD83N82HD83HD92',
    customerPhone: '+254 701 445 990',
    planId: 'plan_basic_20w',
    status: 'Suspended',
    totalPaid: '72.00',
    totalCashPrice: '150.00',
    paidUntil: Math.floor(Date.now() / 1000) - 86400 * 4,
    depositPaid: true,
    modelName: 'Bboxx Flexx40 Keypad',
    hardwareType: 'offline_keypad',
  },
  {
    id: 'LSE-004',
    deviceId: 'DEV-BLUE-9931',
    operator: 'GBV76O4Q4V...SKOL',
    customer: 'GBN73KD928HD837HD838JD9283HD837HD83HD8',
    customerPhone: '+233 244 556 778',
    planId: 'plan_premium_150w',
    status: 'Owned',
    totalPaid: '320.00',
    totalCashPrice: '320.00',
    paidUntil: Math.floor(Date.now() / 1000) + 86400 * 365,
    depositPaid: true,
    modelName: 'Bluetti Solar P150',
    hardwareType: 'iot_connected',
    batteryVoltageMv: 13200,
  },
];

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

      {/* Tab Content Placeholder */}
      <div id="operator-tab-content">
        {activeTab === 'fleet' && (
          <DeviceTable
            leases={mockFleetData}
            onGrantCredit={(l) => console.log('Credit', l)}
            onSwapDevice={(l) => console.log('Swap', l)}
            onRepossess={(l) => console.log('Repossess', l)}
          />
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
