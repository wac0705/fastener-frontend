// pages/manage-accounts.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ManageAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('sales');
  const [error, setError] = useState('');
  const router = useRouter();

  // ✅ 預先檢查 JWT 權限與身份
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || localStorage.getItem('role') !== 'admin') {
      router.push('/login');
      return;
    }
    fetchAccounts();
  }, []);

  // ✅ 取得使用者清單
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
    if (res.ok) {
      setNewUsername('');
      setNewPassword('');
      setNewRole('sales');
      fetchAccounts();
    } else {
      const err = await res.json();
      setError(err.error || '新增失敗');
    }
  };

  // ✅ 更新角色與啟用狀態
  const handleUpdate = async (id, role, isActive) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`https://fastener-api.zeabur.app/api/manage-accounts/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role, is_active: isActive })
    });
    if (res.ok) fetchAccounts();
  };

  // ✅ 刪除帳號
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`https://fastener-api.zeabur.app/api/manage-accounts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchAccounts();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">帳號管理（admin）</h1>

      {/* 🔼 新增帳號 */}
      <div className="mb-6">
        <h2 className="font-semibold">新增帳號</h2>
        <input className="border px-2 py-1 mr-2" placeholder="帳號"
          value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
        <input className="border px-2 py-1 mr-2" placeholder="密碼" type="password"
          value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="border px-2 py-1 mr-2">
          <option value="sales">sales</option>
          <option value="engineer">engineer</option>
          <option value="logistics">logistics</option>
          <option value="admin">admin</option>
        </select>
        <button className="bg-blue-500 text-white px-3 py-1" onClick={handleCreate}>建立</button>
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {/* 👤 帳號清單 */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">帳號</th>
            <th className="border p-2">角色</th>
            <th className="border p-2">啟用</th>
            <th className="border p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(acc => (
            <tr key={acc.id}>
              <td className="border p-2">{acc.id}</td>
              <td className="border p-2">{acc.username}</td>
              <td className="border p-2">
                <select value={acc.role} onChange={(e) =>
                  handleUpdate(acc.id, e.target.value, acc.is_active)}>
                  <option value="sales">sales</option>
                  <option value="engineer">engineer</option>
                  <option value="logistics">logistics</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td className="border p-2">
                <input type="checkbox" checked={acc.is_active}
                  onChange={(e) => handleUpdate(acc.id, acc.role, e.target.checked)} />
              </td>
              <td className="border p-2">
                <button className="text-red-600" onClick={() => handleDelete(acc.id)}>刪除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
