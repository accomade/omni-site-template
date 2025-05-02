<script lang="ts">
  import { page } from '$app/state';
  import { onMount, setContext, type Snippet } from 'svelte';
  import { Banner, type CookieType } from 'gdpr-cooco-banner';
  import { SiteState } from '$lib/state.svelte';
  import siteConfig from '$lib/config.json' with { type: 'json' };
  import { browser } from '$app/environment';

  let {
    children,
  }: {
    children?: Snippet;
  } = $props();

  let browserLang;
  if (browser) {
    browserLang = navigator.language;
  }
  let pathLang = page.params['lang'];
  if (!pathLang) pathLang = siteConfig.lang.defaultLang;
  if (!pathLang && browserLang) pathLang = browserLang;
  if (!siteConfig.lang.supportedLangs.includes(pathLang)) {
    pathLang = siteConfig.lang.defaultLang;
  }

  const ss = new SiteState(pathLang);
  setContext('SITE_STATE', ss);

  $effect(() => {
    let langParam = page.params['lang'];
    if (!langParam) langParam = siteConfig.lang.defaultLang;
    if (!siteConfig.lang.supportedLangs.includes(langParam))
      langParam = siteConfig.lang.defaultLang;

    ss.currentLang = langParam;
    if (document) {
      document.documentElement.lang = ss.currentLang;
    }
  });

  onMount(() => {
    if (window) {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
      if (prefersDarkMode && !ss.selectedThemeInitialized) {
        ss.selectedTheme = 'dark';
        ss.selectedThemeInitialized = true;
      }
    }
  });

  const analyticsCookies = (enabled: boolean) => {
    ss.cookieSelection.analytics = enabled;
  };
  const preferenceCookies = (enabled: boolean) => {
    ss.cookieSelection.preferences = enabled;
  };
  const marketingCookies = (enabled: boolean) => {
    ss.cookieSelection.marketing = enabled;
  };
</script>

<svelte:head>
  <meta name="description" content="ACCOMADE powered website to present holiday accomodations." />
</svelte:head>

{@render children?.()}

<Banner
  analytics={analyticsCookies}
  preferences={preferenceCookies}
  marketing={marketingCookies}
  showEditIcon={siteConfig.cookies.showIcon}
  translation={ss.cookieTranslation}
  choices={siteConfig.cookies.types as CookieType[]}
/>
