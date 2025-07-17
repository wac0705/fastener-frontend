import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Account {
  id: number;
  username: string;
  role: string;
  is_active: boolean;
}

export default function ManageAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('sales');
  const [message, setMessage] = useState('');

  const fetchAccounts = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/manage-accounts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAccounts(data);
  };

  const handleCreate = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/manage-accounts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole }),
    });
    if (res.ok) {
      setMessage('✅ 帳號建立成功');
      setNewUsername('');
      setNewPassword('');
      fetchAccounts();
    } else {
      setMessage('❌ 建立失敗');
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">帳號管理（Admin）</h1>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-4">
            <Input placeholder="帳號名稱" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
            <Input placeholder="密碼" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">admin</SelectItem>
                <SelectItem value="sales">sales</SelectItem>
                <SelectItem value="engineer">engineer</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCreate}>新增</Button>
          </div>
          {message && <div className="text-sm text-muted-foreground">{message}</div>}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <table className="w-full table-auto border-t">
            <thead>
              <tr className="text-left text-sm text-muted-foreground">
                <th className="py-2 px-2">ID</th>
                <th className="py-2 px-2">帳號</th>
                <th className="py-2 px-2">角色</th>
                <th className="py-2 px-2">啟用</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id} className="border-t">
                  <td className="py-2 px-2">{account.id}</td>
                  <td className="py-2 px-2">{account.username}</td>
                  <td className="py-2 px-2 capitalize">{account.role}</td>
                  <td className="py-2 px-2">
                    <Checkbox checked={account.is_active} disabled />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
