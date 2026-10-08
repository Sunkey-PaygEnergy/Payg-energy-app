import React, { useState } from 'react';
import { Zap, Calendar, Smartphone, Wallet, Share2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { APP_CONFIG } from '@/config/constants';

export interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaseId: string;
  dailyRateUnits?: string; // 7 decimals, default 1_000_000 = $0.10 or $0.50
  onProceedStellar: (days: number, tokenAmount: string) => void;
  onProceedMobileMoney: (days: number, fiatAmount: number, currency: string) => void;
  onProceedShareLink: (days: number, tokenAmount: string) => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({
  isOpen,
  onClose,
  leaseId,
  dailyRateUnits = '1000000', // 0.10 USDC per day default
  onProceedStellar,
  onProceedMobileMoney,
  onProceedShareLink,
}) => {
  const [days, setDays] = useState(7);
  const [paymentRail, setPaymentRail] = useState<'stellar' | 'mobile_money' | 'share'>('stellar');
  const [selectedFiat, setSelectedFiat] = useState<'KES' | 'UGX' | 'USD'>('KES');

  const dailyUsd = Number(dailyRateUnits) / 10_000_000;
  const totalUsd = Math.round(days * dailyUsd * 100) / 100;
  const tokenAmountUnits = (BigInt(days) * BigInt(dailyRateUnits)).toString();

  const rate = APP_CONFIG.currencies.rates[selectedFiat] || 1.0;
  const fiatTotal = Math.round(totalUsd * rate);

  const presets = [
    { label: '3 Days', value: 3 },
    { label: '1 Week', value: 7 },
    { label: '2 Weeks', value: 14 },
    { label: '1 Month', value: 30 },
  ];

  const handleContinue = () => {
    if (paymentRail === 'stellar') {
      onProceedStellar(days, tokenAmountUnits);
    } else if (paymentRail === 'mobile_money') {
      onProceedMobileMoney(days, fiatTotal, selectedFiat);
    } else {
      onProceedShareLink(days, tokenAmountUnits);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Top-Up Solar Energy Access">
      <div className="space-y-5">
        {/* Days Selection Presets */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            Select Duration:
          </label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {presets.map((p) => (
              <button
                key={p.value}
                onClick={() => setDays(p.value)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  days === p.value
                    ? 'bg-clean-500/20 border-clean-500 text-clean-400 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Slider */}
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
              <span className="text-slate-400">Custom Duration</span>
              <span className="text-white font-bold">{days} Days</span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value, 10))}
              className="w-full accent-clean-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Total Due</span>
            <div className="text-xl font-extrabold text-white">
              ${totalUsd.toFixed(2)} <span className="text-xs text-clean-400 font-semibold">USDC</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Local Currency</span>
            <div className="text-sm font-bold text-solar-400">
              ~ {fiatTotal.toLocaleString()} {selectedFiat}
            </div>
          </div>
        </div>

        {/* Payment Rails Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            Select Payment Method:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPaymentRail('stellar')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                paymentRail === 'stellar'
                  ? 'bg-clean-500/15 border-clean-500 text-white font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Wallet className="h-5 w-5 text-clean-400" />
              <span className="text-[11px]">Stellar / Web3</span>
            </button>

            <button
              onClick={() => setPaymentRail('mobile_money')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                paymentRail === 'mobile_money'
                  ? 'bg-solar-500/15 border-solar-500 text-white font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Smartphone className="h-5 w-5 text-solar-400" />
              <span className="text-[11px]">Mobile Money</span>
            </button>

            <button
              onClick={() => setPaymentRail('share')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                paymentRail === 'share'
                  ? 'bg-blue-500/15 border-blue-500 text-white font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Share2 className="h-5 w-5 text-blue-400" />
              <span className="text-[11px]">Ask Relative</span>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <Button variant="primary" size="lg" onClick={handleContinue} className="w-full">
          <Zap className="h-4 w-4 mr-2 fill-current" />
          Continue with {paymentRail === 'stellar' ? 'Stellar' : paymentRail === 'mobile_money' ? 'Mobile Money' : 'Share Link'}
        </Button>
      </div>
    </Modal>
  );
};
