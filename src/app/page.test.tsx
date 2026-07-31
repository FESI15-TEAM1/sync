import { render, screen } from '@testing-library/react';

import { SidebarStoreProvider } from '@/providers/sidebar-store-provider';

import Main from './(main)/main';

test('main 페이지 렌더링 테스트', () => {
  render(
    <SidebarStoreProvider>
      <Main />
    </SidebarStoreProvider>,
  );

  const heading = screen.getByRole('heading', {
    name: /현재 핫한 플레이룸🔥/i,
  });

  expect(heading).toBeInTheDocument();
});
