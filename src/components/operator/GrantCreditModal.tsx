'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Lease } from '@/types';
import { Gift, Sparkles, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

interface GrantCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  lease: Lease;
  onCreditGranted?: (newPaidUntil: number, token?: string) => void;
}

export const GrantCreditModal: React.FC<GrantCreditModalProps> = ({
  isOpen,
  onClose,
  lease,
  onCreditGranted,
}) => {
  const [days, setDays] = useState<number>(7);
  const [reason, setReason] = useState<string>('promotional_bonus');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<{ newPaidUntil: number; token?: string } | null>(null);

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (days <= 0) {
      setErrorMsg('Credit days must be greater than 0.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      // Simulate Soroban grant_credit call
      await new Promise((resolve) => setTimeout(resolve, 1300));

      const nowSec = Math.floor(Date.now() / 1000);
      const baseSec = Math.max(lease.paidUntil, nowSec);
      const newPaidUntil = baseSec + days * 86400;

      // Generate simulated 9-digit OpenPAYGO token for keypad units
      const token = Math.floor(100 + Math.random() * 900) + ' ' +
        Math.floor(100 + Math.random() * 900) + ' ' +
        Math.floor(100 + Math.random() * 900);

      const grantResult = { newPaidUntil, token };
      setResult(grantResult);

      if (onCreditGranted) {
        onCreditGranted(newPaidUntil, token);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to grant energy credit.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleReset();
        onClose();
      }}
      title="Grant Goodwill Energy Credit"
    >
      {result ? (
        <div className="space-y-5 text-center py-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-solar-500/10 border border-solar-500/30 flex items-center justify-center text-solar-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">+{days} Days Energy Granted!</h3>
            <p className="text-xs text-slate-400 mt-1">
              Active ledger expiration updated to {new Date(result.newPaidUntil * 1000).toLocaleDateString()}.
            </p>
          </div>

          {result.token && (
            <div className="rounded-xl border border-solar-500/30 bg-solar-500/10 p-4">
              <span className="text-[10px] uppercase font-semibold text-solar-300">
                Offline Keypad Activation Token
              </span>
              <div className="font-mono text-xl font-bold tracking-widest text-white mt-1">
                {result.token}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                SMS notification automatically queued for customer phone.
              </p>
            </div>
          )}

          <Button
            variant="primary"
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="w-full bg-solar-500 hover:bg-solar-400 text-slate-950 font-bold text-xs"
          >
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleGrant} className="space-y-4">
          <p className="text-xs text-slate-400">
            Authorize complimentary clean power days on Soroban for device <strong className="text-white font-mono">{lease.deviceId}</strong> (Lease #{lease.id}).
          </p>

          {errorMsg && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Days Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Select Energy Days to Credit
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 7, 14, 30].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDays(d)}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                    days === d
                      ? 'border-solar-500 bg-solar-500/20 text-solar-400'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  +{d} Days
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Custom Days Count
            </label>
            <Input
              type="number"
              min={1}
              max={90}
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 0)}
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Grant Authorization Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-white focus:outline-none focus:border-solar-500"
            >
              <option value="promotional_bonus">Promotional Bonus / Community Campaign</option>
              <option value="outage_compensation">Network Downtime / Solar Maintenance Goodwill</option>
              <option value="ngo_carbon_grant">NGO Clean Energy / Carbon Subsidy</option>
              <option value="referral_reward">Customer Referral Milestone Reward</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Administrative Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Authorized per Q3 off-grid electrification grant..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-solar-500"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="w-full bg-solar-500 hover:bg-solar-400 text-slate-950 font-bold text-xs"
            >
              {submitting ? 'Granting on Soroban...' : `Authorize +${days} Days Clean Power`}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
