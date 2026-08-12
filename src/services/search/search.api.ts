import { clientFetch } from '@/lib/http/client-fetch';

import type { SearchResponse } from './search.types';

export const getSearchData = (q: string) => {
  return clientFetch<SearchResponse>(`/search/${q}`);
};
