'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function BuyerView() {
  const params = useParams();
  const id = params.id;
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string|null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/buyers/'+id).then(r=>r.json()).then(setData);
  },[id]);

  if (!data) return <div>Loading...</div>;

  async function save(e:any) {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/buyers/'+id, { method: 'PUT', headers: {'content-type':'application/json'}, body: JSON.stringify(data) });
    if (res.ok) {
      router.push('/buyers');
    } else {
      setError(await res.text());
    }
  }

  return (
    <div>
      <h1>Lead: {data.fullName}</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={save}>
        <div><label>Full name: <input required value={data.fullName||''} onChange={e=>setData({...data, fullName: e.target.value})} /></label></div>
        <div><label>Email: <input value={data.email||''} onChange={e=>setData({...data, email: e.target.value})} /></label></div>
        <div><label>Phone: <input required value={data.phone||''} onChange={e=>setData({...data, phone: e.target.value})} /></label></div>
        <div><label>Notes: <textarea value={data.notes||''} onChange={e=>setData({...data, notes: e.target.value})} /></label></div>
        <div><button type="submit">Save</button></div>
      </form>
    </div>
  );
}
