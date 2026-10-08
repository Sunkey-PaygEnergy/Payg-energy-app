'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isConnected, requestAccess, signTransaction } from '@stellar/freighter-api';

export interface WalletContextType {
  publicKey: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<string | null>;
  disconnect: () => void;
  signTx: (xdr: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Restore previous session if saved
  useEffect(() => {
    const saved = localStorage.getItem('sunkey_stellar_pubkey');
    if (saved) {
      setPublicKey(saved);
    }
  }, []);

  const connect = useCallback(async (): Promise<string | null> => {
    setIsConnecting(true);
    try {
      // Check if Freighter extension is available
      const freighterAvailable = await isConnected().catch(() => false);

      if (freighterAvailable) {
        const accessObj = await requestAccess();
        if (accessObj?.address) {
          setPublicKey(accessObj.address);
          localStorage.setItem('sunkey_stellar_pubkey', accessObj.address);
          return accessObj.address;
        }
      }

      // Fallback for mobile / testing environment: generate or use demo account
      const demoAccount = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF';
      setPublicKey(demoAccount);
      localStorage.setItem('sunkey_stellar_pubkey', demoAccount);
      return demoAccount;
    } catch (err) {
      console.warn('Freighter wallet connection failed, fallback to demo account:', err);
      const demoAccount = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF';
      setPublicKey(demoAccount);
      localStorage.setItem('sunkey_stellar_pubkey', demoAccount);
      return demoAccount;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPublicKey(null);
    localStorage.removeItem('sunkey_stellar_pubkey');
  }, []);

  const signTx = useCallback(
    async (xdr: string): Promise<string> => {
      const freighterAvailable = await isConnected().catch(() => false);
      if (freighterAvailable) {
        const signed = await signTransaction(xdr, {
          networkPassphrase: 'Test SDF Network ; September 2015',
        });
        if (signed?.signedTxXdr) {
          return signed.signedTxXdr;
        }
      }
      // Demo signed fallback
      return xdr;
    },
    []
  );

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        isConnected: Boolean(publicKey),
        isConnecting,
        connect,
        disconnect,
        signTx,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
