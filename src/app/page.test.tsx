import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { QueryProvider } from '@/providers/query-provider';
import { SidebarStoreProvider } from '@/providers/sidebar-store-provider';

import Main from './(main)/main';

test('main 페이지 렌더링 테스트', () => {
  render(
    <QueryProvider>
      <SidebarStoreProvider>
        <Main />
      </SidebarStoreProvider>
    </QueryProvider>,
  );

  const heading = screen.getByRole('heading', {
    name: /현재 핫한 플레이룸🔥/i,
  });

  expect(heading).toBeInTheDocument();
});
