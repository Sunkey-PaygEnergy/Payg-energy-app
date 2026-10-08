'use client';

import React from 'react';
import { Sun, Wallet, LogOut, ShieldCheck, Activity, Users, Landmark } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/Button';

export interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole, onRoleChange }) => {
  const { publicKey, isConnected, isConnecting, connect, disconnect } = useWallet();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-solar-400 to-clean-500 flex items-center justify-center shadow-lg shadow-clean-500/20">
            <Sun className="h-6 w-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">
                Sunkey <span className="text-clean-400">PaygEnergy</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-clean-400 animate-pulse" />
                Soroban v22
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Decentralized Pay-As-You-Go Solar Micro-Grid
            </p>
          </div>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => onRoleChange('customer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentRole === 'customer'
                ? 'bg-clean-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Customer</span>
          </button>
          <button
            onClick={() => onRoleChange('operator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentRole === 'operator'
                ? 'bg-solar-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Operator</span>
          </button>
          <button
            onClick={() => onRoleChange('financier')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentRole === 'financier'
                ? 'bg-blue-500 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Landmark className="h-3.5 w-3.5" />
            <span>Financier</span>
          </button>
        </div>

        {/* Wallet Connect */}
        <div className="flex items-center gap-2">
          {isConnected && publicKey ? (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
              <ShieldCheck className="h-4 w-4 text-clean-400" />
              <span className="text-xs font-mono font-medium text-slate-200">
                {truncateAddress(publicKey)}
              </span>
              <button
                onClick={disconnect}
                title="Disconnect"
                className="text-slate-400 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => connect()}
              isLoading={isConnecting}
              className="border-clean-500/40 text-clean-400 hover:bg-clean-500/10"
            >
              <Wallet className="h-3.5 w-3.5 mr-1" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
