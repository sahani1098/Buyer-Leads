import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buyerSchema } from '@/lib/validators';
import { isRateLimited } from '@/lib/ratelimit';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get('page') || '1');
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  ['city', 'propertyType', 'status', 'timeline'].forEach(k => {
    const v = url.searchParams.get(k);
    if (v) where[k] = v;
  });

  const buyers = await prisma.buyer.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    skip,
    take: pageSize
  });

  return NextResponse.json(buyers);
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  if (isRateLimited(ip)) return new NextResponse('rate_limited', { status: 429 });

  const body = await req.json();
  const parsed = buyerSchema.safeParse(body);
  if (!parsed.success) {
    return new NextResponse(JSON.stringify({ error: parsed.error.flatten() }), { status: 400 });
  }

  const data = parsed.data;
  const ownerId = 'demo-user';

  // Map BHK value
  const bhkMap: Record<string, string> = {
    'Studio': 'STUDIO',
    '1': 'ONE',
    '2': 'TWO',
    '3': 'THREE',
    '4': 'FOUR'
  };

  // Map timeline value
  const timelineMap: Record<string, string> = {
    '0-3m': 'ZeroTo3m',
    '3-6m': 'ThreeTo6m',
    '>6m': 'MoreThan6m',
    'Exploring': 'Exploring'
  };

  const created = await prisma.buyer.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      city: data.city as any,
      propertyType: data.propertyType as any,
      bhk: data.bhk ? bhkMap[data.bhk] : undefined,
      purpose: data.purpose as any,
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax,
      timeline: timelineMap[data.timeline] || 'Exploring',
      source: data.source === 'Walk-in' ? 'Walkin' : data.source as any,
      notes: data.notes,
      tags: typeof data.tags === 'string'
        ? data.tags
        : Array.isArray(data.tags)
          ? data.tags.join(',')
          : null, // ✅ convert array to comma-separated string
      ownerId
    }
  });

  await prisma.buyerHistory.create({
    data: {
      buyerId: created.id,
      changedBy: ownerId,
      diff: JSON.stringify({ created: true, fields: created }) // ✅ convert object to string
    }
  });

  return NextResponse.json(created);
}

export async function PUT(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  if (isRateLimited(ip)) return new NextResponse('rate_limited', { status: 429 });

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  if (!id) return new NextResponse('missing id', { status: 400 });

  const body = await req.json();
  const parsed = buyerSchema.safeParse(body);
  if (!parsed.success) return new NextResponse(JSON.stringify({ error: parsed.error.flatten() }), { status: 400 });

  const ownerId = 'demo-user';
  const existing = await prisma.buyer.findUnique({ where: { id } });
  if (!existing) return new NextResponse('not found', { status: 404 });
  if (existing.ownerId !== ownerId) return new NextResponse('forbidden', { status: 403 });

  const updated = await prisma.buyer.update({
    where: { id },
    data: {
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      notes: body.notes
    }
  });

  await prisma.buyerHistory.create({
    data: {
      buyerId: id,
      changedBy: ownerId,
      diff: JSON.stringify({ before: existing, after: updated }) // ✅ convert object to string
    }
  });

  return NextResponse.json(updated);
}
