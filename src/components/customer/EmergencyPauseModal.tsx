'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Lease } from '@/types';

interface EmergencyPauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  lease: Lease;
  onGraceGranted?: (newPaidUntil: number) => void;
}

export const EmergencyPauseModal: React.FC<EmergencyPauseModalProps> = ({
  isOpen,
  onClose,
  lease,
  onGraceGranted,
}) => {
  const [activeTab, setActiveTab] = useState<'grace' | 'pause'>('grace');
  const [reason, setReason] = useState<string>('medical');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRequestGrace = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Simulate Soroban contract invocation: request_emergency_grace
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const additionalSeconds = 48 * 3600; // 48-hour emergency buffer
      const newPaidUntil = Math.max(lease.paidUntil, Math.floor(Date.now() / 1000)) + additionalSeconds;

      setSuccessMsg('48-Hour Emergency Grace granted! Device access extended.');
      if (onGraceGranted) {
        onGraceGranted(newPaidUntil);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to request grace extension.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestPause = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Simulate Operator Pause Request submission
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSuccessMsg('Seasonal hold request submitted to your operator for approval.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit pause request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Emergency Access & Account Hold"
    >
      <div className="space-y-5">
        <p className="text-xs text-slate-400">
          Device #{lease.deviceId} • Lease #{lease.id}
        </p>

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab('grace');
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'grace'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            48h Emergency Grace
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('pause');
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'pause'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Seasonal Travel Pause
          </button>
        </div>

        {successMsg && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 flex items-start gap-2.5">
            <svg className="w-5 h-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-semibold">Success</p>
              <p className="mt-0.5 text-slate-300">{successMsg}</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        {activeTab === 'grace' ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Emergency Power Buffer Policy
              </div>
              <p>
                Each customer has access to a one-time 48-hour emergency grace extension per billing cycle. The smart contract immediately keeps lights, medical equipment, and refrigeration powered while your next top-up is arranged.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                • Duration: <strong className="text-amber-300">48 Hours (2 Days)</strong>
                <br />
                • Cost: Deducted from next payment top-up without penalty interest.
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Reason for Emergency Request
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="medical">Medical / Health Clinic Need</option>
                <option value="weather">Extreme Storm / Solar Panel Inefficiency</option>
                <option value="salary_delay">Mobile Money / Wage Delay</option>
                <option value="study">Children Exam Preparation / Night Study</option>
                <option value="other">Other Domestic Urgent Need</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Optional Note for Operator
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g. Awaiting salary transfer tomorrow morning..."
                rows={2}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <Button
              variant="primary"
              onClick={handleRequestGrace}
              disabled={submitting || Boolean(successMsg)}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2.5"
            >
              {submitting ? 'Signing Grace Extension...' : 'Activate 48h Emergency Grace'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Seasonal Travel or Agricultural Hold
              </div>
              <p>
                Heading away for seasonal farming or traveling? You can place your energy lease on safe hold for up to 30 days without risk of device repossession or credit penalty.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Requested Hold Duration
              </label>
              <select className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none">
                <option value="7">7 Days Hold</option>
                <option value="14">14 Days Hold</option>
                <option value="21">21 Days Hold</option>
                <option value="30">30 Days Maximum Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Contact Phone While Away
              </label>
              <input
                type="tel"
                placeholder="+254 700 000 000"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <Button
              variant="secondary"
              onClick={handleRequestPause}
              disabled={submitting || Boolean(successMsg)}
              className="w-full"
            >
              {submitting ? 'Submitting Request...' : 'Submit Seasonal Pause Request'}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
