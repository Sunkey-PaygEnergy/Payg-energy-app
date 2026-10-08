import { describe, it, expect } from 'vitest';

describe('Customer Energy Access & OpenPAYGO Formatting', () => {
  it('formats 9-digit OpenPAYGO numeric tokens with hyphen separators', () => {
    const rawToken = '842195731';
    const formatted = rawToken.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
    expect(formatted).toBe('842-195-731');
  });

  it('calculates energy countdown remaining hours and days', () => {
    const nowSec = 1760000000;
    const paidUntil = nowSec + 86400 * 5 + 3600 * 12; // 5.5 days

    const secondsRemaining = paidUntil - nowSec;
    const daysRemaining = Math.ceil(secondsRemaining / 86400);

    expect(secondsRemaining).toBe(475200);
    expect(daysRemaining).toBe(6);
  });

  it('computes 48-hour emergency grace addition', () => {
    const currentPaidUntil = 1760000000;
    const graceBuffer = 48 * 3600;
    const newPaidUntil = currentPaidUntil + graceBuffer;

    expect(newPaidUntil - currentPaidUntil).toBe(172800);
  });

  it('converts micro-units (7 decimals) to standard decimal currency string', () => {
    const microUnits = '59500000';
    const standard = (Number(microUnits) / 10_000_000).toFixed(2);
    expect(standard).toBe('5.95');
  });
});
