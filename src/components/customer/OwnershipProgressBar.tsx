import React from 'react';
import { Award, CheckCircle2, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export interface OwnershipProgressBarProps {
  totalPaidUnits: string; // 7 decimals
  totalCashPriceUnits: string; // 7 decimals
  depositPaid: boolean;
  isOwned: boolean;
}

export const OwnershipProgressBar: React.FC<OwnershipProgressBarProps> = ({
  totalPaidUnits,
  totalCashPriceUnits,
  depositPaid,
  isOwned,
}) => {
  const paid = Number(totalPaidUnits) / 10_000_000;
  const price = Math.max(1, Number(totalCashPriceUnits) / 10_000_000);
  const remaining = Math.max(0, price - paid);
  const percent = isOwned ? 100 : Math.min(100, Math.round((paid / price) * 1000) / 10);

  return (
    <Card className="p-5 border-slate-800/90 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-solar-500/15 text-solar-400">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Path to Ownership
            </h4>
            <p className="text-[11px] text-slate-400">Pay-to-Own Progress</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm font-extrabold text-solar-400">{percent}%</span>
          <p className="text-[10px] text-slate-500 font-medium">Repaid</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden mb-3">
        <div
          className="bg-gradient-to-r from-solar-500 via-clean-400 to-clean-500 h-full rounded-full transition-all duration-700 ease-out shadow-sm shadow-clean-500/50"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Numerical Stats */}
      <div className="flex items-center justify-between text-xs py-1 border-t border-slate-800/80 pt-3">
        <div>
          <span className="text-slate-400 text-[10px] block">Total Contributed</span>
          <span className="font-bold text-white">${paid.toFixed(2)} USDC</span>
        </div>
        <div className="text-center">
          <span className="text-slate-400 text-[10px] block">Cash Price</span>
          <span className="font-bold text-slate-300">${price.toFixed(2)} USDC</span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 text-[10px] block">Remaining to Own</span>
          <span className={`font-bold ${remaining === 0 ? 'text-clean-400' : 'text-solar-400'}`}>
            ${remaining.toFixed(2)} USDC
          </span>
        </div>
      </div>

      {/* Milestone Callout */}
      <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-[11px]">
        {isOwned ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-solar-400 shrink-0" />
            <span className="text-slate-200 font-semibold">
              Congratulations! Your solar system is 100% paid off and unlocked forever.
            </span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 text-clean-400 shrink-0" />
            <span className="text-slate-300">
              Every top-up buys power today <strong className="text-white">and</strong> counts directly toward full device ownership.
            </span>
          </>
        )}
      </div>
    </Card>
  );
};
