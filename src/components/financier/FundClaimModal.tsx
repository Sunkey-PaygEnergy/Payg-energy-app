'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LiquidityPool } from './FinancierDashboard';
import { DollarSign, CheckCircle2, AlertCircle, ArrowUpRight, Coins } from 'lucide-react';

interface FundClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: LiquidityPool | null;
  mode: 'fund' | 'claim';
  financierAddress: string;
  onComplete?: () => void;
}

export const FundClaimModal: React.FC<FundClaimModalProps> = ({
  isOpen,
  onClose,
  pool,
  mode,
  financierAddress,
  onComplete,
}) => {
  const [amount, setAmount] = useState<string>('5000');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  if (!pool) return null;

  const isFund = mode === 'fund';

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setTxHash(null);

    try {
      // Simulate Soroban contract invocation: deposit_pool or claim_yield
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const hash = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      setTxHash(hash);
      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Transaction failed on Stellar Soroban.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setTxHash(null);
    setErrorMsg(null);
  };

  const numAmount = parseFloat(amount) || 0;
  const estYield = (numAmount * (pool.fixedApyPercent / 100) * (pool.tenorMonths / 12)).toFixed(2);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleReset();
        onClose();
      }}
      title={isFund ? 'Deposit Capital into Pool' : 'Claim Accrued Pool Yield'}
    >
      {txHash ? (
        <div className="space-y-5 text-center py-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {isFund ? 'Capital Deposit Verified!' : 'Yield Claim Successful!'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Executed on Stellar Soroban and credited to ledger.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-left text-xs font-mono space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Pool:</span>
              <span className="text-white font-medium">{pool.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{isFund ? 'Amount Deposited:' : 'Yield Claimed:'}</span>
              <span className="text-emerald-400 font-bold">
                ${isFund ? amount : pool.accruedYield.toFixed(2)} USDC
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Stellar Tx Hash:</span>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 truncate max-w-[180px] hover:underline"
              >
                {txHash}
              </a>
            </div>
          </div>

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
        <form onSubmit={handleAction} className="space-y-4">
          <p className="text-xs text-slate-400">
            {isFund
              ? `Commit liquidity to fund off-grid solar equipment. Earn fixed ${pool.fixedApyPercent}% APY over ${pool.tenorMonths} months.`
              : `Withdraw accumulated coupon yield to your connected Stellar account.`}
          </p>

          {/* Pool Summary */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 text-xs space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-white">{pool.name}</span>
              <span className="text-emerald-400">{pool.fixedApyPercent}% APY</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Tenor: {pool.tenorMonths} Months</span>
              <span>Seniority: {pool.seniority}</span>
            </div>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isFund ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  USDC Deposit Amount
                </label>
                <Input
                  type="number"
                  min="500"
                  step="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="font-mono text-xs"
                  required
                />
              </div>

              <div className="flex gap-2">
                {[1000, 5000, 10000, 25000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAmount(v.toString())}
                    className="flex-1 py-1 rounded-lg border border-slate-800 bg-slate-900 text-[11px] text-slate-400 hover:text-white"
                  >
                    ${v / 1000}k
                  </button>
                ))}
              </div>

              <div className="rounded-xl border border-solar-500/20 bg-solar-500/5 p-3 text-xs text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>Projected Term Yield:</span>
                  <strong className="text-emerald-400 font-mono">+${estYield} USDC</strong>
                </div>
                <div className="flex justify-between">
                  <span>Total Maturity Payout:</span>
                  <strong className="text-solar-400 font-mono">
                    ${(numAmount + parseFloat(estYield)).toFixed(2)} USDC
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
                <span className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">
                  Accrued Yield Available for Claim
                </span>
                <div className="text-3xl font-extrabold text-white mt-1">
                  ${pool.accruedYield.toFixed(2)} <span className="text-sm text-emerald-400">USDC</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Destination: {financierAddress.slice(0, 8)}...{financierAddress.slice(-6)}
                </p>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="w-full bg-solar-500 hover:bg-solar-400 text-slate-950 font-bold text-xs"
            >
              {submitting
                ? 'Signing Transaction with Freighter...'
                : isFund
                ? `Deposit $${amount} USDC on Ledger`
                : `Claim $${pool.accruedYield.toFixed(2)} USDC`}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
