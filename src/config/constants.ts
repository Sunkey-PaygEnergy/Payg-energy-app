export const APP_CONFIG = {
  name: 'Sunkey PaygEnergy',
  tagline: 'Pay-As-You-Go Solar and Clean Energy on Stellar',
  version: '1.0.0',

  // Stellar & Soroban Network Settings
  stellar: {
    networkPassphrase:
      process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
    rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org',
    horizonUrl:
      process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org',
    contractId:
      process.env.NEXT_PUBLIC_CONTRACT_ID || 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM',
    tokenAddress:
      process.env.NEXT_PUBLIC_USDC_TOKEN_ADDRESS || 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    tokenDecimals: 7,
  },

  // Bridge Backend API
  bridgeApiUrl: process.env.NEXT_PUBLIC_BRIDGE_API_URL || 'http://localhost:3001',

  // Currency & Rate Defaults
  currencies: {
    baseToken: 'USDC',
    supportedFiats: ['KES', 'UGX', 'TZS', 'NGN', 'USD'],
    rates: {
      KES: 130.5,
      UGX: 3720.0,
      TZS: 2650.0,
      NGN: 1580.0,
      USD: 1.0,
    },
  },

  // OpenPAYGO Keypad Specs
  openpaygo: {
    tokenLength: 9,
    tokenFormat: 'XXX-XXX-XXX',
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
