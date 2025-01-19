import siteConfig from '$lib/config.json';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (request) => {
  if (!siteConfig.lang.supportedLangs.includes(request.params.lang)) {
    const browserLang = request.request.headers.get('accept-language');
    if (browserLang && siteConfig.lang.supportedLangs.includes(browserLang)) {
      redirect(302, `/${browserLang}`);
    } else {
      redirect(302, `/${siteConfig.lang.defaultLang}`);
    }
  }

  const pData = await request.parent();
  return {
    ...pData,
    lang: request.params.lang,
  };
};
