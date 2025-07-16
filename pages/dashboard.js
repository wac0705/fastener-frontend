import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'sales') {
      router.push('/login');
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">🧰 業務儀表板</h1>
        <p className="mb-6 text-gray-600">歡迎使用螺絲螺帽報價系統</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl"
            onClick={() => router.push('/estimation')}
          >
            📐 建立報價單
          </button>
        </div>

        <div className="mt-10 text-right">
          <button
            className="text-sm text-red-500 underline"
            onClick={logout}
          >
            登出
          </button>
        </div>
      </div>
    </div>
  );
}
