'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { DollarSign, TrendingUp, Sun, ShieldCheck, Sparkles, PieChart, Coins } from 'lucide-react';

export interface LiquidityPool {
  id: string;
  name: string;
  targetAmount: number;
  fundedAmount: number;
  fixedApyPercent: number;
  tenorMonths: number;
  seniority: 'Senior Secured' | 'Mezzanine' | 'First-Loss ESG';
  devicesFunded: number;
  userDeposited: number;
  accruedYield: number;
  status: 'Open' | 'Active' | 'Matured';
}

const mockPools: LiquidityPool[] = [
  {
    id: 'pool_kenya_alpha',
    name: 'East Africa Solar Alpha Tranche',
    targetAmount: 200000,
    fundedAmount: 165000,
    fixedApyPercent: 11.5,
    tenorMonths: 18,
    seniority: 'Senior Secured',
    devicesFunded: 660,
    userDeposited: 25000,
    accruedYield: 2420.50,
    status: 'Active',
  },
  {
    id: 'pool_west_africa_pico',
    name: 'Sahel Rural Electrification Syndicate',
    targetAmount: 150000,
    fundedAmount: 92000,
    fixedApyPercent: 12.8,
    tenorMonths: 24,
    seniority: 'Senior Secured',
    devicesFunded: 480,
    userDeposited: 15000,
    accruedYield: 1180.20,
    status: 'Open',
  },
  {
    id: 'pool_agri_irrigation',
    name: 'Solar Irrigation & Productive Use Facility',
    targetAmount: 300000,
    fundedAmount: 300000,
    fixedApyPercent: 10.2,
    tenorMonths: 12,
    seniority: 'Senior Secured',
    devicesFunded: 310,
    userDeposited: 0,
    accruedYield: 0,
    status: 'Active',
  },
];

interface FinancierDashboardProps {
  financierAddress: string;
  onOpenFundModal?: (pool: LiquidityPool) => void;
  onOpenClaimModal?: (pool: LiquidityPool) => void;
}

export const FinancierDashboard: React.FC<FinancierDashboardProps> = ({
  financierAddress,
  onOpenFundModal,
  onOpenClaimModal,
}) => {
  const [pools, setPools] = useState<LiquidityPool[]>(mockPools);
  const [calcAmount, setCalcAmount] = useState<number>(10000);
  const [calcMonths, setCalcMonths] = useState<number>(18);

  const totalInvested = pools.reduce((acc, p) => acc + p.userDeposited, 0);
  const totalAccruedYield = pools.reduce((acc, p) => acc + p.accruedYield, 0);
  const totalFundedDevices = pools.reduce((acc, p) => acc + (p.userDeposited > 0 ? p.devicesFunded : 0), 0);

  // Return calculation formula: Principal * (APY / 100) * (Months / 12)
  const calculatedReturn = calcAmount * (0.115 * (calcMonths / 12));
  const calculatedCo2Offset = Math.round((calcAmount / 250) * 0.65 * (calcMonths / 12));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-solar-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-solar-400">
              Institutional ESG & Climate Portal
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Clean Energy Debt Pools
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Investor: {financierAddress.slice(0, 10)}...{financierAddress.slice(-8)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl border border-solar-500/20 bg-solar-500/10 text-right">
            <span className="text-[10px] text-solar-300 font-semibold uppercase tracking-wider block">
              Claimable Accrued Yield
            </span>
            <div className="text-lg font-mono font-bold text-white">
              +${totalAccruedYield.toLocaleString()} <span className="text-xs text-solar-400">USDC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-800 bg-slate-900/80">
          <p className="text-xs text-slate-400">Total Capital Deployed</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-white">${totalInvested.toLocaleString()}</h3>
            <span className="text-xs text-slate-500">USDC</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across 2 syndicated pools</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <p className="text-xs text-slate-400">Weighted Average Net APY</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-emerald-400">11.9%</h3>
            <span className="text-xs text-emerald-400 font-semibold">Fixed Rate</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Collateralized by hardware assets</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <p className="text-xs text-slate-400">Clean Energy Systems Funded</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-solar-400">{totalFundedDevices}</h3>
            <span className="text-xs text-slate-500">units</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Off-grid rural households electrified</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <p className="text-xs text-slate-400">On-Chain Seniority</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-white">Senior</h3>
            <span className="text-xs text-blue-400 font-medium">Secured Tranche</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">1st priority on customer cashflows</p>
        </Card>
      </div>

      {/* Pools Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Active Solar Debt Facilities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pools.map((pool) => {
            const fundedPercent = Math.min(100, Math.round((pool.fundedAmount / pool.targetAmount) * 100));

            return (
              <Card
                key={pool.id}
                className="border-slate-800 bg-slate-900/70 p-5 flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{pool.name}</h4>
                      <span className="font-mono text-[10px] text-slate-500">{pool.id}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {pool.fixedApyPercent}% APY
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Funded Progress:</span>
                      <span className="font-mono text-white font-medium">
                        ${pool.fundedAmount.toLocaleString()} / ${pool.targetAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-solar-500 to-emerald-400"
                        style={{ width: `${fundedPercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-slate-400 pt-1">
                      <span>Tenor:</span>
                      <span className="text-white font-medium">{pool.tenorMonths} Months</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Seniority:</span>
                      <span className="text-blue-400 font-medium">{pool.seniority}</span>
                    </div>

                    {pool.userDeposited > 0 && (
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] space-y-1">
                        <div className="flex justify-between text-slate-400">
                          <span>Your Position:</span>
                          <strong className="text-white font-mono">${pool.userDeposited.toLocaleString()} USDC</strong>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Yield Earned:</span>
                          <strong className="text-emerald-400 font-mono">+${pool.accruedYield.toFixed(2)} USDC</strong>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => onOpenFundModal && onOpenFundModal(pool)}
                    className="flex-1 text-xs bg-solar-500 hover:bg-solar-400 text-slate-950 font-bold"
                  >
                    Deposit USDC
                  </Button>
                  {pool.accruedYield > 0 && (
                    <Button
                      variant="secondary"
                      onClick={() => onOpenClaimModal && onOpenClaimModal(pool)}
                      className="text-xs"
                    >
                      Claim Yield
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Yield & Climate Returns Calculator */}
      <Card className="border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-solar-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Institutional Yield & ESG Impact Calculator
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Investment Commitment:</span>
                <span className="font-mono text-solar-400 font-bold">${calcAmount.toLocaleString()} USDC</span>
              </div>
              <input
                type="range"
                min={1000}
                max={100000}
                step={1000}
                value={calcAmount}
                onChange={(e) => setCalcAmount(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Investment Tenor Horizon:</span>
                <span className="font-mono text-solar-400 font-bold">{calcMonths} Months</span>
              </div>
              <input
                type="range"
                min={6}
                max={36}
                step={6}
                value={calcMonths}
                onChange={(e) => setCalcMonths(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Total Projected Yield</span>
              <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
                +${Math.round(calculatedReturn).toLocaleString()} USDC
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">At 11.5% fixed annualized APY</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Total Payout at Tenor</span>
              <div className="text-xl font-mono font-bold text-white mt-1">
                ${Math.round(calcAmount + calculatedReturn).toLocaleString()} USDC
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Principal + full interest</span>
            </div>

            <div className="col-span-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-solar-400">
                <Sun className="w-4 h-4" />
                Verified Clean Power Impact:
              </span>
              <span className="font-semibold text-white">
                ~{Math.round(calcAmount / 250)} Households Electrified • {calculatedCo2Offset}t CO2 Avoided
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
