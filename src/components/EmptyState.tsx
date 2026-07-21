import { FileSearch } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'No results found',
  description = 'Try adjusting your search or filters.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-purple-50 dark:bg-purple-900/20 p-5">
        {icon ?? <FileSearch className="h-10 w-10 text-purple-400" />}
      </div>
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</p>
      <p className="mt-1 text-sm text-gray-400">{description}</p>
    </div>
  );
}
