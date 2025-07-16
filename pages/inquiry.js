import { useState } from 'react';

export default function Inquiry() {
  const [form, setForm] = useState({ materials: [], processes: [], logistics: [] });
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('https://fastener-api.zeabur.app/api/estimations', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
      body: JSON.stringify({ inquiry_id: 1, ...form })
    });
    setResult(await res.json());
  };

  return (
    <div>
      <h1>建立詢價</h1>
      {/* 加輸入欄位，如<select>選材料規格/港口 */}
      <button onClick={handleSubmit}>送出</button>
      {result && <p>總成本: {result.total_cost}</p>}
    </div>
  );
}
