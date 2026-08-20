import { Suspense } from 'react';

import SearchForm from '@/app/search/_components/SearchForm';
import LoadingFallback from '@/components/LoadingFallback';

export default function Search() {
  return (
    <div className="w-full overflow-x-hidden">
      <Suspense
        fallback={
          <div className="text-text-primary flex min-h-[60vh] w-full items-center justify-center font-bold">
            <LoadingFallback />
          </div>
        }
      >
        <SearchForm />
      </Suspense>
    </div>
  );
}
