import type { SiteState } from 'accomadesc';
import Cookie from 'js-cookie';

export const handleCookie = (ss: SiteState) => {
  if (ss.cookieSelection.preferences) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 365);

    Cookie.set('lang', ss.currentLang, {
      sameSite: 'strict',
      path: '/',
      expires,
    });
  } else {
    Cookie.remove('lang');
  }
};


