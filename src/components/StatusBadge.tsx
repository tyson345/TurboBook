import type { AppointmentStatus } from '../types';

interface StatusBadgeProps {
  status: AppointmentStatus;
}

const config: Record<AppointmentStatus, { label: string; classes: string }> = {
  confirmed: {
    label: 'Confirmed',
    classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  pending: {
    label: 'Pending',
    classes: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  cancelled: {
    label: 'Cancelled',
    classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, classes } = config[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${classes}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {label}
    </span>
  );
}
