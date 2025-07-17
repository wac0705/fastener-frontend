import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ManageAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('sales');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // ✅ 檢查身份
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchAccounts();
  }, []);

  // ✅ 取得帳號列表
  const fetchAccounts = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('https://fastener-api.zeabur.app/api/manage-accounts', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setAccounts(data);
  };

  // ✅ 新增帳號
  const handleCreate = async () => {
    const token = localStorage.getItem('token');
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await fetch('https://fastener-api.zeabur.app/api/manage-accounts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          role: newRole
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage('✅ 帳號建立成功');
        setNewUsername('');
        setNewPassword('');
        setNewRole('sales');
        fetchAccounts();
      } else {
        setErrorMessage(data.error || '❌ 建立失敗');
      }
    } catch (err) {
      setErrorMessage('❌ 伺服器錯誤，請稍後再試');
    }
  };

  // ✅ 更新帳號
  const handleUpdate = async (id, role, isActive) => {
    const token = localStorage.getItem('token');
    await fetch(`https://fastener-api.zeabur.app/api/manage-accounts/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role, is_active: isActive })
    });
    fetchAccounts();
  };

  // ✅ 刪除帳號
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`https://fastener-api.zeabur.app/api/manage-accounts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchAccounts();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">帳號管理（admin）</h1>

      {/* 新增帳號區塊 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">新增帳號</h2>
        <div className="flex flex-wrap gap-2">
          <input
            className="border px-3 py-2 rounded w-48"
            placeholder="帳號"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <input
            className="border px-3 py-2 rounded w-48"
            placeholder="密碼"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="sales">sales</option>
            <option value="engineer">engineer</option>
            <option value="logistics">logistics</option>
            <option value="admin">admin</option>
          </select>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleCreate}
          >
            建立
          </button>
        </div>
        {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}
        {errorMessage && <p className="text-red-600 text-sm mt-2">{errorMessage}</p>}
      </div>

      {/* 帳號清單區塊 */}
      <table className="w-full table-auto border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">帳號</th>
            <th className="border p-2">角色</th>
            <th className="border p-2">啟用</th>
            <th className="border p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <tr key={acc.id} className="text-center">
              <td className="border p-2">{acc.id}</td>
              <td className="border p-2">{acc.username}</td>
              <td className="border p-2">
                <select
                  value={acc.role}
                  onChange={(e) => handleUpdate(acc.id, e.target.value, acc.is_active)}
                  className="border rounded px-2 py-1"
                >
                  <option value="sales">sales</option>
                  <option value="engineer">engineer</option>
                  <option value="logistics">logistics</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td className="border p-2">
                <input
                  type="checkbox"
                  checked={acc.is_active}
                  onChange={(e) => handleUpdate(acc.id, acc.role, e.target.checked)}
                />
              </td>
              <td className="border p-2">
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(acc.id)}
                >
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
