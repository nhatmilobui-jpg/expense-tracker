import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, PieChartIcon, Calendar } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function Reports() {
  const { user } = useAuth();
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [year, setYear] = useState(2026);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      api.get(`/api/reports/category-distribution/${user.userId}`),
      api.get(`/api/reports/monthly-comparison/${user.userId}?year=${year}`),
    ]).then(([catRes, monthRes]) => {
      setCategoryData(catRes.data.map(d => ({ name: d.name, value: Number(d.value) })));
      setMonthlyData(monthRes.data.map(d => ({
        month: `T${Number(d.month)}`,
        total: Number(d.total),
      })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, year]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Báo cáo & Thống kê</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="text-primary" size={20} />
            <h2 className="text-lg font-semibold text-text">Phân bổ chi tiêu theo danh mục</h2>
          </div>
          {categoryData.length === 0 ? (
            <p className="text-center text-text-secondary py-10">Chưa có dữ liệu</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${Number(value).toLocaleString('vi-VN')} ₫`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-primary" size={20} />
              <h2 className="text-lg font-semibold text-text">So sánh chi tiêu theo tháng</h2>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-text-secondary" />
              <select
                value={year}
                onChange={e => setYear(Number(e.target.value))}
                className="border border-border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                {[2024, 2025, 2026, 2027].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          {monthlyData.length === 0 ? (
            <p className="text-center text-text-secondary py-10">Chưa có dữ liệu</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value) => `${Number(value).toLocaleString('vi-VN')} ₫`} />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
