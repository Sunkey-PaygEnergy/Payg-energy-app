'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, MessageSquare, QrCode } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export interface SharePaymentLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaseId: string;
  days: number;
  tokenAmount: string;
}

export const SharePaymentLinkModal: React.FC<SharePaymentLinkModalProps> = ({
  isOpen,
  onClose,
  leaseId,
  days,
  tokenAmount,
}) => {
  const [copied, setCopied] = useState(false);
  const usdValue = (Number(tokenAmount) / 10_000_000).toFixed(2);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/pay?leaseId=${leaseId}&days=${days}&amount=${usdValue}`
    : `https://sunkey.energy/pay?leaseId=${leaseId}&days=${days}&amount=${usdValue}`;

  const messageText = `Hi! Could you help top-up our solar power? It's $${usdValue} USDC for ${days} days of energy access on Sunkey PaygEnergy. Pay link: ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(messageText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleSms = () => {
    const encoded = encodeURIComponent(messageText);
    window.open(`sms:?body=${encoded}`, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ask a Relative or Sponsor">
      <div className="space-y-5 text-center">
        <p className="text-xs text-slate-300">
          Share this link with a family member or sponsor so they can directly pay for your clean solar energy access.
        </p>

        {/* QR Code Graphic Emulation */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
          <div className="h-32 w-32 bg-white rounded-xl p-2 flex items-center justify-center shadow-lg">
            <QrCode className="h-28 w-28 text-slate-950" />
          </div>
          <span className="text-[11px] font-mono text-clean-400 mt-2 font-semibold">
            Lease #{leaseId} • {days} Days (${usdValue})
          </span>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={handleWhatsApp}
            className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
          >
            <MessageSquare className="h-4 w-4 mr-1.5" />
            WhatsApp
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleSms}
            className="border-blue-500/40 text-blue-300 hover:bg-blue-500/10"
          >
            <Share2 className="h-4 w-4 mr-1.5" />
            SMS Text
          </Button>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 pl-3">
          <span className="text-xs text-slate-400 font-mono truncate flex-1 text-left">
            {shareUrl}
          </span>
          <Button variant="outline" size="sm" onClick={handleCopy} className="shrink-0">
            {copied ? <Check className="h-3.5 w-3.5 text-clean-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>

        <Button variant="ghost" size="sm" onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </Modal>
  );
};
