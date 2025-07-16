import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
    setRole(localStorage.getItem('role'));
  }, []);

  if (!role) return <p>載入中...</p>;

  return (
    <div>
      <h1>{role} 儀表板</h1>
      {role === 'sales' && <button onClick={() => router.push('/inquiry')}>建立詢價</button>}
      {role === 'engineer' && <button onClick={() => router.push('/estimation')}>估價</button>}
      {role === 'logistics' && <button onClick={() => router.push('/logistics')}>物流評估</button>}
      {role === 'admin' && <p>管理所有功能</p>}
    </div>
  );
}
