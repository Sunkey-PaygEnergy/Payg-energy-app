'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Lease } from '@/types';
import { AlertTriangle, ShieldAlert, CheckCircle2, FileText, Ban } from 'lucide-react';

interface RepossessModalProps {
  isOpen: boolean;
  onClose: () => void;
  lease: Lease;
  onActionComplete?: (action: 'suspend' | 'repossession') => void;
}

export const RepossessModal: React.FC<RepossessModalProps> = ({
  isOpen,
  onClose,
  lease,
  onActionComplete,
}) => {
  const [actionType, setActionType] = useState<'suspend' | 'repossession'>('suspend');
  const [agentName, setAgentName] = useState('');
  const [warehouseLocation, setWarehouseLocation] = useState('Nairobi Central Depo');
  const [statutoryNoticeConfirmed, setStatutoryNoticeConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actionType === 'repossession' && !statutoryNoticeConfirmed) {
      setErrorMsg('You must certify that statutory default notice has been provided to the customer.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Simulate Soroban contract call: suspend_lease or repossession
      await new Promise((resolve) => setTimeout(resolve, 1400));

      if (actionType === 'suspend') {
        setSuccessMsg(`Lease #${lease.id} suspended. Device #${lease.deviceId} locked remotely on ledger.`);
      } else {
        setSuccessMsg(`Device #${lease.deviceId} flagged for field recovery and returned to inventory pool.`);
      }

      if (onActionComplete) {
        onActionComplete(actionType);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Action failed on Stellar Soroban.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lease Suspension & Guarded Repossession"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Warning banner */}
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
          <div>
            <span className="font-bold">Guarded Consumer Protection Protocol</span>
            <p className="mt-0.5 text-slate-300">
              PAYG solar energy is an essential rural utility. Ensure communication and restructuring steps were exhausted before taking repossession action.
            </p>
          </div>
        </div>

        {/* Lease Context */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs divide-y divide-slate-800">
          <div className="flex justify-between pb-2 text-slate-400">
            <span>Lease Identifier:</span>
            <span className="font-mono text-white font-medium">{lease.id}</span>
          </div>
          <div className="flex justify-between py-2 text-slate-400">
            <span>Device Serial:</span>
            <span className="font-mono text-white font-medium">{lease.deviceId}</span>
          </div>
          <div className="flex justify-between pt-2 text-slate-400">
            <span>Customer Address:</span>
            <span className="font-mono text-slate-300">
              {lease.customer.slice(0, 8)}...{lease.customer.slice(-6)}
            </span>
          </div>
        </div>

        {successMsg && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* Action Type Tabs */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Select Operation Workflow
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActionType('suspend')}
              className={`p-3 rounded-xl border text-left transition-all ${
                actionType === 'suspend'
                  ? 'border-amber-500/50 bg-amber-500/10 text-white'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-xs text-amber-400">
                <Ban className="w-4 h-4" />
                Administrative Hold
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Remotely locks unit; can be resumed upon settlement.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActionType('repossession')}
              className={`p-3 rounded-xl border text-left transition-all ${
                actionType === 'repossession'
                  ? 'border-rose-500/50 bg-rose-500/10 text-white'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-xs text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                Physical Repossession
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Terminates contract; hardware recovered for refurbishment.
              </p>
            </button>
          </div>
        </div>

        {actionType === 'repossession' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Field Recovery Agent Name
              </label>
              <Input
                placeholder="Agent Samuel Omondi"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Return Warehouse / Facility
              </label>
              <select
                value={warehouseLocation}
                onChange={(e) => setWarehouseLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Nairobi Central Depo">Nairobi Central Depo (Kenya)</option>
                <option value="Kisumu Regional Hub">Kisumu Regional Hub (Kenya)</option>
                <option value="Kampala Warehouse">Kampala Warehouse (Uganda)</option>
                <option value="Accra Logistics Center">Accra Logistics Center (Ghana)</option>
              </select>
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-800 bg-slate-950/70 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={statutoryNoticeConfirmed}
                onChange={(e) => setStatutoryNoticeConfirmed(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 text-rose-500 focus:ring-rose-500"
              />
              <span>
                I certify that statutory 14-day default notice was served per Consumer Credit and Off-Grid Solar Regulations.
              </span>
            </label>
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            variant="danger"
            disabled={submitting || Boolean(successMsg)}
            className="w-full text-xs font-bold py-2.5"
          >
            {submitting
              ? 'Recording on Ledger...'
              : actionType === 'suspend'
              ? 'Enforce Administrative Hold'
              : 'Execute Guarded Repossession'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
