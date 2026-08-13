import { Suspense } from 'react';

import SearchForm from '@/app/search/_components/SearchForm';

export default function Search() {
  return (
    <div className="w-full overflow-x-hidden">
      <Suspense
        fallback={
          <div className="text-text-primary flex min-h-[60vh] w-full items-center justify-center font-bold">
            로딩중..
          </div>
        }
      >
        <SearchForm />
      </Suspense>
    </div>
  );
}
