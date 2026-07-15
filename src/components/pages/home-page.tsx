// src/components/pages/home-page.tsx
// Zustand count app example
'use client';

import { useCounterStore } from '@/providers/counter-store-provider';

export const HomePage = () => {
  const { count, incrementCount, decrementCount } = useCounterStore(
    (state) => state,
  );

  return (
    <div>
      Count: {count}
      <hr />
      <button type="button" onClick={incrementCount}>
        Increment Count
      </button>
      <button type="button" onClick={decrementCount}>
        Decrement Count
      </button>
    </div>
  );
};
