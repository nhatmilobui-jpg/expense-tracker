import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get(`/api/transactions/user/${user.userId}`),
      api.get('/api/transactions/categories'),
    ]).then(([txRes, catRes]) => {
      setTransactions(txRes.data);
      setCategories(catRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.categoryId === catId);
    return cat ? cat.categoryName : 'Không xác định';
  };

  const getCategoryType = (catId) => {
    const cat = categories.find(c => c.categoryId === catId);
    return cat ? cat.type : 'EXPENSE';
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa giao dịch này?')) return;
    try {
      await api.delete(`/api/transactions/${id}`);
      setTransactions(prev => prev.filter(t => t.transactionId !== id));
    } catch {
      alert('Xóa thất bại');
    }
  };

  const filtered = filter === 'ALL'
    ? transactions
    : transactions.filter(t => getCategoryType(t.category?.categoryId) === filter);

  const totalIncome = filtered
    .filter(t => getCategoryType(t.category?.categoryId) === 'INCOME')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = filtered
    .filter(t => getCategoryType(t.category?.categoryId) === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Tổng quan</h1>
        <Link
          to="/add"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          Thêm giao dịch
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-emerald-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Tổng thu nhập</p>
              <p className="text-xl font-bold text-emerald-600">
                {totalIncome.toLocaleString('vi-VN')} ₫
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Tổng chi tiêu</p>
              <p className="text-xl font-bold text-red-600">
                {totalExpense.toLocaleString('vi-VN')} ₫
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wallet className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Số dư</p>
              <p className={`text-xl font-bold ${balance >= 0 ? 'text-primary' : 'text-red-600'}`}>
                {balance.toLocaleString('vi-VN')} ₫
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {['ALL', 'INCOME', 'EXPENSE'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-card border border-border text-text-secondary hover:text-text'
            }`}
          >
            {f === 'ALL' ? 'Tất cả' : f === 'INCOME' ? 'Thu nhập' : 'Chi tiêu'}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Ngày</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Danh mục</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Ghi chú</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">Số tiền</th>
                <th className="text-center px-4 py-3 font-medium text-text-secondary">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                    Chưa có giao dịch nào
                  </td>
                </tr>
              ) : (
                filtered.map(t => {
                  const isIncome = getCategoryType(t.category?.categoryId) === 'INCOME';
                  return (
                    <tr key={t.transactionId} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-text">
                        {t.transactionDate ? new Date(t.transactionDate).toLocaleDateString('vi-VN') : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          isIncome
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {getCategoryName(t.category?.categoryId)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{t.note || '-'}</td>
                      <td className={`px-4 py-3 text-right font-medium ${isIncome ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isIncome ? '+' : '-'}{Number(t.amount).toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/edit/${t.transactionId}`}
                            state={{ transaction: t }}
                            className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(t.transactionId)}
                            className="p-1.5 text-text-secondary hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
