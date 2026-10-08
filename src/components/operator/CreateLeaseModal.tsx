'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plan, Lease } from '@/types';
import { Layers, FileSpreadsheet, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface CreateLeaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  operatorAddress: string;
  availablePlans?: Plan[];
  onLeaseCreated?: (lease: Lease) => void;
}

const defaultPlans: Plan[] = [
  {
    id: 'plan_standard_50w',
    operator: 'GBV76O4Q4V...SKOL',
    name: 'Standard Home 50W (Family Lights + TV)',
    token: 'USDC',
    depositAmount: '25.00',
    totalCashPrice: '250.00',
    dailyRate: '0.85',
    isActive: true,
  },
  {
    id: 'plan_pro_200w',
    operator: 'GBV76O4Q4V...SKOL',
    name: 'Enterprise Commercial 200W',
    token: 'USDC',
    depositAmount: '50.00',
    totalCashPrice: '480.00',
    dailyRate: '1.60',
    isActive: true,
  },
];

export const CreateLeaseModal: React.FC<CreateLeaseModalProps> = ({
  isOpen,
  onClose,
  operatorAddress,
  availablePlans = defaultPlans,
  onLeaseCreated,
}) => {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [deviceId, setDeviceId] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+254 ');
  const [selectedPlanId, setSelectedPlanId] = useState(availablePlans[0]?.id || 'plan_standard_50w');
  const [poolId, setPoolId] = useState('');
  const [batchData, setBatchData] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdLease, setCreatedLease] = useState<Lease | null>(null);

  const selectedPlan = availablePlans.find((p) => p.id === selectedPlanId);

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceId.trim() || !customerAddress.trim()) {
      setErrorMsg('Device Serial and Customer Address are required.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      // Simulate Soroban create_lease call
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const newLease: Lease = {
        id: 'LSE-' + Math.floor(1000 + Math.random() * 9000),
        deviceId: deviceId.trim().toUpperCase(),
        operator: operatorAddress,
        customer: customerAddress.trim(),
        customerPhone: customerPhone.trim(),
        planId: selectedPlanId,
        status: 'PendingDeposit',
        totalPaid: '0.00',
        paidUntil: Math.floor(Date.now() / 1000),
        depositPaid: false,
        poolId: poolId.trim() || null,
        plan: selectedPlan,
      };

      setCreatedLease(newLease);
      if (onLeaseCreated) {
        onLeaseCreated(newLease);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to create lease on Soroban.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBatchSubmit = async () => {
    if (!batchData.trim()) {
      setErrorMsg('Please paste batch lease CSV data.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      // Simulate Batch Soroban multi-contract invocation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onClose();
    } catch (err) {
      setErrorMsg('Batch originations failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setDeviceId('');
    setCustomerAddress('');
    setCreatedLease(null);
    setErrorMsg(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleReset();
        onClose();
      }}
      title="Originate Energy Lease Contract"
    >
      {createdLease ? (
        <div className="space-y-5 text-center py-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Lease Contract Created!</h3>
            <p className="text-xs text-slate-400 mt-1">
              Awaiting customer upfront deposit on Stellar to unlock clean energy.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-left text-xs font-mono space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Lease ID:</span>
              <span className="text-solar-400 font-bold">{createdLease.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Device ID:</span>
              <span className="text-slate-200">{createdLease.deviceId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="text-slate-300 truncate max-w-[180px]">{createdLease.customer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Deposit Due:</span>
              <span className="text-emerald-400 font-bold">${selectedPlan?.depositAmount} USDC</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleReset} className="w-1/2 text-xs">
              Originate Another
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="w-1/2 text-xs bg-solar-500 text-slate-950 font-bold"
            >
              Done
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setMode('single')}
              className={`flex-1 py-1.5 font-semibold rounded-lg transition-all ${
                mode === 'single'
                  ? 'bg-solar-500/20 text-solar-400 border border-solar-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Single Contract
            </button>
            <button
              type="button"
              onClick={() => setMode('batch')}
              className={`flex-1 py-1.5 font-semibold rounded-lg transition-all ${
                mode === 'batch'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Batch CSV Origination
            </button>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === 'single' ? (
            <form onSubmit={handleSingleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Hardware Device Serial *
                </label>
                <Input
                  placeholder="e.g. DEV-SH100-8812"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  className="font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Customer Stellar Public Key (G...) *
                </label>
                <Input
                  placeholder="e.g. GA6M6Q3H62FSLG4YUSW23V6B3H6V32D4W6U6M3..."
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Customer Phone Number (for SMS & OpenPAYGO)
                </label>
                <Input
                  placeholder="+254 712 345 678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Select Tariff Plan *
                </label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-white focus:outline-none focus:border-solar-500"
                >
                  {availablePlans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.dailyRate}/day, ${p.depositAmount} deposit)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Financier Liquidity Pool ID (Optional)
                </label>
                <Input
                  placeholder="e.g. pool_kenya_solar_alpha (Leave empty for operator-only balance sheet)"
                  value={poolId}
                  onChange={(e) => setPoolId(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>

              {selectedPlan && (
                <div className="rounded-xl border border-solar-500/20 bg-solar-500/5 p-3 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Upfront Deposit:</span>
                    <strong className="text-white font-mono">${selectedPlan.depositAmount} USDC</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Power Tariff:</span>
                    <strong className="text-emerald-400 font-mono">${selectedPlan.dailyRate} USDC/day</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Ownership Payoff Target:</span>
                    <strong className="text-solar-400 font-mono">${selectedPlan.totalCashPrice} USDC</strong>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="w-full bg-solar-500 hover:bg-solar-400 text-slate-950 font-bold"
              >
                {submitting ? 'Signing on Stellar Soroban...' : 'Deploy Lease to Ledger'}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Paste CSV in format: <code className="text-solar-400">device_id,customer_address,phone,plan_id</code>
              </p>
              <textarea
                rows={6}
                value={batchData}
                onChange={(e) => setBatchData(e.target.value)}
                placeholder="DEV-001,GA6M6Q...3M3,+254712345678,plan_standard_50w&#10;DEV-002,GDM7B2...819,+256772984112,plan_pro_200w"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 p-3 font-mono text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />

              <Button
                variant="primary"
                onClick={handleBatchSubmit}
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                {submitting ? 'Executing Batch Originations...' : 'Submit Batch Contracts'}
              </Button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
