import { render, screen } from '@testing-library/react';

import { CounterStoreProvider } from '@/providers/counter-store-provider';

import Home from './page';

test('page 잘 나오나~?', () => {
  render(
    <CounterStoreProvider>
      <Home />
    </CounterStoreProvider>,
  );

  const helloWorld = screen.getByText('Hello World!!');

  expect(helloWorld).toBeInTheDocument();
});

import Bell from '@/assets/icon/bell.svg';

test('svg 확인', () => {
  console.log(Bell);
  console.log(typeof Bell);
});
