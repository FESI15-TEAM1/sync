import { clientFetch } from '@/lib/http/client-fetch';

import type {
  CreatePlayroomRequest,
  CreatePlayroomResponse,
} from './playroom.types';

export const postPlayroom = (form: CreatePlayroomRequest) => {
  return clientFetch<CreatePlayroomResponse>('/playrooms', {
    method: 'POST',
    body: form,
  });
};
