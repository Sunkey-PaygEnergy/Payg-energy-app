'use client';

import React, { useState } from 'react';
import { Smartphone, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export interface MobileMoneySheetProps {
  isOpen: boolean;
  onClose: () => void;
  leaseId: string;
  days: number;
  fiatAmount: number;
  currency: string;
  onPaymentSuccess: () => void;
}

export const MobileMoneySheet: React.FC<MobileMoneySheetProps> = ({
  isOpen,
  onClose,
  leaseId,
  days,
  fiatAmount,
  currency,
  onPaymentSuccess,
}) => {
  const [provider, setProvider] = useState<'mpesa' | 'mtn' | 'airtel'>('mpesa');
  const [phone, setPhone] = useState('+254712345678');
  const [step, setStep] = useState<'input' | 'prompting' | 'success'>('input');
  const [receiptRef, setReceiptRef] = useState('');

  const handleSendPrompt = async () => {
    setStep('prompting');

    // Simulate STK Push authorization on user phone
    setTimeout(() => {
      const ref = `${provider.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setReceiptRef(ref);
      setStep('success');
      onPaymentSuccess();
    }, 2800);
  };

  const handleDone = () => {
    setStep('input');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleDone} title="Mobile Money Payment">
      <div className="space-y-5">
        {step === 'input' && (
          <>
            {/* Amount Summary */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-semibold block mb-1">
                Top-Up Amount
              </span>
              <div className="text-2xl font-extrabold text-white">
                {fiatAmount.toLocaleString()} <span className="text-solar-400 text-base">{currency}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Buying <strong className="text-white">{days} Days</strong> of clean solar energy
              </p>
            </div>

            {/* Provider Tabs */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Mobile Money Provider:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setProvider('mpesa')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    provider === 'mpesa'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  M-Pesa
                </button>
                <button
                  onClick={() => setProvider('mtn')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    provider === 'mtn'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  MTN MoMo
                </button>
                <button
                  onClick={() => setProvider('airtel')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    provider === 'airtel'
                      ? 'bg-red-500/20 border-red-500 text-red-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Airtel Money
                </button>
              </div>
            </div>

            {/* Phone Input */}
            <Input
              label="Registered Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254712345678"
              helperText="You will receive a PIN prompt on this phone handset"
            />

            <Button variant="solar" size="lg" onClick={handleSendPrompt} className="w-full">
              <Smartphone className="h-4 w-4 mr-2" />
              Send STK Prompt ({fiatAmount.toLocaleString()} {currency})
            </Button>
          </>
        )}

        {step === 'prompting' && (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="h-12 w-12 text-solar-400 animate-spin" />
            <div>
              <h4 className="text-base font-bold text-white">Prompt Sent to Handset!</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xs">
                Check phone <strong className="text-solar-400">{phone}</strong> and enter your mobile money PIN to authorize payment.
              </p>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 max-w-xs">
              Simulating webhook verification from {provider.toUpperCase()} bridge...
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-clean-500/20 text-clean-400 flex items-center justify-center border-2 border-clean-500">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Mobile Payment Received!</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xs">
                Your payment was converted to Stellar USDC and credited to Lease #{leaseId}.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 w-full text-xs font-mono text-slate-300">
              Receipt: {receiptRef}
            </div>

            <Button variant="primary" size="lg" onClick={handleDone} className="w-full">
              Done
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
