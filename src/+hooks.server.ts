import type { Handle } from '@sveltejs/kit';

export const handle: Handle = ({ event, resolve }) => {
  let lang = event.params['lang'];
  if (!lang) lang = 'en';

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', lang),
  });
};
