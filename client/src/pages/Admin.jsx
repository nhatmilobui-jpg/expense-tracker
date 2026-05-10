import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import { Users, Trash2, Tag, TrendingUp } from 'lucide-react';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ categoryName: '', type: 'EXPENSE' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    Promise.all([
      api.get('/api/admin/users'),
      api.get('/api/admin/stats'),
      api.get('/api/transactions/categories'),
    ]).then(([uRes, sRes, cRes]) => {
      setUsers(uRes.data);
      setStats(sRes.data);
      setCategories(cRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Xóa tài khoản này?')) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u.userId !== id));
    } catch {
      alert('Xóa thất bại');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/categories', newCategory);
      setNewCategory({ categoryName: '', type: 'EXPENSE' });
      fetchData();
    } catch {
      alert('Thêm danh mục thất bại');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Quản trị hệ thống</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Người dùng</p>
              <p className="text-xl font-bold text-text">{users.length}</p>
            </div>
          </div>
        </div>

        {stats.map((s, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-sm text-text-secondary">
                  {s.type === 'INCOME' ? 'Tổng thu toàn hệ thống' : 'Tổng chi toàn hệ thống'}
                </p>
                <p className="text-xl font-bold text-text">
                  {Number(s.total).toLocaleString('vi-VN')} ₫
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Users size={18} className="text-primary" />
          <h2 className="text-lg font-semibold text-text">Danh sách người dùng</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">ID</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Tên đăng nhập</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Họ tên</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Vai trò</th>
                <th className="text-center px-4 py-3 font-medium text-text-secondary">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                    Không có người dùng
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.userId} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-text">{u.userId}</td>
                    <td className="px-4 py-3 text-text">{u.username}</td>
                    <td className="px-4 py-3 text-text">{u.fullName || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-text-secondary">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeleteUser(u.userId)}
                        className="p-1.5 text-text-secondary hover:text-danger hover:bg-red-50 rounded-lg transition-colors mx-auto block"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <Tag size={18} className="text-primary" />
          <h2 className="text-lg font-semibold text-text">Thêm danh mục mặc định</h2>
        </div>
        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newCategory.categoryName}
            onChange={e => setNewCategory(prev => ({ ...prev, categoryName: e.target.value }))}
            required
            placeholder="Tên danh mục"
            className="flex-1 px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
          <select
            value={newCategory.type}
            onChange={e => setNewCategory(prev => ({ ...prev, type: e.target.value }))}
            className="px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
          >
            <option value="EXPENSE">Chi tiêu</option>
            <option value="INCOME">Thu nhập</option>
          </select>
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Thêm danh mục
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.filter(c => c.default).map(c => (
            <span
              key={c.categoryId}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                c.type === 'INCOME'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {c.categoryName}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
