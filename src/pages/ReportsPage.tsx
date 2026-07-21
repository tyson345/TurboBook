import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const monthlyData = [
  { month: 'Jan', appointments: 45 },
  { month: 'Feb', appointments: 52 },
  { month: 'Mar', appointments: 61 },
  { month: 'Apr', appointments: 48 },
  { month: 'May', appointments: 70 },
  { month: 'Jun', appointments: 63 },
  { month: 'Jul', appointments: 55 },
];

const serviceData = [
  { name: 'Hair Cut & Style', value: 35, color: '#7c3aed' },
  { name: 'Color Treatment', value: 20, color: '#3b82f6' },
  { name: 'Massage Therapy', value: 18, color: '#10b981' },
  { name: 'Manicure & Pedicure', value: 15, color: '#f59e0b' },
  { name: 'Other', value: 12, color: '#ec4899' },
];

export default function ReportsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Business insights and analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">Monthly Appointments</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-20" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: '12px' }}
              />
              <Bar dataKey="appointments" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">Services Distribution</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {serviceData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: '12px' }}
              />
              <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: 12, color: '#6b7280' }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
