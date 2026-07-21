import { motion } from 'framer-motion';
import {
  Calendar,
  CalendarCheck,
  Users,
  TrendingUp,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import appointmentsData from '../data/appointments.json';
import customersData from '../data/customers.json';
import StatusBadge from '../components/StatusBadge';
import type { Appointment } from '../types';

const weeklyData = [
  { day: 'Mon', appointments: 8 },
  { day: 'Tue', appointments: 12 },
  { day: 'Wed', appointments: 7 },
  { day: 'Thu', appointments: 15 },
  { day: 'Fri', appointments: 10 },
  { day: 'Sat', appointments: 18 },
  { day: 'Sun', appointments: 5 },
];

const today = new Date().toISOString().split('T')[0];

const stats = [
  {
    label: 'Total Appointments',
    value: appointmentsData.length,
    icon: Calendar,
    color: 'from-purple-500 to-purple-700',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-700 dark:text-purple-400',
    change: '+12%',
  },
  {
    label: "Today's Appointments",
    value: appointmentsData.filter((a) => a.date === today).length,
    icon: CalendarCheck,
    color: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-700 dark:text-blue-400',
    change: '+3',
  },
  {
    label: 'Total Customers',
    value: customersData.length,
    icon: Users,
    color: 'from-emerald-500 to-emerald-700',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-700 dark:text-emerald-400',
    change: '+5%',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const recentAppointments = (appointmentsData as Appointment[]).slice(0, 6);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-card p-5 flex items-center gap-4"
          >
            <div className={`${stat.bg} rounded-xl p-3`}>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{stat.label}</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <span className="text-xs font-medium text-green-600 flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Chart */}
      <motion.div variants={item} className="bg-white dark:bg-gray-900 rounded-xl shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Weekly Appointments</h2>
            <p className="text-xs text-gray-400 mt-0.5">This week's booking overview</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={weeklyData} margin={{ top: 4, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-20" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="appointments"
              stroke="#7c3aed"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#7c3aed', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#5B21B6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Appointments */}
      <motion.div variants={item} className="bg-white dark:bg-gray-900 rounded-xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Appointments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Time</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {recentAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {apt.customerName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{apt.customerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{apt.service}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">{apt.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">{apt.time}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={apt.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
