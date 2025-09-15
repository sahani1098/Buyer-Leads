import { z } from 'zod';

export const buyerSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal('')).transform(v => v === '' ? undefined : v).optional(),
  phone: z.string().regex(/^\d{10,15}$/, { message: 'phone must be 10-15 digits' }),
  city: z.enum(['Chandigarh','Mohali','Zirakpur','Panchkula','Other']),
  propertyType: z.enum(['Apartment','Villa','Plot','Office','Retail']),
  bhk: z.enum(['1','2','3','4','Studio']).optional(),
  purpose: z.enum(['Buy','Rent']),
  budgetMin: z.preprocess((v) => v === '' || v === null ? undefined : Number(v), z.number().int().positive().optional()),
  budgetMax: z.preprocess((v) => v === '' || v === null ? undefined : Number(v), z.number().int().positive().optional()),
  timeline: z.enum(['0-3m','3-6m','>6m','Exploring']),
  source: z.enum(['Website','Referral','Walk-in','Call','Other']),
  notes: z.string().max(1000).optional().or(z.literal('')),
  tags: z.preprocess((v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    return String(v).split(',').map(s=>s.trim()).filter(Boolean);
  }, z.array(z.string()).optional())
}).superRefine((data, ctx) => {
  // bhk required if propertyType is Apartment or Villa
  if (['Apartment','Villa'].includes(data.propertyType)) {
    if (!data.bhk) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'bhk is required for Apartment/Villa' });
  }
  // budgets
  if (data.budgetMin !== undefined && data.budgetMax !== undefined) {
    if (data.budgetMax < data.budgetMin) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'budgetMax must be >= budgetMin' });
    }
  }
});

export type BuyerInput = z.infer<typeof buyerSchema>;
