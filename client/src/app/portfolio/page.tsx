'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function PortfolioRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/investments');
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
      <LoadingSpinner text="Redirecting to the new Investments page..." />
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        The Re-Investment page has been integrated into our new unified Investments page.
      </p>
    </div>
  );
}