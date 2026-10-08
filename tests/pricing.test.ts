import { describe, it, expect } from 'vitest';

describe('PAYG Solar Financial & Risk Calculations', () => {
  it('correctly calculates days to full asset ownership from deposit and daily rate', () => {
    const deposit = 25.0;
    const dailyRate = 0.85;
    const totalCashPrice = 250.0;

    const remainingToPay = totalCashPrice - deposit;
    const daysToOwn = Math.ceil(remainingToPay / dailyRate);

    expect(remainingToPay).toBe(225.0);
    expect(daysToOwn).toBe(265);
  });

  it('correctly calculates repayment progress percentage', () => {
    const totalPaid = 145.0;
    const totalCashPrice = 250.0;

    const progress = Math.min(100, Math.round((totalPaid / totalCashPrice) * 100));
    expect(progress).toBe(58);
  });

  it('classifies risk aging buckets accurately', () => {
    const classifyBucket = (daysOverdue: number) => {
      if (daysOverdue <= 7) return '1-7d';
      if (daysOverdue <= 14) return '8-14d';
      if (daysOverdue <= 30) return '15-30d';
      return '>30d';
    };

    expect(classifyBucket(4)).toBe('1-7d');
    expect(classifyBucket(11)).toBe('8-14d');
    expect(classifyBucket(22)).toBe('15-30d');
    expect(classifyBucket(38)).toBe('>30d');
  });

  it('calculates financier fixed APY yield on liquidity commitments', () => {
    const principal = 25000;
    const apyPercent = 11.5;
    const tenorMonths = 18;

    const annualFraction = tenorMonths / 12; // 1.5 years
    const expectedYield = principal * (apyPercent / 100) * annualFraction;

    expect(expectedYield).toBe(4312.5);
    expect(principal + expectedYield).toBe(29312.5);
  });
});
