import { useState } from 'react';

export default function Home() {
  const [inquiry, setInquiry] = useState({ id: 1, materials: [], processes: [], logistics: [] });
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    const res = await fetch('https://fastener-api.zeabur.app/api/estimations', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(inquiry) });
    setResult(await res.json());
  };

  return (
    <div>
      <h1>緊固件詢報價系統</h1>
      <button onClick={handleSubmit}>計算估價</button>
      {result && <p>總成本: {result.total_cost}, AI建議: {result.ai_suggestions}</p>}
    </div>
  );
}
