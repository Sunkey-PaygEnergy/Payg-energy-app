'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CustomerShell } from '@/components/customer/CustomerShell';
import { EnergyCountdownCard } from '@/components/customer/EnergyCountdownCard';
import { OwnershipProgressBar } from '@/components/customer/OwnershipProgressBar';
import { SolarTelemetryWidget } from '@/components/customer/SolarTelemetryWidget';
import { KeypadTokenModal } from '@/components/customer/KeypadTokenModal';
import { TopUpModal } from '@/components/customer/TopUpModal';
import { MobileMoneySheet } from '@/components/customer/MobileMoneySheet';
import { SharePaymentLinkModal } from '@/components/customer/SharePaymentLinkModal';
import { EmergencyPauseModal } from '@/components/customer/EmergencyPauseModal';
import { PaymentReceiptModal, PaymentReceipt } from '@/components/customer/PaymentReceiptModal';

import { OperatorDashboard } from '@/components/operator/OperatorDashboard';
import { OnboardDeviceModal } from '@/components/operator/OnboardDeviceModal';
import { CreateLeaseModal } from '@/components/operator/CreateLeaseModal';
import { PlanManagerModal } from '@/components/operator/PlanManagerModal';
import { DeviceSwapModal } from '@/components/operator/DeviceSwapModal';
import { RepossessModal } from '@/components/operator/RepossessModal';
import { GrantCreditModal } from '@/components/operator/GrantCreditModal';

import { FinancierDashboard, LiquidityPool } from '@/components/financier/FinancierDashboard';
import { FundClaimModal } from '@/components/financier/FundClaimModal';
import { AuditTrailView } from '@/components/financier/AuditTrailView';

import { Lease, AccessStatus, UserRole } from '@/types';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Customer State
  const [lease, setLease] = useState<Lease>({
    id: 'LSE-001',
    deviceId: 'DEV-SH100-8812',
    operator: 'GBV76O4Q4VSC5YUSW23V6B3H6V32D4W6U6M3SKOL',
    customer: 'GA6M6Q3H62FSLG4YUSW23V6B3H6V32D4W6U6M3',
    customerPhone: '+254 712 345 678',
    planId: 'plan_standard_50w',
    status: 'Active',
    totalPaid: '145.00',
    paidUntil: Math.floor(Date.now() / 1000) + 86400 * 18,
    depositPaid: true,
    device: {
      deviceId: 'DEV-SH100-8812',
      operatorAddress: 'GBV76O4Q4VSC5YUSW23V6B3H6V32D4W6U6M3SKOL',
      deviceModel: 'Sinoware SunHome-Base 100',
      hardwareType: 'iot_connected',
      tokenCount: 4,
      firmwareVersion: 'v2.4.1-clean',
      lastSyncStatus: 'unlocked',
    },
  });

  const accessStatus: AccessStatus = {
    isActive: lease.paidUntil > Math.floor(Date.now() / 1000),
    paidUntil: lease.paidUntil,
    isOwned: lease.status === 'Owned',
    isSuspended: lease.status === 'Suspended',
    secondsRemaining: Math.max(0, lease.paidUntil - Math.floor(Date.now() / 1000)),
    daysRemaining: Math.max(0, Math.ceil((lease.paidUntil - Math.floor(Date.now() / 1000)) / 86400)),
  };

  // Customer Modals
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isMobileMoneyOpen, setIsMobileMoneyOpen] = useState(false);
  const [isShareLinkOpen, setIsShareLinkOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<PaymentReceipt | null>(null);

  // Operator Modals
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);
  const [isCreateLeaseOpen, setIsCreateLeaseOpen] = useState(false);
  const [isPlanManagerOpen, setIsPlanManagerOpen] = useState(false);
  const [isDeviceSwapOpen, setIsDeviceSwapOpen] = useState(false);
  const [isRepossessOpen, setIsRepossessOpen] = useState(false);
  const [isGrantCreditOpen, setIsGrantCreditOpen] = useState(false);

  // Financier Modals
  const [selectedPool, setSelectedPool] = useState<LiquidityPool | null>(null);
  const [fundClaimMode, setFundClaimMode] = useState<'fund' | 'claim'>('fund');
  const [isFundClaimOpen, setIsFundClaimOpen] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsRefreshing(false);
  };

  // Payment triggers
  const handleProceedStellar = (days: number, tokenAmount: string) => {
    setIsTopUpOpen(false);
    // Simulate successful payment receipt
    const receipt: PaymentReceipt = {
      receiptId: 'RCP-2026-XLM' + Math.floor(1000 + Math.random() * 9000),
      txHash: '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join(''),
      amount: (Number(tokenAmount) / 10_000_000).toFixed(2),
      currency: 'USDC',
      daysPurchased: days,
      paidAt: new Date().toLocaleString(),
      newPaidUntil: new Date((lease.paidUntil + days * 86400) * 1000).toLocaleDateString(),
      openpaygoToken: '842 195 731',
      totalPaidSoFar: (parseFloat(lease.totalPaid) + Number(tokenAmount) / 10_000_000).toFixed(2),
      totalCashPrice: '250.00',
    };
    setLastReceipt(receipt);
    setLease((prev) => ({
      ...prev,
      paidUntil: prev.paidUntil + days * 86400,
      totalPaid: (parseFloat(prev.totalPaid) + Number(tokenAmount) / 10_000_000).toFixed(2),
    }));
    setIsReceiptOpen(true);
  };

  const handleProceedMobileMoney = () => {
    setIsTopUpOpen(false);
    setIsMobileMoneyOpen(true);
  };

  const handleProceedShareLink = () => {
    setIsTopUpOpen(false);
    setIsShareLinkOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-solar-500/30">
      {/* Top Navigation */}
      <Navbar currentRole={currentRole} onRoleChange={(role) => setCurrentRole(role)} />

      {/* Main Role Content */}
      <div className="flex-1">
        {currentRole === 'customer' && (
          <CustomerShell
            lease={lease}
            access={accessStatus}
            onOpenTopUp={() => setIsTopUpOpen(true)}
            onOpenKeypadToken={() => setIsKeypadOpen(true)}
            onOpenEmergencyModal={() => setIsEmergencyOpen(true)}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          >
            <div className="space-y-4">
              {/* Access countdown card */}
              <EnergyCountdownCard
                access={accessStatus}
                onTopUpClick={() => setIsTopUpOpen(true)}
              />

              {/* Ownership payoff progress */}
              <OwnershipProgressBar
                totalPaidUnits={(parseFloat(lease.totalPaid) * 10_000_000).toString()}
                totalCashPriceUnits={(250 * 10_000_000).toString()}
                depositPaid={lease.depositPaid}
                isOwned={lease.status === 'Owned'}
              />

              {/* Real-time Solar Telemetry */}
              <SolarTelemetryWidget />
            </div>
          </CustomerShell>
        )}

        {currentRole === 'operator' && (
          <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <OperatorDashboard
              operatorAddress={lease.operator}
              onOpenOnboardModal={() => setIsOnboardOpen(true)}
              onOpenCreateLeaseModal={() => setIsCreateLeaseOpen(true)}
              onOpenPlanManagerModal={() => setIsPlanManagerOpen(true)}
            />
          </main>
        )}

        {currentRole === 'financier' && (
          <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <FinancierDashboard
              financierAddress="GBV76O4Q4VSC5YUSW23V6B3H6V32D4W6U6M3SKOL"
              onOpenFundModal={(pool) => {
                setSelectedPool(pool);
                setFundClaimMode('fund');
                setIsFundClaimOpen(true);
              }}
              onOpenClaimModal={(pool) => {
                setSelectedPool(pool);
                setFundClaimMode('claim');
                setIsFundClaimOpen(true);
              }}
            />
          </main>
        )}

        {currentRole === 'audit' && (
          <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <AuditTrailView />
          </main>
        )}
      </div>

      {/* Customer Modals */}
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        leaseId={lease.id}
        dailyRateUnits="8500000"
        onProceedStellar={handleProceedStellar}
        onProceedMobileMoney={handleProceedMobileMoney}
        onProceedShareLink={handleProceedShareLink}
      />

      <KeypadTokenModal
        isOpen={isKeypadOpen}
        onClose={() => setIsKeypadOpen(false)}
        token="842-195-731"
        tokenCount={4}
        deviceModel={lease.device?.deviceModel}
      />

      <EmergencyPauseModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        lease={lease}
        onGraceGranted={(newPaidUntil) => {
          setLease((prev) => ({ ...prev, paidUntil: newPaidUntil }));
        }}
      />

      <MobileMoneySheet
        isOpen={isMobileMoneyOpen}
        onClose={() => setIsMobileMoneyOpen(false)}
        leaseId={lease.id}
        fiatAmount={980}
        currency="KES"
        days={7}
        onPaymentSuccess={() => {
          setIsMobileMoneyOpen(false);
          const ref = 'MPESA-TX-' + Math.floor(100000 + Math.random() * 900000);
          const receipt: PaymentReceipt = {
            receiptId: ref,
            txHash: '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join(''),
            amount: '5.95',
            currency: 'USDC',
            daysPurchased: 7,
            paidAt: new Date().toLocaleString(),
            newPaidUntil: new Date((lease.paidUntil + 7 * 86400) * 1000).toLocaleDateString(),
            openpaygoToken: '391 002 918',
            totalPaidSoFar: (parseFloat(lease.totalPaid) + 5.95).toFixed(2),
            totalCashPrice: '250.00',
          };
          setLastReceipt(receipt);
          setLease((prev) => ({
            ...prev,
            paidUntil: prev.paidUntil + 7 * 86400,
            totalPaid: (parseFloat(prev.totalPaid) + 5.95).toFixed(2),
          }));
          setIsReceiptOpen(true);
        }}
      />

      <SharePaymentLinkModal
        isOpen={isShareLinkOpen}
        onClose={() => setIsShareLinkOpen(false)}
        leaseId={lease.id}
        days={7}
        tokenAmount="59500000"
      />

      {lastReceipt && (
        <PaymentReceiptModal
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          lease={lease}
          receipt={lastReceipt}
        />
      )}

      {/* Operator Modals */}
      <OnboardDeviceModal
        isOpen={isOnboardOpen}
        onClose={() => setIsOnboardOpen(false)}
        operatorAddress={lease.operator}
      />

      <CreateLeaseModal
        isOpen={isCreateLeaseOpen}
        onClose={() => setIsCreateLeaseOpen(false)}
        operatorAddress={lease.operator}
      />

      <PlanManagerModal
        isOpen={isPlanManagerOpen}
        onClose={() => setIsPlanManagerOpen(false)}
        operatorAddress={lease.operator}
      />

      <DeviceSwapModal
        isOpen={isDeviceSwapOpen}
        onClose={() => setIsDeviceSwapOpen(false)}
        lease={lease}
        onSwapComplete={(newId) => {
          setLease((prev) => ({ ...prev, deviceId: newId }));
        }}
      />

      <RepossessModal
        isOpen={isRepossessOpen}
        onClose={() => setIsRepossessOpen(false)}
        lease={lease}
      />

      <GrantCreditModal
        isOpen={isGrantCreditOpen}
        onClose={() => setIsGrantCreditOpen(false)}
        lease={lease}
        onCreditGranted={(newPaid) => {
          setLease((prev) => ({ ...prev, paidUntil: newPaid }));
        }}
      />

      {/* Financier Modals */}
      <FundClaimModal
        isOpen={isFundClaimOpen}
        onClose={() => setIsFundClaimOpen(false)}
        pool={selectedPool}
        mode={fundClaimMode}
        financierAddress={lease.operator}
      />
    </div>
  );
}
