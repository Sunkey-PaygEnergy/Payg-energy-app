'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Download, Search, ExternalLink, ShieldCheck, Filter } from 'lucide-react';

export interface AuditRecord {
  id: string;
  timestamp: string;
  ledgerSeq: number;
  eventType:
    | 'PaymentProcessed'
    | 'DepositMade'
    | 'DeviceUnlocked'
    | 'GraceGranted'
    | 'DeviceSwapped'
    | 'LeaseGraduatedOwned'
    | 'PoolYieldClaimed';
  deviceId: string;
  leaseId: string;
  amount: string;
  currency: string;
  txHash: string;
  sourceAccount: string;
}

const mockAuditTrail: AuditRecord[] = [
  {
    id: 'TX-1092',
    timestamp: '2026-10-08 11:24:12',
    ledgerSeq: 49821034,
    eventType: 'PaymentProcessed',
    deviceId: 'DEV-SH100-8812',
    leaseId: 'LSE-001',
    amount: '5.95',
    currency: 'USDC',
    txHash: '0x8f3c77d291e0a9b34c2e684120bf389a19c54210dfa48572094cbb451092a481',
    sourceAccount: 'GA6M6Q3H62FSLG4YUSW23V6B3H6V32D4W6U6M3',
  },
  {
    id: 'TX-1091',
    timestamp: '2026-10-08 10:15:02',
    ledgerSeq: 49820912,
    eventType: 'GraceGranted',
    deviceId: 'DEV-VIC-4921',
    leaseId: 'LSE-002',
    amount: '0.00',
    currency: 'USDC',
    txHash: '0x43b028f88219ae08442c55b889e1029c91823746a5129374028374928192a001',
    sourceAccount: 'GDM7B22W5G67K2N89UJK4N2M8KL23M90KJ2819',
  },
  {
    id: 'TX-1090',
    timestamp: '2026-10-08 09:44:50',
    ledgerSeq: 49820845,
    eventType: 'DepositMade',
    deviceId: 'DEV-BBOX-0044',
    leaseId: 'LSE-003',
    amount: '15.00',
    currency: 'USDC',
    txHash: '0x129a8f4c02938472910384729103948572910293847291029384729102938472',
    sourceAccount: 'GCLK4M9283JD8274HDN8374HD83N82HD83HD92',
  },
  {
    id: 'TX-1089',
    timestamp: '2026-10-08 08:30:19',
    ledgerSeq: 49820710,
    eventType: 'LeaseGraduatedOwned',
    deviceId: 'DEV-BLUE-9931',
    leaseId: 'LSE-004',
    amount: '320.00',
    currency: 'USDC',
    txHash: '0x9923847192837482910293847192837491029384719283749102938471928374',
    sourceAccount: 'GBN73KD928HD837HD838JD9283HD837HD83HD8',
  },
  {
    id: 'TX-1088',
    timestamp: '2026-10-08 07:12:00',
    ledgerSeq: 49820540,
    eventType: 'PoolYieldClaimed',
    deviceId: 'N/A (Pool)',
    leaseId: 'pool_kenya_alpha',
    amount: '2420.50',
    currency: 'USDC',
    txHash: '0x5519283748192837461928374619283746192837461928374619283746192837',
    sourceAccount: 'GBV76O4Q4VSC5YUSW23V6B3H6V32D4W6U6M3SKOL',
  },
];

export const AuditTrailView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');

  const filtered = mockAuditTrail.filter((item) => {
    const matchesSearch =
      item.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.leaseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sourceAccount.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = eventTypeFilter === 'all' ? true : item.eventType === eventTypeFilter;

    return matchesSearch && matchesType;
  });

  const exportCsv = () => {
    const headers = ['ID', 'Timestamp', 'LedgerSeq', 'EventType', 'DeviceId', 'LeaseId', 'Amount', 'Currency', 'TxHash', 'SourceAccount'];
    const rows = filtered.map((r) => [
      r.id,
      r.timestamp,
      r.ledgerSeq,
      r.eventType,
      r.deviceId,
      r.leaseId,
      r.amount,
      r.currency,
      r.txHash,
      r.sourceAccount,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sunkey_stellar_audit_trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getEventBadgeClass = (type: AuditRecord['eventType']) => {
    switch (type) {
      case 'PaymentProcessed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'DepositMade':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'LeaseGraduatedOwned':
        return 'bg-solar-500/10 text-solar-400 border-solar-500/30';
      case 'GraceGranted':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'PoolYieldClaimed':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-solar-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-solar-400">
              Immutable Trust Anchor
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Stellar Ledger Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Every micropayment, grace extension, and ownership graduation cryptographically verified on Soroban.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={exportCsv}
          className="text-xs"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Export Audit CSV
        </Button>
      </div>

      {/* Filter bar */}
      <Card className="p-0 overflow-hidden border-slate-800 bg-slate-900/60">
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Input
              placeholder="Search by Device, Lease, Tx Hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
          </div>

          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-solar-500"
          >
            <option value="all">All Soroban Events</option>
            <option value="PaymentProcessed">PaymentProcessed</option>
            <option value="DepositMade">DepositMade</option>
            <option value="GraceGranted">GraceGranted</option>
            <option value="LeaseGraduatedOwned">LeaseGraduatedOwned</option>
            <option value="PoolYieldClaimed">PoolYieldClaimed</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Ledger / Timestamp</th>
                <th className="py-3 px-4">Device & Lease</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Source Account</th>
                <th className="py-3 px-4 text-right">Stellar Explorer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-sans">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getEventBadgeClass(
                        item.eventType
                      )}`}
                    >
                      {item.eventType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-white font-bold">#{item.ledgerSeq}</div>
                    <div className="text-[11px] text-slate-500 font-sans">{item.timestamp}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-300">{item.deviceId}</div>
                    <div className="text-[11px] text-solar-400">{item.leaseId}</div>
                  </td>
                  <td className="py-3.5 px-4 text-white font-bold">
                    {item.amount !== '0.00' ? (
                      <span>+${item.amount} {item.currency}</span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {item.sourceAccount.slice(0, 6)}...{item.sourceAccount.slice(-4)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${item.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-solar-400 hover:underline text-[11px]"
                    >
                      <span>{item.txHash.slice(0, 8)}...</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
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
