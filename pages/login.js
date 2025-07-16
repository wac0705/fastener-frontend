import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch('https://fastener-api.zeabur.app/api/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      router.push('/dashboard'); // 跳到儀表板
    } else {
      setError('登入失敗');
    }
  };

  return (
    <div>
      <h1>登入</h1>
      <input type="text" placeholder="用戶名" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="密碼" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>登入</button>
      {error && <p>{error}</p>}
    </div>
  );
}
