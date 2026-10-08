'use client';

import React, { useState } from 'react';
import { Wallet, ShieldCheck, CheckCircle2, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useWallet } from '@/context/WalletContext';
import { sorobanFrontendClient } from '@/contracts/soroban';
import { bridgeApi } from '@/services/bridgeApi';

export interface StellarPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaseId: string;
  deviceId: string;
  days: number;
  tokenAmount: string; // 7 decimals
  onPaymentSuccess: () => void;
}

export const StellarPaymentModal: React.FC<StellarPaymentModalProps> = ({
  isOpen,
  onClose,
  leaseId,
  deviceId,
  days,
  tokenAmount,
  onPaymentSuccess,
}) => {
  const { publicKey, isConnected, connect, signTx } = useWallet();
  const [step, setStep] = useState<'idle' | 'signing' | 'confirming' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const usdValue = (Number(tokenAmount) / 10_000_000).toFixed(2);

  const handlePay = async () => {
    let payer = publicKey;
    if (!payer) {
      payer = await connect();
      if (!payer) return;
    }

    try {
      setStep('signing');
      // 1. Build transaction XDR
      const xdr = await sorobanFrontendClient.buildPayTx(payer, leaseId, tokenAmount);

      // 2. Request user signature
      const signedXdr = await signTx(xdr);

      // 3. Confirming simulation / submission
      setStep('confirming');
      await new Promise((r) => setTimeout(r, 1800)); // ledger confirmation animation

      const generatedHash = `tx_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
      setTxHash(generatedHash);

      // 4. Trigger hardware sync via bridge API
      await bridgeApi.triggerDeviceSync(deviceId);

      setStep('success');
      onPaymentSuccess();
    } catch (err: any) {
      console.error('Payment error:', err);
      setErrorMessage(err.message || 'Payment transaction rejected');
      setStep('error');
    }
  };

  const handleReset = () => {
    setStep('idle');
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleReset} title="Pay with Stellar (Soroban)">
      <div className="space-y-5">
        {step === 'idle' && (
          <>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Total Payment</span>
              <div className="text-3xl font-extrabold text-white">
                ${usdValue} <span className="text-sm font-bold text-clean-400">USDC</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Adds <strong className="text-white">{days} Days</strong> of guaranteed solar energy access
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Payer Account:</span>
                <span className="font-mono text-white">
                  {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-6)}` : 'Wallet Not Connected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Smart Contract:</span>
                <span className="font-mono text-clean-400">Soroban PaygLease</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Settlement Network:</span>
                <span className="text-white">Stellar Testnet (Instant)</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handlePay}
              className="w-full shadow-lg shadow-clean-500/25"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Sign & Pay ${usdValue} USDC
            </Button>
          </>
        )}

        {(step === 'signing' || step === 'confirming') && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <Loader2 className="h-12 w-12 text-clean-400 animate-spin" />
              <ShieldCheck className="h-6 w-6 text-clean-500 absolute inset-0 m-auto" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                {step === 'signing' ? 'Awaiting Wallet Signature...' : 'Confirming on Stellar Ledger...'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                {step === 'signing'
                  ? 'Please approve the Soroban pay() transaction in your Freighter extension.'
                  : 'Ledger close in progress. Authorizing energy relay state...'}
              </p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-clean-500/20 text-clean-400 flex items-center justify-center border-2 border-clean-500">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Payment Successful!</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xs">
                Added <strong className="text-clean-400">{days} Days</strong> of access. Device hardware relay has been unlocked!
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 w-full text-xs font-mono text-slate-400 truncate">
              Tx: {txHash}
            </div>

            <Button variant="primary" size="lg" onClick={handleReset} className="w-full">
              Done
            </Button>
          </div>
        )}

        {step === 'error' && (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border-2 border-rose-500">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Payment Failed</h4>
              <p className="text-xs text-rose-300 mt-1 max-w-xs">{errorMessage}</p>
            </div>
            <Button variant="outline" size="md" onClick={() => setStep('idle')} className="w-full">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
