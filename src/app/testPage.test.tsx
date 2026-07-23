import { render, screen } from '@testing-library/react';

import { SidebarStoreProvider } from '@/providers/sidebar-store-provider';

import TestPage from './testPage';

test('test page에서 h1 태그 잘 나오나', () => {
  render(
    <SidebarStoreProvider>
      <TestPage />
    </SidebarStoreProvider>,
  );

  const helloWorld = screen.getByText('안녕 세상아?');

  expect(helloWorld).toBeInTheDocument();
});
