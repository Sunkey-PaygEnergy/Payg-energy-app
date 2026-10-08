import React, { useState } from 'react';
import { Copy, Check, Key, Hash, HelpCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export interface KeypadTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  token?: string;
  tokenCount?: number;
  deviceModel?: string;
}

export const KeypadTokenModal: React.FC<KeypadTokenModalProps> = ({
  isOpen,
  onClose,
  token = '842-195-731',
  tokenCount = 3,
  deviceModel = 'Sinoware SunHome-Base 100',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(token.replace(/-/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Offline Keypad Unlock Code">
      <div className="space-y-5 text-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-solar-400">
            OpenPAYGO Standard Token #{tokenCount}
          </span>
          <p className="text-xs text-slate-400 mt-0.5">Compatible with {deviceModel}</p>
        </div>

        {/* Large Numeric Display */}
        <div className="bg-slate-950 p-6 rounded-2xl border-2 border-clean-500/40 shadow-inner flex flex-col items-center justify-center glow-clean">
          <span className="text-xs font-semibold text-slate-400 mb-2">
            Enter this code on your solar box keypad:
          </span>
          <div className="text-3xl sm:text-4xl font-mono font-extrabold text-white tracking-widest selection:bg-clean-500">
            {token}
          </div>
          <span className="text-xs font-bold text-clean-400 mt-2 flex items-center gap-1">
            Followed by <Hash className="h-3 w-3 inline" /> or ✓ key
          </span>
        </div>

        {/* Copy Button */}
        <Button
          variant="outline"
          size="md"
          onClick={handleCopy}
          className="w-full border-slate-700 hover:border-slate-500"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-clean-400" />
              Copied to Clipboard!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2 text-slate-400" />
              Copy 9-Digit Code
            </>
          )}
        </Button>

        {/* Keypad Instructions Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <HelpCircle className="h-4 w-4 text-solar-400" />
            <span>How to unlock your device:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] pl-1">
            <li>Wake up the keypad on your solar home system.</li>
            <li>Type the 9 digits sequentially without dashes.</li>
            <li>Press the hash (#) or checkmark button to submit.</li>
            <li>
              A green LED flash or double beep confirms the relay is unlocked and power is active.
            </li>
          </ol>
        </div>

        <Button variant="primary" size="lg" onClick={onClose} className="w-full">
          Done
        </Button>
      </div>
    </Modal>
  );
};
