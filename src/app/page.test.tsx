import Home from './page';
import { CounterStoreProvider } from '@/providers/counter-store-provider';
import { render, screen } from '@testing-library/react';

test('page 잘 나오나~?', () => {
  render(
    <CounterStoreProvider>
      <Home />
    </CounterStoreProvider>,
  );

  const helloWorld = screen.getByText('Hello World!!');

  expect(helloWorld).toBeInTheDocument();
});
