<script lang="ts">
  import { page } from '$app/state';
  import siteConfig from '$lib/config.json';
  import { setContext, type Snippet } from 'svelte';
  import { Banner, type CookieType } from 'gdpr-cooco-banner';
  import { SiteState, type SupportedLang } from '$lib/state.svelte';
  import { browser } from '$app/environment';

  let {
    children,
  }: {
    children?: Snippet;
  } = $props();

  let browserLang: string | null = null;
  if (browser) {
    browserLang = navigator.language;
    console.log(browserLang);
  }

  let pathLang = $page.params['lang'];
  if (!pathLang) pathLang = browserLang ?? translations.defaultLang;
  if (!translations.supportedLangs.includes(pathLang))
    pathLang = translations.defaultLang;

  const ss = new SiteState(pathLang as SupportedLang);
  setContext('SITE_STATE', ss);

  $effect(() => {
    let langParam = $page.params['lang'];
    if (!langParam) langParam = browserLang ?? translations.defaultLang;
    if (!translations.supportedLangs.includes(langParam))
      langParam = translations.defaultLang;

    ss.currentLang = langParam as SupportedLang;

    if (document) {
      document.documentElement.lang = ss.currentLang;
    }
  });

  const analyticsCookies = (e: CustomEvent) => {
    ss.cookieSelection.analytics = e.detail.enabled;
  };
  const preferenceCookies = (e: CustomEvent) => {
    ss.cookieSelection = e.detail.enabled;
  };
  const marketingCookies = (e: CustomEvent) => {
    ss.cookieSelection.marketing = e.detail.enabled;
  };
</script>

<svelte:head>
  <meta
    name="description"
    content="ACCOMADE powered website to present holiday accomodations."
  />
</svelte:head>

{@render children?.()}

<Banner
  on:analytics={analyticsCookies}
  on:preferences={preferenceCookies}
  on:marketing={marketingCookies}
  showEditIcon={cookies.showIcon}
  translation={ss.cookiesTranslation}
  choices={cookies.types as CookieType[]}
/>

<style>
  :global(body, html) {
    padding: 0;
    margin: 0;
    background-color: var(--main-bg-color, 'white');
    color: var(--main-font-color, 'black');
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
</style>
