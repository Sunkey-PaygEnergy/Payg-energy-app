'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ShieldAlert, AlertTriangle, Send, PhoneCall, RefreshCw, Clock } from 'lucide-react';

interface OverdueDevice {
  leaseId: string;
  deviceId: string;
  customerName: string;
  customerPhone: string;
  daysOverdue: number;
  outstandingBalance: number;
  lastPaymentDate: string;
  riskBucket: '1-7d' | '8-14d' | '15-30d' | '>30d';
}

const mockOverdueList: OverdueDevice[] = [
  {
    leaseId: 'LSE-003',
    deviceId: 'DEV-BBOX-0044',
    customerName: 'Kofi Mensah',
    customerPhone: '+254 701 445 990',
    daysOverdue: 4,
    outstandingBalance: 78.0,
    lastPaymentDate: '2026-09-28',
    riskBucket: '1-7d',
  },
  {
    leaseId: 'LSE-019',
    deviceId: 'DEV-SH100-2018',
    customerName: 'Amina Mwangi',
    customerPhone: '+254 722 109 844',
    daysOverdue: 6,
    outstandingBalance: 110.0,
    lastPaymentDate: '2026-09-26',
    riskBucket: '1-7d',
  },
  {
    leaseId: 'LSE-041',
    deviceId: 'DEV-VIC-9021',
    customerName: 'David Kiptoo',
    customerPhone: '+254 718 902 331',
    daysOverdue: 11,
    outstandingBalance: 240.0,
    lastPaymentDate: '2026-09-21',
    riskBucket: '8-14d',
  },
  {
    leaseId: 'LSE-062',
    deviceId: 'DEV-BLUE-4410',
    customerName: 'Fatima Conteh',
    customerPhone: '+233 244 892 110',
    daysOverdue: 22,
    outstandingBalance: 160.0,
    lastPaymentDate: '2026-09-10',
    riskBucket: '15-30d',
  },
  {
    leaseId: 'LSE-088',
    deviceId: 'DEV-SH100-1102',
    customerName: 'Juma Omondi',
    customerPhone: '+256 772 104 991',
    daysOverdue: 38,
    outstandingBalance: 195.0,
    lastPaymentDate: '2026-08-25',
    riskBucket: '>30d',
  },
];

export const OverdueRiskView: React.FC = () => {
  const [selectedBucket, setSelectedBucket] = useState<string>('all');
  const [remindersSent, setRemindersSent] = useState<Record<string, boolean>>({});

  const filtered = mockOverdueList.filter((item) =>
    selectedBucket === 'all' ? true : item.riskBucket === selectedBucket
  );

  const handleSendReminder = (leaseId: string) => {
    setRemindersSent((prev) => ({ ...prev, [leaseId]: true }));
    setTimeout(() => {
      setRemindersSent((prev) => ({ ...prev, [leaseId]: false }));
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Risk Metrics Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-amber-500/20 bg-slate-900/80">
          <p className="text-xs text-slate-400">Portfolio at Risk (PAR-30)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-amber-400">2.8%</h3>
            <span className="text-xs text-emerald-400 font-semibold">-0.4% MoM</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Well below industry 5.0% threshold</p>
        </Card>

        <Card className="border-rose-500/20 bg-slate-900/80">
          <p className="text-xs text-slate-400">Capital at Overdue Risk</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-rose-400">$3,420</h3>
            <span className="text-xs text-slate-500">USDC</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across 12 locked accounts</p>
        </Card>

        <Card className="border-blue-500/20 bg-slate-900/80">
          <p className="text-xs text-slate-400">Cure / Restructure Rate</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-blue-400">92.4%</h3>
            <span className="text-xs text-emerald-400 font-semibold">+1.2%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Resume top-up within 7 days of lock</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <p className="text-xs text-slate-400">Severe Default (&gt;30d)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-white">2 <span className="text-xs text-slate-500">units</span></h3>
            <span className="text-xs text-rose-400 font-medium">Guarded recovery</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Statutory notice served</p>
        </Card>
      </div>

      {/* Aging Buckets Selector */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { key: 'all', label: 'All Overdue (12)' },
          { key: '1-7d', label: '1 - 7 Days (Early Grace, 6)' },
          { key: '8-14d', label: '8 - 14 Days (Officer Follow-up, 3)' },
          { key: '15-30d', label: '15 - 30 Days (Notice Served, 2)' },
          { key: '>30d', label: '> 30 Days (Recovery Stage, 1)' },
        ].map((bucket) => (
          <button
            key={bucket.key}
            type="button"
            onClick={() => setSelectedBucket(bucket.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedBucket === bucket.key
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {bucket.label}
          </button>
        ))}
      </div>

      {/* Overdue Accounts Table */}
      <Card className="p-0 overflow-hidden border-slate-800 bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-4">Lease & Device</th>
                <th className="py-3 px-4">Customer Contact</th>
                <th className="py-3 px-4">Days Overdue</th>
                <th className="py-3 px-4">Balance at Risk</th>
                <th className="py-3 px-4">Last Payment</th>
                <th className="py-3 px-4 text-right">Intervention Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((item) => (
                <tr key={item.leaseId} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-white">{item.deviceId}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{item.leaseId}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-200 font-medium">{item.customerName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{item.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold ${
                        item.daysOverdue > 30
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : item.daysOverdue > 14
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {item.daysOverdue} Days Overdue
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    ${item.outstandingBalance.toFixed(2)} USDC
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">
                    {item.lastPaymentDate}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleSendReminder(item.leaseId)}
                        disabled={remindersSent[item.leaseId]}
                        className="text-[11px] px-2.5 py-1 h-7"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        {remindersSent[item.leaseId] ? 'SMS Sent!' : 'Send SMS'}
                      </Button>
                      <a
                        href={`tel:${item.customerPhone}`}
                        className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                        title="Call Customer"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
