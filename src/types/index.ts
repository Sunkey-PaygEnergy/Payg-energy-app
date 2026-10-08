export type LeaseStatus =
  | 'PendingDeposit'
  | 'Active'
  | 'Suspended'
  | 'Repossessed'
  | 'Owned';

export type HardwareType = 'iot_connected' | 'offline_keypad';

export interface Lease {
  id: string;
  deviceId: string;
  operator: string;
  customer: string;
  customerPhone?: string;
  planId: string;
  status: LeaseStatus;
  totalPaid: string;
  paidUntil: number; // unix timestamp in seconds
  depositPaid: boolean;
  poolId?: string | null;
  plan?: Plan;
  device?: Device;
}

export interface AccessStatus {
  isActive: boolean;
  paidUntil: number;
  isOwned: boolean;
  isSuspended: boolean;
  secondsRemaining: number;
  daysRemaining: number;
}

export interface Plan {
  id: string;
  operator: string;
  name: string;
  token: string;
  depositAmount: string;
  totalCashPrice: string;
  dailyRate: string;
  isActive: boolean;
}

export interface Device {
  deviceId: string;
  operatorAddress: string;
  deviceModel: string;
  hardwareType: HardwareType;
  tokenCount: number;
  firmwareVersion?: string;
  lastSyncStatus: 'locked' | 'unlocked' | 'owned';
  lastSeenAt?: string;
}

export interface Telemetry {
  deviceId: string;
  batteryVoltageMv: number;
  solarInputMv: number;
  outputCurrentMa: number;
  energyGeneratedWh: number;
  relayState: boolean;
  tamperFlag: boolean;
  recordedAt: string;
}

export interface FinancierPool {
  poolId: string;
  financier: string;
  token: string;
  totalCapital: string;
  activeCapital: string;
  totalRevenueEarned: string;
  claimedEarnings: string;
  activeLeasesCount?: number;
}

export interface PaymentReceipt {
  receiptId: string;
  leaseId: string;
  deviceId: string;
  payerAddress?: string;
  customerPhone?: string;
  amount: string;
  fiatAmount?: number;
  fiatCurrency?: string;
  stellarTxHash: string;
  newPaidUntilDate: string;
  issuedAt: string;
}

export type UserRole = 'customer' | 'operator' | 'financier' | 'audit';
