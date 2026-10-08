import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Sunkey <span className="text-clean-400">PaygEnergy</span>
        </h1>
        <p className="mt-3 text-slate-400 text-sm">
          Decentralized Pay-As-You-Go Solar Platform on Stellar Soroban
        </p>
      </div>
    </main>
  );
}
