'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewBuyer() {
  const [form, setForm] = useState<any>({
    city: 'Chandigarh',
    propertyType: 'Apartment',
    purpose: 'Buy',
    timeline: '0-3m',
    source: 'Website',
    tags: ''
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: any) {
    e.preventDefault();
    setError(null);
    const body = { ...form, tags: form.tags };
    const res = await fetch('/api/buyers', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      router.push('/buyers');
    } else {
      const txt = await res.text();
      setError(txt);
    }
  }

  return (
    <div>
      <h1>New Lead</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={submit}>
        <div>
          <label>
            Full name: <input required value={form.fullName || ''} onChange={e => setForm({ ...form, fullName: e.target.value })} />
          </label>
        </div>
        <div>
          <label>
            Email: <input value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
          </label>
        </div>
        <div>
          <label>
            Phone: <input required value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </label>
        </div>
        <div>
          <label>
            City:
            <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}>
              <option>Chandigarh</option>
              <option>Mohali</option>
              <option>Zirakpur</option>
              <option>Panchkula</option>
              <option>Other</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Property:
            <select value={form.propertyType} onChange={e => setForm({ ...form, propertyType: e.target.value })}>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Plot</option>
              <option>Office</option>
              <option>Retail</option>
            </select>
          </label>
        </div>
        {['Apartment', 'Villa'].includes(form.propertyType) && (
          <div>
            <label>
              BHK:
              <select value={form.bhk || '1'} onChange={e => setForm({ ...form, bhk: e.target.value })}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="Studio">Studio</option>
              </select>
            </label>
          </div>
        )}
        <div>
          <label>
            Purpose:
            <select value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })}>
              <option>Buy</option>
              <option>Rent</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Budget Min: <input value={form.budgetMin || ''} onChange={e => setForm({ ...form, budgetMin: e.target.value })} />
          </label>
        </div>
        <div>
          <label>
            Budget Max: <input value={form.budgetMax || ''} onChange={e => setForm({ ...form, budgetMax: e.target.value })} />
          </label>
        </div>
        <div>
          <label>
            Timeline:
            <select value={form.timeline} onChange={e => setForm({ ...form, timeline: e.target.value })}>
              <option>0-3m</option>
              <option>3-6m</option>
              <option>{">6m"}</option>
              <option>Exploring</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Source:
            <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
              <option>Website</option>
              <option>Referral</option>
              <option>Walk-in</option>
              <option>Call</option>
              <option>Other</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Tags (comma): <input value={form.tags || ''} onChange={e => setForm({ ...form, tags: e.target.value })} />
          </label>
        </div>
        <div>
          <label>
            Notes: <textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </label>
        </div>
        <div>
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  );
}
