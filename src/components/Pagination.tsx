import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (page: number) => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onGoTo,
  hasPrev,
  hasNext,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between px-2 py-3 mt-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-purple-50 hover:text-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors dark:hover:bg-purple-900/20 dark:hover:text-purple-400"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.slice(0, 5).map((p) => (
          <button
            key={p}
            onClick={() => onGoTo(p)}
            className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
              p === currentPage
                ? 'bg-purple-700 text-white'
                : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700 dark:text-gray-400 dark:hover:bg-purple-900/20 dark:hover:text-purple-400'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-purple-50 hover:text-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors dark:hover:bg-purple-900/20 dark:hover:text-purple-400"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
