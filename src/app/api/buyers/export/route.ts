import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET(req: Request) {
  const url = new URL(req.url);
  const where: any = {};
  ['city','propertyType','status','timeline'].forEach(k=>{
    const v = url.searchParams.get(k);
    if (v) where[k] = v;
  });
  const buyers = await prisma.buyer.findMany({ where, orderBy: { updatedAt: 'desc' }});
  const header = ['fullName','email','phone','city','propertyType','bhk','purpose','budgetMin','budgetMax','timeline','source','notes','tags','status'];
  const rows = buyers.map(b=>[
    b.fullName, b.email||'', b.phone, b.city, b.propertyType, b.bhk||'', b.purpose, b.budgetMin||'', b.budgetMax||'', b.timeline, b.source, (b.notes||'').replace(/\n/g,' '), (b.tags||[]).join(','), b.status
  ].map(v=>String(v).replace(/"/g,'""')));
  const csv = [header.join(','), ...rows.map(r=> '"' + r.join('","') + '"')].join('\n');
  return new NextResponse(csv, { headers: { 'content-type':'text/csv', 'content-disposition':'attachment; filename=buyers.csv' }});
}
