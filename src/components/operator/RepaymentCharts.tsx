'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, BarChart3, PieChart, DollarSign, Calendar, ArrowUpRight } from 'lucide-react';

interface MonthlyCashflow {
  month: string;
  actual: number;
  projected: number;
  collectionsRate: number; // percentage
}

const mockCashflows: MonthlyCashflow[] = [
  { month: 'Apr', actual: 6800, projected: 6500, collectionsRate: 104 },
  { month: 'May', actual: 7400, projected: 7200, collectionsRate: 102 },
  { month: 'Jun', actual: 8100, projected: 8000, collectionsRate: 101 },
  { month: 'Jul', actual: 8650, projected: 8900, collectionsRate: 97 },
  { month: 'Aug', actual: 9100, projected: 9300, collectionsRate: 98 },
  { month: 'Sep', actual: 9450, projected: 9500, collectionsRate: 99 },
];

export const RepaymentCharts: React.FC = () => {
  const [selectedCohort, setSelectedCohort] = useState<'2025-Q4' | '2026-Q1' | '2026-Q2'>('2026-Q1');

  const maxVal = Math.max(...mockCashflows.map((c) => Math.max(c.actual, c.projected)));

  return (
    <div className="space-y-6">
      {/* Unit Economics Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-800 bg-slate-900/80">
          <p className="text-xs text-slate-400">Average Daily ARPU</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-white">$0.82</h3>
            <span className="text-xs text-emerald-400 font-semibold">+4.2%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Per active deployed solar unit</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <p className="text-xs text-slate-400">Average Payoff Velocity</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-solar-400">248 Days</h3>
            <span className="text-xs text-slate-400 font-mono">~8.2 mo</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">From initial deposit to 100% owned</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <p className="text-xs text-slate-400">Early Full Buyouts</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-emerald-400">14.2%</h3>
            <span className="text-xs text-emerald-400 font-semibold">21 customers</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Paid remaining balance lump-sum</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <p className="text-xs text-slate-400">Cumulative Default Rate</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-white">0.8%</h3>
            <span className="text-xs text-emerald-400 font-medium">Industry low</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Net loss after equipment recovery</p>
        </Card>
      </div>

      {/* Monthly Collections vs Projected Chart */}
      <Card className="border-slate-800 bg-slate-900/70 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-solar-400" />
              Monthly Repayment Cashflow Collections (USDC)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Actual on-chain micropayment volume vs projected baseline.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-solar-400" />
              <span className="text-slate-300">Actual Collections</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-700" />
              <span className="text-slate-400">Projected Target</span>
            </div>
          </div>
        </div>

        {/* SVG/CSS Bar Chart */}
        <div className="h-64 flex items-end gap-6 pt-6 pb-2 border-b border-slate-800 px-4">
          {mockCashflows.map((item) => {
            const actualHeight = Math.round((item.actual / maxVal) * 100);
            const projHeight = Math.round((item.projected / maxVal) * 100);

            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono bg-slate-800 text-white px-2 py-1 rounded shadow-lg border border-slate-700 pointer-events-none mb-1 text-center">
                  ${item.actual.toLocaleString()} USDC ({item.collectionsRate}%)
                </div>

                {/* Bars side by side */}
                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  {/* Projected */}
                  <div
                    className="w-1/2 max-w-[24px] bg-slate-800 rounded-t transition-all group-hover:bg-slate-700"
                    style={{ height: `${projHeight}%` }}
                    title={`Projected: $${item.projected}`}
                  />
                  {/* Actual */}
                  <div
                    className="w-1/2 max-w-[24px] bg-gradient-to-t from-amber-600 to-solar-400 rounded-t transition-all group-hover:brightness-110 shadow-sm shadow-solar-500/20"
                    style={{ height: `${actualHeight}%` }}
                    title={`Actual: $${item.actual}`}
                  />
                </div>

                {/* Month Label */}
                <span className="text-xs font-semibold text-slate-400 mt-2">{item.month}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Cohort Repayment Curves */}
      <Card className="border-slate-800 bg-slate-900/70 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Cohort Repayment Amortization Curve
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Percentage of total asset capital repaid across month milestones (Months 1 to 10).
            </p>
          </div>

          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
            {(['2025-Q4', '2026-Q1', '2026-Q2'] as const).map((cohort) => (
              <button
                key={cohort}
                type="button"
                onClick={() => setSelectedCohort(cohort)}
                className={`px-3 py-1 font-medium rounded-lg transition-all ${
                  selectedCohort === cohort
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cohort {cohort}
              </button>
            ))}
          </div>
        </div>

        {/* Milestones Curve visual */}
        <div className="space-y-3 pt-2">
          {[
            { milestone: 'Month 1 (Deposit + Days 1-30)', percent: 22, status: 'On Target' },
            { milestone: 'Month 2 (Days 31-60)', percent: 34, status: 'On Target' },
            { milestone: 'Month 4 (Days 91-120)', percent: 56, status: 'Exceeding' },
            { milestone: 'Month 6 (Days 151-180)', percent: 74, status: 'On Target' },
            { milestone: 'Month 8 (Days 211-240)', percent: 91, status: 'Accelerating' },
            { milestone: 'Month 10 (Full Payoff Graduation)', percent: 100, status: 'Graduated' },
          ].map((row, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">{row.milestone}</span>
                <span className="font-mono text-solar-400 font-bold">{row.percent}% Repaid</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-solar-400 to-amber-500 transition-all duration-500"
                  style={{ width: `${row.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
