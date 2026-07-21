import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Pencil, Trash2, Mail, Phone } from 'lucide-react';
import customersRaw from '../data/customers.json';
import type { Customer } from '../types';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';
import { useDebounce } from '../hooks/useDebounce';
import toast from 'react-hot-toast';

const initialData = customersRaw as Customer[];

const empty: Omit<Customer, 'id' | 'lastVisit' | 'totalAppointments'> = {
  name: '',
  phone: '',
  email: '',
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialData);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof empty, string>>>({});

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() =>
    customers.filter((c) =>
      c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.phone.includes(debouncedSearch)
    ), [customers, debouncedSearch]);

  const pagination = usePagination(filtered, 8);

  const openAdd = () => {
    setEditingId(null);
    setForm(empty);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (c: Customer) => {
    setEditingId(c.id);
    setForm({ name: c.name, phone: c.phone, email: c.email });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    toast.success('Customer deleted');
  };

  const validate = () => {
    const errs: typeof formErrors = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone.trim()) errs.phone = 'Required';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    if (editingId) {
      setCustomers((prev) => prev.map((c) => c.id === editingId ? { ...c, ...form } : c));
      toast.success('Customer updated');
    } else {
      const newC: Customer = {
        ...form,
        id: `cust-${Date.now()}`,
        lastVisit: new Date().toISOString().split('T')[0],
        totalAppointments: 0,
      };
      setCustomers((prev) => [newC, ...prev]);
      toast.success('Customer added');
    }
    setModalOpen(false);
  };

  const avatarColors = [
    'from-purple-400 to-purple-700',
    'from-blue-400 to-blue-700',
    'from-emerald-400 to-emerald-700',
    'from-rose-400 to-rose-700',
    'from-amber-400 to-amber-600',
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{customers.length} registered customers</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-700/25 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Customer</span>
        </motion.button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 dark:text-gray-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState title="No customers found" description="Try a different search term." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {['Customer', 'Phone', 'Email', 'Last Visit', 'Visits', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {pagination.paginatedItems.map((c, i) => (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                            {c.name.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                          {c.phone}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="h-3.5 w-3.5 text-gray-400" />
                          {c.email}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{c.lastVisit}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold">
                          {c.totalAppointments ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 transition-colors">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors">
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Customer' : 'Add Customer'}>
        <div className="space-y-4">
          {(['name', 'phone', 'email'] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">{field} *</label>
              <input
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                value={form[field]}
                onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                placeholder={field === 'name' ? 'Full name' : field === 'email' ? 'email@example.com' : '+1 (555) 000-0000'}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 ${formErrors[field] ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
              />
              {formErrors[field] && <p className="mt-1 text-xs text-red-500">{formErrors[field]}</p>}
            </div>
          ))}
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
              {editingId ? 'Update' : 'Add Customer'}
            </motion.button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
