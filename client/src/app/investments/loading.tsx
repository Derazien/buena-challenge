import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <LoadingSpinner size="large" text="Loading investments..." />
    </div>
  );
} 