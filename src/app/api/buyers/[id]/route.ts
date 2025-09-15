import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET(req: Request, { params }: any) {
  const id = params.id;
  const b = await prisma.buyer.findUnique({ where: { id }});
  if (!b) return new NextResponse('not found',{ status:404 });
  return NextResponse.json(b);
}
