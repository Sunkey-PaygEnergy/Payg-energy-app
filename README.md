# Sunkey PaygEnergy — Progressive Web Application & Fleets Console

[![Stellar](https://img.shields.io/badge/Stellar-Soroban_v22-blue.svg)](https://stellar.org)
[![Next.js](https://img.shields.io/badge/Next.js-15_App_Router-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/Tests-Vitest_Passing-brightgreen.svg)](https://vitest.dev)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Sunkey PaygEnergy** is a pay-as-you-go (PAYG) solar and clean energy micro-utility platform built natively on **Stellar & Soroban**. 
> Operators sell solar home systems on credit. Customers pay a deposit followed by micro-top-ups. Each payment unlocks days of energy access; when access expires the hardware locks, and when cumulative repayments reach the total cash price the customer permanently owns the hardware and it unlocks forever. 
> All state is immutably anchored on Stellar so operators, customers, and financiers share one verifiable, auditable ledger.

---

## Ecosystem Repositories

| Repository | Stack | Description | Status |
| :--- | :--- | :--- | :--- |
| [**Payg-energy-contracts**](https://github.com/Sunkey-PaygEnergy/Payg-energy-contracts) | Rust, `soroban-sdk` 22.0.8 | Core smart contracts: leases, plans, payments, grace, repossession, financier pools, device swaps | **Completed (37 Commits)** |
| [**Payg-device-bridge**](https://github.com/Sunkey-PaygEnergy/Payg-device-bridge) | Fastify, TypeScript, Redis, Postgres | OpenPAYGO 9-digit HMAC token derivation, IoT MQTT/HTTP sync, Mobile Money webhook adapters, Soroban event indexer | **Completed (37 Commits)** |
| [**Payg-energy-app**](https://github.com/Sunkey-PaygEnergy/Payg-energy-app) (This Repo) | Next.js 15, React 19, Tailwind CSS | Customer Mobile PWA, Operator Fleet Console, Institutional Financier Portal & Stellar Audit Explorer | **Completed (37 Commits)** |

---

## Application Roles & Feature Matrix

The web application unites the three critical stakeholders of decentralized clean energy microfinance:

```
                                    ┌────────────────────────┐
                                    │    Stellar Network     │
                                    │   Soroban Smart State  │
                                    └───────────┬────────────┘
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 │                              │                              │
                 ▼                              ▼                              ▼
      ┌────────────────────┐         ┌────────────────────┐         ┌────────────────────┐
      │   Customer PWA     │         │   Operator Console │         │  Financier Portal  │
      ├────────────────────┤         ├────────────────────┤         ├────────────────────┤
      │ • Energy Countdown │         │ • Fleet Dashboard  │         │ • Syndicated Pools │
      │ • Path to Ownership│         │ • Device Onboarding│         │ • APY Calculator   │
      │ • 9-Digit Keypad   │         │ • Tariff Plans     │         │ • Capital Deposit  │
      │ • Solar Telemetry  │         │ • Lease Origination│         │ • Yield Claims     │
      │ • M-Pesa / Crypto  │         │ • Device Warranty  │         │ • Verified Carbon  │
      │ • 48h Grace Buffer │         │ • Guarded Repossess│         │ • Impact Metrics   │
      │ • Share Payment    │         │ • Overdue Risk PAR │         │ • Senior Tranches  │
      │ • Verified Receipt │         │ • Amortization     │         │ • CSV Audit Export │
      └────────────────────┘         └────────────────────┘         └────────────────────┘
```

### 1. Customer Mobile PWA (`role=customer`)
- **Real-Time Energy Countdown**: Live countdown timer showing days, hours, and minutes of remaining power access, with real-time status badge (`Active & Energized`, `Locked (Top-up Required)`, `100% Owned`).
- **Path to Ownership Gauge**: Dual-tier progress bar showing cumulative principal repaid vs. cash price threshold with payoff percentage and remaining balance.
- **OpenPAYGO 9-Digit Token Modal**: Compatible with the EnAccess Foundation / Solaris Offgrid specification. Displays offline numeric activation tokens (`XXX-XXX-XXX#`) for certified hardware units.
- **Solar Telemetry Widget**: Live battery voltage, solar panel input, load consumption, daily Wh generated, and anti-tamper sensor indicators.
- **Flexible Top-Up Modal**: Duration slider (1 to 90 days) with instant fiat/USDC conversion and multi-rail routing.
- **On-Chain Stellar Payments**: Direct wallet signing with Freighter / Stellar Wallets Kit.
- **Mobile Money Payment Sheet**: Simulated USSD push prompt for Safaricom M-Pesa, MTN Mobile Money, and Airtel Money.
- **Shareable Payment Link**: Generates sponsor payment links with QR codes and WhatsApp share triggers for relatives or remote benefactors.
- **Emergency Access & Hardship Pause**: One-click 48-hour emergency grace buffer and seasonal agricultural travel pause.
- **Official Payment Receipt**: Printable and SMS verifiable digital receipts with Stellar transaction hash links.

### 2. Operator Fleet Management Console (`role=operator`)
- **Fleet Summary KPI Cards**: Total deployed assets, energized online rate (%), cumulative repayments, monthly recurring revenue, and carbon offset.
- **Interactive Fleet Device Table**: Searchable, filterable table by hardware model, connection protocol, access status, customer phone, and capital progress.
- **Hardware Asset Onboarding**: Register new solar units with OpenPAYGO 128-bit secret keys or IoT 4G telemetry settings.
- **Tariff Plan Manager**: Create and archive lease plans (upfront deposit, daily tariff rate, total cash buyout price).
- **Lease Origination**: Single form origination and bulk batch CSV importation with Stellar public key validation.
- **Hardware Warranty Swap**: Rebind existing lease credit, tokens, and payment history to replacement hardware serials.
- **Guarded Repossession Workflow**: Consumer-protection compliance checklist, 14-day statutory notice certification, and administrative holds.
- **Goodwill Credit Grants**: Authorize promotional clean energy days for community campaigns or maintenance compensation.
- **Overdue Risk Monitor (PAR-30)**: Aging bucket breakdown (`1-7d`, `8-14d`, `15-30d`, `>30d`) with one-click SMS reminders and field escalation.
- **Cashflow Forecasting & Cohort Amortization**: Repayment curves, unit economics (ARPU, payoff velocity), and collection rate comparisons.

### 3. Institutional Financier & ESG Portal (`role=financier`)
- **Syndicated Debt Facilities**: Senior secured clean energy liquidity pools.
- **Fixed Yield & Climate Calculator**: Interactive slider to model investment commitments ($1k to $100k), tenor horizons (6 to 36 mo), projected APY, and avoided CO2 tonnage.
- **Liquidity Deposit & Coupon Claims**: Freighter-signed pool funding and accrued earnings withdrawals on Soroban.

### 4. Immutable Stellar Audit Trail (`role=audit`)
- **Cryptographic Event Log**: Real-time ledger records for all smart contract events (`PaymentProcessed`, `DepositMade`, `GraceGranted`, `DeviceSwapped`, `LeaseGraduatedOwned`, `PoolYieldClaimed`).
- **CSV Data Exporter**: Instant download of auditable transactions for third-party auditors and tax authorities.

---

## Certified Hardware Compatibility

The frontend and bridge interfaces support certified off-grid solar equipment adhering to the **OpenPAYGO Token & Metrics Specification**:
- **Sinoware SunHome-Base 100** (50W Solar, 12V LiFePO4, 4G IoT / Keypad)
- **Victron SHS200 Smart** (200W MPPT Solar Home System, Bluetooth / Keypad)
- **Bboxx Flexx40 Keypad** (40Wh Entry Off-Grid Kit)
- **Bluetti Solar P150** (150W Portable Solar Generator)
- **Lorentz S1-200** (Solar Submersible Irrigation Pump)
- **IONA Home Max 300** (Clean Cookstove + Solar Hub)

---

## Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router), React 19
- **Language**: TypeScript 5.7 (Strict Mode)
- **Styling**: Tailwind CSS 3.4, Vanilla CSS Design System, Glassmorphism & Clean-Energy Tokens
- **Icons**: Lucide React
- **Blockchain SDKs**: `@stellar/stellar-sdk` v13, `@stellar/freighter-api` v3
- **Test Suite**: Vitest v3 with Node test environment
- **Deployment**: Multi-stage Dockerfile with Next.js Standalone runner

---

## Getting Started

### Prerequisites
- Node.js `>= 20.x`
- npm `>= 10.x`
- Docker (optional, for containerized run)
- Freighter Wallet browser extension (for testnet transactions)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Sunkey-PaygEnergy/Payg-energy-app.git
cd Payg-energy-app
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and configure your Stellar RPC endpoints and contract addresses:
```bash
cp .env.example .env.local
```

```ini
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_STELLAR_RPC_URL="https://soroban-testnet.stellar.org"
NEXT_PUBLIC_STELLAR_HORIZON_URL="https://horizon-testnet.stellar.org"
NEXT_PUBLIC_CONTRACT_ID="CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM"
NEXT_PUBLIC_USDC_TOKEN_ADDRESS="CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
NEXT_PUBLIC_BRIDGE_API_URL="http://localhost:3001"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Test Suite
```bash
npm test
```

### 5. Production Build & Typecheck
```bash
npm run typecheck
npm run build
npm start
```

---

## Docker Deployment

Build and run the optimized standalone container:

```bash
# Build production image
docker build -t sunkey-payg-app:latest .

# Run container
docker run -p 3000:3000 --env-file .env.local sunkey-payg-app:latest
```

---

## OpenPAYGO Compliance

The keypad token display implements the standard 9-digit format:
```
[ 3 digits ] - [ 3 digits ] - [ 3 digits ] #
Example: 842-195-731#
```
- Derived via HMAC-SHA256 truncated hash using the device's shared 128-bit secret key.
- Verified off-chain by the solar system's microcontroller without requiring cellular or internet connection.
- Keypad tokens can be generated by operators, customers, relatives, or via SMS gateway integrations.

---

## Security & Auditing

- **Immutable On-Chain State**: All payments and lease status transitions are signed and stored on the Stellar ledger.
- **KMS / Secure Enclave**: OpenPAYGO shared secrets are never exposed on client browsers and are isolated in backend HSM/KMS providers.
- **Idempotent Webhooks**: Double-spend prevention and replay protection on mobile money bridges.
- **Strict Headers**: Content Security Policy, HSTS, frame denial, and MIME sniffing protection configured out of the box.

---

## License

MIT © 2026 Sunkey PaygEnergy Contributors. Built with Soroban and Stellar for off-grid electrification worldwide.
