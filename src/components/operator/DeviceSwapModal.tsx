'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Lease } from '@/types';
import { RefreshCw, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface DeviceSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  lease: Lease;
  onSwapComplete?: (newDeviceId: string) => void;
}

export const DeviceSwapModal: React.FC<DeviceSwapModalProps> = ({
  isOpen,
  onClose,
  lease,
  onSwapComplete,
}) => {
  const [newDeviceId, setNewDeviceId] = useState('');
  const [reason, setReason] = useState('battery_degradation');
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceId.trim()) {
      setErrorMsg('Replacement Device ID is required.');
      return;
    }

    if (newDeviceId.trim().toUpperCase() === lease.deviceId.toUpperCase()) {
      setErrorMsg('Replacement Device ID must be different from current unit.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Simulate Soroban contract swap_device call
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const updatedDevice = newDeviceId.trim().toUpperCase();
      setSuccessMsg(`Device successfully swapped to ${updatedDevice}. Payment history and access tokens transferred.`);

      if (onSwapComplete) {
        onSwapComplete(updatedDevice);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to authorize hardware swap.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hardware Warranty Swap"
    >
      <form onSubmit={handleSwap} className="space-y-4">
        <p className="text-xs text-slate-400">
          Transfer active lease access, repayment credit, and ownership terms to a replacement hardware serial.
        </p>

        {/* Visual Swap Indicator */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/80">
          <div className="text-center">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Current Faulty Unit</span>
            <div className="font-mono text-xs font-bold text-rose-400 mt-0.5">{lease.deviceId}</div>
          </div>
          <div className="p-2 rounded-full bg-slate-800 text-slate-400">
            <ArrowRight className="w-4 h-4" />
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Replacement Unit</span>
            <div className="font-mono text-xs font-bold text-emerald-400 mt-0.5">
              {newDeviceId || 'Pending Serial...'}
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Replacement Device Serial ID *
          </label>
          <Input
            placeholder="e.g. DEV-SH100-9941"
            value={newDeviceId}
            onChange={(e) => setNewDeviceId(e.target.value)}
            className="font-mono text-xs"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Warranty Swap Reason
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-white focus:outline-none focus:border-solar-500"
          >
            <option value="battery_degradation">Battery Capacity Degradation (&lt;70% SoH)</option>
            <option value="inverter_failure">Solar MPPT / Inverter Circuit Failure</option>
            <option value="lightning_surge">Lightning / Grid Power Surge</option>
            <option value="keypad_defect">Physical Keypad / LCD Screen Defect</option>
            <option value="upgrade">Promotional Hardware Upgrade</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Field Technician Work Order Notes
          </label>
          <textarea
            rows={2}
            value={technicianNotes}
            onChange={(e) => setTechnicianNotes(e.target.value)}
            placeholder="Technician badge #912, swapped in Siaya County..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-solar-500"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={submitting || Boolean(successMsg)}
            className="w-full bg-solar-500 hover:bg-solar-400 text-slate-950 font-bold"
          >
            {submitting ? 'Executing Soroban Swap...' : 'Authorize On-Chain Hardware Swap'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
