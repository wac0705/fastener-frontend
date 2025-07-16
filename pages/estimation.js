import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Estimation() {
  const router = useRouter();
  const [inquiryID, setInquiryID] = useState('');
  const [materials, setMaterials] = useState('[{"code":"M8碳鋼","cost":0.5}]');
  const [processes, setProcesses] = useState('[{"name":"鍍鋅","cost":0.2}]');
  const [logistics, setLogistics] = useState('[{"type":"海運","cost":0.1}]');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'sales') {
      router.push('/login');
    }
  }, []);

  const submitEstimation = async () => {
    try {
      const res = await fetch('https://fastener-api.zeabur.app/api/estimations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          inquiry_id: parseInt(inquiryID),
          materials: JSON.parse(materials),
          processes: JSON.parse(processes),
          logistics: JSON.parse(logistics),
          ai_suggestions: 0 // 後端會自動補
        })
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || '估價失敗');
      }
    } catch (err) {
      setError('格式錯誤或伺服器錯誤');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">📐 報價試算</h1>

        <label className="block mb-2">詢價單 ID</label>
        <input className="border p-2 w-full mb-4" value={inquiryID} onChange={e => setInquiryID(e.target.value)} />

        <label className="block mb-2">材料 (JSON 格式)</label>
        <textarea className="border p-2 w-full mb-4" rows="3" value={materials} onChange={e => setMaterials(e.target.value)} />

        <label className="block mb-2">製程 (JSON 格式)</label>
        <textarea className="border p-2 w-full mb-4" rows="3" value={processes} onChange={e => setProcesses(e.target.value)} />

        <label className="block mb-2">物流 (JSON 格式)</label>
        <textarea className="border p-2 w-full mb-4" rows="3" value={logistics} onChange={e => setLogistics(e.target.value)} />

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={submitEstimation}>
          送出估價
        </button>

        {result && (
          <div className="mt-6 p-4 bg-green-100 rounded">
            <p>AI 建議值：{result.ai_suggestions}</p>
            <p>總成本：<strong>{result.total_cost}</strong></p>
          </div>
        )}

        {error && (
          <p className="mt-4 text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
