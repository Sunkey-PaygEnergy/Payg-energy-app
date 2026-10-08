'use client';

import React from 'react';
import { Zap, Key, Activity, LifeBuoy, RefreshCw } from 'lucide-react';
import { Lease, AccessStatus } from '@/types';

export interface CustomerShellProps {
  lease: Lease;
  access: AccessStatus;
  children: React.ReactNode;
  onOpenTopUp: () => void;
  onOpenKeypadToken: () => void;
  onOpenEmergencyModal: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const CustomerShell: React.FC<CustomerShellProps> = ({
  lease,
  access,
  children,
  onOpenTopUp,
  onOpenKeypadToken,
  onOpenEmergencyModal,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 pb-24 max-w-md mx-auto w-full relative sm:border-x sm:border-slate-800/80">
      {/* Top Mobile Bar */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Active Lease #{lease.id}
          </span>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            {lease.device?.deviceModel || 'Sinoware SunHome-Base 100'}
          </h2>
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-all cursor-pointer"
          title="Refresh State from Stellar"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-clean-400' : ''}`} />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 space-y-4">{children}</main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-xl p-3">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
          <button
            onClick={onOpenTopUp}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-clean-500 hover:bg-clean-400 text-slate-950 font-bold shadow-lg shadow-clean-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Zap className="h-5 w-5 mb-0.5 fill-current" />
            <span className="text-[10px]">Top-Up</span>
          </button>

          <button
            onClick={onOpenKeypadToken}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 active:scale-95 transition-all cursor-pointer"
          >
            <Key className="h-5 w-5 mb-0.5 text-solar-400" />
            <span className="text-[10px]">Token</span>
          </button>

          <button
            onClick={onRefresh}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 active:scale-95 transition-all cursor-pointer"
          >
            <Activity className="h-5 w-5 mb-0.5 text-clean-400" />
            <span className="text-[10px]">Solar Stats</span>
          </button>

          <button
            onClick={onOpenEmergencyModal}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 active:scale-95 transition-all cursor-pointer"
          >
            <LifeBuoy className="h-5 w-5 mb-0.5 text-amber-400" />
            <span className="text-[10px]">Support</span>
          </button>
        </div>
      </div>
    </div>
  );
};
