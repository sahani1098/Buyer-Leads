import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface BuyersPageProps {
  searchParams?: Record<string, string>;
}

export default async function BuyersPage({ searchParams }: BuyersPageProps) {
  // Pagination
  const page = Number(searchParams?.page || '1');
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  // Filters
  const where: Record<string, any> = {};
  if (searchParams?.city) where.city = searchParams.city;
  if (searchParams?.propertyType) where.propertyType = searchParams.propertyType;
  if (searchParams?.status) where.status = searchParams.status;

  // Fetch buyers & total count
  const [buyers, total] = await Promise.all([
    prisma.buyer.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.buyer.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <h1>Buyers</h1>
      <div style={{ marginBottom: 12 }}>
        <Link href="/buyers/new">+ New Lead</Link> |{' '}
        <a href="/api/buyers/export">Export CSV</a> |{' '}
        <Link href="/buyers/import">Import CSV</Link>
      </div>

      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>City</th>
            <th>Property</th>
            <th>Budget</th>
            <th>Timeline</th>
            <th>Status</th>
            <th>UpdatedAt</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {buyers.map((b) => (
            <tr key={b.id}>
              <td>{b.fullName}</td>
              <td>{b.phone}</td>
              <td>{b.city}</td>
              <td>{b.propertyType}</td>
              <td>
                {b.budgetMin ?? '-'} - {b.budgetMax ?? '-'}
              </td>
              <td>{b.timeline}</td>
              <td>{b.status}</td>
              <td>{new Date(b.updatedAt).toLocaleString()}</td>
              <td>
                <Link href={`/buyers/${b.id}`}>View / Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12 }}>
        Page: {page} / {totalPages}{' '}
        {page > 1 && <Link href={`/buyers?page=${page - 1}`}>Prev</Link>}{' '}
        {page < totalPages && <Link href={`/buyers?page=${page + 1}`}>Next</Link>}
      </div>
    </div>
  );
}
