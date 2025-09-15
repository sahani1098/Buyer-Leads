'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function ImportPage(){
  const [file, setFile] = useState<File|null>(null);
  const [errors, setErrors] = useState<any[]>([]);
  const router = useRouter();

  async function submit(e:any){
    e.preventDefault();
    if(!file) return alert('pick csv');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/buyers/import', { method: 'POST', body: fd });
    const body = await res.json();
    if (!res.ok) {
      setErrors(body);
    } else {
      alert('Imported '+body.inserted+' rows. Errors: '+body.errors.length);
      router.push('/buyers');
    }
  }

  return (
    <div>
      <h1>Import CSV (max 200 rows)</h1>
      <form onSubmit={submit}>
        <input type="file" accept=".csv" onChange={e=>setFile(e.target.files?.[0]||null)} />
        <div><button>Upload</button></div>
      </form>
      {errors.length>0 && <div>
        <h3>Errors</h3>
        <table border={1}><thead><tr><th>row</th><th>message</th></tr></thead>
          <tbody>{errors.map((er:any,i)=>(
            <tr key={i}><td>{er.row}</td><td>{er.message}</td></tr>
          ))}</tbody>
        </table>
      </div>}
    </div>
  );
}
