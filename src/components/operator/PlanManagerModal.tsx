'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plan } from '@/types';
import { Sliders, Plus, CheckCircle, DollarSign, Calendar, Layers } from 'lucide-react';

interface PlanManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  operatorAddress: string;
  initialPlans?: Plan[];
  onPlanCreated?: (plan: Plan) => void;
}

const defaultPlans: Plan[] = [
  {
    id: 'plan_basic_20w',
    operator: 'GBV76O4Q4V...SKOL',
    name: 'Basic Light 20W (Entry Kit)',
    token: 'USDC',
    depositAmount: '15.00',
    totalCashPrice: '120.00',
    dailyRate: '0.45',
    isActive: true,
  },
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
    name: 'Enterprise Commercial 200W (Refrigeration + Shop)',
    token: 'USDC',
    depositAmount: '50.00',
    totalCashPrice: '480.00',
    dailyRate: '1.60',
    isActive: true,
  },
];

export const PlanManagerModal: React.FC<PlanManagerModalProps> = ({
  isOpen,
  onClose,
  operatorAddress,
  initialPlans = defaultPlans,
  onPlanCreated,
}) => {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [planId, setPlanId] = useState('');
  const [name, setName] = useState('');
  const [depositAmount, setDepositAmount] = useState('20.00');
  const [dailyRate, setDailyRate] = useState('0.75');
  const [totalCashPrice, setTotalCashPrice] = useState('220.00');
  const [tokenSymbol, setTokenSymbol] = useState('USDC');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const calculateDaysToOwn = (deposit: string, daily: string, total: string) => {
    const dep = parseFloat(deposit) || 0;
    const rate = parseFloat(daily) || 1;
    const tot = parseFloat(total) || 0;
    const remaining = Math.max(0, tot - dep);
    return Math.ceil(remaining / rate);
  };

  const handleTogglePlan = (id: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planId.trim() || !name.trim()) {
      setErrorMsg('Plan ID and Name are required.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      // Simulate Soroban create_plan invocation
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const newPlan: Plan = {
        id: planId.trim().toLowerCase(),
        operator: operatorAddress,
        name: name.trim(),
        token: tokenSymbol,
        depositAmount,
        dailyRate,
        totalCashPrice,
        isActive: true,
      };

      setPlans((prev) => [...prev, newPlan]);
      if (onPlanCreated) {
        onPlanCreated(newPlan);
      }

      setShowCreateForm(false);
      setPlanId('');
      setName('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to register plan on Soroban.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Clean Energy Lease Plans"
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <p className="text-xs text-slate-400">
            Configure tariff rates, upfront deposits, and total payoff terms on Soroban.
          </p>
          <Button
            variant="secondary"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            {showCreateForm ? 'View Plans' : 'New Tariff'}
          </Button>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        {showCreateForm ? (
          <form onSubmit={handleCreatePlan} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Plan Identifier Code *
              </label>
              <Input
                placeholder="e.g. plan_pico_10w"
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className="font-mono text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Customer Facing Plan Name *
              </label>
              <Input
                placeholder="e.g. SunHome Pico Kit (10W + 2 Lamps)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Upfront Deposit (USDC)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Daily Tariff Rate (USDC/day)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(e.target.value)}
                  className="font-mono text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Total Cash Ownership Price (USDC)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={totalCashPrice}
                  onChange={(e) => setTotalCashPrice(e.target.value)}
                  className="font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Payment Currency Asset
                </label>
                <select
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-white focus:outline-none focus:border-solar-500"
                >
                  <option value="USDC">USDC (Stellar Testnet / Circle)</option>
                  <option value="XLM">XLM (Native Stellar Lumens)</option>
                  <option value="EURC">EURC (Circle Euro)</option>
                </select>
              </div>
            </div>

            <div className="rounded-xl border border-solar-500/20 bg-solar-500/5 p-3 text-xs text-slate-300 flex items-center justify-between">
              <span>Estimated Amortization Window:</span>
              <strong className="text-solar-400 font-mono">
                ~{calculateDaysToOwn(depositAmount, dailyRate, totalCashPrice)} Days to 100% Ownership
              </strong>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="w-full bg-solar-500 hover:bg-solar-400 text-slate-950 font-bold"
            >
              {submitting ? 'Registering on Soroban...' : 'Publish Tariff on Stellar'}
            </Button>
          </form>
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => {
              const daysToOwn = calculateDaysToOwn(plan.depositAmount, plan.dailyRate, plan.totalCashPrice);

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl border p-4 transition-all ${
                    plan.isActive
                      ? 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                      : 'border-slate-800/50 bg-slate-950/40 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{plan.name}</h4>
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                          {plan.id}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-400 font-medium mt-1">
                        ${plan.dailyRate} {plan.token}/day • ${plan.depositAmount} Deposit
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePlan(plan.id)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                        plan.isActive
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {plan.isActive ? 'Active' : 'Archived'}
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 text-xs text-slate-400">
                    <div>
                      <span>Cash Price:</span>{' '}
                      <strong className="text-white font-mono">${plan.totalCashPrice} {plan.token}</strong>
                    </div>
                    <div className="text-right">
                      <span>Term:</span>{' '}
                      <strong className="text-solar-400 font-mono">~{daysToOwn} Days</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};
