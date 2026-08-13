import { useQuery } from '@tanstack/react-query';

import { getSearchData } from '@/services/search/search.api';

export function useGetSearchDataQuery({ q }: { q: string | null }) {
  return useQuery({
    queryKey: ['searchData', q],
    queryFn: () => getSearchData(q as string),
    enabled: q !== null && q !== '',
  });
}
// 추후 에러메세지 띄워줘야될듯
