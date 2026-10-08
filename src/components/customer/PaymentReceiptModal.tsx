'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Lease } from '@/types';

export interface PaymentReceipt {
  receiptId: string;
  txHash: string;
  amount: string;
  currency: string;
  daysPurchased: number;
  paidAt: string;
  newPaidUntil: string;
  openpaygoToken?: string;
  totalPaidSoFar: string;
  totalCashPrice: string;
}

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  lease: Lease;
  receipt: PaymentReceipt;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  isOpen,
  onClose,
  lease,
  receipt,
}) => {
  const [copied, setCopied] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  const handleCopy = () => {
    const text = `Sunkey PAYG Energy Receipt\nReceipt ID: ${receipt.receiptId}\nDevice: ${lease.deviceId}\nAmount: ${receipt.amount} ${receipt.currency}\nDays Credited: ${receipt.daysPurchased} days\nPaid Until: ${receipt.newPaidUntil}\n${receipt.openpaygoToken ? `Token: ${receipt.openpaygoToken}\n` : ''}Tx: ${receipt.txHash}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSms = () => {
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Payment Receipt"
    >
      <div className="space-y-6">
        {/* Receipt Header Badge */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Receipt Number</span>
            <div className="font-mono text-sm font-bold text-amber-400">{receipt.receiptId}</div>
          </div>
          <Badge status="Active" />
        </div>

        {/* Amount & Time Display */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center">
          <div className="text-3xl font-extrabold text-white tracking-tight">
            +{receipt.amount} <span className="text-sm font-semibold text-amber-400">{receipt.currency}</span>
          </div>
          <div className="text-xs text-emerald-400 font-medium mt-1">
            Extended Solar Access by +{receipt.daysPurchased} Days
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            Timestamp: {receipt.paidAt}
          </div>
        </div>

        {/* Keypad Token Highlight (if present) */}
        {receipt.openpaygoToken && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
            <div className="text-[10px] font-semibold uppercase text-amber-300 tracking-wider">
              Offline 9-Digit Keypad Activation Code
            </div>
            <div className="text-2xl font-mono font-bold tracking-widest text-white mt-1">
              {receipt.openpaygoToken}
            </div>
            <p className="text-[11px] text-amber-300/80 mt-1">
              Key in code followed by <strong className="text-white">#</strong> on your solar battery unit
            </p>
          </div>
        )}

        {/* Ledger & Device Details */}
        <div className="space-y-2 text-xs divide-y divide-slate-800/80">
          <div className="flex justify-between py-1.5 text-slate-400">
            <span>Device ID:</span>
            <span className="font-mono text-white font-medium">{lease.deviceId}</span>
          </div>
          <div className="flex justify-between py-1.5 text-slate-400">
            <span>Customer Account:</span>
            <span className="font-mono text-slate-300">
              {lease.customer.slice(0, 8)}...{lease.customer.slice(-6)}
            </span>
          </div>
          <div className="flex justify-between py-1.5 text-slate-400">
            <span>New Access Expiration:</span>
            <span className="font-semibold text-emerald-300">{receipt.newPaidUntil}</span>
          </div>
          <div className="flex justify-between py-1.5 text-slate-400">
            <span>Total Capital Repaid:</span>
            <span className="font-medium text-white">
              {receipt.totalPaidSoFar} / {receipt.totalCashPrice} USDC
            </span>
          </div>
          <div className="flex justify-between py-1.5 text-slate-400">
            <span>Stellar Ledger Tx:</span>
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${receipt.txHash}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-amber-400 hover:underline text-[11px] truncate max-w-[180px]"
            >
              {receipt.txHash.slice(0, 10)}...{receipt.txHash.slice(-8)}
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button variant="secondary" onClick={handleCopy} className="text-xs">
            {copied ? 'Copied!' : 'Copy Info'}
          </Button>
          <Button variant="secondary" onClick={handleSendSms} className="text-xs">
            {smsSent ? 'SMS Sent!' : 'Send SMS'}
          </Button>
          <Button variant="primary" onClick={handlePrint} className="text-xs">
            Print / PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};
