import Cookie from 'js-cookie';
import type { I18nFacade, OccuplanTranslations } from 'accomadesc';
import { dinero, toDecimal, type Dinero, type DineroSnapshot } from 'dinero.js';
import { DateTime } from 'luxon';
import siteConfig from './config.json';
import type { CookieSelection, Translation as CookieTranslation } from 'gdpr-cooco-banner';

import * as Sqrl from 'squirrelly';

interface FullTranslation {
  calendar: OccuplanTranslations;
  cookies: CookieTranslation;
  site: Record<string, string>;
}

const fullTranslations: Record<string, FullTranslation> = siteConfig.lang.translations as Record<
  string,
  FullTranslation
>;

const calendarTranslations: Record<string, OccuplanTranslations> = {};
const cookieTranslations: Record<string, CookieTranslation> = {};
const siteTranslations: Record<string, Record<string, string>> = {};

const formats = siteConfig.lang.formats;

for (const lang in fullTranslations) {
  calendarTranslations[lang] = fullTranslations[lang].calendar;
  siteTranslations[lang] = fullTranslations[lang].site;
  cookieTranslations[lang] = fullTranslations[lang].cookies;
}

export class SiteState implements I18nFacade {
  supportedLangs: string[] = $state(['en']);
  isMenuOpen = $state(false);
  cookieSelection: CookieSelection = $state({
    analytics: false,
    marketing: false,
    preferences: false,
    necessary: true,
  });
  currentLang: string = $state('en');
  translations: Record<string, Record<string, string>> = $state(siteTranslations);

  calendarTranslations: Record<string, OccuplanTranslations> = $state(calendarTranslations);
  calendarTranslation: OccuplanTranslations = $derived(calendarTranslations[this.currentLang]);

  cookieTranslations: Record<string, CookieTranslation> = $state(cookieTranslations);
  cookieTranslation: CookieTranslation = $state(cookieTranslations[this.currentLang]);

  formats: Record<string, Record<string, any>> = $state(formats);

  constructor(lang: string) {
    this.currentLang = lang;

    if (this.cookieSelection) {
      this.handleCookie();
    }

    this.supportedLangs = siteConfig.lang.supportedLangs;
    this.setFilters();
  }

  public handleCookie = () => {
    if (this.cookieSelection.preferences) {
      const expires = new Date();
      expires.setDate(expires.getDate() + 365);

      Cookie.set('lang', this.currentLang, {
        sameSite: 'strict',
        path: '/',
        expires,
      });
    } else {
      Cookie.remove('lang');
    }
  };

  public updateCurrentLang = (lang: string) => (this.currentLang = lang);

  public translateFunc = (ref: string): string => {
    if (!ref) return 'UNDEF';

    const current = this.translations[this.currentLang];
    if (!current[ref]) return ref;

    return this.translations[this.currentLang][ref];
  };

  public formatFunc = (ref: string, props: Record<string, any>): string => {
    if (!this.formats[this.currentLang][ref]) {
      console.log('missing formatFunc', ref);
      return '';
    } else {
      return this.formats[this.currentLang][ref](props);
    }
  };

  public isDinero(d: Dinero<number> | DineroSnapshot<number>): d is Dinero<number> {
    if ('calculator' in d) {
      return true;
    } else {
      return false;
    }
  }

  public formatMoneyFunc = (d: Dinero<number> | DineroSnapshot<number>): string => {
    if (!this.isDinero(d)) d = dinero(d);
    return toDecimal(d, ({ value, currency }) => `${value} ${currency.code}`);
  };

  public formatDateFunc = (d: string | DateTime<boolean>): string => {
    if (typeof d === 'string') {
      d = DateTime.fromISO(d);
    }
    return d.toFormat('d. MMMM yy');
  };

  setFilters = () => {
    Sqrl.filters.define('date', (str) => {
      return this.formatDateFunc(str);
    });
    Sqrl.filters.define('money', (str) => {
      return this.formatMoneyFunc(str);
    });
  };
}
