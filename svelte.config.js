import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';
import siteConfig from './src/lib/config.json' with { type: 'json' };

let domain = process.env.PRIMARY_DOMAIN;
if (!domain) {
  domain = process.env.RENDER_EXTERNAL_URL;
}
console.log('Using domain:', domain);

const entries = [];

for (const l of siteConfig.lang.supportedLangs) {
  for (const p of Object.keys(siteConfig.pages)) {
    if (p != '/') {
      entries.push(`/${l}/${p}`);
    } else {
      entries.push(`/${l}`);
    }
  }
}

console.log(entries);

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter(),
    prerender: {
      entries: ['*', '/robots.txt', '/sitemap.xml', ...entries],
      origin: domain,
      handleHttpError: 'ignore',
    },
  },
};

export default config;
