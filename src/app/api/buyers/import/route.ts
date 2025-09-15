import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buyerSchema } from '@/lib/validators';
import { parse } from 'csv-parse/sync';

export const runtime = 'edge';

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get('file') as any;
  if (!file) return new NextResponse('no file', { status: 400 });
  const text = await file.text();
  const records = parse(text, { columns: true, skip_empty_lines: true });
  if (records.length > 200) return new NextResponse('too many rows', { status: 400 });
  const errors: any[] = [];
  const valids: any[] = [];
  for (let i=0;i<records.length;i++){
    const row = records[i];
    try {
      // map row headers to expected shape
      const payload = {
        fullName: row.fullName,
        email: row.email,
        phone: row.phone,
        city: row.city,
        propertyType: row.propertyType,
        bhk: row.bhk,
        purpose: row.purpose,
        budgetMin: row.budgetMin,
        budgetMax: row.budgetMax,
        timeline: row.timeline,
        source: row.source,
        notes: row.notes,
        tags: row.tags
      };
      const parsed = buyerSchema.parse(payload);
      valids.push(parsed);
    } catch (err:any) {
      errors.push({ row: i+1, message: err.message || String(err) });
    }
  }

  // insert valid rows in a transaction
  const ownerId = 'demo-user';
  let inserted = 0;
  if (valids.length>0) {
    await prisma.$transaction(async (tx)=>{
      for (const v of valids) {
        await tx.buyer.create({ data: {
          fullName: v.fullName, email: v.email, phone: v.phone,
          city: v.city as any, propertyType: v.propertyType as any,
          bhk: v.bhk ? (v.bhk==='Studio'?'STUDIO':v.bhk==='1'?'ONE':v.bhk==='2'?'TWO':v.bhk==='3'?'THREE':'FOUR') : undefined,
          purpose: v.purpose as any, budgetMin: v.budgetMin, budgetMax: v.budgetMax,
          timeline: v.timeline === '0-3m' ? 'ZeroTo3m' : v.timeline==='3-6m' ? 'ThreeTo6m' : v.timeline=='>6m' ? 'MoreThan6m' : 'Exploring',
          source: v.source === 'Walk-in' ? 'Walkin' : v.source as any,
          notes: v.notes, tags: v.tags || [], ownerId
        }});
        inserted++;
      }
    });
  }

  return NextResponse.json({ inserted, errors });
}
