import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      router.push('/login');
      return;
    }

    if (role === 'admin') {
      router.push('/manage-accounts');
    } else if (role === 'sales') {
      router.push('/dashboard');
    } else if (role === 'engineer') {
      router.push('/estimation');
    } else {
      alert('未知角色，請聯絡系統管理員');
    }
  }, []);

  return <p>導向中...</p>;
}
