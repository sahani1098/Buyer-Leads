import { describe, it, expect } from 'vitest';
import { buyerSchema } from '@/lib/validators';

describe('buyerSchema', () => {
  it('rejects budgetMax < budgetMin', () => {
    const res = buyerSchema.safeParse({ fullName:'Ab', phone:'1234567890', city:'Chandigarh', propertyType:'Apartment', bhk:'1', purpose:'Buy', timeline:'0-3m', source:'Website', budgetMin:1000000, budgetMax:500000 });
    expect(res.success).toBe(false);
  });

  it('accepts valid minimal input', () => {
    const res = buyerSchema.safeParse({ fullName:'John Doe', phone:'9876543210', city:'Mohali', propertyType:'Plot', purpose:'Buy', timeline:'Exploring', source:'Referral' });
    expect(res.success).toBe(true);
  });
});
