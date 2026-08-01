import { setupServer } from 'msw/node';

import { handlers } from './handlers';

export const server = setupServer(...handlers);

server.events.on('request:start', ({ request }) => {
  console.log('[MSW:node] intercepted', request.method, request.url);
});
server.events.on('request:unhandled', ({ request }) => {
  console.log('[MSW:node] unhandled (passthrough)', request.method, request.url);
});
