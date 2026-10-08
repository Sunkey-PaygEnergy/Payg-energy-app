'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Lease } from '@/types';
import {
  Search,
  Filter,
  Wifi,
  KeyRound,
  MoreVertical,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Battery,
} from 'lucide-react';

export interface DeviceTableRowData extends Lease {
  modelName: string;
  hardwareType: 'iot_connected' | 'offline_keypad';
  batteryVoltageMv?: number;
  totalCashPrice: string;
}

interface DeviceTableProps {
  leases: DeviceTableRowData[];
  onSelectLease?: (lease: DeviceTableRowData) => void;
  onGrantCredit?: (lease: DeviceTableRowData) => void;
  onSwapDevice?: (lease: DeviceTableRowData) => void;
  onRepossess?: (lease: DeviceTableRowData) => void;
}

export const DeviceTable: React.FC<DeviceTableProps> = ({
  leases,
  onSelectLease,
  onGrantCredit,
  onSwapDevice,
  onRepossess,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [hardwareFilter, setHardwareFilter] = useState<string>('all');

  const filteredLeases = useMemo(() => {
    return leases.filter((lease) => {
      const matchesSearch =
        lease.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lease.customerPhone && lease.customerPhone.includes(searchTerm));

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
          ? lease.status === 'Active'
          : statusFilter === 'locked'
          ? lease.status === 'Suspended' || lease.paidUntil < Date.now() / 1000
          : statusFilter === 'owned'
          ? lease.status === 'Owned'
          : statusFilter === 'pending'
          ? lease.status === 'PendingDeposit'
          : true;

      const matchesHardware =
        hardwareFilter === 'all' ? true : lease.hardwareType === hardwareFilter;

      return matchesSearch && matchesStatus && matchesHardware;
    });
  }, [leases, searchTerm, statusFilter, hardwareFilter]);

  const calculateProgress = (totalPaid: string, totalCashPrice: string) => {
    const paid = parseFloat(totalPaid) || 0;
    const total = parseFloat(totalCashPrice) || 1;
    return Math.min(100, Math.round((paid / total) * 100));
  };

  return (
    <Card className="p-0 overflow-hidden border-slate-800 bg-slate-900/60">
      {/* Controls Bar */}
      <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Input
            placeholder="Search by Device ID, Lease ID, or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status filter buttons */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
            {['all', 'active', 'locked', 'owned', 'pending'].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                  statusFilter === filter
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Hardware filter */}
          <select
            value={hardwareFilter}
            onChange={(e) => setHardwareFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-solar-500"
          >
            <option value="all">All Hardware</option>
            <option value="iot_connected">IoT (MQTT/4G)</option>
            <option value="offline_keypad">Offline Keypad (9-Digit)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
              <th className="py-3 px-4">Device & Model</th>
              <th className="py-3 px-4">Customer Account</th>
              <th className="py-3 px-4">Access Status</th>
              <th className="py-3 px-4">Paid Until</th>
              <th className="py-3 px-4">Capital Repayment</th>
              <th className="py-3 px-4">Telemetry</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredLeases.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No devices matching current search or filters.
                </td>
              </tr>
            ) : (
              filteredLeases.map((lease) => {
                const nowSec = Math.floor(Date.now() / 1000);
                const isOverdue = lease.paidUntil < nowSec && lease.status !== 'Owned';
                const daysRemaining = Math.max(0, Math.ceil((lease.paidUntil - nowSec) / 86400));
                const progress = calculateProgress(lease.totalPaid, lease.totalCashPrice);

                return (
                  <tr
                    key={lease.id}
                    className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                    onClick={() => onSelectLease && onSelectLease(lease)}
                  >
                    {/* Device & Model */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300">
                          {lease.hardwareType === 'iot_connected' ? (
                            <Wifi className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <KeyRound className="w-4 h-4 text-solar-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-mono font-bold text-white group-hover:text-solar-400 transition-colors">
                            {lease.deviceId}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {lease.modelName}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <div>
                        {lease.customer.slice(0, 6)}...{lease.customer.slice(-4)}
                      </div>
                      {lease.customerPhone && (
                        <div className="text-[11px] text-slate-500">{lease.customerPhone}</div>
                      )}
                    </td>

                    {/* Access Status */}
                    <td className="py-3.5 px-4">
                      {lease.status === 'Owned' ? (
                        <Badge status="Owned" />
                      ) : isOverdue ? (
                        <Badge status="locked" />
                      ) : (
                        <Badge status="Active" />
                      )}
                    </td>

                    {/* Paid Until */}
                    <td className="py-3.5 px-4">
                      {lease.status === 'Owned' ? (
                        <span className="font-semibold text-solar-400">Lifetime Unlocked</span>
                      ) : (
                        <div>
                          <div className={`font-semibold ${isOverdue ? 'text-rose-400' : 'text-slate-200'}`}>
                            {new Date(lease.paidUntil * 1000).toLocaleDateString()}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {isOverdue ? 'Expired / Locked' : `${daysRemaining} days left`}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Capital Repayment */}
                    <td className="py-3.5 px-4 min-w-[150px]">
                      <div className="flex justify-between text-[11px] mb-1 font-mono">
                        <span className="text-white">${lease.totalPaid}</span>
                        <span className="text-slate-400">${lease.totalCashPrice} USDC</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            progress >= 100
                              ? 'bg-solar-400'
                              : 'bg-gradient-to-r from-emerald-500 to-solar-400'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </td>

                    {/* Telemetry */}
                    <td className="py-3.5 px-4">
                      {lease.batteryVoltageMv ? (
                        <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                          <Battery className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{(lease.batteryVoltageMv / 1000).toFixed(1)}V</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-[11px]">N/A (Keypad)</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {onGrantCredit && (
                          <Button
                            variant="secondary"
                            onClick={() => onGrantCredit(lease)}
                            className="text-[11px] px-2 py-1 h-7"
                          >
                            Credit
                          </Button>
                        )}
                        {onSwapDevice && (
                          <Button
                            variant="secondary"
                            onClick={() => onSwapDevice(lease)}
                            className="text-[11px] px-2 py-1 h-7"
                          >
                            Swap
                          </Button>
                        )}
                        {onRepossess && (
                          <Button
                            variant="danger"
                            onClick={() => onRepossess(lease)}
                            className="text-[11px] px-2 py-1 h-7"
                          >
                            Repossess
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      <div className="p-3 bg-slate-950/70 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
        <span>Showing {filteredLeases.length} of {leases.length} registered hardware units</span>
        <span className="font-mono text-slate-400">OpenPAYGO & IoT Telemetry Verified</span>
      </div>
    </Card>
  );
};
