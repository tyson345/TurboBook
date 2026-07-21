import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Pencil, Trash2, Filter } from 'lucide-react';
import appointmentsRaw from '../data/appointments.json';
import type { Appointment, AppointmentStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';
import { useDebounce } from '../hooks/useDebounce';
import toast from 'react-hot-toast';

const initialData = appointmentsRaw as Appointment[];

const SERVICES = ['Hair Cut & Style', 'Beard Trim', 'Color Treatment', 'Massage Therapy', 'Manicure & Pedicure', 'Facial Treatment', 'Waxing'];
const STATUSES: AppointmentStatus[] = ['confirmed', 'pending', 'cancelled'];

const empty: Omit<Appointment, 'id'> = {
  customerName: '',
  service: SERVICES[0],
  date: '',
  time: '',
  status: 'pending',
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialData);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Appointment, 'id'>>(empty);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Omit<Appointment, 'id'>, string>>>({});

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const matchSearch =
        a.customerName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        a.service.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchDate = !dateFilter || a.date === dateFilter;
      return matchSearch && matchStatus && matchDate;
    });
  }, [appointments, debouncedSearch, statusFilter, dateFilter]);

  const pagination = usePagination(filtered, 8);

  const openAdd = () => {
    setEditingId(null);
    setForm(empty);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (apt: Appointment) => {
    setEditingId(apt.id);
    setForm({ customerName: apt.customerName, service: apt.service, date: apt.date, time: apt.time, status: apt.status });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    toast.success('Appointment deleted');
  };

  const validate = () => {
    const errs: typeof formErrors = {};
    if (!form.customerName.trim()) errs.customerName = 'Required';
    if (!form.date) errs.date = 'Required';
    if (!form.time.trim()) errs.time = 'Required';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    if (editingId) {
      setAppointments((prev) => prev.map((a) => a.id === editingId ? { ...a, ...form } : a));
      toast.success('Appointment updated');
    } else {
      const newApt: Appointment = { ...form, id: `apt-${Date.now()}` };
      setAppointments((prev) => [newApt, ...prev]);
      toast.success('Appointment added');
    }
    setModalOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{appointments.length} total appointments</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-700/25 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Appointment</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or service..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 dark:text-gray-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | 'all')}
            className="py-2.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:text-gray-200"
          >
            <option value="all">All Status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="py-2.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:text-gray-200"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState title="No appointments found" description="Try a different search or filter." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {['Time', 'Customer', 'Service', 'Date', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {pagination.paginatedItems.map((apt) => (
                    <motion.tr
                      key={apt.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-5 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">{apt.time}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {apt.customerName.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{apt.customerName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{apt.service}</td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{apt.date}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={apt.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(apt)} className="p-1.5 rounded-lg text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 transition-colors">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(apt.id)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5">
              <Pagination {...pagination} onPrev={pagination.prevPage} onNext={pagination.nextPage} onGoTo={pagination.goToPage} />
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Appointment' : 'New Appointment'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Name *</label>
            <input
              value={form.customerName}
              onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
              placeholder="Enter customer name"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${formErrors.customerName ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
            />
            {formErrors.customerName && <p className="mt-1 text-xs text-red-500">{formErrors.customerName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service</label>
            <select
              value={form.service}
              onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            >
              {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${formErrors.date ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
              />
              {formErrors.date && <p className="mt-1 text-xs text-red-500">{formErrors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time *</label>
              <input
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                placeholder="e.g. 10:00 AM"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${formErrors.time ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
              />
              {formErrors.time && <p className="mt-1 text-xs text-red-500">{formErrors.time}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as AppointmentStatus }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold shadow-lg shadow-purple-700/25 transition-colors"
            >
              {editingId ? 'Update' : 'Add Appointment'}
            </motion.button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
