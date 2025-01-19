import siteConfig from '$lib/config.json';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (request) => {
  const browserLang = request.request.headers.get('accept-language');
  if (browserLang && siteConfig.lang.supportedLangs.includes(browserLang)) {
    redirect(302, `/${browserLang}`);
  } else {
    redirect(302, `/${siteConfig.lang.defaultLang}`);
  }
};
