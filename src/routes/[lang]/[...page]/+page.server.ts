import siteConfig from '$lib/config.json';
import type { PageProps } from 'accomadesc';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

const pages: Record<string, PageProps> = siteConfig.pages as Record<string, PageProps>;

export const load: PageServerLoad = async (request) => {
  const rPage = request.params.page;
  console.log('requested page', rPage);
  if (!pages[rPage]) {
    const browserLang = request.request.headers.get('accept-language');
    if (browserLang && siteConfig.lang.supportedLangs.includes(browserLang)) {
      redirect(302, `/${browserLang}`);
    } else {
      redirect(302, `/${siteConfig.lang.defaultLang}`);
    }
  }
};
