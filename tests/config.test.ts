import { describe, it, expect } from 'vitest';
import { APP_CONFIG } from '../src/config/constants';

describe('App & Stellar Configuration', () => {
  it('loads valid Stellar testnet network settings', () => {
    expect(APP_CONFIG.stellar.networkPassphrase).toContain('Test SDF Network');
    expect(APP_CONFIG.stellar.rpcUrl).toContain('soroban');
    expect(APP_CONFIG.stellar.horizonUrl).toContain('horizon');
  });

  it('configures default solar lease terms and supported currencies', () => {
    expect(APP_CONFIG.currencies.baseToken).toBe('USDC');
    expect(APP_CONFIG.currencies.supportedFiats).toContain('KES');
    expect(APP_CONFIG.currencies.supportedFiats).toContain('UGX');
  });

  it('defines valid OpenPAYGO token parameters', () => {
    expect(APP_CONFIG.openpaygo.tokenLength).toBe(9);
    expect(APP_CONFIG.openpaygo.tokenFormat).toBe('XXX-XXX-XXX');
  });
});
