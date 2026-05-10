import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { ArrowLeft, Save } from 'lucide-react';

export default function TransactionForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    note: '',
    transactionDate: new Date().toISOString().split('T')[0],
    category: { categoryId: '' },
    user: { userId: user?.userId },
  });

  useEffect(() => {
    api.get('/api/transactions/categories').then(res => {
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    if (isEdit && location.state?.transaction) {
      const t = location.state.transaction;
      setForm({
        amount: t.amount,
        note: t.note || '',
        transactionDate: t.transactionDate,
        category: { categoryId: t.category?.categoryId || '' },
        user: { userId: t.user?.userId || user?.userId },
      });
    }
  }, [isEdit, location.state, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'categoryId') {
      setForm(prev => ({ ...prev, category: { categoryId: Number(value) } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
        user: { userId: user.userId },
      };
      if (isEdit) {
        await api.put(`/api/transactions/${id}`, payload);
      } else {
        await api.post('/api/transactions', payload);
      }
      navigate('/');
    } catch {
      alert('Lưu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-text-secondary hover:text-text hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-text">
          {isEdit ? 'Sửa giao dịch' : 'Thêm giao dịch'}
        </h1>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Loại giao dịch</label>
            <select
              name="categoryId"
              value={form.category.categoryId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
            >
              <option value="">Chọn danh mục</option>
              {categories.map(c => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName} ({c.type === 'INCOME' ? 'Thu' : 'Chi'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Số tiền</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="Nhập số tiền"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Ngày giao dịch</label>
            <input
              type="date"
              name="transactionDate"
              value={form.transactionDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Ghi chú</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
              placeholder="Nhập ghi chú (tùy chọn)"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-2.5 border border-border rounded-lg font-medium text-text-secondary hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
